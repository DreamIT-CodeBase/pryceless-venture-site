"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";

export function SubmitButton({
  children,
  pendingText,
  className = "",
  ...props
}: ComponentProps<"button"> & { pendingText?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      disabled={pending || props.disabled}
      className={`${className} ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
      type="submit"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
          </svg>
          {pendingText ?? children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
