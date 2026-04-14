const azureBlobAccountName =
  process.env.AZURE_STORAGE_CONNECTION_STRING?.split(";")
    .find((part) => part.startsWith("AccountName="))
    ?.split("=")[1] || "prycelessventureblob";

const nextConfig = {
  distDir: "build",
  devIndicators: {
    buildActivity: false,
  },
  outputFileTracingIncludes: {
    "/*": [
      "node_modules/.prisma/**/*",
      "node_modules/@prisma/client/**/*",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${azureBlobAccountName}.blob.core.windows.net`,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
