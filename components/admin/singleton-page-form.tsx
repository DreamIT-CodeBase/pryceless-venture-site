import Link from "next/link";

import { autosaveSingletonPageDraft, saveSingletonPage } from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";
import { singletonPageGroups, singletonPageLabels } from "@/lib/content-blueprint";

export function SingletonPageForm({ page }: { page: any }) {
  const groups = singletonPageGroups[page.key] ?? [];

  return (
    <AdminAutosaveForm
      autosaveAction={autosaveSingletonPageDraft}
      className="space-y-6"
      hiddenRecordIdName=""
      submitAction={saveSingletonPage}
    >
      <input name="key" type="hidden" value={page.key} />
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Template</span><input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500" disabled value={singletonPageLabels[page.key]} /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Page Title</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={page.pageTitle ?? ""} name="pageTitle" required /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Intro</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={page.intro ?? ""} name="intro" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Disclaimer</span><textarea className="min-h-24 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={page.disclaimer ?? ""} name="disclaimer" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">CTA Label</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={page.ctaLabel ?? ""} name="ctaLabel" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">CTA Href</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={page.ctaHref ?? ""} name="ctaHref" /></label>
          {groups.map((group) => (
            <label className="block md:col-span-2" key={group.key}>
              <span className="mb-2 block text-sm font-medium text-slate-700">{group.label}</span>
              <textarea
                className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={page.items.filter((item: any) => item.groupKey === group.key).map((item: any) => item.title).join("\n")}
                name={`group_${group.key}`}
                placeholder={group.placeholder}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="publish">Save Page</button>
        <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/pages">Back to Pages</Link>
      </div>
    </AdminAutosaveForm>
  );
}
