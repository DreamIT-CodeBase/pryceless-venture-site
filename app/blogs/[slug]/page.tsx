import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  DetailBreadcrumbs,
  DetailPageCanvas,
  DetailSection,
  detailPrimaryButtonClassName,
  detailSecondaryButtonClassName,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import {
  formatBlogCategoryLabel,
  formatBlogDate,
  getBlogImageAlt,
  getBlogImageSource,
  splitBlogParagraphs,
} from "@/lib/blog-content";
import { getPublishedBlogPost, getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const serifHeadingStyle = {
  fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
};

const splitLeadLine = (value: string) => {
  const match = value.match(/^(.{18,140}?[.!?])\s+(.+)$/);

  if (match) {
    return { body: match[2], lead: match[1] };
  }

  return { body: "", lead: value };
};

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

const condensePhrase = (value: string, limit = 58) => {
  const cleaned = value.replace(/\s+/g, " ").trim().replace(/[.!?]+$/, "");
  const firstSegment = cleaned.split(/[:;,]| - /)[0]?.trim() || cleaned;

  if (firstSegment.length <= limit) {
    return firstSegment;
  }

  const words = firstSegment.split(/\s+/);
  const trimmed = words.slice(0, 8).join(" ");
  return `${trimmed}${trimmed.length < firstSegment.length ? "..." : ""}`;
};

const estimateReadTimeLabel = (content: string, explicitReadTime: string | null) => {
  if (explicitReadTime?.trim()) {
    return explicitReadTime.trim();
  }

  const wordCount = String(content).trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.round(wordCount / 180));
  return `${minutes} min read`;
};

