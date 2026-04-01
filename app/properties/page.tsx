import Image from "next/image";

import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import featuredPropertiesLeftImage from "@/app/assets/featuredpropertieslegftboximage.png";
import featuredPropertiesRightLowerImage from "@/app/assets/featuredpropoertiesrightboxlowerimage.jpg";
import featuredPropertiesRightUpperImage from "@/app/assets/featuredpropertiesstaicrightupperboximages.jpg";
import heroSectionImage from "@/app/assets/herosectionimage.jpg";
import {
  StandardCollectionCardLink,
  ThreeUpCollectionGrid,
  standardCollectionButtonClassName,
} from "@/components/public/collection-card-layout";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedProperties } from "@/lib/data/public";
import { resolvePrimaryImage } from "@/lib/media";

export const revalidate = 300;

const fallbackImages = [
  featuredPropertiesLeftImage.src,
  featuredPropertiesRightUpperImage.src,
  featuredPropertiesRightLowerImage.src,
  aboutSectionImage.src,
  heroSectionImage.src,
];

const fallbackProperties = [
  {
    address: "8706 Herrick Ave, Los Angeles",
    annualReturn: "2.5% + 4%",
    id: "fallback-los-angeles-1",
    imageUrl: featuredPropertiesLeftImage.src,
    progressPercent: 64,
    propertyType: "Commercial",
    raisedSummary: "17 Investors | $ 7,94,196 (14.73%)",
    timeLeft: "115d :17h :8m",
    title: "Los Angeles",
    href: "/properties",
  },
  {
    address: "8706 Herrick Ave, Los Angeles",
    annualReturn: "2.5% + 4%",
    id: "fallback-los-angeles-2",
    imageUrl: featuredPropertiesRightUpperImage.src,
    progressPercent: 64,
    propertyType: "Commercial",
    raisedSummary: "17 Investors | $ 7,94,196 (14.73%)",
    timeLeft: "115d :17h :8m",
    title: "Los Angeles",
    href: "/properties",
  },
  {
    address: "8706 Herrick Ave, Los Angeles",
    annualReturn: "2.5% + 4%",
    id: "fallback-los-angeles-3",
    imageUrl: featuredPropertiesRightLowerImage.src,
    progressPercent: 64,
    propertyType: "Commercial",
    raisedSummary: "17 Investors | $ 7,94,196 (14.73%)",
    timeLeft: "115d :17h :8m",
    title: "Los Angeles",
    href: "/properties",
  },
];

const formatDisplayValue = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const truncate = (value: string, limit: number) =>
  value.length > limit ? `${value.slice(0, limit).trim()}...` : value;

const getPropertyProgressPercent = (status: string | null | undefined) => {
  const normalizedStatus = String(status ?? "").trim().toUpperCase();

  if (normalizedStatus.includes("AVAILABLE")) {
    return 64;
  }

  if (normalizedStatus.includes("COMING")) {
    return 42;
  }

  if (normalizedStatus.includes("UNDER") || normalizedStatus.includes("PENDING")) {
    return 82;
  }

  if (normalizedStatus.includes("SOLD") || normalizedStatus.includes("CLOSED")) {
    return 100;
  }

  return 56;
};

function LocationPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 14 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 16.5c2.4-3.2 3.6-5.6 3.6-7.2A3.6 3.6 0 1 0 3.4 9.3c0 1.6 1.2 4 3.6 7.2Z"
        fill="currentColor"
      />
      <circle cx="7" cy="7.1" fill="#fff" r="1.55" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" fill="currentColor" r="5.8" />
      <path
        d="M7 4.15v3.1l2.03 1.17"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export default async function PropertiesPage() {
  const properties = await getPublishedProperties();

  const heroIntro =
    "The right opportunity doesn't wait. With Pryceless Ventures, you gain access to curated listings, expert insights, and the tools you need to invest confidently.";

  const propertyCards = properties.length
    ? properties.map((property, index) => {
        const fallbackCard = fallbackProperties[index % fallbackProperties.length];
        const propertyImage = resolvePrimaryImage(property) || fallbackImages[index % fallbackImages.length];

        return {
          address: truncate(property.title || fallbackCard.address, 34),
          annualReturn: fallbackCard.annualReturn,
          href: `/properties/${property.slug}`,
          id: property.id,
          imageUrl: propertyImage,
          progressPercent: getPropertyProgressPercent(property.status),
          propertyType: formatDisplayValue(property.propertyType) || fallbackCard.propertyType,
          raisedSummary: fallbackCard.raisedSummary,
          timeLeft: fallbackCard.timeLeft,
          title: truncate(property.locationCity?.trim() || fallbackCard.title, 22),
        };
      })
    : fallbackProperties;

  return (
    <SiteShell cta={{ href: "/cash-offer", label: "Sell a Property" }}>
      <div className="pb-[92px]">
        <PageSectionHero
          currentLabel="Properties"
          intro={heroIntro}
          title={
            <>
              Find More Than a Property,
              <br />
              Find a Property For You
            </>
          }
        />

        <section className="bg-white px-4 pt-[48px] sm:px-6 lg:px-0 lg:pt-[64px]">
          <div className="mx-auto flex max-w-[662px] flex-col items-center text-center">
            <p className="text-center whitespace-nowrap text-[15px] font-medium uppercase leading-[20px] tracking-[0.03em] text-[#bf9375] lg:text-[15.5px] lg:leading-[22px]">
              Investment Deals
            </p>
            <h2 className="mt-[8px] w-full text-[32px] font-bold leading-[1.08] tracking-[-0.05em] text-[#0f172a] sm:text-[44px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[-0.02em]">
              Explore property with Pryceless Ventures
            </h2>
          </div>

          <div className="mx-auto mt-[42px] w-full">
            {propertyCards.length ? (
              <ThreeUpCollectionGrid desktopCardWidth={320} desktopGap={38}>
                {propertyCards.map((property) => (
                  <StandardCollectionCardLink href={property.href} key={property.id}>
                    <div className="px-[13px] pt-[13px]">
                      <div className="relative h-[196px] overflow-hidden rounded-[14px]">
                        <Image
                          alt={`${property.title} featured property`}
                          className="object-cover"
                          fill
                          sizes="320px"
                          src={property.imageUrl}
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-[13px] pb-[16px] pt-[14px]">
                      <h3 className="min-h-[42px] text-left text-[19px] font-bold leading-[1.12] tracking-[-0.02em] text-[rgba(15,23,42,1)]">
                        {property.title}
                      </h3>

                      <p className="mt-[6px] flex items-center gap-[5px] text-left text-[11.5px] font-normal leading-[16px] tracking-[0] text-[rgba(97,97,97,1)]">
                        <LocationPinIcon className="h-[13px] w-[11px] shrink-0 text-[rgba(43,47,56,1)]" />
                        <span className="truncate">{property.address}</span>
                      </p>

                      <div className="mt-[11px] h-[8px] overflow-hidden rounded-full bg-[rgba(231,236,242,1)]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#29d869_0%,#39cf7b_100%)]"
                          style={{ width: `${property.progressPercent}%` }}
                        />
                      </div>

                      <p className="mt-[8px] text-left text-[11.5px] font-normal leading-[16px] tracking-[0] text-[rgba(97,97,97,1)]">
                        {property.raisedSummary}
                      </p>

                      <div className="mt-[15px] grid grid-cols-2 border-y border-[rgba(215,215,215,1)]">
                        <div className="px-[13px] py-[9px]">
                          <p className="text-left text-[11px] font-normal leading-[16px] tracking-[0] text-[rgba(97,97,97,1)]">
                            Annual Return
                          </p>
                          <p className="mt-[2px] text-left text-[11.5px] font-semibold leading-[16px] tracking-[0] text-[rgba(53,53,53,1)]">
                            {property.annualReturn}
                          </p>
                        </div>
                        <div className="border-l border-[rgba(215,215,215,1)] px-[13px] py-[9px]">
                          <p className="text-left text-[11px] font-normal leading-[16px] tracking-[0] text-[rgba(97,97,97,1)]">
                            Property Type
                          </p>
                          <p className="mt-[2px] text-left text-[11.5px] font-semibold leading-[16px] tracking-[0] text-[rgba(53,53,53,1)]">
                            {property.propertyType}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-[12px] pt-[20px]">
                        <div className="min-w-0">
                          <p className="text-left text-[10px] font-normal leading-[14px] tracking-[0] text-[rgba(97,97,97,1)]">
                            Left to invest
                          </p>
                          <div className="mt-[3px] flex items-center gap-[4px]">
                            <ClockIcon className="h-[11px] w-[11px] shrink-0 text-[rgba(43,47,56,1)]" />
                            <p className="truncate text-left text-[13px] font-bold leading-[16px] tracking-[0] text-[rgba(15,23,42,1)]">
                              {property.timeLeft}
                            </p>
                          </div>
                        </div>

                        <span className={standardCollectionButtonClassName}>Invest Now</span>
                      </div>
                    </div>
                  </StandardCollectionCardLink>
                ))}
              </ThreeUpCollectionGrid>
            ) : (
              <EmptyCollectionCard message="Published properties will appear here after the admin team publishes them." />
            )}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
