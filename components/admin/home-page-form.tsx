import Link from "next/link";

import { autosaveHomePageDraft, saveHomePage } from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";
import { HomeTestimonialsEditor } from "@/components/admin/home-testimonials-editor";
import { ImageUrlField } from "@/components/admin/image-url-field";

export function HomePageForm({ homePage }: { homePage: any }) {
  const aboutSectionDefaults = {
    title: homePage?.aboutSectionTitle ?? "Why Pryceless Ventures, LLC",
    paragraphOne:
      homePage?.aboutSectionParagraphOne ??
      homePage?.heroSubheadline ??
      "",
    paragraphTwo:
      homePage?.aboutSectionParagraphTwo ??
      homePage?.segments?.slice(0, 2).map((item: any) => item.body).join(" ") ??
      "",
    primaryCtaLabel:
      homePage?.aboutSectionPrimaryCtaLabel ??
      homePage?.heroPrimaryCtaLabel ??
      "",
    primaryCtaHref:
      homePage?.aboutSectionPrimaryCtaHref ??
      homePage?.heroPrimaryCtaHref ??
      "",
    secondaryCtaLabel:
      homePage?.aboutSectionSecondaryCtaLabel ??
      homePage?.heroSecondaryCtaLabel ??
      "",
    secondaryCtaHref:
      homePage?.aboutSectionSecondaryCtaHref ??
      homePage?.heroSecondaryCtaHref ??
      "",
    imageAlt: homePage?.aboutSectionImageAlt ?? "Interior bedroom",
  };

  return (
    <AdminAutosaveForm
      autosaveAction={autosaveHomePageDraft}
      className="space-y-6"
      hiddenRecordIdName=""
      submitAction={saveHomePage}
    >
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hero</p>
          </div>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Hero Headline</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroHeadline ?? ""} name="heroHeadline" required /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Hero Subheadline</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroSubheadline ?? ""} name="heroSubheadline" required /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Primary CTA Label</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroPrimaryCtaLabel ?? ""} name="heroPrimaryCtaLabel" required /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Primary CTA Href</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroPrimaryCtaHref ?? ""} name="heroPrimaryCtaHref" required /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Secondary CTA Label</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroSecondaryCtaLabel ?? ""} name="heroSecondaryCtaLabel" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Secondary CTA Href</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.heroSecondaryCtaHref ?? ""} name="heroSecondaryCtaHref" /></label>
          <div className="mt-4 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why Section</p>
            <p className="mt-1 max-w-[720px] text-sm text-slate-500">
              Manage the title, two supporting paragraphs, CTA buttons, and image shown in the
              "Why Pryceless Ventures, LLC" section on the homepage.
            </p>
          </div>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Section Title</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={aboutSectionDefaults.title} name="aboutSectionTitle" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Paragraph One</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={aboutSectionDefaults.paragraphOne} name="aboutSectionParagraphOne" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Paragraph Two</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={aboutSectionDefaults.paragraphTwo} name="aboutSectionParagraphTwo" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Section Primary CTA Label</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={aboutSectionDefaults.primaryCtaLabel} name="aboutSectionPrimaryCtaLabel" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Section Primary CTA Href</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={aboutSectionDefaults.primaryCtaHref} name="aboutSectionPrimaryCtaHref" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Section Secondary CTA Label</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={aboutSectionDefaults.secondaryCtaLabel} name="aboutSectionSecondaryCtaLabel" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Section Secondary CTA Href</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={aboutSectionDefaults.secondaryCtaHref} name="aboutSectionSecondaryCtaHref" /></label>
          <ImageUrlField
            description="Upload a homepage image here. Leaving it blank keeps the bundled default image on the live site."
            folder="home-about-section"
            initialValue={homePage?.aboutSectionImageUrl ?? ""}
            label="Section Image"
            name="aboutSectionImageUrl"
            previewAlt={aboutSectionDefaults.imageAlt}
          />
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Section Image Alt Text</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={aboutSectionDefaults.imageAlt} name="aboutSectionImageAlt" /></label>
          <div className="mt-4 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Metrics And Cards</p>
          </div>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Portfolio Value Display</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.portfolioValueDisplay ?? ""} name="portfolioValueDisplay" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Portfolio Caption</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.portfolioCaption ?? ""} name="portfolioCaption" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Metrics</span><textarea className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.metrics?.map((item: any) => `${item.metricValue} | ${item.metricLabel}`).join("\n") ?? ""} name="metricsText" placeholder="Metric Value | Metric Label" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Segments</span><textarea className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.segments?.map((item: any) => `${item.title} | ${item.body} | ${item.ctaLabel} | ${item.ctaHref}`).join("\n") ?? ""} name="segmentsText" placeholder="Title | Body | CTA Label | CTA Href" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Platform Cards</span><textarea className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.platformCards?.map((item: any) => `${item.title} | ${item.body} | ${item.ctaLabel} | ${item.ctaHref}`).join("\n") ?? ""} name="platformCardsText" placeholder="Title | Body | CTA Label | CTA Href" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Case Highlights</span><textarea className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={homePage?.caseHighlights?.map((item: any) => `${item.title} | ${item.body} | ${item.ctaLabel} | ${item.ctaHref}`).join("\n") ?? ""} name="caseHighlightsText" placeholder="Title | Body | CTA Label | CTA Href" /></label>
          <HomeTestimonialsEditor initialTestimonials={homePage?.testimonials ?? []} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">Save Home Page</button>
        <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/pages">Back to Pages</Link>
      </div>
    </AdminAutosaveForm>
  );
}
