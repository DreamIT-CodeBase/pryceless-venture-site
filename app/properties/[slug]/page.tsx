import Image, { type StaticImageData } from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PropertyInquiryForm } from "@/components/forms/property-inquiry-form";
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
import { getPublishedProperty, getSingletonPage } from "@/lib/data/public";
import { resolvePrimaryImage } from "@/lib/media";
import {
  getPropertyGoogleMapsEmbedUrl,
  getPropertyGoogleMapsOpenUrl,
  parsePropertyDetailContent,
} from "@/lib/property-detail-content";
import {
  formatPropertyStatusLabel,
  getPropertyPortfolioStage,
  parsePropertyHighlights,
} from "@/lib/property-portfolio";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const serifHeadingStyle = {
  fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
};

const formatDisplayValue = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const normalizeMetricKey = (value: string | null | undefined) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

const getPropertyTypeBadgeLabel = (value: string | null | undefined) => {
  switch (normalizeMetricKey(value)) {
    case "singlefamily":
    case "singlefamilyhome":
    case "singlefamilyresidence":
    case "singlefamilyresidential":
    case "singlefamilyrental":
    case "sfr":
      return "SFR";
    case "multifamily":
    case "mfr":
      return "MFR";
    case "townhome":
    case "townhouse":
      return "Townhome";
    case "condominium":
    case "condo":
      return "Condo";
    default:
      return formatDisplayValue(value);
  }
};

const splitParagraphs = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const getMetricValue = (
  lookup: Map<string, string>,
  explicitValue: string | null | undefined,
  fallbackLabel: string,
) => explicitValue || lookup.get(normalizeMetricKey(fallbackLabel)) || null;

const createGalleryImages = (
  property: NonNullable<Awaited<ReturnType<typeof getPublishedProperty>>>,
) => {
  const images: Array<{
    alt: string;
    caption?: string | null;
    src: string | StaticImageData;
  }> = [];
  const seen = new Set<string>();

  const pushImage = (
    src: string | StaticImageData | null | undefined,
    alt: string,
    caption?: string | null,
  ) => {
    if (!src) {
      return;
    }

    const itemKey = typeof src === "string" ? src : src.src;
    if (!itemKey || seen.has(itemKey)) {
      return;
    }

    seen.add(itemKey);
    images.push({ alt, caption, src });
  };

  pushImage(resolvePrimaryImage(property), property.title, property.summary);

  property.images.forEach((image, index) => {
    pushImage(
      image.mediaFile.blobUrl,
      image.altText || `${property.title} gallery image ${index + 1}`,
      image.caption,
    );
  });

  return images;
};

function ArrowTrendIcon({ className = "" }: { className?: string }) {
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

function PercentIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m7.5 16.5 9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="8" cy="8" fill="currentColor" r="2.25" />
      <circle cx="16" cy="16" fill="currentColor" r="2.25" />
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

function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4.5 10.5 12 4l7.5 6.5v8.25a1.25 1.25 0 0 1-1.25 1.25h-3.5v-5.5h-5.5V20h-3.5A1.25 1.25 0 0 1 4.5 18.75V10.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function WalletIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5.25 7.25h12.5A1.75 1.75 0 0 1 19.5 9v8A1.75 1.75 0 0 1 17.75 18.75H6.25A1.75 1.75 0 0 1 4.5 17V9A1.75 1.75 0 0 1 6.25 7.25ZM5.5 7.5V6.25A1.75 1.75 0 0 1 7.25 4.5H17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="16.75" cy="13" fill="currentColor" r="1.2" />
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

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 20.25c3-3.75 4.5-6.62 4.5-8.63a4.5 4.5 0 1 0-9 0c0 2.01 1.5 4.88 4.5 8.63Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="12" cy="11.5" fill="currentColor" r="1.5" />
    </svg>
  );
}

function CommunityIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M8 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11.75a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.75 19.25a4.75 4.75 0 0 1 8.5-2.9m2.1 2.9a4 4 0 0 1 6-3.46"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PropertySectionHeading({
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

