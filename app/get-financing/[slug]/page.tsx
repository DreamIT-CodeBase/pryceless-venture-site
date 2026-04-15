import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicForm } from "@/components/forms/public-form";
import {
  DetailBulletList,
  DetailGlassPanel,
  DetailSection,
  DetailSectionHeading,
  detailPrimaryButtonClassName,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedLoanProgram, getSingletonPage } from "@/lib/data/public";
import {
  defaultLoanProgramImages,
  getDefaultLoanProgramImage,
} from "@/lib/loan-program-images";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const splitParagraphs = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

const normalizeContentLine = (value: string | null | undefined) =>
  String(value ?? "").replace(/\s+/g, " ").trim();

const getUniqueContentLines = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>();

  return values.reduce<string[]>((items, value) => {
    const normalized = normalizeContentLine(value);
    const dedupeKey = normalized.toLowerCase();

    if (!normalized || seen.has(dedupeKey)) {
      return items;
    }

    seen.add(dedupeKey);
    items.push(normalized);
    return items;
  }, []);
};

const splitLeadLine = (value: string) => {
  const normalized = normalizeContentLine(value);

  if (!normalized) {
    return { lead: "", body: "" };
  }

  const punctuationMatch = normalized.match(/^(.{18,145}?[.!?])\s+(.+)$/);
  if (punctuationMatch) {
    return {
      lead: punctuationMatch[1],
      body: punctuationMatch[2],
    };
  }

  const commaMatch = normalized.match(/^(.{18,110}?,)\s+(.+)$/);
  if (commaMatch) {
    return {
      lead: commaMatch[1],
      body: commaMatch[2],
    };
  }

  const colonMatch = normalized.match(/^(.{1,110}?:)\s+(.+)$/);
  if (colonMatch) {
    return {
      lead: colonMatch[1],
      body: colonMatch[2],
    };
  }

  return {
    lead: normalized,
    body: "",
  };
};

const formatAmountRange = (minAmount: string | null | undefined, maxAmount: string | null | undefined) => {
  if (minAmount && maxAmount) {
    return `${minAmount} - ${maxAmount}`;
  }

  return minAmount || maxAmount || null;
};

const replaceProgramToken = (value: string | null | undefined, programTitle: string) =>
  String(value ?? "").replace(/\{program\}/gi, programTitle);

const matchesNormalized = (value: string | null | undefined, target: string) =>
  normalizeContentLine(value).toLowerCase() === normalizeContentLine(target).toLowerCase();

const isFixFlipLoanProgram = (slug: string, title: string) =>
  slug === "fix-flip" || /fix\s*&\s*flip/i.test(title);

const resolveHeroHeadingTail = (value: string | null | undefined, isFixFlip: boolean) => {
  const normalized = normalizeContentLine(value);

  if (!normalized || matchesNormalized(normalized, "Built for Real Estate Operators")) {
    return isFixFlip ? "for Active Investors" : "for Real Estate Investors";
  }

  return normalized;
};

const resolveHeroDescription = (value: string | null | undefined, isFixFlip: boolean) => {
  const normalized = normalizeContentLine(value);

  if (
    isFixFlip &&
    (!normalized ||
      matchesNormalized(
        normalized,
        "Fast-turn capital to acquire, renovate, and reposition value-add residential deals with confidence.",
      ))
  ) {
    return "Fast capital for residential acquisition, rehab, and resale.";
  }

  return normalized;
};

const resolveHeroFeatureCardText = (value: string | null | undefined) => {
  const normalized = normalizeContentLine(value);

  if (!normalized) {
    return "";
  }

  if (matchesNormalized(normalized, "Quick draws with photo inspection")) {
    return "Fast draw requests";
  }

  if (matchesNormalized(normalized, "Close and fund with speed and clarity")) {
    return "Quick closings";
  }

  if (matchesNormalized(normalized, "Leverage matched to deal execution")) {
    return "Rehab-ready leverage";
  }

  return normalized;
};

