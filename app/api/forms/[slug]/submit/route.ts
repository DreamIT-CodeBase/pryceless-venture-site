import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import { sendGraphMail } from "@/lib/graph";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const footerLogoCid = "pryceless-ventures-footer-logo";
let footerLogoContentBytesPromise: Promise<string> | null = null;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatTextValue = (value: string | null | undefined) => {
  const normalized = String(value ?? "").trim();
  return normalized || "-";
};

const formatHtmlValue = (value: string | null | undefined) => {
  const normalized = formatTextValue(value);
  return normalized === "-"
    ? `<span style="color:#94a3b8">-</span>`
    : escapeHtml(normalized).replace(/\n/g, "<br />");
};

const formatSubmittedAt = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);

const getFooterLogoAttachment = async () => {
  if (!footerLogoContentBytesPromise) {
    const footerLogoPath = path.join(process.cwd(), "app", "assets", "pvwhite.png");
    footerLogoContentBytesPromise = readFile(footerLogoPath).then((file) =>
      file.toString("base64"),
    );
  }

  const contentBytes = await footerLogoContentBytesPromise;

  return {
    contentBytes,
    contentId: footerLogoCid,
    contentType: "image/png",
    isInline: true,
    name: "pryceless-ventures-footer-logo.png",
  };
};

const buildMailFooter = ({
  note,
}: {
  note: string;
}) => `
  <div style="padding:22px 32px 30px;border-top:1px solid #e2e8f0;background:#102538;text-align:center;">
    <img
      alt="Pryceless Ventures"
      src="cid:${footerLogoCid}"
      style="display:block;height:auto;width:176px;max-width:100%;margin:0 auto 16px;"
    />
    <p style="margin:0 auto;max-width:480px;font-size:13px;line-height:1.8;color:rgba(255,255,255,0.78);">
      ${escapeHtml(note)}
    </p>
  </div>
`;

