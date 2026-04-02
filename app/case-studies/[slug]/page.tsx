import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import {
  DetailBreadcrumbs,
  DetailBulletList,
  DetailGlassPanel,
  DetailKeyValueList,
  DetailNarrativeBlock,
  DetailPageCanvas,
  DetailSection,
  DetailSectionHeading,
  DetailStatGrid,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedCaseStudy } from "@/lib/data/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const formatDisplayValue = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const splitParagraphs = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

const legacyCaseStudySlugRedirects: Record<string, string> = {
  "hidden-gems-underrated-neighborhoods-with-big-potential":
    "stabilizing-a-sunbelt-workforce-housing-community",
  "how-to-choose-the-right-property-for-your-growing-family":
    "modernizing-a-dated-family-home-for-faster-resale",
  "luxury-real-estate-boom-the-most-sought-after-properties":
    "restoring-curb-appeal-to-rebuild-market-confidence",
  "smart-renovations-that-unlock-long-term-neighborhood-value":
    "recovering-occupancy-in-a-mismanaged-rental-community",
  "communities-designed-for-growth-stability-and-everyday-living":
    "resident-focused-turns-that-lifted-renewal-rates",
  "refined-interiors-that-elevate-comfort-light-and-modern-appeal":
    "bedroom-light-and-finish-refresh-for-a-stronger-launch",
  "turning-operational-drag-into-a-repeatable-performance-playbook":
    "resetting-vendor-discipline-in-a-mid-sized-residential-asset",
  "repositioning-dated-inventory-for-todays-design-conscious-buyers":
    "dining-and-flow-upgrades-that-reframed-buyer-perception",
  "from-acquisition-to-acceleration-building-durable-long-term-returns":
    "scaling-a-24-unit-portfolio-with-centralized-operations",
};

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getPublishedCaseStudy(slug);

  if (!caseStudy) {
    const legacyRedirect = legacyCaseStudySlugRedirects[slug];
    if (legacyRedirect) {
      redirect(`/case-studies/${legacyRedirect}`);
    }

    notFound();
  }

  const overviewParagraphs = splitParagraphs(caseStudy.overview);
  const businessPlanParagraphs = splitParagraphs(caseStudy.businessPlan);
  const executionParagraphs = splitParagraphs(caseStudy.execution);
  const outcomeParagraphs = splitParagraphs(caseStudy.outcomeSummary);
  const takeaways = caseStudy.takeaways.map((takeaway) => takeaway.takeaway);
  const heroImage = caseStudy.primaryImage ?? caseStudy.images[0] ?? null;
  const heroImageUrl = heroImage?.mediaFile.blobUrl ?? null;
  const heroStats =
    caseStudy.assetProfile.slice(0, 4).map((item) => ({
      label: item.label,
      value: item.value,
    })) || [];

  return (
    <SiteShell cta={{ href: "/case-studies", label: "Back to Case Studies" }}>
      <DetailPageCanvas>
        <DetailSection className="pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
          <DetailBreadcrumbs currentLabel={caseStudy.title} href="/" />

          <div
            className={
              heroImageUrl
                ? "mt-7 grid gap-8 lg:grid-cols-[minmax(0,760px)_minmax(440px,520px)] lg:items-start lg:gap-12"
                : "mt-7"
            }
          >
            <div className="max-w-[760px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[#bf9375] sm:text-[13px]">
                Case Study Detail
              </p>
              <h1 className="mt-3 max-w-[660px] text-balance text-[32px] font-medium leading-[1.02] tracking-[-0.05em] text-[#111827] sm:text-[42px] lg:text-[52px]">
                {caseStudy.title}
              </h1>
              <p className="mt-10 max-w-[760px] text-[16px] leading-[1.78] text-slate-700 sm:mt-12 sm:text-[17px]">
                {overviewParagraphs[0] ?? caseStudy.overview}
              </p>

              {heroStats.length ? (
                <div className="mt-14 max-w-[980px] sm:mt-16">
                  <DetailStatGrid columns={4} items={heroStats} />
                </div>
              ) : null}

              <div className="mt-14 hidden lg:block">
                <DetailNarrativeBlock
                  body={overviewParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                  eyebrow="Overview"
                  title={caseStudy.title}
                />
              </div>
            </div>

            {heroImageUrl ? (
              <div className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.38)]">
                <Image
                  alt={
                    heroImage?.altText ??
                    heroImage?.mediaFile.altText ??
                    caseStudy.title
                  }
                  className="object-cover"
                  fill
                  sizes="(max-width: 1023px) 100vw, 540px"
                  src={heroImageUrl}
                />
              </div>
            ) : null}
          </div>
        </DetailSection>

        <DetailSection className="pb-14 lg:pb-18">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]" id="case-study-story">
            <div className="grid gap-6">
              <div className="lg:hidden">
                <DetailNarrativeBlock
                  body={overviewParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                  eyebrow="Overview"
                  title={caseStudy.title}
                />
              </div>

              <DetailNarrativeBlock
                body={businessPlanParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
                eyebrow="Business Plan"
                title="How the strategy was structured"
              />

              <DetailNarrativeBlock
                body={executionParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
                eyebrow="Execution"
                title="What moved the asset from concept to result"
              />
            </div>

            <div className="grid gap-6 lg:sticky lg:top-[96px] lg:self-start">
              {caseStudy.assetProfile.length ? (
                <DetailGlassPanel>
                  <DetailSectionHeading eyebrow="Asset Profile" title="Asset Profile" />
                  <div className="mt-5">
                    <DetailKeyValueList
                      items={caseStudy.assetProfile.map((item) => ({
                        label: item.label,
                        value: item.value,
                      }))}
                    />
                  </div>
                </DetailGlassPanel>
              ) : null}

              {outcomeParagraphs.length ? (
                <DetailGlassPanel>
                  <DetailSectionHeading
                    body={outcomeParagraphs[0]}
                    eyebrow="Outcome Summary"
                    title="Outcome Summary"
                  />
                  {outcomeParagraphs.length > 1 ? (
                    <div className="mt-4 space-y-4 text-[15px] leading-[1.82] text-slate-700 sm:text-[16px]">
                      {outcomeParagraphs.slice(1).map((paragraph, index) => (
                        <p key={`${paragraph}-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}
                </DetailGlassPanel>
              ) : null}
            </div>
          </div>
        </DetailSection>

        {takeaways.length ? (
          <DetailSection className="pb-14 lg:pb-18">
            <DetailGlassPanel>
              <DetailSectionHeading eyebrow="Key Takeaways" title="Takeaways" />
              <div className="mt-5">
                <DetailBulletList items={takeaways} />
              </div>
            </DetailGlassPanel>
          </DetailSection>
        ) : null}
      </DetailPageCanvas>
    </SiteShell>
  );
}