const resolveHighlightSectionTitle = (
  value: string | null | undefined,
  programTitle: string,
  isFixFlip: boolean,
) => {
  const normalized = normalizeContentLine(replaceProgramToken(value, programTitle));

  if (!normalized || matchesNormalized(normalized, `Why borrowers choose ${programTitle}`)) {
    return isFixFlip ? `Why investors choose ${programTitle}` : `Why borrowers choose ${programTitle}`;
  }

  return normalized;
};

const resolveHighlightSectionBody = (
  value: string | null | undefined,
  fallback: string | null | undefined,
  isFixFlip: boolean,
) => {
  const normalized = normalizeContentLine(value);

  if (
    !normalized ||
    matchesNormalized(
      normalized,
      "Use this section to understand the structure, speed, and underwriting advantages that make this program a strong fit for real estate execution.",
    )
  ) {
    if (isFixFlip) {
      return "Built for quick purchases, rehab draws, and exit timelines that reward decisive execution.";
    }

    return normalizeContentLine(fallback) || "Review the structure, speed, and underwriting fit before you apply.";
  }

  return normalized;
};

const resolveTermsSectionTitle = (value: string | null | undefined) => {
  const normalized = normalizeContentLine(value);

  if (!normalized || matchesNormalized(normalized, "Core underwriting details")) {
    return "Core underwriting snapshot";
  }

  return normalized;
};

const resolveTermsSectionBody = (value: string | null | undefined) => {
  const normalized = normalizeContentLine(value);

  if (
    !normalized ||
    matchesNormalized(normalized, "Review the high-level structure before moving into the application flow.")
  ) {
    return "Key pricing, leverage, and loan size details to review before you apply.";
  }

  return normalized;
};

const buildProgramHighlights = ({
  amountRange,
  fees,
  highlights,
  isFixFlip,
  loanTerm,
  ltv,
}: {
  amountRange: string | null;
  fees: string | null | undefined;
  highlights: string[];
  isFixFlip: boolean;
  loanTerm: string | null | undefined;
  ltv: string | null | undefined;
}) =>
  getUniqueContentLines([
    ...(isFixFlip
      ? [
          "One structure can cover acquisition and rehab under a single execution plan.",
          "Draw-based disbursements help match capital to renovation progress.",
          "Built for investors targeting a clean sale or refinance exit.",
        ]
      : []),
    ...highlights,
    ltv ? `${ltv} available for purchase and rehab execution.` : null,
    loanTerm ? `${loanTerm} terms built for resale or refinance timing.` : null,
    amountRange ? `${amountRange} loan sizes for both first projects and repeat operators.` : null,
    fees ? `${fees} with clear upfront pricing.` : null,
  ]).slice(0, 6);

const getUnderwritingInsight = ({
  amountRange,
  isFixFlip,
  loanTerm,
  ltv,
}: {
  amountRange: string | null;
  isFixFlip: boolean;
  loanTerm: string | null | undefined;
  ltv: string | null | undefined;
}) => {
  if (isFixFlip) {
    return {
      body:
        "Best for investors who need a quick close, staged rehab draws, and enough runway to sell or refinance after the work is complete.",
      eyebrow: "Execution Fit",
      title: "Built for purchase + rehab execution",
    };
  }

  return {
    body: `Use ${ltv ?? "available leverage"}, ${loanTerm ?? "the posted term"}, and ${amountRange ?? "the loan size range"} together to confirm the structure matches your deal plan.`,
    eyebrow: "How to Use This",
    title: "Review fit before you apply",
  };
};

const FIX_FLIP_HERO_IMAGE_CLIP_PATH =
  "polygon(0 42%, 0 100%, 74% 100%, 74% 66%, 100% 66%, 100% 0, 18% 0, 18% 42%)";

function LoanHeroFeatureIcon({
  kind,
}: {
  kind: "clock" | "calendar" | "leverage";
}) {
  if (kind === "leverage") {
    return (
      <svg aria-hidden="true" className="h-7 w-7 text-[#c79a37] sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24">
        <path d="M12 3v18M16.5 7.5c0-1.93-2.01-3.5-4.5-3.5S7.5 5.57 7.5 7.5 9.51 11 12 11s4.5 1.57 4.5 3.5S14.49 18 12 18s-4.5-1.57-4.5-3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-7 w-7 text-[#c79a37] sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.5v5l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      {kind === "calendar" ? <path d="M8 3.5v3M16 3.5v3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /> : null}
    </svg>
  );
}