function PropertyBadge({
  label,
  toneClassName,
}: {
  label: string;
  toneClassName: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-2 text-[15px] font-semibold tracking-[-0.02em] ${toneClassName}`}
    >
      {label}
    </span>
  );
}

function PropertyValueCard({
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

function StandoutCard({
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

function LocationBenefitItem({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <li className="flex items-center gap-4 text-[18px] leading-[1.45] tracking-[-0.02em] text-[#0f172a] sm:text-[20px]">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#faf6ef] text-[#cca24f]">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

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

  const stage = getPropertyPortfolioStage(property.status);
  const statusLabel = formatPropertyStatusLabel(property.status || stage);
  const locationLabel = [property.locationCity, property.locationState].filter(Boolean).join(", ");
  const galleryImages = createGalleryImages(property);
  const galleryCarouselItems: DetailMediaCarouselItem[] = galleryImages.map((image, index) => ({
    alt: image.alt,
    caption: image.caption ?? undefined,
    eyebrow: image.caption ? `Gallery ${String(index + 1).padStart(2, "0")}` : undefined,
    id: `property-gallery-${index}`,
    src: image.src,
  }));
  const heroImage = galleryImages[0] ?? null;
  const detailContent = parsePropertyDetailContent(property.detailContent);
  const highlightContent = parsePropertyHighlights(
    property.highlights.map((highlight) => highlight.highlight),
  );
  const metricLookup = new Map(
    highlightContent.metrics.map((item) => [normalizeMetricKey(item.label), item.value]),
  );

  const performanceCards = [
    {
      icon: <ArrowTrendIcon className="h-6 w-6" />,
      label: "ROI",
      toneClassName: "bg-[#e9fbf2] text-[#28b777]",
      value: getMetricValue(metricLookup, detailContent.performance.roi, "ROI"),
    },
    {
      icon: <PercentIcon className="h-6 w-6" />,
      label: "Cap Rate",
      toneClassName: "bg-[#edf4ff] text-[#2563eb]",
      value: getMetricValue(metricLookup, detailContent.performance.capRate, "Cap Rate"),
    },
    {
      icon: <DollarIcon className="h-6 w-6" />,
      label: "Monthly Cash Flow",
      toneClassName: "bg-[#f2ebff] text-[#7c3aed]",
      value: getMetricValue(
        metricLookup,
        detailContent.performance.monthlyCashFlow,
        "Monthly Cash Flow",
      ),
    },
    {
      icon: <CalendarIcon className="h-6 w-6" />,
      label: "Investment Horizon",
      toneClassName: "bg-[#fff4e6] text-[#ea7f00]",
      value: getMetricValue(
        metricLookup,
        detailContent.performance.investmentHorizon,
        "Investment Horizon",
      ),
    },
  ].filter((item) => item.value) as Array<{
    icon: ReactNode;
    label: string;
    toneClassName: string;
    value: string;
  }>;

  const snapshotCards = [
    {
      icon: <HomeIcon className="h-6 w-6" />,
      label: "Purchase Price",
      toneClassName: "bg-[#f8fafc] text-[#1e293b]",
      value: getMetricValue(metricLookup, detailContent.snapshot.purchasePrice, "Purchase Price"),
    },
    {
      icon: <BuildingIcon className="h-6 w-6" />,
      label: "Estimated Rent",
      toneClassName: "bg-[#f8fafc] text-[#1e293b]",
      value: getMetricValue(metricLookup, detailContent.snapshot.estimatedRent, "Estimated Rent"),
    },
    {
      icon: <WalletIcon className="h-6 w-6" />,
      label: "Renovation Cost",
      toneClassName: "bg-[#f8fafc] text-[#1e293b]",
      value: getMetricValue(
        metricLookup,
        detailContent.snapshot.renovationCost,
        "Renovation Cost",
      ),
    },
    {
      icon: <MedalIcon className="h-6 w-6" />,
      label: "ARV",
      toneClassName: "bg-[#f8fafc] text-[#1e293b]",
      value: getMetricValue(metricLookup, detailContent.snapshot.arv, "ARV"),
    },
  ].filter((item) => item.value) as Array<{
    icon: ReactNode;
    label: string;
    toneClassName: string;
    value: string;
  }>;

  const investmentOverviewParagraphs = splitParagraphs(
    property.buyerFit || page?.intro || property.summary,
  );

  const overviewFeatureStats = snapshotCards
    .slice(0, 3)
    .map((item) => ({ label: item.label, value: item.value }));

  const overviewSupportItems =
    investmentOverviewParagraphs.length > 1
      ? investmentOverviewParagraphs.slice(1, 3)
      : highlightContent.bullets.slice(0, 2);

  const standoutItems =
    detailContent.standoutItems.length > 0
      ? detailContent.standoutItems
      : highlightContent.bullets.slice(0, 4).map((item, index) => ({
          description: item,
          title: ["Deal Highlight", "Execution Angle", "Market Context", "Investor Upside"][index],
        }));

  const investorProfile =
    detailContent.investorProfile.length > 0
      ? detailContent.investorProfile
      : [
          formatDisplayValue(property.strategy),
          formatDisplayValue(property.propertyType),
          stage === "FOR_SALE" ? "Active Inventory" : null,
        ].filter(Boolean);

  const locationBenefits = detailContent.locationBenefits;
  const mapSearchFallback = [property.title, locationLabel].filter(Boolean).join(", ");
  const mapEmbedUrl = getPropertyGoogleMapsEmbedUrl(
    detailContent.googleMapsUrl,
    mapSearchFallback,
  );
  const mapOpenUrl = getPropertyGoogleMapsOpenUrl(
    detailContent.googleMapsUrl,
    mapSearchFallback,
  );

  const inquiryForm = property.inquiryForm ?? null;
  const showInquiryForm = stage === "FOR_SALE" && Boolean(inquiryForm);
  const ctaLabel = page?.ctaLabel || inquiryForm?.formName || "Get Full Deal Access";

  const heroCards =
    performanceCards.length > 0
      ? performanceCards
      : [
          {
            icon: <PinIcon className="h-6 w-6" />,
            label: "Location",
            toneClassName: "bg-[#edf4ff] text-[#2563eb]",
            value: locationLabel || "Location pending",
          },
          {
            icon: <HomeIcon className="h-6 w-6" />,
            label: "Property Type",
            toneClassName: "bg-[#e9fbf2] text-[#28b777]",
            value: getPropertyTypeBadgeLabel(property.propertyType) || "Property",
          },
          {
            icon: <ArrowTrendIcon className="h-6 w-6" />,
            label: "Strategy",
            toneClassName: "bg-[#f2ebff] text-[#7c3aed]",
            value: formatDisplayValue(property.strategy) || "Not specified",
          },
          {
            icon: <CalendarIcon className="h-6 w-6" />,
            label: "Status",
            toneClassName: "bg-[#fff4e6] text-[#ea7f00]",
            value: statusLabel,
          },
        ];

  const heroBadges = [
    heroCards.some((item) => item.label === "ROI")
      ? {
          label: "High ROI",
          toneClassName: "bg-[#e8f8ee] text-[#17986b]",
        }
      : {
          label: formatDisplayValue(property.strategy) || "Opportunity",
          toneClassName: "bg-[#e8f8ee] text-[#17986b]",
        },
    {
      label: stage === "FOR_SALE" ? "Hot Deal" : statusLabel,
      toneClassName: "bg-[#ffe8ec] text-[#dc4e6b]",
    },
    {
      label: getPropertyTypeBadgeLabel(property.propertyType) || "Property",
      toneClassName: "bg-[#e8f0ff] text-[#2962eb]",
    },
  ];

  return (
    <SiteShell cta={{ href: "/properties", label: "Back to Properties" }}>
      <DetailPageCanvas>
        <div className="bg-[linear-gradient(180deg,#fffdf9_0%,#ffffff_24%,#fffdf7_100%)]">
          <DetailSection className="pb-14 pt-10 sm:pt-12 lg:pb-18 lg:pt-14">
            <DetailBreadcrumbs currentLabel={property.title} href="/" />

            <div className="mt-8">
              <div className="flex flex-col">
                <div
                  className={`grid gap-10 xl:grid-cols-[minmax(0,0.98fr)_minmax(420px,1fr)] xl:items-center xl:gap-14 ${
                    heroImage ? "" : "max-w-[980px]"
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap gap-3">
                      {heroBadges.map((item) => (
                        <PropertyBadge
                          key={item.label}
                          label={item.label}
                          toneClassName={item.toneClassName}
                        />
                      ))}
                    </div>

                    <div className="mt-5 space-y-8 sm:space-y-10">
                      <h1
                        className="max-w-[660px] text-balance text-[32px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#14213c] sm:text-[42px] lg:text-[52px]"
                        style={serifHeadingStyle}
                      >
                        {property.title}
                      </h1>
                      <p className="max-w-[760px] text-[16px] leading-[1.78] text-slate-600 sm:text-[17px]">
                        {property.summary}
                      </p>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                      {heroCards.slice(0, 4).map((item) => (
                        <PropertyValueCard
                          icon={item.icon}
                          key={item.label}
                          label={item.label}
                          toneClassName={item.toneClassName}
                          value={item.value}
                        />
                      ))}
                    </div>
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
                            <PinIcon className="h-6 w-6" />
                          </span>
                          <span className="text-[18px] font-semibold tracking-[-0.02em] sm:text-[20px]">
                            {locationLabel || "Property location"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {snapshotCards.length ? (
                <div className="mt-14">
                  <PropertySectionHeading title="Investment Snapshot" />
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {snapshotCards.map((item) => (
                      <PropertyValueCard
                        icon={item.icon}
                        key={item.label}
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
              {galleryCarouselItems.length || showInquiryForm ? (
                <section>
                  {galleryCarouselItems.length && showInquiryForm && inquiryForm ? (
                    <div className="grid gap-10 xl:grid-cols-[minmax(0,7fr)_minmax(360px,4fr)] xl:items-start">
                      <div>
                        <PropertySectionHeading title="Property Gallery" />
                        <DetailMediaCarousel
                          autoPlayMs={4800}
                          className="mt-8"
                          imageSizes="(max-width: 1279px) 100vw, 60vw"
                          items={galleryCarouselItems}
                          priorityFirst
                        />
                      </div>

                      <div className="pv-property-inquiry-rail xl:sticky xl:top-24">
                        <div className="pv-property-inquiry-frame" id="property-inquiry">
                          <PropertyInquiryForm
                            className="w-full"
                            description="Submit your details and our team will respond with the next steps."
                            eyebrow="Form"
                            form={inquiryForm}
                            sourcePath={`/properties/${property.slug}`}
                            submitLabel={ctaLabel}
                            title="Unlock This Investment"
                          />
                        </div>
                      </div>
                    </div>
                  ) : galleryCarouselItems.length ? (
                    <div>
                      <PropertySectionHeading title="Property Gallery" />
                      <DetailMediaCarousel
                        autoPlayMs={4800}
                        className="mt-8"
                        imageSizes="(max-width: 1279px) 100vw, 60vw"
                        items={galleryCarouselItems}
                        priorityFirst
                      />
                    </div>
                  ) : showInquiryForm && inquiryForm ? (
                    <div className="pv-property-inquiry-rail max-w-[560px]">
                      <div className="pv-property-inquiry-frame" id="property-inquiry">
                        <PropertyInquiryForm
                          className="w-full"
                          description="Submit your details and our team will respond with the next steps."
                          eyebrow="Form"
                          form={inquiryForm}
                          sourcePath={`/properties/${property.slug}`}
                          submitLabel={ctaLabel}
                          title="Unlock This Investment"
                        />
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {investmentOverviewParagraphs.length ? (
                <section>
                  <PropertySectionHeading title="Investment Overview" />
                  <div className="mt-8 rounded-[30px] border border-[#eadfcf] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] sm:p-6">
                    <div className="rounded-[24px] border border-[#ecdcc6] bg-[#fffdf9] px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#bf9375]">
                        Overview
                      </p>
                      <p className="mt-3 max-w-[820px] text-[20px] font-semibold leading-[1.45] tracking-[-0.03em] text-[#14213c] sm:text-[24px]">
                        {investmentOverviewParagraphs[0]}
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
                  <PropertySectionHeading title="Why This Deal Stands Out" />
                  <div className="mt-8 grid gap-5 xl:grid-cols-2">
                    {standoutItems.map((item, index) => {
                      const icon = [
                        <ArrowTrendIcon className="h-7 w-7" key="growth" />,
                        <MedalIcon className="h-7 w-7" key="medal" />,
                        <CommunityIcon className="h-7 w-7" key="community" />,
                        <SparkIcon className="h-7 w-7" key="spark" />,
                      ][index % 4];

                      return (
                        <StandoutCard
                          description={item.description}
                          icon={icon}
                          key={`${item.title}-${index}`}
                          title={item.title}
                        />
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {investorProfile.length ? (
                <section>
                  <PropertySectionHeading title="Ideal Investor Profile" />
                  <div className="mt-8 flex flex-wrap gap-4">
                    {investorProfile.map((item) => (
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

              {locationBenefits.length || mapEmbedUrl || mapOpenUrl ? (
                <section>
                  <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.9fr)] xl:items-start">
                    <div>
                      <PropertySectionHeading title="Prime Location Benefits" />
                      {locationBenefits.length ? (
                        <ul className="mt-8 space-y-6">
                          {locationBenefits.map((item, index) => {
                            const icon = [
                              <PinIcon className="h-7 w-7" key="pin" />,
                              <BuildingIcon className="h-7 w-7" key="building" />,
                              <CommunityIcon className="h-7 w-7" key="community" />,
                              <HomeIcon className="h-7 w-7" key="home" />,
                            ][index % 4];

                            return (
                              <LocationBenefitItem
                                icon={icon}
                                key={`${item}-${index}`}
                                text={item}
                              />
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="mt-6 max-w-[560px] text-[16px] leading-[1.8] text-slate-600">
                          Use the interactive map to explore the surrounding streets, commute routes,
                          and neighborhood context for this property.
                        </p>
                      )}
                    </div>

                    <div className="rounded-[32px] border border-[#dce7f5] bg-[#eef5ff] p-4 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
                      <div className="overflow-hidden rounded-[28px] bg-white shadow-[inset_0_0_0_1px_rgba(220,231,245,0.95)]">
                        {mapEmbedUrl ? (
                          <iframe
                            className="h-[420px] w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={mapEmbedUrl}
                            title={`${property.title} map`}
                          />
                        ) : (
                          <div className="grid h-[420px] place-items-center bg-[linear-gradient(180deg,#eff6ff_0%,#f8fbff_100%)] text-center">
                            <div className="flex flex-col items-center">
                              <PinIcon className="h-16 w-16 text-[#cca24f]" />
                              <p className="mt-4 text-[24px] font-medium tracking-[-0.02em] text-[#5374a7]">
                                Interactive Map
                              </p>
                              <p className="mt-2 max-w-[260px] text-[14px] leading-[1.7] text-slate-500">
                                Add a Google Maps link in the property CMS record to display the live
                                location here.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {mapOpenUrl ? (
                        <div className="mt-4 flex justify-end">
                          <a
                            className="inline-flex items-center justify-center rounded-full bg-[#1c2d4e] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[#243b67] hover:!text-white"
                            href={mapOpenUrl}
                            rel="noreferrer"
                            style={{ color: "#ffffff" }}
                            target="_blank"
                          >
                            Open in Google Maps
                          </a>
                        </div>
                      ) : null}
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