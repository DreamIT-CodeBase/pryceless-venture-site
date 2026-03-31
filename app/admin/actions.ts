"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/authz";
import type { AdminFlash } from "@/lib/admin-flash";
import { singletonPageGroups } from "@/lib/content-blueprint";
import { prisma } from "@/lib/prisma";
import { asOptionalString, parseJson, slugify } from "@/lib/utils";

type UploadedImagePayload = {
  mediaFileId: string;
  blobUrl: string;
  fileName: string;
  altText?: string;
};

const dedupeUploadedImages = (images: UploadedImagePayload[]) => {
  const byMediaFileId = new Map<string, UploadedImagePayload>();

  for (const image of images) {
    const existing = byMediaFileId.get(image.mediaFileId);
    byMediaFileId.set(image.mediaFileId, {
      ...existing,
      ...image,
      altText: image.altText ?? existing?.altText,
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
  status: z.enum(["AVAILABLE", "COMING_SOON", "UNDER_CONTRACT", "SOLD", "ILLUSTRATIVE"]),
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

const calculatorSchema = baseEntitySchema.extend({
  calculatorType: z.enum(["ROI", "BRRRR", "MORTGAGE", "VALUE_ADD"]),
  shortDescription: z.string().optional(),
  disclaimer: z.string().min(10),
});

const formSchema = z.object({
  id: z.string(),
  formName: z.string().min(2),
  slug: z.string().min(2),
  destination: z.enum(["EMAIL", "CRM", "BOTH"]),
  successMessage: z.string().min(5),
  isActive: z.boolean(),
});

const parseSimpleLines = (value: string | undefined) =>
  (value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const parsePipeRows = (value: string | undefined) =>
  parseSimpleLines(value).map((line) => line.split("|").map((segment) => segment.trim()));

const parseImages = (formData: FormData) =>
  parseJson<UploadedImagePayload[]>(formData.get("imagesPayload"), []);

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
    status: String(formData.get("status") ?? ""),
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
  } catch (error) {
    await handleWriteError(error, editPath, "Case study");
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
  revalidatePath("/");
  revalidateTag("calculators", TAG_REVALIDATE_PROFILE);
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

  await prisma.calculator.delete({ where: { id } });
  revalidatePath("/admin/calculators");
  revalidatePath("/calculators");
  revalidateTag("calculators", TAG_REVALIDATE_PROFILE);
  await redirectWithSuccessMessage("/admin/calculators", "Calculator deleted successfully.", {
    title: "Calculator deleted",
  });
};

export const saveHomePage = async (formData: FormData) => {
  await requireAdminSession();

  await prisma.homePage.upsert({
    where: { id: "home" },
    update: {
      heroHeadline: String(formData.get("heroHeadline") ?? "").trim(),
      heroSubheadline: String(formData.get("heroSubheadline") ?? "").trim(),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") ?? "").trim(),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") ?? "").trim(),
      heroSecondaryCtaLabel: asOptionalString(formData.get("heroSecondaryCtaLabel")),
      heroSecondaryCtaHref: asOptionalString(formData.get("heroSecondaryCtaHref")),
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
      metricsDisclaimer: asOptionalString(formData.get("metricsDisclaimer")),
      portfolioValueDisplay: asOptionalString(formData.get("portfolioValueDisplay")),
      portfolioCaption: asOptionalString(formData.get("portfolioCaption")),
    },
  });

  const metrics = parsePipeRows(asOptionalString(formData.get("metricsText")));
  const segments = parsePipeRows(asOptionalString(formData.get("segmentsText")));
  const platformCards = parsePipeRows(asOptionalString(formData.get("platformCardsText")));
  const caseHighlights = parsePipeRows(asOptionalString(formData.get("caseHighlightsText")));
  const testimonials = parsePipeRows(asOptionalString(formData.get("testimonialsText")));

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
      data: testimonials
        .filter((row) => row[0] && row[1] && row[2])
        .map((row, index) => ({
          homePageId: "home",
          name: row[0],
          city: row[1],
          quote: row[2],
          avatarUrl: row[3] || undefined,
          sortOrder: index,
        })),
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
  const currentPage = await prisma.singletonPage.findUnique({
    where: { key: key as never },
    select: { id: true, routePath: true },
  });

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
    const lines = parseSimpleLines(asOptionalString(formData.get(`group_${group.key}`)));
    if (!lines.length) {
      continue;
    }

    await prisma.singletonPageItem.createMany({
      data: lines.map((title, index) => ({
        pageId: currentPage.id,
        groupKey: group.key,
        title,
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

  const id = (await getSubmittedId(formData, "forms")) ?? "";
  const existingForm = id
    ? await prisma.formDefinition.findUnique({
        where: { id },
        select: { slug: true },
      })
    : null;
  const parsed = formSchema.safeParse({
    id,
    formName: String(formData.get("formName") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? formData.get("formName") ?? "")),
    destination: String(formData.get("destination") ?? ""),
    successMessage: String(formData.get("successMessage") ?? "").trim(),
    isActive: Boolean(formData.get("isActive")),
  });

  if (!parsed.success) {
    await redirectWithValidationError(`/admin/forms/${id}`, parsed.error);
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

  const fieldRows = parsePipeRows(asOptionalString(formData.get("fieldsText")));

  try {
    await prisma.formDefinition.update({
      where: { id: formDataParsed.id },
      data: {
        formName: formDataParsed.formName,
        slug: formDataParsed.slug,
        destination: formDataParsed.destination,
        successMessage: formDataParsed.successMessage,
        isActive: formDataParsed.isActive,
      },
    });

    await prisma.formField.deleteMany({ where: { formDefinitionId: formDataParsed.id } });
    if (fieldRows.length) {
      await prisma.formField.createMany({
        data: fieldRows
          .filter((row) => row[0] && row[1] && row[2])
          .map((row, index) => ({
            formDefinitionId: formDataParsed.id,
            fieldKey: slugify(row[0]).replace(/-/g, "_"),
            label: row[1],
            type: (row[2] || "TEXT").toUpperCase() as
              | "TEXT"
              | "EMAIL"
              | "PHONE"
              | "SELECT"
              | "TEXTAREA",
            required: (row[3] || "").toLowerCase() === "true",
            sortOrder: index,
          })),
      });
    }
  } catch (error) {
    await handleWriteError(error, `/admin/forms/${id}`, "Form");
  }

  revalidatePath("/admin/forms");
  revalidatePath(`/admin/forms/${formDataParsed.id}`);
  revalidatePath("/cash-offer");
  revalidatePath("/capital-rates");
  revalidatePath("/properties");
  revalidatePath("/investments");
  revalidateFormCache(formDataParsed.slug);
  if (existingForm?.slug && existingForm.slug !== formDataParsed.slug) {
    revalidateFormCache(existingForm.slug);
  }
  await redirectWithSuccessMessage(`/admin/forms/${formDataParsed.id}`, "Form updated successfully.", {
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
          inquiryFormId: true,
        },
      })
    : null;

  const rawTitle = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const buyerFit = asOptionalString(formData.get("buyerFit"));
  const locationCity = asOptionalString(formData.get("locationCity"));
  const locationState = asOptionalString(formData.get("locationState"));
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
          status: String(formData.get("status") ?? existing.status ?? "AVAILABLE"),
          locationCity,
          locationState,
          propertyType: String(formData.get("propertyType") ?? existing.propertyType ?? "SFR"),
          strategy: String(formData.get("strategy") ?? existing.strategy ?? "FIX_FLIP"),
          summary,
          buyerFit,
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
          status: String(formData.get("status") ?? "AVAILABLE"),
          locationCity,
          locationState,
          propertyType: String(formData.get("propertyType") ?? "SFR"),
          strategy: String(formData.get("strategy") ?? "FIX_FLIP"),
          summary,
          buyerFit,
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

  if (
    !existing &&
    !rawTitle &&
    !overview &&
    !businessPlan &&
    !execution &&
    !outcomeSummary &&
    !assetProfileRows.length &&
    !takeaways.length
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

  return {
    path: getAutosavePath("/admin/case-studies", caseStudy.id),
    recordId: caseStudy.id,
    savedAt: caseStudy.updatedAt.toISOString(),
  };
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

  const homePage = await prisma.homePage.upsert({
    where: { id: "home" },
    update: {
      heroHeadline: String(formData.get("heroHeadline") ?? "").trim(),
      heroSubheadline: String(formData.get("heroSubheadline") ?? "").trim(),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") ?? "").trim(),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") ?? "").trim(),
      heroSecondaryCtaLabel: asOptionalString(formData.get("heroSecondaryCtaLabel")),
      heroSecondaryCtaHref: asOptionalString(formData.get("heroSecondaryCtaHref")),
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
      metricsDisclaimer: asOptionalString(formData.get("metricsDisclaimer")),
      portfolioValueDisplay: asOptionalString(formData.get("portfolioValueDisplay")),
      portfolioCaption: asOptionalString(formData.get("portfolioCaption")),
    },
  });

  const metrics = parsePipeRows(asOptionalString(formData.get("metricsText")));
  const segments = parsePipeRows(asOptionalString(formData.get("segmentsText")));
  const platformCards = parsePipeRows(asOptionalString(formData.get("platformCardsText")));
  const caseHighlights = parsePipeRows(asOptionalString(formData.get("caseHighlightsText")));
  const testimonials = parsePipeRows(asOptionalString(formData.get("testimonialsText")));

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
      data: testimonials
        .filter((row) => row[0] && row[1] && row[2])
        .map((row, index) => ({
          homePageId: "home",
          name: row[0],
          city: row[1],
          quote: row[2],
          avatarUrl: row[3] || undefined,
          sortOrder: index,
        })),
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
  const currentPage = await prisma.singletonPage.findUnique({
    where: { key: key as never },
    select: { id: true, updatedAt: true },
  });

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
    const lines = parseSimpleLines(asOptionalString(formData.get(`group_${group.key}`)));
    if (!lines.length) {
      continue;
    }

    await prisma.singletonPageItem.createMany({
      data: lines.map((title, index) => ({
        pageId: currentPage.id,
        groupKey: group.key,
        title,
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

  const id = (await getSubmittedId(formData, "forms")) ?? "";
  if (!id) {
    return null;
  }

  const existing = await prisma.formDefinition.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!existing) {
    return null;
  }

  const formName = String(formData.get("formName") ?? "").trim();
  const slug = await ensureUniqueSlug({
    baseSlug: slugify(formName) || existing.slug || createAutosaveSlug("form-draft"),
    currentId: existing.id,
    fallback: "form-draft",
    findBySlug: (candidate) =>
      prisma.formDefinition.findUnique({
        where: { slug: candidate },
        select: { id: true },
      }),
  });

  const formRecord = await prisma.formDefinition.update({
    where: { id: existing.id },
    data: {
      formName: getAutosaveTitle({
        rawTitle: formName,
        fallback: "Untitled form",
      }),
      slug,
      destination: String(formData.get("destination") ?? "EMAIL"),
      successMessage: String(formData.get("successMessage") ?? "").trim(),
      isActive: Boolean(formData.get("isActive")),
    },
  });

  const fieldRows = parsePipeRows(asOptionalString(formData.get("fieldsText")));
  await prisma.formField.deleteMany({ where: { formDefinitionId: existing.id } });
  if (fieldRows.length) {
    await prisma.formField.createMany({
      data: fieldRows
        .filter((row) => row[0] && row[1] && row[2])
        .map((row, index) => ({
          formDefinitionId: existing.id,
          fieldKey: slugify(row[0]).replace(/-/g, "_"),
          label: row[1],
          type: (row[2] || "TEXT").toUpperCase() as
            | "TEXT"
            | "EMAIL"
            | "PHONE"
            | "SELECT"
            | "TEXTAREA",
          required: (row[3] || "").toLowerCase() === "true",
          sortOrder: index,
        })),
    });
  }

  return {
    path: `/admin/forms/${existing.id}`,
    recordId: existing.id,
    savedAt: formRecord.updatedAt.toISOString(),
  };
};
