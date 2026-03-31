import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicForm } from "@/components/forms/public-form";
import {
  DetailMediaCarousel,
  type DetailMediaCarouselItem,
} from "@/components/public/detail-media-carousel";
import {
  DetailBadgeRow,
  DetailBreadcrumbs,
  DetailBulletList,
  DetailGlassPanel,
  DetailNarrativeBlock,
  DetailPageCanvas,
  DetailSection,
  DetailSectionHeading,
  DetailStatGrid,
  detailPrimaryButtonClassName,
  detailSecondaryButtonClassName,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedProperty, getSingletonPage } from "@/lib/data/public";
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

const createMediaItems = (property: NonNullable<Awaited<ReturnType<typeof getPublishedProperty>>>) => {
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

  const primaryImage = resolvePrimaryImage(property);

  if (primaryImage) {
    pushItem({
      alt: property.title,
      caption: property.summary,
      eyebrow: "Featured View",
      src: primaryImage,
      title: property.title,
    });
  }

  property.images.forEach((image, index) => {
    pushItem({
      alt: image.altText || property.title,
      caption: image.caption || `${property.title} image ${index + 1}`,
      eyebrow: `Gallery ${String(index + 1).padStart(2, "0")}`,
      src: image.mediaFile.blobUrl,
      title: image.caption || property.title,
    });
  });

  return items.slice(0, 6);
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [page, property] = await Promise.all([
    getSingletonPage("PROPERTY_DETAIL"),
    getPublishedProperty(slug),
  ]);

  if (!property) {
    notFound();
  }

  const location = [property.locationCity, property.locationState].filter(Boolean).join(", ");
  const narrativeParagraphs = splitParagraphs(page?.intro || property.summary);
  const buyerFitParagraphs = splitParagraphs(property.buyerFit);
  const highlights = property.highlights.map((highlight) => highlight.highlight);
  const mediaItems = createMediaItems(property);
  const propertyStats = [
    location ? { label: "Location", value: location } : null,
    property.propertyType ? { label: "Property Type", value: formatDisplayValue(property.propertyType) } : null,
    property.strategy ? { label: "Strategy", value: formatDisplayValue(property.strategy) } : null,
    property.status ? { label: "Status", value: formatDisplayValue(property.status) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
  const badgeItems = [
    property.propertyType ? formatDisplayValue(property.propertyType) : null,
    property.strategy ? formatDisplayValue(property.strategy) : null,
    property.status ? formatDisplayValue(property.status) : null,
  ].filter(Boolean) as string[];
  const ctaLabel = page?.ctaLabel || property.inquiryForm?.formName;

  return (
    <SiteShell cta={{ href: "/properties", label: "Back to Properties" }}>
      <DetailPageCanvas>
        <DetailSection className="pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
          <DetailBreadcrumbs currentLabel={property.title} href="/" />

          <div
            className={`mt-7 grid gap-8 lg:items-start lg:gap-10 ${
              mediaItems.length ? "lg:grid-cols-[minmax(0,1fr)_minmax(480px,540px)]" : ""
            }`}
          >
            <div className="max-w-[690px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                Property Detail
              </p>
              <h1 className="mt-4 text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] text-[#111827] sm:text-[48px] lg:text-[62px]">
                {property.title}
              </h1>
              <p className="mt-5 max-w-[620px] text-[16px] leading-[1.85] text-slate-700 sm:text-[17px]">
                {property.summary}
              </p>

              <div className="mt-7">
                <DetailBadgeRow items={badgeItems} />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {ctaLabel && property.inquiryForm ? (
                  <Link className={detailPrimaryButtonClassName} href="#property-inquiry">
                    {ctaLabel}
                  </Link>
                ) : null}
                <Link className={detailSecondaryButtonClassName} href="/properties">
                  Explore More Properties
                </Link>
              </div>

              {propertyStats.length ? (
                <div className="mt-8">
                  <DetailStatGrid columns={4} items={propertyStats} />
                </div>
              ) : null}
            </div>

            {mediaItems.length ? <DetailMediaCarousel items={mediaItems} priorityFirst /> : null}
          </div>
        </DetailSection>

        <DetailSection className="pb-14 lg:pb-18">
          <div className={`grid gap-6 ${property.inquiryForm ? "lg:grid-cols-[minmax(0,1fr)_390px]" : ""}`}>
            <div className="grid gap-6">
              <DetailNarrativeBlock
                body={narrativeParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
                eyebrow="Property Story"
                title={page?.pageTitle || property.title}
              />

              {highlights.length ? (
                <DetailGlassPanel>
                  <DetailSectionHeading eyebrow="Highlights" title="Highlights" />
                  <div className="mt-5">
                    <DetailBulletList items={highlights} />
                  </div>
                </DetailGlassPanel>
              ) : null}

              {buyerFitParagraphs.length ? (
                <DetailNarrativeBlock
                  body={buyerFitParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                  eyebrow="Buyer Alignment"
                  title="Buyer Fit"
                />
              ) : null}
            </div>

            {property.inquiryForm ? (
              <div className="grid gap-6 lg:sticky lg:top-[96px] lg:self-start">
                <div id="property-inquiry">
                  <PublicForm
                    form={property.inquiryForm}
                    sourcePath={`/properties/${property.slug}`}
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
