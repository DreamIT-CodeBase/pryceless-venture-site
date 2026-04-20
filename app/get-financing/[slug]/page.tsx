import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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

const replaceProgramToken = (value: string | null | undefined, programTitle: string) =>
  String(value ?? "").replace(/\{program\}/gi, programTitle);

const getCmsText = (value: string | null | undefined) => {
  const normalized = normalizeContentLine(value);
  return normalized || null;
};

const LOAN_PROGRAM_HERO_IMAGE_CLIP_PATH =
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

  if (loanProgram.slug !== slug) {
    redirect(`/get-financing/${loanProgram.slug}`);
  }

  const paragraphs = splitParagraphs(loanProgram.fullDescription);
  const highlights = loanProgram.highlights
    .map((item) => normalizeContentLine(item.highlight))
    .filter(Boolean);
  const form = loanProgram.forms[0] ?? null;
  const heroMetricLabels = getPageGroupItems(page, "hero_metric_labels").map((item) => item.title);
  const termDetailLabels = getPageGroupItems(page, "term_detail_labels").map((item) => item.title);
  const highlightSectionContent = getPageGroupItem(page, "highlights_section_content");
  const termsSectionContent = getPageGroupItem(page, "terms_section_content");
  const applicationFallbackAction = getPageGroupItem(page, "application_fallback_action");
  const applicationFallbackContent = getPageGroupItem(page, "application_fallback_content");
  const pageCtaLabel = getCmsText(page?.ctaLabel) ?? "Apply Now";
  const pageCtaHref = getCmsText(page?.ctaHref) ?? "#apply-now";
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
  const heroImage =
    loanProgram.imageUrl ||
    getDefaultLoanProgramImage(loanProgram.slug) ||
    defaultLoanProgramImages[0];
  const highlightImage = loanProgram.highlightImageUrl || heroImage;
  const heroHeadingTail = getCmsText(loanProgram.titleTail);
  const heroDescription = getCmsText(loanProgram.shortDescription);
  const highlightSectionTitle = getCmsText(
    replaceProgramToken(highlightSectionContent?.title, loanProgram.title),
  );
  const highlightSectionBody = getCmsText(
    loanProgram.highlightSubheadline || highlightSectionContent?.body,
  );
  const termsSectionTitle = getCmsText(termsSectionContent?.title);
  const termsSectionBody = getCmsText(termsSectionContent?.body);
  const offeringHighlights = highlights.length ? highlights : splitParagraphs(loanProgram.keyHighlights);
  const insightEyebrow = getCmsText(getPageGroupItem(page, "insight_section_eyebrow")?.title);
  const insightTitle = getCmsText(loanProgram.insightTitle);
  const insightBody = getCmsText(loanProgram.insightBody);
  const overviewIntro = getCmsText(paragraphs[0] || loanProgram.shortDescription);
  const overviewNarrativeBlocks = loanProgram.overviewItems.length
    ? loanProgram.overviewItems
        .map((item) => ({
          body: normalizeContentLine(item.body),
          lead: normalizeContentLine(item.title),
        }))
        .filter((item) => item.lead)
    : paragraphs.slice(1).map(splitLeadLine).filter((item) => item.lead);
  const overviewStatHighlights = [
    { label: termDetailLabels[0] ?? "Interest Rate", value: loanProgram.interestRate },
    { label: termDetailLabels[1] ?? "Loan Term", value: loanProgram.loanTerm },
    { label: termDetailLabels[2] ?? "LTV / LTC", value: loanProgram.ltv },
  ].filter((item) => item.value);
  const overviewSectionTitle =
    getCmsText(getPageGroupItem(page, "overview_section_title")?.title) ?? "Loan Overview";
  const applicationFormTitle =
    getCmsText(getPageGroupItem(page, "application_form_title")?.title) ?? pageCtaLabel;
  const heroFeatureCards = [
    {
      kind: "clock" as const,
      text: getCmsText(loanProgram.heroBadgeOne),
      className: "-left-1 top-[30%] sm:left-0 lg:-left-5 lg:top-[26%]",
    },
    {
      kind: "calendar" as const,
      text: getCmsText(loanProgram.heroBadgeTwo),
      className: "-right-1 top-[16%] sm:right-0 lg:-right-3 lg:top-[22%]",
    },
    {
      kind: "leverage" as const,
      text: getCmsText(loanProgram.heroBadgeThree),
      className: "left-[10%] bottom-[-4%] sm:left-[15%] lg:left-[12%]",
    },
  ].filter((item) => item.text);

  return (
    <SiteShell cta={{ href: pageCtaHref, label: pageCtaLabel }}>
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
                  {heroHeadingTail ? (
                    <>
                      <br className="hidden sm:block" /> {heroHeadingTail}
                    </>
                  ) : null}
                </h1>
                {heroDescription ? (
                  <p className="mt-5 max-w-[510px] text-[14.5px] leading-[1.6] !text-white/90 sm:text-[15.5px] sm:leading-[1.68] lg:mt-6">
                    {heroDescription}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                  <Link
                    className="inline-flex min-h-[44px] min-w-[168px] items-center justify-center rounded-[12px] bg-white px-5 py-3 text-[14px] font-semibold tracking-[-0.02em] text-black shadow-[0_14px_32px_rgba(0,0,0,0.16)] pv-interactive-button transition-[transform,box-shadow,background-color] duration-300 hover:bg-white sm:min-h-[48px] sm:min-w-[196px] sm:text-[16px] lg:min-h-[50px] lg:min-w-[204px] lg:px-6 lg:text-[16px]"
                    href={pageCtaHref}
                    style={{ color: "#111111" }}
                  >
                    {pageCtaLabel}
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[600px] lg:mx-0">
                <div className="relative h-[270px] sm:h-[330px] lg:h-[390px] 2xl:h-[430px]">
                  <div
                    className="absolute inset-0 bg-white p-[6px] shadow-[0_24px_60px_rgba(8,13,22,0.24)]"
                    style={{ clipPath: LOAN_PROGRAM_HERO_IMAGE_CLIP_PATH }}
                  >
                    <div
                      className="relative h-full w-full overflow-hidden bg-[#d4dce7]"
                      style={{ clipPath: LOAN_PROGRAM_HERO_IMAGE_CLIP_PATH }}
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
                alt={
                  loanProgram.highlightImageAlt ||
                  loanProgram.imageAlt ||
                  loanProgram.title
                }
                className="object-cover"
                fill
                sizes="(max-width: 1023px) 100vw, 480px"
                src={highlightImage}
              />
            </div>

            <div>
              <DetailSectionHeading
                eyebrow={getPageGroupItem(page, "highlights_section_eyebrow")?.title ?? "Program Highlights"}
                title={highlightSectionTitle ?? ""}
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

        <DetailSection className="pb-8 pt-4 lg:pt-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,480px)] lg:items-stretch">
            <DetailGlassPanel className="flex h-full flex-col">
              <DetailSectionHeading
                eyebrow={getPageGroupItem(page, "overview_section_eyebrow")?.title ?? "Overview"}
                title={overviewSectionTitle}
              />
              <div className="mt-4 flex flex-1 flex-col">
                {overviewIntro ? (
                  <div className="rounded-[18px] border border-[rgba(191,147,117,0.24)] bg-[linear-gradient(135deg,rgba(255,248,240,0.96)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 shadow-[0_10px_24px_rgba(191,147,117,0.1)] sm:px-5">
                    <p className="text-[19px] font-semibold leading-[1.42] tracking-[-0.03em] text-[#12284b] sm:text-[20px]">
                      {overviewIntro}
                    </p>
                    {overviewStatHighlights.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {overviewStatHighlights.map((item) => (
                          <div
                            className="rounded-full border border-[rgba(191,147,117,0.28)] bg-white px-3 py-1.5"
                            key={`${item.label}-${item.value}`}
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#bf9375]">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-[13px] font-semibold text-[#12284b]">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {overviewNarrativeBlocks.slice(0, 4).length ? (
                  <div className="mt-3 space-y-2.5">
                    {overviewNarrativeBlocks.slice(0, 4).map((item, index) => (
                      <div
                        className="rounded-[16px] border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
                        key={`${item.lead}-${index}`}
                      >
                        <p className="text-[15.5px] font-semibold leading-[1.45] tracking-[-0.02em] text-slate-900">
                          {item.lead}
                        </p>
                        {item.body ? (
                          <p className="mt-1.5 text-[14px] leading-[1.7] text-slate-600">
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
              <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
                {termItems.length ? (
                  <dl className="divide-y divide-[rgba(191,147,117,0.16)]">
                    {termItems.map((item, index) => (
                      <div
                        className={`flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                          index === 0 ? "pt-0" : ""
                        } ${index === termItems.length - 1 ? "pb-0" : ""}`}
                        key={`${item.label}-${item.value}`}
                      >
                        <dt className="text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[#bf9375]">
                          {item.label}
                        </dt>
                        <dd className="text-left text-[16px] font-semibold leading-[1.4] tracking-[-0.02em] text-[#12284b] sm:max-w-[60%] sm:text-right sm:text-[17px]">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {insightTitle || insightBody ? (
                  <div className="rounded-[18px] border border-[rgba(191,147,117,0.2)] bg-[linear-gradient(135deg,rgba(255,248,240,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 shadow-[0_8px_24px_rgba(191,147,117,0.08)]">
                    {insightEyebrow ? (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bf9375]">
                        {insightEyebrow}
                      </p>
                    ) : null}
                    {insightTitle ? (
                      <p className="mt-1.5 text-[16px] font-semibold tracking-[-0.025em] text-[#12284b]">
                        {insightTitle}
                      </p>
                    ) : null}
                    {insightBody ? (
                      <p className="mt-2 text-[14px] leading-[1.65] text-slate-600">
                        {insightBody}
                      </p>
                    ) : null}
                  </div>
                ) : null}
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
                title={applicationFormTitle}
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
