const azureBlobAccountName =
  process.env.AZURE_STORAGE_CONNECTION_STRING?.split(";")
    .find((part) => part.startsWith("AccountName="))
    ?.split("=")[1] || "prycelessventureblob";

const nextConfig = {
  distDir: "build",
  devIndicators: {
    buildActivity: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800,
    remotePatterns: [
      new URL(`https://${azureBlobAccountName}.blob.core.windows.net/**`),
      new URL("https://randomuser.me/api/portraits/**"),
    ],
  },
};

module.exports = nextConfig;
