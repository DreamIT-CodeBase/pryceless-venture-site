"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

type HomeTestimonialValue = {
  avatarUrl?: string | null;
  city?: string | null;
  name?: string | null;
  quote?: string | null;
};

type EditableHomeTestimonial = {
  id: string;
  avatarUrl: string;
  city: string;
  name: string;
  quote: string;
};

const createEditorId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `testimonial-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
};

const toEditableTestimonial = (
  testimonial?: HomeTestimonialValue,
): EditableHomeTestimonial => ({
  id: createEditorId(),
  avatarUrl: String(testimonial?.avatarUrl ?? "").trim(),
  city: String(testimonial?.city ?? "").trim(),
  name: String(testimonial?.name ?? "").trim(),
  quote: String(testimonial?.quote ?? "").trim(),
});

const createEmptyTestimonial = () => toEditableTestimonial();

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

export function HomeTestimonialsEditor({
  initialTestimonials = [],
}: {
  initialTestimonials?: HomeTestimonialValue[];
}) {
  const [testimonials, setTestimonials] = useState<EditableHomeTestimonial[]>(
    initialTestimonials.length
      ? initialTestimonials.map((testimonial) => toEditableTestimonial(testimonial))
      : [createEmptyTestimonial()],
  );
  const [uploadError, setUploadError] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const hasMountedRef = useRef(false);

  const payload = useMemo(
    () =>
      JSON.stringify(
        testimonials.map((testimonial) => ({
          avatarUrl: testimonial.avatarUrl.trim() || undefined,
          city: testimonial.city.trim(),
          name: testimonial.name.trim(),
          quote: testimonial.quote.trim(),
        })),
      ),
    [testimonials],
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    hiddenInputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, [payload]);

  const updateTestimonial = (
    id: string,
    field: keyof Omit<EditableHomeTestimonial, "id">,
    value: string,
  ) => {
    setTestimonials((current) =>
      current.map((testimonial) =>
        testimonial.id === id ? { ...testimonial, [field]: value } : testimonial,
      ),
    );
  };

  const handleUpload = (id: string, files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const [file] = Array.from(files);

    startTransition(async () => {
      setUploadError("");
      setUploadingId(id);

      try {
        const formData = new FormData();
        formData.set("folder", "home-testimonials");
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
        const avatarUrl = result.files?.[0]?.blobUrl ?? "";

        if (!avatarUrl) {
          setUploadError("Upload finished, but no image URL was returned.");
          return;
        }

        updateTestimonial(id, "avatarUrl", avatarUrl);
      } catch {
        setUploadError("Upload failed. Please try again.");
      } finally {
        setUploadingId(null);
      }
    });
  };

  return (
    <div className="block md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">Testimonials</span>
          <p className="max-w-[680px] text-sm text-slate-500">
            Manage each testimonial and client photo here. Production photos are stored
            in Azure Blob Storage and only uploaded portal images are used on the live site.
          </p>
        </div>
        <button
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={() =>
            setTestimonials((current) => [...current, createEmptyTestimonial()])
          }
          type="button"
        >
          Add Testimonial
        </button>
      </div>

      <input name="testimonialsJson" readOnly ref={hiddenInputRef} type="hidden" value={payload} />

      {uploadError ? <p className="mt-3 text-sm text-rose-600">{uploadError}</p> : null}

      <div className="mt-4 space-y-4">
        {testimonials.map((testimonial, index) => {
          const initials = getInitials(testimonial.name) || "PV";
          const isUploadingThisCard = uploadingId === testimonial.id && isPending;

          return (
            <div
              className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5"
              key={testimonial.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                    {testimonial.avatarUrl ? (
                      <img
                        alt={testimonial.name || `Testimonial ${index + 1}`}
                        className="h-full w-full object-cover"
                        src={testimonial.avatarUrl}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-[linear-gradient(180deg,#eef7ff_0%,#dcebfb_100%)] text-lg font-semibold text-[#2496f0]">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Testimonial {index + 1}
                    </p>
                    <p className="text-sm text-slate-500">
                      If no photo is added, the live card will show initials instead.
                    </p>
                  </div>
                </div>

                <button
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                  onClick={() =>
                    setTestimonials((current) =>
                      current.length === 1
                        ? [createEmptyTestimonial()]
                        : current.filter((item) => item.id !== testimonial.id),
                    )
                  }
                  type="button"
                >
                  Remove
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, "name", event.target.value)
                    }
                    value={testimonial.name}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">City</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, "city", event.target.value)
                    }
                    value={testimonial.city}
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Quote</span>
                  <textarea
                    className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, "quote", event.target.value)
                    }
                    value={testimonial.quote}
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Stored Azure Blob URL
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
                    placeholder="Upload a photo to store it in Azure Blob Storage"
                    readOnly
                    value={testimonial.avatarUrl}
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                  <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                    {isUploadingThisCard ? "Uploading..." : "Upload Photo"}
                    <input
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingThisCard}
                      onChange={(event) => {
                        handleUpload(testimonial.id, event.target.files);
                        event.target.value = "";
                      }}
                      type="file"
                    />
                  </label>

                  {testimonial.avatarUrl ? (
                    <button
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                      onClick={() => updateTestimonial(testimonial.id, "avatarUrl", "")}
                      type="button"
                    >
                      Clear Photo
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
