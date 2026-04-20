"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/authz";
import type { AdminFlash } from "@/lib/admin-flash";
import { isAzureBlobStorageUrl } from "@/lib/blob";
import { singletonPageGroups, singletonPageSeed } from "@/lib/content-blueprint";
import { parseFormFieldsEditorValue } from "@/lib/form-fields";
import {
  deleteFallbackLoanProgram,
  ensureUniqueFallbackLoanProgramSlug,
  getFallbackLoanProgram,
  upsertFallbackLoanProgram,
} from "@/lib/loan-program-fallback-store";
import { stringifyPropertyDetailContent } from "@/lib/property-detail-content";
import { getPropertyEditorStatus, propertyStatusValues } from "@/lib/property-portfolio";
import { prisma } from "@/lib/prisma";
import { asOptionalString, parseJson, slugify } from "@/lib/utils";

type UploadedImagePayload = {
  mediaFileId: string;
  blobUrl: string;
  fileName: string;
  altText?: string;
  caption?: string;
};

type HomeTestimonialInput = {
  avatarUrl?: string;
  city: string;
  name: string;
  quote: string;
};

const dedupeUploadedImages = (images: UploadedImagePayload[]) => {
  const byMediaFileId = new Map<string, UploadedImagePayload>();

  for (const image of images) {
    const existing = byMediaFileId.get(image.mediaFileId);
    byMediaFileId.set(image.mediaFileId, {
      ...existing,
      ...image,
      altText: image.altText ?? existing?.altText,
      caption: image.caption ?? existing?.caption,
    });
  }

  return Array.from(byMediaFileId.values());
};

const baseEntitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  lifecycleStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

const propertySchema = baseEntitySchema.extend({
  status: z.enum(propertyStatusValues),
  locationCity: z.string().optional(),
  locationState: z.string().optional(),
  propertyType: z.enum(["SFR", "MULTIFAMILY", "COMMERCIAL", "LAND", "OTHER"]),
  strategy: z.enum(["FIX_FLIP", "BUY_HOLD", "VALUE_ADD", "BRRRR", "OTHER"]),
  summary: z.string().min(10),
  buyerFit: z.string().optional(),
  inquiryFormId: z.string().optional(),
});

const investmentSchema = baseEntitySchema.extend({
  status: z.enum(["COMING_SOON", "OPEN", "CLOSED"]),
  assetType: z.enum(["MULTIFAMILY", "RESIDENTIAL", "MIXED_USE", "OTHER"]),
  strategy: z.enum(["VALUE_ADD", "BUY_HOLD", "DEVELOPMENT", "OTHER"]),
  summary: z.string().min(10),
  minimumInvestmentDisplay: z.string().optional(),
  returnsDisclaimer: z.string().optional(),
  dealPacketFormId: z.string().optional(),
});

const caseStudySchema = baseEntitySchema.extend({
  category: z.enum(["VALUE_ADD_MULTIFAMILY", "TURNAROUND", "FIX_FLIP", "OTHER"]),
  overview: z.string().min(10),
  businessPlan: z.string().min(10),
  execution: z.string().min(10),
  outcomeSummary: z.string().min(10),
});

const blogPostSchema = baseEntitySchema.extend({
  authorName: z.string().optional(),
  category: z.string().min(2),
  content: z.string().min(10),
  excerpt: z.string().min(10),
  featuredImageAlt: z.string().optional(),
  featuredImageUrl: z.string().optional(),
  readTime: z.string().optional(),
});

const calculatorSchema = baseEntitySchema.extend({
  calculatorType: z.enum(["ROI", "BRRRR", "MORTGAGE", "VALUE_ADD"]),
  shortDescription: z.string().optional(),
  disclaimer: z.string().min(10),
});

const loanProgramSchema = baseEntitySchema.extend({
  titleTail: z.string().nullish(),
  heroBadgeOne: z.string().nullish(),
  heroBadgeTwo: z.string().nullish(),
  heroBadgeThree: z.string().nullish(),
  shortDescription: z.string().min(10),
  fullDescription: z.string().min(10),
  interestRate: z.string().nullish(),
  ltv: z.string().nullish(),
  loanTerm: z.string().nullish(),
  fees: z.string().nullish(),
  minAmount: z.string().nullish(),
  maxAmount: z.string().nullish(),
  keyHighlights: z.string().nullish(),
  highlightSubheadline: z.string().nullish(),
  insightTitle: z.string().nullish(),
  insightBody: z.string().nullish(),
  crmTag: z.string().nullish(),
  imageUrl: z.string().nullish(),
  imageAlt: z.string().nullish(),
  highlightImageUrl: z.string().nullish(),
  highlightImageAlt: z.string().nullish(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0),
});

const formSchema = z.object({
  id: z.string().optional(),
  formName: z.string().min(2),
  slug: z.string().min(2),
  destination: z.enum(["EMAIL", "CRM", "BOTH"]),
  successMessage: z.string().min(5),
  webhookUrl: z.string().optional(),
  linkedLoanProgramId: z.string().optional(),
  isActive: z.boolean(),
});

const parseSimpleLines = (value: string | undefined) =>
  (value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const parsePipeRows = (value: string | undefined) =>
  parseSimpleLines(value).map((line) => line.split("|").map((segment) => segment.trim()));
const serializeSimpleLines = (values: string[]) => (values.length ? values.join("\n") : null);
const normalizeLoanProgramOverviewItems = (rows: string[][]) =>
  rows
    .filter((row) => row[0])
    .map((row) => ({
      body: row[1] || null,
      title: row[0],
    }));

const parsePropertyStandoutRows = (value: string | undefined) =>
  parsePipeRows(value)
    .map((row) => ({
      description: row.slice(1).join(" | ").trim(),
      title: row[0]?.trim() ?? "",
    }))
    .filter((item) => item.title && item.description)
    .slice(0, 4);

const buildPropertyDetailContent = (formData: FormData) =>
  stringifyPropertyDetailContent({
    googleMapsUrl: asOptionalString(formData.get("googleMapsUrl")),
    investorProfile: parseSimpleLines(asOptionalString(formData.get("investorProfileText"))),
    locationBenefits: parseSimpleLines(asOptionalString(formData.get("locationBenefitsText"))),
    performance: {
      capRate: asOptionalString(formData.get("performanceCapRate")),
      investmentHorizon: asOptionalString(formData.get("performanceInvestmentHorizon")),
      monthlyCashFlow: asOptionalString(formData.get("performanceMonthlyCashFlow")),
      roi: asOptionalString(formData.get("performanceRoi")),
    },
    snapshot: {
      arv: asOptionalString(formData.get("snapshotArv")),
      estimatedRent: asOptionalString(formData.get("snapshotEstimatedRent")),
      purchasePrice: asOptionalString(formData.get("snapshotPurchasePrice")),
      renovationCost: asOptionalString(formData.get("snapshotRenovationCost")),
    },
    standoutItems: parsePropertyStandoutRows(asOptionalString(formData.get("standoutItemsText"))),
  });

const parseOptionalDateValue = (value: string | null | undefined) => {
  const trimmedValue = String(value ?? "").trim();

  if (!trimmedValue) {
    return undefined;
  }

  const parsedDate = new Date(trimmedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const parseSingletonPageGroupRows = (
  group: { supportsBody?: boolean },
  value: string | undefined,
) => {
  if (!group.supportsBody) {
    return parseSimpleLines(value).map((title) => ({ body: undefined, title }));
  }

  return parsePipeRows(value)
    .map((row) => ({
      body: row[1]?.trim() || undefined,
      title: row[0]?.trim() ?? "",
    }))
    .filter((row) => row.title);
};

const getSingletonPageSeedRecord = (key: string) =>
  singletonPageSeed.find((page) => page.key === key) ?? null;

const getOrCreateSingletonPageRecord = async (key: string) => {
  const existingPage = await prisma.singletonPage.findUnique({
    where: { key: key as never },
    select: { id: true, routePath: true, updatedAt: true },
  });

  if (existingPage) {
    return existingPage;
  }

  const seedPage = getSingletonPageSeedRecord(key);

  if (!seedPage) {
    return null;
  }

  const createdPage = await prisma.singletonPage.create({
    data: {
      key: seedPage.key,
      routePath: seedPage.routePath,
      pageTitle: seedPage.pageTitle,
      intro: seedPage.intro,
      disclaimer: seedPage.disclaimer,
      ctaLabel: seedPage.ctaLabel,
      ctaHref: seedPage.ctaHref,
      lifecycleStatus: "PUBLISHED",
    },
    select: { id: true, routePath: true, updatedAt: true },
  });

  if (seedPage.items.length) {
    await prisma.singletonPageItem.createMany({
      data: seedPage.items.map((item, index) => ({
        pageId: createdPage.id,
        groupKey: item.groupKey,
        title: item.title,
        body: item.body ?? null,
        ctaLabel: item.ctaLabel ?? null,
        ctaHref: item.ctaHref ?? null,
        sortOrder: index,
      })),
    });
  }

  return createdPage;
};

const parseImages = (formData: FormData) =>
  parseJson<UploadedImagePayload[]>(formData.get("imagesPayload"), []);

const parseHomeTestimonials = (formData: FormData): HomeTestimonialInput[] => {
  const testimonialsJson = asOptionalString(formData.get("testimonialsJson"));

  if (testimonialsJson) {
    return parseJson<Array<Partial<HomeTestimonialInput>>>(testimonialsJson, []).map(
      (testimonial) => ({
        avatarUrl: String(testimonial.avatarUrl ?? "").trim() || undefined,
        city: String(testimonial.city ?? "").trim(),
        name: String(testimonial.name ?? "").trim(),
        quote: String(testimonial.quote ?? "").trim(),
      }),
    );
  }

  return parsePipeRows(asOptionalString(formData.get("testimonialsText"))).map((row) => ({
    avatarUrl: row[3]?.trim() || undefined,
    city: row[1]?.trim() ?? "",
    name: row[0]?.trim() ?? "",
    quote: row[2]?.trim() ?? "",
  }));
};

const createHomeTestimonialRecords = (testimonials: HomeTestimonialInput[]) =>
  testimonials
    .filter((testimonial) => testimonial.name && testimonial.city && testimonial.quote)
    .map((testimonial, index) => ({
      homePageId: "home",
      name: testimonial.name,
      city: testimonial.city,
      quote: testimonial.quote,
      avatarUrl: testimonial.avatarUrl || undefined,
      sortOrder: index,
    }));

const getHomePageManagedImageError = ({
  aboutSectionImageUrl,
  testimonials,
}: {
  aboutSectionImageUrl?: string;
  testimonials: HomeTestimonialInput[];
}) => {
  if (aboutSectionImageUrl && !isAzureBlobStorageUrl(aboutSectionImageUrl)) {
    return "Why section image must use Azure Blob Storage. Upload the image from the admin portal.";
  }

  const invalidTestimonialIndex = testimonials.findIndex(
    (testimonial) => testimonial.avatarUrl && !isAzureBlobStorageUrl(testimonial.avatarUrl),
  );

  if (invalidTestimonialIndex >= 0) {
    return `Testimonial ${invalidTestimonialIndex + 1} photo must use Azure Blob Storage. Upload the photo from the admin portal.`;
  }

  return null;
};

const parsePrimaryMediaFileId = (formData: FormData) =>
  asOptionalString(formData.get("primaryMediaFileId"));

const getSubmittedId = async (formData: FormData, section?: string) => {
  const submittedId =
    asOptionalString(formData.get("recordId")) ?? asOptionalString(formData.get("id"));

  if (submittedId || !section) {
    return submittedId;
  }

  const referer = (await headers()).get("referer");
  if (!referer) {
    return undefined;
  }

  try {
    const pathname = new URL(referer).pathname;
    const match = pathname.match(new RegExp(`^/admin/${section}/([^/]+)$`));
    const fallbackId = match?.[1];
    return fallbackId && fallbackId !== "new" ? fallbackId : undefined;
  } catch {
    return undefined;
  }
};

const formatFieldLabel = (path: ReadonlyArray<PropertyKey>) =>
  path
    .map((segment) =>
      String(segment)
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const getValidationMessage = (error: z.ZodError) => {
  const issue = error.issues[0];
  if (!issue) {
    return "Please review the form fields and try again.";
  }

  const label = issue.path.length ? formatFieldLabel(issue.path) : "Form";
  return `${label}: ${issue.message}`;
};

const redirectWithValidationError = async (
  path: string,
  error: z.ZodError,
): Promise<never> => {
  return redirectWithErrorMessage(path, getValidationMessage(error), "Validation error");
};

const setAdminFlash = async (flash: AdminFlash) => {
  (await cookies()).set(
    "pv-admin-flash",
    encodeURIComponent(JSON.stringify(flash)),
    {
      path: "/admin",
      sameSite: "lax",
      maxAge: 60,
    },
  );
};

const redirectWithErrorMessage = async (
  path: string,
  message: string,
  title = "Action failed",
): Promise<never> => {
  await setAdminFlash({ type: "error", title, message });

  const params = new URLSearchParams({
    error: message,
  });

  redirect(`${path}?${params.toString()}`);
};

const redirectWithSuccessMessage = async (
  path: string,
  message: string,
  options?: {
    title?: AdminFlash["title"];
    type?: AdminFlash["type"];
  },
): Promise<never> => {
  await setAdminFlash({
    type: options?.type ?? "success",
    title: options?.title,
    message,
  });
  redirect(path);
};

const getLifecycleFlash = ({
  entityLabel,
  lifecycleStatus,
  isNew,
}: {
  entityLabel: string;
  lifecycleStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isNew: boolean;
}): AdminFlash => {
  if (lifecycleStatus === "PUBLISHED") {
    return {
      type: "success",
      title: `${entityLabel} published`,
      message: `${entityLabel} published successfully.`,
    };
  }

  if (lifecycleStatus === "ARCHIVED") {
    return {
      type: "info",
      title: `${entityLabel} archived`,
      message: `${entityLabel} archived successfully.`,
    };
  }

  return isNew
    ? {
        type: "success",
        title: `${entityLabel} created`,
        message: `${entityLabel} draft created successfully.`,
      }
    : {
        type: "info",
        title: `${entityLabel} updated`,
        message: `${entityLabel} draft updated successfully.`,
      };
};

const handleWriteError = async (
  error: unknown,
  path: string,
  entityLabel: string,
): Promise<never> => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const metaText = JSON.stringify(error.meta ?? {}).toLowerCase();

      if (metaText.includes("slug")) {
        return redirectWithErrorMessage(
          path,
          `${entityLabel} slug is already in use. Choose a different slug.`,
          "Duplicate slug",
        );
      }

      if (
        metaText.includes("propertyimage") ||
        metaText.includes("investmentimage") ||
        metaText.includes("casestudyimage") ||
        metaText.includes("mediafileid")
      ) {
        return redirectWithErrorMessage(
          path,
          `One or more uploaded images were duplicated. Remove the duplicate image and try again.`,
          "Duplicate image",
        );
      }

      if (metaText.includes("primaryimageid")) {
        return redirectWithErrorMessage(
          path,
          `${entityLabel} could not be saved because the primary image relation is conflicting. Try saving again after refreshing the page.`,
          `${entityLabel} save failed`,
        );
      }

      return redirectWithErrorMessage(
        path,
        `${entityLabel} could not be saved because a unique field already exists. Review the slug and uploaded images, then try again.`,
        `${entityLabel} save failed`,
      );
    }

    if (error.code === "P2025") {
      return redirectWithErrorMessage(
        path,
        `${entityLabel} could not be found. Refresh the page and try again.`,
        `${entityLabel} not found`,
      );
    }
  }

  throw error;
};

const getBlogPostDelegate = () =>
  (prisma as unknown as {
    blogPost?: {
      create: (args: unknown) => Promise<any>;
      delete: (args: unknown) => Promise<any>;
      findUnique: (args: unknown) => Promise<any>;
      update: (args: unknown) => Promise<any>;
    };
  }).blogPost;

const isBlogSchemaCompatibilityError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

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

const redirectWithBlogMigrationError = async (path: string): Promise<never> =>
  redirectWithErrorMessage(
    path,
    "Blog posts need the latest database migration applied and the dev server restarted before they can be edited from the CMS.",
    "Migration required",
  );

const isFormSchemaCompatibilityError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  return (
    message.includes("Unknown field `linkedLoanProgram`") ||
    message.includes("Unknown argument `linkedLoanProgramId`") ||
    message.includes("Unknown argument `webhookUrl`") ||
    message.includes("Unknown argument `options`") ||
    message.includes("Unknown field `options`") ||
    message.includes("Unknown field `submissionWebhookStatus`") ||
    message.includes("Unknown field `webhookError`") ||
    message.includes("Invalid column name 'linkedLoanProgramId'") ||
    message.includes("Invalid column name 'webhookUrl'") ||
    message.includes("Invalid column name 'options'")
  );
};

