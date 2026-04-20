import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { blogPostSeed, formDefinitionsSeed, loanProgramSeed } from "@/lib/content-blueprint";
import {
  getFallbackLoanPrograms,
} from "@/lib/loan-program-fallback-store";
import { prisma } from "@/lib/prisma";
import { mergeSingletonPageWithSeed } from "@/lib/singleton-page-utils";
import { slugify } from "@/lib/utils";

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

const isPropertyDetailSchemaSyncFailure = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorWithMessage = error as { message?: string };
  const message = errorWithMessage.message ?? "";

  return (
    message.includes("Invalid column name 'detailContent'") ||
    message.includes("The column `detailContent` does not exist") ||
    message.includes("Unknown field `detailContent`") ||
    message.includes("Unknown selection field `detailContent`")
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

const propertyDetailCoreSelect = {
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

const propertyDetailBaseSelect = {
  ...propertyDetailCoreSelect,
  detailContent: true,
} as const;

const formFieldSelect = {
  fieldKey: true,
  id: true,
  label: true,
  options: true,
  placeholder: true,
  required: true,
  type: true,
} as const;

const legacyFormFieldSelect = {
  fieldKey: true,
  id: true,
  label: true,
  placeholder: true,
  required: true,
  type: true,
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
        select: formFieldSelect,
      },
    },
  },
} as const;

const propertyDetailLegacyFormSelect = {
  ...propertyDetailBaseSelect,
  inquiryForm: {
    select: {
      formName: true,
      slug: true,
      successMessage: true,
      fields: {
        orderBy: { sortOrder: "asc" as const },
        select: legacyFormFieldSelect,
      },
    },
  },
} as const;

const propertyDetailLegacyContentSelect = {
  ...propertyDetailCoreSelect,
  inquiryForm: {
    select: {
      formName: true,
      slug: true,
      successMessage: true,
      fields: {
        orderBy: { sortOrder: "asc" as const },
        select: formFieldSelect,
      },
    },
  },
} as const;

const propertyDetailLegacySchemaSelect = {
  ...propertyDetailCoreSelect,
  inquiryForm: {
    select: {
      formName: true,
      slug: true,
      successMessage: true,
      fields: {
        orderBy: { sortOrder: "asc" as const },
        select: legacyFormFieldSelect,
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
        select: formFieldSelect,
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

const investmentDetailLegacyFormSelect = {
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
        select: legacyFormFieldSelect,
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
  highlightImageUrl: true,
  highlightImageAlt: true,
  titleTail: true,
  heroBadgeOne: true,
  heroBadgeTwo: true,
  heroBadgeThree: true,
  highlightSubheadline: true,
  insightTitle: true,
  insightBody: true,
  interestRate: true,
  keyHighlights: true,
  loanTerm: true,
  ltv: true,
  maxAmount: true,
  minAmount: true,
  shortDescription: true,
  slug: true,
  title: true,
  highlights: {
    orderBy: { sortOrder: "asc" as const },
    select: { highlight: true },
  },
  overviewItems: {
    orderBy: { sortOrder: "asc" as const },
    select: { title: true, body: true },
  },
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
        select: formFieldSelect,
      },
    },
  },
} as const;

const loanProgramDetailLegacyFormSelect = {
  fees: true,
  fullDescription: true,
  imageAlt: true,
  imageUrl: true,
  highlightImageUrl: true,
  highlightImageAlt: true,
  titleTail: true,
  heroBadgeOne: true,
  heroBadgeTwo: true,
  heroBadgeThree: true,
  highlightSubheadline: true,
  insightTitle: true,
  insightBody: true,
  interestRate: true,
  keyHighlights: true,
  loanTerm: true,
  ltv: true,
  maxAmount: true,
  minAmount: true,
  shortDescription: true,
  slug: true,
  title: true,
  highlights: {
    orderBy: { sortOrder: "asc" as const },
    select: { highlight: true },
  },
  overviewItems: {
    orderBy: { sortOrder: "asc" as const },
    select: { title: true, body: true },
  },
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
        select: legacyFormFieldSelect,
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
    select: formFieldSelect,
  },
} as const;

