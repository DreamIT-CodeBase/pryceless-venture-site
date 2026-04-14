import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import { uploadBufferToBlob } from "@/lib/blob";
import { formDefinitionsSeed, loanProgramSeed } from "@/lib/content-blueprint";
import {
  normalizeDynamicFormFieldType,
  parseStoredFieldOptions,
} from "@/lib/form-fields";
import { sendGraphMail, type EmailAttachment } from "@/lib/graph";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const emailLogoCid = "logo-header";
let emailLogoAssetPromise:
  | Promise<Pick<EmailAttachment, "contentBytes" | "contentType" | "name">>
  | null = null;

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

const getEmailLogoAttachment = async () => {
  if (!emailLogoAssetPromise) {
    const emailLogoPath = path.join(
      process.cwd(),
      "app",
      "assets",
      "headerlogo.svg",
    );
    emailLogoAssetPromise = readFile(emailLogoPath, "utf8").then((file) => {
      // Prefer the embedded PNG for broader email client support.
      const embeddedPngMatch = file.match(
        /(?:xlink:href|href)="data:image\/png;base64,([^"]+)"/i,
      );

      if (embeddedPngMatch?.[1]) {
        return {
          contentBytes: embeddedPngMatch[1],
          contentType: "image/png",
          name: "headerlogo.png",
        };
      }

      return {
        contentBytes: Buffer.from(file).toString("base64"),
        contentType: "image/svg+xml",
        name: "headerlogo.svg",
      };
    });
  }

  const logoAsset = await emailLogoAssetPromise;

  return {
    ...logoAsset,
    contentId: emailLogoCid,
    isInline: true,
  };
};

type MailRow = {
  label: string;
  value?: string | null;
  htmlValue?: string;
};

type UploadedDocument = {
  attachment?: EmailAttachment;
  blobUrl: string;
  fileName: string;
  fieldLabel: string;
};

const buildSectionTable = (rows: MailRow[], labelWidth = 148) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#ffffff;">
    ${rows
      .map(
        (entry, index) =>
          `<tr>
            <td style="padding:12px 14px;${index < rows.length - 1 ? "border-bottom:1px solid #e5edf5;" : ""}width:${labelWidth}px;font-size:13px;font-weight:700;color:#334155;background:#f8fafc;vertical-align:top;">
              ${escapeHtml(entry.label)}
            </td>
            <td style="padding:12px 14px;${index < rows.length - 1 ? "border-bottom:1px solid #e5edf5;" : ""}font-size:14px;line-height:1.7;color:#0f172a;vertical-align:top;">
              ${entry.htmlValue ?? formatHtmlValue(entry.value)}
            </td>
          </tr>`,
      )
      .join("")}
  </table>`;

const buildEmailIntro = ({
  subtitle,
  title,
}: {
  subtitle?: string;
  title: string;
}) => `
  <div style="margin:0 0 24px;">
    <img
      alt="Pryceless Ventures"
      src="cid:${emailLogoCid}"
      style="display:block;height:auto;width:180px;max-width:100%;margin:0 0 24px;"
    />
    <h1 style="margin:0;font-size:28px;line-height:1.2;color:#0f172a;">
      ${escapeHtml(title)}
    </h1>
    ${
      subtitle
        ? `<p style="margin:10px 0 0;font-size:15px;line-height:1.7;color:#475569;">
             ${escapeHtml(subtitle)}
           </p>`
        : ""
    }
  </div>
`;

const buildEmailLayout = ({
  body,
}: {
  body: string;
}) => `
  <div style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;border-collapse:collapse;background:#ffffff;">
      <tr>
        <td align="center" style="padding:0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:720px;border-collapse:collapse;background:#ffffff;">
            <tr>
              <td style="padding:24px 20px 32px;">
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

