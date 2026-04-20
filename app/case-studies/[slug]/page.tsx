import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  DetailMediaCarousel,
  type DetailMediaCarouselItem,
} from "@/components/public/detail-media-carousel";
import {
  DetailBreadcrumbs,
  DetailPageCanvas,
  DetailSection,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedCaseStudy, getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const serifHeadingStyle = {
  fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
};

type CaseStudyDetailRecord = NonNullable<
  Awaited<ReturnType<typeof getPublishedCaseStudy>>
>;

const formatDisplayValue = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const splitParagraphs = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const normalizeContentLine = (value: string | null | undefined) =>
  String(value ?? "").replace(/\s+/g, " ").trim();

const getCmsText = (value: string | null | undefined) => {
  const normalized = normalizeContentLine(value);
  return normalized || null;
};

const getPageGroupItems = (
  page: Awaited<ReturnType<typeof getSingletonPage>>,
  groupKey: string,
) => page?.items.filter((item) => item.groupKey === groupKey) ?? [];

const getPageGroupItem = (
  page: Awaited<ReturnType<typeof getSingletonPage>>,
  groupKey: string,
  index = 0,
) => getPageGroupItems(page, groupKey)[index] ?? null;

const splitLeadLine = (value: string) => {
  const match = value.match(/^(.{18,120}?[.!?])\s+(.+)$/);

  if (match) {
    return { body: match[2], lead: match[1] };
  }

  return { body: "", lead: value };
};

const collectUniqueStrings = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>();
  const items: string[] = [];

  values.forEach((value) => {
    const normalized = String(value ?? "").trim();

    if (!normalized) {
      return;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    items.push(normalized);
  });

  return items;
};

const createGalleryItems = (caseStudy: CaseStudyDetailRecord) => {
  const items: DetailMediaCarouselItem[] = [];
  const seen = new Set<string>();

  const pushImage = (
    src: string | null | undefined,
    alt: string,
    caption?: string | null,
  ) => {
    const normalized = String(src ?? "").trim();

    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    items.push({
      alt,
      caption: caption ?? undefined,
      eyebrow: caption ? `Gallery ${String(items.length + 1).padStart(2, "0")}` : undefined,
      id: `case-study-gallery-${items.length}`,
      src: normalized,
    });
  };

  pushImage(
    caseStudy.primaryImage?.mediaFile.blobUrl,
    caseStudy.primaryImage?.altText ??
      caseStudy.primaryImage?.mediaFile.altText ??
      caseStudy.title,
  );

  caseStudy.images.forEach((image, index) => {
    pushImage(
      image.mediaFile.blobUrl,
      image.altText || image.mediaFile.altText || `${caseStudy.title} image ${index + 1}`,
      image.caption,
    );
  });

  return items;
};

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

function TrendIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5 16 11 10l3.25 3.25L19 8.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M15.5 8.5H19v3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function DollarIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4v16M15.75 7.25c0-1.38-1.68-2.5-3.75-2.5S8.25 5.87 8.25 7.25s1.68 2.5 3.75 2.5 3.75 1.12 3.75 2.5-1.68 2.5-3.75 2.5-3.75-1.12-3.75-2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect
        height="13.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
        width="15.5"
        x="4.25"
        y="6.25"
      />
      <path
        d="M8 3.75v5M16 3.75v5M4.25 10.25h15.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function BuildingIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M6.25 20V5.75A1.75 1.75 0 0 1 8 4h8a1.75 1.75 0 0 1 1.75 1.75V20M3.75 20h16.5M10 8.25h1.5M12.5 8.25H14M10 11.5h1.5M12.5 11.5H14M10 14.75h1.5M12.5 14.75H14M10.75 20v-2.75h2.5V20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MedalIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m8.25 4.5 3.75 5 3.75-5M12 14a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m12 3.75 1.95 4.8 4.8 1.95-4.8 1.95L12 17.25l-1.95-4.8-4.8-1.95 4.8-1.95L12 3.75ZM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CheckCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.5 12.5 11 15l4.5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CaseSectionHeading({
  title,
  description,
}: {
  description?: string;
  title: string;
}) {
  return (
    <div>
      <h2
        className="text-[36px] font-semibold leading-[1.06] tracking-[-0.03em] text-[#101828] sm:text-[42px]"
        style={serifHeadingStyle}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-[760px] text-[15px] leading-[1.8] text-slate-600 sm:text-[16px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function CaseValueCard({
  icon,
  label,
  toneClassName,
  value,
}: {
  icon: ReactNode;
  label: string;
  toneClassName: string;
  value: string;
}) {
  return (
    <div className="rounded-[28px] border border-[#e6e8ef] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
      <div className={`grid h-12 w-12 place-items-center rounded-full ${toneClassName}`}>
        {icon}
      </div>
      <p className="mt-5 text-[19px] font-semibold tracking-[-0.03em] text-[#0f1d3c] sm:text-[20px]">
        {value}
      </p>
      <p className="mt-2 text-[15px] leading-[1.5] text-slate-500">{label}</p>
    </div>
  );
}

function CaseStandoutCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex gap-5 rounded-[28px] border border-[#e6e8ef] bg-white px-7 py-6 shadow-[0_14px_28px_rgba(15,23,42,0.06)]">
      <div className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#d7a550_0%,#dc8400_100%)] text-white shadow-[0_16px_30px_rgba(220,132,0,0.2)]">
        {icon}
      </div>
      <div>
        <h3
          className="text-[18px] font-semibold leading-[1.25] tracking-[-0.03em] text-[#101828] sm:text-[20px]"
          style={serifHeadingStyle}
        >
          {title}
        </h3>
        <p className="mt-2.5 text-[15px] leading-[1.7] text-slate-600 sm:text-[16px]">
          {description}
        </p>
      </div>
    </div>
  );
}

function TakeawayItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-4 text-[18px] leading-[1.45] tracking-[-0.02em] text-[#0f172a] sm:text-[20px]">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#faf6ef] text-[#cca24f]">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [page, caseStudy] = await Promise.all([
    getSingletonPage("CASE_STUDY_DETAIL"),
    getPublishedCaseStudy(slug),
  ]);

  if (!caseStudy) {
    const legacyRedirect = legacyCaseStudySlugRedirects[slug];

    if (legacyRedirect) {
      redirect(`/case-studies/${legacyRedirect}`);
    }

    notFound();
  }

  const categoryLabel = formatDisplayValue(caseStudy.category) || "Real Estate";
  const overviewParagraphs = splitParagraphs(caseStudy.overview);
  const businessPlanParagraphs = splitParagraphs(caseStudy.businessPlan);
  const executionParagraphs = splitParagraphs(caseStudy.execution);
  const outcomeParagraphs = splitParagraphs(caseStudy.outcomeSummary);
  const takeaways = caseStudy.takeaways.map((item) => item.takeaway);
  const galleryCarouselItems = createGalleryItems(caseStudy);
  const heroImage = galleryCarouselItems[0] ?? null;
  const pageIntro = getCmsText(page?.intro);
  const pageDisclaimer = getCmsText(page?.disclaimer);
  const heroEyebrow =
    getCmsText(getPageGroupItem(page, "hero_eyebrow")?.title) ??
    getCmsText(page?.pageTitle) ??
    "Case Study";
  const snapshotSectionTitle =
    getCmsText(getPageGroupItem(page, "snapshot_section_title")?.title) ?? "Deal Snapshot";
  const gallerySection = getPageGroupItem(page, "gallery_section_content");
  const gallerySectionTitle = getCmsText(gallerySection?.title) ?? "Project Gallery";
  const gallerySectionBody =
    getCmsText(gallerySection?.body) ??
    "Supporting visuals from the asset, execution plan, and finished outcome.";
  const overviewSectionTitle =
    getCmsText(getPageGroupItem(page, "overview_section_title")?.title) ?? "Investment Overview";
  const standoutSection = getPageGroupItem(page, "standout_section_content");
  const standoutSectionTitle =
    getCmsText(standoutSection?.title) ?? "Why This Case Stands Out";
  const standoutSectionBody =
    getCmsText(standoutSection?.body) ??
    "The business plan that shaped acquisition, execution, and outcome.";
  const profileSectionTitle =
    getCmsText(getPageGroupItem(page, "profile_section_title")?.title) ?? "Investment Profile";
  const executionSection = getPageGroupItem(page, "execution_section_content");
  const executionSectionTitle =
    getCmsText(executionSection?.title) ?? "Execution Highlights";
  const executionSectionBody =
    getCmsText(executionSection?.body) ??
    "What moved the asset from plan to measurable performance.";
  const outcomeSectionTitle =
    getCmsText(getPageGroupItem(page, "outcome_section_title")?.title) ?? "Outcome Summary";
  const takeawaysSectionTitle =
    getCmsText(getPageGroupItem(page, "takeaways_section_title")?.title) ?? "Key Takeaways";

  const heroCards = caseStudy.assetProfile
    .slice(0, 4)
    .map((item, index) => {
      const tones = [
        {
          icon: <TrendIcon className="h-6 w-6" />,
          toneClassName: "bg-[#e9fbf2] text-[#28b777]",
        },
        {
          icon: <DollarIcon className="h-6 w-6" />,
          toneClassName: "bg-[#edf4ff] text-[#2563eb]",
        },
        {
          icon: <BuildingIcon className="h-6 w-6" />,
          toneClassName: "bg-[#f2ebff] text-[#7c3aed]",
        },
        {
          icon: <CalendarIcon className="h-6 w-6" />,
          toneClassName: "bg-[#fff4e6] text-[#ea7f00]",
        },
      ] as const;

      return {
        ...tones[index % tones.length],
        label: item.label,
        value: item.value,
      };
    })
    .filter((item) => item.value);

  const snapshotCards = caseStudy.assetProfile
    .slice(4, 8)
    .map((item) => ({
      icon: <MedalIcon className="h-6 w-6" />,
      label: item.label,
      toneClassName: "bg-[#f8fafc] text-[#1e293b]",
      value: item.value,
    }))
    .filter((item) => item.value);

  const strategyParagraphs =
    businessPlanParagraphs.length > 0 ? businessPlanParagraphs : executionParagraphs;

  const standoutItems = strategyParagraphs.slice(0, 4).map((paragraph, index) => {
    const { body, lead } = splitLeadLine(paragraph);
    const icons = [
      <TrendIcon className="h-7 w-7" key="trend" />,
      <MedalIcon className="h-7 w-7" key="medal" />,
      <BuildingIcon className="h-7 w-7" key="building" />,
      <SparkIcon className="h-7 w-7" key="spark" />,
    ];

    return {
      description: body || paragraph,
      icon: icons[index % icons.length],
      title: lead.length <= 78 ? lead.replace(/[.!?]+$/, "") : `Strategy Angle ${index + 1}`,
    };
  });

  const overviewFeatureStats = caseStudy.assetProfile
    .slice(0, 3)
    .map((item) => ({ label: item.label, value: item.value }))
    .filter((item) => item.value);

  const overviewSupportItems =
    overviewParagraphs.length > 1
      ? overviewParagraphs.slice(1, 3)
      : strategyParagraphs.slice(0, 2);

  const profileTags = collectUniqueStrings([
    categoryLabel,
    ...caseStudy.assetProfile.slice(0, 2).map((item) => item.value),
    ...takeaways.slice(0, 2),
  ]).slice(0, 5);

  const shellCta = {
    href: page?.ctaHref || "/case-studies",
    label: page?.ctaLabel || "Back to Case Studies",
  };

  return (
    <SiteShell cta={shellCta}>
      <DetailPageCanvas>
        <div className="bg-[linear-gradient(180deg,#fffdf9_0%,#ffffff_24%,#fffdf7_100%)]">
          <DetailSection className="pb-14 pt-10 sm:pt-12 lg:pb-18 lg:pt-14">
            <DetailBreadcrumbs
              currentLabel={caseStudy.title}
              href="/case-studies"
              hrefLabel="Case Studies"
            />

            <div className="mt-8">
              <div className="flex flex-col">
                <div
                  className={`grid gap-10 xl:grid-cols-[minmax(0,0.98fr)_minmax(420px,1fr)] xl:items-center xl:gap-14 ${
                    heroImage ? "" : "max-w-[980px]"
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center rounded-full bg-[#e8f8ee] px-4 py-2 text-[15px] font-semibold tracking-[-0.02em] text-[#17986b]">
                        {heroEyebrow}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#ffe8ec] px-4 py-2 text-[15px] font-semibold tracking-[-0.02em] text-[#dc4e6b]">
                        {categoryLabel}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#e8f0ff] px-4 py-2 text-[15px] font-semibold tracking-[-0.02em] text-[#2962eb]">
                        {takeaways.length ? `${takeaways.length} Key Takeaways` : "Execution Focus"}
                      </span>
                    </div>

                    <div className="mt-5 space-y-8 sm:space-y-10">
                      <h1
                        className="max-w-[660px] text-balance text-[32px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#14213c] sm:text-[42px] lg:text-[52px]"
                        style={serifHeadingStyle}
                      >
                        {caseStudy.title}
                      </h1>
                      {pageIntro ? (
                        <p className="max-w-[760px] text-[15px] leading-[1.76] text-slate-500 sm:text-[16px]">
                          {pageIntro}
                        </p>
                      ) : null}
                      <p className="max-w-[760px] text-[16px] leading-[1.78] text-slate-600 sm:text-[17px]">
                        {overviewParagraphs[0] ?? caseStudy.overview}
                      </p>
                    </div>

                    {heroCards.length ? (
                      <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        {heroCards.map((item) => (
                          <CaseValueCard
                            icon={item.icon}
                            key={`${item.label}-${item.value}`}
                            label={item.label}
                            toneClassName={item.toneClassName}
                            value={item.value}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {heroImage ? (
                    <div className="relative overflow-hidden rounded-[36px] border border-[#e8e1d6] bg-white shadow-[0_22px_54px_rgba(15,23,42,0.1)]">
                      <div className="relative min-h-[360px] sm:min-h-[460px] xl:min-h-[560px]">
                        <Image
                          alt={heroImage.alt}
                          className="object-cover"
                          fill
                          priority
                          sizes="(max-width: 1279px) 100vw, 48vw"
                          src={heroImage.src}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0)_52%,rgba(15,23,42,0.62)_100%)]" />
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white">
                          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/14 backdrop-blur">
                            <BuildingIcon className="h-6 w-6" />
                          </span>
                          <span className="text-[18px] font-semibold tracking-[-0.02em] sm:text-[20px]">
                            {categoryLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {snapshotCards.length ? (
                <div className="mt-14">
                  <CaseSectionHeading title={snapshotSectionTitle} />
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {snapshotCards.map((item) => (
                      <CaseValueCard
                        icon={item.icon}
                        key={`${item.label}-${item.value}`}
                        label={item.label}
                        toneClassName={item.toneClassName}
                        value={item.value}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </DetailSection>

          <DetailSection className="pb-20 lg:pb-24">
            <div className="space-y-20">
              {galleryCarouselItems.length > 1 ? (
                <section>
                  <CaseSectionHeading
                    title={gallerySectionTitle}
                    description={gallerySectionBody}
                  />
                  <DetailMediaCarousel
                    autoPlayMs={5000}
                    className="mt-8"
                    imageSizes="(max-width: 1279px) 100vw, 72vw"
                    items={galleryCarouselItems}
                    priorityFirst
                  />
                </section>
              ) : null}

              {overviewParagraphs.length ? (
                <section>
                  <CaseSectionHeading title={overviewSectionTitle} />
                  <div className="mt-8 rounded-[30px] border border-[#eadfcf] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] sm:p-6">
                    <div className="rounded-[24px] border border-[#ecdcc6] bg-[#fffdf9] px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#bf9375]">
                        Overview
                      </p>
                      <p className="mt-3 max-w-[820px] text-[20px] font-semibold leading-[1.45] tracking-[-0.03em] text-[#14213c] sm:text-[24px]">
                        {overviewParagraphs[0]}
                      </p>

                      {overviewFeatureStats.length ? (
                        <div className="mt-5 flex flex-wrap gap-3">
                          {overviewFeatureStats.map((item) => (
                            <div
                              className="rounded-full border border-[#ecdcc6] bg-white px-4 py-3"
                              key={`${item.label}-${item.value}`}
                            >
                              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">
                                {item.label}
                              </p>
                              <p className="mt-1 text-[16px] font-semibold leading-none text-[#14213c]">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {overviewSupportItems.length ? (
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        {overviewSupportItems.map((item, index) => (
                          <div
                            className="rounded-[22px] border border-[#e7edf4] bg-[#fcfdff] px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                            key={`${item}-${index}`}
                          >
                            <p className="text-[15px] leading-[1.75] text-slate-600 sm:text-[16px]">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {standoutItems.length ? (
                <section>
                  <CaseSectionHeading
                    title={standoutSectionTitle}
                    description={standoutSectionBody}
                  />
                  <div className="mt-8 grid gap-5 xl:grid-cols-2">
                    {standoutItems.map((item, index) => (
                      <CaseStandoutCard
                        description={item.description}
                        icon={item.icon}
                        key={`${item.title}-${index}`}
                        title={item.title}
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              {profileTags.length ? (
                <section>
                  <CaseSectionHeading title={profileSectionTitle} />
                  <div className="mt-8 flex flex-wrap gap-4">
                    {profileTags.map((item) => (
                      <span
                        className="rounded-full bg-[#1c2d4e] px-6 py-4 text-[18px] font-semibold tracking-[-0.02em] text-white shadow-[0_16px_28px_rgba(28,45,78,0.18)]"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              {executionParagraphs.length || takeaways.length || outcomeParagraphs.length ? (
                <section>
                  <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.9fr)] xl:items-start">
                    <div>
                      <CaseSectionHeading
                        title={executionSectionTitle}
                        description={executionSectionBody}
                      />
                      {(executionParagraphs.length ? executionParagraphs : takeaways).length ? (
                        <ul className="mt-8 space-y-6">
                          {(executionParagraphs.length ? executionParagraphs : takeaways)
                            .slice(0, 4)
                            .map((item, index) => {
                              const icons = [
                                <TrendIcon className="h-7 w-7" key="trend" />,
                                <BuildingIcon className="h-7 w-7" key="building" />,
                                <CheckCircleIcon className="h-7 w-7" key="check" />,
                                <MedalIcon className="h-7 w-7" key="medal" />,
                              ];

                              return (
                                <TakeawayItem
                                  icon={icons[index % icons.length]}
                                  key={`${item}-${index}`}
                                  text={item}
                                />
                              );
                            })}
                        </ul>
                      ) : null}
                    </div>

                    {takeaways.length || outcomeParagraphs.length ? (
                      <div className="rounded-[32px] border border-[#dce7f5] bg-[#eef5ff] p-4 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
                        <div className="rounded-[28px] bg-white p-6 shadow-[inset_0_0_0_1px_rgba(220,231,245,0.95)] sm:p-7">
                          {outcomeParagraphs.length ? (
                            <div className="mb-6 border-b border-slate-100 pb-6">
                              <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#bf9375]">
                                {outcomeSectionTitle}
                              </p>
                              <p className="mt-3 text-[18px] font-semibold leading-[1.45] tracking-[-0.03em] text-[#14213c] sm:text-[20px]">
                                {outcomeParagraphs[0]}
                              </p>
                              {outcomeParagraphs.slice(1).map((paragraph, index) => (
                                <p
                                  className="mt-3 text-[15px] leading-[1.8] text-slate-600"
                                  key={`${paragraph}-${index}`}
                                >
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          ) : null}

                          {takeaways.length ? (
                            <>
                              <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#bf9375]">
                                {takeawaysSectionTitle}
                              </p>
                              <ul className="mt-4 space-y-3">
                                {takeaways.map((item, index) => (
                                  <li className="flex items-start gap-3" key={`${item}-${index}`}>
                                    <span className="mt-[8px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#cca24f]" />
                                    <p className="text-[15px] leading-[1.8] text-slate-700 sm:text-[16px]">
                                      {item}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : null}

                          {pageDisclaimer ? (
                            <p className="mt-6 border-t border-slate-100 pt-6 text-[13px] leading-[1.7] text-slate-500">
                              {pageDisclaimer}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}
            </div>
          </DetailSection>
        </div>
      </DetailPageCanvas>
    </SiteShell>
  );
}