const normalizeLegacyForm = <T extends { fields: Array<Record<string, unknown>> } | null>(
  form: T,
) =>
  form
    ? {
        ...form,
        fields: form.fields.map((field) => ({
          ...field,
          options: null as string | null,
        })),
      }
    : form;

const normalizeLegacyForms = <T extends { fields: Array<Record<string, unknown>> }>(forms: T[]) =>
  forms.map((form) => ({
    ...form,
    fields: form.fields.map((field) => ({
      ...field,
      options: null as string | null,
    })),
  }));

type PublishedPropertyRecord = Prisma.PropertyGetPayload<{
  select: typeof propertyDetailSelect;
}>;

type PublishedPropertyLegacyFormRecord = Prisma.PropertyGetPayload<{
  select: typeof propertyDetailLegacyFormSelect;
}>;

type PublishedPropertyLegacyContentRecord = Prisma.PropertyGetPayload<{
  select: typeof propertyDetailLegacyContentSelect;
}>;

type PublishedPropertyLegacySchemaRecord = Prisma.PropertyGetPayload<{
  select: typeof propertyDetailLegacySchemaSelect;
}>;

const normalizePublishedPropertyRecord = (
  property:
    | PublishedPropertyRecord
    | PublishedPropertyLegacyFormRecord
    | PublishedPropertyLegacyContentRecord
    | PublishedPropertyLegacySchemaRecord
    | null,
  options?: {
    legacyForm?: boolean;
    missingDetailContent?: boolean;
  },
) => {
  if (!property) {
    return null;
  }

  return {
    ...property,
    detailContent:
      options?.missingDetailContent || !("detailContent" in property)
        ? null
        : property.detailContent ?? null,
    inquiryForm: options?.legacyForm
      ? normalizeLegacyForm(property.inquiryForm)
      : property.inquiryForm,
  };
};

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

const getLoanProgramSlugCandidates = (slug: string) => {
  const normalizedSlug = slugify(slug);
  const candidates = new Set<string>();
  const queue = [normalizedSlug];
  const legacyMarketingSuffixPattern = /-for-(?:[a-z0-9]+-)*investors?$/;

  while (queue.length) {
    const current = queue.shift();

    if (!current || candidates.has(current)) {
      continue;
    }

    candidates.add(current);

    const canonicalCandidate = current.replace(legacyMarketingSuffixPattern, "");
    if (canonicalCandidate && canonicalCandidate !== current) {
      queue.push(canonicalCandidate);
    }
  }

  return Array.from(candidates);
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
  heroBadgeOne?: string | null;
  heroBadgeTwo?: string | null;
  heroBadgeThree?: string | null;
  highlightImageAlt?: string | null;
  highlightImageUrl?: string | null;
  highlightSubheadline?: string | null;
  highlights: Array<{
    highlight: string;
  }>;
  insightBody?: string | null;
  insightTitle?: string | null;
  overviewItems: Array<{
    body: string | null;
    title: string;
  }>;
  titleTail?: string | null;
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
  const slugCandidates = getLoanProgramSlugCandidates(slug);
  const programs = await getFallbackLoanPrograms();
  const program =
    slugCandidates
      .map(
        (candidateSlug) =>
          programs.find(
            (entry) =>
              entry.slug === candidateSlug ||
              entry.baseSlug === candidateSlug ||
              `seed-${entry.baseSlug}` === candidateSlug,
          ) ?? null,
      )
      .find(Boolean) ?? null;

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
    heroBadgeOne: program.heroBadgeOne ?? null,
    heroBadgeTwo: program.heroBadgeTwo ?? null,
    heroBadgeThree: program.heroBadgeThree ?? null,
    imageAlt: program.imageAlt ?? null,
    imageUrl: program.imageUrl ?? null,
    highlightImageAlt: program.highlightImageAlt ?? null,
    highlightImageUrl: program.highlightImageUrl ?? null,
    highlightSubheadline: program.highlightSubheadline ?? null,
    highlights: program.highlights,
    insightBody: program.insightBody ?? null,
    insightTitle: program.insightTitle ?? null,
    interestRate: program.interestRate ?? null,
    keyHighlights: program.keyHighlights ?? null,
    loanTerm: program.loanTerm ?? null,
    ltv: program.ltv ?? null,
    maxAmount: program.maxAmount ?? null,
    minAmount: program.minAmount ?? null,
    overviewItems: program.overviewItems,
    shortDescription: program.shortDescription ?? null,
    slug: program.slug,
    title: program.title,
    titleTail: program.titleTail ?? null,
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
    prisma.homePage.findUnique({
      where: { id: "home" },
      select: homePageSelect,
    }),
  ["public-home-page"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["home-page"],
  },
);

