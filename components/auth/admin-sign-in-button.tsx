"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

type AdminSignInButtonProps = {
  callbackUrl: string;
};

export function AdminSignInButton({ callbackUrl }: AdminSignInButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-8">
      <button
        className="inline-flex w-full items-center justify-center gap-3 rounded-[16px] bg-[linear-gradient(135deg,#4f46e5,#4338ca)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.32)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await signIn("microsoft-entra-id", { callbackUrl });
            } catch {
              setError("Sign-in could not be started. Please try again.");
            }
          });
        }}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <rect fill="#F25022" height="9" width="9" x="3" y="3" />
          <rect fill="#7FBA00" height="9" width="9" x="12" y="3" />
          <rect fill="#00A4EF" height="9" width="9" x="3" y="12" />
          <rect fill="#FFB900" height="9" width="9" x="12" y="12" />
        </svg>
        <span>{isPending ? "Redirecting to Entra ID..." : "Continue with Microsoft Entra ID"}</span>
      </button>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
