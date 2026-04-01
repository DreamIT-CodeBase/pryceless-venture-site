import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { uploadFileToBlob } from "@/lib/blob";

const uploadFilesInBatches = async (files: File[], folder: string, batchSize = 3) => {
  const uploadedFiles: Array<{
    mediaFileId: string;
    blobUrl: string;
    fileName: string;
    altText: string;
  }> = [];

  for (let index = 0; index < files.length; index += batchSize) {
    const batch = files.slice(index, index + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        const media = await uploadFileToBlob(file, folder);
        return {
          mediaFileId: media.id,
          blobUrl: media.blobUrl,
          fileName: media.fileName,
          altText: media.altText ?? "",
        };
      }),
    );

    uploadedFiles.push(...batchResults);
  }

  return uploadedFiles;
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const folder = String(formData.get("folder") ?? "uploads");
  const files = formData.getAll("files").filter((value): value is File => value instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
  }

  const uploadedFiles = await uploadFilesInBatches(files, folder);

  return NextResponse.json({ files: uploadedFiles });
}
