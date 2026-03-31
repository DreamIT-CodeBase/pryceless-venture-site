"use client";

import { useEffect, useState } from "react";

import type { AdminFlash } from "@/lib/admin-flash";

const toneMap = {
  success: {
    shell:
      "border-emerald-200/80 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.98))] text-emerald-950 shadow-[0_20px_45px_rgba(16,185,129,0.16)]",
    badge: "bg-emerald-500 text-white",
    eyebrow: "text-emerald-700",
    label: "Success",
    progress: "bg-emerald-500/70",
  },
  error: {
    shell:
      "border-rose-200/80 bg-[linear-gradient(135deg,rgba(255,241,242,0.98),rgba(255,255,255,0.98))] text-rose-950 shadow-[0_20px_45px_rgba(244,63,94,0.14)]",
    badge: "bg-rose-500 text-white",
    eyebrow: "text-rose-700",
    label: "Error",
    progress: "bg-rose-500/70",
  },
  info: {
    shell:
      "border-violet-200/80 bg-[linear-gradient(135deg,rgba(245,243,255,0.98),rgba(255,255,255,0.98))] text-violet-950 shadow-[0_20px_45px_rgba(99,102,241,0.14)]",
    badge: "bg-violet-500 text-white",
    eyebrow: "text-violet-700",
    label: "Update",
    progress: "bg-violet-500/70",
  },
} as const;

function FlashIcon({ type }: { type: AdminFlash["type"] }) {
  if (type === "success") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <path
          d="M3.5 8.25 6.5 11 12.5 5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <path
          d="M8 4.5v4M8 11.5h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M8 1.75 14 13.25H2L8 1.75Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M8 6.75v3.5M8 4.5h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function AdminFlashToast({
  initialFlash,
}: {
  initialFlash: AdminFlash | null;
}) {
  const [flash, setFlash] = useState<AdminFlash | null>(initialFlash);
  const [visible, setVisible] = useState(Boolean(initialFlash));

  useEffect(() => {
    if (!initialFlash) {
      return;
    }

    setFlash(initialFlash);
    setVisible(true);
    document.cookie = "pv-admin-flash=; Max-Age=0; path=/admin";

    const hideTimer = window.setTimeout(() => setVisible(false), 4200);
    const removeTimer = window.setTimeout(() => setFlash(null), 4500);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [initialFlash]);

  if (!flash) {
    return null;
  }

  const tone = toneMap[flash.type];
  const heading = flash.title ?? tone.label;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[110] flex w-full justify-end px-2 sm:right-6 sm:top-6">
      <div
        className={`pointer-events-auto w-full max-w-sm rounded-[1.6rem] border p-4 backdrop-blur transition-all duration-300 ${
          tone.shell
        } ${visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
        role={flash.type === "error" ? "alert" : "status"}
        aria-live={flash.type === "error" ? "assertive" : "polite"}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone.badge}`}
          >
            <FlashIcon type={flash.type} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${tone.eyebrow}`}>
              {heading}
            </p>
            <p className="mt-1 text-sm font-medium leading-6">{flash.message}</p>
          </div>
          <button
            className="rounded-full px-2 py-1 text-slate-400 transition hover:bg-black/5 hover:text-slate-700"
            onClick={() => {
              setVisible(false);
              window.setTimeout(() => setFlash(null), 220);
            }}
            type="button"
            aria-label="Dismiss notification"
          >
            x
          </button>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-black/5">
          <div
            className={`h-full origin-left rounded-full ${tone.progress} ${
              visible ? "animate-[toast-progress_4.2s_linear_forwards]" : "w-0"
            }`}
          />
        </div>
        <style jsx>{`
          @keyframes toast-progress {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
