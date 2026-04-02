import Image from "next/image";
import Link from "next/link";

import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import featuredPropertiesLeftImage from "@/app/assets/featuredpropertieslegftboximage.png";
import featuredPropertiesSectionBg from "@/app/assets/featuredpropertiessectionbgimage.png";
import featuredPropertiesRightLowerImage from "@/app/assets/featuredpropoertiesrightboxlowerimage.jpg";
import featuredPropertiesRightUpperImage from "@/app/assets/featuredpropertiesstaicrightupperboximages.jpg";
import heroSectionImage from "@/app/assets/herosectionimage.jpg";
import iconBuyer from "@/app/assets/passasiveinvestor4.svg";
import iconInvestor from "@/app/assets/passesiveinvestorlogo2.svg";
import iconSeller from "@/app/assets/passiveinvestor3.svg";
import investmentIcon from "@/app/assets/investmentlogo.svg";
import portfolioGrowthChartImage from "@/app/assets/image 15 (1).svg";
import continuityLogo from "@/app/assets/continuitylogo.svg";
import franciscoLogo from "@/app/assets/franciscoandradelogo.svg";
import gateLogo from "@/app/assets/gatelogo.svg";
import houseLogo from "@/app/assets/houselogo.svg";
import mihouseLogo from "@/app/assets/mihouselogo.svg";
import salfordLogo from "@/app/assets/salfordlogo.svg";
import passiveInvestorIcon from "@/app/assets/passiveinvestorlogo.svg";
import propertiesIcon from "@/app/assets/propertieslogo.svg";
import roiCalculatorIcon from "@/app/assets/roicalculatorlogo.svg";
import testimonialBg from "@/app/assets/whatourcliwntsaybgimage.jpg";
import { FeaturedPropertiesCarousel } from "@/components/public/featured-properties-carousel";
import { FeaturedShowcaseCarousel } from "@/components/public/featured-showcase-carousel";
import {
  ShowcaseActionCard,
  ShowcasePanelCard,
} from "@/components/public/showcase-action-card";
import { MobileLogoCarousel } from "@/components/public/mobile-logo-carousel";
import { SiteShell } from "@/components/public/site-shell";
import { TestimonialsCarousel } from "@/components/public/testimonials-carousel";
import { getHomePage, getPublishedProperties, getSingletonPage } from "@/lib/data/public";
import { resolvePrimaryImage } from "@/lib/media";

export const revalidate = 300;

const trustLogos = [
  {
    logo: continuityLogo,
    alt: "Continuity Real Estate Agent",
    logoClassName: "w-[86px] sm:w-[98px] lg:w-[88px]",
    panelClassName: "px-[9px] py-[5px] sm:px-[10px] sm:py-[5px] lg:px-[7px] lg:py-[5px]",
  },
  {
    logo: gateLogo,
    alt: "Gate Real Estate",
    logoClassName: "w-[73px] sm:w-[84px] lg:w-[76px]",
    panelClassName: "px-[10px] py-[5px] sm:px-[11px] sm:py-[6px] lg:px-[7px] lg:py-[5px]",
  },
  {
    logo: franciscoLogo,
    alt: "Francisco Andrade",
    logoClassName: "w-[85px] sm:w-[96px] lg:w-[86px]",
    panelClassName: "px-[9px] py-[5px] sm:px-[10px] sm:py-[5px] lg:px-[7px] lg:py-[5px]",
  },
  {
    logo: mihouseLogo,
    alt: "Mihouse Real Estate",
    logoClassName: "w-[91px] sm:w-[103px] lg:w-[92px]",
    panelClassName: "px-[9px] py-[5px] sm:px-[10px] sm:py-[5px] lg:px-[7px] lg:py-[5px]",
  },
  {
    logo: houseLogo,
    alt: "House Estate",
    logoClassName: "w-[88px] sm:w-[100px] lg:w-[88px]",
    panelClassName: "px-[10px] py-[5px] sm:px-[11px] sm:py-[6px] lg:px-[7px] lg:py-[5px]",
  },
  {
    logo: salfordLogo,
    alt: "Salford",
    logoClassName: "w-[91px] sm:w-[103px] lg:w-[92px]",
    panelClassName: "px-[9px] py-[5px] sm:px-[10px] sm:py-[5px] lg:px-[7px] lg:py-[5px]",
  },
  {
    logo: continuityLogo,
    alt: "Continuity Real Estate Agent",
    logoClassName: "w-[86px] sm:w-[98px] lg:w-[88px]",
    panelClassName: "px-[9px] py-[5px] sm:px-[10px] sm:py-[5px] lg:px-[7px] lg:py-[5px]",
  },
];

const trustLogoCarouselItems = trustLogos.slice(0, 6);

const fallbackMetrics = [
  { value: "$250M+", label: "Transaction Volume Influenced", color: "#56acf7" },
  { value: "75+", label: "Properties Across Transactions", color: "#d84edf" },
  { value: "15+ Years", label: "Combined Team Experience", color: "#0dbda6" },
  { value: "Data-Driven", label: "Investment & Deal Analysis", color: "#ff5a1f" },
];

const fallbackSegments = [
  {
    title: "Passive Investors",
    body: "Earn passive income through structured real estate investments backed by data and operational discipline.",
    ctaLabel: "View Opportunities",
    ctaHref: "/investments",
  },
  {
    title: "Active Investors",
    body: "Scale your portfolio with access to capital, analytics, and execution support.",
    ctaLabel: "Request Funding Information",
    ctaHref: "/capital-rates",
  },
  {
    title: "Sellers",
    body: "Sell your property with a streamlined, data-driven process - no listings, no showings, no uncertainty.",
    ctaLabel: "Get a Cash Offer",
    ctaHref: "/cash-offer",
  },
  {
    title: "Buyers",
    body: "Access off-market opportunities and value-add properties sourced through our network.",
    ctaLabel: "Request Details",
    ctaHref: "/properties",
  },
];

const fallbackPlatformCards = [
  {
    title: "Investments",
    body: "Curated passive and active investment opportunities.",
    ctaLabel: "View Opportunities",
    ctaHref: "/investments",
  },
  {
    title: "Properties",
    body: "Turnkey and value-add properties across select markets.",
    ctaLabel: "Request Details",
    ctaHref: "/properties",
  },
  {
    title: "ROI Calculators",
    body: "Analyze deals using professional-grade financial models.",
    ctaLabel: "View Calculators",
    ctaHref: "/calculators",
  },
];

const fallbackCaseHighlights = [
  {
    title: "Value-Add Multifamily",
    body: "Renovation-focused strategy targeting operational improvements and long-term cash flow stabilization.",
    ctaLabel: "See Case Studies",
    ctaHref: "/case-studies",
  },
  {
    title: "Turnaround Strategy",
    body: "Repositioning underperforming assets through disciplined execution and market-specific insights.",
    ctaLabel: "See Case Studies",
    ctaHref: "/case-studies",
  },
  {
    title: "Fix & Flip",
    body: "Short-duration strategies focused on acquisition discipline, renovation efficiency, and controlled exits.",
    ctaLabel: "See Case Studies",
    ctaHref: "/case-studies",
  },
];

