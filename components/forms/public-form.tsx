"use client";

import { useState, useTransition } from "react";

type FormField = {
  id: string;
  fieldKey: string;
  label: string;
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
};

export function PublicForm({ form, sourcePath, title, theme = "light" }: PublicFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isDark = theme === "dark";

  return (
    <form
      className={`space-y-5 rounded-[30px] p-6 sm:p-8 ${
        isDark
          ? "border border-white/12 bg-[linear-gradient(180deg,rgba(10,24,41,0.86)_0%,rgba(7,17,31,0.96)_100%)] text-white shadow-[0_30px_90px_rgba(2,10,20,0.4)] backdrop-blur-xl"
          : "pv-card-shadow border border-slate-200 bg-white"
      }`}
      onSubmit={(event) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const browserFormData = new FormData(formElement);
        const values = Object.fromEntries(browserFormData.entries());

        startTransition(async () => {
          setMessage("");
          setError("");

          const response = await fetch(`/api/forms/${form.slug}/submit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sourcePath,
              values,
            }),
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
        });
      }}
    >
      <div className="space-y-2">
        <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? "text-white/54" : "text-[var(--pv-sand)]"}`}>
          Form
        </p>
        <h3 className={`text-[28px] font-bold ${isDark ? "text-white" : "text-[var(--pv-ink)]"}`}>
          {title ?? form.formName}
        </h3>
        <p className={`text-sm leading-7 ${isDark ? "text-white/72" : "text-[var(--pv-text)]"}`}>
          Submit your details and our team will respond with the next steps.
        </p>
      </div>

      {form.fields.map((field) => {
        const inputType =
          field.type === "EMAIL" ? "email" : field.type === "PHONE" ? "tel" : "text";

        return (
          <label className="block" key={field.id}>
            <span className={`mb-2 block text-sm font-semibold ${isDark ? "text-white/84" : "text-[var(--pv-ink)]"}`}>
              {field.label}
            </span>
            {field.type === "TEXTAREA" ? (
              <textarea
                className={`min-h-32 w-full rounded-[18px] px-4 py-3 text-sm outline-none transition ${
                  isDark
                    ? "border border-white/10 bg-white/[0.06] text-white placeholder:text-white/28 focus:border-white/28 focus:bg-white/[0.1]"
                    : "border border-slate-200 bg-[#f7fafc] text-slate-900 focus:border-[var(--pv-sky)] focus:bg-white"
                }`}
                name={field.fieldKey}
                placeholder={field.placeholder ?? undefined}
                required={field.required}
              />
            ) : (
              <input
                className={`w-full rounded-[18px] px-4 py-3 text-sm outline-none transition ${
                  isDark
                    ? "border border-white/10 bg-white/[0.06] text-white placeholder:text-white/28 focus:border-white/28 focus:bg-white/[0.1]"
                    : "border border-slate-200 bg-[#f7fafc] text-slate-900 focus:border-[var(--pv-sky)] focus:bg-white"
                }`}
                name={field.fieldKey}
                placeholder={field.placeholder ?? undefined}
                required={field.required}
                type={inputType}
              />
            )}
          </label>
        );
      })}

      {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

      <button
        className={`w-full rounded-[18px] px-5 py-3.5 text-sm font-semibold text-white transition disabled:opacity-70 ${
          isDark
            ? "border border-white/12 bg-[linear-gradient(135deg,#204f78_0%,#17344f_54%,#102538_100%)] hover:bg-[linear-gradient(135deg,#26618f_0%,#1a4266_54%,#13304a_100%)]"
            : "bg-[var(--pv-navy)] hover:bg-[var(--pv-navy-soft)]"
        }`}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
