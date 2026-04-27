import { blogPostSeed, formDefinitionsSeed, loanProgramSeed } from "@/lib/content-blueprint";
import {
  getFallbackLoanProgram,
  getFallbackLoanProgramCount,
  getFallbackLoanPrograms,
  getFallbackLoanProgramsForSelect,
} from "@/lib/loan-program-fallback-store";
import { prisma } from "@/lib/prisma";
import {
  mergeSingletonPageListWithSeed,
  mergeSingletonPageWithSeed,
} from "@/lib/singleton-page-utils";

const warnedAdminFallbackLabels = new Set<string>();
const seedFallbackTimestamp = new Date("2026-01-01T00:00:00.000Z");

const isSchemaSyncFailure = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorWithMessage = error as { message?: string };
  const message = errorWithMessage.message ?? "";

  return (
    message.includes("Invalid object name") ||
    message.includes("Invalid column name") ||
    message.includes("Unknown field") ||
    message.includes("Unknown argument") ||
    message.includes("Unknown selection field") ||
    message.includes("loanProgram") ||
    message.includes("LoanProgram") ||
    message.includes("blogPost") ||
    message.includes("BlogPost") ||
    message.includes("featuredImageUrl") ||
    message.includes("featuredImageAlt") ||
    message.includes("publishedAt") ||
    message.includes("authorName") ||
    message.includes("readTime") ||
    message.includes("excerpt") ||
    message.includes("content") ||
    message.includes("linkedLoanProgram") ||
    message.includes("webhookUrl") ||
    message.includes("linkedLoanProgramId") ||
    message.includes("submissionWebhookStatus") ||
    message.includes("webhookError") ||
    message.includes("options")
  );
};

const warnAdminFallbackOnce = (label: string, reason: string) => {
  if (warnedAdminFallbackLabels.has(label)) {
    return;
  }

  warnedAdminFallbackLabels.add(label);
  console.warn(`[admin-data] ${label} fallback enabled: ${reason}`);
};

const getLoanProgramDelegate = () =>
  (prisma as unknown as {
    loanProgram?: {
      count: () => Promise<number>;
      findMany: (args: unknown) => Promise<unknown>;
      findUnique: (args: unknown) => Promise<unknown>;
    };
  }).loanProgram;

const getBlogPostDelegate = () =>
  (prisma as unknown as {
    blogPost?: {
      count: () => Promise<number>;
      findMany: (args: unknown) => Promise<unknown>;
      findUnique: (args: unknown) => Promise<unknown>;
    };
  }).blogPost;

const getSeedLoanProgramsAdmin = () =>
  [...loanProgramSeed]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((program) => ({
      ...program,
      createdAt: seedFallbackTimestamp,
      forms: formDefinitionsSeed
        .filter(
          (definition) =>
            "linkedLoanProgramSlug" in definition &&
            definition.linkedLoanProgramSlug === program.slug,
        )
        .map((definition) => ({
          formName: definition.formName,
          id: `seed-${definition.slug}`,
          isActive: true,
          slug: definition.slug,
        })),
      id: `seed-${program.slug}`,
      isSeedFallback: true,
      updatedAt: seedFallbackTimestamp,
    }));

const getSeedLoanProgramAdmin = (id: string) =>
  getSeedLoanProgramsAdmin().find(
    (program) => program.id === id || program.slug === id || `seed-${program.slug}` === id,
  ) ?? null;

const getSeedLoanProgramsForSelect = () =>
  getSeedLoanProgramsAdmin().map((program) => ({
    id: program.id,
    slug: program.slug,
    title: program.title,
  }));

const findLoanProgramFallback = (
  fallbackPrograms: Awaited<ReturnType<typeof getFallbackLoanPrograms>>,
  program: { id?: string | null; slug?: string | null },
) =>
  fallbackPrograms.find(
    (fallbackProgram) =>
      fallbackProgram.id === program.id ||
      fallbackProgram.slug === program.slug ||
      fallbackProgram.baseSlug === program.slug ||
      (fallbackProgram.baseSlug ? `seed-${fallbackProgram.baseSlug}` === program.id : false),
  ) ?? null;