const getPublishedPropertiesCached = unstable_cache(
  () =>
    prisma.property.findMany({
      where: { lifecycleStatus: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: propertyListSelect,
    }),
  ["public-published-properties"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["properties"],
  },
);

const getPublishedInvestmentsCached = unstable_cache(
  () =>
    prisma.investment.findMany({
      where: { lifecycleStatus: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: investmentListSelect,
    }),
  ["public-published-investments"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["investments"],
  },
);

const getPublishedCaseStudiesCached = unstable_cache(
  () =>
    prisma.caseStudy.findMany({
      where: { lifecycleStatus: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: caseStudyListSelect,
    }),
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

    return blogPostDelegate
      .findMany({
        where: { lifecycleStatus: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: blogPostListSelect,
      })
      .catch((error) => {
        if (isBlogSchemaSyncFailure(error)) {
          warnFallbackOnce(
            "published-blog-posts",
            "blog schema is unavailable, using seed data instead.",
          );
          return fallback;
        }

        throw error;
      }) as Promise<SeedBackedBlogPostListItem[]>;
  },
  ["public-published-blog-posts"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["blogs"],
  },
);

const getPublishedCalculatorsCached = unstable_cache(
  () =>
    prisma.calculator.findMany({
      where: { lifecycleStatus: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: calculatorListSelect,
    }),
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

    return loanProgramDelegate
      .findMany({
        where: {
          isActive: true,
          lifecycleStatus: "PUBLISHED",
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        select: loanProgramListSelect,
      })
      .catch((error) => {
        if (isSchemaSyncFailure(error)) {
          warnFallbackOnce(
            "published-loan-programs",
            "loan program schema is unavailable, using seed data instead.",
          );
          return fallback;
        }

        throw error;
      }) as Promise<SeedBackedLoanProgramListItem[]>;
  },
  ["public-published-loan-programs"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["loan-programs"],
  },
);

export const getHomePage = async () =>
  withPublicFallback("home-page", null, () => getHomePageCached());

export const getSingletonPage = async (key: string) =>
  withPublicFallback(`singleton-page:${key}`, mergeSingletonPageWithSeed(null, key), () =>
    unstable_cache(
      () =>
        prisma.singletonPage.findUnique({
          where: { key: key as never },
          select: singletonPageSelect,
        }).then((page) => mergeSingletonPageWithSeed(page, key)),
      ["public-singleton-page", key],
      {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: [`singleton-page:${key}`],
      },
    )(),
  );

export const getPublishedProperties = async () =>
  withPublicFallback("published-properties", [], () => getPublishedPropertiesCached());

export const getPublishedProperty = async (slug: string) =>
  withPublicFallback(`published-property:${slug}`, null, () =>
    unstable_cache(
      async () => {
        const attempts = [
          {
            select: propertyDetailSelect,
            legacyForm: false,
            missingDetailContent: false,
            retryable: (error: unknown) =>
              isFormSchemaSyncFailure(error) || isPropertyDetailSchemaSyncFailure(error),
          },
          {
            select: propertyDetailLegacyFormSelect,
            legacyForm: true,
            missingDetailContent: false,
            retryable: (error: unknown) => isPropertyDetailSchemaSyncFailure(error),
          },
          {
            select: propertyDetailLegacyContentSelect,
            legacyForm: false,
            missingDetailContent: true,
            retryable: (error: unknown) => isFormSchemaSyncFailure(error),
          },
          {
            select: propertyDetailLegacySchemaSelect,
            legacyForm: true,
            missingDetailContent: true,
            retryable: () => false,
          },
        ] as const;

        for (const attempt of attempts) {
          try {
            const property = await prisma.property.findFirst({
              where: {
                slug,
                lifecycleStatus: "PUBLISHED",
              },
              select: attempt.select,
            });

            if (attempt.legacyForm || attempt.missingDetailContent) {
              const reasons = [
                attempt.missingDetailContent
                  ? "property detail content column is unavailable"
                  : null,
                attempt.legacyForm ? "form option metadata is unavailable" : null,
              ]
                .filter(Boolean)
                .join(" and ");

              warnFallbackOnce(`published-property:${slug}`, `${reasons}, using a compatible query.`);
            }

            return normalizePublishedPropertyRecord(property, {
              legacyForm: attempt.legacyForm,
              missingDetailContent: attempt.missingDetailContent,
            });
          } catch (error) {
            if (!attempt.retryable(error)) {
              throw error;
            }
          }
        }
      },
      ["public-published-property", slug],
      {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["properties", `property:${slug}`],
      },
    )(),
  );

export const getPublishedInvestments = async () =>
  withPublicFallback("published-investments", [], () => getPublishedInvestmentsCached());

export const getPublishedInvestment = async (slug: string) =>
  withPublicFallback(`published-investment:${slug}`, null, () =>
    unstable_cache(
      async () => {
        try {
          return await prisma.investment.findFirst({
            where: {
              slug,
              lifecycleStatus: "PUBLISHED",
            },
            select: investmentDetailSelect,
          });
        } catch (error) {
          if (!isFormSchemaSyncFailure(error)) {
            throw error;
          }

          warnFallbackOnce(
            `published-investment:${slug}`,
            "form schema is unavailable, retrying without form option metadata.",
          );

          const investment = await prisma.investment.findFirst({
            where: {
              slug,
              lifecycleStatus: "PUBLISHED",
            },
            select: investmentDetailLegacyFormSelect,
          });

          return investment
            ? {
                ...investment,
                dealPacketForm: normalizeLegacyForm(investment.dealPacketForm),
              }
            : null;
        }
      },
      ["public-published-investment", slug],
      {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["investments", `investment:${slug}`],
      },
    )(),
  );

export const getPublishedCaseStudies = async () =>
  withPublicFallback("published-case-studies", [], () => getPublishedCaseStudiesCached());

export const getPublishedBlogPosts = async (limit?: number) => {
  const fallback = getSeedBlogPostList();
  const posts = await withPublicFallback("published-blog-posts", fallback, () =>
    getPublishedBlogPostsCached(),
  );

  return typeof limit === "number" ? posts.slice(0, limit) : posts;
};

export const getPublishedCaseStudy = async (slug: string) =>
  withPublicFallback(`published-case-study:${slug}`, null, () =>
    unstable_cache(
      () =>
        prisma.caseStudy.findFirst({
          where: {
            slug,
            lifecycleStatus: "PUBLISHED",
          },
          select: caseStudyDetailSelect,
        }),
      ["public-published-case-study", slug],
      {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["case-studies", `case-study:${slug}`],
      },
    )(),
  );

export const getPublishedBlogPost = async (slug: string) =>
  withPublicFallback(`published-blog-post:${slug}`, getSeedBlogPostDetail(slug), () =>
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

      return blogPostDelegate
        .findFirst({
          where: {
            slug,
            lifecycleStatus: "PUBLISHED",
          },
          select: blogPostDetailSelect,
        })
        .catch((error) => {
          if (isBlogSchemaSyncFailure(error)) {
            warnFallbackOnce(
              `published-blog-post:${slug}`,
              "blog schema is unavailable, using seed data instead.",
            );
            return fallback;
          }

          throw error;
        }) as Promise<SeedBackedBlogPostDetailItem | null>;
      },
      ["public-published-blog-post", slug],
      {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["blogs", `blog:${slug}`],
      },
    )(),
  );

export const getPublishedCalculators = async () =>
  withPublicFallback("published-calculators", [], () => getPublishedCalculatorsCached());

export const getPublishedCalculator = async (slug: string) =>
  withPublicFallback(`published-calculator:${slug}`, null, () =>
    unstable_cache(
      () =>
        prisma.calculator.findFirst({
          where: {
            slug,
            lifecycleStatus: "PUBLISHED",
          },
          select: calculatorListSelect,
        }),
      ["public-published-calculator", slug],
      {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["calculators", `calculator:${slug}`],
      },
    )(),
  );

export const getPublishedLoanPrograms = async () =>
  withPublicFallback("published-loan-programs", await getSeedLoanProgramList(), () =>
    getPublishedLoanProgramsCached(),
  );

export const getPublishedLoanProgram = async (slug: string) =>
  withPublicFallback(`published-loan-program:${slug}`, await getSeedLoanProgramDetail(slug), () =>
    unstable_cache(
      async () => {
        const fallback = await getSeedLoanProgramDetail(slug);
        const slugCandidates = getLoanProgramSlugCandidates(slug);
        const loanProgramDelegate = getLoanProgramDelegate();

        if (!loanProgramDelegate) {
          warnFallbackOnce(
            `published-loan-program:${slug}`,
            "Prisma loanProgram delegate is unavailable, using seed data instead.",
          );
          return fallback;
        }

        try {
          return (await loanProgramDelegate.findFirst({
            where: {
              slug: {
                in: slugCandidates,
              },
              isActive: true,
              lifecycleStatus: "PUBLISHED",
            },
            orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
            select: loanProgramDetailSelect,
          })) as SeedBackedLoanProgramDetailItem | null;
        } catch (error) {
          if (isSchemaSyncFailure(error)) {
            warnFallbackOnce(
              `published-loan-program:${slug}`,
              "loan program schema is unavailable, using seed data instead.",
            );
            return fallback;
          }

          if (!isFormSchemaSyncFailure(error)) {
            throw error;
          }

          warnFallbackOnce(
            `published-loan-program:${slug}`,
            "form schema is unavailable, retrying without form option metadata.",
          );

          try {
            const program = (await loanProgramDelegate.findFirst({
              where: {
                slug: {
                  in: slugCandidates,
                },
                isActive: true,
                lifecycleStatus: "PUBLISHED",
              },
              orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
              select: loanProgramDetailLegacyFormSelect,
            })) as SeedBackedLoanProgramDetailItem | null;

            return program
              ? {
                  ...program,
                  forms: normalizeLegacyForms(program.forms),
                }
              : null;
          } catch (error) {
            if (!isSchemaSyncFailure(error)) {
              throw error;
            }

            warnFallbackOnce(
              `published-loan-program:${slug}`,
              "loan program schema is unavailable, using seed data instead.",
            );
            return fallback;
          }
        }
      },
      ["public-published-loan-program", "alias-v2", slug],
      {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["loan-programs", `loan-program:${slug}`],
      },
    )(),
  );

export const getActiveFormBySlug = async (slug: string) =>
  withPublicFallback(`active-form:${slug}`, getSeedActiveForm(slug), () =>
    unstable_cache(
      () => {
        const fallback = getSeedActiveForm(slug);

        return prisma.formDefinition
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
          });
      },
      ["public-active-form", slug],
      {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: [`form:${slug}`],
      },
    )(),
  );
