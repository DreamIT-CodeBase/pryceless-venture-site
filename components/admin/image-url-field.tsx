"use client";

import { useEffect, useRef, useState, useTransition } from "react";

type ImageUrlFieldProps = {
  allowManualUrl?: boolean;
  description?: string;
  folder: string;
  initialValue?: string | null;
  label: string;
  name: string;
  previewAlt?: string;
};

export function ImageUrlField({
  allowManualUrl = false,
  description,
  folder,
  initialValue,
  label,
  name,
  previewAlt,
}: ImageUrlFieldProps) {
  const [value, setValue] = useState(String(initialValue ?? "").trim());
  const [uploadError, setUploadError] = useState("");
  const [isPending, startTransition] = useTransition();
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    hiddenInputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, [value]);

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const [file] = Array.from(files);

    startTransition(async () => {
      setUploadError("");

      try {
        const formData = new FormData();
        formData.set("folder", folder);
        formData.append("files", file);

        const response = await fetch("/api/admin/uploads", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({ error: "Upload failed." }));
          setUploadError(result.error ?? "Upload failed.");
          return;
        }

        const result = (await response.json()) as {
          files?: Array<{
            blobUrl?: string;
          }>;
        };
        const nextValue = result.files?.[0]?.blobUrl ?? "";

        if (!nextValue) {
          setUploadError("Upload finished, but no image URL was returned.");
          return;
        }

        setValue(nextValue);
      } catch {
        setUploadError("Upload failed. Please try again.");
      }
    });
  };

  return (
    <div className="block md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
          {description ? (
            <p className="max-w-[680px] text-sm text-slate-500">{description}</p>
          ) : null}
          <p className="mt-2 text-sm text-slate-500">
            {allowManualUrl
              ? "Upload an image to Azure Blob Storage or paste a direct image URL."
              : "Production images are stored in Azure Blob Storage."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            {isPending ? "Uploading..." : "Upload Image"}
            <input
              accept="image/*"
              className="hidden"
              disabled={isPending}
              onChange={(event) => {
                handleUpload(event.target.files);
                event.target.value = "";
              }}
              type="file"
            />
          </label>
          {value ? (
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={() => setValue("")}
              type="button"
            >
              Clear Image
            </button>
          ) : null}
        </div>
      </div>

      <input name={name} readOnly ref={hiddenInputRef} type="hidden" value={value} />

      {uploadError ? <p className="mt-3 text-sm text-rose-600">{uploadError}</p> : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            {allowManualUrl ? "Image URL" : "Stored Azure Blob URL"}
          </span>
          <input
            className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-600 ${
              allowManualUrl ? "bg-white" : "bg-slate-50"
            }`}
            onChange={
              allowManualUrl
                ? (event) => setValue(event.target.value)
                : undefined
            }
            placeholder={
              allowManualUrl
                ? "Paste a direct image URL or upload an image"
                : "Upload an image to store it in Azure Blob Storage"
            }
            readOnly={!allowManualUrl}
            value={value}
          />
        </label>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-sm font-medium text-slate-700">Preview</div>
          <div className="mt-3 aspect-[4/3] overflow-hidden rounded-[1rem] bg-slate-100">
            {value ? (
              <img
                alt={previewAlt ?? label}
                className="h-full w-full object-cover"
                src={value}
              />
            ) : (
              <div className="grid h-full w-full place-items-center px-4 text-center text-sm text-slate-400">
                No image selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
