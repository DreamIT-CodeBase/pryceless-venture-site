import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { blogPostSeed, formDefinitionsSeed, loanProgramSeed } from "@/lib/content-blueprint";
import {
  getFallbackLoanProgram,
  getFallbackLoanPrograms,
} from "@/lib/loan-program-fallback-store";
import { prisma } from "@/lib/prisma";
import { mergeSingletonPageWithSeed } from "@/lib/singleton-page-utils";

const PUBLIC_REVALIDATE_SECONDS = 300;
const warnedFallbackLabels = new Set<string>();

const hasDatabaseUrl = () => Boolean(process.env.DATABASE_URL?.trim());

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

const isSchemaSyncFailure = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorWithMessage = error as { message?: string };
  const message = errorWithMessage.message ?? "";

  return (
    message.includes("Invalid object name") ||
    message.includes("Unknown field") ||
    message.includes("Unknown argument") ||
    message.includes("Unknown selection field") ||
    message.includes("loanProgram") ||
    message.includes("LoanProgram")
  );
};

const isBlogSchemaSyncFailure = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorWithMessage = error as { message?: string };
  const message = errorWithMessage.message ?? "";

  return (
    message.includes("Invalid object name") ||
    message.includes("Unknown field") ||
    message.includes("Unknown argument") ||
    message.includes("Unknown selection field") ||
    message.includes("blogPost") ||
    message.includes("BlogPost") ||
    message.includes("featuredImageUrl") ||
    message.includes("featuredImageAlt") ||
    message.includes("publishedAt") ||
    message.includes("authorName") ||
    message.includes("readTime") ||
    message.includes("excerpt") ||
    message.includes("content")
  );
};

const isFormSchemaSyncFailure = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorWithMessage = error as { message?: string };
  const message = errorWithMessage.message ?? "";

  return (
    message.includes("Invalid column name 'options'") ||
    message.includes("Invalid column name 'webhookUrl'") ||
    message.includes("Invalid column name 'linkedLoanProgramId'") ||
    message.includes("The column `options` does not exist") ||
    message.includes("The column `webhookUrl` does not exist") ||
    message.includes("Unknown field `linkedLoanProgram`") ||
    message.includes("Unknown argument `linkedLoanProgramId`") ||
    message.includes("Unknown argument `webhookUrl`") ||
    message.includes("Unknown argument `options`") ||
    message.includes("Unknown field `options`") ||
    message.includes("Unknown field `submissionWebhookStatus`") ||
    message.includes("Unknown field `webhookError`")
  );
};

const warnFallbackOnce = (label: string, reason: string) => {
  if (warnedFallbackLabels.has(label)) {
    return;
  }

  warnedFallbackLabels.add(label);
  console.warn(`[public-data] ${label} fallback enabled: ${reason}`);
};

