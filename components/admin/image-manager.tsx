"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ImageItem = {
  mediaFileId: string;
  blobUrl: string;
  fileName: string;
  altText?: string;
};

type ImageManagerProps = {
  name: string;
  initialImages?: ImageItem[];
  initialPrimaryMediaFileId?: string | null;
  folder: string;
};

export function ImageManager({
  name,
  initialImages = [],
  initialPrimaryMediaFileId,
  folder,
}: ImageManagerProps) {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [primaryMediaFileId, setPrimaryMediaFileId] = useState<string>(
    initialPrimaryMediaFileId ?? initialImages[0]?.mediaFileId ?? "",
  );
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const payload = useMemo(() => JSON.stringify(images), [images]);

  const mergeUniqueImages = (current: ImageItem[], incoming: ImageItem[]) => {
    const byMediaFileId = new Map<string, ImageItem>();

    for (const image of [...current, ...incoming]) {
      const existing = byMediaFileId.get(image.mediaFileId);
      byMediaFileId.set(image.mediaFileId, {
        ...existing,
        ...image,
        altText: image.altText ?? existing?.altText,
      });
    }

    return Array.from(byMediaFileId.values());
  };

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    startTransition(async () => {
      setError("");
      const formData = new FormData();
      formData.set("folder", folder);
      Array.from(files).forEach((file) => formData.append("files", file));

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: "Upload failed." }));
        setError(result.error ?? "Upload failed.");
        return;
      }

      const result = (await response.json()) as { files: ImageItem[] };
      setImages((current) => mergeUniqueImages(current, result.files));
      setPrimaryMediaFileId((current) => current || result.files[0]?.mediaFileId || "");

      if (searchParams.has("error")) {
        const nextSearchParams = new URLSearchParams(searchParams.toString());
        nextSearchParams.delete("error");
        const nextUrl = nextSearchParams.toString()
          ? `${pathname}?${nextSearchParams.toString()}`
          : pathname;
        router.replace(nextUrl, { scroll: false });
      }
    });
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Image Gallery
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Upload multiple images and pick one primary image for the public site.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          {isPending ? "Uploading..." : "Upload Images"}
          <input
            className="hidden"
            multiple
            accept="image/*"
            type="file"
            onChange={(event) => handleUpload(event.target.files)}
          />
        </label>
      </div>

      <input type="hidden" name={name} value={payload} />
      <input type="hidden" name="primaryMediaFileId" value={primaryMediaFileId} />

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {images.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.mediaFileId}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
            >
              <img
                alt={image.altText || image.fileName}
                className="h-48 w-full object-cover"
                src={image.blobUrl}
              />
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {image.fileName}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Image {index + 1}
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                    onClick={(event) => {
                      event.preventDefault();
                      setImages((current) => {
                        const nextImages = current.filter(
                          (item) => item.mediaFileId !== image.mediaFileId,
                        );

                        if (primaryMediaFileId === image.mediaFileId) {
                          setPrimaryMediaFileId(nextImages[0]?.mediaFileId ?? "");
                        }

                        return nextImages;
                      });
                    }}
                    type="button"
                  >
                    Remove
                  </button>
                </div>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Alt Text
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-400"
                    value={image.altText ?? ""}
                    onChange={(event) =>
                      setImages((current) =>
                        current.map((item) =>
                          item.mediaFileId === image.mediaFileId
                            ? { ...item, altText: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    checked={primaryMediaFileId === image.mediaFileId}
                    name={`${name}-primary`}
                    onChange={() => setPrimaryMediaFileId(image.mediaFileId)}
                    type="radio"
                  />
                  Primary image
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          No images uploaded yet.
        </div>
      )}
    </div>
  );
}
