const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const parseEmails = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

export const env = {
  databaseUrl: requireEnv("DATABASE_URL"),
  azureStorageConnectionString: requireEnv("AZURE_STORAGE_CONNECTION_STRING"),
  azureContainerName: requireEnv("AZURE_CONTAINER_NAME"),
  azureClientId: requireEnv("AZURE_CLIENT_ID"),
  azureTenantId: requireEnv("AZURE_TENANT_ID"),
  azureClientSecret: requireEnv("AZURE_CLIENT_SECRET"),
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  nextAuthSecret: requireEnv("NEXTAUTH_SECRET"),
  redirectUri: process.env.REDIRECT_URI ?? "/admin",
  adminAllowedEmails: parseEmails(process.env.ADMIN_ALLOWED_EMAILS),
  senderMail: requireEnv("SENDER_MAIL"),
  recipientMail: requireEnv("RECIPIENT_MAIL"),
};