const applyLoanProgramFallbackOverride = <T extends Record<string, any>>(
  program: T,
  fallbackProgram: Awaited<ReturnType<typeof getFallbackLoanProgram>>,
): T => {
  if (!fallbackProgram) {
    return program;
  }

  return {
    ...program,
    baseSlug: fallbackProgram.baseSlug,
    crmTag: fallbackProgram.crmTag ?? null,
    fees: fallbackProgram.fees ?? null,
    fullDescription: fallbackProgram.fullDescription ?? null,
    heroBadgeOne: fallbackProgram.heroBadgeOne ?? null,
    heroBadgeThree: fallbackProgram.heroBadgeThree ?? null,
    heroBadgeTwo: fallbackProgram.heroBadgeTwo ?? null,
    highlightImageAlt: fallbackProgram.highlightImageAlt ?? null,
    highlightImageUrl: fallbackProgram.highlightImageUrl ?? null,
    highlightSubheadline: fallbackProgram.highlightSubheadline ?? null,
    highlightTitle: fallbackProgram.highlightTitle ?? null,
    highlights: fallbackProgram.highlights,
    imageAlt: fallbackProgram.imageAlt ?? null,
    imageUrl: fallbackProgram.imageUrl ?? null,
    insightBody: fallbackProgram.insightBody ?? null,
    insightTitle: fallbackProgram.insightTitle ?? null,
    interestRate: fallbackProgram.interestRate ?? null,
    isActive: fallbackProgram.isActive,
    keyHighlights: fallbackProgram.keyHighlights ?? null,
    loanTerm: fallbackProgram.loanTerm ?? null,
    ltv: fallbackProgram.ltv ?? null,
    maxAmount: fallbackProgram.maxAmount ?? null,
    minAmount: fallbackProgram.minAmount ?? null,
    overviewItems: fallbackProgram.overviewItems,
    shortDescription: fallbackProgram.shortDescription ?? null,
    slug: fallbackProgram.slug,
    sortOrder: fallbackProgram.sortOrder,
    title: fallbackProgram.title,
    titleTail: fallbackProgram.titleTail ?? null,
    updatedAt: fallbackProgram.updatedAt,
  };
};

const getSeedFormsAdmin = () =>
  [...formDefinitionsSeed]
    .filter((form) => String(form.slug) !== "funding-info-request")
    .sort((left, right) => left.formName.localeCompare(right.formName))
    .map((form) => {
      const linkedLoanProgram =
        "linkedLoanProgramSlug" in form && form.linkedLoanProgramSlug
          ? loanProgramSeed.find((program) => program.slug === form.linkedLoanProgramSlug) ?? null
          : null;

      return {
        destination: form.destination,
        fields: form.fields.map((field, index) => ({
          fieldKey: field.fieldKey,
          id: `seed-${form.slug}-${field.fieldKey}`,
          label: field.label,
          options:
            "options" in field && Array.isArray(field.options) && field.options.length
              ? JSON.stringify(field.options)
              : null,
          placeholder: "placeholder" in field ? field.placeholder ?? null : null,
          required: Boolean(field.required),
          sortOrder: index,
          type: field.type,
        })),
        formName: form.formName,
        id: `seed-${form.slug}`,
        isActive: true,
        isSeedFallback: true,
        linkedLoanProgram: linkedLoanProgram
          ? {
              id: `seed-${linkedLoanProgram.slug}`,
              slug: linkedLoanProgram.slug,
              title: linkedLoanProgram.title,
            }
          : null,
        linkedLoanProgramId: linkedLoanProgram ? `seed-${linkedLoanProgram.slug}` : null,
        slug: form.slug,
        successMessage: form.successMessage,
        webhookUrl: "webhookUrl" in form ? form.webhookUrl ?? null : null,
        _count: {
          submissions: 0,
        },
      };
    });