const isLoanProgramSchemaCompatibilityError = (error: unknown) => {
  // Never treat a plain JS TypeError as a schema compatibility error
  if (error instanceof TypeError) {
    return false;
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  return (
    message.includes("Invalid object name") ||
    message.includes("Unknown field") ||
    message.includes("Unknown argument") ||
    message.includes("Unknown selection field") ||
    message.includes("loanProgram") ||
    message.includes("LoanProgram")
  );
};

const getExistingLoanProgramContext = async (id: string) => {
  try {
    return await prisma.loanProgram.findUnique({
      where: { id },
      select: {
        crmTag: true,
        fees: true,
        fullDescription: true,
        id: true,
        imageAlt: true,
        imageUrl: true,
        highlightImageUrl: true,
        highlightImageAlt: true,
        interestRate: true,
        isActive: true,
        keyHighlights: true,
        lifecycleStatus: true,
        loanTerm: true,
        ltv: true,
        maxAmount: true,
        minAmount: true,
        shortDescription: true,
        slug: true,
        sortOrder: true,
        title: true,
        titleTail: true,
        heroBadgeOne: true,
        heroBadgeTwo: true,
        heroBadgeThree: true,
        highlightSubheadline: true,
        insightTitle: true,
        insightBody: true,
        highlights: {
          orderBy: { sortOrder: "asc" },
          select: { highlight: true },
        },
        overviewItems: {
          orderBy: { sortOrder: "asc" },
          select: { title: true, body: true },
        },
      },
    });
  } catch (error) {
    if (!isLoanProgramSchemaCompatibilityError(error)) {
      throw error;
    }

    return getFallbackLoanProgram(id);
  }
};

const ensureLoanProgramSlug = async ({
  baseSlug,
  currentId,
}: {
  baseSlug: string;
  currentId?: string;
}) => {
  try {
    return await ensureUniqueSlug({
      baseSlug,
      currentId,
      fallback: "loan-program",
      findBySlug: (slug) =>
        prisma.loanProgram.findUnique({
          where: { slug },
          select: { id: true },
        }),
    });
  } catch (error) {
    if (!isLoanProgramSchemaCompatibilityError(error)) {
      throw error;
    }

    return ensureUniqueFallbackLoanProgramSlug({ baseSlug, currentId });
  }
};

const getExistingFormRelationContext = async (
  id: string,
): Promise<{
  slug: string;
  linkedLoanProgram?: {
    slug: string;
  } | null;
} | null> => {
  try {
    return await prisma.formDefinition.findUnique({
      where: { id },
      select: {
        linkedLoanProgram: {
          select: {
            slug: true,
          },
        },
        slug: true,
      },
    });
  } catch (error) {
    if (!isFormSchemaCompatibilityError(error)) {
      throw error;
    }

    return prisma.formDefinition.findUnique({
      where: { id },
      select: {
        slug: true,
      },
    });
  }
};

const persistFormDefinitionRecord = async ({
  id,
  destination,
  formName,
  isActive,
  linkedLoanProgramId,
  slug,
  successMessage,
  webhookUrl,
}: {
  id?: string;
  destination: string;
  formName: string;
  isActive: boolean;
  linkedLoanProgramId?: string;
  slug: string;
  successMessage: string;
  webhookUrl?: string;
}) => {
  try {
    const savedForm = id
      ? await prisma.formDefinition.update({
          where: { id },
          data: {
            formName,
            slug,
            destination,
            successMessage,
            webhookUrl,
            linkedLoanProgramId,
            isActive,
          },
          include: {
            linkedLoanProgram: {
              select: {
                slug: true,
              },
            },
          },
        })
      : await prisma.formDefinition.create({
          data: {
            formName,
            slug,
            destination,
            successMessage,
            webhookUrl,
            linkedLoanProgramId,
            isActive,
          },
          include: {
            linkedLoanProgram: {
              select: {
                slug: true,
              },
            },
          },
        });

    return {
      savedForm,
      supportsFinancingLinks: true,
    };
  } catch (error) {
    if (!isFormSchemaCompatibilityError(error)) {
      throw error;
    }

    const savedForm = id
      ? await prisma.formDefinition.update({
          where: { id },
          data: {
            formName,
            slug,
            destination,
            successMessage,
            isActive,
          },
        })
      : await prisma.formDefinition.create({
          data: {
            formName,
            slug,
            destination,
            successMessage,
            isActive,
          },
        });

    return {
      savedForm: {
        ...savedForm,
        linkedLoanProgram: null,
      },
      supportsFinancingLinks: false,
    };
  }
};

const replaceFormDefinitionFields = async (
  formDefinitionId: string,
  fields: ReturnType<typeof parseFormFieldsEditorValue>,
) => {
  await prisma.formField.deleteMany({ where: { formDefinitionId } });

  if (!fields.length) {
    return;
  }

  try {
    await prisma.formField.createMany({
      data: fields.map((field, index) => ({
        formDefinitionId,
        fieldKey: field.fieldKey,
        label: field.label,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder,
        options: field.options?.length ? JSON.stringify(field.options) : undefined,
        sortOrder: index,
      })),
    });
  } catch (error) {
    if (!isFormSchemaCompatibilityError(error)) {
      throw error;
    }

    await prisma.formField.createMany({
      data: fields.map((field, index) => ({
        formDefinitionId,
        fieldKey: field.fieldKey,
        label: field.label,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder,
        sortOrder: index,
      })),
    });
  }
};

const ensureUniqueSlug = async ({
  baseSlug,
  currentId,
  fallback,
  findBySlug,
}: {
  baseSlug: string;
  currentId?: string;
  fallback: string;
  findBySlug: (slug: string) => Promise<{ id: string } | null>;
}) => {
  const normalizedBase = slugify(baseSlug) || fallback;
  let candidate = normalizedBase;
  let suffix = 2;

  while (true) {
    const existing = await findBySlug(candidate);
    if (!existing || existing.id === currentId) {
      return candidate;
    }

    candidate = `${normalizedBase}-${suffix}`;
    suffix += 1;
  }
};

const createAutosaveSlug = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const getAutosaveTitle = ({
  existingTitle,
  fallback,
  rawTitle,
}: {
  existingTitle?: string | null;
  fallback: string;
  rawTitle: string;
}) => rawTitle || existingTitle || fallback;

const getAutosavePath = (basePath: string, id: string) => `${basePath}/${id}`;
const TAG_REVALIDATE_PROFILE = "max";

const revalidatePropertyCaches = (slug?: string | null) => {
  revalidateTag("properties", TAG_REVALIDATE_PROFILE);
  if (slug) {
    revalidateTag(`property:${slug}`, TAG_REVALIDATE_PROFILE);
  }
};

const revalidateInvestmentCaches = (slug?: string | null) => {
  revalidateTag("investments", TAG_REVALIDATE_PROFILE);
  if (slug) {
    revalidateTag(`investment:${slug}`, TAG_REVALIDATE_PROFILE);
  }
};

const revalidateCaseStudyCaches = (slug?: string | null) => {
  revalidateTag("case-studies", TAG_REVALIDATE_PROFILE);
  if (slug) {
    revalidateTag(`case-study:${slug}`, TAG_REVALIDATE_PROFILE);
  }
};

const revalidateBlogCaches = (slug?: string | null) => {
  revalidateTag("blogs", TAG_REVALIDATE_PROFILE);
  if (slug) {
    revalidateTag(`blog:${slug}`, TAG_REVALIDATE_PROFILE);
  }
};

const revalidateLoanProgramCaches = (slug?: string | null) => {
  revalidateTag("loan-programs", TAG_REVALIDATE_PROFILE);
  if (slug) {
    revalidateTag(`loan-program:${slug}`, TAG_REVALIDATE_PROFILE);
  }
};

const revalidateSingletonPageCache = (key: string) => {
  revalidateTag(`singleton-page:${key}`, TAG_REVALIDATE_PROFILE);
};

const revalidateFormCache = (slug?: string | null) => {
  if (slug) {
    revalidateTag(`form:${slug}`, TAG_REVALIDATE_PROFILE);
  }
};

const intentToLifecycleStatus = (formData: FormData) => {
  const intent = formData.get("intent");
  if (intent === "publish") {
    return "PUBLISHED";
  }
  if (intent === "archive") {
    return "ARCHIVED";
  }
  return "DRAFT";
};

const upsertPropertyImages = async (
  propertyId: string,
  images: UploadedImagePayload[],
  primaryMediaFileId?: string,
) => {
  await prisma.property.update({
    where: { id: propertyId },
    data: { primaryImageId: null },
  });

  await prisma.propertyImage.deleteMany({ where: { propertyId } });

  for (const [index, image] of images.entries()) {
    await prisma.mediaFile.update({
      where: { id: image.mediaFileId },
      data: {
        altText: image.altText,
      },
    });

    await prisma.propertyImage.create({
      data: {
        propertyId,
        mediaFileId: image.mediaFileId,
        altText: image.altText,
        caption: image.caption,
        sortOrder: index,
      },
    });
  }

  if (!images.length) {
    return;
  }

  const chosenMediaFileId = primaryMediaFileId ?? images[0]?.mediaFileId;
  const relation = await prisma.propertyImage.findFirst({
    where: {
      propertyId,
      mediaFileId: chosenMediaFileId,
    },
  });

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      primaryImageId: relation?.id ?? null,
    },
  });
};

