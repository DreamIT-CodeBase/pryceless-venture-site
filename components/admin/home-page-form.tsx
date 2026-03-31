import Link from "next/link";

import { autosaveHomePageDraft, saveHomePage } from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";

export function HomePageForm({ homePage }: { homePage: any }) {
  return (
    <AdminAutosaveForm
      autosaveAction={autosaveHomePageDraft}
      className="space-y-6"
      hiddenRecordIdName=""
      submitAction={saveHomePage}
    >
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Hero Headline</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroHeadline ?? ""} name="heroHeadline" required /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Hero Subheadline</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroSubheadline ?? ""} name="heroSubheadline" required /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Primary CTA Label</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroPrimaryCtaLabel ?? ""} name="heroPrimaryCtaLabel" required /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Primary CTA Href</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroPrimaryCtaHref ?? ""} name="heroPrimaryCtaHref" required /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Secondary CTA Label</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroSecondaryCtaLabel ?? ""} name="heroSecondaryCtaLabel" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Secondary CTA Href</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroSecondaryCtaHref ?? ""} name="heroSecondaryCtaHref" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Metrics Disclaimer</span><textarea className="min-h-24 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.metricsDisclaimer ?? ""} name="metricsDisclaimer" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Portfolio Value Display</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.portfolioValueDisplay ?? ""} name="portfolioValueDisplay" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Portfolio Caption</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.portfolioCaption ?? ""} name="portfolioCaption" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Metrics</span><textarea className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.metrics?.map((item: any) => `${item.metricValue} | ${item.metricLabel}`).join("\n") ?? ""} name="metricsText" placeholder="Metric Value | Metric Label" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Segments</span><textarea className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.segments?.map((item: any) => `${item.title} | ${item.body} | ${item.ctaLabel} | ${item.ctaHref}`).join("\n") ?? ""} name="segmentsText" placeholder="Title | Body | CTA Label | CTA Href" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Platform Cards</span><textarea className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.platformCards?.map((item: any) => `${item.title} | ${item.body} | ${item.ctaLabel} | ${item.ctaHref}`).join("\n") ?? ""} name="platformCardsText" placeholder="Title | Body | CTA Label | CTA Href" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Case Highlights</span><textarea className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.caseHighlights?.map((item: any) => `${item.title} | ${item.body} | ${item.ctaLabel} | ${item.ctaHref}`).join("\n") ?? ""} name="caseHighlightsText" placeholder="Title | Body | CTA Label | CTA Href" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Testimonials</span><textarea className="min-h-48 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.testimonials?.map((item: any) => `${item.name} | ${item.city} | ${item.quote} | ${item.avatarUrl ?? ""}`).join("\n") ?? ""} name="testimonialsText" placeholder="Name | City | Quote | Avatar URL (optional)" /></label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">Save Home Page</button>
        <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/pages">Back to Pages</Link>
      </div>
    </AdminAutosaveForm>
  );
}
