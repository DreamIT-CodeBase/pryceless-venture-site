import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

const PUBLIC_REVALIDATE_SECONDS = 300;
const warnedFallbackLabels = new Set<string>();

const isConnectionFailure = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorWithCode = error as { code?: string; message?: string };
  const message = errorWithCode.message ?? "";

  return (
    errorWithCode.code === "ELOGIN" ||
    errorWithCode.code === "ESOCKET" ||
    errorWithCode.code === "P1001" ||
    message.includes("Missing required environment variable: DATABASE_URL") ||
    message.includes("Client with IP address") ||
    message.includes("not allowed to access the server") ||
    message.includes("Can't reach database server") ||
    message.includes("Failed to connect to") ||
    message.includes("getaddrinfo ENOENT") ||
    message.includes("getaddrinfo ENOTFOUND")
  );
};

const withPublicFallback = async <T>(
  label: string,
  fallback: T,
  query: () => Promise<T>,
) => {
  try {
    return await query();
  } catch (error) {
    if (isConnectionFailure(error)) {
      if (!warnedFallbackLabels.has(label)) {
        warnedFallbackLabels.add(label);
        console.warn(`[public-data] ${label} fallback enabled: database unavailable.`);
      }
      return fallback;
    }

    throw error;
  }
};

const homePageSelect = {
  id: true,
  heroHeadline: true,
  heroSubheadline: true,
  heroPrimaryCtaLabel: true,
  heroPrimaryCtaHref: true,
  heroSecondaryCtaLabel: true,
  heroSecondaryCtaHref: true,
  aboutSectionTitle: true,
  aboutSectionParagraphOne: true,
  aboutSectionParagraphTwo: true,
  aboutSectionPrimaryCtaLabel: true,
  aboutSectionPrimaryCtaHref: true,
  aboutSectionSecondaryCtaLabel: true,
  aboutSectionSecondaryCtaHref: true,
  aboutSectionImageUrl: true,
  aboutSectionImageAlt: true,
  metricsDisclaimer: true,
  portfolioValueDisplay: true,
  portfolioCaption: true,
  metrics: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      metricLabel: true,
      metricValue: true,
    },
  },
  segments: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      body: true,
      ctaHref: true,
      ctaLabel: true,
      title: true,
    },
  },
  platformCards: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      body: true,
      ctaHref: true,
      ctaLabel: true,
      title: true,
    },
  },
  caseHighlights: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      body: true,
      ctaHref: true,
      ctaLabel: true,
      title: true,
    },
  },
  testimonials: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      avatarUrl: true,
      city: true,
      name: true,
      quote: true,
    },
  },
} as const;

const singletonPageSelect = {
  ctaHref: true,
  ctaLabel: true,
  disclaimer: true,
  intro: true,
  key: true,
  pageTitle: true,
  routePath: true,
  items: {
    orderBy: [
      { groupKey: "asc" },
      { sortOrder: "asc" },
    ] satisfies Prisma.SingletonPageItemOrderByWithRelationInput[],
    select: {
      body: true,
      ctaHref: true,
      ctaLabel: true,
      groupKey: true,
      title: true,
    },
  },
} satisfies Prisma.SingletonPageSelect;

const mediaFileBlobSelect = {
  select: {
    blobUrl: true,
    altText: true,
  },
} as const;

const primaryPropertyImageSelect = {
  select: {
    mediaFile: mediaFileBlobSelect,
  },
} as const;

const propertyListImageSelect = {
  orderBy: { sortOrder: "asc" as const },
  take: 1,
  select: {
    mediaFile: mediaFileBlobSelect,
  },
} as const;

const propertyListSelect = {
  id: true,
  locationCity: true,
  locationState: true,
  propertyType: true,
  slug: true,
  status: true,
  strategy: true,
  summary: true,
  title: true,
  primaryImage: primaryPropertyImageSelect,
  images: propertyListImageSelect,
} as const;

