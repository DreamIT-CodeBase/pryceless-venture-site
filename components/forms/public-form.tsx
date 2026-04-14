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

type PublicFormProps = {
  form: FormDefinition;
  sourcePath: string;
  title?: string;
  theme?: "light" | "dark";
  layout?: "stacked" | "wide";
  eyebrow?: string | null;
  description?: string | null;
  submitLabel?: string;
  className?: string;
  submitButtonClassName?: string;
};

export function PublicForm({
  form,
  sourcePath,
  title,
  theme = "light",
  layout = "stacked",
  eyebrow = "Form",
  description = "Submit your details and our team will respond with the next steps.",
  submitLabel = "Submit",
  className = "",
  submitButtonClassName = "",
}: PublicFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isDark = theme === "dark";
  const isWide = layout === "wide";
  const inputClassName = isDark
    ? "border border-white/10 bg-white/[0.06] text-white placeholder:text-white/28 focus:border-white/28 focus:bg-white/[0.1]"
    : "border border-slate-200 bg-[#f7fafc] text-slate-900 focus:border-[var(--pv-sky)] focus:bg-white";
  const labelClassName = isDark ? "text-white/84" : "text-[var(--pv-ink)]";

  return (
    <form
      className={`rounded-[30px] p-6 sm:p-8 ${
        isDark
          ? "border border-white/12 bg-[linear-gradient(180deg,rgba(10,24,41,0.86)_0%,rgba(7,17,31,0.96)_100%)] text-white shadow-[0_30px_90px_rgba(2,10,20,0.4)] backdrop-blur-xl"
          : "pv-card-shadow border border-slate-200 bg-white"
      } ${className}`.trim()}
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

      <div className="space-y-2">
        {eyebrow ? (
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? "text-white/54" : "text-[var(--pv-sand)]"}`}>
            {eyebrow}
          </p>
        ) : null}
        <h3 className={`text-[28px] font-bold ${isDark ? "text-white" : "text-[var(--pv-ink)]"}`}>
          {title ?? form.formName}
        </h3>
        {description ? (
          <p className={`text-sm leading-7 ${isDark ? "text-white/72" : "text-[var(--pv-text)]"}`}>
            {description}
          </p>
        ) : null}
      </div>

      <div className={isWide ? "mt-6 grid gap-5 md:grid-cols-2" : "mt-6 space-y-5"}>
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
          const isFullWidthField =
            fieldType === "FILE" || fieldType === "RADIO" || fieldType === "TEXTAREA";

          return (
            <div
              className={`block ${isWide && isFullWidthField ? "md:col-span-2" : ""}`}
              key={field.id}
            >
              <span className={`mb-2 block text-sm font-semibold ${labelClassName}`}>
                {field.label}
              </span>
              {fieldType === "TEXTAREA" ? (
                <textarea
                  className={`min-h-32 w-full rounded-[18px] px-4 py-3 text-sm outline-none transition ${inputClassName}`}
                  name={field.fieldKey}
                  placeholder={field.placeholder ?? undefined}
                  required={field.required}
                />
              ) : fieldType === "SELECT" ? (
                <select
                  className={`w-full rounded-[18px] px-4 py-3 text-sm outline-none transition ${inputClassName}`}
                  defaultValue=""
                  name={field.fieldKey}
                  required={field.required}
                >
                  <option value="">
                    {field.placeholder || "Select an option"}
                  </option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : fieldType === "RADIO" ? (
                <div className={`space-y-3 ${isWide ? "md:grid md:grid-cols-2 md:gap-3 md:space-y-0" : ""}`}>
                  {options.map((option, index) => (
                    <label
                      className={`flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm transition ${inputClassName}`}
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
                  className={`w-full rounded-[18px] px-4 py-3 text-sm outline-none transition ${inputClassName}`}
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

      {message ? <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

      <button
        className={`${isWide ? "mt-6 w-full md:w-auto md:min-w-[220px]" : "w-full"} rounded-[18px] px-5 py-3.5 text-sm font-semibold text-white transition disabled:opacity-70 ${
          isDark
            ? "border border-white/12 bg-[linear-gradient(135deg,#204f78_0%,#17344f_54%,#102538_100%)] hover:bg-[linear-gradient(135deg,#26618f_0%,#1a4266_54%,#13304a_100%)]"
            : "bg-[var(--pv-navy)] hover:bg-[var(--pv-navy-soft)]"
        } ${submitButtonClassName}`.trim()}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