const getSeedFormAdmin = (id: string) =>
  getSeedFormsAdmin().find(
    (form) => form.id === id || form.slug === id || `seed-${form.slug}` === id,
  ) ?? null;

const mergeFormsWithSeedFallback = (forms: any[]) => {
  const existingSlugs = new Set(forms.map((form) => String(form.slug ?? "")));
  const missingSeedForms = getSeedFormsAdmin().filter((form) => !existingSlugs.has(form.slug));

  return [...forms, ...missingSeedForms];
};

const getBlogSeedPublishedAt = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getSeedBlogPostsAdmin = () =>
  [...blogPostSeed]
    .sort((left, right) => {
      const leftTime = getBlogSeedPublishedAt(left.publishedAt)?.getTime() ?? 0;
      const rightTime = getBlogSeedPublishedAt(right.publishedAt)?.getTime() ?? 0;
      return rightTime - leftTime;
    })
    .map((post) => ({
      ...post,
      createdAt: getBlogSeedPublishedAt(post.publishedAt) ?? seedFallbackTimestamp,
      id: `seed-${post.slug}`,
      isSeedFallback: true,
      publishedAt: getBlogSeedPublishedAt(post.publishedAt),
      updatedAt: getBlogSeedPublishedAt(post.publishedAt) ?? seedFallbackTimestamp,
    }));

const getSeedBlogPostAdmin = (id: string) =>
  getSeedBlogPostsAdmin().find(
    (post) => post.id === id || post.slug === id || `seed-${post.slug}` === id,
  ) ?? null;

export const getDashboardCounts = async () => {
  const loanProgramCountPromise = async () => {
    const loanProgramDelegate = getLoanProgramDelegate();

    if (!loanProgramDelegate) {
      warnAdminFallbackOnce(
        "dashboard-loan-program-count",
        "Prisma loanProgram delegate is unavailable, using seed count instead.",
      );
      return getFallbackLoanProgramCount();
    }

    try {
      return await loanProgramDelegate.count();
    } catch (error) {
      if (isSchemaSyncFailure(error)) {
        warnAdminFallbackOnce(
          "dashboard-loan-program-count",
          "loan program schema is unavailable, using seed count instead.",
        );
        return getFallbackLoanProgramCount();
      }

      throw error;
    }
  };

  const blogCountPromise = async () => {
    const blogPostDelegate = getBlogPostDelegate();

    if (!blogPostDelegate) {
      warnAdminFallbackOnce(
        "dashboard-blog-count",
        "Prisma blogPost delegate is unavailable, using seed count instead.",
      );
      return blogPostSeed.length;
    }

    try {
      return await blogPostDelegate.count();
    } catch (error) {
      if (isSchemaSyncFailure(error)) {
        warnAdminFallbackOnce(
          "dashboard-blog-count",
          "blog schema is unavailable, using seed count instead.",
        );
        return blogPostSeed.length;
      }

      throw error;
    }
  };

  const [properties, investments, loanPrograms, caseStudies, blogs, forms, submissions] =
    await Promise.all([
      prisma.property.count(),
      prisma.investment.count(),
      loanProgramCountPromise(),
      prisma.caseStudy.count(),
      blogCountPromise(),
      prisma.formDefinition.count(),
      prisma.formSubmission.count(),
    ]);

  return { properties, investments, loanPrograms, caseStudies, blogs, forms, submissions };
};

export const getPropertiesAdmin = async () =>
  prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      images: { select: { id: true }, take: 1 },
    },
  });

