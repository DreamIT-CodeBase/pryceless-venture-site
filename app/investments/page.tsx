import Image from "next/image";

import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import featuredPropertiesLeftImage from "@/app/assets/featuredpropertieslegftboximage.png";
import heroSectionImage from "@/app/assets/herosectionimage.jpg";
import viewOpportunityHeaderIcon from "@/app/assets/viewoppertunitysvg.svg";
import {
  ThreeUpCollectionGrid,
} from "@/components/public/collection-card-layout";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { OpportunityCard } from "@/components/public/opportunity-card";
import { InvestmentVideoPreview } from "@/components/public/investment-video-preview";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedInvestments, getSingletonPage } from "@/lib/data/public";
import { resolvePrimaryImage } from "@/lib/media";

export const revalidate = 300;

const fallbackImages = [
  heroSectionImage.src,
  aboutSectionImage.src,
  featuredPropertiesLeftImage.src,
];

const fallbackInvestmentCards = [
  {
    title: "Illustrative Opportunity",
    location: "Multifamily",
    summary:
      "Illustrative investment preview aligned with the phase-1 documentation structure for opportunity listings.",
    highlights: [
      "Structured opportunity summary for launch readiness.",
      "Highlights focus on strategy, execution, and investor fit.",
      "Request the full deal packet for detailed underwriting.",
    ],
    status: "Open",
    minimum: "$25,000.00",
    imageUrl: aboutSectionImage.src,
    href: "/investments",
    strategy: "Value-Add",
  },
  {
    title: "Illustrative Opportunity",
    location: "Residential",
    summary:
      "Illustrative investment preview aligned with the phase-1 documentation structure for opportunity listings.",
    highlights: [
      "Structured opportunity summary for launch readiness.",
      "Highlights focus on strategy, execution, and investor fit.",
      "Request the full deal packet for detailed underwriting.",
    ],
    status: "Coming Soon",
    minimum: "$25,000.00",
    imageUrl: heroSectionImage.src,
    href: "/investments",
    strategy: "Buy & Hold",
  },
  {
    title: "Illustrative Opportunity",
    location: "Mixed-Use",
    summary:
      "Illustrative investment preview aligned with the phase-1 documentation structure for opportunity listings.",
    highlights: [
      "Structured opportunity summary for launch readiness.",
      "Highlights focus on strategy, execution, and investor fit.",
      "Request the full deal packet for detailed underwriting.",
    ],
    status: "Open",
    minimum: "$50,000.00",
    imageUrl: featuredPropertiesLeftImage.src,
    href: "/investments",
    strategy: "Development",
  },
];

const truncate = (value: string, limit: number) =>
  value.length > limit ? `${value.slice(0, limit).trim()}...` : value;

const formatDisplayValue = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const featuredInvestmentVideoSrc = "/videos/Video_Generation_with_Brand_Mention.mp4";

