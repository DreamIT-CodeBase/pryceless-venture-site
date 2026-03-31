import Link from "next/link";

import { autosaveCaseStudyDraft, deleteCaseStudy, saveCaseStudy } from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";
import { caseStudyCategoryOptions } from "@/lib/content-blueprint";

export function CaseStudyForm({
  caseStudy,
  errorMessage,
}: {
  caseStudy?: any;
  errorMessage?: string;
}) {
  return (
    <div className="space-y-6">
      <AdminAutosaveForm
        autosaveAction={autosaveCaseStudyDraft}
        className="space-y-6"
        initialRecordId={caseStudy?.id ?? ""}
        submitAction={saveCaseStudy}
      >
        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={caseStudy?.title ?? ""} minLength={2} name="title" required />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={caseStudy?.category ?? "VALUE_ADD_MULTIFAMILY"} name="category">
                {caseStudyCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Overview</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={caseStudy?.overview ?? ""} minLength={10} name="overview" required /></label>
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Business Plan</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={caseStudy?.businessPlan ?? ""} minLength={10} name="businessPlan" required /></label>
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Execution</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={caseStudy?.execution ?? ""} minLength={10} name="execution" required /></label>
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Outcome Summary</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={caseStudy?.outcomeSummary ?? ""} minLength={10} name="outcomeSummary" required /></label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Asset Profile</span>
              <textarea
                className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={caseStudy?.assetProfile?.map((item: any) => `${item.label} | ${item.value}`).join("\n") ?? ""}
                name="assetProfileText"
                placeholder="Label | Value"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Key Takeaways</span>
              <textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={caseStudy?.takeaways?.map((item: any) => item.takeaway).join("\n") ?? ""} name="takeawaysText" placeholder="One takeaway per line" />
            </label>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="draft">Save Draft</button>
          <button className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="publish">Publish</button>
          <button className="rounded-full border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800" name="intent" type="submit" value="archive">Archive</button>
          <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/case-studies">Back to List</Link>
        </div>
      </AdminAutosaveForm>

      {caseStudy?.id ? (
        <form action={deleteCaseStudy}>
          <input name="recordId" type="hidden" value={caseStudy.id} />
          <button className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700" type="submit">Delete Case Study</button>
        </form>
      ) : null}
    </div>
  );
}
