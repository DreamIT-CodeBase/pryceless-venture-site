import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import featuredPropertiesLeftImage from "@/app/assets/featuredpropertieslegftboximage.png";
import featuredPropertiesRightLowerImage from "@/app/assets/featuredpropoertiesrightboxlowerimage.jpg";
import featuredPropertiesRightUpperImage from "@/app/assets/featuredpropertiesstaicrightupperboximages.jpg";
import heroSectionImage from "@/app/assets/herosectionimage.jpg";
import { Suspense } from "react";
import { PageSectionHero } from "@/components/public/page-section-hero";
import {
  PropertyTemplateFilter,
  PropertyTemplateHeroSelect,
} from "@/components/public/property-stage-filter";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedProperties, getSingletonPage } from "@/lib/data/public";
import { resolvePrimaryImage } from "@/lib/media";
import {
  formatPropertyStatusLabel,
  getPropertyPortfolioStage,
  getPropertyStageContent,
  parsePropertyHighlights,
  type PropertyPortfolioStage,
} from "@/lib/property-portfolio";
import {
  coercePropertyDealType,
  getPropertyDealTypeLabel,
  propertyDealTypeValues,
  propertyTemplateConfigMap,
  type PropertyDealType,
} from "@/lib/property-templates";

export const revalidate = 300;

type PortfolioCard = {
  address: string;
  bulletItems: string[];
  ctaLabel: string;
  href: string;
  id: string;
  imageAlt: string;
  imageUrl: string;
  propertyType: string;
  statItems: Array<{ label: string; value: string }>;
  strategy: string;
  summary: string;
  title: string;
};

const fallbackImages = [
  featuredPropertiesLeftImage.src,
  featuredPropertiesRightUpperImage.src,
  featuredPropertiesRightLowerImage.src,
  aboutSectionImage.src,
  heroSectionImage.src,
];

const legacyPropertiesPageTitles = new Set([
  "Available Properties",
  "Property Portfolio",
  "Properties",
]);
const legacyPropertiesPageIntros = new Set([
  "Explore a selection of properties sourced through our acquisition channels and partner network.",
  "Explore Pryceless Ventures' portfolio across properties for sale, completed executions, and renovation projects currently in progress.",
]);

const fallbackPortfolioCards: Record<PropertyDealType, PortfolioCard[]> = {
  FIX_FLIP: [
    {
      address: "Illustrative active listing",
      bulletItems: [
        "Use this template for acquisition basis, rehab plan, and exit upside.",
        "The public slug keeps the same structure while surfacing fix and flip metrics.",
      ],
      ctaLabel: "Request Details",
      href: "/properties",
      id: "fallback-property-fix-flip",
      imageAlt: "Illustrative fix and flip property",
      imageUrl: featuredPropertiesLeftImage.src,
      propertyType: "Residential",
      statItems: [
        { label: "Purchase Price", value: "$470,000" },
        { label: "ARV", value: "$585,000" },
      ],
      strategy: "Fix & Flip",
      summary:
        "Portfolio preview aligned to the fix and flip template with acquisition, rehab, and exit storytelling.",
      title: "Illustrative Fix & Flip Property",
    },
  ],
  BUY_HOLD: [
    {
      address: "Illustrative long-term hold",
      bulletItems: [
        "This template is built for NOI, cash invested, and partner return storytelling.",
        "Long descriptions can still be transformed into overview boxes and standout bullets.",
      ],
      ctaLabel: "View Underwriting",
      href: "/properties",
      id: "fallback-property-buy-hold",
      imageAlt: "Illustrative buy and hold property",
      imageUrl: featuredPropertiesRightUpperImage.src,
      propertyType: "Multifamily",
      statItems: [
        { label: "Cash Invested", value: "$150,000" },
        { label: "NOI", value: "$14,670 / month" },
      ],
      strategy: "Buy & Hold",
      summary:
        "Portfolio preview aligned to a buy and hold deal with the same polished card structure.",
      title: "Illustrative Buy & Hold Property",
    },
  ],
  WHOLESALE: [
    {
      address: "Illustrative assignment deal",
      bulletItems: [
        "Wholesale deals can focus on purchase basis, sale price, timeline, and gross profit.",
        "The card and slug page still keep the same visual shell as the rest of the portfolio.",
      ],
      ctaLabel: "View Deal",
      href: "/properties",
      id: "fallback-property-wholesale",
      imageAlt: "Illustrative wholesale property",
      imageUrl: featuredPropertiesRightLowerImage.src,
      propertyType: "Residential",
      statItems: [
        { label: "Purchase Price", value: "$1,100,000" },
        { label: "Sale Price", value: "$1,150,000" },
      ],
      strategy: "Wholesale",
      summary:
        "Portfolio preview aligned to the wholesale template with clean acquisition and resale stat boxes.",
      title: "Illustrative Wholesale Property",
    },
  ],
};

const formatDisplayValue = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const truncate = (value: string, limit: number) =>
  value.length > limit ? `${value.slice(0, limit).trim()}...` : value;

const getCardStatItems = ({
  metrics,
  propertyType,
  stage,
  statusLabel,
}: {
  metrics: Array<{ label: string; value: string }>;
  propertyType: string;
  stage: PropertyPortfolioStage;
  statusLabel: string;
}) => {
  const metricItems = metrics.slice(0, 2).map((item) => ({
    label: truncate(item.label, 22),
    value: truncate(item.value, 24),
  }));

  const fallbackItems =
    stage === "FOR_SALE"
      ? [
          { label: "Status", value: statusLabel || "For Sale" },
          { label: "Property Type", value: propertyType },
        ]
      : [
          { label: "Stage", value: formatDisplayValue(stage) },
          { label: "Property Type", value: propertyType },
        ];

  return [...metricItems, ...fallbackItems].slice(0, 2);
};