const propertyDetailSelect = {
  buyerFit: true,
  locationCity: true,
  locationState: true,
  propertyType: true,
  slug: true,
  status: true,
  strategy: true,
  summary: true,
  title: true,
  inquiryForm: {
    select: {
      formName: true,
      slug: true,
      successMessage: true,
      fields: {
        orderBy: { sortOrder: "asc" as const },
        select: {
          fieldKey: true,
          id: true,
          label: true,
          placeholder: true,
          required: true,
          type: true,
        },
      },
    },
  },
  highlights: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      highlight: true,
    },
  },
  primaryImage: primaryPropertyImageSelect,
  images: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      altText: true,
      caption: true,
      mediaFile: mediaFileBlobSelect,
    },
  },
} as const;

const primaryInvestmentImageSelect = {
  select: {
    mediaFile: mediaFileBlobSelect,
  },
} as const;

const investmentListImageSelect = {
  orderBy: { sortOrder: "asc" as const },
  take: 1,
  select: {
    mediaFile: mediaFileBlobSelect,
  },
} as const;

const investmentListSelect = {
  assetType: true,
  id: true,
  minimumInvestmentDisplay: true,
  slug: true,
  status: true,
  strategy: true,
  summary: true,
  title: true,
  primaryImage: primaryInvestmentImageSelect,
  images: investmentListImageSelect,
  highlights: {
    orderBy: { sortOrder: "asc" as const },
    take: 2,
    select: {
      highlight: true,
    },
  },
} as const;

const investmentDetailSelect = {
  assetType: true,
  minimumInvestmentDisplay: true,
  returnsDisclaimer: true,
  slug: true,
  status: true,
  strategy: true,
  summary: true,
  title: true,
  dealPacketForm: {
    select: {
      formName: true,
      slug: true,
      successMessage: true,
      fields: {
        orderBy: { sortOrder: "asc" as const },
        select: {
          fieldKey: true,
          id: true,
          label: true,
          placeholder: true,
          required: true,
          type: true,
        },
      },
    },
  },
  highlights: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      highlight: true,
    },
  },
  primaryImage: primaryInvestmentImageSelect,
  images: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      altText: true,
      caption: true,
      mediaFile: mediaFileBlobSelect,
    },
  },
} as const;

const caseStudyListSelect = {
  category: true,
  overview: true,
  slug: true,
  title: true,
  primaryImage: {
    select: {
      altText: true,
      mediaFile: mediaFileBlobSelect,
    },
  },
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 1,
    select: {
      altText: true,
      mediaFile: mediaFileBlobSelect,
    },
  },
} as const;

const caseStudyDetailSelect = {
  businessPlan: true,
  category: true,
  execution: true,
  outcomeSummary: true,
  overview: true,
  title: true,
  primaryImage: {
    select: {
      altText: true,
      mediaFile: mediaFileBlobSelect,
    },
  },
  images: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      altText: true,
      caption: true,
      mediaFile: mediaFileBlobSelect,
    },
  },
  assetProfile: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      label: true,
      value: true,
    },
  },
  takeaways: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      takeaway: true,
    },
  },
} as const;

const calculatorListSelect = {
  calculatorType: true,
  disclaimer: true,
  shortDescription: true,
  slug: true,
  title: true,
} as const;

const activeFormSelect = {
  formName: true,
  slug: true,
  successMessage: true,
  fields: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      fieldKey: true,
      id: true,
      label: true,
      placeholder: true,
      required: true,
      type: true,
    },
  },
} as const;

const getHomePageCached = unstable_cache(
  () =>
    withPublicFallback("home-page", null, () =>
      prisma.homePage.findUnique({
        where: { id: "home" },
        select: homePageSelect,
      }),
    ),
  ["public-home-page"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["home-page"],
  },
);

const getPublishedPropertiesCached = unstable_cache(
  () =>
    withPublicFallback("published-properties", [], () =>
      prisma.property.findMany({
        where: { lifecycleStatus: "PUBLISHED" },
        orderBy: { updatedAt: "desc" },
        select: propertyListSelect,
      }),
    ),
  ["public-published-properties"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["properties"],
  },
);