const upsertInvestmentImages = async (
  investmentId: string,
  images: UploadedImagePayload[],
  primaryMediaFileId?: string,
) => {
  await prisma.investment.update({
    where: { id: investmentId },
    data: { primaryImageId: null },
  });

  await prisma.investmentImage.deleteMany({ where: { investmentId } });

  for (const [index, image] of images.entries()) {
    await prisma.mediaFile.update({
      where: { id: image.mediaFileId },
      data: {
        altText: image.altText,
      },
    });

    await prisma.investmentImage.create({
      data: {
        investmentId,
        mediaFileId: image.mediaFileId,
        altText: image.altText,
        caption: image.caption,
        sortOrder: index,
      },
    });
  }

  if (!images.length) {
    return;
  }

  const chosenMediaFileId = primaryMediaFileId ?? images[0]?.mediaFileId;
  const relation = await prisma.investmentImage.findFirst({
    where: {
      investmentId,
      mediaFileId: chosenMediaFileId,
    },
  });

  await prisma.investment.update({
    where: { id: investmentId },
    data: {
      primaryImageId: relation?.id ?? null,
    },
  });
};

const upsertCaseStudyImages = async (
  caseStudyId: string,
  images: UploadedImagePayload[],
  primaryMediaFileId?: string,
) => {
  await prisma.caseStudy.update({
    where: { id: caseStudyId },
    data: { primaryImageId: null },
  });

  await prisma.caseStudyImage.deleteMany({ where: { caseStudyId } });

  for (const [index, image] of images.entries()) {
    await prisma.mediaFile.update({
      where: { id: image.mediaFileId },
      data: {
        altText: image.altText,
      },
    });

    await prisma.caseStudyImage.create({
      data: {
        caseStudyId,
        mediaFileId: image.mediaFileId,
        altText: image.altText,
        caption: image.caption,
        sortOrder: index,
      },
    });
  }

  if (!images.length) {
    return;
  }

  const chosenMediaFileId = primaryMediaFileId ?? images[0]?.mediaFileId;
  const relation = await prisma.caseStudyImage.findFirst({
    where: {
      caseStudyId,
      mediaFileId: chosenMediaFileId,
    },
  });

  await prisma.caseStudy.update({
    where: { id: caseStudyId },
    data: {
      primaryImageId: relation?.id ?? null,
    },
  });
};