const performanceSnapshot = [
  { value: "$447.5M+", label: "Capital Deployed", color: "#2496f0" },
  { value: "22.3%", label: "Average IRR", color: "#d756dd" },
  { value: "11.2%", label: "Avg Passive Yield", color: "#0fc3ab" },
  { value: "5,300+", label: "Units Managed", color: "#ff5a1f" },
];

const formatDisplayValue = (value: string | null | undefined) =>
  (value ?? "")
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
    return 38;
  }

  if (normalizedStatus.includes("UNDER") || normalizedStatus.includes("PENDING")) {
    return 82;
  }

  if (normalizedStatus.includes("SOLD") || normalizedStatus.includes("CLOSED")) {
    return 100;
  }

  return 56;
};

const whoWeHelpVisuals = [
  {
    icon: passiveInvestorIcon,
    background: "#c8ebfb",
    panel: "rgba(255,255,255,0.18)",
    iconClassName: "h-[62px] w-[41px]",
  },
  {
    icon: iconInvestor,
    background: "#f1ddf6",
    panel: "rgba(255,255,255,0.18)",
    iconClassName: "h-[62px] w-[73px]",
  },
  {
    icon: iconSeller,
    background: "#fde9b8",
    panel: "rgba(255,255,255,0.18)",
    iconClassName: "h-[60px] w-[69px]",
  },
  {
    icon: iconBuyer,
    background: "#c3efe3",
    panel: "rgba(255,255,255,0.18)",
    iconClassName: "h-[56px] w-[78px]",
  },
];

const platformCardVisuals = [
  {
    icon: investmentIcon,
    iconClassName: "h-[68px] w-[82px]",
    iconShellClassName: "bg-[linear-gradient(180deg,#17b1ed_0%,#278af6_100%)]",
  },
  {
    icon: propertiesIcon,
    iconClassName: "h-[96px] w-[90px]",
    iconShellClassName: "bg-[linear-gradient(180deg,#df42cb_0%,#b445ee_100%)]",
  },
  {
    icon: roiCalculatorIcon,
    iconClassName: "h-[108px] w-[80px]",
    iconShellClassName: "bg-[linear-gradient(180deg,#13c6ad_0%,#11bb80_100%)]",
  },
];

const featuredPropertyListingCards = [
  {
    id: "fallback-property-1",
    address: "Illustrative property sourced through our network",
    annualReturn: "Available",
    ctaLabel: "Request Details",
    href: "/properties",
    image: featuredPropertiesRightUpperImage,
    leftMetricLabel: "Status",
    propertyType: "Residential",
    progressPercent: 64,
    raisedSummary: "Representative opportunity shown for layout preview and launch readiness.",
    rightMetricLabel: "Property Type",
    timeLabel: "Strategy",
    timeLeft: "Buy & Hold",
    title: "Illustrative Property",
  },
  {
    id: "fallback-property-2",
    address: "Illustrative property sourced through our network",
    annualReturn: "Coming Soon",
    ctaLabel: "Request Details",
    href: "/properties",
    image: aboutSectionImage,
    leftMetricLabel: "Status",
    propertyType: "Multifamily",
    progressPercent: 64,
    raisedSummary: "Representative opportunity shown for layout preview and launch readiness.",
    rightMetricLabel: "Property Type",
    timeLabel: "Strategy",
    timeLeft: "Value-Add",
    title: "Illustrative Property",
  },
  {
    id: "fallback-property-3",
    address: "Illustrative property sourced through our network",
    annualReturn: "Available",
    ctaLabel: "Request Details",
    href: "/properties",
    image: featuredPropertiesLeftImage,
    leftMetricLabel: "Status",
    propertyType: "Commercial",
    progressPercent: 64,
    raisedSummary: "Representative opportunity shown for layout preview and launch readiness.",
    rightMetricLabel: "Property Type",
    timeLabel: "Strategy",
    timeLeft: "Turnkey",
    title: "Illustrative Property",
  },
];

