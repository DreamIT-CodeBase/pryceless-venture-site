import Image from "next/image";

import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import featuredPropertiesLeftImage from "@/app/assets/featuredpropertieslegftboximage.png";
import heroSectionImage from "@/app/assets/herosectionimage.jpg";
import viewOpportunityHeaderIcon from "@/app/assets/viewoppertunitysvg.svg";
import {
  StandardCollectionCardLink,
  ThreeUpCollectionGrid,
  standardCollectionButtonClassName,
} from "@/components/public/collection-card-layout";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { InvestmentVideoPreview } from "@/components/public/investment-video-preview";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedInvestments } from "@/lib/data/public";
import { resolvePrimaryImage } from "@/lib/media";

export const revalidate = 300;

const fallbackImages = [
  heroSectionImage.src,
  aboutSectionImage.src,
  featuredPropertiesLeftImage.src,
];

const fallbackInvestmentCards = [
  {
    title: "Los Angeles",
    location: "8706 Herrick Ave, Los Angeles",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    highlights: [
      "85% yearly occupancy with $3,800 average monthly rent.",
      "Values grow 12% yearly with 18% ROI forecasted.",
      "Delivered $500M in projects with zero defaults.",
    ],
    totalRequired: "$4,500,000.00",
    minimum: "$25,000.00",
    imageUrl: aboutSectionImage.src,
    href: "/investments",
  },
  {
    title: "Los Angeles",
    location: "8706 Herrick Ave, Los Angeles",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    highlights: [
      "85% yearly occupancy with $3,800 average monthly rent.",
      "Values grow 12% yearly with 18% ROI forecasted.",
      "Delivered $500M in projects with zero defaults.",
    ],
    totalRequired: "$4,500,000.00",
    minimum: "$25,000.00",
    imageUrl: heroSectionImage.src,
    href: "/investments",
  },
  {
    title: "Los Angeles",
    location: "8706 Herrick Ave, Los Angeles",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    highlights: [
      "85% yearly occupancy with $3,800 average monthly rent.",
      "Values grow 12% yearly with 18% ROI forecasted.",
      "Delivered $500M in projects with zero defaults.",
    ],
    totalRequired: "$4,500,000.00",
    minimum: "$50,000.00",
    imageUrl: featuredPropertiesLeftImage.src,
    href: "/investments",
  },
];

const truncate = (value: string, limit: number) =>
  value.length > limit ? `${value.slice(0, limit).trim()}...` : value;

const featuredInvestmentVideoSrc = "/videos/Video_Generation_with_Brand_Mention.mp4";