export const getPropertyAdmin = async (id: string) =>
  prisma.property.findUnique({
    where: { id },
    include: {
      inquiryForm: {
        select: {
          formName: true,
          id: true,
          slug: true,
        },
      },
      highlights: { orderBy: { sortOrder: "asc" } },
      primaryImage: { include: { mediaFile: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        include: { mediaFile: true },
      },
    },
  });

export const getInvestmentsAdmin = async () =>
  prisma.investment.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      images: { select: { id: true }, take: 1 },
    },
  });

export const getInvestmentAdmin = async (id: string) =>
  prisma.investment.findUnique({
    where: { id },
    include: {
      dealPacketForm: {
        select: {
          formName: true,
          id: true,
          slug: true,
        },
      },
      highlights: { orderBy: { sortOrder: "asc" } },
      primaryImage: { include: { mediaFile: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        include: { mediaFile: true },
      },
    },
  });

export const getCaseStudiesAdmin = async () =>
  prisma.caseStudy.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      images: { select: { id: true }, take: 1 },
    },
  });

export const getCaseStudyAdmin = async (id: string) =>
  prisma.caseStudy.findUnique({
    where: { id },
    include: {
      assetProfile: { orderBy: { sortOrder: "asc" } },
      primaryImage: { include: { mediaFile: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        include: { mediaFile: true },
      },
      takeaways: { orderBy: { sortOrder: "asc" } },
    },
  });

export const getBlogPostsAdmin = async (): Promise<any[]> =>
  {
    const fallback = getSeedBlogPostsAdmin();
    const blogPostDelegate = getBlogPostDelegate();

    if (!blogPostDelegate) {
      warnAdminFallbackOnce(
        "blogs-admin",
        "Prisma blogPost delegate is unavailable, using seed data instead.",
      );
      return fallback;
    }

    try {
      return await blogPostDelegate.findMany({
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      }) as any[];
    } catch (error) {
      if (isSchemaSyncFailure(error)) {
        warnAdminFallbackOnce(
          "blogs-admin",
          "blog schema is unavailable, using seed data instead.",
        );
        return fallback;
      }

      throw error;
    }
  };

export const getBlogPostAdmin = async (id: string): Promise<any | null> =>
  {
    const fallback = getSeedBlogPostAdmin(id);
    const blogPostDelegate = getBlogPostDelegate();

    if (!blogPostDelegate) {
      warnAdminFallbackOnce(
        `blog-admin:${id}`,
        "Prisma blogPost delegate is unavailable, using seed data instead.",
      );
      return fallback;
    }

    try {
      return await blogPostDelegate.findUnique({
        where: { id },
      }) as any | null;
    } catch (error) {
      if (isSchemaSyncFailure(error)) {
        warnAdminFallbackOnce(
          `blog-admin:${id}`,
          "blog schema is unavailable, using seed data instead.",
        );
        return fallback;
      }

      throw error;
    }
  };

export const getCalculatorsAdmin = async () =>
  prisma.calculator.findMany({
    orderBy: { updatedAt: "desc" },
  });

export const getCalculatorAdmin = async (id: string) =>
  prisma.calculator.findUnique({
    where: { id },
  });

export const getLoanProgramsAdmin = async (): Promise<any[]> =>
  {
    const fallback = await getFallbackLoanPrograms();
    const loanProgramDelegate = getLoanProgramDelegate();

    if (!loanProgramDelegate) {
      warnAdminFallbackOnce(
        "loan-programs-admin",
        "Prisma loanProgram delegate is unavailable, using seed data instead.",
      );
      return fallback;
    }

    try {
      const loanPrograms = await loanProgramDelegate.findMany({
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        include: {
          forms: {
            orderBy: { updatedAt: "desc" },
            select: {
              formName: true,
              id: true,
              isActive: true,
              slug: true,
            },
          },
        },
      }) as any[];

      return loanPrograms.map((loanProgram) =>
        applyLoanProgramFallbackOverride(
          loanProgram,
          findLoanProgramFallback(fallback, loanProgram),
        ),
      );
    } catch (error) {
      if (isSchemaSyncFailure(error)) {
        warnAdminFallbackOnce(
          "loan-programs-admin",
          "loan program schema is unavailable, using seed data instead.",
        );
        return fallback;
      }

      throw error;
    }
  };

export const getLoanProgramAdmin = async (id: string): Promise<any | null> =>
  {
    const fallback = await getFallbackLoanProgram(id);
    const loanProgramDelegate = getLoanProgramDelegate();

    if (!loanProgramDelegate) {
      warnAdminFallbackOnce(
        `loan-program-admin:${id}`,
        "Prisma loanProgram delegate is unavailable, using seed data instead.",
      );
      return fallback;
    }

    try {
      const loanProgram = await loanProgramDelegate.findUnique({
        where: { id },
        include: {
          forms: {
            orderBy: { updatedAt: "desc" },
            select: {
              formName: true,
              id: true,
              isActive: true,
              slug: true,
            },
          },
          highlights: {
            orderBy: { sortOrder: "asc" },
          },
          overviewItems: {
            orderBy: { sortOrder: "asc" },
          },
        },
      }) as any | null;

      if (!loanProgram) {
        return fallback;
      }

      return applyLoanProgramFallbackOverride(
        loanProgram,
        fallback ?? (await getFallbackLoanProgram(loanProgram.slug)),
      );
    } catch (error) {
      if (isSchemaSyncFailure(error)) {
        warnAdminFallbackOnce(
          `loan-program-admin:${id}`,
          "loan program schema is unavailable, using seed data instead.",
        );
        return fallback;
      }

      throw error;
    }
  };

export const getHomePageAdmin = async () =>
  prisma.homePage.findUnique({
    where: { id: "home" },
    include: {
      metrics: { orderBy: { sortOrder: "asc" } },
      segments: { orderBy: { sortOrder: "asc" } },
      platformCards: { orderBy: { sortOrder: "asc" } },
      caseHighlights: { orderBy: { sortOrder: "asc" } },
      testimonials: { orderBy: { sortOrder: "asc" } },
    },
  });

export const getSingletonPagesAdmin = async () =>
  mergeSingletonPageListWithSeed(
    await prisma.singletonPage.findMany({
      where: {
        key: {
          not: "CAPITAL_RATES",
        },
      },
      orderBy: { routePath: "asc" },
      include: {
        items: { orderBy: [{ groupKey: "asc" }, { sortOrder: "asc" }] },
      },
    }),
  );

export const getSingletonPageAdmin = async (key: string) =>
  mergeSingletonPageWithSeed(
    await prisma.singletonPage.findUnique({
      where: { key: key as never },
      include: {
        items: { orderBy: [{ groupKey: "asc" }, { sortOrder: "asc" }] },
      },
    }),
    key,
  );

export const getFormsAdmin = async (): Promise<any[]> =>
  {
    try {
      const forms = await prisma.formDefinition.findMany({
        where: {
          slug: {
            not: "funding-info-request",
          },
        },
        orderBy: { formName: "asc" },
        include: {
          fields: { orderBy: { sortOrder: "asc" } },
          linkedLoanProgram: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      });

      return mergeFormsWithSeedFallback(forms);
    } catch (error) {
      if (!isSchemaSyncFailure(error)) {
        throw error;
      }

      warnAdminFallbackOnce(
        "forms-admin",
        "loan-program form links are unavailable, using a legacy forms query instead.",
      );

      const forms = await prisma.formDefinition.findMany({
        where: {
          slug: {
            not: "funding-info-request",
          },
        },
        orderBy: { formName: "asc" },
        select: {
          destination: true,
          formName: true,
          id: true,
          isActive: true,
          slug: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      });

      return mergeFormsWithSeedFallback(forms.map((form) => ({
        ...form,
        fields: [],
        linkedLoanProgram: null,
      })));
    }
  };

export const getFormAdmin = async (id: string): Promise<any | null> => {
  const fallback = getSeedFormAdmin(id);

  if (fallback && (id === fallback.id || id === fallback.slug || id === `seed-${fallback.slug}`)) {
    return fallback;
  }

  let form;

  try {
    form = await prisma.formDefinition.findUnique({
      where: { id },
      include: {
        fields: { orderBy: { sortOrder: "asc" } },
        linkedLoanProgram: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });
  } catch (error) {
    if (!isSchemaSyncFailure(error)) {
      throw error;
    }

    warnAdminFallbackOnce(
      `form-admin:${id}`,
      "loan-program form links are unavailable, using a legacy form query instead.",
    );

    const legacyForm = await prisma.formDefinition.findUnique({
      where: { id },
      select: {
        destination: true,
        fields: {
          orderBy: { sortOrder: "asc" },
          select: {
            fieldKey: true,
            id: true,
            label: true,
            placeholder: true,
            required: true,
            type: true,
          },
        },
        formName: true,
        id: true,
        isActive: true,
        slug: true,
        successMessage: true,
      },
    });

    form = legacyForm
      ? {
          ...legacyForm,
          fields: legacyForm.fields.map((field) => ({
            ...field,
            options: null,
          })),
          linkedLoanProgram: null,
          linkedLoanProgramId: null,
          webhookUrl: null,
        }
      : null;
  }

  const safeForm = form?.slug === "funding-info-request" ? null : form;

  return safeForm ?? fallback;
};

export const getFormSubmissionsAdmin = async (): Promise<any[]> =>
  {
    try {
      return await prisma.formSubmission.findMany({
        orderBy: { submittedAt: "desc" },
        include: {
          formDefinition: {
            select: {
              formName: true,
              id: true,
              slug: true,
            },
          },
          values: { orderBy: { sortOrder: "asc" } },
        },
      });
    } catch (error) {
      if (!isSchemaSyncFailure(error)) {
        throw error;
      }

      warnAdminFallbackOnce(
        "form-submissions-admin",
        "webhook submission fields are unavailable, using a legacy submissions query instead.",
      );

      const submissions = await prisma.formSubmission.findMany({
        orderBy: { submittedAt: "desc" },
        select: {
          emailError: true,
          formDefinition: {
            select: {
              formName: true,
              id: true,
              slug: true,
            },
          },
          id: true,
          sourcePath: true,
          submissionEmailStatus: true,
          submittedAt: true,
          submitterEmail: true,
          submitterName: true,
          values: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              label: true,
              sortOrder: true,
              value: true,
            },
          },
        },
      });

      return submissions.map((submission) => ({
        ...submission,
        submissionWebhookStatus: "SKIPPED",
        webhookError: null,
      }));
    }
  };

export const getFormsForSelect = async () =>
  prisma.formDefinition.findMany({
    orderBy: { formName: "asc" },
    select: {
      id: true,
      formName: true,
      slug: true,
    },
  });

export const getLoanProgramsForSelect = async (): Promise<
  Array<{ id: string; slug: string; title: string }>
> =>
  {
    const fallback = await getFallbackLoanProgramsForSelect();
    const loanProgramDelegate = getLoanProgramDelegate();

    if (!loanProgramDelegate) {
      warnAdminFallbackOnce(
        "loan-programs-select",
        "Prisma loanProgram delegate is unavailable, using seed loan programs instead.",
      );
      return fallback;
    }

    try {
      return await loanProgramDelegate.findMany({
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        select: {
          id: true,
          slug: true,
          title: true,
        },
      }) as Array<{ id: string; slug: string; title: string }>;
    } catch (error) {
      if (isSchemaSyncFailure(error)) {
        warnAdminFallbackOnce(
          "loan-programs-select",
          "loan program schema is unavailable, using seed loan programs instead.",
        );
        return fallback;
      }

      throw error;
    }
  };