export default async function Home() {
  const [homePage, publishedProperties, propertiesPage, caseStudiesPage] = await Promise.all([
    getHomePage(),
    getPublishedProperties(),
    getSingletonPage("PROPERTIES_INDEX"),
    getSingletonPage("CASE_STUDIES_INDEX"),
  ]);

  const defaultHeroSubheadline =
    "Build wealth through institutional-grade real estate opportunities guided by data, technology, and disciplined execution.";
  const heroHeadline =
    homePage?.heroHeadline ?? "Vertically-Integrated Real Estate & PropTech Investments";
  const heroSubheadline =
    homePage?.heroSubheadline ?? defaultHeroSubheadline;
  const primaryCta = {
    href: homePage?.heroPrimaryCtaHref ?? "/investments",
    label: homePage?.heroPrimaryCtaLabel ?? "View Opportunities",
  };
  const secondaryCta = {
    href: homePage?.heroSecondaryCtaHref ?? "/cash-offer",
    label: homePage?.heroSecondaryCtaLabel ?? "Get a Cash Offer",
  };
  const homeMetrics = homePage?.metrics ?? [];
  const homeSegments = homePage?.segments ?? [];
  const homePlatformCards = homePage?.platformCards ?? [];
  const homeCaseHighlights = homePage?.caseHighlights ?? [];
  const homeTestimonials = homePage?.testimonials ?? [];
  const portfolioValueDisplay =
    homePage?.portfolioValueDisplay ?? "$920,000 (Illustrative)";
  const portfolioCaption =
    homePage?.portfolioCaption ?? "Historical Performance Overview";

  const metrics =
    homeMetrics.length
      ? homeMetrics.map((metric, index) => ({
          value: metric.metricValue,
          label: metric.metricLabel,
          color: fallbackMetrics[index % fallbackMetrics.length]?.color ?? "#2496f0",
        }))
      : fallbackMetrics;

  const segments = homeSegments.length ? homeSegments : fallbackSegments;
  const platformCards = homePlatformCards.length ? homePlatformCards : fallbackPlatformCards;
  const caseHighlights = homeCaseHighlights.length ? homeCaseHighlights : fallbackCaseHighlights;
  const whoWeHelpShowcaseCards = segments.slice(0, 4).map((segment, index) => ({
    ...whoWeHelpVisuals[index % whoWeHelpVisuals.length],
    body: segment.body,
    ctaHref: segment.ctaHref,
    ctaLabel: segment.ctaLabel,
    title: segment.title,
  }));
  const investmentOpportunityShowcaseCards = platformCards.slice(0, 3).map((card, index) => ({
    ...platformCardVisuals[index % platformCardVisuals.length],
    body: card.body,
    ctaHref: card.ctaHref,
    ctaLabel: card.ctaLabel,
    title: card.title,
  }));
  const testimonials = homeTestimonials
    .filter((testimonial) => testimonial.name && testimonial.city && testimonial.quote)
    .map((testimonial) => ({
      avatar: testimonial.avatarUrl || null,
      city: testimonial.city,
      name: testimonial.name,
      quote: testimonial.quote,
    }));
  const featuredPropertyCards = (() => {
    const mappedCards = publishedProperties.map((property, index) => {
      const fallbackCard = featuredPropertyListingCards[index % featuredPropertyListingCards.length];
      const location = [property.locationCity, property.locationState].filter(Boolean).join(", ");
      const displayAddress = [property.title, location].filter(Boolean).join(", ");
      const status = formatDisplayValue(property.status) || fallbackCard.timeLeft;
      const propertyType = formatDisplayValue(property.propertyType) || fallbackCard.propertyType;
      const strategy = formatDisplayValue(property.strategy) || fallbackCard.timeLeft;
      const propertyImage = resolvePrimaryImage(property) || fallbackCard.image;

      return {
        ...fallbackCard,
        address: displayAddress || fallbackCard.address,
        annualReturn: status,
        ctaLabel: propertiesPage?.ctaLabel ?? fallbackCard.ctaLabel,
        href: `/properties/${property.slug}`,
        id: property.id,
        image: propertyImage,
        leftMetricLabel: fallbackCard.leftMetricLabel,
        progressPercent: getPropertyProgressPercent(property.status),
        propertyType,
        raisedSummary: property.summary ? truncate(property.summary, 94) : fallbackCard.raisedSummary,
        rightMetricLabel: fallbackCard.rightMetricLabel,
        timeLabel: fallbackCard.timeLabel,
        timeLeft: strategy,
        title: property.locationCity?.trim() || fallbackCard.title,
      };
    });

    if (mappedCards.length >= 3) {
      return mappedCards;
    }

    const fallbackCards = featuredPropertyListingCards.map((card, index) => ({
      ...card,
      href: "/properties",
      id: `featured-property-fallback-${index}`,
    }));

    return [...mappedCards, ...fallbackCards].slice(0, 3);
  })();
  const featuredPropertiesShowcase = {
    eyebrowTitle: "Insights & Legal Perspectives",
    eyebrowSubtitle:
      caseStudiesPage?.intro ??
      "Examples of investment strategies, execution frameworks, and lessons learned across real estate asset types.",
    main: {
      body: caseHighlights[0]?.body ?? fallbackCaseHighlights[0].body,
      ctaLabel: caseHighlights[0]?.ctaLabel ?? fallbackCaseHighlights[0].ctaLabel,
      href: caseHighlights[0]?.ctaHref ?? "/case-studies",
      image: featuredPropertiesLeftImage,
      title: caseHighlights[0]?.title ?? fallbackCaseHighlights[0].title,
    },
    sideTop: {
      body: caseHighlights[1]?.body ?? fallbackCaseHighlights[1].body,
      ctaLabel: caseHighlights[1]?.ctaLabel ?? fallbackCaseHighlights[1].ctaLabel,
      href: caseHighlights[1]?.ctaHref ?? "/case-studies",
      image: featuredPropertiesRightUpperImage,
      title: caseHighlights[1]?.title ?? fallbackCaseHighlights[1].title,
    },
    sideBottom: {
      body: caseHighlights[2]?.body ?? fallbackCaseHighlights[2].body,
      ctaLabel: caseHighlights[2]?.ctaLabel ?? fallbackCaseHighlights[2].ctaLabel,
      href: caseHighlights[2]?.ctaHref ?? "/case-studies",
      image: featuredPropertiesRightLowerImage,
      title: caseHighlights[2]?.title ?? fallbackCaseHighlights[2].title,
    },
  };
  const featuredShowcaseCards = [
    featuredPropertiesShowcase.main,
    featuredPropertiesShowcase.sideTop,
    featuredPropertiesShowcase.sideBottom,
  ];
  const aboutSection = {
    title: homePage?.aboutSectionTitle ?? "Why Pryceless Ventures, LLC",
    paragraphs: [
      homePage?.aboutSectionParagraphOne ?? heroSubheadline,
      homePage?.aboutSectionParagraphTwo ??
        segments.slice(0, 2).map((segment) => segment.body).join(" "),
    ].filter(Boolean),
    primaryCtaHref: homePage?.aboutSectionPrimaryCtaHref ?? primaryCta.href,
    primaryCtaLabel: homePage?.aboutSectionPrimaryCtaLabel ?? primaryCta.label,
    secondaryCtaHref: homePage?.aboutSectionSecondaryCtaHref ?? secondaryCta.href,
    secondaryCtaLabel: homePage?.aboutSectionSecondaryCtaLabel ?? secondaryCta.label,
    imageAlt: homePage?.aboutSectionImageAlt ?? "Interior bedroom",
    imageUrl: homePage?.aboutSectionImageUrl ?? aboutSectionImage.src,
  };
  const heroHeadingLines =
    heroHeadline === "Vertically-Integrated Real Estate & PropTech Investments"
      ? [
          "Vertically-Integrated",
          "Real Estate & PropTech",
          "Investments",
        ]
      : [heroHeadline];
  const heroSubheadlineLines =
    heroSubheadline === defaultHeroSubheadline
      ? [
          "Build wealth through institutional-grade real estate opportunities",
          "guided by data, technology, and disciplined execution.",
        ]
      : null;
  const homeSectionTitleClassName =
    "text-[30px] font-bold leading-[1.06] tracking-[-0.035em] sm:text-[38px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0]";
  const homeSectionSubtitleClassName =
    "text-[15px] font-normal leading-[1.5] tracking-[-0.01em] sm:text-[16px] lg:max-w-none lg:text-[14px] lg:leading-[20px] lg:tracking-[0]";
  return (
    <SiteShell cta={primaryCta}>
      <section className="w-full">
        <div
          className="relative isolate overflow-hidden bg-[#09152d] min-h-[620px] sm:min-h-[660px] lg:min-h-0 lg:aspect-[3327/1392] 2xl:aspect-[3327/1280]"
        >
          <Image
            src={heroSectionImage}
            alt="Luxury property exterior"
            fill
            priority
            className="object-cover object-[72%_22%] scale-[1.08] sm:scale-100 sm:object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,39,0.72)_0%,rgba(7,18,39,0.5)_30%,rgba(7,18,39,0.22)_56%,rgba(7,18,39,0.78)_100%)] lg:bg-[linear-gradient(90deg,rgba(7,18,39,0.95)_0%,rgba(7,18,39,0.92)_15%,rgba(7,18,39,0.8)_27%,rgba(7,18,39,0.54)_39%,rgba(7,18,39,0.24)_52%,rgba(7,18,39,0.06)_64%,rgba(7,18,39,0)_74%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,14,31,0.14)_0%,rgba(5,14,31,0)_34%,rgba(5,14,31,0.16)_62%,rgba(5,14,31,0.5)_100%)] lg:bg-[linear-gradient(180deg,rgba(5,14,31,0.12)_0%,rgba(5,14,31,0.02)_36%,rgba(5,14,31,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_36%,rgba(199,152,114,0.3)_0%,rgba(199,152,114,0.14)_18%,rgba(199,152,114,0)_42%)] lg:hidden" />
          <div className="absolute inset-y-0 left-0 hidden w-[62%] bg-[linear-gradient(90deg,rgba(9,20,42,0.56)_0%,rgba(9,20,42,0.36)_36%,rgba(9,20,42,0.12)_70%,rgba(9,20,42,0)_100%)] sm:w-[52%] lg:block lg:w-[44%] 2xl:w-[40%]" />

          <div className="relative z-10 flex h-full w-full items-start px-5 pb-[52px] pt-[292px] sm:px-10 sm:py-[64px] lg:items-start lg:pl-[135px] lg:pr-[135px] lg:pt-[128px] 2xl:pl-[176px] 2xl:pr-[176px] 2xl:pt-[154px]">
            <div className="flex w-full max-w-[372px] flex-col gap-[16px] sm:max-w-[520px] sm:gap-[22px] lg:max-w-[650px] lg:gap-[24px] 2xl:max-w-[780px] 2xl:gap-[28px]">
              <h1
                className="font-semibold text-[29px] leading-[1.06] tracking-[-0.055em] sm:text-[35px] sm:leading-[1.08] lg:text-[46px] lg:font-normal lg:leading-[1.2] lg:tracking-[-0.016em] 2xl:text-[58px] 2xl:leading-[1.14]"
                style={{ color: "#ffffff", wordSpacing: "0.02em" }}
              >
                {heroHeadingLines.length > 1 ? (
                  <>
                    {heroHeadingLines.map((line, index) => (
                      <span
                        className={index === 1 ? "block whitespace-nowrap sm:hidden" : "block sm:hidden"}
                        key={`mobile-${line}`}
                      >
                        {line}
                      </span>
                    ))}
                    <span className="hidden sm:block lg:hidden" style={{ textWrap: "balance" }}>
                      {heroHeadline}
                    </span>
                    {heroHeadingLines.map((line) => (
                      <span className="hidden lg:block lg:whitespace-nowrap" key={`desktop-${line}`}>
                        {line}
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="block" style={{ textWrap: "balance" }}>
                    {heroHeadline}
                  </span>
                )}
              </h1>

              <div className="flex flex-col gap-[16px] sm:gap-[22px] lg:gap-[24px]">
                <p
                  className="max-w-[340px] text-[16px] font-normal leading-[1.56] tracking-[-0.012em] text-white/95 sm:max-w-[470px] sm:text-[20px] lg:w-[560px] lg:max-w-none lg:text-[14.5px] lg:leading-[1.62] lg:tracking-[0] 2xl:w-[680px] 2xl:text-[16px] 2xl:leading-[1.72]"
                  style={{ color: "rgba(255,255,255,0.94)", wordSpacing: "0.03em" }}
                >
                  {heroSubheadlineLines ? (
                    <>
                      <span className="lg:hidden" style={{ textWrap: "balance" }}>{heroSubheadline}</span>
                      {heroSubheadlineLines.map((line) => (
                        <span className="hidden lg:block lg:whitespace-nowrap" key={line}>
                          {line}
                        </span>
                      ))}
                    </>
                  ) : (
                    <span style={{ textWrap: "balance" }}>{heroSubheadline}</span>
                  )}
                </p>

                <div className="flex w-full max-w-[372px] flex-row items-center gap-3.5 sm:w-auto sm:max-w-none sm:gap-4 lg:gap-[18px] 2xl:gap-[22px]">
                  <Link
                    href={primaryCta.href}
                    className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-[12px] bg-white px-4 py-2.5 text-[14px] font-semibold tracking-[-0.02em] text-[#111827] shadow-[0_14px_32px_rgba(0,0,0,0.16)] transition-colors hover:bg-white sm:h-[50px] sm:w-[214px] sm:flex-none sm:px-5 sm:py-2.5 sm:text-[17px] lg:h-[31px] lg:w-[154px] lg:rounded-[4px] lg:px-0 lg:py-0 lg:text-[12.5px] lg:font-bold lg:leading-[18px] lg:tracking-[0] lg:shadow-[0_2px_5px_rgba(6,18,37,0.12)] 2xl:h-[38px] 2xl:w-[182px] 2xl:text-[13.5px]"
                  >
                    <span className="whitespace-nowrap lg:inline-flex lg:h-[18px] lg:w-[126px] lg:items-center lg:justify-center lg:text-center 2xl:h-[20px] 2xl:w-[146px]">
                      {primaryCta.label}
                    </span>
                  </Link>

                  <Link
                    href={secondaryCta.href}
                    className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-[12px] bg-[#c79872] px-4 py-2.5 text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_14px_32px_rgba(35,18,10,0.18)] transition-colors hover:bg-[#c79872] hover:text-white sm:h-[50px] sm:w-[214px] sm:flex-none sm:px-5 sm:py-2.5 sm:text-[17px] lg:h-[31px] lg:w-[154px] lg:rounded-[4px] lg:px-0 lg:py-0 lg:text-[12.5px] lg:font-bold lg:leading-[18px] lg:tracking-[0] lg:shadow-[0_2px_5px_rgba(35,18,10,0.1)] 2xl:h-[38px] 2xl:w-[182px] 2xl:text-[13.5px]"
                    style={{ color: "#ffffff" }}
                  >
                    <span className="whitespace-nowrap lg:inline-flex lg:h-[18px] lg:w-[126px] lg:items-center lg:justify-center lg:text-center 2xl:h-[20px] 2xl:w-[146px]" style={{ color: "#ffffff" }}>
                      {secondaryCta.label}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="py-[28px] sm:py-[34px] lg:py-[20px]"
        style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-[145px] 2xl:px-[184px]">
          <div className="lg:hidden">
            <MobileLogoCarousel items={trustLogoCarouselItems} />
          </div>

          <div className="hidden lg:mx-auto lg:grid lg:w-full lg:max-w-[1540px] lg:grid-cols-7 lg:justify-items-center lg:gap-[16px] 2xl:max-w-[1720px] 2xl:gap-[22px]">
            {trustLogos.map((item, index) => (
              <div
                className="flex h-[66px] w-full min-w-0 items-center justify-center rounded-[12px] bg-[#f5f5f5] px-[10px] shadow-[0_0_0_1px_rgba(230,222,212,0.96)]"
                key={`${item.alt}-${index}`}
              >
                <div
                  className={`flex items-center justify-center rounded-[2px] bg-transparent ${item.panelClassName}`}
                >
                  <Image
                    alt={item.alt}
                    className={`h-auto object-contain ${item.logoClassName}`}
                    priority={index < 4}
                    sizes="160px"
                    src={item.logo}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-[54px] sm:py-[72px] lg:py-[56px]">
        <div className="mx-auto w-full max-w-[1905px] px-4 sm:px-6 lg:px-[135px] 2xl:px-[180px]">
          <div className="grid gap-y-8 lg:grid-cols-[720px_minmax(0,1fr)_520px] lg:items-start lg:gap-y-12 2xl:grid-cols-[780px_minmax(48px,1fr)_580px] 2xl:gap-y-14">
            <div className="lg:col-start-1 lg:w-[720px] lg:pt-[2px] 2xl:w-[780px]">
            <h2 className="max-w-none whitespace-nowrap text-[clamp(18px,5.5vw,22px)] font-bold leading-[1.02] tracking-[-0.05em] text-[#16203b] sm:whitespace-normal sm:text-[48px] lg:text-[42px] lg:leading-[54px] lg:tracking-[-0.045em] lg:text-[#0f172a] 2xl:text-[48px] 2xl:leading-[58px]">
              {aboutSection.title}
            </h2>

            <div className="mt-[18px] lg:mt-[21px] lg:max-w-[655px] 2xl:max-w-[720px]">
              {aboutSection.paragraphs.map((paragraph, index) => (
                <div key={`${paragraph}-${index}`}>
                  {index ? <div aria-hidden="true" className="h-[18px] lg:h-[12px]" /> : null}
                  <p
                    className="max-w-[742px] text-[15.5px] font-normal leading-[1.72] tracking-[-0.012em] text-[#3b3f47] sm:text-[18px] lg:max-w-[655px] lg:text-[17px] lg:leading-[25px] lg:tracking-[0] lg:text-[#373d48] 2xl:max-w-[720px] 2xl:text-[18px] 2xl:leading-[27px]"
                    style={{ wordSpacing: "0.03em" }}
                  >
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-[30px] flex flex-row flex-wrap items-center gap-x-4 gap-y-3 sm:items-end sm:gap-x-[30px] sm:gap-y-5 lg:mt-[42px] lg:flex-nowrap lg:items-center lg:gap-x-[26px]">
              {aboutSection.primaryCtaLabel && aboutSection.primaryCtaHref ? (
                <Link
                  className="inline-flex min-h-[48px] w-auto justify-self-start items-center justify-center rounded-full border border-[#95989f] bg-white px-4 py-3 text-center text-[13px] font-semibold tracking-[-0.02em] text-[#131927] transition hover:bg-[#fafafa] sm:min-h-[54px] sm:min-w-[238px] sm:w-auto sm:flex-none sm:px-[32px] sm:text-[16px] lg:h-[54px] lg:w-[216px] lg:min-w-[216px] lg:rounded-[27px] lg:border-[1.5px] lg:px-0 lg:py-0 lg:text-[17px] lg:font-semibold lg:leading-none lg:tracking-[0]"
                  href={aboutSection.primaryCtaHref}
                >
                  <span className="whitespace-nowrap">{aboutSection.primaryCtaLabel}</span>
                </Link>
              ) : null}
              {aboutSection.secondaryCtaLabel && aboutSection.secondaryCtaHref ? (
                <Link
                  className="inline-flex w-auto items-center justify-start gap-2 self-center text-[14px] font-semibold tracking-[-0.02em] text-[#161d2e] sm:min-h-0 sm:w-auto sm:shrink-0 sm:justify-start sm:gap-[12px] sm:text-[16px] lg:w-auto lg:translate-y-[6px] lg:justify-start lg:gap-[8px] lg:text-[17px] lg:font-semibold lg:leading-none lg:tracking-[0] lg:text-[#131927]"
                  href={aboutSection.secondaryCtaHref}
                >
                  <span className="inline-block whitespace-nowrap border-b-[1.5px] border-[#182138] pb-[6px] pr-[10px] sm:pb-[10px] lg:border-[#2f3340] lg:pb-[7px]">
                    {aboutSection.secondaryCtaLabel}
                  </span>
                  <span aria-hidden="true" className="text-[16px] leading-none sm:text-[22px] lg:text-[17px] lg:translate-y-[-1px]">{"\u2197"}</span>
                </Link>
              ) : null}
            </div>
          </div>

            <div
              className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] shadow-[0_18px_40px_rgba(15,23,42,0.08)] lg:col-start-3 lg:mx-0 lg:h-[356px] lg:w-[520px] lg:max-w-none lg:justify-self-end lg:rounded-[14px] lg:shadow-none 2xl:h-[396px] 2xl:w-[580px]"
              style={{ aspectRatio: "520 / 356" }}
            >
              <img
                alt={aboutSection.imageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
                src={aboutSection.imageUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white sm:bg-[#f5f5f5]"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <div className="mx-auto w-full max-w-[1905px]">
          <div className="mx-auto grid max-w-[360px] grid-cols-2 gap-x-[34px] gap-y-[46px] px-5 py-[42px] sm:max-w-none sm:gap-x-6 sm:gap-y-6 sm:px-6 sm:py-[34px] lg:grid-cols-4 lg:gap-x-[24px] lg:gap-y-0 lg:px-[135px] lg:py-[28px] 2xl:max-w-[1660px] 2xl:gap-x-[54px] 2xl:px-[180px]">
            {metrics.slice(0, 4).map((item, index) => (
              <div
                className="relative flex min-h-0 w-full flex-col items-center justify-center px-0 py-0 text-center sm:min-h-[96px] sm:rounded-[22px] sm:bg-white sm:px-4 sm:py-5 sm:shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:ring-1 sm:ring-[rgba(15,23,42,0.05)] lg:min-h-[86px] lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:ring-0"
                key={`${item.label}-${index}`}
              >
                {index < 3 ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 hidden h-[66px] w-px -translate-y-1/2 bg-[#e2e4e8] lg:block"
                  />
                ) : null}
                <p
                  className="text-[clamp(28px,11vw,52px)] font-semibold leading-[0.94] tracking-[-0.05em] sm:text-[48px] lg:text-[38px] lg:font-medium lg:leading-[26px] lg:tracking-[0]"
                  style={{ color: item.color }}
                >
                  {item.value}
                </p>
                <p
                  className="max-w-[124px] text-[14px] font-normal leading-[1.18] tracking-[-0.02em] text-[#2a2e35] sm:max-w-[150px] sm:text-[16px] lg:max-w-none lg:min-h-[20px] lg:whitespace-nowrap lg:text-[16px] lg:leading-[20px] lg:tracking-[0]"
                  style={{ marginTop: "clamp(10px, 1.5vw, 16px)", textWrap: "balance" }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-white pt-[84px] pb-[74px] sm:pt-[90px] sm:pb-[82px] lg:pt-[88px] lg:pb-[72px]"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-[-82px] left-[-300px] h-[560px] w-[1320px] opacity-[0.98] sm:bottom-[-94px] sm:left-[-280px] sm:h-[620px] sm:w-[1460px] lg:bottom-[-108px] lg:left-[-250px] lg:h-[700px] lg:w-[1640px]">
            <Image
              alt=""
              aria-hidden
              className="h-full w-full object-contain object-left-bottom"
              priority
              sizes="1640px"
              src={featuredPropertiesSectionBg}
            />
          </div>
          <div className="absolute right-[-420px] top-[126px] h-[470px] w-[1120px] scale-x-[-1] opacity-[0.74] sm:right-[-380px] sm:top-[118px] sm:h-[540px] sm:w-[1260px] lg:right-[-320px] lg:top-[112px] lg:h-[610px] lg:w-[1420px]">
            <Image
              alt=""
              aria-hidden
              className="h-full w-full object-contain object-right-top"
              sizes="1420px"
              src={featuredPropertiesSectionBg}
            />
          </div>
          <div className="absolute inset-x-0 top-0 h-[220px] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.34)_58%,rgba(255,255,255,0)_100%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1905px] px-4 sm:px-6 lg:px-[180px] 2xl:px-[220px]">
          <div className="mx-auto mt-[-52px] max-w-[1000px] text-center lg:mt-[-48px] lg:max-w-[858px] 2xl:max-w-[1020px]">
            <div className="grid items-center gap-[16px] md:grid-cols-[1fr_auto_1fr] lg:grid-cols-[309px_214px_311px] lg:gap-[12px] 2xl:grid-cols-[1fr_260px_1fr] 2xl:gap-[22px]">
              <span className="hidden h-px w-full bg-[#d8d8d4] md:block" />
              <h2 className={`shrink-0 text-[#182544] ${homeSectionTitleClassName} lg:w-[214px] lg:text-center lg:text-[rgba(15,23,42,1)] 2xl:w-[260px]`}>
                Who We Help
              </h2>
              <span className="hidden h-px w-full bg-[#d8d8d4] md:block" />
            </div>

            <div className="mt-[4px] flex justify-center">
              <p className={`max-w-[560px] text-center text-[#3f4348] ${homeSectionSubtitleClassName} lg:w-auto lg:text-[rgba(53,53,53,1)]`}>
                Supporting Investors, Buyers &amp; Sellers at Every Step.
              </p>
            </div>
          </div>

          <div className="mt-[38px] grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[16px] 2xl:gap-[24px]">
            {whoWeHelpShowcaseCards.map((card, index) => (
              <div
                className="flex w-full justify-center"
                key={`${card.title}-${index}`}
              >
                <ShowcaseActionCard
                  body={card.body}
                  bodyClassName="mt-[10px] max-w-full px-3 text-[12.5px] leading-[1.45] sm:text-[13px]"
                  cardStyle={{ backgroundColor: card.background }}
                  ctaLabel={card.ctaLabel}
                  href={card.ctaHref}
                  icon={card.icon}
                  iconAlt={card.title}
                  iconClassName={card.iconClassName}
                  panelStyle={{ backgroundColor: card.panel }}
                  title={card.title}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="pb-[84px] pt-[22px] sm:pb-[90px] sm:pt-[28px] lg:pb-[104px] lg:pt-[44px]"
        style={{ background: "rgba(17, 40, 62, 1)", fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <div className="mx-auto w-full max-w-[1120px] px-6 text-center sm:px-10 lg:px-0 2xl:max-w-[1320px]">
          <div className="mx-auto text-center lg:max-w-[760px] 2xl:max-w-[860px]">
              <h2
                className={`text-center text-white ${homeSectionTitleClassName}`}
                style={{ color: "#ffffff", fontFamily: "var(--font-poppins), sans-serif", fontWeight: 700 }}
              >
                Our Investment Opportunities
              </h2>
              <div className="mt-[8px] flex justify-center lg:mt-[2px]">
                <p
                  className={`max-w-[720px] text-center text-white/84 ${homeSectionSubtitleClassName}`}
                  style={{ color: "rgba(255,255,255,0.84)", fontFamily: "var(--font-poppins), sans-serif" }}
                >
                  Discover carefully curated investment opportunities designed to generate sustainable returns.
                </p>
              </div>
            </div>

          <div className="mx-auto mt-[38px] grid justify-center gap-[18px] sm:grid-cols-2 sm:gap-[22px] lg:mt-[34px] lg:grid-cols-4 lg:gap-[16px] 2xl:gap-[24px]">
            {investmentOpportunityShowcaseCards.map((card, index) => (
              <div className="flex w-full justify-center" key={`${card.title}-${index}`}>
                <ShowcaseActionCard
                  body={card.body}
                  bodyClassName="mt-[8px] max-w-full px-3 text-[12.5px] leading-[1.45] sm:text-[13px]"
                  buttonWrapClassName="pt-[18px]"
                  cardClassName="bg-white shadow-[0_8px_18px_rgba(8,18,38,0.06)]"
                  ctaLabel={card.ctaLabel}
                  href={card.ctaHref}
                  icon={card.icon}
                  iconAlt={card.title}
                  iconClassName={card.iconClassName}
                  imageSizes="120px"
                  panelClassName={`h-[106px] w-[120px] rounded-[13px] border-transparent ${card.iconShellClassName}`}
                  title={card.title}
                  titleClassName="mt-[12px] whitespace-nowrap px-2 text-[18px] font-semibold leading-[1.2]"
                />
              </div>
            ))}

            <div className="flex w-full justify-center sm:col-span-2 lg:col-span-1">
              <ShowcasePanelCard className="!items-stretch !p-0 overflow-hidden bg-white shadow-[0_8px_18px_rgba(8,18,38,0.06)]">
                <div className="relative h-full w-full flex-1">
                  <Image
                    alt="Portfolio growth chart"
                    fill
                    className="object-fill object-center"
                    sizes="(min-width: 640px) 260px, calc(100vw - 48px)"
                    src={portfolioGrowthChartImage}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.08)_20%,rgba(15,23,42,0.88)_100%)] px-[18px] pb-[18px] pt-[44px] text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/72">
                      {portfolioCaption}
                    </p>
                    <p className="mt-[8px] text-[24px] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[28px]">
                      {portfolioValueDisplay}
                    </p>
                  </div>
                </div>
              </ShowcasePanelCard>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-white pb-[60px] pt-[50px] sm:pb-[66px] sm:pt-[56px] lg:pb-[59px] lg:pt-[56px]"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-[-72px] left-[-250px] h-[520px] w-[1220px] opacity-[0.96] sm:bottom-[-80px] sm:left-[-220px] sm:h-[570px] sm:w-[1360px] lg:bottom-[-36px] lg:left-[-170px] lg:h-[430px] lg:w-[1320px]">
            <Image
              alt=""
              aria-hidden
              className="h-full w-full object-contain object-left-bottom"
              sizes="1320px"
              src={featuredPropertiesSectionBg}
            />
          </div>
          <div className="absolute right-[-360px] top-[176px] h-[420px] w-[1030px] scale-x-[-1] opacity-[0.82] sm:right-[-320px] sm:top-[162px] sm:h-[470px] sm:w-[1140px] lg:right-[-190px] lg:top-[138px] lg:h-[378px] lg:w-[1120px]">
            <Image
              alt=""
              aria-hidden
              className="h-full w-full object-contain object-right-center"
              sizes="1120px"
              src={featuredPropertiesSectionBg}
            />
          </div>
          <div className="absolute inset-x-0 top-0 h-[172px] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.36)_50%,rgba(255,255,255,0)_100%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1119px] px-4 sm:px-6 lg:px-0 2xl:max-w-[1320px]">
          <div className="text-center">
            <h2 className={`${homeSectionTitleClassName} text-[rgba(15,23,42,1)]`}>
              Featured Properties
            </h2>
            <div className="mt-[7px] flex justify-center">
              <p className={`max-w-[620px] text-center text-[rgba(53,53,53,1)] ${homeSectionSubtitleClassName} lg:w-auto`}>
                {propertiesPage?.intro ??
                  "Explore a selection of properties sourced through our acquisition channels and partner network."}
              </p>
            </div>
          </div>

          <div className="mt-[34px] lg:mt-[35px]">
            <FeaturedPropertiesCarousel
              ctaLabel={propertiesPage?.ctaLabel ?? "Request Details"}
              items={featuredPropertyCards}
            />
          </div>
        </div>
      </section>

      <section
        className="bg-[#f5f5f5] pb-[52px] pt-[48px] sm:pb-[58px] sm:pt-[56px] lg:pb-[24px] lg:pt-[24px]"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-[140px] 2xl:px-[180px]">
          <h2 className={`mx-auto w-full text-center text-[#182544] ${homeSectionTitleClassName} lg:text-[rgba(15,23,42,1)]`}>
            Proven Track Record Of Success
          </h2>

          <div className="mt-[36px] grid grid-cols-2 gap-y-[26px] lg:mt-[16px] lg:h-[72px] lg:grid-cols-4 lg:items-center lg:gap-y-0 2xl:h-[86px]">
            {performanceSnapshot.map((item, index) => (
              <div
                className="relative flex min-h-[116px] flex-col items-center justify-center px-4 text-center lg:h-full lg:min-h-0 lg:px-0"
                key={`${item.label}-${index}`}
              >
                {index < performanceSnapshot.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 hidden h-[56px] w-px -translate-y-1/2 bg-[#dde2e8] lg:block"
                  />
                ) : null}

                <p
                  className="text-[36px] font-semibold leading-[0.96] tracking-[-0.05em] sm:text-[52px] lg:text-[31px] lg:font-medium lg:leading-[20px] lg:tracking-[0] 2xl:text-[36px]"
                  style={{ color: item.color }}
                >
                  {item.value}
                </p>
                <p
                  style={{
                    marginTop: "clamp(10px, 1.5vw, 16px)",
                  }}
                  className="max-w-[150px] text-[14px] font-normal leading-[1.25] tracking-[-0.02em] text-[#2a2e35] sm:text-[16px] lg:max-w-none lg:min-h-[20px] lg:whitespace-nowrap lg:text-[16px] lg:leading-[20px] lg:tracking-[0] 2xl:text-[17px]"
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[rgba(17,40,62,1)] px-4 pb-[56px] pt-[44px] sm:px-6 sm:pb-[64px] sm:pt-[48px] lg:px-[145px] lg:pb-[68px] lg:pt-[52px] 2xl:px-[180px] 2xl:pb-[80px] 2xl:pt-[60px]"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <div className="mx-auto w-full">
          <div className="mx-auto flex max-w-[760px] flex-col items-center text-center lg:max-w-[860px] 2xl:max-w-[980px]">
            <h2
              className={`text-center text-white ${homeSectionTitleClassName}`}
              style={{ color: "#ffffff" }}
            >
              {featuredPropertiesShowcase.eyebrowTitle}
            </h2>
            <p
              className={`mt-[6px] max-w-[720px] text-center text-white/88 ${homeSectionSubtitleClassName} lg:max-w-[760px] 2xl:max-w-[880px]`}
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              {featuredPropertiesShowcase.eyebrowSubtitle}
            </p>
          </div>

          <div className="mx-auto mt-[34px] sm:hidden">
            <FeaturedShowcaseCarousel items={featuredShowcaseCards} />
          </div>

          <div className="mx-auto mt-[34px] hidden max-w-[1088px] gap-[24px] sm:grid lg:mt-[38px] lg:grid-cols-[430px_630px] lg:items-start lg:gap-[28px] 2xl:max-w-[1280px] 2xl:grid-cols-[500px_740px] 2xl:gap-[40px]">
            <article className="flex h-full flex-col rounded-[18px] border border-[#dde2e8] bg-white p-[22px] shadow-[0_1px_0_rgba(255,255,255,0.06)] lg:min-h-[458px] 2xl:min-h-[520px] 2xl:p-[28px]">
              <div className="relative mx-auto h-auto w-full max-w-[386px] overflow-hidden rounded-[12px] lg:h-[224px] lg:w-[386px] lg:max-w-none 2xl:h-[286px] 2xl:w-[444px]" style={{ aspectRatio: "386 / 224" }}>
                <Image
                  alt={featuredPropertiesShowcase.main.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1023px) 100vw, 386px"
                  src={featuredPropertiesShowcase.main.image}
                />
              </div>

              <div className="mt-[12px] px-[1px]">
                <h3
                  className="text-[19px] font-bold leading-[1.18] tracking-[-0.02em] text-[#1f2940] lg:text-[18.2px] lg:leading-[26px] lg:tracking-[0]"
                  style={{
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    display: "-webkit-box",
                    overflow: "hidden",
                  }}
                >
                  {featuredPropertiesShowcase.main.title}
                </h3>
                <p
                  className="mt-[9px] text-[14.5px] font-normal leading-[1.58] tracking-[-0.01em] text-[#6b7280] lg:text-[14px] lg:leading-[20px] lg:tracking-[0]"
                  style={{
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 5,
                    display: "-webkit-box",
                    overflow: "hidden",
                  }}
                >
                  {featuredPropertiesShowcase.main.body}
                </p>
              </div>

              <div className="mt-auto px-[1px] pt-[16px]">
                <Link
                  className="inline-flex h-[40px] min-w-[132px] items-center justify-center rounded-[4px] bg-[#11283e] px-[20px] text-[12.5px] font-semibold leading-[16px] tracking-[0] text-white transition hover:bg-[#102236]"
                  href={featuredPropertiesShowcase.main.href}
                  style={{ color: "#ffffff" }}
                >
                  {featuredPropertiesShowcase.main.ctaLabel}
                </Link>
              </div>
            </article>

             <div className="grid gap-[20px] lg:gap-[28px] 2xl:gap-[34px]">
              <article className="grid rounded-[18px] border border-[#dde2e8] bg-white p-[22px] shadow-[0_1px_0_rgba(255,255,255,0.06)] md:grid-cols-[196px_1fr] md:items-center md:gap-[24px] lg:h-[228px] 2xl:h-[244px] 2xl:grid-cols-[220px_1fr] 2xl:gap-[28px] 2xl:p-[26px]">
                <div className="relative mx-auto h-auto w-full max-w-[196px] overflow-hidden rounded-[12px] lg:h-[184px] lg:w-[196px] lg:max-w-none 2xl:h-[192px] 2xl:w-[220px]" style={{ aspectRatio: "196 / 184" }}>
                  <Image
                    alt={featuredPropertiesShowcase.sideTop.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 767px) 196px, 196px"
                    src={featuredPropertiesShowcase.sideTop.image}
                  />
                </div>

                <div className="flex h-full flex-col justify-center pt-[12px] md:pt-0">
                  <h3
                    className="text-[20px] font-bold leading-[1.18] tracking-[-0.02em] text-[#1f2940] lg:max-w-[320px] lg:text-[18.5px] lg:leading-[26px] lg:tracking-[0] 2xl:max-w-[400px] 2xl:text-[22px]"
                    style={{
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      display: "-webkit-box",
                      overflow: "hidden",
                    }}
                  >
                    {featuredPropertiesShowcase.sideTop.title}
                  </h3>
                  <p
                    className="mt-[9px] text-[14.5px] font-normal leading-[1.58] tracking-[-0.01em] text-[#6b7280] lg:max-w-[320px] lg:text-[14px] lg:leading-[20px] lg:tracking-[0] 2xl:max-w-[400px] 2xl:text-[15px] 2xl:leading-[22px]"
                    style={{
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      display: "-webkit-box",
                      overflow: "hidden",
                    }}
                  >
                    {featuredPropertiesShowcase.sideTop.body}
                  </p>
                  <div className="mt-[14px]">
                    <Link
                      className="inline-flex h-[40px] min-w-[132px] items-center justify-center rounded-[4px] bg-[#11283e] px-[20px] text-[12.5px] font-semibold leading-[16px] tracking-[0] text-white transition hover:bg-[#102236]"
                      href={featuredPropertiesShowcase.sideTop.href}
                      style={{ color: "#ffffff" }}
                    >
                      {featuredPropertiesShowcase.sideTop.ctaLabel}
                    </Link>
                  </div>
                </div>
              </article>

              <article className="grid rounded-[18px] border border-[#dde2e8] bg-white p-[22px] shadow-[0_1px_0_rgba(255,255,255,0.06)] md:grid-cols-[196px_1fr] md:items-center md:gap-[24px] lg:h-[228px] 2xl:h-[244px] 2xl:grid-cols-[220px_1fr] 2xl:gap-[28px] 2xl:p-[26px]">
                <div className="relative mx-auto h-auto w-full max-w-[196px] overflow-hidden rounded-[12px] lg:h-[184px] lg:w-[196px] lg:max-w-none 2xl:h-[192px] 2xl:w-[220px]" style={{ aspectRatio: "196 / 184" }}>
                  <Image
                    alt={featuredPropertiesShowcase.sideBottom.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 767px) 196px, 196px"
                    src={featuredPropertiesShowcase.sideBottom.image}
                  />
                </div>

                <div className="flex h-full flex-col justify-center pt-[12px] md:pt-0">
                  <h3
                    className="text-[20px] font-bold leading-[1.18] tracking-[-0.02em] text-[#1f2940] lg:max-w-[320px] lg:text-[18.5px] lg:leading-[26px] lg:tracking-[0] 2xl:max-w-[400px] 2xl:text-[22px]"
                    style={{
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      display: "-webkit-box",
                      overflow: "hidden",
                    }}
                  >
                    {featuredPropertiesShowcase.sideBottom.title}
                  </h3>
                  <p
                    className="mt-[9px] text-[14.5px] font-normal leading-[1.58] tracking-[-0.01em] text-[#6b7280] lg:max-w-[320px] lg:text-[14px] lg:leading-[20px] lg:tracking-[0] 2xl:max-w-[400px] 2xl:text-[15px] 2xl:leading-[22px]"
                    style={{
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      display: "-webkit-box",
                      overflow: "hidden",
                    }}
                  >
                    {featuredPropertiesShowcase.sideBottom.body}
                  </p>
                  <div className="mt-[14px]">
                    <Link
                      className="inline-flex h-[40px] min-w-[132px] items-center justify-center rounded-[4px] bg-[#11283e] px-[20px] text-[12.5px] font-semibold leading-[16px] tracking-[0] text-white transition hover:bg-[#102236]"
                      href={featuredPropertiesShowcase.sideBottom.href}
                      style={{ color: "#ffffff" }}
                    >
                      {featuredPropertiesShowcase.sideBottom.ctaLabel}
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {testimonials.length ? (
        <section className="relative overflow-hidden bg-white">
          <Image
            alt=""
            aria-hidden
            className="object-cover object-center"
            fill
            sizes="100vw"
            src={testimonialBg}
          />
          <div className="relative mx-auto flex max-w-[1110px] flex-col items-center px-4 py-[50px] text-center sm:px-6 sm:py-[60px] lg:min-h-[475px] lg:px-0 lg:pb-[52px] lg:pt-[46px] 2xl:max-w-[1320px] 2xl:min-h-[520px] 2xl:pb-[64px] 2xl:pt-[56px]">
            <div className="mx-auto max-w-[645px] lg:max-w-[980px] 2xl:max-w-[1120px]">
              <h2
                className={`${homeSectionTitleClassName} text-[rgba(15,23,42,1)]`}
                style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 700 }}
              >
                What Our Clients Say
              </h2>
              <p
                className={`mx-auto mt-[10px] max-w-[645px] text-[rgba(53,53,53,1)] lg:max-w-none lg:whitespace-nowrap ${homeSectionSubtitleClassName}`}
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                Real stories from homeowners and investors who found their dream
                properties with Pryceless Ventures, LLC
              </p>
            </div>

            <div className="mt-[28px] w-full lg:mt-[34px]">
              <TestimonialsCarousel items={testimonials} />
            </div>
          </div>
        </section>
      ) : null}
        </SiteShell>
      );
}  