const extractBlogTopicTags = ({
  categoryLabel,
  content,
  excerpt,
  title,
}: {
  categoryLabel: string;
  content: string;
  excerpt: string;
  title: string;
}) => {
  const source = `${title} ${excerpt} ${content}`.toLowerCase();
  const tags = [categoryLabel];
  const keywordTags: Array<[RegExp, string]> = [
    [/\bbridge\b/, "Bridge Loans"],
    [/\bdscr\b/, "DSCR Loans"],
    [/\brefinanc/, "Refinance"],
    [/\bfix(?:\s|and|-)?flip\b|\brehab\b/, "Fix & Flip"],
    [/\brental\b|\blease\b/, "Rental Strategy"],
    [/\bportfolio\b/, "Portfolio Growth"],
    [/\bapproval\b|\bloan package\b|\bunderwriting\b/, "Borrower Prep"],
    [/\bacquisition\b|\bclosing\b/, "Acquisition Timing"],
    [/\brate\b|\bterm\b|\bstructure\b/, "Loan Structure"],
  ];

  keywordTags.forEach(([pattern, label]) => {
    if (pattern.test(source)) {
      tags.push(label);
    }
  });

  if (/\binvestor/.test(source)) {
    tags.push("Investors");
  }

  if (/\bborrower/.test(source)) {
    tags.push("Borrowers");
  }

  return collectUniqueStrings(tags).slice(0, 5);
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

function InsightSectionHeading({
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

function InsightValueCard({
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

function InsightStandoutCard({
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

function InsightListItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-4 text-[18px] leading-[1.45] tracking-[-0.02em] text-[#0f172a] sm:text-[20px]">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#faf6ef] text-[#cca24f]">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [page, blogPost] = await Promise.all([
    getSingletonPage("BLOG_DETAIL"),
    getPublishedBlogPost(slug),
  ]);

  if (!blogPost) {
    notFound();
  }

  const categoryLabel = formatBlogCategoryLabel(blogPost.category) || "Insight Article";
  const paragraphs = splitBlogParagraphs(blogPost.content);
  const publishedLabel = formatBlogDate(blogPost.publishedAt);
  const readTimeLabel = estimateReadTimeLabel(blogPost.content, blogPost.readTime);
  const authorLabel = blogPost.authorName?.trim() || "Pryceless Ventures";
  const pageIntro = getCmsText(page?.intro);
  const pageDisclaimer = getCmsText(page?.disclaimer);
  const heroEyebrow =
    getCmsText(getPageGroupItem(page, "hero_eyebrow")?.title) ??
    getCmsText(page?.pageTitle) ??
    "Insight Article";
  const snapshotSectionTitle =
    getCmsText(getPageGroupItem(page, "snapshot_section_title")?.title) ?? "Article Snapshot";
  const overviewSectionTitle =
    getCmsText(getPageGroupItem(page, "overview_section_title")?.title) ?? "Insight Overview";
  const standoutSection = getPageGroupItem(page, "standout_section_content");
  const standoutSectionTitle =
    getCmsText(standoutSection?.title) ?? "What This Article Breaks Down";
  const standoutSectionBody =
    getCmsText(standoutSection?.body) ??
    "The strongest themes and decision points surfaced in the published insight.";
  const profileSectionTitle =
    getCmsText(getPageGroupItem(page, "profile_section_title")?.title) ??
    "Who This Insight Helps";
  const actionSection = getPageGroupItem(page, "action_section_content");
  const actionSectionTitle =
    getCmsText(actionSection?.title) ?? "Key Action Points";
  const actionSectionBody =
    getCmsText(actionSection?.body) ??
    "The ideas most likely to change how a borrower or investor structures the next move.";
  const summarySectionTitle =
    getCmsText(getPageGroupItem(page, "summary_section_title")?.title) ?? "Article Summary";
  const narrativeParagraphs = collectUniqueStrings([blogPost.excerpt, ...paragraphs]);
  const focusParagraphs = paragraphs.length > 0 ? paragraphs : narrativeParagraphs;
  const snapshotLabels = [
    "Core Theme",
    "Execution Lens",
    "Borrower Angle",
    "Decision Focus",
  ];

  const heroCards = [
    {
      icon: <BuildingIcon className="h-6 w-6" />,
      label: "Category",
      toneClassName: "bg-[#e9fbf2] text-[#28b777]",
      value: categoryLabel,
    },
    {
      icon: <CalendarIcon className="h-6 w-6" />,
      label: "Published",
      toneClassName: "bg-[#edf4ff] text-[#2563eb]",
      value: publishedLabel || "Publishing Soon",
    },
    {
      icon: <TrendIcon className="h-6 w-6" />,
      label: "Read Time",
      toneClassName: "bg-[#f2ebff] text-[#7c3aed]",
      value: readTimeLabel,
    },
    {
      icon: <SparkIcon className="h-6 w-6" />,
      label: "Author",
      toneClassName: "bg-[#fff4e6] text-[#ea7f00]",
      value: authorLabel,
    },
  ];

  const snapshotCards = focusParagraphs
    .slice(0, 4)
    .map((paragraph, index) => ({
      icon: [
        <TrendIcon className="h-6 w-6" key="trend" />,
        <MedalIcon className="h-6 w-6" key="medal" />,
        <BuildingIcon className="h-6 w-6" key="building" />,
        <CheckCircleIcon className="h-6 w-6" key="check" />,
      ][index],
      label: snapshotLabels[index] ?? `Insight ${index + 1}`,
      toneClassName: "bg-[#f8fafc] text-[#1e293b]",
      value: condensePhrase(splitLeadLine(paragraph).lead),
    }))
    .filter((item) => item.value);

  const overviewFeatureStats = heroCards
    .slice(0, 3)
    .map((item) => ({ label: item.label, value: item.value }))
    .filter((item) => item.value);

  const overviewSupportItems =
    narrativeParagraphs.length > 1 ? narrativeParagraphs.slice(1, 3) : focusParagraphs.slice(0, 2);

  const standoutItems = focusParagraphs.slice(0, 4).map((paragraph, index) => {
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
      title: condensePhrase(lead, 52),
    };
  });

  const profileTags = extractBlogTopicTags({
    categoryLabel,
    content: blogPost.content,
    excerpt: blogPost.excerpt,
    title: blogPost.title,
  });

  const actionPoints = collectUniqueStrings(
    focusParagraphs.slice(0, 4).map((paragraph) => splitLeadLine(paragraph).lead),
  );
  const closingSummaryParagraphs =
    narrativeParagraphs.length > 2
      ? narrativeParagraphs.slice(-2)
      : narrativeParagraphs.slice(0, 2);
  const shellCta = {
    href: page?.ctaHref || "/blogs",
    label: page?.ctaLabel || "Back to Insights",
  };

  return (
    <SiteShell cta={shellCta}>
      <DetailPageCanvas>
        <div className="bg-[linear-gradient(180deg,#fffdf9_0%,#ffffff_24%,#fffdf7_100%)]">
          <DetailSection className="pb-14 pt-10 sm:pt-12 lg:pb-18 lg:pt-14">
            <DetailBreadcrumbs currentLabel={blogPost.title} href="/blogs" hrefLabel="Insights" />

            <div className="mt-8">
              <div className="flex flex-col">
                <div className="grid gap-10 xl:grid-cols-[minmax(0,0.98fr)_minmax(420px,1fr)] xl:items-center xl:gap-14">
                  <div>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center rounded-full bg-[#e8f8ee] px-4 py-2 text-[15px] font-semibold tracking-[-0.02em] text-[#17986b]">
                        {heroEyebrow}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#ffe8ec] px-4 py-2 text-[15px] font-semibold tracking-[-0.02em] text-[#dc4e6b]">
                        {categoryLabel}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#e8f0ff] px-4 py-2 text-[15px] font-semibold tracking-[-0.02em] text-[#2962eb]">
                        {readTimeLabel}
                      </span>
                    </div>

                    <div className="mt-5 space-y-8 sm:space-y-10">
                      <h1
                        className="max-w-[760px] text-balance text-[32px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#14213c] sm:text-[42px] lg:text-[52px]"
                        style={serifHeadingStyle}
                      >
                        {blogPost.title}
                      </h1>
                      {pageIntro ? (
                        <p className="max-w-[760px] text-[15px] leading-[1.76] text-slate-500 sm:text-[16px]">
                          {pageIntro}
                        </p>
                      ) : null}
                      <p className="max-w-[760px] text-[16px] leading-[1.78] text-slate-600 sm:text-[17px]">
                        {blogPost.excerpt}
                      </p>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                      {heroCards.map((item) => (
                        <InsightValueCard
                          icon={item.icon}
                          key={`${item.label}-${item.value}`}
                          label={item.label}
                          toneClassName={item.toneClassName}
                          value={item.value}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[36px] border border-[#e8e1d6] bg-white shadow-[0_22px_54px_rgba(15,23,42,0.1)]">
                    <div className="relative min-h-[360px] sm:min-h-[460px] xl:min-h-[560px]">
                      <Image
                        alt={getBlogImageAlt(blogPost)}
                        className="object-cover"
                        fill
                        priority
                        sizes="(max-width: 1279px) 100vw, 48vw"
                        src={getBlogImageSource(blogPost)}
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
                </div>
              </div>

              {snapshotCards.length ? (
                <div className="mt-14">
                  <InsightSectionHeading title={snapshotSectionTitle} />
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {snapshotCards.map((item) => (
                      <InsightValueCard
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
              {narrativeParagraphs.length ? (
                <section>
                  <InsightSectionHeading title={overviewSectionTitle} />
                  <div className="mt-8 rounded-[30px] border border-[#eadfcf] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] sm:p-6">
                    <div className="rounded-[24px] border border-[#ecdcc6] bg-[#fffdf9] px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#bf9375]">
                        Overview
                      </p>
                      <p className="mt-3 max-w-[820px] text-[20px] font-semibold leading-[1.45] tracking-[-0.03em] text-[#14213c] sm:text-[24px]">
                        {narrativeParagraphs[0]}
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
                  <InsightSectionHeading
                    title={standoutSectionTitle}
                    description={standoutSectionBody}
                  />
                  <div className="mt-8 grid gap-5 xl:grid-cols-2">
                    {standoutItems.map((item, index) => (
                      <InsightStandoutCard
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
                  <InsightSectionHeading title={profileSectionTitle} />
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

              {actionPoints.length || closingSummaryParagraphs.length ? (
                <section>
                  <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.9fr)] xl:items-start">
                    <div>
                      <InsightSectionHeading
                        title={actionSectionTitle}
                        description={actionSectionBody}
                      />
                      {actionPoints.length ? (
                        <ul className="mt-8 space-y-6">
                          {actionPoints.map((item, index) => {
                            const icons = [
                              <TrendIcon className="h-7 w-7" key="trend" />,
                              <CheckCircleIcon className="h-7 w-7" key="check" />,
                              <BuildingIcon className="h-7 w-7" key="building" />,
                              <MedalIcon className="h-7 w-7" key="medal" />,
                            ];

                            return (
                              <InsightListItem
                                icon={icons[index % icons.length]}
                                key={`${item}-${index}`}
                                text={item}
                              />
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>

                    <div className="rounded-[32px] border border-[#dce7f5] bg-[#eef5ff] p-4 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
                      <div className="rounded-[28px] bg-white p-6 shadow-[inset_0_0_0_1px_rgba(220,231,245,0.95)] sm:p-7">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#bf9375]">
                          {summarySectionTitle}
                        </p>
                        <p className="mt-3 text-[18px] font-semibold leading-[1.45] tracking-[-0.03em] text-[#14213c] sm:text-[20px]">
                          {blogPost.excerpt}
                        </p>

                        {closingSummaryParagraphs.map((paragraph, index) => (
                          <p
                            className="mt-3 text-[15px] leading-[1.8] text-slate-600"
                            key={`${paragraph}-${index}`}
                          >
                            {paragraph}
                          </p>
                        ))}

                        <div className="mt-6 flex flex-wrap gap-3">
                          <a className={detailPrimaryButtonClassName} href="/get-financing">
                            Explore Loan Programs
                          </a>
                          <a className={detailSecondaryButtonClassName} href={shellCta.href}>
                            {shellCta.label}
                          </a>
                        </div>

                        {pageDisclaimer ? (
                          <p className="mt-6 border-t border-slate-100 pt-6 text-[13px] leading-[1.7] text-slate-500">
                            {pageDisclaimer}
                          </p>
                        ) : null}
                      </div>
                    </div>
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
