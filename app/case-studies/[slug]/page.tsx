import Link from "next/link";
import { notFound } from "next/navigation";

import {
  DetailBadgeRow,
  DetailBreadcrumbs,
  DetailBulletList,
  DetailGlassPanel,
  DetailKeyValueList,
  DetailNarrativeBlock,
  DetailPageCanvas,
  DetailSection,
  DetailSectionHeading,
  DetailStatGrid,
  detailPrimaryButtonClassName,
  detailSecondaryButtonClassName,
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

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getPublishedCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const overviewParagraphs = splitParagraphs(caseStudy.overview);
  const businessPlanParagraphs = splitParagraphs(caseStudy.businessPlan);
  const executionParagraphs = splitParagraphs(caseStudy.execution);
  const outcomeParagraphs = splitParagraphs(caseStudy.outcomeSummary);
  const takeaways = caseStudy.takeaways.map((takeaway) => takeaway.takeaway);
  const badgeItems = [caseStudy.category ? formatDisplayValue(caseStudy.category) : null].filter(Boolean) as string[];
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

          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(480px,540px)] lg:items-start lg:gap-10">
            <div className="max-w-[710px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                Case Study Detail
              </p>
              <h1 className="mt-4 text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] text-[#111827] sm:text-[48px] lg:text-[62px]">
                {caseStudy.title}
              </h1>
              <p className="mt-5 max-w-[620px] text-[16px] leading-[1.85] text-slate-700 sm:text-[17px]">
                {caseStudy.overview}
              </p>

              <div className="mt-7">
                <DetailBadgeRow items={badgeItems} />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link className={detailPrimaryButtonClassName} href="#case-study-story">
                  Explore the Story
                </Link>
                <Link className={detailSecondaryButtonClassName} href="/case-studies">
                  View More Case Studies
                </Link>
              </div>

              {heroStats.length ? (
                <div className="mt-8">
                  <DetailStatGrid columns={4} items={heroStats} />
                </div>
              ) : null}
            </div>
          </div>
        </DetailSection>

        <DetailSection className="pb-14 lg:pb-18">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]" id="case-study-story">
            <div className="grid gap-6">
              <DetailNarrativeBlock
                body={overviewParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
                eyebrow="Overview"
                title={caseStudy.title}
              />

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
