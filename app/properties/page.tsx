import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import featuredPropertiesLeftImage from "@/app/assets/featuredpropertieslegftboximage.png";
import featuredPropertiesRightLowerImage from "@/app/assets/featuredpropoertiesrightboxlowerimage.jpg";
import featuredPropertiesRightUpperImage from "@/app/assets/featuredpropertiesstaicrightupperboximages.jpg";
import heroSectionImage from "@/app/assets/herosectionimage.jpg";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { PropertyStageFilter } from "@/components/public/property-stage-filter";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedProperties, getSingletonPage } from "@/lib/data/public";
import { resolvePrimaryImage } from "@/lib/media";
import {
  formatPropertyStatusLabel,
  getPropertyPortfolioStage,
  getPropertyStageContent,
  parsePropertyHighlights,
  propertyPortfolioStageOrder,
  type PropertyPortfolioStage,
} from "@/lib/property-portfolio";

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

const legacyPropertiesPageTitles = new Set(["Available Properties", "Property Portfolio"]);
const legacyPropertiesPageIntros = new Set([
  "Explore a selection of properties sourced through our acquisition channels and partner network.",
  "Explore Pryceless Ventures' portfolio across properties for sale, completed executions, and renovation projects currently in progress.",
]);

const fallbackPortfolioCards: Record<PropertyPortfolioStage, PortfolioCard[]> = {
  FOR_SALE: [
    {
      address: "Illustrative active listing",
      bulletItems: [
        "Showcase the property, positioning, and buyer-fit story here.",
        "Use the inquiry flow to collect interest on active inventory.",
      ],
      ctaLabel: "Request Details",
      href: "/properties",
      id: "fallback-property-for-sale",
      imageAlt: "Illustrative for-sale property",
      imageUrl: featuredPropertiesLeftImage.src,
      propertyType: "Residential",
      statItems: [
        { label: "Status", value: "For Sale" },
        { label: "Property Type", value: "Residential" },
      ],
      strategy: "Fix & Flip",
      summary:
        "Active portfolio listing preview aligned with the current Pryceless property card design.",
      title: "Illustrative For Sale Property",
    },
  ],
  SOLD: [
    {
      address: "Illustrative completed execution",
      bulletItems: [
        "Use sold deals to show underwriting discipline and execution skill.",
        "Purchase, rehab, and sale outcomes can be surfaced on the card.",
      ],
      ctaLabel: "View Underwriting",
      href: "/properties",
      id: "fallback-property-sold",
      imageAlt: "Illustrative sold property",
      imageUrl: featuredPropertiesRightUpperImage.src,
      propertyType: "Residential",
      statItems: [
        { label: "Purchase Price", value: "$248,000" },
        { label: "Selling Price", value: "$389,000" },
      ],
      strategy: "Value-Add",
      summary:
        "Completed Pryceless project preview showing how sold assets can act like mini case studies.",
      title: "Illustrative Sold Property",
    },
  ],
  IN_PROGRESS: [
    {
      address: "Illustrative renovation project",
      bulletItems: [
        "Keep this profile updated with rehab milestones and current notes.",
        "Add new site photos so the renovation story evolves over time.",
      ],
      ctaLabel: "View Progress",
      href: "/properties",
      id: "fallback-property-in-progress",
      imageAlt: "Illustrative renovation project",
      imageUrl: featuredPropertiesRightLowerImage.src,
      propertyType: "Residential",
      statItems: [
        { label: "Current Phase", value: "Interior Framing" },
        { label: "Target Finish", value: "Q3 2026" },
      ],
      strategy: "Fix & Flip",
      summary:
        "Active rehab preview showing how in-progress properties can share renovation updates and fresh images.",
      title: "Illustrative In Progress Property",
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

export default async function PropertiesPage() {
  const [page, properties] = await Promise.all([
    getSingletonPage("PROPERTIES_INDEX"),
    getPublishedProperties(),
  ]);

  const heroTitle =
    page?.pageTitle && !legacyPropertiesPageTitles.has(page.pageTitle)
      ? page.pageTitle
      : "Properties";
  const heroIntro =
    page?.intro && !legacyPropertiesPageIntros.has(page.intro)
      ? page.intro
      : "Browse for-sale listings, sold deals, and active rehab updates.";

  const groupedCards = {
    FOR_SALE: [] as PortfolioCard[],
    SOLD: [] as PortfolioCard[],
    IN_PROGRESS: [] as PortfolioCard[],
  };

  properties.forEach((property, index) => {
    const stage = getPropertyPortfolioStage(property.status);
    const fallbackCard =
      fallbackPortfolioCards[stage][index % fallbackPortfolioCards[stage].length];
    const propertyImage =
      resolvePrimaryImage(property) || fallbackImages[index % fallbackImages.length];
    const location = [property.locationCity, property.locationState].filter(Boolean).join(", ");
    const propertyType = formatDisplayValue(property.propertyType) || fallbackCard.propertyType;
    const strategy = formatDisplayValue(property.strategy) || fallbackCard.strategy;
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

    groupedCards[stage].push({
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

  const portfolioSections = propertyPortfolioStageOrder
    .map((stage) => {
      const stageContent = getPropertyStageContent(stage);

      return {
        emptyMessage: stageContent.emptyMessage,
        cards: properties.length ? groupedCards[stage] : fallbackPortfolioCards[stage],
        count: groupedCards[stage].length,
        helper:
          stage === "FOR_SALE"
            ? "See active listings"
            : stage === "SOLD"
              ? "See sold properties"
              : "See current rehab projects",
        stage,
        title: stageContent.indexTitle,
      };
    });

  return (
    <SiteShell cta={{ href: "/cash-offer", label: "Sell a Property" }}>
      <div className="pb-[92px]">
        <PageSectionHero currentLabel={heroTitle} intro={heroIntro} title={heroTitle} />

        <section className="bg-white px-4 pt-[48px] sm:px-6 lg:px-0 lg:pt-[64px] 2xl:pt-[76px]">
          <div className="mx-auto w-full 2xl:max-w-[1760px] 2xl:px-[164px]">
            <div className="mx-auto mt-[12px] w-full 2xl:mt-[18px]">
              <PropertyStageFilter sections={portfolioSections} />
            </div>

            {page?.disclaimer ? (
              <div className="mx-auto mt-[30px] w-full max-w-[1080px] 2xl:max-w-[1432px]">
                <p className="text-[14px] font-semibold leading-none tracking-[-0.01em] text-[#555555]">
                  Disclaimer:
                </p>
                <p className="mt-[7px] text-[14px] leading-[1.5] tracking-[-0.01em] text-[#6d6d6d] 2xl:max-w-[1120px]">
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
