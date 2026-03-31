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
  get databaseUrl() {
    return requireEnv("DATABASE_URL");
  },
  get azureStorageConnectionString() {
    return requireEnv("AZURE_STORAGE_CONNECTION_STRING");
  },
  get azureContainerName() {
    return requireEnv("AZURE_CONTAINER_NAME");
  },
  get azureClientId() {
    return requireEnv("AZURE_CLIENT_ID");
  },
  get azureTenantId() {
    return requireEnv("AZURE_TENANT_ID");
  },
  get azureClientSecret() {
    return requireEnv("AZURE_CLIENT_SECRET");
  },
  get nextAuthUrl() {
    return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  },
  get nextAuthSecret() {
    return requireEnv("NEXTAUTH_SECRET");
  },
  get redirectUri() {
    return process.env.REDIRECT_URI ?? "/admin";
  },
  get adminAllowedEmails() {
    return parseEmails(process.env.ADMIN_ALLOWED_EMAILS);
  },
  get senderMail() {
    return requireEnv("SENDER_MAIL");
  },
  get recipientMail() {
    return requireEnv("RECIPIENT_MAIL");
  },
};