const getPublishedInvestmentsCached = unstable_cache(
  () =>
    withPublicFallback("published-investments", [], () =>
      prisma.investment.findMany({
        where: { lifecycleStatus: "PUBLISHED" },
        orderBy: { updatedAt: "desc" },
        select: investmentListSelect,
      }),
    ),
  ["public-published-investments"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["investments"],
  },
);

const getPublishedCaseStudiesCached = unstable_cache(
  () =>
    withPublicFallback("published-case-studies", [], () =>
      prisma.caseStudy.findMany({
        where: { lifecycleStatus: "PUBLISHED" },
        orderBy: { updatedAt: "desc" },
        select: caseStudyListSelect,
      }),
    ),
  ["public-published-case-studies"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["case-studies"],
  },
);

const getPublishedCalculatorsCached = unstable_cache(
  () =>
    withPublicFallback("published-calculators", [], () =>
      prisma.calculator.findMany({
        where: { lifecycleStatus: "PUBLISHED" },
        orderBy: { updatedAt: "desc" },
        select: calculatorListSelect,
      }),
    ),
  ["public-published-calculators"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["calculators"],
  },
);

export const getHomePage = async () => getHomePageCached();

export const getSingletonPage = async (key: string) =>
  unstable_cache(
    () =>
      withPublicFallback(`singleton-page:${key}`, null, () =>
        prisma.singletonPage.findUnique({
          where: { key: key as never },
          select: singletonPageSelect,
        }),
      ),
    ["public-singleton-page", key],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: [`singleton-page:${key}`],
    },
  )();

export const getPublishedProperties = async () => getPublishedPropertiesCached();

export const getPublishedProperty = async (slug: string) =>
  unstable_cache(
    () =>
      withPublicFallback(`published-property:${slug}`, null, () =>
        prisma.property.findFirst({
          where: {
            slug,
            lifecycleStatus: "PUBLISHED",
          },
          select: propertyDetailSelect,
        }),
      ),
    ["public-published-property", slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: ["properties", `property:${slug}`],
    },
  )();

export const getPublishedInvestments = async () => getPublishedInvestmentsCached();

export const getPublishedInvestment = async (slug: string) =>
  unstable_cache(
    () =>
      withPublicFallback(`published-investment:${slug}`, null, () =>
        prisma.investment.findFirst({
          where: {
            slug,
            lifecycleStatus: "PUBLISHED",
          },
          select: investmentDetailSelect,
        }),
      ),
    ["public-published-investment", slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: ["investments", `investment:${slug}`],
    },
  )();

export const getPublishedCaseStudies = async () => getPublishedCaseStudiesCached();

export const getPublishedCaseStudy = async (slug: string) =>
  unstable_cache(
    () =>
      withPublicFallback(`published-case-study:${slug}`, null, () =>
        prisma.caseStudy.findFirst({
          where: {
            slug,
            lifecycleStatus: "PUBLISHED",
          },
          select: caseStudyDetailSelect,
        }),
      ),
    ["public-published-case-study", slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: ["case-studies", `case-study:${slug}`],
    },
  )();

export const getPublishedCalculators = async () => getPublishedCalculatorsCached();

export const getPublishedCalculator = async (slug: string) =>
  unstable_cache(
    () =>
      withPublicFallback(`published-calculator:${slug}`, null, () =>
        prisma.calculator.findFirst({
          where: {
            slug,
            lifecycleStatus: "PUBLISHED",
          },
          select: calculatorListSelect,
        }),
      ),
    ["public-published-calculator", slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: ["calculators", `calculator:${slug}`],
    },
  )();

export const getActiveFormBySlug = async (slug: string) =>
  unstable_cache(
    () =>
      withPublicFallback(`active-form:${slug}`, null, () =>
        prisma.formDefinition.findFirst({
          where: {
            slug,
            isActive: true,
          },
          select: activeFormSelect,
        }),
      ),
    ["public-active-form", slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: [`form:${slug}`],
    },
  )();
