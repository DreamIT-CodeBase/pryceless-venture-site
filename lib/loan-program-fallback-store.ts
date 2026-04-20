import { promises as fs } from "node:fs";
import path from "node:path";

import { formDefinitionsSeed, loanProgramSeed } from "@/lib/content-blueprint";
import { slugify } from "@/lib/utils";

const seedFallbackTimestamp = new Date("2026-01-01T00:00:00.000Z");
const runtimeDataDirectory =
  process.env.PV_RUNTIME_DATA_DIR?.trim() ||
  path.join(process.cwd(), "data", "runtime");
const fallbackStorePath = path.join(runtimeDataDirectory, "loan-program-overrides.json");

type BaseLoanProgram = (typeof loanProgramSeed)[number];
type StoredLoanProgramHighlight = string;
type StoredLoanProgramOverviewItem = {
  body?: string | null;
  title: string;
};
const seedLoanProgramSlugs = new Set<string>(loanProgramSeed.map((program) => program.slug));

type StoredLoanProgramOverride = {
  id: string;
  baseSlug: string | null;
  slug: string;
  title: string;
  lifecycleStatus: string;
  titleTail?: string | null;
  heroBadgeOne?: string | null;
  heroBadgeTwo?: string | null;
  heroBadgeThree?: string | null;
  shortDescription: string;
  fullDescription: string;
  interestRate?: string | null;
  ltv?: string | null;
  loanTerm?: string | null;
  fees?: string | null;
  minAmount?: string | null;
  maxAmount?: string | null;
  keyHighlights?: string | null;
  highlightSubheadline?: string | null;
  insightTitle?: string | null;
  insightBody?: string | null;
  crmTag?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  highlightImageUrl?: string | null;
  highlightImageAlt?: string | null;
  highlights?: StoredLoanProgramHighlight[] | null;
  overviewItems?: StoredLoanProgramOverviewItem[] | null;
  isActive: boolean;
  sortOrder: number;
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FallbackLoanProgramRecord = {
  id: string;
  baseSlug: string | null;
  title: string;
  slug: string;
  lifecycleStatus: string;
  titleTail?: string | null;
  heroBadgeOne?: string | null;
  heroBadgeTwo?: string | null;
  heroBadgeThree?: string | null;
  shortDescription: string;
  fullDescription: string;
  interestRate?: string | null;
  ltv?: string | null;
  loanTerm?: string | null;
  fees?: string | null;
  minAmount?: string | null;
  maxAmount?: string | null;
  keyHighlights?: string | null;
  highlightSubheadline?: string | null;
  insightTitle?: string | null;
  insightBody?: string | null;
  crmTag?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  highlightImageUrl?: string | null;
  highlightImageAlt?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  highlights: Array<{
    highlight: string;
  }>;
  overviewItems: Array<{
    body: string | null;
    title: string;
  }>;
  forms: Array<{
    id: string;
    formName: string;
    isActive: boolean;
    slug: string;
  }>;
  isSeedFallback: true;
};

type UpsertFallbackLoanProgramInput = {
  id?: string;
  baseSlug?: string | null;
  title: string;
  slug: string;
  lifecycleStatus: string;
  titleTail?: string | null;
  heroBadgeOne?: string | null;
  heroBadgeTwo?: string | null;
  heroBadgeThree?: string | null;
  shortDescription: string;
  fullDescription: string;
  interestRate?: string | null;
  ltv?: string | null;
  loanTerm?: string | null;
  fees?: string | null;
  minAmount?: string | null;
  maxAmount?: string | null;
  keyHighlights?: string | null;
  highlightSubheadline?: string | null;
  insightTitle?: string | null;
  insightBody?: string | null;
  crmTag?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  highlightImageUrl?: string | null;
  highlightImageAlt?: string | null;
  highlights?: StoredLoanProgramHighlight[] | null;
  overviewItems?: StoredLoanProgramOverviewItem[] | null;
  isActive: boolean;
  sortOrder: number;
};

const localIdPrefix = "seed-local-";

const createLocalFallbackId = () =>
  `${localIdPrefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toStoredValue = (value?: string | null) => value ?? null;
const normalizeStoredHighlights = (
  value?: StoredLoanProgramHighlight[] | null,
) => value?.map((highlight) => highlight.trim()).filter(Boolean) ?? [];
const normalizeStoredOverviewItems = (
  value?: StoredLoanProgramOverviewItem[] | null,
) =>
  value
    ?.map((item) => ({
      body: item.body?.trim() || null,
      title: item.title.trim(),
    }))
    .filter((item) => item.title) ?? [];
const resolveBaseSlug = ({
  baseSlug,
  id,
  slug,
}: {
  baseSlug?: string | null;
  id: string;
  slug: string;
}) => {
  if (baseSlug) {
    return baseSlug;
  }

  if (id.startsWith("seed-") && !id.startsWith(localIdPrefix)) {
    return id.replace(/^seed-/, "");
  }

  return seedLoanProgramSlugs.has(slug) ? slug : null;
};

const toStoredRecord = (
  input: UpsertFallbackLoanProgramInput,
  existing?: StoredLoanProgramOverride,
): StoredLoanProgramOverride => {
  const nowIso = new Date().toISOString();
  const id = existing?.id ?? input.id ?? createLocalFallbackId();
  const baseSlug = resolveBaseSlug({
    baseSlug: existing?.baseSlug ?? input.baseSlug,
    id,
    slug: input.slug || existing?.slug || "",
  });

  return {
    id,
    baseSlug,
    slug: input.slug,
    title: input.title,
    lifecycleStatus: input.lifecycleStatus,
    titleTail: toStoredValue(input.titleTail),
    heroBadgeOne: toStoredValue(input.heroBadgeOne),
    heroBadgeTwo: toStoredValue(input.heroBadgeTwo),
    heroBadgeThree: toStoredValue(input.heroBadgeThree),
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    interestRate: toStoredValue(input.interestRate),
    ltv: toStoredValue(input.ltv),
    loanTerm: toStoredValue(input.loanTerm),
    fees: toStoredValue(input.fees),
    minAmount: toStoredValue(input.minAmount),
    maxAmount: toStoredValue(input.maxAmount),
    keyHighlights: toStoredValue(input.keyHighlights),
    highlightSubheadline: toStoredValue(input.highlightSubheadline),
    insightTitle: toStoredValue(input.insightTitle),
    insightBody: toStoredValue(input.insightBody),
    crmTag: toStoredValue(input.crmTag),
    imageUrl: toStoredValue(input.imageUrl),
    imageAlt: toStoredValue(input.imageAlt),
    highlightImageUrl: toStoredValue(input.highlightImageUrl),
    highlightImageAlt: toStoredValue(input.highlightImageAlt),
    highlights: normalizeStoredHighlights(input.highlights),
    overviewItems: normalizeStoredOverviewItems(input.overviewItems),
    isActive: input.isActive,
    sortOrder: input.sortOrder,
    deleted: false,
    createdAt: existing?.createdAt ?? nowIso,
    updatedAt: nowIso,
  };
};

const buildFormsForLoanProgram = (baseSlug: string | null) =>
  !baseSlug
    ? []
    : formDefinitionsSeed
        .filter(
          (definition) =>
            "linkedLoanProgramSlug" in definition &&
            definition.linkedLoanProgramSlug === baseSlug,
        )
        .map((definition) => ({
          formName: definition.formName,
          id: `seed-${definition.slug}`,
          isActive: true,
          slug: definition.slug,
        }));

const toFallbackRecord = (
  record: Omit<StoredLoanProgramOverride, "createdAt" | "updatedAt"> & {
    createdAt: string | Date;
    updatedAt: string | Date;
  },
): FallbackLoanProgramRecord => ({
  id: record.id,
  baseSlug: resolveBaseSlug(record),
  title: record.title,
  slug: record.slug,
  lifecycleStatus: record.lifecycleStatus,
  titleTail: record.titleTail ?? null,
  heroBadgeOne: record.heroBadgeOne ?? null,
  heroBadgeTwo: record.heroBadgeTwo ?? null,
  heroBadgeThree: record.heroBadgeThree ?? null,
  shortDescription: record.shortDescription,
  fullDescription: record.fullDescription,
  interestRate: record.interestRate ?? null,
  ltv: record.ltv ?? null,
  loanTerm: record.loanTerm ?? null,
  fees: record.fees ?? null,
  minAmount: record.minAmount ?? null,
  maxAmount: record.maxAmount ?? null,
  keyHighlights: record.keyHighlights ?? null,
  highlightSubheadline: record.highlightSubheadline ?? null,
  insightTitle: record.insightTitle ?? null,
  insightBody: record.insightBody ?? null,
  crmTag: record.crmTag ?? null,
  imageUrl: record.imageUrl ?? null,
  imageAlt: record.imageAlt ?? null,
  highlightImageUrl: record.highlightImageUrl ?? null,
  highlightImageAlt: record.highlightImageAlt ?? null,
  isActive: record.isActive,
  sortOrder: record.sortOrder,
  createdAt:
    record.createdAt instanceof Date ? record.createdAt : new Date(record.createdAt),
  updatedAt:
    record.updatedAt instanceof Date ? record.updatedAt : new Date(record.updatedAt),
  highlights: normalizeStoredHighlights(record.highlights).map((highlight) => ({
    highlight,
  })),
  overviewItems: normalizeStoredOverviewItems(record.overviewItems).map((item) => ({
    body: item.body ?? null,
    title: item.title,
  })),
  forms: buildFormsForLoanProgram(resolveBaseSlug(record)),
  isSeedFallback: true,
});

const createSeedFallbackRecord = (program: BaseLoanProgram): FallbackLoanProgramRecord =>
  toFallbackRecord({
    id: `seed-${program.slug}`,
    baseSlug: program.slug,
    title: program.title,
    slug: program.slug,
    lifecycleStatus: program.lifecycleStatus,
    titleTail: null,
    heroBadgeOne: null,
    heroBadgeTwo: null,
    heroBadgeThree: null,
    shortDescription: program.shortDescription,
    fullDescription: program.fullDescription,
    interestRate: program.interestRate ?? null,
    ltv: program.ltv ?? null,
    loanTerm: program.loanTerm ?? null,
    fees: program.fees ?? null,
    minAmount: program.minAmount ?? null,
    maxAmount: program.maxAmount ?? null,
    keyHighlights: program.keyHighlights ?? null,
    highlightSubheadline: null,
    insightTitle: null,
    insightBody: null,
    crmTag: program.crmTag ?? null,
    imageUrl: program.imageUrl ?? null,
    imageAlt: program.imageAlt ?? null,
    highlightImageUrl: null,
    highlightImageAlt: null,
    highlights:
      program.keyHighlights
        ?.split(/\r?\n/)
        .map((highlight) => highlight.trim())
        .filter(Boolean) ?? [],
    overviewItems: [],
    isActive: program.isActive,
    sortOrder: program.sortOrder,
    createdAt: seedFallbackTimestamp,
    updatedAt: seedFallbackTimestamp,
  });

const readFallbackStore = async (): Promise<StoredLoanProgramOverride[]> => {
  try {
    const fileContents = await fs.readFile(fallbackStorePath, "utf8");
    const parsed = JSON.parse(fileContents) as unknown;

    return Array.isArray(parsed)
      ? parsed.filter(
          (entry): entry is StoredLoanProgramOverride =>
            Boolean(entry) && typeof entry === "object" && "id" in entry,
        )
      : [];
  } catch (error) {
    const errorCode = (error as NodeJS.ErrnoException).code;
    if (errorCode === "ENOENT") {
      return [];
    }

    throw error;
  }
};

const writeFallbackStore = async (records: StoredLoanProgramOverride[]) => {
  await fs.mkdir(path.dirname(fallbackStorePath), { recursive: true });
  await fs.writeFile(fallbackStorePath, JSON.stringify(records, null, 2), "utf8");
};

const sortFallbackLoanPrograms = (programs: FallbackLoanProgramRecord[]) =>
  [...programs].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });

export const getFallbackLoanPrograms = async (): Promise<FallbackLoanProgramRecord[]> => {
  const overrides = await readFallbackStore();
  const remainingOverrides = [...overrides].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
  const mergedPrograms: FallbackLoanProgramRecord[] = [];

  for (const program of loanProgramSeed) {
    const override = remainingOverrides.find((record) => {
      const recordBaseSlug = resolveBaseSlug(record);
      return (
        record.id === `seed-${program.slug}` ||
        recordBaseSlug === program.slug ||
        record.slug === program.slug
      );
    });

    if (override?.deleted) {
      const overrideIndex = remainingOverrides.findIndex((record) => record.id === override.id);
      if (overrideIndex >= 0) {
        remainingOverrides.splice(overrideIndex, 1);
      }
      continue;
    }

    if (override) {
      mergedPrograms.push(toFallbackRecord(override));
      const overrideIndex = remainingOverrides.findIndex((record) => record.id === override.id);
      if (overrideIndex >= 0) {
        remainingOverrides.splice(overrideIndex, 1);
      }
      continue;
    }

    mergedPrograms.push(createSeedFallbackRecord(program));
  }

  for (const override of remainingOverrides) {
    if (override.deleted) {
      continue;
    }

    mergedPrograms.push(toFallbackRecord(override));
  }

  return sortFallbackLoanPrograms(mergedPrograms);
};

export const getFallbackLoanProgram = async (idOrSlug: string) => {
  const programs = await getFallbackLoanPrograms();

  return (
    programs.find(
      (program) =>
        program.id === idOrSlug ||
        program.slug === idOrSlug ||
        program.baseSlug === idOrSlug ||
        (program.baseSlug ? `seed-${program.baseSlug}` === idOrSlug : false),
    ) ?? null
  );
};

export const getFallbackLoanProgramsForSelect = async () =>
  (await getFallbackLoanPrograms()).map((program) => ({
    id: program.id,
    slug: program.slug,
    title: program.title,
  }));

export const getFallbackLoanProgramCount = async () =>
  (await getFallbackLoanPrograms()).length;

export const ensureUniqueFallbackLoanProgramSlug = async ({
  baseSlug,
  currentId,
}: {
  baseSlug: string;
  currentId?: string;
}) => {
  const normalizedBase = slugify(baseSlug) || "loan-program";
  const programs = await getFallbackLoanPrograms();
  let candidate = normalizedBase;
  let suffix = 2;

  while (
    programs.some(
      (program) => program.slug === candidate && program.id !== currentId,
    )
  ) {
    candidate = `${normalizedBase}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

export const upsertFallbackLoanProgram = async (
  input: UpsertFallbackLoanProgramInput,
) => {
  const records = await readFallbackStore();
  const existingIndex = input.id
    ? records.findIndex((record) => record.id === input.id)
    : -1;
  const existing =
    existingIndex >= 0 ? records[existingIndex] : undefined;

  const nextRecord = toStoredRecord(input, existing);

  if (existingIndex >= 0) {
    records[existingIndex] = nextRecord;
  } else {
    records.push(nextRecord);
  }

  await writeFallbackStore(records);

  return toFallbackRecord(nextRecord);
};

export const deleteFallbackLoanProgram = async (id: string) => {
  const programs = await getFallbackLoanPrograms();
  const existing = programs.find((program) => program.id === id);

  if (!existing) {
    return null;
  }

  const records = await readFallbackStore();
  const existingIndex = records.findIndex((record) => record.id === id);
  const nowIso = new Date().toISOString();

  if (existingIndex >= 0) {
    records[existingIndex] = {
      ...records[existingIndex],
      deleted: true,
      updatedAt: nowIso,
    };
  } else {
    records.push({
      id: existing.id,
      baseSlug: existing.baseSlug,
      slug: existing.slug,
      title: existing.title,
      lifecycleStatus: existing.lifecycleStatus,
      titleTail: existing.titleTail ?? null,
      heroBadgeOne: existing.heroBadgeOne ?? null,
      heroBadgeTwo: existing.heroBadgeTwo ?? null,
      heroBadgeThree: existing.heroBadgeThree ?? null,
      shortDescription: existing.shortDescription,
      fullDescription: existing.fullDescription,
      interestRate: existing.interestRate ?? null,
      ltv: existing.ltv ?? null,
      loanTerm: existing.loanTerm ?? null,
      fees: existing.fees ?? null,
      minAmount: existing.minAmount ?? null,
      maxAmount: existing.maxAmount ?? null,
      keyHighlights: existing.keyHighlights ?? null,
      highlightSubheadline: existing.highlightSubheadline ?? null,
      insightTitle: existing.insightTitle ?? null,
      insightBody: existing.insightBody ?? null,
      crmTag: existing.crmTag ?? null,
      imageUrl: existing.imageUrl ?? null,
      imageAlt: existing.imageAlt ?? null,
      highlightImageUrl: existing.highlightImageUrl ?? null,
      highlightImageAlt: existing.highlightImageAlt ?? null,
      highlights: existing.highlights.map((item) => item.highlight),
      overviewItems: existing.overviewItems,
      isActive: existing.isActive,
      sortOrder: existing.sortOrder,
      deleted: true,
      createdAt: existing.createdAt.toISOString(),
      updatedAt: nowIso,
    });
  }

  await writeFallbackStore(records);

  return existing;
};