export const saveProperty = async (formData: FormData) => {
  await requireAdminSession();

  const submittedId = await getSubmittedId(formData, "properties");
  const existingProperty = submittedId
    ? await prisma.property.findUnique({
        where: { id: submittedId },
        select: { slug: true },
      })
    : null;
  const rawTitle = String(formData.get("title") ?? "").trim();
  const matchingDraft = !submittedId && rawTitle
    ? await prisma.property.findFirst({
        where: {
          title: rawTitle,
          lifecycleStatus: "DRAFT",
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
        },
      })
    : null;
  const id = submittedId ?? matchingDraft?.id;
  const editPath = id ? `/admin/properties/${id}` : "/admin/properties/new";
  const parsed = propertySchema.safeParse({
    id,
    title: rawTitle,
    slug: slugify(String(formData.get("slug") ?? formData.get("title") ?? "")),
    lifecycleStatus: intentToLifecycleStatus(formData),
    status: getPropertyEditorStatus(asOptionalString(formData.get("status"))),
    locationCity: asOptionalString(formData.get("locationCity")),
    locationState: asOptionalString(formData.get("locationState")),
    propertyType: String(formData.get("propertyType") ?? ""),
    strategy: String(formData.get("strategy") ?? ""),
    summary: String(formData.get("summary") ?? "").trim(),
    buyerFit: asOptionalString(formData.get("buyerFit")),
    inquiryFormId: asOptionalString(formData.get("inquiryFormId")),
  });

  if (!parsed.success) {
    await redirectWithValidationError(editPath, parsed.error);
  }

  const propertyData = {
    ...parsed.data,
    detailContent: buildPropertyDetailContent(formData),
    slug: await ensureUniqueSlug({
      baseSlug: parsed.data.slug,
      currentId: parsed.data.id,
      fallback: "property",
      findBySlug: (slug) =>
        prisma.property.findUnique({
          where: { slug },
          select: { id: true },
        }),
    }),
  };

  const highlights = parseSimpleLines(asOptionalString(formData.get("highlightsText")));
  const images = dedupeUploadedImages(parseImages(formData));
  const primaryMediaFileId = parsePrimaryMediaFileId(formData);

  let property;

  try {
    property = propertyData.id
      ? await prisma.property.update({
          where: { id: propertyData.id },
          data: {
            title: propertyData.title,
            slug: propertyData.slug,
            lifecycleStatus: propertyData.lifecycleStatus,
            status: propertyData.status,
            locationCity: propertyData.locationCity,
            locationState: propertyData.locationState,
            propertyType: propertyData.propertyType,
            strategy: propertyData.strategy,
            summary: propertyData.summary,
            buyerFit: propertyData.buyerFit,
            detailContent: propertyData.detailContent,
            inquiryFormId: propertyData.inquiryFormId,
          },
        })
      : await prisma.property.create({
          data: {
            title: propertyData.title,
            slug: propertyData.slug,
            lifecycleStatus: propertyData.lifecycleStatus,
            status: propertyData.status,
            locationCity: propertyData.locationCity,
            locationState: propertyData.locationState,
            propertyType: propertyData.propertyType,
            strategy: propertyData.strategy,
            summary: propertyData.summary,
            buyerFit: propertyData.buyerFit,
            detailContent: propertyData.detailContent,
            inquiryFormId: propertyData.inquiryFormId,
          },
        });

    await prisma.propertyHighlight.deleteMany({ where: { propertyId: property.id } });
    if (highlights.length) {
      await prisma.propertyHighlight.createMany({
        data: highlights.map((highlight, index) => ({
          propertyId: property.id,
          highlight,
          sortOrder: index,
        })),
      });
    }

    await upsertPropertyImages(property.id, images, primaryMediaFileId);
  } catch (error) {
    await handleWriteError(
      error,
      property?.id ? `/admin/properties/${property.id}` : editPath,
      "Property",
    );
  }

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${property.id}`);
  revalidatePath("/properties");
  revalidatePath(`/properties/${property.slug}`);
  if (existingProperty?.slug && existingProperty.slug !== property.slug) {
    revalidatePath(`/properties/${existingProperty.slug}`);
    revalidatePropertyCaches(existingProperty.slug);
  }
  revalidatePath("/");
  revalidatePropertyCaches(property.slug);
  const propertyFlash = getLifecycleFlash({
    entityLabel: "Property",
    lifecycleStatus: propertyData.lifecycleStatus,
    isNew: !propertyData.id,
  });
  const propertyRedirectPath =
    propertyData.lifecycleStatus === "PUBLISHED"
      ? "/admin/properties"
      : `/admin/properties/${property.id}`;
  await redirectWithSuccessMessage(
    propertyRedirectPath,
    propertyFlash.message,
    propertyFlash,
  );
};

export const deleteProperty = async (formData: FormData) => {
  await requireAdminSession();
  const id = await getSubmittedId(formData, "properties");
  if (!id) {
    return;
  }

  const existing = await prisma.property.findUnique({ where: { id } });
  await prisma.property.delete({ where: { id } });

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  if (existing?.slug) {
    revalidatePath(`/properties/${existing.slug}`);
  }
  revalidatePropertyCaches(existing?.slug);
  await redirectWithSuccessMessage("/admin/properties", "Property deleted successfully.", {
    title: "Property deleted",
  });
};

export const saveInvestment = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "investments");
  const existingInvestment = id
    ? await prisma.investment.findUnique({
        where: { id },
        select: { slug: true },
      })
    : null;
  const editPath = id ? `/admin/investments/${id}` : "/admin/investments/new";
  const parsed = investmentSchema.safeParse({
    id,
    title: String(formData.get("title") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? formData.get("title") ?? "")),
    lifecycleStatus: intentToLifecycleStatus(formData),
    status: String(formData.get("status") ?? ""),
    assetType: String(formData.get("assetType") ?? ""),
    strategy: String(formData.get("strategy") ?? ""),
    summary: String(formData.get("summary") ?? "").trim(),
    minimumInvestmentDisplay: asOptionalString(formData.get("minimumInvestmentDisplay")),
    returnsDisclaimer: asOptionalString(formData.get("returnsDisclaimer")),
    dealPacketFormId: asOptionalString(formData.get("dealPacketFormId")),
  });

  if (!parsed.success) {
    await redirectWithValidationError(editPath, parsed.error);
  }

  const investmentData = {
    ...parsed.data,
    slug: await ensureUniqueSlug({
      baseSlug: parsed.data.slug,
      currentId: parsed.data.id,
      fallback: "investment",
      findBySlug: (slug) =>
        prisma.investment.findUnique({
          where: { slug },
          select: { id: true },
        }),
    }),
  };

  const highlights = parseSimpleLines(asOptionalString(formData.get("highlightsText")));
  const images = dedupeUploadedImages(parseImages(formData));
  const primaryMediaFileId = parsePrimaryMediaFileId(formData);

  let investment;

  try {
    investment = investmentData.id
      ? await prisma.investment.update({
          where: { id: investmentData.id },
          data: {
            title: investmentData.title,
            slug: investmentData.slug,
            lifecycleStatus: investmentData.lifecycleStatus,
            status: investmentData.status,
            assetType: investmentData.assetType,
            strategy: investmentData.strategy,
            summary: investmentData.summary,
            minimumInvestmentDisplay: investmentData.minimumInvestmentDisplay,
            returnsDisclaimer: investmentData.returnsDisclaimer,
            dealPacketFormId: investmentData.dealPacketFormId,
          },
        })
      : await prisma.investment.create({
          data: {
            title: investmentData.title,
            slug: investmentData.slug,
            lifecycleStatus: investmentData.lifecycleStatus,
            status: investmentData.status,
            assetType: investmentData.assetType,
            strategy: investmentData.strategy,
            summary: investmentData.summary,
            minimumInvestmentDisplay: investmentData.minimumInvestmentDisplay,
            returnsDisclaimer: investmentData.returnsDisclaimer,
            dealPacketFormId: investmentData.dealPacketFormId,
          },
        });

    await prisma.investmentHighlight.deleteMany({ where: { investmentId: investment.id } });
    if (highlights.length) {
      await prisma.investmentHighlight.createMany({
        data: highlights.map((highlight, index) => ({
          investmentId: investment.id,
          highlight,
          sortOrder: index,
        })),
      });
    }

    await upsertInvestmentImages(investment.id, images, primaryMediaFileId);
  } catch (error) {
    await handleWriteError(
      error,
      investment?.id ? `/admin/investments/${investment.id}` : editPath,
      "Investment",
    );
  }

  revalidatePath("/admin/investments");
  revalidatePath(`/admin/investments/${investment.id}`);
  revalidatePath("/investments");
  revalidatePath(`/investments/${investment.slug}`);
  if (existingInvestment?.slug && existingInvestment.slug !== investment.slug) {
    revalidatePath(`/investments/${existingInvestment.slug}`);
    revalidateInvestmentCaches(existingInvestment.slug);
  }
  revalidatePath("/");
  revalidateInvestmentCaches(investment.slug);
  const investmentFlash = getLifecycleFlash({
    entityLabel: "Investment",
    lifecycleStatus: investmentData.lifecycleStatus,
    isNew: !investmentData.id,
  });
  await redirectWithSuccessMessage(
    `/admin/investments/${investment.id}`,
    investmentFlash.message,
    investmentFlash,
  );
};

export const deleteInvestment = async (formData: FormData) => {
  await requireAdminSession();
  const id = await getSubmittedId(formData, "investments");
  if (!id) {
    return;
  }

  const existing = await prisma.investment.findUnique({ where: { id } });
  await prisma.investment.delete({ where: { id } });

  revalidatePath("/admin/investments");
  revalidatePath("/investments");
  if (existing?.slug) {
    revalidatePath(`/investments/${existing.slug}`);
  }
  revalidateInvestmentCaches(existing?.slug);
  await redirectWithSuccessMessage("/admin/investments", "Investment deleted successfully.", {
    title: "Investment deleted",
  });
};

export const saveLoanProgram = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "loan-programs");
  const existingLoanProgram = id ? await getExistingLoanProgramContext(id) : null;
  const existingLoanProgramBaseSlug =
    existingLoanProgram && "baseSlug" in existingLoanProgram
      ? existingLoanProgram.baseSlug
      : existingLoanProgram?.slug ?? null;
  const editPath = id ? `/admin/loan-programs/${id}` : "/admin/loan-programs/new";
  const highlights = parseSimpleLines(asOptionalString(formData.get("highlightsText")));
  const overviewItems = normalizeLoanProgramOverviewItems(
    parsePipeRows(asOptionalString(formData.get("overviewItemsText"))),
  );
  const serializedHighlights = serializeSimpleLines(highlights);
  const parsed = loanProgramSchema.safeParse({
    id,
    title: String(formData.get("title") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? formData.get("title") ?? "")),
    lifecycleStatus: intentToLifecycleStatus(formData),
    titleTail: asOptionalString(formData.get("titleTail")),
    heroBadgeOne: asOptionalString(formData.get("heroBadgeOne")),
    heroBadgeTwo: asOptionalString(formData.get("heroBadgeTwo")),
    heroBadgeThree: asOptionalString(formData.get("heroBadgeThree")),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    fullDescription: String(formData.get("fullDescription") ?? "").trim(),
    interestRate: asOptionalString(formData.get("interestRate")),
    ltv: asOptionalString(formData.get("ltv")),
    loanTerm: asOptionalString(formData.get("loanTerm")),
    fees: asOptionalString(formData.get("fees")),
    minAmount: asOptionalString(formData.get("minAmount")),
    maxAmount: asOptionalString(formData.get("maxAmount")),
    keyHighlights: serializedHighlights,
    highlightSubheadline: asOptionalString(formData.get("highlightSubheadline")),
    insightTitle: asOptionalString(formData.get("insightTitle")),
    insightBody: asOptionalString(formData.get("insightBody")),
    crmTag: asOptionalString(formData.get("crmTag")),
    imageUrl: asOptionalString(formData.get("imageUrl")),
    imageAlt: asOptionalString(formData.get("imageAlt")),
    highlightImageUrl: asOptionalString(formData.get("highlightImageUrl")),
    highlightImageAlt: asOptionalString(formData.get("highlightImageAlt")),
    isActive: Boolean(formData.get("isActive")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });

  if (!parsed.success) {
    await redirectWithValidationError(editPath, parsed.error);
  }

  const loanProgramData = {
    ...parsed.data,
    slug: await ensureLoanProgramSlug({
      baseSlug: parsed.data.slug,
      currentId: parsed.data.id,
    }),
  };

  let loanProgram;

  try {
    const loanProgramFields = {
      title: loanProgramData.title,
      slug: loanProgramData.slug,
      lifecycleStatus: loanProgramData.lifecycleStatus,
      titleTail: loanProgramData.titleTail,
      heroBadgeOne: loanProgramData.heroBadgeOne,
      heroBadgeTwo: loanProgramData.heroBadgeTwo,
      heroBadgeThree: loanProgramData.heroBadgeThree,
      shortDescription: loanProgramData.shortDescription,
      fullDescription: loanProgramData.fullDescription,
      interestRate: loanProgramData.interestRate,
      ltv: loanProgramData.ltv,
      loanTerm: loanProgramData.loanTerm,
      fees: loanProgramData.fees,
      minAmount: loanProgramData.minAmount,
      maxAmount: loanProgramData.maxAmount,
      keyHighlights: loanProgramData.keyHighlights,
      highlightSubheadline: loanProgramData.highlightSubheadline,
      insightTitle: loanProgramData.insightTitle,
      insightBody: loanProgramData.insightBody,
      crmTag: loanProgramData.crmTag,
      imageUrl: loanProgramData.imageUrl,
      imageAlt: loanProgramData.imageAlt,
      highlightImageUrl: loanProgramData.highlightImageUrl,
      highlightImageAlt: loanProgramData.highlightImageAlt,
      isActive: loanProgramData.isActive,
      sortOrder: loanProgramData.sortOrder,
    };

    loanProgram = loanProgramData.id
      ? await prisma.loanProgram.update({
          where: { id: loanProgramData.id },
          data: loanProgramFields,
        })
      : await prisma.loanProgram.create({
          data: loanProgramFields,
        });

    // Step 1: Delete all existing related records via nested update
    await prisma.loanProgram.update({
      where: { id: loanProgram.id },
      data: {
        highlights: { deleteMany: {} },
        overviewItems: { deleteMany: {} },
      },
    });

    // Step 2: Re-create using individual nested creates (createMany is not
    // supported in nested writes for SQL Server in Prisma).
    if (highlights.length || overviewItems.length) {
      await prisma.$transaction([
        ...highlights.map((highlight, index) =>
          prisma.loanProgram.update({
            where: { id: loanProgram.id },
            data: { highlights: { create: { highlight, sortOrder: index } } },
          }),
        ),
        ...overviewItems.map((row, index) =>
          prisma.loanProgram.update({
            where: { id: loanProgram.id },
            data: {
              overviewItems: {
                create: { title: row.title, body: row.body, sortOrder: index },
              },
            },
          }),
        ),
      ]);
    }
  } catch (error) {
    if (isLoanProgramSchemaCompatibilityError(error)) {
      loanProgram = await upsertFallbackLoanProgram({
        id: loanProgramData.id,
        baseSlug: existingLoanProgramBaseSlug,
        title: loanProgramData.title,
        slug: loanProgramData.slug,
        lifecycleStatus: loanProgramData.lifecycleStatus,
        titleTail: loanProgramData.titleTail,
        heroBadgeOne: loanProgramData.heroBadgeOne,
        heroBadgeTwo: loanProgramData.heroBadgeTwo,
        heroBadgeThree: loanProgramData.heroBadgeThree,
        shortDescription: loanProgramData.shortDescription,
        fullDescription: loanProgramData.fullDescription,
        interestRate: loanProgramData.interestRate,
        ltv: loanProgramData.ltv,
        loanTerm: loanProgramData.loanTerm,
        fees: loanProgramData.fees,
        minAmount: loanProgramData.minAmount,
        maxAmount: loanProgramData.maxAmount,
        keyHighlights: loanProgramData.keyHighlights,
        highlightSubheadline: loanProgramData.highlightSubheadline,
        insightTitle: loanProgramData.insightTitle,
        insightBody: loanProgramData.insightBody,
        crmTag: loanProgramData.crmTag,
        imageUrl: loanProgramData.imageUrl,
        imageAlt: loanProgramData.imageAlt,
        highlightImageUrl: loanProgramData.highlightImageUrl,
        highlightImageAlt: loanProgramData.highlightImageAlt,
        highlights,
        overviewItems,
        isActive: loanProgramData.isActive,
        sortOrder: loanProgramData.sortOrder,
      });
    } else {
      await handleWriteError(
        error,
        loanProgram?.id ? `/admin/loan-programs/${loanProgram.id}` : editPath,
        "Loan program",
      );
    }
  }

  await upsertFallbackLoanProgram({
    id: loanProgram.id,
    baseSlug: existingLoanProgramBaseSlug,
    title: loanProgramData.title,
    slug: loanProgramData.slug,
    lifecycleStatus: loanProgramData.lifecycleStatus,
    titleTail: loanProgramData.titleTail,
    heroBadgeOne: loanProgramData.heroBadgeOne,
    heroBadgeTwo: loanProgramData.heroBadgeTwo,
    heroBadgeThree: loanProgramData.heroBadgeThree,
    shortDescription: loanProgramData.shortDescription,
    fullDescription: loanProgramData.fullDescription,
    interestRate: loanProgramData.interestRate,
    ltv: loanProgramData.ltv,
    loanTerm: loanProgramData.loanTerm,
    fees: loanProgramData.fees,
    minAmount: loanProgramData.minAmount,
    maxAmount: loanProgramData.maxAmount,
    keyHighlights: loanProgramData.keyHighlights,
    highlightSubheadline: loanProgramData.highlightSubheadline,
    insightTitle: loanProgramData.insightTitle,
    insightBody: loanProgramData.insightBody,
    crmTag: loanProgramData.crmTag,
    imageUrl: loanProgramData.imageUrl,
    imageAlt: loanProgramData.imageAlt,
    highlightImageUrl: loanProgramData.highlightImageUrl,
    highlightImageAlt: loanProgramData.highlightImageAlt,
    highlights,
    overviewItems,
    isActive: loanProgramData.isActive,
    sortOrder: loanProgramData.sortOrder,
  });

  revalidatePath("/admin/loan-programs");
  revalidatePath(`/admin/loan-programs/${loanProgram.id}`);
  revalidatePath("/get-financing");
  revalidatePath(`/get-financing/${loanProgram.slug}`);
  if (existingLoanProgram?.slug && existingLoanProgram.slug !== loanProgram.slug) {
    revalidatePath(`/get-financing/${existingLoanProgram.slug}`);
    revalidateLoanProgramCaches(existingLoanProgram.slug);
  }
  revalidateLoanProgramCaches(loanProgram.slug);

  const loanProgramFlash = getLifecycleFlash({
    entityLabel: "Loan Program",
    lifecycleStatus: loanProgramData.lifecycleStatus,
    isNew: !loanProgramData.id,
  });
  await redirectWithSuccessMessage(
    `/admin/loan-programs/${loanProgram.id}`,
    loanProgramFlash.message,
    loanProgramFlash,
  );
};

export const deleteLoanProgram = async (formData: FormData) => {
  await requireAdminSession();
  const id = await getSubmittedId(formData, "loan-programs");
  if (!id) {
    return;
  }

  const existing = await getExistingLoanProgramContext(id);

  try {
    await prisma.loanProgram.delete({ where: { id } });
  } catch (error) {
    if (isLoanProgramSchemaCompatibilityError(error)) {
      // Continue below so the mirrored fallback record is removed as well.
    } else {
      throw error;
    }
  }

  await deleteFallbackLoanProgram(id);

  revalidatePath("/admin/loan-programs");
  revalidatePath("/get-financing");
  if (existing?.slug) {
    revalidatePath(`/get-financing/${existing.slug}`);
  }
  revalidateLoanProgramCaches(existing?.slug);
  await redirectWithSuccessMessage("/admin/loan-programs", "Loan program deleted successfully.", {
    title: "Loan program deleted",
  });
};

export const saveCaseStudy = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "case-studies");
  const existingCaseStudy = id
    ? await prisma.caseStudy.findUnique({
        where: { id },
        select: { slug: true },
      })
    : null;
  const editPath = id ? `/admin/case-studies/${id}` : "/admin/case-studies/new";
  const parsed = caseStudySchema.safeParse({
    id,
    title: String(formData.get("title") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? formData.get("title") ?? "")),
    lifecycleStatus: intentToLifecycleStatus(formData),
    category: String(formData.get("category") ?? ""),
    overview: String(formData.get("overview") ?? "").trim(),
    businessPlan: String(formData.get("businessPlan") ?? "").trim(),
    execution: String(formData.get("execution") ?? "").trim(),
    outcomeSummary: String(formData.get("outcomeSummary") ?? "").trim(),
  });

  if (!parsed.success) {
    await redirectWithValidationError(editPath, parsed.error);
  }

  const caseStudyData = {
    ...parsed.data,
    slug: await ensureUniqueSlug({
      baseSlug: parsed.data.slug,
      currentId: parsed.data.id,
      fallback: "case-study",
      findBySlug: (slug) =>
        prisma.caseStudy.findUnique({
          where: { slug },
          select: { id: true },
        }),
    }),
  };

  const assetProfileRows = parsePipeRows(asOptionalString(formData.get("assetProfileText")));
  const takeaways = parseSimpleLines(asOptionalString(formData.get("takeawaysText")));
  const images = dedupeUploadedImages(parseImages(formData));
  const primaryMediaFileId = parsePrimaryMediaFileId(formData);

  const caseStudyRecord = {
    title: caseStudyData.title,
    slug: caseStudyData.slug,
    lifecycleStatus: caseStudyData.lifecycleStatus,
    category: caseStudyData.category,
    overview: caseStudyData.overview,
    businessPlan: caseStudyData.businessPlan,
    execution: caseStudyData.execution,
    outcomeSummary: caseStudyData.outcomeSummary,
  };

  let caseStudy;

  try {
    caseStudy = caseStudyData.id
      ? await prisma.caseStudy.update({
          where: { id: caseStudyData.id },
          data: caseStudyRecord,
        })
      : await prisma.caseStudy.create({
          data: caseStudyRecord,
        });

    await prisma.caseStudyAssetProfile.deleteMany({ where: { caseStudyId: caseStudy.id } });
    await prisma.caseStudyTakeaway.deleteMany({ where: { caseStudyId: caseStudy.id } });

    if (assetProfileRows.length) {
      await prisma.caseStudyAssetProfile.createMany({
        data: assetProfileRows
          .filter((row) => row[0] && row[1])
          .map((row, index) => ({
            caseStudyId: caseStudy.id,
            label: row[0],
            value: row[1],
            sortOrder: index,
          })),
      });
    }

    if (takeaways.length) {
      await prisma.caseStudyTakeaway.createMany({
        data: takeaways.map((takeaway, index) => ({
          caseStudyId: caseStudy.id,
          takeaway,
          sortOrder: index,
        })),
      });
    }

    await upsertCaseStudyImages(caseStudy.id, images, primaryMediaFileId);
  } catch (error) {
    await handleWriteError(
      error,
      caseStudy?.id ? `/admin/case-studies/${caseStudy.id}` : editPath,
      "Case study",
    );
  }

  revalidatePath("/admin/case-studies");
  revalidatePath(`/admin/case-studies/${caseStudy.id}`);
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${caseStudy.slug}`);
  if (existingCaseStudy?.slug && existingCaseStudy.slug !== caseStudy.slug) {
    revalidatePath(`/case-studies/${existingCaseStudy.slug}`);
    revalidateCaseStudyCaches(existingCaseStudy.slug);
  }
  revalidateCaseStudyCaches(caseStudy.slug);
  const caseStudyFlash = getLifecycleFlash({
    entityLabel: "Case study",
    lifecycleStatus: caseStudyData.lifecycleStatus,
    isNew: !caseStudyData.id,
  });
  await redirectWithSuccessMessage(
    `/admin/case-studies/${caseStudy.id}`,
    caseStudyFlash.message,
    caseStudyFlash,
  );
};

export const deleteCaseStudy = async (formData: FormData) => {
  await requireAdminSession();
  const id = await getSubmittedId(formData, "case-studies");
  if (!id) {
    return;
  }

  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  await prisma.caseStudy.delete({ where: { id } });

  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  if (existing?.slug) {
    revalidatePath(`/case-studies/${existing.slug}`);
  }
  revalidateCaseStudyCaches(existing?.slug);
  await redirectWithSuccessMessage("/admin/case-studies", "Case study deleted successfully.", {
    title: "Case study deleted",
  });
};

