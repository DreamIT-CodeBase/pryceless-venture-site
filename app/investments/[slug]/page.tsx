import { notFound } from "next/navigation";

import { PublicForm } from "@/components/forms/public-form";
import {
  DetailMediaCarousel,
  type DetailMediaCarouselItem,
} from "@/components/public/detail-media-carousel";
import {
  DetailBreadcrumbs,
  DetailBulletList,
  DetailGlassPanel,
  DetailNarrativeBlock,
  DetailPageCanvas,
  DetailSection,
  DetailSectionHeading,
  DetailStatGrid,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import {
  getActiveFormBySlug,
  getPublishedInvestment,
  getSingletonPage,
} from "@/lib/data/public";
import { resolvePrimaryImage } from "@/lib/media";

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

const createMediaItems = (investment: NonNullable<Awaited<ReturnType<typeof getPublishedInvestment>>>) => {
  const items: DetailMediaCarouselItem[] = [];
  const seen = new Set<string>();

  const pushItem = ({
    src,
    alt,
    caption,
    title,
    eyebrow,
  }: Omit<DetailMediaCarouselItem, "id">) => {
    const itemKey = typeof src === "string" ? src : src.src;
    if (!itemKey || seen.has(itemKey)) {
      return;
    }

    seen.add(itemKey);
    items.push({
      alt,
      caption,
      eyebrow,
      id: `${items.length}-${itemKey}`,
      src,
      title,
    });
  };

  const primaryImage = resolvePrimaryImage(investment);

  if (primaryImage) {
    pushItem({
      alt: investment.title,
      caption: investment.summary,
      eyebrow: "Opportunity Hero",
      src: primaryImage,
      title: investment.title,
    });
  }

  investment.images.forEach((image, index) => {
    pushItem({
      alt: image.altText || investment.title,
      caption: image.caption || undefined,
      eyebrow: `Gallery ${String(index + 1).padStart(2, "0")}`,
      src: image.mediaFile.blobUrl,
      title: image.caption || investment.title,
    });
  });

  return items.slice(0, 6);
};

export default async function InvestmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [page, investment, fallbackForm] = await Promise.all([
    getSingletonPage("INVESTMENT_DETAIL"),
    getPublishedInvestment(slug),
    getActiveFormBySlug("deal-packet-request"),
  ]);

  if (!investment) {
    notFound();
  }

  const form = investment.dealPacketForm ?? fallbackForm;
  const mediaItems = createMediaItems(investment);
  const highlightItems = investment.highlights.map((highlight) => highlight.highlight);
  const summaryParagraphs = splitParagraphs(investment.summary);
  const disclaimerParagraphs = splitParagraphs(investment.returnsDisclaimer || page?.disclaimer);
  const investmentStats = [
    investment.minimumInvestmentDisplay
      ? { label: "Minimum Investment", value: investment.minimumInvestmentDisplay }
      : null,
    investment.status ? { label: "Status", value: formatDisplayValue(investment.status) } : null,
    investment.assetType ? { label: "Asset Type", value: formatDisplayValue(investment.assetType) } : null,
    investment.strategy ? { label: "Strategy", value: formatDisplayValue(investment.strategy) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
  const ctaLabel = page?.ctaLabel || form?.formName;

  return (
    <SiteShell cta={{ href: "/investments", label: "Back to Investments" }}>
      <DetailPageCanvas>
        <DetailSection className="pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
          <DetailBreadcrumbs currentLabel={investment.title} href="/" />

          <div
            className={`mt-7 grid gap-8 lg:items-start lg:gap-12 ${
              mediaItems.length ? "lg:grid-cols-[minmax(0,760px)_minmax(440px,520px)]" : ""
            }`}
          >
            <div className="max-w-[760px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[#bf9375] sm:text-[13px]">
                Investment Detail
              </p>
              <h1 className="mt-3 max-w-[660px] text-balance text-[32px] font-medium leading-[1.02] tracking-[-0.05em] text-[#111827] sm:text-[42px] lg:text-[52px]">
                {investment.title}
              </h1>
              <p className="mt-10 max-w-[760px] text-[16px] leading-[1.78] text-slate-700 sm:mt-12 sm:text-[17px]">
                {page?.intro ?? investment.summary}
              </p>

              {investmentStats.length ? (
                <div className="mt-14 max-w-[980px] sm:mt-16">
                  <DetailStatGrid columns={4} items={investmentStats} />
                </div>
              ) : null}

              <div className="mt-14 hidden lg:block">
                <DetailNarrativeBlock
                  body={summaryParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                  eyebrow="Opportunity Thesis"
                  title={page?.pageTitle || investment.title}
                />
              </div>
            </div>

            {mediaItems.length ? <DetailMediaCarousel items={mediaItems} priorityFirst /> : null}
          </div>
        </DetailSection>

        <DetailSection className="pb-14 lg:pb-18">
          <div className={`grid gap-6 ${form ? "lg:grid-cols-[minmax(0,1fr)_390px]" : ""}`}>
            <div className="grid gap-6">
              <div className="lg:hidden">
                <DetailNarrativeBlock
                  body={summaryParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                  eyebrow="Opportunity Thesis"
                  title={page?.pageTitle || investment.title}
                />
              </div>

              {highlightItems.length ? (
                <DetailGlassPanel>
                  <DetailSectionHeading eyebrow="Highlights" title="Highlights" />
                  <div className="mt-5">
                    <DetailBulletList items={highlightItems} />
                  </div>
                </DetailGlassPanel>
              ) : null}

              {disclaimerParagraphs.length ? (
                <DetailNarrativeBlock
                  body={disclaimerParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                  eyebrow="Returns & Assumptions"
                  title="Modeled outcomes and disclosure context"
                />
              ) : null}
            </div>

            {form ? (
              <div className="grid gap-6 lg:sticky lg:top-[96px] lg:self-start">
                <div id="deal-packet-form">
                  <PublicForm
                    form={form}
                    sourcePath={`/investments/${investment.slug}`}
                    title={ctaLabel}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </DetailSection>
      </DetailPageCanvas>
    </SiteShell>
  );
}