const withPublicFallback = async <T>(
  label: string,
  fallback: T,
  query: () => Promise<T>,
) => {
  if (!hasDatabaseUrl()) {
    if (!warnedFallbackLabels.has(label)) {
      warnedFallbackLabels.add(label);
      console.warn(`[public-data] ${label} fallback enabled: database unavailable.`);
    }
    return fallback;
  }

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

const withLoanProgramFallback = async <T>(
  label: string,
  fallback: T,
  query: () => Promise<T>,
) => {
  if (!hasDatabaseUrl()) {
    warnFallbackOnce(label, "database unavailable, using seed data instead.");
    return fallback;
  }

  try {
    return await query();
  } catch (error) {
    if (isConnectionFailure(error) || isSchemaSyncFailure(error)) {
      warnFallbackOnce(
        label,
        "loan program schema is unavailable, using seed data instead.",
      );
      return fallback;
    }

    throw error;
  }
};

const withBlogFallback = async <T>(
  label: string,
  fallback: T,
  query: () => Promise<T>,
) => {
  if (!hasDatabaseUrl()) {
    warnFallbackOnce(label, "database unavailable, using seed data instead.");
    return fallback;
  }

  try {
    return await query();
  } catch (error) {
    if (isConnectionFailure(error) || isBlogSchemaSyncFailure(error)) {
      warnFallbackOnce(
        label,
        "blog schema is unavailable, using seed data instead.",
      );
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
  highlights: {
    orderBy: { sortOrder: "asc" as const },
    take: 2,
    select: {
      highlight: true,
    },
  },
} as const;

const propertyDetailBaseSelect = {
  buyerFit: true,
  locationCity: true,
  locationState: true,
  propertyType: true,
  slug: true,
  status: true,
  strategy: true,
  summary: true,
  title: true,
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

const propertyDetailSelect = {
  ...propertyDetailBaseSelect,
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
          options: true,
          placeholder: true,
          required: true,
          type: true,
        },
      },
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
          options: true,
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
  assetProfile: {
    orderBy: { sortOrder: "asc" as const },
    take: 2,
    select: {
      label: true,
      value: true,
    },
  },
  takeaways: {
    orderBy: { sortOrder: "asc" as const },
    take: 2,
    select: {
      takeaway: true,
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

const blogPostListSelect = {
  authorName: true,
  category: true,
  excerpt: true,
  featuredImageAlt: true,
  featuredImageUrl: true,
  id: true,
  publishedAt: true,
  readTime: true,
  slug: true,
  title: true,
} as const;

const blogPostDetailSelect = {
  authorName: true,
  category: true,
  content: true,
  excerpt: true,
  featuredImageAlt: true,
  featuredImageUrl: true,
  id: true,
  publishedAt: true,
  readTime: true,
  slug: true,
  title: true,
} as const;

const calculatorListSelect = {
  calculatorType: true,
  disclaimer: true,
  shortDescription: true,
  slug: true,
  title: true,
} as const;

const loanProgramListSelect = {
  crmTag: true,
  id: true,
  imageAlt: true,
  imageUrl: true,
  interestRate: true,
  keyHighlights: true,
  loanTerm: true,
  ltv: true,
  maxAmount: true,
  minAmount: true,
  shortDescription: true,
  slug: true,
  title: true,
} as const;

const loanProgramDetailSelect = {
  fees: true,
  fullDescription: true,
  imageAlt: true,
  imageUrl: true,
  interestRate: true,
  keyHighlights: true,
  loanTerm: true,
  ltv: true,
  maxAmount: true,
  minAmount: true,
  shortDescription: true,
  slug: true,
  title: true,
  forms: {
    where: {
      isActive: true,
    },
    orderBy: { updatedAt: "desc" as const },
    take: 1,
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
          options: true,
          placeholder: true,
          required: true,
          type: true,
        },
      },
    },
  },
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
      options: true,
      placeholder: true,
      required: true,
      type: true,
    },
  },
} as const;

const getSeedActiveForm = (slug: string) => {
  const definition = formDefinitionsSeed.find((form) => form.slug === slug);

  if (!definition) {
    return null;
  }

  return {
    formName: definition.formName,
    slug: definition.slug,
    successMessage: definition.successMessage,
    fields: definition.fields.map((field, index) => ({
      fieldKey: field.fieldKey,
      id: `seed-${definition.slug}-${field.fieldKey}-${index}`,
      label: field.label,
      options:
        "options" in field && Array.isArray(field.options) && field.options.length
          ? JSON.stringify(field.options)
          : null,
      placeholder: "placeholder" in field ? field.placeholder ?? null : null,
      required: Boolean(field.required),
      type: field.type,
    })),
  };
};

type SeedBackedLoanProgramListItem = {
  crmTag: string | null;
  id: string;
  imageAlt: string | null;
  imageUrl: string | null;
  interestRate: string | null;
  keyHighlights: string | null;
  loanTerm: string | null;
  ltv: string | null;
  maxAmount: string | null;
  minAmount: string | null;
  shortDescription: string | null;
  slug: string;
  title: string;
};

type SeedBackedLoanProgramDetailItem = SeedBackedLoanProgramListItem & {
  fees: string | null;
  forms: Array<{
    formName: string;
    slug: string;
    successMessage: string;
    fields: Array<{
      fieldKey: string;
      id: string;
      label: string;
      options: string | null;
      placeholder: string | null;
      required: boolean;
      type: string;
    }>;
  }>;
  fullDescription: string | null;
  keyHighlights: string | null;
};

type SeedBackedBlogPostListItem = {
  authorName: string | null;
  category: string;
  excerpt: string;
  featuredImageAlt: string | null;
  featuredImageUrl: string | null;
  id: string;
  publishedAt: Date | null;
  readTime: string | null;
  slug: string;
  title: string;
};

type SeedBackedBlogPostDetailItem = SeedBackedBlogPostListItem & {
  content: string;
};

