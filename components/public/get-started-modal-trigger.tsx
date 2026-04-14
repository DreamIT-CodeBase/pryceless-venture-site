"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import viewOpportunityHeaderIcon from "@/app/assets/viewoppertunitysvg.svg";
import { PublicForm } from "@/components/forms/public-form";

export type GetStartedFormDefinition = {
  slug: string;
  formName: string;
  successMessage: string;
  fields: Array<{
    fieldKey: string;
    id: string;
    label: string;
    options?: string | null;
    placeholder?: string | null;
    required: boolean;
    type: string;
  }>;
};

export function GetStartedModalTrigger({
  form,
  variant,
  onTriggerClick,
}: {
  form: GetStartedFormDefinition | null;
  variant: "desktop" | "mobile";
  onTriggerClick?: () => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const triggerLabel = "Contact Us";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOpen = () => {
    onTriggerClick?.();
    setIsOpen(true);
  };

  if (!form) {
    return variant === "desktop" ? (
      <Link
        className="inline-flex h-[50px] w-[196px] items-center justify-center rounded-[6px] bg-[#18357a] px-[14px] text-[15px] font-medium leading-none text-white transition-none hover:bg-[#18357a] hover:text-white"
        href="/cash-offer"
      >
        {triggerLabel}
      </Link>
    ) : (
      <Link
        className="mt-4 inline-flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#18357a] px-5 text-[15px] font-medium leading-none !text-white transition hover:bg-[#18357a] hover:!text-white visited:!text-white"
        href="/cash-offer"
        onClick={onTriggerClick}
      >
        <span className="!text-white">{triggerLabel}</span>
      </Link>
    );
  }

  return (
    <>
      {variant === "desktop" ? (
        <button
          className="inline-flex h-[50px] w-[196px] items-center justify-center gap-[9px] rounded-[6px] bg-[#18357a] px-[14px] text-[15px] font-medium leading-none text-white transition-none hover:bg-[#18357a] hover:text-white"
          onClick={handleOpen}
          type="button"
        >
          <span className="flex shrink-0 items-center gap-[7px]">
            <Image
              alt=""
              className="h-[19px] w-[16px] object-contain"
              src={viewOpportunityHeaderIcon}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(181deg) brightness(115%) contrast(108%)",
              }}
            />
            <span className="block h-[22px] w-px shrink-0 bg-white/40" />
          </span>
          <span className="whitespace-nowrap leading-none tracking-[-0.016em] text-white">
            {triggerLabel}
          </span>
        </button>
      ) : (
        <button
          className="mt-4 inline-flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#18357a] px-5 text-[15px] font-medium leading-none !text-white transition hover:bg-[#18357a] hover:!text-white"
          onClick={handleOpen}
          type="button"
        >
          <span className="!text-white">{triggerLabel}</span>
        </button>
      )}

      {isOpen ? (
        <div
          aria-hidden={!isOpen}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0f172a]/55 px-4 py-6 sm:px-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            aria-modal="true"
            className="relative max-h-[min(88vh,920px)] w-full max-w-[930px] overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.22)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Close contact form"
              className="absolute right-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>

            <PublicForm
              className="border-0 bg-white p-6 shadow-none sm:p-8"
              description="Share your details and our team will follow up with the right next step."
              eyebrow={null}
              form={form}
              layout="wide"
              sourcePath={pathname || "/"}
              submitButtonClassName="rounded-[14px] bg-[#0f2438] px-8 py-3 hover:bg-[#18314b] md:min-w-[124px]"
              submitLabel="Submit"
              title="Connect with Us"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