const buildNotificationEmail = ({
  formName,
  submittedAt,
  sourcePath,
  submitterName,
  submitterEmail,
  submitterPhone,
  values,
}: {
  formName: string;
  submittedAt: Date;
  sourcePath?: string | null;
  submitterName?: string;
  submitterEmail?: string;
  submitterPhone?: string;
  values: Array<{ label: string; value: string }>;
}) => {
  const submittedAtDisplay = formatSubmittedAt(submittedAt);
  const headerTitle = `New ${formName} submission`;
  const headerSubtitle = submitterName
    ? `${submitterName} just submitted the ${formName} form.`
    : `A new ${formName} form has been submitted.`;
  const summaryRows = [
    { label: "Submitted", value: submittedAtDisplay },
    { label: "Source page", value: formatTextValue(sourcePath) },
  ];
  const contactRows = [
    { label: "Name", value: formatTextValue(submitterName) },
    { label: "Email", value: formatTextValue(submitterEmail) },
    { label: "Phone", value: formatTextValue(submitterPhone) },
  ];
  const summaryTableRows = summaryRows
    .map(
      (entry) =>
        `<tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;width:170px;font-size:13px;font-weight:700;color:#334155;background:#f8fafc;">${escapeHtml(entry.label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;line-height:1.6;color:#0f172a;background:#ffffff;">${formatHtmlValue(entry.value)}</td>
        </tr>`,
    )
    .join("");
  const contactTableRows = contactRows
    .map(
      (entry) =>
        `<tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;width:170px;font-size:13px;font-weight:700;color:#334155;background:#f8fafc;">${escapeHtml(entry.label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;line-height:1.6;color:#0f172a;background:#ffffff;">${formatHtmlValue(entry.value)}</td>
        </tr>`,
    )
    .join("");
  const fieldTableRows = values
    .map(
      (entry) =>
        `<tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;width:200px;font-size:13px;font-weight:700;color:#334155;background:#f8fafc;vertical-align:top;">${escapeHtml(entry.label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;line-height:1.7;color:#0f172a;background:#ffffff;vertical-align:top;">${formatHtmlValue(entry.value)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="margin:0;padding:32px 16px;background:#eef3f8;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;">
        <div style="overflow:hidden;border:1px solid #dbe5f0;border-radius:24px;background:#ffffff;box-shadow:0 18px 50px rgba(15,23,42,0.08);">
          <div style="padding:28px 32px;background:#11283e;">
            <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#bf9375;">Pryceless Ventures</p>
            <h1 style="margin:0;font-size:34px;line-height:1.15;color:#ffffff;">${escapeHtml(headerTitle)}</h1>
            <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.82);">${escapeHtml(headerSubtitle)}</p>
          </div>

          <div style="padding:28px 32px 10px;">
            <div style="margin-bottom:24px;">
              <h2 style="margin:0 0 12px;font-size:18px;line-height:1.3;color:#0f172a;">Submission summary</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
                ${summaryTableRows}
              </table>
            </div>

            <div style="margin-bottom:24px;">
              <h2 style="margin:0 0 12px;font-size:18px;line-height:1.3;color:#0f172a;">Contact details</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
                ${contactTableRows}
              </table>
            </div>

            <div style="margin-bottom:24px;">
              <h2 style="margin:0 0 12px;font-size:18px;line-height:1.3;color:#0f172a;">Submitted responses</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
                ${fieldTableRows}
              </table>
            </div>
          </div>

          ${buildMailFooter({
            note:
              "Reply directly to this email to continue the conversation with the submitter when an email address was provided.",
          })}
        </div>
      </div>
    </div>
  `;

  const text = [
    headerTitle,
    headerSubtitle,
    "",
    "Submission summary",
    ...summaryRows.map((entry) => `${entry.label}: ${entry.value}`),
    "",
    "Contact details",
    ...contactRows.map((entry) => `${entry.label}: ${entry.value}`),
    "",
    "Submitted responses",
    ...values.map((entry) => `${entry.label}: ${formatTextValue(entry.value)}`),
    "",
    "Reply directly to this email to continue the conversation with the submitter when an email address was provided.",
  ].join("\n");

  const subject = submitterName
    ? `New ${formName} submission from ${submitterName}`
    : `New ${formName} submission`;

  return { html, subject, text };
};

const buildAcknowledgementEmail = ({
  formName,
  submitterName,
  successMessage,
  summaryRows,
}: {
  formName: string;
  submitterName?: string;
  successMessage: string;
  summaryRows: Array<{ label: string; value: string }>;
}) => {
  const greeting = submitterName ? `Hi ${escapeHtml(submitterName)},` : "Hi,";
  const responseTableRows = summaryRows
    .map(
      (entry) =>
        `<tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;width:170px;font-size:13px;font-weight:700;color:#334155;background:#f8fafc;">${escapeHtml(entry.label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;line-height:1.6;color:#0f172a;background:#ffffff;">${formatHtmlValue(entry.value)}</td>
        </tr>`,
    )
    .join("");
  const html = `
    <div style="margin:0;padding:32px 16px;background:#eef3f8;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;">
        <div style="overflow:hidden;border:1px solid #dbe5f0;border-radius:24px;background:#ffffff;box-shadow:0 18px 50px rgba(15,23,42,0.08);">
          <div style="padding:28px 32px;background:#11283e;">
            <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#bf9375;">Pryceless Ventures</p>
            <h1 style="margin:0;font-size:34px;line-height:1.15;color:#ffffff;">We received your request</h1>
            <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.82);">
              ${escapeHtml(submitterName ? `${submitterName}, your ${formName} submission is now with our team.` : `Your ${formName} submission is now with our team.`)}
            </p>
          </div>

          <div style="padding:28px 32px 10px;">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.8;color:#0f172a;">${greeting}</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#334155;">
              Thank you for reaching out to Pryceless Ventures. We have received your
              <strong> ${escapeHtml(formName)}</strong> submission and our team will review it carefully.
            </p>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#334155;">
              ${escapeHtml(successMessage)}
            </p>

            <div style="margin-bottom:24px;padding:18px 20px;border:1px solid #e2e8f0;border-radius:18px;background:#f8fafc;">
              <h2 style="margin:0 0 10px;font-size:17px;line-height:1.3;color:#0f172a;">What happens next</h2>
              <p style="margin:0 0 10px;font-size:14px;line-height:1.75;color:#475569;">
                Our team will review the information you shared, align it with the request type, and follow up with the appropriate next step.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.75;color:#475569;">
                If you need to update anything in the meantime, you can reply directly to this email.
              </p>
            </div>

            <div style="margin-bottom:24px;">
              <h2 style="margin:0 0 12px;font-size:18px;line-height:1.3;color:#0f172a;">Your submission summary</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
                ${responseTableRows}
              </table>
            </div>
          </div>

          ${buildMailFooter({
            note:
              "This email was sent from our server mailbox. You can reply here if you want to add more context for our team.",
          })}
        </div>
      </div>
    </div>
  `;
  const text = [
    submitterName ? `Hi ${submitterName},` : "Hi,",
    "",
    "Thank you for reaching out to Pryceless Ventures.",
    `We received your ${formName} submission and our team will review it carefully.`,
    successMessage,
    "",
    "What happens next",
    "Our team will review the information you shared and follow up with the appropriate next step.",
    "If you need to update anything in the meantime, you can reply directly to this email.",
    "",
    "Your submission summary",
    ...summaryRows.map((entry) => `${entry.label}: ${entry.value}`),
    "",
    "This email was sent from our server mailbox. You can reply here if you want to add more context for our team.",
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
  const submittedAtDisplay = formatSubmittedAt(submission.submittedAt);
  const userSummaryRows = [
    { label: "Form", value: formDefinition.formName },
    { label: "Submitted", value: submittedAtDisplay },
  ];

  if (shouldSendNotification || shouldSendAcknowledgement) {
    const emailJobs: Array<Promise<void>> = [];
    const emailErrors: string[] = [];
    const footerLogoAttachment = await getFooterLogoAttachment();

    if (shouldSendNotification) {
      const notificationEmail = buildNotificationEmail({
        formName: formDefinition.formName,
        submittedAt: submission.submittedAt,
        sourcePath: payload.sourcePath,
        submitterName,
        submitterEmail,
        submitterPhone,
        values: submission.values,
      });

      emailJobs.push(
        sendGraphMail({
          attachments: [footerLogoAttachment],
          ...notificationEmail,
          replyTo: submitterEmail ? [submitterEmail] : undefined,
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
        summaryRows: userSummaryRows,
      });

      emailJobs.push(
        sendGraphMail({
          attachments: [footerLogoAttachment],
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
