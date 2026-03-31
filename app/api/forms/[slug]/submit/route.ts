import { NextResponse } from "next/server";
import { sendGraphMail } from "@/lib/graph";
import { prisma } from "@/lib/prisma";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildSubmissionSummary = (
  values: Array<{ label: string; value: string }>,
) => {
  const htmlList = values
    .map(
      (entry) =>
        `<li><strong>${escapeHtml(entry.label)}:</strong> ${escapeHtml(entry.value || "-")}</li>`,
    )
    .join("");

  const textList = values
    .map((entry) => `${entry.label}: ${entry.value || "-"}`)
    .join("\n");

  return { htmlList, textList };
};

const buildAcknowledgementEmail = ({
  formName,
  submitterName,
  successMessage,
}: {
  formName: string;
  submitterName?: string;
  successMessage: string;
}) => {
  const greeting = submitterName ? `Hi ${escapeHtml(submitterName)},` : "Hi,";
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <p>${greeting}</p>
      <p>Thanks for contacting Pryceless Venture.</p>
      <p>We received your <strong>${escapeHtml(formName)}</strong> submission.</p>
      <p>${escapeHtml(successMessage)}</p>
      <p>This email was sent from our server mailbox. If you need to add anything, reply to this message.</p>
    </div>
  `;
  const text = [
    submitterName ? `Hi ${submitterName},` : "Hi,",
    "",
    "Thanks for contacting Pryceless Venture.",
    `We received your ${formName} submission.`,
    successMessage,
    "This email was sent from our server mailbox. If you need to add anything, reply to this message.",
  ].join("\n");

  return {
    subject: `We received your ${formName} submission`,
    html,
    text,
  };
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const payload = (await request.json()) as {
    sourcePath?: string;
    values?: Record<string, string>;
  };

  const formDefinition = await prisma.formDefinition.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      fields: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!formDefinition) {
    return NextResponse.json({ error: "Form not found." }, { status: 404 });
  }

  const values = payload.values ?? {};
  const parsedData: Record<string, string> = {};

  for (const field of formDefinition.fields) {
    const rawValue = String(values[field.fieldKey] ?? "").trim();
    if (field.required && !rawValue) {
      return NextResponse.json(
        { error: `${field.label} is required.` },
        { status: 400 },
      );
    }

    if (field.type === "EMAIL" && rawValue) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(rawValue)) {
        return NextResponse.json(
          { error: `${field.label} must be a valid email.` },
          { status: 400 },
        );
      }
    }

    parsedData[field.fieldKey] = rawValue;
  }

  const detectedEmailField = formDefinition.fields.find((field) => field.type === "EMAIL");
  const detectedPhoneField = formDefinition.fields.find((field) => field.type === "PHONE");
  const detectedNameField = formDefinition.fields.find((field) =>
    /(^name$|full_?name|contact_?name|first_?name)/i.test(field.fieldKey),
  );

  const submitterName =
    parsedData.name ||
    parsedData.full_name ||
    parsedData.contact_name ||
    (detectedNameField ? parsedData[detectedNameField.fieldKey] : undefined) ||
    undefined;
  const submitterEmail =
    parsedData.email ||
    parsedData.contact_email ||
    (detectedEmailField ? parsedData[detectedEmailField.fieldKey] : undefined) ||
    undefined;
  const submitterPhone =
    parsedData.phone ||
    parsedData.contact_phone ||
    (detectedPhoneField ? parsedData[detectedPhoneField.fieldKey] : undefined) ||
    undefined;

  const submission = await prisma.formSubmission.create({
    data: {
      formDefinitionId: formDefinition.id,
      submitterName,
      submitterEmail,
      submitterPhone,
      sourcePath: payload.sourcePath,
      submissionEmailStatus:
        formDefinition.destination === "CRM" && !submitterEmail ? "SKIPPED" : "PENDING",
      values: {
        create: formDefinition.fields.map((field, index) => ({
          label: field.label,
          value: parsedData[field.fieldKey] || "",
          sortOrder: index,
        })),
      },
    },
    include: {
      values: true,
    },
  });

  const shouldSendNotification = formDefinition.destination !== "CRM";
  const shouldSendAcknowledgement = Boolean(submitterEmail);

  if (shouldSendNotification || shouldSendAcknowledgement) {
    const { htmlList, textList } = buildSubmissionSummary(submission.values);
    const emailJobs: Array<Promise<void>> = [];
    const emailErrors: string[] = [];

    if (shouldSendNotification) {
      emailJobs.push(
        sendGraphMail({
          subject: `New ${formDefinition.formName} submission`,
          html: `<h2>${escapeHtml(formDefinition.formName)}</h2><ul>${htmlList}</ul>`,
          text: textList,
        }).catch((error) => {
          emailErrors.push(
            `Notification email failed: ${
              error instanceof Error ? error.message : "Unknown email error"
            }`,
          );
        }),
      );
    }

    if (shouldSendAcknowledgement && submitterEmail) {
      const acknowledgementEmail = buildAcknowledgementEmail({
        formName: formDefinition.formName,
        submitterName,
        successMessage: formDefinition.successMessage,
      });

      emailJobs.push(
        sendGraphMail({
          ...acknowledgementEmail,
          to: [submitterEmail],
        }).catch((error) => {
          emailErrors.push(
            `Acknowledgement email failed: ${
              error instanceof Error ? error.message : "Unknown email error"
            }`,
          );
        }),
      );
    }

    await Promise.all(emailJobs);

    await prisma.formSubmission.update({
      where: { id: submission.id },
      data: {
        submissionEmailStatus: emailErrors.length ? "FAILED" : "SENT",
        emailError: emailErrors.length ? emailErrors.join("\n\n") : null,
      },
    });
  }

  return NextResponse.json({
    success: true,
    message: formDefinition.successMessage,
  });
}