function LoanHeroMetricIcon({
  kind,
}: {
  kind: "rate" | "leverage" | "term";
}) {
  if (kind === "leverage") {
    return (
      <svg aria-hidden="true" className="h-7 w-7 text-white sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24">
        <path d="M4 20V8l8-4 8 4v12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M9 20v-6h6v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  if (kind === "term") {
    return (
      <svg aria-hidden="true" className="h-7 w-7 text-white sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="2" stroke="currentColor" strokeWidth="2" width="14" x="5" y="4" />
        <path d="M8 2.5v3M16 2.5v3M8 10h8M8 14h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-7 w-7 text-white sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24">
      <path d="M8 5h8M8 19h8M15 8.5a3 3 0 1 0-6 0c0 1.25.73 2.25 2.2 2.99l1.6.8c1.47.74 2.2 1.74 2.2 3.01a3 3 0 1 1-6 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

const getPageGroupItems = (
  page: Awaited<ReturnType<typeof getSingletonPage>>,
  groupKey: string,
) => page?.items.filter((item) => item.groupKey === groupKey) ?? [];

const getPageGroupItem = (
  page: Awaited<ReturnType<typeof getSingletonPage>>,
  groupKey: string,
  index = 0,
) => getPageGroupItems(page, groupKey)[index] ?? null;

export default async function LoanProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [page, loanProgram] = await Promise.all([
    getSingletonPage("GET_FINANCING_DETAIL"),
    getPublishedLoanProgram(slug),
  ]);

  if (!loanProgram) {
    notFound();
  }

  const paragraphs = splitParagraphs(loanProgram.fullDescription);
  const highlights = splitParagraphs(loanProgram.keyHighlights);
  const form = loanProgram.forms[0] ?? null;
  const isFixFlip = isFixFlipLoanProgram(loanProgram.slug, loanProgram.title);
  const heroMetricLabels = getPageGroupItems(page, "hero_metric_labels").map((item) => item.title);
  const termDetailLabels = getPageGroupItems(page, "term_detail_labels").map((item) => item.title);
  const highlightSectionContent = getPageGroupItem(page, "highlights_section_content");
  const termsSectionContent = getPageGroupItem(page, "terms_section_content");
  const applicationFallbackAction = getPageGroupItem(page, "application_fallback_action");
  const applicationFallbackContent = getPageGroupItem(page, "application_fallback_content");
  const heroStats = [
    { label: heroMetricLabels[0] ?? "Interest Rate", value: loanProgram.interestRate, kind: "rate" as const },
    { label: heroMetricLabels[1] ?? "LTV / LTC", value: loanProgram.ltv, kind: "leverage" as const },
    { label: heroMetricLabels[2] ?? "Loan Term", value: loanProgram.loanTerm, kind: "term" as const },
  ].filter((item) => item.value);
  const termItems = [
    { label: termDetailLabels[0] ?? "Interest Rate", value: loanProgram.interestRate },
    { label: termDetailLabels[1] ?? "Loan Term", value: loanProgram.loanTerm },
    { label: termDetailLabels[2] ?? "LTV / LTC", value: loanProgram.ltv },
    { label: termDetailLabels[3] ?? "Fees", value: loanProgram.fees },
    { label: termDetailLabels[4] ?? "Minimum Amount", value: loanProgram.minAmount },
    { label: termDetailLabels[5] ?? "Maximum Amount", value: loanProgram.maxAmount },
  ].filter((item) => item.value);
  const amountRange = formatAmountRange(loanProgram.minAmount, loanProgram.maxAmount);
  const heroImage =
    loanProgram.imageUrl ||
    getDefaultLoanProgramImage(loanProgram.slug) ||
    defaultLoanProgramImages[0];
  const heroHeadingTail = resolveHeroHeadingTail(
    getPageGroupItem(page, "hero_heading_tail")?.title,
    isFixFlip,
  );
  const heroDescription = resolveHeroDescription(loanProgram.shortDescription, isFixFlip);
  const heroFeatureTexts = getPageGroupItems(page, "hero_feature_cards")
    .map((item) => resolveHeroFeatureCardText(item.title))
    .filter(Boolean);
  const highlightSectionTitle = resolveHighlightSectionTitle(
    highlightSectionContent?.title,
    loanProgram.title,
    isFixFlip,
  );
  const highlightSectionBody = resolveHighlightSectionBody(
    highlightSectionContent?.body,
    paragraphs[1] || loanProgram.shortDescription,
    isFixFlip,
  );
  const termsSectionTitle = resolveTermsSectionTitle(termsSectionContent?.title);
  const termsSectionBody = resolveTermsSectionBody(termsSectionContent?.body);
  const offeringHighlights = buildProgramHighlights({
    amountRange,
    fees: loanProgram.fees,
    highlights: highlights.length ? highlights : termItems.map((item) => `${item.label}: ${item.value}`),
    isFixFlip,
    loanTerm: loanProgram.loanTerm,
    ltv: loanProgram.ltv,
  });
  const underwritingInsight = getUnderwritingInsight({
    amountRange,
    isFixFlip,
    loanTerm: loanProgram.loanTerm,
    ltv: loanProgram.ltv,
  });
  const overviewParagraphs = getUniqueContentLines([loanProgram.shortDescription, ...paragraphs]);
  const overviewSupportParagraph =
    [loanProgram.interestRate, loanProgram.ltv, loanProgram.loanTerm].filter(Boolean).length >= 2
      ? `At a glance, pricing starts at ${loanProgram.interestRate ?? "custom pricing"}, leverage reaches ${loanProgram.ltv ?? "structured leverage"}, and terms run ${loanProgram.loanTerm ?? "flexible timing"}. That gives operators a faster way to judge fit before moving into full underwriting.`
      : null;
  const overviewIntro = overviewParagraphs[0] ?? null;
  const overviewNarrativeBlocks = getUniqueContentLines([
    ...overviewParagraphs.slice(1),
    overviewSupportParagraph,
  ]).map(splitLeadLine);
  const overviewStatHighlights = [
    { label: "Interest Rate", value: loanProgram.interestRate },
    { label: "Loan Term", value: loanProgram.loanTerm },
    { label: "LTV / LTC", value: loanProgram.ltv },
  ].filter((item) => item.value);
  const heroFeatureCards = [
    {
      kind: "clock" as const,
      text: heroFeatureTexts[0],
      className: "-left-1 top-[30%] sm:left-0 lg:-left-5 lg:top-[26%]",
    },
    {
      kind: "calendar" as const,
      text: heroFeatureTexts[1],
      className: "-right-1 top-[16%] sm:right-0 lg:-right-3 lg:top-[22%]",
    },
    {
      kind: "leverage" as const,
      text: heroFeatureTexts[2],
      className: "left-[10%] bottom-[-4%] sm:left-[15%] lg:left-[12%]",
    },
  ].filter((item) => item.text);

  return (
    <SiteShell cta={{ href: "/get-financing", label: "Apply Now" }}>
      <div className="bg-white pb-20">
        <section className="overflow-hidden bg-[#11283e] text-white">
          <div className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 sm:py-10 lg:px-[125px] lg:py-[44px] 2xl:max-w-[1760px] 2xl:px-[164px] 2xl:py-[56px]">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(400px,1.08fr)] lg:items-center lg:gap-9 2xl:gap-12">
              <div className="max-w-[500px]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[var(--pv-sand)]">
                  {getPageGroupItem(page, "hero_eyebrow")?.title ?? "Loan Program"}
                </p>
                <h1 className="mt-3 text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.04em] !text-white sm:text-[34px] lg:text-[40px] 2xl:text-[44px]">
                  {loanProgram.title}
                  <br className="hidden sm:block" /> {heroHeadingTail}
                </h1>
                {heroDescription ? (
                  <p className="mt-5 max-w-[510px] text-[14.5px] leading-[1.6] !text-white/90 sm:text-[15.5px] sm:leading-[1.68] lg:mt-6">
                    {heroDescription}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                  <Link
                    className="inline-flex min-h-[44px] min-w-[168px] items-center justify-center rounded-[12px] bg-white px-5 py-3 text-[14px] font-semibold tracking-[-0.02em] text-black shadow-[0_14px_32px_rgba(0,0,0,0.16)] transition-colors hover:bg-white sm:min-h-[48px] sm:min-w-[196px] sm:text-[16px] lg:min-h-[50px] lg:min-w-[204px] lg:px-6 lg:text-[16px]"
                    href="#apply-now"
                    style={{ color: "#111111" }}
                  >
                    Apply Now
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[600px] lg:mx-0">
                <div className="relative h-[270px] sm:h-[330px] lg:h-[390px] 2xl:h-[430px]">
                  <div
                    className="absolute inset-0 bg-white p-[6px] shadow-[0_24px_60px_rgba(8,13,22,0.24)]"
                    style={{ clipPath: FIX_FLIP_HERO_IMAGE_CLIP_PATH }}
                  >
                    <div
                      className="relative h-full w-full overflow-hidden bg-[#d4dce7]"
                      style={{ clipPath: FIX_FLIP_HERO_IMAGE_CLIP_PATH }}
                    >
                      <Image
                        alt={loanProgram.imageAlt || loanProgram.title}
                        className="object-cover"
                        fill
                        priority
                        sizes="(max-width: 1023px) 100vw, 560px"
                        src={heroImage}
                      />
                    </div>
                  </div>

                  {heroFeatureCards.map((item) => (
                    <div
                      className={`absolute max-w-[190px] rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[#48566c] shadow-[0_18px_36px_rgba(8,13,22,0.18)] sm:max-w-[220px] sm:px-[18px] sm:py-[15px] lg:max-w-[240px] ${item.className}`}
                      key={`${item.kind}-${item.text}`}
                    >
                      <div className="flex items-center gap-3">
                        <LoanHeroFeatureIcon kind={item.kind} />
                        <p className="text-[13px] font-medium leading-[1.35] sm:text-[14px]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {heroStats.length ? (
            <div className="bg-[#c59533]">
              <div className="mx-auto w-full max-w-[1480px] px-4 py-2.5 sm:px-6 sm:py-3 lg:px-[125px] lg:py-3.5 2xl:max-w-[1760px] 2xl:px-[164px] 2xl:py-4">
                <div className="grid gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-x-8 lg:justify-items-center">
                  {heroStats.map((item) => (
                    <div
                      className="flex items-center justify-center gap-3 text-white sm:min-h-[52px] sm:w-full sm:max-w-[320px] lg:min-h-[56px]"
                      key={item.label}
                    >
                      <LoanHeroMetricIcon kind={item.kind} />
                      <div className="min-w-0">
                        <p className="text-[16px] font-semibold leading-none sm:text-[18px] lg:text-[20px]">
                          {item.value}
                        </p>
                        <p className="mt-1 text-[11.5px] leading-[1.35] text-white/88 sm:text-[13px] lg:text-[13.5px]">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <DetailSection className="pb-10 pt-12 lg:pt-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(320px,480px)_minmax(0,1fr)] lg:items-center" id="loan-info">
            <div className="relative aspect-[11/8] overflow-hidden rounded-[32px] border border-[rgba(191,147,117,0.18)] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
              <Image
                alt={loanProgram.imageAlt || loanProgram.title}
                className="object-cover"
                fill
                sizes="(max-width: 1023px) 100vw, 480px"
                src={heroImage}
              />
            </div>

            <div>
              <DetailSectionHeading
                eyebrow={getPageGroupItem(page, "highlights_section_eyebrow")?.title ?? "Program Highlights"}
                title={highlightSectionTitle}
                body={highlightSectionBody}
              />
              {offeringHighlights.length ? (
                <div className="mt-6">
                  <DetailBulletList items={offeringHighlights} />
                </div>
              ) : null}
            </div>
          </div>
        </DetailSection>

        <DetailSection className="pb-10 pt-4 lg:pt-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-stretch">
            <DetailGlassPanel className="flex h-full flex-col">
              <DetailSectionHeading
                eyebrow={getPageGroupItem(page, "overview_section_eyebrow")?.title ?? "Overview"}
                title="Loan Overview"
              />
              <div className="mt-6 flex flex-1 flex-col">
                {overviewIntro ? (
                  <div className="rounded-[24px] border border-[rgba(191,147,117,0.24)] bg-[linear-gradient(135deg,rgba(255,248,240,0.96)_0%,rgba(255,255,255,1)_100%)] px-5 py-5 shadow-[0_14px_34px_rgba(191,147,117,0.1)] sm:px-6">
                    <p className="text-[20px] font-semibold leading-[1.45] tracking-[-0.03em] text-[#12284b] sm:text-[22px]">
                      {overviewIntro}
                    </p>
                    {overviewStatHighlights.length ? (
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {overviewStatHighlights.map((item) => (
                          <div
                            className="rounded-full border border-[rgba(191,147,117,0.28)] bg-white px-4 py-2"
                            key={`${item.label}-${item.value}`}
                          >
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">
                              {item.label}
                            </p>
                            <p className="mt-1 text-[14px] font-semibold text-[#12284b]">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {overviewNarrativeBlocks.length ? (
                  <div className="mt-5 space-y-4">
                    {overviewNarrativeBlocks.map((item, index) => (
                      <div
                        className="rounded-[22px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
                        key={`${item.lead}-${index}`}
                      >
                        <p className="text-[17px] font-semibold leading-[1.5] tracking-[-0.025em] text-slate-900">
                          {item.lead}
                        </p>
                        {item.body ? (
                          <p className="mt-2.5 text-[15.5px] leading-[1.82] text-slate-700">
                            {item.body}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </DetailGlassPanel>

            <DetailGlassPanel className="flex h-full flex-col">
              <DetailSectionHeading
                eyebrow={getPageGroupItem(page, "terms_section_eyebrow")?.title ?? "Rate and Terms"}
                title={termsSectionTitle}
                body={termsSectionBody}
              />
              <div className="mt-6 flex flex-1 flex-col justify-between gap-6">
                {termItems.length ? (
                  <dl className="divide-y divide-[rgba(191,147,117,0.16)]">
                    {termItems.map((item, index) => (
                      <div
                        className={`flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5 ${
                          index === 0 ? "pt-0" : ""
                        } ${index === termItems.length - 1 ? "pb-0" : ""}`}
                        key={`${item.label}-${item.value}`}
                      >
                        <dt className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">
                          {item.label}
                        </dt>
                        <dd className="text-left text-[17px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#12284b] sm:max-w-[62%] sm:text-right sm:text-[18px]">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className="rounded-[24px] border border-[rgba(191,147,117,0.2)] bg-[linear-gradient(135deg,rgba(255,248,240,0.92)_0%,rgba(255,255,255,1)_100%)] px-5 py-5 shadow-[0_12px_32px_rgba(191,147,117,0.08)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">
                    {underwritingInsight.eyebrow}
                  </p>
                  <p className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-[#12284b]">
                    {underwritingInsight.title}
                  </p>
                  <p className="mt-3 text-[15px] leading-[1.72] text-slate-700">
                    {underwritingInsight.body}
                  </p>
                </div>
              </div>
            </DetailGlassPanel>
          </div>
        </DetailSection>

        <DetailSection className="pt-6">
          <div id="apply-now">
            {form ? (
              <PublicForm
                form={form}
                layout="wide"
                sourcePath={`/get-financing/${loanProgram.slug}`}
                title="Apply Now"
              />
            ) : (
              <DetailGlassPanel>
                <DetailSectionHeading
                  eyebrow={getPageGroupItem(page, "application_section_eyebrow")?.title ?? "Application"}
                  title={applicationFallbackContent?.title || "Application form coming soon"}
                  body={applicationFallbackContent?.body || ""}
                />
                {applicationFallbackAction?.title && applicationFallbackAction?.body ? (
                  <div className="mt-6">
                    <Link className={detailPrimaryButtonClassName} href={applicationFallbackAction.body}>
                      {applicationFallbackAction.title}
                    </Link>
                  </div>
                ) : null}
              </DetailGlassPanel>
            )}
          </div>
        </DetailSection>
      </div>
    </SiteShell>
  );
}