export default async function InvestmentsPage() {
  const [page, investments] = await Promise.all([
    getSingletonPage("INVESTMENTS_INDEX"),
    getPublishedInvestments(),
  ]);

  const featuredInvestment = investments[0] ?? null;
  const featuredImage =
    featuredInvestment
      ? resolvePrimaryImage(featuredInvestment) || fallbackImages[0]
      : fallbackImages[0];

  const investmentCards = investments.length
      ? investments.map((investment, index) => ({
        title: truncate(investment.title, 28),
        location: formatDisplayValue(investment.assetType) || fallbackInvestmentCards[index % fallbackInvestmentCards.length].location,
        summary: truncate(investment.summary, 92),
        highlights: investment.highlights.length
          ? investment.highlights.slice(0, 2).map((item) => truncate(item.highlight, 48))
          : fallbackInvestmentCards[index % fallbackInvestmentCards.length].highlights,
        status: formatDisplayValue(investment.status) || fallbackInvestmentCards[index % fallbackInvestmentCards.length].status,
        minimum: investment.minimumInvestmentDisplay || "$25,000.00",
        imageUrl: resolvePrimaryImage(investment) || fallbackImages[index % fallbackImages.length],
        href: `/investments/${investment.slug}`,
        strategy:
          formatDisplayValue(investment.strategy) || fallbackInvestmentCards[index % fallbackInvestmentCards.length].strategy,
      }))
    : fallbackInvestmentCards;

  const investmentHeroIntro =
    page?.intro ??
    "Explore curated real estate investment opportunities designed for passive and active investors seeking data-driven decision making and disciplined execution.";
  const cardCtaLabel = page?.ctaLabel ?? "Request Deal Packet";
  const opportunitySnapshotValue = String(investments.length || 3);
  const opportunitySnapshotLabel =
    investments.length === 1 ? "Published opportunity" : "Published opportunities";

  return (
    <SiteShell cta={{ href: "/investments", label: "View Opportunities" }}>
      <div className="pb-[78px]">
        <PageSectionHero
          currentLabel={page?.pageTitle ?? "Investment Opportunities"}
          intro={investmentHeroIntro}
          title={page?.pageTitle ?? "Investment Opportunities"}
        />

        <section className="bg-white px-4 pb-[34px] pt-[48px] sm:px-6 lg:px-[126px] lg:pb-[42px] lg:pt-[56px] 2xl:px-0 2xl:pb-[54px] 2xl:pt-[72px]">
          <div className="mx-auto w-full 2xl:max-w-[1760px] 2xl:px-[164px]">
            <div className="mx-auto flex w-full flex-col items-center text-center 2xl:mx-0 2xl:max-w-[760px] 2xl:items-start 2xl:text-left">
              <p className="text-center text-[15px] font-normal leading-[22px] tracking-[0] text-[var(--pv-sand)] lg:text-[16px] lg:leading-[24px] 2xl:text-left">
                Opportunity Overview
              </p>
              <h2 className="mt-[8px] max-w-[551px] text-center text-[32px] font-bold leading-[1.08] tracking-[-0.045em] text-[#0f172a] sm:text-[42px] lg:w-[551px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0] 2xl:w-auto 2xl:max-w-[720px] 2xl:text-left 2xl:text-[42px] 2xl:leading-[1.08] 2xl:tracking-[-0.04em]">
                {page?.pageTitle ?? "Investment Opportunities"}
              </h2>
            </div>

            <div className="mx-auto mt-[22px] grid w-full max-w-[1080px] gap-[14px] lg:mt-[24px] lg:grid-cols-[minmax(0,1fr)_303px] lg:items-stretch lg:gap-[22px] 2xl:mt-[30px] 2xl:max-w-[1432px] 2xl:grid-cols-[minmax(0,1fr)_400px] 2xl:gap-[32px]">
              <InvestmentVideoPreview
                posterSrc={featuredImage}
                title={featuredInvestment?.title ?? "Featured investment opportunity"}
                videoSrc={featuredInvestmentVideoSrc}
              />

              <article className="flex h-full flex-col rounded-[10px] bg-[#f5f5f5] px-6 pb-6 pt-6 lg:h-[330px] lg:w-[303px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px] 2xl:h-[360px] 2xl:w-[400px] 2xl:px-[34px] 2xl:pb-[34px] 2xl:pt-[34px]">
                <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#1f1f1f]">
                  <Image
                    alt=""
                    className="h-[17px] w-[17px] object-contain brightness-0 invert"
                    src={viewOpportunityHeaderIcon}
                  />
                </div>
                <h3 className="mt-[18px] text-[20px] font-normal leading-[1.3] tracking-[0] text-[#0f172a] lg:text-[20.5px] lg:leading-[42px] 2xl:mt-[22px] 2xl:text-[31px] 2xl:leading-[1.16]">
                  Opportunity Snapshot
                </h3>
                <p className="mt-2 max-w-[262px] text-[12px] font-normal leading-[19px] tracking-[0] text-[rgba(0,0,0,0.8)] lg:mt-[-1px] lg:text-[11.5px] 2xl:mt-[10px] 2xl:max-w-[300px] 2xl:text-[13.5px] 2xl:leading-[1.7]">
                  Here&apos;s a quick look at how we&apos;re creating consistent growth and value in real estate investment.
                </p>

                <div className="mt-auto flex items-end gap-4 pt-[24px]">
                  <p className="text-[48px] font-semibold leading-none tracking-[-0.04em] text-[#2d2d2d] sm:text-[57px] 2xl:text-[72px]">
                    {opportunitySnapshotValue}
                  </p>
                  <p className="max-w-[132px] pb-[4px] text-[12px] font-normal leading-[19px] tracking-[0] text-[rgba(0,0,0,0.8)] sm:max-w-[112px] sm:pb-[6px] sm:text-[11.5px] 2xl:max-w-[144px] 2xl:pb-[8px] 2xl:text-[13px] 2xl:leading-[1.55]">
                    {opportunitySnapshotLabel}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 sm:px-6 lg:px-0">
          <div className="mx-auto w-full 2xl:max-w-[1760px] 2xl:px-[164px]">
            <div className="mx-auto w-full max-w-[1080px] 2xl:mx-0 2xl:max-w-[760px]">
              <div className="text-left">
                <p className="whitespace-nowrap text-[15px] font-medium uppercase leading-[20px] tracking-[0.03em] text-[#bf9375] lg:text-[15.5px] lg:leading-[22px]">
                  Investment Deals
                </p>
                <h2 className="mt-[8px] max-w-[489px] text-[32px] font-bold leading-[1.08] tracking-[-0.05em] text-[#0f172a] sm:text-[44px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0] 2xl:max-w-[720px] 2xl:text-[42px] 2xl:leading-[1.08] 2xl:tracking-[-0.04em]">
                  {page?.pageTitle ?? "Investment Opportunities"}
                </h2>
              </div>
            </div>

            <div className="mt-[20px]">
              {investmentCards.length ? (
                <ThreeUpCollectionGrid
                  desktopCardWidth={330}
                  desktopGap={40}
                  wideDesktopCardWidth={456}
                  wideDesktopGap={32}
                >
                  {investmentCards.map((investment, index) => (
                    <OpportunityCard
                      bulletItems={investment.highlights}
                      ctaLabel={cardCtaLabel}
                      footer={{ label: "Strategy", value: investment.strategy }}
                      href={investment.href}
                      image={investment.imageUrl}
                      imageAlt={investment.title}
                      key={`${investment.title}-${index}`}
                      metaIcon="location"
                      metaText={investment.location}
                      statItems={[
                        { label: "Status", value: investment.status },
                        { label: "Min Investment", value: investment.minimum },
                      ]}
                      summary={investment.summary}
                      title={investment.title}
                    />
                  ))}
                </ThreeUpCollectionGrid>
              ) : (
                <EmptyCollectionCard message="Published investments will appear here after the admin team publishes them." />
              )}
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