const getBlogSeedPublishedAt = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getSeedBlogPostList = (): SeedBackedBlogPostListItem[] =>
  [...blogPostSeed]
    .filter((post) => post.lifecycleStatus === "PUBLISHED")
    .sort((left, right) => {
      const leftTime = getBlogSeedPublishedAt(left.publishedAt)?.getTime() ?? 0;
      const rightTime = getBlogSeedPublishedAt(right.publishedAt)?.getTime() ?? 0;
      return rightTime - leftTime;
    })
    .map((post) => ({
      authorName: post.authorName ?? null,
      category: post.category,
      excerpt: post.excerpt,
      featuredImageAlt: post.featuredImageAlt ?? null,
      featuredImageUrl: post.featuredImageUrl ?? null,
      id: `seed-${post.slug}`,
      publishedAt: getBlogSeedPublishedAt(post.publishedAt),
      readTime: post.readTime ?? null,
      slug: post.slug,
      title: post.title,
    }));

const getSeedBlogPostDetail = (slug: string): SeedBackedBlogPostDetailItem | null => {
  const post = blogPostSeed.find(
    (entry) => entry.slug === slug && entry.lifecycleStatus === "PUBLISHED",
  );

  if (!post) {
    return null;
  }

  return {
    authorName: post.authorName ?? null,
    category: post.category,
    content: post.content,
    excerpt: post.excerpt,
    featuredImageAlt: post.featuredImageAlt ?? null,
    featuredImageUrl: post.featuredImageUrl ?? null,
    id: `seed-${post.slug}`,
    publishedAt: getBlogSeedPublishedAt(post.publishedAt),
    readTime: post.readTime ?? null,
    slug: post.slug,
    title: post.title,
  };
};

const getSeedLoanProgramList = async (): Promise<SeedBackedLoanProgramListItem[]> =>
  (await getFallbackLoanPrograms())
    .filter((program) => program.isActive && program.lifecycleStatus === "PUBLISHED")
    .map((program) => ({
      crmTag: program.crmTag ?? null,
      id: program.id,
      imageAlt: program.imageAlt ?? null,
      imageUrl: program.imageUrl ?? null,
      interestRate: program.interestRate ?? null,
      keyHighlights: program.keyHighlights ?? null,
      loanTerm: program.loanTerm ?? null,
      ltv: program.ltv ?? null,
      maxAmount: program.maxAmount ?? null,
      minAmount: program.minAmount ?? null,
      shortDescription: program.shortDescription ?? null,
      slug: program.slug,
      title: program.title,
    }));

const getSeedLoanProgramDetail = async (
  slug: string,
): Promise<SeedBackedLoanProgramDetailItem | null> => {
  const program = await getFallbackLoanProgram(slug);

  if (!program || !program.isActive || program.lifecycleStatus !== "PUBLISHED") {
    return null;
  }

  return {
    crmTag: program.crmTag ?? null,
    id: program.id,
    fees: program.fees ?? null,
    forms: program.forms.map((form) => {
      const linkedDefinition = formDefinitionsSeed.find((definition) => definition.slug === form.slug);

      return {
        formName: form.formName,
        slug: form.slug,
        successMessage:
          linkedDefinition?.successMessage ??
          "Thank you. Our team will follow up shortly.",
        fields:
          linkedDefinition?.fields.map((field) => ({
            fieldKey: field.fieldKey,
            id: `seed-${form.slug}-${field.fieldKey}`,
            label: field.label,
            options:
              "options" in field && Array.isArray(field.options) && field.options.length
                ? JSON.stringify(field.options)
                : null,
            placeholder:
              "placeholder" in field ? field.placeholder ?? null : null,
            required: Boolean(field.required),
            type: field.type,
          })) ?? [],
      };
    }),
    fullDescription: program.fullDescription ?? null,
    imageAlt: program.imageAlt ?? null,
    imageUrl: program.imageUrl ?? null,
    interestRate: program.interestRate ?? null,
    keyHighlights: program.keyHighlights ?? null,
    loanTerm: program.loanTerm ?? null,
    ltv: program.ltv ?? null,
    maxAmount: program.maxAmount ?? null,
    minAmount: program.minAmount ?? null,
    shortDescription: program.shortDescription ?? null,
    slug: program.slug,
    title: program.title,
  };
};

const getLoanProgramDelegate = () => {
  if (!hasDatabaseUrl()) {
    return undefined;
  }

  return (prisma as unknown as {
    loanProgram?: {
      findFirst: (args: unknown) => Promise<unknown>;
      findMany: (args: unknown) => Promise<unknown>;
    };
  }).loanProgram;
};

const getBlogPostDelegate = () => {
  if (!hasDatabaseUrl()) {
    return undefined;
  }

  return (prisma as unknown as {
    blogPost?: {
      findFirst: (args: unknown) => Promise<unknown>;
      findMany: (args: unknown) => Promise<unknown>;
    };
  }).blogPost;
};

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

