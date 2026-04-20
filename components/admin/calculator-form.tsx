import Link from "next/link";

import { autosaveCalculatorDraft, deleteCalculator, saveCalculator } from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";
import { calculatorTypeOptions } from "@/lib/content-blueprint";
import { SubmitButton } from "@/components/admin/submit-button";

export function CalculatorForm({
  calculator,
  errorMessage,
}: {
  calculator?: any;
  errorMessage?: string;
}) {
  return (
    <div className="space-y-6">
      <AdminAutosaveForm
        autosaveAction={autosaveCalculatorDraft}
        className="space-y-6"
        initialRecordId={calculator?.id ?? ""}
        submitAction={saveCalculator}
      >
        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Title</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={calculator?.title ?? ""} minLength={2} name="title" required /></label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Calculator Type</span>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={calculator?.calculatorType ?? "ROI"} name="calculatorType">
                {calculatorTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Short Description</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={calculator?.shortDescription ?? ""} name="shortDescription" /></label>
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Disclaimer</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={calculator?.disclaimer ?? ""} minLength={10} name="disclaimer" required /></label>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" name="intent"  value="draft">Save Draft</SubmitButton>
          <SubmitButton className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white" name="intent"  value="publish">Publish</SubmitButton>
          <SubmitButton className="rounded-full border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800" name="intent"  value="archive">Archive</SubmitButton>
          <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/calculators">Back to List</Link>
        </div>
      </AdminAutosaveForm>

      {calculator?.id ? (
        <form action={deleteCalculator}>
          <input name="recordId" type="hidden" value={calculator.id} />
          <SubmitButton className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700" >Delete Calculator</SubmitButton>
        </form>
      ) : null}
    </div>
  );
}