function PropertyStageHeroSelectFallback() {
  return (
    <div className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)] px-4 py-3.5 text-white shadow-[0_20px_46px_rgba(3,12,25,0.24)] backdrop-blur-xl sm:px-5 sm:py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d7b18f]">
        Deal Type Filter
      </p>
      <div className="mt-3">
        <div className="flex h-[54px] items-center rounded-[18px] border border-white/12 bg-[#0f2740]/88 px-4 text-[15px] font-medium tracking-[-0.015em] text-white/74">
          Loading deal types...
        </div>
      </div>
    </div>
  );
}

function PropertyStageFilterFallback() {
  return (
    <div
      className="rounded-[28px] border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-[var(--pv-text)] sm:px-8 sm:py-16"
      id="property-stage-filter"
    >
      Loading deal types...
    </div>
  );
}

export default async function PropertiesPage() {
  const [page, properties] = await Promise.all([
    getSingletonPage("PROPERTIES_INDEX"),
    getPublishedProperties(),
  ]);

  const heroTitle =
    page?.pageTitle && !legacyPropertiesPageTitles.has(page.pageTitle)
      ? page.pageTitle
      : "Portfolio";
  const heroIntro =
    page?.intro && !legacyPropertiesPageIntros.has(page.intro)
      ? page.intro
      : "Browse fix and flip, buy and hold, and wholesale opportunities across the portfolio.";

  const groupedCards: Record<PropertyDealType, PortfolioCard[]> = {
    FIX_FLIP: [] as PortfolioCard[],
    BUY_HOLD: [] as PortfolioCard[],
    WHOLESALE: [] as PortfolioCard[],
  };

  properties.forEach((property, index) => {
    const stage = getPropertyPortfolioStage(property.status);
    const template = coercePropertyDealType(property.strategy);
    const fallbackCard =
      fallbackPortfolioCards[template][index % fallbackPortfolioCards[template].length];
    const propertyImage =
      resolvePrimaryImage(property) || fallbackImages[index % fallbackImages.length];
    const location = [property.locationCity, property.locationState].filter(Boolean).join(", ");
    const propertyType = formatDisplayValue(property.propertyType) || fallbackCard.propertyType;
    const strategy = getPropertyDealTypeLabel(property.strategy) || fallbackCard.strategy;
    const statusLabel = formatPropertyStatusLabel(property.status);
    const parsedHighlights = parsePropertyHighlights(
      property.highlights.map((item) => item.highlight),
    );
    const stageContent = getPropertyStageContent(stage);
    const bulletItems = (
      parsedHighlights.bullets.length
        ? parsedHighlights.bullets
        : fallbackCard.bulletItems
    ).map((item) => truncate(item, 48));

    groupedCards[template].push({
      address: truncate(location || property.title || fallbackCard.address, 34),
      bulletItems,
      ctaLabel:
        stage === "FOR_SALE"
          ? page?.ctaLabel ?? stageContent.cardCtaLabel
          : stageContent.cardCtaLabel,
      href: `/properties/${property.slug}`,
      id: property.id,
      imageAlt: `${property.title} portfolio property`,
      imageUrl: propertyImage,
      propertyType,
      statItems: getCardStatItems({
        metrics: parsedHighlights.metrics,
        propertyType,
        stage,
        statusLabel,
      }),
      strategy,
      summary: truncate(property.summary || fallbackCard.summary, 92),
      title: truncate(property.title || fallbackCard.title, 42),
    });
  });

  const portfolioSections = propertyDealTypeValues.map((template) => ({
    cards: properties.length ? groupedCards[template] : fallbackPortfolioCards[template],
    count: groupedCards[template].length,
    emptyMessage: `No ${propertyTemplateConfigMap[template].label.toLowerCase()} properties are available yet.`,
    helper: propertyTemplateConfigMap[template].helperText,
    template,
    title: propertyTemplateConfigMap[template].label,
  }));

  return (
    <SiteShell cta={{ href: "/cash-offer", label: "Sell a Property" }}>
      <div className="pb-[92px]">
        <PageSectionHero
          currentLabel={heroTitle}
          heroContent={
            <Suspense fallback={<PropertyStageHeroSelectFallback />}>
              <PropertyTemplateHeroSelect sections={portfolioSections} />
            </Suspense>
          }
          heroContentPosition="side"
          intro={heroIntro}
          title={heroTitle}
        />

        <section className="bg-white px-4 pt-[36px] sm:px-6 lg:px-0 lg:pt-[44px] min-[1400px]:pt-[56px]">
          <div className="mx-auto w-full min-[1400px]:max-w-[1760px] min-[1400px]:px-[164px]">
            <div className="mx-auto w-full">
              <Suspense fallback={<PropertyStageFilterFallback />}>
                <PropertyTemplateFilter sections={portfolioSections} />
              </Suspense>
            </div>

            {page?.disclaimer ? (
              <div className="mx-auto mt-[30px] w-full max-w-[1080px] min-[1400px]:max-w-[1432px]">
                <p className="text-[14px] font-semibold leading-none tracking-[-0.01em] text-[#555555]">
                  Disclaimer:
                </p>
                <p className="mt-[7px] text-[14px] leading-[1.5] tracking-[-0.01em] text-[#6d6d6d] min-[1400px]:max-w-[1120px]">
                  {page.disclaimer}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
