import { env } from "@/lib/env";

type EmailPayload = {
  attachments?: EmailAttachment[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string[];
  to?: string[];
};

export type EmailAttachment = {
  contentBytes: string;
  contentId?: string;
  contentType: string;
  isInline?: boolean;
  name: string;
};

const getGraphToken = async () => {
  const response = await fetch(
    `https://login.microsoftonline.com/${env.azureTenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.azureClientId,
        client_secret: env.azureClientSecret,
        grant_type: "client_credentials",
        scope: "https://graph.microsoft.com/.default",
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Microsoft Graph token request failed with status ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
};

export const sendGraphMail = async (payload: EmailPayload) => {
  const token = await getGraphToken();
  const recipients = (payload.to?.length ? payload.to : [env.recipientMail]).map((address) => ({
    emailAddress: { address },
  }));
  const replyToRecipients = payload.replyTo?.length
    ? payload.replyTo.map((address) => ({
        emailAddress: { address },
      }))
    : undefined;

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.senderMail)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          attachments: payload.attachments?.map((attachment) => ({
            "@odata.type": "#microsoft.graph.fileAttachment",
            contentBytes: attachment.contentBytes,
            contentId: attachment.contentId,
            contentType: attachment.contentType,
            isInline: attachment.isInline ?? false,
            name: attachment.name,
          })),
          subject: payload.subject,
          body: {
            contentType: "HTML",
            content: payload.html,
          },
          replyTo: replyToRecipients,
          toRecipients: recipients,
        },
        saveToSentItems: false,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Microsoft Graph sendMail failed: ${response.status} ${errorText}`);
  }
};
