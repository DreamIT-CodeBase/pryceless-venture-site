"use client";

import { useState, useTransition } from "react";

import {
  normalizeDynamicFormFieldType,
  parseStoredFieldOptions,
} from "@/lib/form-fields";

type FormField = {
  id: string;
  fieldKey: string;
  label: string;
  options?: string | null;
  type: string;
  required: boolean;
  placeholder?: string | null;
};

type FormDefinition = {
  slug: string;
  formName: string;
  successMessage: string;
  fields: FormField[];
};

type PropertyInquiryFormProps = {
  form: FormDefinition;
  sourcePath: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  submitLabel?: string;
  className?: string;
};

const inputClassName =
  "w-full rounded-[22px] border border-[#dbe3ec] bg-[#f7fafc] px-5 py-4 text-[15px] text-[#0f172a] outline-none transition placeholder:text-slate-400 focus:border-[#c9a164] focus:bg-white";

export function PropertyInquiryForm({
  form,
  sourcePath,
  title,
  eyebrow = "Form",
  description = "Submit your details and our team will respond with the next steps.",
  submitLabel = "Submit",
  className = "",
}: PropertyInquiryFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className={`rounded-[34px] border border-[#e1e7ef] bg-white px-6 py-7 shadow-[0_28px_64px_rgba(15,23,42,0.08)] sm:px-7 sm:py-8 ${className}`.trim()}
      onSubmit={(event) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const browserFormData = new FormData(formElement);

        startTransition(async () => {
          setMessage("");
          setError("");

          try {
            const response = await fetch(`/api/forms/${form.slug}/submit`, {
              method: "POST",
              body: browserFormData,
            });

            const result = (await response.json()) as {
              success?: boolean;
              message?: string;
              error?: string;
            };

            if (!response.ok || !result.success) {
              setError(result.error ?? "We were not able to submit your request.");
              return;
            }

            formElement.reset();
            setMessage(result.message ?? form.successMessage);
          } catch {
            setError("We were not able to submit your request.");
          }
        });
      }}
    >
      <input name="sourcePath" type="hidden" value={sourcePath} />

      <div className="space-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#cf9b66]">
          {eyebrow}
        </p>
        <h3 className="text-[30px] font-bold leading-[1.04] tracking-[-0.04em] text-[#182544] sm:text-[34px]">
          {title ?? form.formName}
        </h3>
        <p className="max-w-[520px] text-[15px] leading-[1.7] text-[#617187]">
          {description}
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {form.fields.map((field) => {
          const fieldType = normalizeDynamicFormFieldType(field.type);
          const options = parseStoredFieldOptions(field.options);
          const inputType =
            fieldType === "EMAIL"
              ? "email"
              : fieldType === "PHONE"
                ? "tel"
                : fieldType === "NUMBER"
                  ? "number"
                  : fieldType === "FILE"
                    ? "file"
                    : "text";

          return (
            <div key={field.id}>
              <label
                className="mb-3 block text-[15px] font-semibold tracking-[-0.02em] text-[#182544]"
                htmlFor={field.id}
              >
                {field.label}
              </label>

              {fieldType === "TEXTAREA" ? (
                <textarea
                  className={`${inputClassName} min-h-[150px] resize-y`}
                  id={field.id}
                  name={field.fieldKey}
                  placeholder={field.placeholder ?? undefined}
                  required={field.required}
                />
              ) : fieldType === "SELECT" ? (
                <select
                  className={`${inputClassName} min-h-[62px]`}
                  defaultValue=""
                  id={field.id}
                  name={field.fieldKey}
                  required={field.required}
                >
                  <option value="">{field.placeholder || "Select an option"}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : fieldType === "RADIO" ? (
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <label
                      className={`${inputClassName} flex items-center gap-3`}
                      key={`${field.id}-${option}`}
                    >
                      <input
                        className="h-4 w-4"
                        name={field.fieldKey}
                        required={field.required && index === 0}
                        type="radio"
                        value={option}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  className={`${inputClassName} min-h-[62px]`}
                  id={field.id}
                  name={field.fieldKey}
                  placeholder={field.placeholder ?? undefined}
                  required={field.required}
                  type={inputType}
                />
              )}
            </div>
          );
        })}
      </div>

      {message ? (
        <p className="mt-5 rounded-[20px] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-5 rounded-[20px] bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <button
        className="mt-7 w-full rounded-[20px] bg-[#16213c] px-6 py-4 text-[17px] font-semibold text-white shadow-[0_18px_36px_rgba(22,33,60,0.16)] transition hover:bg-[#1e2b4d] disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