const getPublishedBlogPostsCached = unstable_cache(
  () => {
    const fallback = getSeedBlogPostList();
    const blogPostDelegate = getBlogPostDelegate();

    if (!blogPostDelegate) {
      warnFallbackOnce(
        "published-blog-posts",
        "Prisma blogPost delegate is unavailable, using seed data instead.",
      );
      return Promise.resolve(fallback);
    }

    return withBlogFallback("published-blog-posts", fallback, () =>
      blogPostDelegate.findMany({
        where: { lifecycleStatus: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: blogPostListSelect,
      }) as Promise<SeedBackedBlogPostListItem[]>,
    );
  },
  ["public-published-blog-posts"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["blogs"],
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

const getPublishedLoanProgramsCached = unstable_cache(
  async () => {
    const fallback = await getSeedLoanProgramList();
    const loanProgramDelegate = getLoanProgramDelegate();

    if (!loanProgramDelegate) {
      warnFallbackOnce(
        "published-loan-programs",
        "Prisma loanProgram delegate is unavailable, using seed data instead.",
      );
      return Promise.resolve(fallback);
    }

    return withLoanProgramFallback("published-loan-programs", fallback, () =>
      loanProgramDelegate.findMany({
        where: {
          isActive: true,
          lifecycleStatus: "PUBLISHED",
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        select: loanProgramListSelect,
      }) as Promise<SeedBackedLoanProgramListItem[]>,
    );
  },
  ["public-published-loan-programs"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["loan-programs"],
  },
);

export const getHomePage = async () => getHomePageCached();

export const getSingletonPage = async (key: string) =>
  unstable_cache(
    () =>
      withPublicFallback(`singleton-page:${key}`, mergeSingletonPageWithSeed(null, key), () =>
        prisma.singletonPage.findUnique({
          where: { key: key as never },
          select: singletonPageSelect,
        }).then((page) => mergeSingletonPageWithSeed(page, key)),
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

export const getPublishedBlogPosts = async (limit?: number) => {
  const posts = await getPublishedBlogPostsCached();

  return typeof limit === "number" ? posts.slice(0, limit) : posts;
};

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

export const getPublishedBlogPost = async (slug: string) =>
  unstable_cache(
    () => {
      const fallback = getSeedBlogPostDetail(slug);
      const blogPostDelegate = getBlogPostDelegate();

      if (!blogPostDelegate) {
        warnFallbackOnce(
          `published-blog-post:${slug}`,
          "Prisma blogPost delegate is unavailable, using seed data instead.",
        );
        return Promise.resolve(fallback);
      }

      return withBlogFallback(`published-blog-post:${slug}`, fallback, () =>
        blogPostDelegate.findFirst({
          where: {
            slug,
            lifecycleStatus: "PUBLISHED",
          },
          select: blogPostDetailSelect,
        }) as Promise<SeedBackedBlogPostDetailItem | null>,
      );
    },
    ["public-published-blog-post", slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: ["blogs", `blog:${slug}`],
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

export const getPublishedLoanPrograms = async () => getPublishedLoanProgramsCached();

export const getPublishedLoanProgram = async (slug: string) =>
  unstable_cache(
    async () => {
      const fallback = await getSeedLoanProgramDetail(slug);
      const loanProgramDelegate = getLoanProgramDelegate();

      if (!loanProgramDelegate) {
        warnFallbackOnce(
          `published-loan-program:${slug}`,
          "Prisma loanProgram delegate is unavailable, using seed data instead.",
        );
        return fallback;
      }

      return withLoanProgramFallback(`published-loan-program:${slug}`, fallback, () =>
        loanProgramDelegate.findFirst({
          where: {
            slug,
            isActive: true,
            lifecycleStatus: "PUBLISHED",
          },
          select: loanProgramDetailSelect,
        }) as Promise<SeedBackedLoanProgramDetailItem | null>,
      );
    },
    ["public-published-loan-program", slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: ["loan-programs", `loan-program:${slug}`],
    },
  )();

export const getActiveFormBySlug = async (slug: string) =>
  unstable_cache(
    () => {
      const fallback = getSeedActiveForm(slug);

      return withPublicFallback(`active-form:${slug}`, fallback, () =>
        prisma.formDefinition
          .findFirst({
            where: {
              slug,
              isActive: true,
            },
            select: activeFormSelect,
          })
          .then((form) => form ?? fallback)
          .catch((error) => {
            if (isFormSchemaSyncFailure(error)) {
              warnFallbackOnce(
                `active-form:${slug}`,
                "form schema is unavailable, using seed data instead.",
              );
              return fallback;
            }

            throw error;
          }),
      );
    },
    ["public-active-form", slug],
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: [`form:${slug}`],
    },
  )();