const buildNotificationEmail = ({
  formName,
  submittedAt,
  sourcePath,
  submitterName,
  submitterEmail,
  submitterPhone,
  uploadedDocuments,
  values,
}: {
  formName: string;
  submittedAt: Date;
  sourcePath?: string | null;
  submitterName?: string;
  submitterEmail?: string;
  submitterPhone?: string;
  uploadedDocuments: UploadedDocument[];
  values: Array<{ label: string; value: string }>;
}) => {
  const submittedAtDisplay = formatSubmittedAt(submittedAt);
  const headerTitle = `New ${formName} submission`;
  const headerSubtitle = submitterName
    ? `${submitterName} submitted the ${formName} form.`
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
  const documentRows = uploadedDocuments.map((document) => ({
    label: document.fieldLabel,
    htmlValue: `
      <div style="margin:0 0 4px;font-weight:600;color:#0f172a;">${escapeHtml(document.fileName)}</div>
      <div style="margin:0 0 4px;">
        <a href="${escapeHtml(document.blobUrl)}" style="color:#1d4ed8;text-decoration:none;">View stored file</a>
      </div>
      ${
        document.attachment
          ? '<div style="margin:0;color:#475569;">Attached to this email.</div>'
          : ""
      }
    `,
  }));
  const body = [
    buildEmailIntro({
      subtitle: headerSubtitle,
      title: headerTitle,
    }),
    `<div style="margin:0 0 24px;">
      <h2 style="margin:0 0 10px;font-size:18px;line-height:1.3;color:#0f172a;">Submission summary</h2>
      ${buildSectionTable(summaryRows)}
    </div>`,
    `<div style="margin:0 0 24px;">
      <h2 style="margin:0 0 10px;font-size:18px;line-height:1.3;color:#0f172a;">Contact details</h2>
      ${buildSectionTable(contactRows)}
    </div>`,
    uploadedDocuments.length
      ? `<div style="margin:0 0 24px;">
           <h2 style="margin:0 0 10px;font-size:18px;line-height:1.3;color:#0f172a;">Uploaded documents</h2>
           ${buildSectionTable(documentRows)}
         </div>`
      : "",
    `<div style="margin:0;">
      <h2 style="margin:0 0 10px;font-size:18px;line-height:1.3;color:#0f172a;">Submitted responses</h2>
      ${buildSectionTable(values, 160)}
    </div>`,
  ]
    .filter(Boolean)
    .join("");
  const html = buildEmailLayout({ body });
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
    ...(uploadedDocuments.length
      ? [
          "Uploaded documents",
          ...uploadedDocuments.flatMap((document) => [
            `${document.fieldLabel}: ${document.fileName}${document.attachment ? " (attached to this email)" : ""}`,
            `Stored file: ${document.blobUrl}`,
          ]),
          "",
        ]
      : []),
    "Submitted responses",
    ...values.map((entry) => `${entry.label}: ${formatTextValue(entry.value)}`),
    "",
    "Reply directly to this email to continue the conversation when the submitter shared an email address.",
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
  const greeting = submitterName ? `Hi ${submitterName},` : "Hi,";
  const title = "We received your request";
  const subtitle = submitterName
    ? `${submitterName}, your ${formName} submission is now with our team.`
    : `Your ${formName} submission is now with our team.`;
  const body = [
    buildEmailIntro({
      subtitle,
      title,
    }),
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#334155;">${escapeHtml(greeting)}</p>`,
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#334155;">
      Thank you for contacting Pryceless Ventures. We received your <strong>${escapeHtml(formName)}</strong> submission and our team will review it shortly.
    </p>`,
    `<p style="margin:0 0 22px;font-size:15px;line-height:1.8;color:#334155;">${formatHtmlValue(successMessage)}</p>`,
    `<div style="margin:0 0 24px;">
      <h2 style="margin:0 0 10px;font-size:18px;line-height:1.3;color:#0f172a;">Submission summary</h2>
      ${buildSectionTable(summaryRows)}
    </div>`,
    `<p style="margin:0;font-size:14px;line-height:1.8;color:#475569;">
      If you need to add anything else, reply directly to this email and our team will pick it up.
    </p>`,
  ].join("");
  const html = buildEmailLayout({ body });
  const text = [
    greeting,
    "",
    "Thank you for contacting Pryceless Ventures.",
    `We received your ${formName} submission and our team will review it shortly.`,
    successMessage,
    "",
    "Submission summary",
    ...summaryRows.map((entry) => `${entry.label}: ${entry.value}`),
    "",
    "Reply directly to this email if you would like to add more information for our team.",
  ].join("\n");

  return {
    subject: `We received your ${formName} submission`,
    html,
    text,
  };
};

const getSubmissionPayload = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await request.json()) as {
      sourcePath?: string;
      values?: Record<string, string>;
    };

    return {
      formData: null as FormData | null,
      sourcePath: payload.sourcePath,
      values: payload.values ?? {},
    };
  }

  const formData = await request.formData();

  return {
    formData,
    sourcePath: String(formData.get("sourcePath") ?? "").trim() || undefined,
    values: null as Record<string, string> | null,
  };
};

const isSchemaSyncFailure = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorWithMessage = error as { message?: string };
  const message = errorWithMessage.message ?? "";

  return (
    message.includes("Invalid object name") ||
    message.includes("Unknown field") ||
    message.includes("Unknown argument") ||
    message.includes("linkedLoanProgram") ||
    message.includes("webhookUrl") ||
    message.includes("submissionWebhookStatus")
  );
};

type SubmissionFormDefinition = {
  __seedFallback?: boolean;
  destination: string;
  fields: Array<{
    fieldKey: string;
    id: string;
    label: string;
    options: string | null;
    placeholder: string | null;
    required: boolean;
    type: string;
  }>;
  formName: string;
  id: string;
  linkedLoanProgram: {
    crmTag: string | null;
    slug: string;
    title: string;
  } | null;
  slug: string;
  successMessage: string;
  webhookUrl: string | null;
};

const getSeedBackedFormDefinition = (
  slug: string,
): SubmissionFormDefinition | null => {
  const seedDefinition = formDefinitionsSeed.find((definition) => definition.slug === slug);

  if (!seedDefinition) {
    return null;
  }

  const linkedLoanProgram =
    "linkedLoanProgramSlug" in seedDefinition && seedDefinition.linkedLoanProgramSlug
      ? loanProgramSeed.find((program) => program.slug === seedDefinition.linkedLoanProgramSlug)
      : null;

  return {
    __seedFallback: true,
    destination: seedDefinition.destination,
    fields: seedDefinition.fields.map((field) => ({
      fieldKey: field.fieldKey,
      id: `seed-${seedDefinition.slug}-${field.fieldKey}`,
      label: field.label,
      options:
        "options" in field && Array.isArray(field.options) && field.options.length
          ? JSON.stringify(field.options)
          : null,
      placeholder: "placeholder" in field ? field.placeholder ?? null : null,
      required: Boolean(field.required),
      type: field.type,
    })),
    formName: seedDefinition.formName,
    id: `seed-${seedDefinition.slug}`,
    linkedLoanProgram: linkedLoanProgram
      ? {
          crmTag: linkedLoanProgram.crmTag ?? null,
          slug: linkedLoanProgram.slug,
          title: linkedLoanProgram.title,
        }
      : null,
    slug: seedDefinition.slug,
    successMessage: seedDefinition.successMessage,
    webhookUrl: null,
  };
};

const getFormDefinitionForSubmission = async (
  slug: string,
): Promise<SubmissionFormDefinition | null> => {
  try {
    const formDefinition = await prisma.formDefinition.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        linkedLoanProgram: {
          select: {
            crmTag: true,
            slug: true,
            title: true,
          },
        },
        fields: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return (
      (formDefinition
        ? {
            ...formDefinition,
            __seedFallback: false,
          }
        : null) ?? getSeedBackedFormDefinition(slug)
    );
  } catch (error) {
    if (isSchemaSyncFailure(error)) {
      return getSeedBackedFormDefinition(slug);
    }

    throw error;
  }
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const payload = await getSubmissionPayload(request);

  const formDefinition = await getFormDefinitionForSubmission(slug);

  if (!formDefinition) {
    return NextResponse.json({ error: "Form not found." }, { status: 404 });
  }

  const parsedData: Record<string, string> = {};
  const displayValues: Record<string, string> = {};
  const uploadedDocuments: UploadedDocument[] = [];

  for (const field of formDefinition.fields) {
    const normalizedFieldType = normalizeDynamicFormFieldType(field.type);
    const rawEntry = payload.formData
      ? payload.formData.get(field.fieldKey)
      : payload.values?.[field.fieldKey];

    if (normalizedFieldType === "FILE") {
      const uploadedFile =
        rawEntry instanceof File && rawEntry.size > 0 ? rawEntry : null;

      if (field.required && !uploadedFile) {
        return NextResponse.json(
          { error: `${field.label} is required.` },
          { status: 400 },
        );
      }

      if (uploadedFile) {
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
        const normalizedMimeType = uploadedFile.type || "application/octet-stream";
        const media = await uploadBufferToBlob({
          buffer: fileBuffer,
          fileName: uploadedFile.name,
          folder: `form-submissions/${formDefinition.slug}`,
          mimeType: normalizedMimeType,
        });
        const isPdfUpload =
          normalizedMimeType.toLowerCase() === "application/pdf" ||
          uploadedFile.name.toLowerCase().endsWith(".pdf");

        uploadedDocuments.push({
          attachment: isPdfUpload
            ? {
                contentBytes: fileBuffer.toString("base64"),
                contentType: normalizedMimeType,
                name: uploadedFile.name,
              }
            : undefined,
          blobUrl: media.blobUrl,
          fileName: uploadedFile.name,
          fieldLabel: field.label,
        });
        parsedData[field.fieldKey] = media.blobUrl;
        displayValues[field.fieldKey] = `${uploadedFile.name}\n${media.blobUrl}`;
      } else {
        parsedData[field.fieldKey] = "";
        displayValues[field.fieldKey] = "";
      }

      continue;
    }

    const rawValue = String(
      typeof rawEntry === "string" ? rawEntry : rawEntry ?? "",
    ).trim();

    if (field.required && !rawValue) {
      return NextResponse.json(
        { error: `${field.label} is required.` },
        { status: 400 },
      );
    }

    if (normalizedFieldType === "EMAIL" && rawValue) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(rawValue)) {
        return NextResponse.json(
          { error: `${field.label} must be a valid email.` },
          { status: 400 },
        );
      }
    }

    if (normalizedFieldType === "NUMBER" && rawValue && Number.isNaN(Number(rawValue))) {
      return NextResponse.json(
        { error: `${field.label} must be a valid number.` },
        { status: 400 },
      );
    }

    if (normalizedFieldType === "SELECT" || normalizedFieldType === "RADIO") {
      const options = parseStoredFieldOptions(field.options);
      if (rawValue && options.length && !options.includes(rawValue)) {
        return NextResponse.json(
          { error: `${field.label} contains an invalid option.` },
          { status: 400 },
        );
      }
    }

    parsedData[field.fieldKey] = rawValue;
    displayValues[field.fieldKey] = rawValue;
  }

  const detectedEmailField = formDefinition.fields.find(
    (field) => normalizeDynamicFormFieldType(field.type) === "EMAIL",
  );
  const detectedPhoneField = formDefinition.fields.find(
    (field) => normalizeDynamicFormFieldType(field.type) === "PHONE",
  );
  const detectedNameField = formDefinition.fields.find((field) =>
    /(^name$|full_?name|contact_?name|first_?name)/i.test(field.fieldKey),
  );
  const combinedName = [parsedData.first_name, parsedData.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const submitterName =
    combinedName ||
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

  const canPersistSubmission = !formDefinition.__seedFallback;
  const seededSubmissionTimestamp = new Date();
  const submission = canPersistSubmission
    ? await prisma.formSubmission.create({
        data: {
          formDefinitionId: formDefinition.id,
          submitterName,
          submitterEmail,
          submitterPhone,
          sourcePath: payload.sourcePath,
          submissionEmailStatus: formDefinition.destination === "CRM" ? "SKIPPED" : "PENDING",
          submissionWebhookStatus:
            formDefinition.destination === "EMAIL" || !formDefinition.webhookUrl
              ? "SKIPPED"
              : "PENDING",
          values: {
            create: formDefinition.fields.map((field, index) => ({
              label: field.label,
              value: displayValues[field.fieldKey] || "",
              sortOrder: index,
            })),
          },
        },
        include: {
          values: true,
        },
      })
    : {
        id: `seed-submission-${slug}-${seededSubmissionTimestamp.getTime()}`,
        submittedAt: seededSubmissionTimestamp,
        submissionEmailStatus:
          formDefinition.destination === "CRM" ? "SKIPPED" : "PENDING",
        submissionWebhookStatus:
          formDefinition.destination === "EMAIL" || !formDefinition.webhookUrl
            ? "SKIPPED"
            : "PENDING",
        values: formDefinition.fields.map((field, index) => ({
          id: `seed-submission-value-${index}`,
          formSubmissionId: `seed-submission-${slug}`,
          label: field.label,
          sortOrder: index,
          value: displayValues[field.fieldKey] || "",
        })),
      };

  const shouldSendNotification = formDefinition.destination !== "CRM";
  const shouldSendAcknowledgement = Boolean(submitterEmail);
  const shouldSendWebhook =
    formDefinition.destination !== "EMAIL" && Boolean(formDefinition.webhookUrl);
  const submittedAtDisplay = formatSubmittedAt(submission.submittedAt);
  const userSummaryRows = [
    { label: "Form", value: formDefinition.formName },
    ...(formDefinition.linkedLoanProgram?.title
      ? [{ label: "Program", value: formDefinition.linkedLoanProgram.title }]
      : []),
    { label: "Submitted", value: submittedAtDisplay },
  ];
  let emailStatus = submission.submissionEmailStatus;
  let emailError: string | null = null;
  let webhookStatus = submission.submissionWebhookStatus;
  let webhookError: string | null = null;

  if (shouldSendNotification || shouldSendAcknowledgement) {
    const emailJobs: Array<Promise<void>> = [];
    const emailErrors: string[] = [];
    const emailLogoAttachment = await getEmailLogoAttachment();

    if (shouldSendNotification) {
      const notificationEmail = buildNotificationEmail({
        formName: formDefinition.formName,
        submittedAt: submission.submittedAt,
        sourcePath: payload.sourcePath,
        submitterName,
        submitterEmail,
        submitterPhone,
        uploadedDocuments,
        values: submission.values,
      });

      emailJobs.push(
        sendGraphMail({
          attachments: [
            emailLogoAttachment,
            ...uploadedDocuments.flatMap((document) =>
              document.attachment ? [document.attachment] : [],
            ),
          ],
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
          attachments: [emailLogoAttachment],
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
    emailStatus = emailErrors.length ? "FAILED" : "SENT";
    emailError = emailErrors.length ? emailErrors.join("\n\n") : null;
  }

  if (shouldSendWebhook && formDefinition.webhookUrl) {
    try {
      const webhookResponse = await fetch(formDefinition.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crmTag: formDefinition.linkedLoanProgram?.crmTag ?? null,
          form: {
            id: formDefinition.id,
            name: formDefinition.formName,
            slug: formDefinition.slug,
          },
          loanProgram: formDefinition.linkedLoanProgram
            ? {
                slug: formDefinition.linkedLoanProgram.slug,
                title: formDefinition.linkedLoanProgram.title,
              }
            : null,
          sourcePath: payload.sourcePath ?? null,
          submission: {
            id: submission.id,
            submittedAt: submission.submittedAt.toISOString(),
            submitterEmail: submitterEmail ?? null,
            submitterName: submitterName ?? null,
            submitterPhone: submitterPhone ?? null,
            values: submission.values.map((value) => ({
              label: value.label,
              value: value.value,
            })),
          },
          values: parsedData,
        }),
        cache: "no-store",
      });

      if (!webhookResponse.ok) {
        webhookStatus = "FAILED";
        webhookError = `Webhook failed: ${webhookResponse.status} ${await webhookResponse.text()}`;
      } else {
        webhookStatus = "SENT";
        webhookError = null;
      }
    } catch (error) {
      webhookStatus = "FAILED";
      webhookError =
        error instanceof Error ? error.message : "Unknown webhook delivery error";
    }
  }

  if (
    canPersistSubmission &&
    (
      emailStatus !== submission.submissionEmailStatus ||
      emailError !== null ||
      webhookStatus !== submission.submissionWebhookStatus ||
      webhookError !== null
    )
  ) {
    await prisma.formSubmission.update({
      where: { id: submission.id },
      data: {
        submissionEmailStatus: emailStatus,
        emailError,
        submissionWebhookStatus: webhookStatus,
        webhookError,
      },
    });
  }

  return NextResponse.json({
    success: true,
    message: formDefinition.successMessage,
  });
}