export default async function InvestmentsPage() {
  const investments = await getPublishedInvestments();

  const featuredInvestment = investments[0] ?? null;
  const featuredImage =
    featuredInvestment
      ? resolvePrimaryImage(featuredInvestment) || fallbackImages[0]
      : fallbackImages[0];

  const investmentCards = investments.length
      ? investments.map((investment, index) => ({
        title: truncate(investment.title, 28),
        location: "8706 Herrick Ave, Los Angeles",
        summary: truncate(investment.summary, 92),
        highlights: investment.highlights.length
          ? investment.highlights.slice(0, 2).map((item) => truncate(item.highlight, 48))
          : fallbackInvestmentCards[index % fallbackInvestmentCards.length].highlights,
        totalRequired: "$4,500,000.00",
        minimum: investment.minimumInvestmentDisplay || "$25,000.00",
        imageUrl: resolvePrimaryImage(investment) || fallbackImages[index % fallbackImages.length],
        href: `/investments/${investment.slug}`,
      }))
    : fallbackInvestmentCards;

  const investmentHeroIntro =
    "Explore curated real estate investment opportunities designed for passive and active investors seeking data-driven decision making and disciplined execution.";

  return (
    <SiteShell cta={{ href: "/investments", label: "View Opportunities" }}>
      <div className="pb-[78px]">
        <PageSectionHero
          currentLabel="Investment Opportunities"
          intro={investmentHeroIntro}
          title={
            <>
              Explore Property Investment
              <br />
              Paths with Pryceless Ventures
            </>
          }
        />

        <section className="bg-white px-4 pb-[34px] pt-[48px] sm:px-6 lg:px-[126px] lg:pb-[42px] lg:pt-[56px]">
          <div className="mx-auto flex w-full flex-col items-center text-center">
            <p className="text-center text-[13px] font-normal leading-[21px] tracking-[0] text-[var(--pv-sand)] lg:text-[14px] lg:leading-[22px]">
              Opportunity Overview
            </p>
            <h2 className="mt-[8px] max-w-[551px] text-center text-[32px] font-bold leading-[1.08] tracking-[-0.045em] text-[#0f172a] sm:text-[42px] lg:w-[551px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0]">
              Explore High-Return Opportunities
              <br />
              In Prime Locations
            </h2>
          </div>

          <div className="mx-auto mt-[22px] grid w-full max-w-[1080px] gap-[14px] lg:mt-[24px] lg:grid-cols-[minmax(0,1fr)_303px] lg:items-stretch lg:gap-[22px]">
            <InvestmentVideoPreview
              posterSrc={featuredImage}
              title={featuredInvestment?.title ?? "Featured investment opportunity"}
              videoSrc={featuredInvestmentVideoSrc}
            />

            <article className="flex h-full flex-col rounded-[10px] bg-[#f5f5f5] px-6 pb-6 pt-6 lg:h-[330px] lg:w-[303px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]">
              <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#1f1f1f]">
                <Image
                  alt=""
                  className="h-[17px] w-[17px] object-contain brightness-0 invert"
                  src={viewOpportunityHeaderIcon}
                />
              </div>
              <h3 className="mt-[18px] text-[20px] font-normal leading-[1.3] tracking-[0] text-[#0f172a] lg:text-[20.5px] lg:leading-[42px]">
                Opportunity Snapshot
              </h3>
              <p className="mt-2 max-w-[262px] text-[12px] font-normal leading-[19px] tracking-[0] text-[rgba(0,0,0,0.8)] lg:mt-[-1px] lg:text-[11.5px]">
                Here&apos;s a quick look at how we&apos;re creating consistent growth and value in real estate investment.
              </p>

              <div className="mt-auto flex items-end gap-4 pt-[24px]">
                <p className="text-[48px] font-semibold leading-none tracking-[-0.04em] text-[#2d2d2d] sm:text-[57px]">
                  95%
                </p>
                <p className="max-w-[132px] pb-[4px] text-[12px] font-normal leading-[19px] tracking-[0] text-[rgba(0,0,0,0.8)] sm:max-w-[112px] sm:pb-[6px] sm:text-[11.5px]">
                  Investment success rate
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-white px-4 sm:px-6 lg:px-0">
          <div className="mx-auto w-full max-w-[1080px]">
            <div className="text-left">
              <p className="whitespace-nowrap text-[15px] font-medium uppercase leading-[20px] tracking-[0.03em] text-[#bf9375] lg:text-[15.5px] lg:leading-[22px]">
                Investment Deals
              </p>
              <h2 className="mt-[8px] max-w-[489px] text-[32px] font-bold leading-[1.08] tracking-[-0.05em] text-[#0f172a] sm:text-[44px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0]">
                Explore property investment
                <br />
                paths with Pryceless Ventures
              </h2>
            </div>
          </div>

          <div className="mt-[20px]">
            {investmentCards.length ? (
              <ThreeUpCollectionGrid desktopCardWidth={330} desktopGap={40}>
                {investmentCards.map((investment, index) => (
                  <StandardCollectionCardLink href={investment.href} key={`${investment.title}-${index}`}>
                    <div className="px-[13px] pt-[13px]">
                      <div className="relative h-[196px] overflow-hidden rounded-[14px]">
                        <Image
                          alt={investment.title}
                          className="object-cover"
                          fill
                          sizes="(max-width: 1023px) 100vw, 330px"
                          src={investment.imageUrl}
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-[13px] pb-[16px] pt-[14px]">
                      <h3
                        className="min-h-[42px] text-[19px] font-bold leading-[1.12] tracking-[-0.02em] text-[#131d36]"
                        style={{
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          display: "-webkit-box",
                          overflow: "hidden",
                        }}
                      >
                        {investment.title}
                      </h3>
                      <div className="mt-[7px] flex items-start gap-[6px] text-[12px] leading-[16px] text-[#6b7280]">
                        <svg aria-hidden="true" className="mt-[1px] h-[12px] w-[12px] shrink-0 fill-[#30343b]" viewBox="0 0 24 24">
                          <path d="M12 2a7 7 0 0 0-7 7c0 4.8 5.18 10.88 6.2 12.03a1 1 0 0 0 1.5 0C13.82 19.88 19 13.8 19 9a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                        </svg>
                        <p className="truncate">{investment.location}</p>
                      </div>

                      <p
                        className="mt-[9px] text-[12px] leading-[1.45] tracking-[0] text-[#6b7280]"
                        style={{
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          display: "-webkit-box",
                          overflow: "hidden",
                        }}
                      >
                        {investment.summary}
                      </p>

                      <div className="mt-[10px] space-y-[8px] text-[11.5px] leading-[1.4] text-[#646b75]">
                        {investment.highlights.slice(0, 2).map((item, highlightIndex) => (
                          <div className="flex items-start gap-[6px]" key={`${investment.title}-highlight-${highlightIndex}`}>
                            <span className="mt-[2px] text-[12px] font-semibold leading-none text-[#16213e]">
                              &#10003;
                            </span>
                            <p
                              style={{
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1,
                                display: "-webkit-box",
                                overflow: "hidden",
                              }}
                            >
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-[12px] grid border-y border-[#d7d7d7] text-left sm:grid-cols-2">
                        <div className="border-b border-[#d7d7d7] px-[13px] py-[9px] sm:border-b-0 sm:border-r">
                          <p className="text-[11px] leading-[16px] text-[#6b7280]">Total Required</p>
                          <p className="mt-[2px] text-[13px] font-semibold leading-[18px] text-[#30343b]">
                            {investment.totalRequired}
                          </p>
                        </div>
                        <div className="px-[13px] py-[9px]">
                          <p className="text-[11px] leading-[16px] text-[#6b7280]">Min per Investor</p>
                          <p className="mt-[2px] text-[13px] font-semibold leading-[18px] text-[#30343b]">
                            {investment.minimum}
                          </p>
                        </div>
                      </div>

                      <div className="pt-[16px]">
                        <span className={standardCollectionButtonClassName}>Invest Now</span>
                      </div>
                    </div>
                  </StandardCollectionCardLink>
                ))}
              </ThreeUpCollectionGrid>
            ) : (
              <EmptyCollectionCard message="Published investments will appear here after the admin team publishes them." />
            )}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