export const saveBlogPost = async (formData: FormData) => {
  await requireAdminSession();

  const blogPostDelegate = getBlogPostDelegate();
  const id = await getSubmittedId(formData, "blogs");
  const editPath = id ? `/admin/blogs/${id}` : "/admin/blogs/new";

  if (!blogPostDelegate) {
    await redirectWithBlogMigrationError(editPath);
  }

  const publishedAtInput = asOptionalString(formData.get("publishedAt"));
  const publishedAt = parseOptionalDateValue(publishedAtInput);

  if (publishedAtInput && !publishedAt) {
    await redirectWithErrorMessage(
      editPath,
      "Published date is invalid. Choose a valid date before saving.",
      "Invalid publish date",
    );
  }

  const parsed = blogPostSchema.safeParse({
    authorName: asOptionalString(formData.get("authorName")),
    category: String(formData.get("category") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    featuredImageAlt: asOptionalString(formData.get("featuredImageAlt")),
    featuredImageUrl: asOptionalString(formData.get("featuredImageUrl")),
    id,
    lifecycleStatus: intentToLifecycleStatus(formData),
    readTime: asOptionalString(formData.get("readTime")),
    slug: slugify(String(formData.get("slug") ?? formData.get("title") ?? "")),
    title: String(formData.get("title") ?? "").trim(),
  });

  if (!parsed.success) {
    await redirectWithValidationError(editPath, parsed.error);
  }

  let existingBlogPost: { publishedAt: Date | null; slug: string } | null = null;
  let blogPost;

  try {
    existingBlogPost = parsed.data.id
      ? await blogPostDelegate.findUnique({
          where: { id: parsed.data.id },
          select: {
            publishedAt: true,
            slug: true,
          },
        })
      : null;

    const slug = await ensureUniqueSlug({
      baseSlug: parsed.data.slug,
      currentId: parsed.data.id,
      fallback: "blog-post",
      findBySlug: (candidate) =>
        blogPostDelegate.findUnique({
          where: { slug: candidate },
          select: { id: true },
        }) as Promise<{ id: string } | null>,
    });

    const nextPublishedAt =
      publishedAt ??
      (parsed.data.lifecycleStatus === "PUBLISHED"
        ? existingBlogPost?.publishedAt ?? new Date()
        : existingBlogPost?.publishedAt ?? null);

    const blogPostRecord = {
      authorName: parsed.data.authorName,
      category: parsed.data.category,
      content: parsed.data.content,
      excerpt: parsed.data.excerpt,
      featuredImageAlt: parsed.data.featuredImageAlt,
      featuredImageUrl: parsed.data.featuredImageUrl,
      lifecycleStatus: parsed.data.lifecycleStatus,
      publishedAt: nextPublishedAt,
      readTime: parsed.data.readTime,
      slug,
      title: parsed.data.title,
    };

    blogPost = parsed.data.id
      ? await blogPostDelegate.update({
          where: { id: parsed.data.id },
          data: blogPostRecord,
        })
      : await blogPostDelegate.create({
          data: blogPostRecord,
        });
  } catch (error) {
    if (isBlogSchemaCompatibilityError(error)) {
      await redirectWithBlogMigrationError(editPath);
    }

    await handleWriteError(error, editPath, "Blog post");
  }

  revalidatePath("/admin/blogs");
  revalidatePath(`/admin/blogs/${blogPost.id}`);
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${blogPost.slug}`);
  revalidatePath("/get-financing");
  revalidatePath("/");
  if (existingBlogPost?.slug && existingBlogPost.slug !== blogPost.slug) {
    revalidatePath(`/blogs/${existingBlogPost.slug}`);
    revalidateBlogCaches(existingBlogPost.slug);
  }
  revalidateBlogCaches(blogPost.slug);
  const blogFlash = getLifecycleFlash({
    entityLabel: "Blog post",
    lifecycleStatus: parsed.data.lifecycleStatus,
    isNew: !parsed.data.id,
  });
  await redirectWithSuccessMessage(
    `/admin/blogs/${blogPost.id}`,
    blogFlash.message,
    blogFlash,
  );
};

export const deleteBlogPost = async (formData: FormData) => {
  await requireAdminSession();

  const blogPostDelegate = getBlogPostDelegate();
  const id = await getSubmittedId(formData, "blogs");

  if (!id) {
    return;
  }

  if (!blogPostDelegate) {
    await redirectWithBlogMigrationError("/admin/blogs");
  }

  let existing: { slug: string } | null = null;

  try {
    existing = await blogPostDelegate.findUnique({
      where: { id },
      select: { slug: true },
    });

    await blogPostDelegate.delete({ where: { id } });
  } catch (error) {
    if (isBlogSchemaCompatibilityError(error)) {
      await redirectWithBlogMigrationError("/admin/blogs");
    }

    throw error;
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath("/get-financing");
  revalidatePath("/");
  if (existing?.slug) {
    revalidatePath(`/blogs/${existing.slug}`);
  }
  revalidateBlogCaches(existing?.slug);
  await redirectWithSuccessMessage("/admin/blogs", "Blog post deleted successfully.", {
    title: "Blog post deleted",
  });
};

export const saveCalculator = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "calculators");
  const editPath = id ? `/admin/calculators/${id}` : "/admin/calculators/new";
  const parsed = calculatorSchema.safeParse({
    id,
    title: String(formData.get("title") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? formData.get("title") ?? "")),
    lifecycleStatus: intentToLifecycleStatus(formData),
    calculatorType: String(formData.get("calculatorType") ?? ""),
    shortDescription: asOptionalString(formData.get("shortDescription")),
    disclaimer: String(formData.get("disclaimer") ?? "").trim(),
  });

  if (!parsed.success) {
    await redirectWithValidationError(editPath, parsed.error);
  }

  const calculatorData = {
    ...parsed.data,
    slug: await ensureUniqueSlug({
      baseSlug: parsed.data.slug,
      currentId: parsed.data.id,
      fallback: "calculator",
      findBySlug: (slug) =>
        prisma.calculator.findUnique({
          where: { slug },
          select: { id: true },
        }),
    }),
  };

  const calculatorRecord = {
    title: calculatorData.title,
    slug: calculatorData.slug,
    lifecycleStatus: calculatorData.lifecycleStatus,
    calculatorType: calculatorData.calculatorType,
    shortDescription: calculatorData.shortDescription,
    disclaimer: calculatorData.disclaimer,
  };
  const existingCalculator = calculatorData.id
    ? await prisma.calculator.findUnique({
        where: { id: calculatorData.id },
        select: { slug: true },
      })
    : null;

  let calculator;

  try {
    calculator = calculatorData.id
      ? await prisma.calculator.update({
          where: { id: calculatorData.id },
          data: calculatorRecord,
        })
      : await prisma.calculator.create({
          data: calculatorRecord,
        });
  } catch (error) {
    await handleWriteError(error, editPath, "Calculator");
  }

  revalidatePath("/admin/calculators");
  revalidatePath(`/admin/calculators/${calculator.id}`);
  revalidatePath("/calculators");
  revalidatePath(`/calculators/${calculator.slug}`);
  if (existingCalculator?.slug && existingCalculator.slug !== calculator.slug) {
    revalidatePath(`/calculators/${existingCalculator.slug}`);
    revalidateTag(`calculator:${existingCalculator.slug}`, TAG_REVALIDATE_PROFILE);
  }
  revalidatePath("/");
  revalidateTag("calculators", TAG_REVALIDATE_PROFILE);
  revalidateTag(`calculator:${calculator.slug}`, TAG_REVALIDATE_PROFILE);
  const calculatorFlash = getLifecycleFlash({
    entityLabel: "Calculator",
    lifecycleStatus: calculatorData.lifecycleStatus,
    isNew: !calculatorData.id,
  });
  await redirectWithSuccessMessage(
    `/admin/calculators/${calculator.id}`,
    calculatorFlash.message,
    calculatorFlash,
  );
};

export const deleteCalculator = async (formData: FormData) => {
  await requireAdminSession();
  const id = await getSubmittedId(formData, "calculators");
  if (!id) {
    return;
  }

  const existing = await prisma.calculator.findUnique({ where: { id } });
  await prisma.calculator.delete({ where: { id } });
  revalidatePath("/admin/calculators");
  revalidatePath("/calculators");
  if (existing?.slug) {
    revalidatePath(`/calculators/${existing.slug}`);
    revalidateTag(`calculator:${existing.slug}`, TAG_REVALIDATE_PROFILE);
  }
  revalidateTag("calculators", TAG_REVALIDATE_PROFILE);
  await redirectWithSuccessMessage("/admin/calculators", "Calculator deleted successfully.", {
    title: "Calculator deleted",
  });
};

export const saveHomePage = async (formData: FormData) => {
  await requireAdminSession();
  const aboutSectionImageUrl = asOptionalString(formData.get("aboutSectionImageUrl"));
  const testimonials = parseHomeTestimonials(formData);
  const managedImageError = getHomePageManagedImageError({
    aboutSectionImageUrl,
    testimonials,
  });

  if (managedImageError) {
    await redirectWithErrorMessage("/admin/pages/home", managedImageError, "Invalid image source");
  }

  await prisma.homePage.upsert({
    where: { id: "home" },
    update: {
      heroHeadline: String(formData.get("heroHeadline") ?? "").trim(),
      heroSubheadline: String(formData.get("heroSubheadline") ?? "").trim(),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") ?? "").trim(),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") ?? "").trim(),
      heroSecondaryCtaLabel: asOptionalString(formData.get("heroSecondaryCtaLabel")),
      heroSecondaryCtaHref: asOptionalString(formData.get("heroSecondaryCtaHref")),
      aboutSectionTitle: asOptionalString(formData.get("aboutSectionTitle")),
      aboutSectionParagraphOne: asOptionalString(formData.get("aboutSectionParagraphOne")),
      aboutSectionParagraphTwo: asOptionalString(formData.get("aboutSectionParagraphTwo")),
      aboutSectionPrimaryCtaLabel: asOptionalString(formData.get("aboutSectionPrimaryCtaLabel")),
      aboutSectionPrimaryCtaHref: asOptionalString(formData.get("aboutSectionPrimaryCtaHref")),
      aboutSectionSecondaryCtaLabel: asOptionalString(formData.get("aboutSectionSecondaryCtaLabel")),
      aboutSectionSecondaryCtaHref: asOptionalString(formData.get("aboutSectionSecondaryCtaHref")),
      aboutSectionImageUrl,
      aboutSectionImageAlt: asOptionalString(formData.get("aboutSectionImageAlt")),
      metricsDisclaimer: asOptionalString(formData.get("metricsDisclaimer")),
      portfolioValueDisplay: asOptionalString(formData.get("portfolioValueDisplay")),
      portfolioCaption: asOptionalString(formData.get("portfolioCaption")),
    },
    create: {
      id: "home",
      heroHeadline: String(formData.get("heroHeadline") ?? "").trim(),
      heroSubheadline: String(formData.get("heroSubheadline") ?? "").trim(),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") ?? "").trim(),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") ?? "").trim(),
      heroSecondaryCtaLabel: asOptionalString(formData.get("heroSecondaryCtaLabel")),
      heroSecondaryCtaHref: asOptionalString(formData.get("heroSecondaryCtaHref")),
      aboutSectionTitle: asOptionalString(formData.get("aboutSectionTitle")),
      aboutSectionParagraphOne: asOptionalString(formData.get("aboutSectionParagraphOne")),
      aboutSectionParagraphTwo: asOptionalString(formData.get("aboutSectionParagraphTwo")),
      aboutSectionPrimaryCtaLabel: asOptionalString(formData.get("aboutSectionPrimaryCtaLabel")),
      aboutSectionPrimaryCtaHref: asOptionalString(formData.get("aboutSectionPrimaryCtaHref")),
      aboutSectionSecondaryCtaLabel: asOptionalString(formData.get("aboutSectionSecondaryCtaLabel")),
      aboutSectionSecondaryCtaHref: asOptionalString(formData.get("aboutSectionSecondaryCtaHref")),
      aboutSectionImageUrl,
      aboutSectionImageAlt: asOptionalString(formData.get("aboutSectionImageAlt")),
      metricsDisclaimer: asOptionalString(formData.get("metricsDisclaimer")),
      portfolioValueDisplay: asOptionalString(formData.get("portfolioValueDisplay")),
      portfolioCaption: asOptionalString(formData.get("portfolioCaption")),
    },
  });

  const metrics = parsePipeRows(asOptionalString(formData.get("metricsText")));
  const segments = parsePipeRows(asOptionalString(formData.get("segmentsText")));
  const platformCards = parsePipeRows(asOptionalString(formData.get("platformCardsText")));
  const caseHighlights = parsePipeRows(asOptionalString(formData.get("caseHighlightsText")));

  await prisma.homeMetric.deleteMany({ where: { homePageId: "home" } });
  await prisma.homeSegment.deleteMany({ where: { homePageId: "home" } });
  await prisma.homePlatformCard.deleteMany({ where: { homePageId: "home" } });
  await prisma.homeCaseHighlight.deleteMany({ where: { homePageId: "home" } });
  await prisma.homeTestimonial.deleteMany({ where: { homePageId: "home" } });

  if (metrics.length) {
    await prisma.homeMetric.createMany({
      data: metrics
        .filter((row) => row[0] && row[1])
        .map((row, index) => ({
          homePageId: "home",
          metricValue: row[0],
          metricLabel: row[1],
          sortOrder: index,
        })),
    });
  }

  if (segments.length) {
    await prisma.homeSegment.createMany({
      data: segments
        .filter((row) => row[0] && row[1] && row[2] && row[3])
        .map((row, index) => ({
          homePageId: "home",
          title: row[0],
          body: row[1],
          ctaLabel: row[2],
          ctaHref: row[3],
          sortOrder: index,
        })),
    });
  }

  if (platformCards.length) {
    await prisma.homePlatformCard.createMany({
      data: platformCards
        .filter((row) => row[0] && row[1] && row[2] && row[3])
        .map((row, index) => ({
          homePageId: "home",
          title: row[0],
          body: row[1],
          ctaLabel: row[2],
          ctaHref: row[3],
          sortOrder: index,
        })),
    });
  }

  if (caseHighlights.length) {
    await prisma.homeCaseHighlight.createMany({
      data: caseHighlights
        .filter((row) => row[0] && row[1] && row[2] && row[3])
        .map((row, index) => ({
          homePageId: "home",
          title: row[0],
          body: row[1],
          ctaLabel: row[2],
          ctaHref: row[3],
          sortOrder: index,
        })),
    });
  }

  if (testimonials.length) {
    await prisma.homeTestimonial.createMany({
      data: createHomeTestimonialRecords(testimonials),
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/pages/home");
  revalidateTag("home-page", TAG_REVALIDATE_PROFILE);
  await redirectWithSuccessMessage("/admin/pages/home", "Home page updated successfully.", {
    title: "Home page saved",
  });
};

export const saveSingletonPage = async (formData: FormData) => {
  await requireAdminSession();
  const key = String(formData.get("key") ?? "");
  const currentPage = await getOrCreateSingletonPageRecord(key);

  if (!currentPage) {
    redirect("/admin/pages");
  }

  await prisma.singletonPage.update({
    where: { key: key as never },
    data: {
      pageTitle: String(formData.get("pageTitle") ?? "").trim(),
      intro: asOptionalString(formData.get("intro")),
      disclaimer: asOptionalString(formData.get("disclaimer")),
      ctaLabel: asOptionalString(formData.get("ctaLabel")),
      ctaHref: asOptionalString(formData.get("ctaHref")),
      lifecycleStatus: intentToLifecycleStatus(formData),
    },
  });

  const groups = singletonPageGroups[key] ?? [];

  await prisma.singletonPageItem.deleteMany({
    where: { pageId: currentPage.id },
  });

  for (const group of groups) {
    const rows = parseSingletonPageGroupRows(
      group,
      asOptionalString(formData.get(`group_${group.key}`)),
    );
    if (!rows.length) {
      continue;
    }

    await prisma.singletonPageItem.createMany({
      data: rows.map((row, index) => ({
        pageId: currentPage.id,
        groupKey: group.key,
        title: row.title,
        body: row.body,
        sortOrder: index,
      })),
    });
  }

  if (currentPage.routePath) {
    revalidatePath(currentPage.routePath);
  }
  revalidatePath("/admin/pages");
  revalidateSingletonPageCache(key);
  await redirectWithSuccessMessage(`/admin/pages/${key}`, "Page content updated successfully.", {
    title: "Page saved",
  });
};

export const saveFormDefinition = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "forms");
  const existingForm = id ? await getExistingFormRelationContext(id) : null;
  const editPath = id ? `/admin/forms/${id}` : "/admin/forms/new";
  const parsed = formSchema.safeParse({
    id,
    formName: String(formData.get("formName") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? formData.get("formName") ?? "")),
    destination: String(formData.get("destination") ?? ""),
    successMessage: String(formData.get("successMessage") ?? "").trim(),
    webhookUrl: asOptionalString(formData.get("webhookUrl")),
    linkedLoanProgramId: asOptionalString(formData.get("linkedLoanProgramId")),
    isActive: Boolean(formData.get("isActive")),
  });

  if (!parsed.success) {
    await redirectWithValidationError(editPath, parsed.error);
  }

  const formDataParsed = {
    ...parsed.data,
    slug: await ensureUniqueSlug({
      baseSlug: parsed.data.slug,
      currentId: parsed.data.id,
      fallback: "form",
      findBySlug: (slug) =>
        prisma.formDefinition.findUnique({
          where: { slug },
          select: { id: true },
        }),
    }),
  };

  const fields = parseFormFieldsEditorValue(asOptionalString(formData.get("fieldsText")));
  let savedForm;

  try {
    const persistedForm = await persistFormDefinitionRecord(formDataParsed);
    savedForm = persistedForm.savedForm;
    await replaceFormDefinitionFields(savedForm.id, fields);
  } catch (error) {
    await handleWriteError(error, savedForm?.id ? `/admin/forms/${savedForm.id}` : editPath, "Form");
  }

  revalidatePath("/admin/forms");
  revalidatePath(`/admin/forms/${savedForm.id}`);
  revalidatePath("/cash-offer");
  revalidatePath("/properties");
  revalidatePath("/investments");
  revalidatePath("/get-financing");
  revalidateFormCache(savedForm.slug);
  if (existingForm?.slug && existingForm.slug !== savedForm.slug) {
    revalidateFormCache(existingForm.slug);
  }
  if (existingForm?.linkedLoanProgram?.slug) {
    revalidatePath(`/get-financing/${existingForm.linkedLoanProgram.slug}`);
    revalidateLoanProgramCaches(existingForm.linkedLoanProgram.slug);
  }
  if (savedForm.linkedLoanProgram?.slug) {
    revalidatePath(`/get-financing/${savedForm.linkedLoanProgram.slug}`);
    revalidateLoanProgramCaches(savedForm.linkedLoanProgram.slug);
  }
  await redirectWithSuccessMessage(`/admin/forms/${savedForm.id}`, "Form updated successfully.", {
    title: "Form saved",
  });
};

export const autosavePropertyDraft = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "properties");
  const existing = id
    ? await prisma.property.findUnique({
        where: { id },
        select: {
          id: true,
          lifecycleStatus: true,
          slug: true,
          title: true,
          status: true,
          locationCity: true,
          locationState: true,
          propertyType: true,
          strategy: true,
          summary: true,
          buyerFit: true,
          detailContent: true,
          inquiryFormId: true,
        },
      })
    : null;

  const rawTitle = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const buyerFit = asOptionalString(formData.get("buyerFit"));
  const locationCity = asOptionalString(formData.get("locationCity"));
  const locationState = asOptionalString(formData.get("locationState"));
  const detailContent = buildPropertyDetailContent(formData);
  const highlights = parseSimpleLines(asOptionalString(formData.get("highlightsText")));
  const images = dedupeUploadedImages(parseImages(formData));
  const primaryMediaFileId = parsePrimaryMediaFileId(formData);

  if (
    !existing &&
    !rawTitle &&
    !summary &&
    !buyerFit &&
    !locationCity &&
    !locationState &&
    !detailContent &&
    !highlights.length &&
    !images.length
  ) {
    return null;
  }

  const slug = await ensureUniqueSlug({
    baseSlug: slugify(rawTitle) || existing?.slug || createAutosaveSlug("property-draft"),
    currentId: existing?.id,
    fallback: "property-draft",
    findBySlug: (candidate) =>
      prisma.property.findUnique({
        where: { slug: candidate },
        select: { id: true },
      }),
  });

  const property = existing
    ? await prisma.property.update({
        where: { id: existing.id },
      data: {
          title: getAutosaveTitle({
            rawTitle,
            existingTitle: existing.title,
            fallback: "Untitled property",
          }),
          slug,
          lifecycleStatus: existing.lifecycleStatus ?? "DRAFT",
          status: getPropertyEditorStatus(
            asOptionalString(formData.get("status")) ?? existing.status ?? "FOR_SALE",
          ),
          locationCity,
          locationState,
          propertyType: String(formData.get("propertyType") ?? existing.propertyType ?? "SFR"),
          strategy: String(formData.get("strategy") ?? existing.strategy ?? "FIX_FLIP"),
          summary,
          buyerFit,
          detailContent,
          inquiryFormId: asOptionalString(formData.get("inquiryFormId")),
        },
      })
    : await prisma.property.create({
        data: {
          title: getAutosaveTitle({
            rawTitle,
            fallback: "Untitled property",
          }),
          slug,
          lifecycleStatus: "DRAFT",
          status: getPropertyEditorStatus(asOptionalString(formData.get("status")) ?? "FOR_SALE"),
          locationCity,
          locationState,
          propertyType: String(formData.get("propertyType") ?? "SFR"),
          strategy: String(formData.get("strategy") ?? "FIX_FLIP"),
          summary,
          buyerFit,
          detailContent,
          inquiryFormId: asOptionalString(formData.get("inquiryFormId")),
        },
      });

  await prisma.propertyHighlight.deleteMany({ where: { propertyId: property.id } });
  if (highlights.length) {
    await prisma.propertyHighlight.createMany({
      data: highlights.map((highlight, index) => ({
        propertyId: property.id,
        highlight,
        sortOrder: index,
      })),
    });
  }

  await upsertPropertyImages(property.id, images, primaryMediaFileId);

  return {
    path: getAutosavePath("/admin/properties", property.id),
    recordId: property.id,
    savedAt: property.updatedAt.toISOString(),
  };
};

export const autosaveInvestmentDraft = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "investments");
  const existing = id
    ? await prisma.investment.findUnique({
        where: { id },
        select: {
          id: true,
          lifecycleStatus: true,
          slug: true,
          title: true,
          status: true,
          assetType: true,
          strategy: true,
          summary: true,
          minimumInvestmentDisplay: true,
          returnsDisclaimer: true,
          dealPacketFormId: true,
        },
      })
    : null;

  const rawTitle = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const highlights = parseSimpleLines(asOptionalString(formData.get("highlightsText")));
  const images = dedupeUploadedImages(parseImages(formData));
  const primaryMediaFileId = parsePrimaryMediaFileId(formData);

  if (
    !existing &&
    !rawTitle &&
    !summary &&
    !asOptionalString(formData.get("minimumInvestmentDisplay")) &&
    !asOptionalString(formData.get("returnsDisclaimer")) &&
    !highlights.length &&
    !images.length
  ) {
    return null;
  }

  const slug = await ensureUniqueSlug({
    baseSlug: slugify(rawTitle) || existing?.slug || createAutosaveSlug("investment-draft"),
    currentId: existing?.id,
    fallback: "investment-draft",
    findBySlug: (candidate) =>
      prisma.investment.findUnique({
        where: { slug: candidate },
        select: { id: true },
      }),
  });

  const investment = existing
    ? await prisma.investment.update({
        where: { id: existing.id },
        data: {
          title: getAutosaveTitle({
            rawTitle,
            existingTitle: existing.title,
            fallback: "Untitled investment",
          }),
          slug,
          lifecycleStatus: existing.lifecycleStatus ?? "DRAFT",
          status: String(formData.get("status") ?? existing.status ?? "COMING_SOON"),
          assetType: String(formData.get("assetType") ?? existing.assetType ?? "MULTIFAMILY"),
          strategy: String(formData.get("strategy") ?? existing.strategy ?? "VALUE_ADD"),
          summary,
          minimumInvestmentDisplay: asOptionalString(formData.get("minimumInvestmentDisplay")),
          returnsDisclaimer: asOptionalString(formData.get("returnsDisclaimer")),
          dealPacketFormId: asOptionalString(formData.get("dealPacketFormId")),
        },
      })
    : await prisma.investment.create({
        data: {
          title: getAutosaveTitle({
            rawTitle,
            fallback: "Untitled investment",
          }),
          slug,
          lifecycleStatus: "DRAFT",
          status: String(formData.get("status") ?? "COMING_SOON"),
          assetType: String(formData.get("assetType") ?? "MULTIFAMILY"),
          strategy: String(formData.get("strategy") ?? "VALUE_ADD"),
          summary,
          minimumInvestmentDisplay: asOptionalString(formData.get("minimumInvestmentDisplay")),
          returnsDisclaimer: asOptionalString(formData.get("returnsDisclaimer")),
          dealPacketFormId: asOptionalString(formData.get("dealPacketFormId")),
        },
      });

  await prisma.investmentHighlight.deleteMany({ where: { investmentId: investment.id } });
  if (highlights.length) {
    await prisma.investmentHighlight.createMany({
      data: highlights.map((highlight, index) => ({
        investmentId: investment.id,
        highlight,
        sortOrder: index,
      })),
    });
  }

  await upsertInvestmentImages(investment.id, images, primaryMediaFileId);

  return {
    path: getAutosavePath("/admin/investments", investment.id),
    recordId: investment.id,
    savedAt: investment.updatedAt.toISOString(),
  };
};

export const autosaveLoanProgramDraft = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "loan-programs");
  const existing = id ? await getExistingLoanProgramContext(id) : null;
  const existingLoanProgramBaseSlug =
    existing && "baseSlug" in existing ? existing.baseSlug : existing?.slug ?? null;

  const rawTitle = String(formData.get("title") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const fullDescription = String(formData.get("fullDescription") ?? "").trim();
  const highlights = parseSimpleLines(asOptionalString(formData.get("highlightsText")));
  const overviewItems = normalizeLoanProgramOverviewItems(
    parsePipeRows(asOptionalString(formData.get("overviewItemsText"))),
  );
  const keyHighlights = serializeSimpleLines(highlights);
  const interestRate = asOptionalString(formData.get("interestRate"));
  const ltv = asOptionalString(formData.get("ltv"));
  const loanTerm = asOptionalString(formData.get("loanTerm"));
  const minAmount = asOptionalString(formData.get("minAmount"));
  const maxAmount = asOptionalString(formData.get("maxAmount"));

  if (
    !existing &&
    !rawTitle &&
    !shortDescription &&
    !fullDescription &&
    !keyHighlights &&
    !interestRate &&
    !ltv &&
    !loanTerm &&
    !minAmount &&
    !maxAmount
  ) {
    return null;
  }

  const slug = await ensureLoanProgramSlug({
    baseSlug: slugify(rawTitle) || existing?.slug || createAutosaveSlug("loan-program-draft"),
    currentId: existing?.id,
  });

  let loanProgram;

  try {
    const loanProgramFields = {
      title: getAutosaveTitle({
        rawTitle,
        existingTitle: existing?.title,
        fallback: "Untitled loan program",
      }),
      slug,
      lifecycleStatus: existing?.lifecycleStatus ?? "DRAFT",
      titleTail: asOptionalString(formData.get("titleTail")),
      heroBadgeOne: asOptionalString(formData.get("heroBadgeOne")),
      heroBadgeTwo: asOptionalString(formData.get("heroBadgeTwo")),
      heroBadgeThree: asOptionalString(formData.get("heroBadgeThree")),
      shortDescription,
      fullDescription,
      interestRate,
      ltv,
      loanTerm,
      fees: asOptionalString(formData.get("fees")),
      minAmount,
      maxAmount,
      keyHighlights,
      highlightSubheadline: asOptionalString(formData.get("highlightSubheadline")),
      insightTitle: asOptionalString(formData.get("insightTitle")),
      insightBody: asOptionalString(formData.get("insightBody")),
      crmTag: asOptionalString(formData.get("crmTag")),
      imageUrl: asOptionalString(formData.get("imageUrl")),
      imageAlt: asOptionalString(formData.get("imageAlt")),
      highlightImageUrl: asOptionalString(formData.get("highlightImageUrl")),
      highlightImageAlt: asOptionalString(formData.get("highlightImageAlt")),
      isActive: Boolean(formData.get("isActive")),
      sortOrder: Number(formData.get("sortOrder") ?? existing?.sortOrder ?? 0),
    };

    loanProgram = existing
      ? await prisma.loanProgram.update({
          where: { id: existing.id },
          data: loanProgramFields,
        })
      : await prisma.loanProgram.create({
          data: {
            ...loanProgramFields,
            title: getAutosaveTitle({ rawTitle, fallback: "Untitled loan program" }),
            lifecycleStatus: "DRAFT",
            sortOrder: Number(formData.get("sortOrder") ?? 0),
          },
        });

    await prisma.loanProgram.update({
      where: { id: loanProgram.id },
      data: {
        highlights: { deleteMany: {} },
        overviewItems: { deleteMany: {} },
      },
    });

    if (highlights.length || overviewItems.length) {
      await prisma.$transaction([
        ...highlights.map((highlight, index) =>
          prisma.loanProgram.update({
            where: { id: loanProgram.id },
            data: { highlights: { create: { highlight, sortOrder: index } } },
          }),
        ),
        ...overviewItems.map((row, index) =>
          prisma.loanProgram.update({
            where: { id: loanProgram.id },
            data: {
              overviewItems: {
                create: { title: row.title, body: row.body, sortOrder: index },
              },
            },
          }),
        ),
      ]);
    }
  } catch (error) {
    if (!isLoanProgramSchemaCompatibilityError(error)) {
      throw error;
    }

    loanProgram = await upsertFallbackLoanProgram({
      id: existing?.id,
      baseSlug: existingLoanProgramBaseSlug,
      title: getAutosaveTitle({
        rawTitle,
        existingTitle: existing?.title,
        fallback: "Untitled loan program",
      }),
      slug,
      lifecycleStatus: existing?.lifecycleStatus ?? "DRAFT",
      titleTail: asOptionalString(formData.get("titleTail")),
      heroBadgeOne: asOptionalString(formData.get("heroBadgeOne")),
      heroBadgeTwo: asOptionalString(formData.get("heroBadgeTwo")),
      heroBadgeThree: asOptionalString(formData.get("heroBadgeThree")),
      shortDescription,
      fullDescription,
      interestRate,
      ltv,
      loanTerm,
      fees: asOptionalString(formData.get("fees")),
      minAmount,
      maxAmount,
      keyHighlights,
      highlightSubheadline: asOptionalString(formData.get("highlightSubheadline")),
      insightTitle: asOptionalString(formData.get("insightTitle")),
      insightBody: asOptionalString(formData.get("insightBody")),
      crmTag: asOptionalString(formData.get("crmTag")),
      imageUrl: asOptionalString(formData.get("imageUrl")),
      imageAlt: asOptionalString(formData.get("imageAlt")),
      highlightImageUrl: asOptionalString(formData.get("highlightImageUrl")),
      highlightImageAlt: asOptionalString(formData.get("highlightImageAlt")),
      highlights,
      overviewItems,
      isActive: Boolean(formData.get("isActive")),
      sortOrder: Number(formData.get("sortOrder") ?? existing?.sortOrder ?? 0),
    });
  }

  await upsertFallbackLoanProgram({
    id: loanProgram.id,
    baseSlug: existingLoanProgramBaseSlug,
    title: getAutosaveTitle({
      rawTitle,
      existingTitle: existing?.title,
      fallback: "Untitled loan program",
    }),
    slug,
    lifecycleStatus: existing?.lifecycleStatus ?? "DRAFT",
    titleTail: asOptionalString(formData.get("titleTail")),
    heroBadgeOne: asOptionalString(formData.get("heroBadgeOne")),
    heroBadgeTwo: asOptionalString(formData.get("heroBadgeTwo")),
    heroBadgeThree: asOptionalString(formData.get("heroBadgeThree")),
    shortDescription,
    fullDescription,
    interestRate,
    ltv,
    loanTerm,
    fees: asOptionalString(formData.get("fees")),
    minAmount,
    maxAmount,
    keyHighlights,
    highlightSubheadline: asOptionalString(formData.get("highlightSubheadline")),
    insightTitle: asOptionalString(formData.get("insightTitle")),
    insightBody: asOptionalString(formData.get("insightBody")),
    crmTag: asOptionalString(formData.get("crmTag")),
    imageUrl: asOptionalString(formData.get("imageUrl")),
    imageAlt: asOptionalString(formData.get("imageAlt")),
    highlightImageUrl: asOptionalString(formData.get("highlightImageUrl")),
    highlightImageAlt: asOptionalString(formData.get("highlightImageAlt")),
    highlights,
    overviewItems,
    isActive: Boolean(formData.get("isActive")),
    sortOrder: Number(formData.get("sortOrder") ?? existing?.sortOrder ?? 0),
  });

  return {
    path: getAutosavePath("/admin/loan-programs", loanProgram.id),
    recordId: loanProgram.id,
    savedAt: loanProgram.updatedAt.toISOString(),
  };
};

export const autosaveCaseStudyDraft = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "case-studies");
  const existing = id
    ? await prisma.caseStudy.findUnique({
        where: { id },
        select: {
          id: true,
          lifecycleStatus: true,
          slug: true,
          title: true,
          category: true,
          overview: true,
          businessPlan: true,
          execution: true,
          outcomeSummary: true,
        },
      })
    : null;

  const rawTitle = String(formData.get("title") ?? "").trim();
  const overview = String(formData.get("overview") ?? "").trim();
  const businessPlan = String(formData.get("businessPlan") ?? "").trim();
  const execution = String(formData.get("execution") ?? "").trim();
  const outcomeSummary = String(formData.get("outcomeSummary") ?? "").trim();
  const assetProfileRows = parsePipeRows(asOptionalString(formData.get("assetProfileText")));
  const takeaways = parseSimpleLines(asOptionalString(formData.get("takeawaysText")));
  const images = dedupeUploadedImages(parseImages(formData));
  const primaryMediaFileId = parsePrimaryMediaFileId(formData);

  if (
    !existing &&
    !rawTitle &&
    !overview &&
    !businessPlan &&
    !execution &&
    !outcomeSummary &&
    !assetProfileRows.length &&
    !takeaways.length &&
    !images.length
  ) {
    return null;
  }

  const slug = await ensureUniqueSlug({
    baseSlug: slugify(rawTitle) || existing?.slug || createAutosaveSlug("case-study-draft"),
    currentId: existing?.id,
    fallback: "case-study-draft",
    findBySlug: (candidate) =>
      prisma.caseStudy.findUnique({
        where: { slug: candidate },
        select: { id: true },
      }),
  });

  const caseStudy = existing
    ? await prisma.caseStudy.update({
        where: { id: existing.id },
        data: {
          title: getAutosaveTitle({
            rawTitle,
            existingTitle: existing.title,
            fallback: "Untitled case study",
          }),
          slug,
          lifecycleStatus: existing.lifecycleStatus ?? "DRAFT",
          category: String(formData.get("category") ?? existing.category ?? "VALUE_ADD_MULTIFAMILY"),
          overview,
          businessPlan,
          execution,
          outcomeSummary,
        },
      })
    : await prisma.caseStudy.create({
        data: {
          title: getAutosaveTitle({
            rawTitle,
            fallback: "Untitled case study",
          }),
          slug,
          lifecycleStatus: "DRAFT",
          category: String(formData.get("category") ?? "VALUE_ADD_MULTIFAMILY"),
          overview,
          businessPlan,
          execution,
          outcomeSummary,
        },
      });

  await prisma.caseStudyAssetProfile.deleteMany({ where: { caseStudyId: caseStudy.id } });
  await prisma.caseStudyTakeaway.deleteMany({ where: { caseStudyId: caseStudy.id } });

  if (assetProfileRows.length) {
    await prisma.caseStudyAssetProfile.createMany({
      data: assetProfileRows
        .filter((row) => row[0] && row[1])
        .map((row, index) => ({
          caseStudyId: caseStudy.id,
          label: row[0],
          value: row[1],
          sortOrder: index,
        })),
    });
  }

  if (takeaways.length) {
    await prisma.caseStudyTakeaway.createMany({
      data: takeaways.map((takeaway, index) => ({
        caseStudyId: caseStudy.id,
        takeaway,
        sortOrder: index,
      })),
    });
  }

  await upsertCaseStudyImages(caseStudy.id, images, primaryMediaFileId);

  return {
    path: getAutosavePath("/admin/case-studies", caseStudy.id),
    recordId: caseStudy.id,
    savedAt: caseStudy.updatedAt.toISOString(),
  };
};

export const autosaveBlogPostDraft = async (formData: FormData) => {
  await requireAdminSession();

  const blogPostDelegate = getBlogPostDelegate();

  if (!blogPostDelegate) {
    return null;
  }

  const id = await getSubmittedId(formData, "blogs");
  let existing = null;

  try {
    existing = id
      ? await blogPostDelegate.findUnique({
          where: { id },
          select: {
            authorName: true,
            category: true,
            content: true,
            excerpt: true,
            featuredImageAlt: true,
            featuredImageUrl: true,
            id: true,
            lifecycleStatus: true,
            publishedAt: true,
            readTime: true,
            slug: true,
            title: true,
          },
        })
      : null;
  } catch (error) {
    if (isBlogSchemaCompatibilityError(error)) {
      return null;
    }

    throw error;
  }

  const rawTitle = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = asOptionalString(formData.get("category"));
  const authorName = asOptionalString(formData.get("authorName"));
  const readTime = asOptionalString(formData.get("readTime"));
  const featuredImageUrl = asOptionalString(formData.get("featuredImageUrl"));
  const featuredImageAlt = asOptionalString(formData.get("featuredImageAlt"));
  const publishedAtInput = asOptionalString(formData.get("publishedAt"));
  const publishedAt = parseOptionalDateValue(publishedAtInput);

  if (
    !existing &&
    !rawTitle &&
    !excerpt &&
    !content &&
    !category &&
    !authorName &&
    !readTime &&
    !featuredImageUrl &&
    !featuredImageAlt &&
    !publishedAtInput
  ) {
    return null;
  }

  try {
    const slug = await ensureUniqueSlug({
      baseSlug: slugify(rawTitle) || existing?.slug || createAutosaveSlug("blog-post-draft"),
      currentId: existing?.id,
      fallback: "blog-post-draft",
      findBySlug: (candidate) =>
        blogPostDelegate.findUnique({
          where: { slug: candidate },
          select: { id: true },
        }) as Promise<{ id: string } | null>,
    });

    const blogPost = existing
      ? await blogPostDelegate.update({
          where: { id: existing.id },
          data: {
            authorName,
            category: category || existing.category || "Blog",
            content,
            excerpt,
            featuredImageAlt,
            featuredImageUrl,
            lifecycleStatus: existing.lifecycleStatus ?? "DRAFT",
            publishedAt: publishedAt ?? existing.publishedAt ?? null,
            readTime,
            slug,
            title: getAutosaveTitle({
              rawTitle,
              existingTitle: existing.title,
              fallback: "Untitled blog post",
            }),
          },
        })
      : await blogPostDelegate.create({
          data: {
            authorName,
            category: category || "Blog",
            content,
            excerpt,
            featuredImageAlt,
            featuredImageUrl,
            lifecycleStatus: "DRAFT",
            publishedAt: publishedAt ?? null,
            readTime,
            slug,
            title: getAutosaveTitle({
              rawTitle,
              fallback: "Untitled blog post",
            }),
          },
        });

    return {
      path: getAutosavePath("/admin/blogs", blogPost.id),
      recordId: blogPost.id,
      savedAt: blogPost.updatedAt.toISOString(),
    };
  } catch (error) {
    if (isBlogSchemaCompatibilityError(error)) {
      return null;
    }

    throw error;
  }
};

export const autosaveCalculatorDraft = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "calculators");
  const existing = id
    ? await prisma.calculator.findUnique({
        where: { id },
        select: {
          id: true,
          lifecycleStatus: true,
          slug: true,
          title: true,
          calculatorType: true,
          shortDescription: true,
          disclaimer: true,
        },
      })
    : null;

  const rawTitle = String(formData.get("title") ?? "").trim();
  const shortDescription = asOptionalString(formData.get("shortDescription"));
  const disclaimer = String(formData.get("disclaimer") ?? "").trim();

  if (!existing && !rawTitle && !shortDescription && !disclaimer) {
    return null;
  }

  const slug = await ensureUniqueSlug({
    baseSlug: slugify(rawTitle) || existing?.slug || createAutosaveSlug("calculator-draft"),
    currentId: existing?.id,
    fallback: "calculator-draft",
    findBySlug: (candidate) =>
      prisma.calculator.findUnique({
        where: { slug: candidate },
        select: { id: true },
      }),
  });

  const calculator = existing
    ? await prisma.calculator.update({
        where: { id: existing.id },
        data: {
          title: getAutosaveTitle({
            rawTitle,
            existingTitle: existing.title,
            fallback: "Untitled calculator",
          }),
          slug,
          lifecycleStatus: existing.lifecycleStatus ?? "DRAFT",
          calculatorType: String(
            formData.get("calculatorType") ?? existing.calculatorType ?? "ROI",
          ),
          shortDescription,
          disclaimer,
        },
      })
    : await prisma.calculator.create({
        data: {
          title: getAutosaveTitle({
            rawTitle,
            fallback: "Untitled calculator",
          }),
          slug,
          lifecycleStatus: "DRAFT",
          calculatorType: String(formData.get("calculatorType") ?? "ROI"),
          shortDescription,
          disclaimer,
        },
      });

  return {
    path: getAutosavePath("/admin/calculators", calculator.id),
    recordId: calculator.id,
    savedAt: calculator.updatedAt.toISOString(),
  };
};

export const autosaveHomePageDraft = async (formData: FormData) => {
  await requireAdminSession();
  const aboutSectionImageUrl = asOptionalString(formData.get("aboutSectionImageUrl"));
  const testimonials = parseHomeTestimonials(formData);
  const managedImageError = getHomePageManagedImageError({
    aboutSectionImageUrl,
    testimonials,
  });

  if (managedImageError) {
    throw new Error(managedImageError);
  }

  const homePage = await prisma.homePage.upsert({
    where: { id: "home" },
    update: {
      heroHeadline: String(formData.get("heroHeadline") ?? "").trim(),
      heroSubheadline: String(formData.get("heroSubheadline") ?? "").trim(),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") ?? "").trim(),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") ?? "").trim(),
      heroSecondaryCtaLabel: asOptionalString(formData.get("heroSecondaryCtaLabel")),
      heroSecondaryCtaHref: asOptionalString(formData.get("heroSecondaryCtaHref")),
      aboutSectionTitle: asOptionalString(formData.get("aboutSectionTitle")),
      aboutSectionParagraphOne: asOptionalString(formData.get("aboutSectionParagraphOne")),
      aboutSectionParagraphTwo: asOptionalString(formData.get("aboutSectionParagraphTwo")),
      aboutSectionPrimaryCtaLabel: asOptionalString(formData.get("aboutSectionPrimaryCtaLabel")),
      aboutSectionPrimaryCtaHref: asOptionalString(formData.get("aboutSectionPrimaryCtaHref")),
      aboutSectionSecondaryCtaLabel: asOptionalString(formData.get("aboutSectionSecondaryCtaLabel")),
      aboutSectionSecondaryCtaHref: asOptionalString(formData.get("aboutSectionSecondaryCtaHref")),
      aboutSectionImageUrl,
      aboutSectionImageAlt: asOptionalString(formData.get("aboutSectionImageAlt")),
      metricsDisclaimer: asOptionalString(formData.get("metricsDisclaimer")),
      portfolioValueDisplay: asOptionalString(formData.get("portfolioValueDisplay")),
      portfolioCaption: asOptionalString(formData.get("portfolioCaption")),
    },
    create: {
      id: "home",
      heroHeadline: String(formData.get("heroHeadline") ?? "").trim(),
      heroSubheadline: String(formData.get("heroSubheadline") ?? "").trim(),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") ?? "").trim(),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") ?? "").trim(),
      heroSecondaryCtaLabel: asOptionalString(formData.get("heroSecondaryCtaLabel")),
      heroSecondaryCtaHref: asOptionalString(formData.get("heroSecondaryCtaHref")),
      aboutSectionTitle: asOptionalString(formData.get("aboutSectionTitle")),
      aboutSectionParagraphOne: asOptionalString(formData.get("aboutSectionParagraphOne")),
      aboutSectionParagraphTwo: asOptionalString(formData.get("aboutSectionParagraphTwo")),
      aboutSectionPrimaryCtaLabel: asOptionalString(formData.get("aboutSectionPrimaryCtaLabel")),
      aboutSectionPrimaryCtaHref: asOptionalString(formData.get("aboutSectionPrimaryCtaHref")),
      aboutSectionSecondaryCtaLabel: asOptionalString(formData.get("aboutSectionSecondaryCtaLabel")),
      aboutSectionSecondaryCtaHref: asOptionalString(formData.get("aboutSectionSecondaryCtaHref")),
      aboutSectionImageUrl,
      aboutSectionImageAlt: asOptionalString(formData.get("aboutSectionImageAlt")),
      metricsDisclaimer: asOptionalString(formData.get("metricsDisclaimer")),
      portfolioValueDisplay: asOptionalString(formData.get("portfolioValueDisplay")),
      portfolioCaption: asOptionalString(formData.get("portfolioCaption")),
    },
  });

  const metrics = parsePipeRows(asOptionalString(formData.get("metricsText")));
  const segments = parsePipeRows(asOptionalString(formData.get("segmentsText")));
  const platformCards = parsePipeRows(asOptionalString(formData.get("platformCardsText")));
  const caseHighlights = parsePipeRows(asOptionalString(formData.get("caseHighlightsText")));

  await prisma.homeMetric.deleteMany({ where: { homePageId: "home" } });
  await prisma.homeSegment.deleteMany({ where: { homePageId: "home" } });
  await prisma.homePlatformCard.deleteMany({ where: { homePageId: "home" } });
  await prisma.homeCaseHighlight.deleteMany({ where: { homePageId: "home" } });
  await prisma.homeTestimonial.deleteMany({ where: { homePageId: "home" } });

  if (metrics.length) {
    await prisma.homeMetric.createMany({
      data: metrics
        .filter((row) => row[0] && row[1])
        .map((row, index) => ({
          homePageId: "home",
          metricValue: row[0],
          metricLabel: row[1],
          sortOrder: index,
        })),
    });
  }

  if (segments.length) {
    await prisma.homeSegment.createMany({
      data: segments
        .filter((row) => row[0] && row[1] && row[2] && row[3])
        .map((row, index) => ({
          homePageId: "home",
          title: row[0],
          body: row[1],
          ctaLabel: row[2],
          ctaHref: row[3],
          sortOrder: index,
        })),
    });
  }

  if (platformCards.length) {
    await prisma.homePlatformCard.createMany({
      data: platformCards
        .filter((row) => row[0] && row[1] && row[2] && row[3])
        .map((row, index) => ({
          homePageId: "home",
          title: row[0],
          body: row[1],
          ctaLabel: row[2],
          ctaHref: row[3],
          sortOrder: index,
        })),
    });
  }

  if (caseHighlights.length) {
    await prisma.homeCaseHighlight.createMany({
      data: caseHighlights
        .filter((row) => row[0] && row[1] && row[2] && row[3])
        .map((row, index) => ({
          homePageId: "home",
          title: row[0],
          body: row[1],
          ctaLabel: row[2],
          ctaHref: row[3],
          sortOrder: index,
        })),
    });
  }

  if (testimonials.length) {
    await prisma.homeTestimonial.createMany({
      data: createHomeTestimonialRecords(testimonials),
    });
  }

  return {
    path: "/admin/pages/home",
    savedAt: homePage.updatedAt.toISOString(),
  };
};

export const autosaveSingletonPageDraft = async (formData: FormData) => {
  await requireAdminSession();

  const key = String(formData.get("key") ?? "");
  const currentPage = await getOrCreateSingletonPageRecord(key);

  if (!currentPage) {
    return null;
  }

  const page = await prisma.singletonPage.update({
    where: { key: key as never },
    data: {
      pageTitle: String(formData.get("pageTitle") ?? "").trim(),
      intro: asOptionalString(formData.get("intro")),
      disclaimer: asOptionalString(formData.get("disclaimer")),
      ctaLabel: asOptionalString(formData.get("ctaLabel")),
      ctaHref: asOptionalString(formData.get("ctaHref")),
      lifecycleStatus: "PUBLISHED",
    },
  });

  const groups = singletonPageGroups[key] ?? [];

  await prisma.singletonPageItem.deleteMany({
    where: { pageId: currentPage.id },
  });

  for (const group of groups) {
    const rows = parseSingletonPageGroupRows(
      group,
      asOptionalString(formData.get(`group_${group.key}`)),
    );
    if (!rows.length) {
      continue;
    }

    await prisma.singletonPageItem.createMany({
      data: rows.map((row, index) => ({
        pageId: currentPage.id,
        groupKey: group.key,
        title: row.title,
        body: row.body,
        sortOrder: index,
      })),
    });
  }

  return {
    path: `/admin/pages/${key}`,
    savedAt: page.updatedAt.toISOString(),
  };
};

export const autosaveFormDefinitionDraft = async (formData: FormData) => {
  await requireAdminSession();

  const id = await getSubmittedId(formData, "forms");
  const existing = id
    ? await prisma.formDefinition.findUnique({
        where: { id },
        select: {
          id: true,
          slug: true,
        },
      })
    : null;

  const formName = String(formData.get("formName") ?? "").trim();
  const successMessage = String(formData.get("successMessage") ?? "").trim();
  const linkedLoanProgramId = asOptionalString(formData.get("linkedLoanProgramId"));
  const fields = parseFormFieldsEditorValue(asOptionalString(formData.get("fieldsText")));

  if (!existing && !formName && !successMessage && !linkedLoanProgramId && !fields.length) {
    return null;
  }

  const slug = await ensureUniqueSlug({
    baseSlug: slugify(formName) || existing?.slug || createAutosaveSlug("form-draft"),
    currentId: existing?.id,
    fallback: "form-draft",
    findBySlug: (candidate) =>
      prisma.formDefinition.findUnique({
        where: { slug: candidate },
        select: { id: true },
      }),
  });

  const { savedForm: formRecord } = await persistFormDefinitionRecord({
    id: existing?.id,
    formName: getAutosaveTitle({
      rawTitle: formName,
      fallback: "Untitled form",
    }),
    slug,
    destination: String(formData.get("destination") ?? "EMAIL"),
    successMessage: successMessage || "Thank you. Our team will follow up shortly.",
    webhookUrl: asOptionalString(formData.get("webhookUrl")),
    linkedLoanProgramId,
    isActive: Boolean(formData.get("isActive")),
  });

  await replaceFormDefinitionFields(formRecord.id, fields);

  return {
    path: `/admin/forms/${formRecord.id}`,
    recordId: formRecord.id,
    savedAt: formRecord.updatedAt.toISOString(),
  };
};

export const deleteFormDefinition = async (formData: FormData) => {
  await requireAdminSession();
  const id = await getSubmittedId(formData, "forms");
  if (!id) return;

  const existing = await prisma.formDefinition.findUnique({ 
    where: { id },
    include: { linkedLoanProgram: { select: { slug: true } } }
  });
  
  await prisma.formDefinition.delete({ where: { id } });
  
  revalidatePath("/admin/forms");
  revalidatePath("/cash-offer");
  revalidatePath("/properties");
  revalidatePath("/investments");
  revalidatePath("/get-financing");
  
  if (existing?.slug) {
    revalidateFormCache(existing.slug);
  }
  if (existing?.linkedLoanProgram?.slug) {
    revalidatePath(`/get-financing/${existing.linkedLoanProgram.slug}`);
    revalidateLoanProgramCaches(existing.linkedLoanProgram.slug);
  }
  
  await redirectWithSuccessMessage("/admin/forms", "Form deleted successfully.", {
    title: "Form deleted",
  });
};
