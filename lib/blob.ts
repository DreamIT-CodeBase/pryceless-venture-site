import { BlobServiceClient } from "@azure/storage-blob";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

let cachedContainerClient:
  | ReturnType<BlobServiceClient["getContainerClient"]>
  | undefined;

type UploadBufferToBlobInput = {
  buffer: Buffer;
  fileName: string;
  folder: string;
  mimeType?: string;
};

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
  return uploadBufferToBlob({
    buffer,
    fileName: file.name,
    folder,
    mimeType: file.type || "application/octet-stream",
  });
};

export const uploadBufferToBlob = async ({
  buffer,
  fileName,
  folder,
  mimeType = "application/octet-stream",
}: UploadBufferToBlobInput) => {
  const containerClient = await getContainerClient();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const blobPath = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return prisma.mediaFile.create({
    data: {
      blobUrl: blockBlobClient.url,
      blobPath,
      fileName,
      mimeType,
      fileSize: buffer.byteLength,
    },
  });
};
