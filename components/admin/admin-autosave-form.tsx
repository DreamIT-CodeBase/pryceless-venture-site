"use client";

import {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type AutosaveResult = {
  path?: string;
  recordId?: string;
  savedAt?: string;
};

type AdminAutosaveFormProps = {
  autosaveAction: (formData: FormData) => Promise<AutosaveResult | null>;
  children: ReactNode;
  className?: string;
  hiddenRecordIdName?: string;
  initialRecordId?: string;
  submitAction: (formData: FormData) => void | Promise<void>;
};

const formatSavedTime = (value?: string | null) => {
  if (!value) {
    return "";
  }

  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export function AdminAutosaveForm({
  autosaveAction,
  children,
  className,
  hiddenRecordIdName = "recordId",
  initialRecordId = "",
  submitAction,
}: AdminAutosaveFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isSubmittingRef = useRef(false);
  const [recordId, setRecordId] = useState(initialRecordId);
  const [status, setStatus] = useState<"idle" | "editing" | "saving" | "saved" | "error">(
    "idle",
  );
  const [savedAt, setSavedAt] = useState<string>("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const statusLabel = useMemo(() => {
    if (status === "saving" || isPending) {
      return "Saving draft...";
    }
    if (status === "saved") {
      const timeLabel = formatSavedTime(savedAt);
      return timeLabel ? `Draft saved at ${timeLabel}` : "Draft saved";
    }
    if (status === "error") {
      return "Autosave paused. Use Save Draft to keep changes.";
    }
    return "Autosave enabled";
  }, [isPending, savedAt, status]);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const flushAutosave = () => {
    clearTimer();

    if (!formRef.current || isSubmittingRef.current) {
      return;
    }

    startTransition(async () => {
      try {
        setStatus("saving");
        const formData = new FormData(formRef.current!);
        const result = await autosaveAction(formData);

        if (result?.recordId && result.recordId !== recordId) {
          setRecordId(result.recordId);
        }

        if (result?.path && result.path !== pathname) {
          router.replace(result.path, { scroll: false });
        }

        if (result?.savedAt) {
          setSavedAt(result.savedAt);
        }

        setStatus("saved");
      } catch {
        setStatus("error");
      }
    });
  };

  useEffect(
    () => () => {
      isSubmittingRef.current = true;
      clearTimer();
    },
    [],
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && status === "editing") {
        flushAutosave();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [status]);

  return (
    <>
      <form
        action={submitAction}
        className={className}
        onChange={() => {
          if (isSubmittingRef.current) {
            return;
          }
          setHasInteracted(true);
          setStatus("editing");
          clearTimer();
          timeoutRef.current = window.setTimeout(flushAutosave, 1200);
        }}
        onInput={() => {
          if (isSubmittingRef.current) {
            return;
          }
          setHasInteracted(true);
          setStatus("editing");
          clearTimer();
          timeoutRef.current = window.setTimeout(flushAutosave, 1200);
        }}
        onSubmit={() => {
          isSubmittingRef.current = true;
          clearTimer();
        }}
        ref={formRef}
      >
        {hiddenRecordIdName ? (
          <input name={hiddenRecordIdName} readOnly type="hidden" value={recordId} />
        ) : null}
        {children}
      </form>

      {hasInteracted ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[90]">
          <div
            className={`rounded-full border px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur ${
              status === "error"
                ? "border-rose-200 bg-white/95 text-rose-700 shadow-rose-100/60"
                : "border-violet-200 bg-white/95 text-violet-700 shadow-violet-100/70"
            }`}
          >
            {statusLabel}
          </div>
        </div>
      ) : null}
    </>
  );
}
