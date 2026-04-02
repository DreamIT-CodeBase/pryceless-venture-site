import { BlobServiceClient } from "@azure/storage-blob";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

let cachedContainerClient:
  | ReturnType<BlobServiceClient["getContainerClient"]>
  | undefined;

const getStorageAccountName = () =>
  env.azureStorageConnectionString
    .split(";")
    .find((part) => part.startsWith("AccountName="))
    ?.split("=")[1]
    ?.trim() ?? "";

export const getAzureBlobHost = () => `${getStorageAccountName()}.blob.core.windows.net`;

export const getAzureBlobUrlPrefix = () =>
  `https://${getAzureBlobHost()}/${env.azureContainerName}/`;

export const isAzureBlobStorageUrl = (value: string | null | undefined) => {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.host === getAzureBlobHost() &&
      url.pathname.startsWith(`/${env.azureContainerName}/`)
    );
  } catch {
    return false;
  }
};

const getContainerClient = async () => {
  if (!cachedContainerClient) {
    const serviceClient = BlobServiceClient.fromConnectionString(
      env.azureStorageConnectionString,
    );
    cachedContainerClient = serviceClient.getContainerClient(env.azureContainerName);
    await cachedContainerClient.createIfNotExists({ access: "blob" });
  }

  return cachedContainerClient;
};

export const uploadFileToBlob = async (file: File, folder: string) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const containerClient = await getContainerClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const blobPath = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type || "application/octet-stream",
    },
  });

  return prisma.mediaFile.create({
    data: {
      blobUrl: blockBlobClient.url,
      blobPath,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: buffer.byteLength,
    },
  });
};
