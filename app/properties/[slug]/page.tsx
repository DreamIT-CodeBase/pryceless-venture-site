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
      caption: image.caption || undefined,
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
  const ctaLabel = page?.ctaLabel || property.inquiryForm?.formName;

  return (
    <SiteShell cta={{ href: "/properties", label: "Back to Properties" }}>
      <DetailPageCanvas>
        <DetailSection className="pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
          <DetailBreadcrumbs currentLabel={property.title} href="/" />

          <div
            className={`mt-7 grid gap-8 lg:items-start lg:gap-12 ${
              mediaItems.length ? "lg:grid-cols-[minmax(0,760px)_minmax(440px,520px)]" : ""
            }`}
          >
            <div className="max-w-[760px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[#bf9375] sm:text-[13px]">
                Property Detail
              </p>
              <h1 className="mt-3 max-w-[660px] text-balance text-[32px] font-medium leading-[1.02] tracking-[-0.05em] text-[#111827] sm:text-[42px] lg:text-[52px]">
                {property.title}
              </h1>
              <p className="mt-10 max-w-[760px] text-[16px] leading-[1.78] text-slate-700 sm:mt-12 sm:text-[17px]">
                {page?.intro ?? property.summary}
              </p>

              {propertyStats.length ? (
                <div className="mt-14 max-w-[980px] sm:mt-16">
                  <DetailStatGrid columns={4} items={propertyStats} />
                </div>
              ) : null}

              <div className="mt-14 hidden lg:block">
                <DetailNarrativeBlock
                  body={narrativeParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                  eyebrow="Property Story"
                  title={page?.pageTitle || property.title}
                />
              </div>
            </div>

            {mediaItems.length ? <DetailMediaCarousel items={mediaItems} priorityFirst /> : null}
          </div>
        </DetailSection>

        <DetailSection className="pb-14 lg:pb-18">
          <div className={`grid gap-6 ${property.inquiryForm ? "lg:grid-cols-[minmax(0,1fr)_390px]" : ""}`}>
            <div className="grid gap-6">
              <div className="lg:hidden">
                <DetailNarrativeBlock
                  body={narrativeParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                  eyebrow="Property Story"
                  title={page?.pageTitle || property.title}
                />
              </div>

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
