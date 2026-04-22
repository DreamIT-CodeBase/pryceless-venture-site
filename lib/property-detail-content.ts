import { z } from "zod";

import {
  getPropertyTemplateMetricDefinition,
  normalizePropertyDealType,
  normalizePropertyTemplateMetricKey,
  type PropertyDealType,
} from "@/lib/property-templates";
import { titleCase } from "@/lib/utils";

export type PropertyDetailStandoutItem = {
  description: string;
  title: string;
};

export type PropertyDetailMetric = {
  key: string;
  label: string;
  value: string;
};

export type PropertyDetailNarrative = {
  bulletPoints: string[];
  leadParagraph: string | null;
  supportParagraphs: string[];
};

export type PropertyDetailContent = {
  googleMapsUrl: string | null;
  locationBenefits: string[];
  narrative: PropertyDetailNarrative;
  overviewBulletPoints: string[];
  overviewShortDescription: string | null;
  overviewTitle: string | null;
  rawDescription: string | null;
  standoutItems: PropertyDetailStandoutItem[];
  templateMetrics: PropertyDetailMetric[];
  timelineLabel: string | null;
  templateType: PropertyDealType | null;
  version: 2;
};

type LegacyPropertyDetailContent = {
  googleMapsUrl?: string | null;
  locationBenefits?: Array<string | null | undefined>;
  performance?: {
    capRate?: string | null;
    investmentHorizon?: string | null;
    monthlyCashFlow?: string | null;
    roi?: string | null;
  };
  snapshot?: {
    arv?: string | null;
    estimatedRent?: string | null;
    purchasePrice?: string | null;
    renovationCost?: string | null;
  };
  standoutItems?: Array<Partial<PropertyDetailStandoutItem>>;
};

type PropertyDescriptionDerivatives = {
  bulletPoints: string[];
  leadParagraph: string | null;
  metrics: PropertyDetailMetric[];
  standoutItems: PropertyDetailStandoutItem[];
  supportParagraphs: string[];
};

type PropertyDetailContentInput = {
  googleMapsUrl?: string | null;
  locationBenefits?: Array<string | null | undefined>;
  narrative?: Partial<PropertyDetailNarrative> | null;
  overviewBulletPoints?: Array<string | null | undefined>;
  overviewShortDescription?: string | null;
  overviewTitle?: string | null;
  rawDescription?: string | null;
  standoutItems?: Array<Partial<PropertyDetailStandoutItem>> | null;
  templateMetrics?: Array<Partial<PropertyDetailMetric>> | null;
  timelineLabel?: string | null;
  templateType?: string | null;
  version?: number | null;
};

const optionalString = z.string().optional().nullable();

const propertyDetailMetricSchema = z.object({
  key: optionalString,
  label: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
});

const propertyDetailNarrativeSchema = z.object({
  bulletPoints: z.array(z.string()).optional(),
  leadParagraph: optionalString,
  supportParagraphs: z.array(z.string()).optional(),
});

const propertyDetailContentSchema = z.object({
  googleMapsUrl: optionalString,
  locationBenefits: z.array(z.string()).optional(),
  narrative: propertyDetailNarrativeSchema.optional(),
  overviewBulletPoints: z.array(z.string()).optional(),
  overviewShortDescription: optionalString,
  overviewTitle: optionalString,
  rawDescription: optionalString,
  standoutItems: z
    .array(
      z.object({
        description: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
  templateMetrics: z.array(propertyDetailMetricSchema).optional(),
  timelineLabel: optionalString,
  templateType: optionalString,
  version: z.number().optional(),
});

const legacyPropertyDetailContentSchema = z.object({
  googleMapsUrl: optionalString,
  locationBenefits: z.array(z.string()).optional(),
  performance: z
    .object({
      capRate: optionalString,
      investmentHorizon: optionalString,
      monthlyCashFlow: optionalString,
      roi: optionalString,
    })
    .optional(),
  snapshot: z
    .object({
      arv: optionalString,
      estimatedRent: optionalString,
      purchasePrice: optionalString,
      renovationCost: optionalString,
    })
    .optional(),
  standoutItems: z
    .array(
      z.object({
        description: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
});

const normalizeOptionalString = (value: string | null | undefined) => {
  const trimmedValue = String(value ?? "").trim();
  return trimmedValue ? trimmedValue : null;
};

const normalizeStringList = (value: Array<string | null | undefined> | null | undefined) =>
  (value ?? [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);

const normalizeStandoutItems = (
  value: Array<Partial<PropertyDetailStandoutItem>> | null | undefined,
) =>
  (value ?? [])
    .map((item) => ({
      description: String(item.description ?? "").trim(),
      title: String(item.title ?? "").trim(),
    }))
    .filter((item) => item.title && item.description)
    .slice(0, 4);

const normalizeMetricLabel = (value: string | null | undefined) => {
  const trimmedValue = String(value ?? "").trim();
  if (!trimmedValue) {
    return "";
  }

  const definition = getPropertyTemplateMetricDefinition(trimmedValue);
  return definition?.label ?? trimmedValue;
};

const normalizeMetricKey = (key: string | null | undefined, label: string | null | undefined) => {
  const definition = getPropertyTemplateMetricDefinition(key || label);
  if (definition) {
    return definition.key;
  }

  return normalizePropertyTemplateMetricKey(key || label);
};

const normalizeMetrics = (value: Array<Partial<PropertyDetailMetric>> | null | undefined) => {
  const metrics: PropertyDetailMetric[] = [];
  const seenKeys = new Set<string>();

  for (const item of value ?? []) {
    const metricValue = String(item.value ?? "").trim();
    const metricLabel = normalizeMetricLabel(item.label ?? item.key);
    const metricKey = normalizeMetricKey(item.key, item.label);

    if (!metricValue || !metricLabel || !metricKey || seenKeys.has(metricKey)) {
      continue;
    }

    seenKeys.add(metricKey);
    metrics.push({
      key: metricKey,
      label: metricLabel,
      value: metricValue,
    });
  }

  return metrics;
};

const mergeMetrics = (
  primary: Array<Partial<PropertyDetailMetric>> | null | undefined,
  fallback: Array<Partial<PropertyDetailMetric>> | null | undefined,
) => {
  const merged = new Map<string, PropertyDetailMetric>();

  for (const item of [...normalizeMetrics(primary), ...normalizeMetrics(fallback)]) {
    if (!merged.has(item.key)) {
      merged.set(item.key, item);
    }
  }

  return Array.from(merged.values());
};

const createEmptyNarrative = (): PropertyDetailNarrative => ({
  bulletPoints: [],
  leadParagraph: null,
  supportParagraphs: [],
});

const createEmptyContent = (): PropertyDetailContent => ({
  googleMapsUrl: null,
  locationBenefits: [],
  narrative: createEmptyNarrative(),
  overviewBulletPoints: [],
  overviewShortDescription: null,
  overviewTitle: null,
  rawDescription: null,
  standoutItems: [],
  templateMetrics: [],
  timelineLabel: null,
  templateType: null,
  version: 2,
});

const metricValuePattern =
  /[$%]|\d|^\d+(?:\.\d+)?x$|\b(month|months|year|years|week|weeks|day|days|acre|acres|unit|units|sq|sqft|sf|roi|profit|price|rent|noi)\b/i;

const bulletPrefixPattern = /^([-*•]|\d+\.)\s+/;

const createMetric = (label: string, value: string): PropertyDetailMetric => {
  const definition = getPropertyTemplateMetricDefinition(label);
  const metricKey = definition?.key ?? normalizeMetricKey(null, label);

  return {
    key: metricKey || normalizeMetricKey(null, label),
    label: definition?.label ?? label.trim(),
    value: value.trim(),
  };
};

const normalizeParagraphText = (value: string) =>
  value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

const classifyInlineRow = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const pipeIndex = trimmedValue.indexOf("|");
  if (pipeIndex >= 0) {
    const label = trimmedValue.slice(0, pipeIndex).trim();
    const detail = trimmedValue.slice(pipeIndex + 1).trim();

    if (!label || !detail) {
      return null;
    }

    if (
      getPropertyTemplateMetricDefinition(label) ||
      getPropertyTemplateMetricDefinition(detail) ||
      metricValuePattern.test(detail)
    ) {
      return { kind: "metric" as const, metric: createMetric(label, detail) };
    }

    return {
      item: {
        description: detail,
        title: label,
      },
      kind: "standout" as const,
    };
  }

  const colonMatch = trimmedValue.match(/^([^:]{2,50}):\s+(.+)$/);
  if (!colonMatch) {
    return null;
  }

  const [, label, detail] = colonMatch;
  if (!label || !detail) {
    return null;
  }

  if (getPropertyTemplateMetricDefinition(label) || metricValuePattern.test(detail)) {
    return { kind: "metric" as const, metric: createMetric(label, detail) };
  }

  return null;
};

export const derivePropertyDescriptionContent = (
  value: string | null | undefined,
): PropertyDescriptionDerivatives => {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return {
      bulletPoints: [],
      leadParagraph: null,
      metrics: [],
      standoutItems: [],
      supportParagraphs: [],
    };
  }

  const metrics: PropertyDetailMetric[] = [];
  const standoutItems: PropertyDetailStandoutItem[] = [];
  const bulletPoints: string[] = [];
  const paragraphs: string[] = [];

  const blocks = rawValue
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const flushParagraph = (lines: string[]) => {
    const paragraph = normalizeParagraphText(lines.join(" "));
    if (paragraph) {
      paragraphs.push(paragraph);
    }
  };

  for (const block of blocks) {
    const lines = block
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const paragraphLines: string[] = [];

    for (const line of lines) {
      const bulletMatch = line.match(bulletPrefixPattern);
      if (bulletMatch) {
        flushParagraph(paragraphLines);
        paragraphLines.length = 0;

        const bulletText = line.replace(bulletPrefixPattern, "").trim();
        if (bulletText) {
          bulletPoints.push(bulletText);
        }
        continue;
      }

      const inlineRow = classifyInlineRow(line);
      if (inlineRow?.kind === "metric") {
        flushParagraph(paragraphLines);
        paragraphLines.length = 0;
        metrics.push(inlineRow.metric);
        continue;
      }

      if (inlineRow?.kind === "standout") {
        flushParagraph(paragraphLines);
        paragraphLines.length = 0;
        standoutItems.push(inlineRow.item);
        continue;
      }

      paragraphLines.push(line);
    }

    flushParagraph(paragraphLines);
  }

  return {
    bulletPoints,
    leadParagraph: paragraphs[0] ?? null,
    metrics: normalizeMetrics(metrics),
    standoutItems: normalizeStandoutItems(standoutItems),
    supportParagraphs: paragraphs.slice(1),
  };
};

const getNarrativeFromSources = ({
  derived,
  stored,
}: {
  derived: PropertyDescriptionDerivatives;
  stored?: Partial<PropertyDetailNarrative> | null;
}): PropertyDetailNarrative => ({
  bulletPoints: derived.bulletPoints.length
    ? derived.bulletPoints
    : normalizeStringList(stored?.bulletPoints),
  leadParagraph:
    derived.leadParagraph ?? normalizeOptionalString(stored?.leadParagraph) ?? null,
  supportParagraphs: derived.supportParagraphs.length
    ? derived.supportParagraphs
    : normalizeStringList(stored?.supportParagraphs),
});

const createContentFromLegacyShape = (
  value: LegacyPropertyDetailContent | null | undefined,
): PropertyDetailContent => ({
  ...createEmptyContent(),
  googleMapsUrl: normalizeOptionalString(value?.googleMapsUrl),
  locationBenefits: normalizeStringList(value?.locationBenefits),
  standoutItems: normalizeStandoutItems(value?.standoutItems),
  templateMetrics: normalizeMetrics([
    {
      key: "annualizedRoi",
      label: "ROI",
      value: value?.performance?.roi,
    },
    {
      key: "capRate",
      label: "Cap Rate",
      value: value?.performance?.capRate,
    },
    {
      key: "noi",
      label: "Monthly Cash Flow",
      value: value?.performance?.monthlyCashFlow,
    },
    {
      key: "holdTime",
      label: "Investment Horizon",
      value: value?.performance?.investmentHorizon,
    },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      value: value?.snapshot?.purchasePrice,
    },
    {
      key: "estimatedRent",
      label: "Estimated Rent",
      value: value?.snapshot?.estimatedRent,
    },
    {
      key: "rehabBudget",
      label: "Rehab Budget",
      value: value?.snapshot?.renovationCost,
    },
    {
      key: "arv",
      label: "ARV",
      value: value?.snapshot?.arv,
    },
  ]),
});

const normalizePropertyDetailContent = (
  value: PropertyDetailContentInput | null | undefined,
): PropertyDetailContent => {
  const rawDescription = normalizeOptionalString(value?.rawDescription);
  const derivedDescription = derivePropertyDescriptionContent(rawDescription);
  const storedStandoutItems = normalizeStandoutItems(value?.standoutItems);

  return {
    googleMapsUrl: normalizeOptionalString(value?.googleMapsUrl),
    locationBenefits: normalizeStringList(value?.locationBenefits),
    narrative: getNarrativeFromSources({
      derived: derivedDescription,
      stored: value?.narrative,
    }),
    overviewBulletPoints: normalizeStringList(value?.overviewBulletPoints),
    overviewShortDescription: normalizeOptionalString(value?.overviewShortDescription),
    overviewTitle: normalizeOptionalString(value?.overviewTitle),
    rawDescription,
    standoutItems: storedStandoutItems.length
      ? storedStandoutItems
      : derivedDescription.standoutItems,
    templateMetrics: mergeMetrics(value?.templateMetrics, derivedDescription.metrics),
    timelineLabel: normalizeOptionalString(value?.timelineLabel),
    templateType: normalizePropertyDealType(value?.templateType),
    version: 2,
  };
};

export const parsePropertyDetailContent = (
  value: string | null | undefined,
): PropertyDetailContent => {
  if (!value) {
    return createEmptyContent();
  }

  try {
    const parsedJson = JSON.parse(value);
    const parsedValue = propertyDetailContentSchema.safeParse(parsedJson);

    if (parsedValue.success) {
      return normalizePropertyDetailContent(parsedValue.data);
    }

    const legacyValue = legacyPropertyDetailContentSchema.safeParse(parsedJson);
    if (legacyValue.success) {
      return createContentFromLegacyShape(legacyValue.data);
    }

    return createEmptyContent();
  } catch {
    return createEmptyContent();
  }
};

export const stringifyPropertyDetailContent = (
  value: Partial<PropertyDetailContent> | null | undefined,
) => {
  const content = normalizePropertyDetailContent(value);

  const hasContent =
    content.googleMapsUrl ||
    content.rawDescription ||
    content.locationBenefits.length ||
    content.narrative.leadParagraph ||
    content.narrative.supportParagraphs.length ||
    content.narrative.bulletPoints.length ||
    content.overviewBulletPoints.length ||
    content.overviewShortDescription ||
    content.overviewTitle ||
    content.standoutItems.length ||
    content.templateMetrics.length ||
    content.timelineLabel ||
    content.templateType;

  return hasContent ? JSON.stringify(content) : null;
};

export const getPropertyDetailMetricValue = (
  metrics: Array<PropertyDetailMetric | null | undefined> | null | undefined,
  keyOrLabel: string | null | undefined,
) => {
  const normalizedKey = normalizeMetricKey(keyOrLabel, keyOrLabel);
  const normalizedLabel = normalizeMetricLabel(keyOrLabel);

  for (const metric of normalizeMetrics(metrics)) {
    if (
      metric.key === normalizedKey ||
      normalizePropertyTemplateMetricKey(metric.label) ===
        normalizePropertyTemplateMetricKey(normalizedLabel)
    ) {
      return metric.value;
    }
  }

  return null;
};

export const getPropertyDetailMetricMap = (
  metrics: Array<PropertyDetailMetric | null | undefined> | null | undefined,
) =>
  new Map(
    normalizeMetrics(metrics).flatMap((metric) => [
      [metric.key, metric.value] as const,
      [normalizePropertyTemplateMetricKey(metric.label), metric.value] as const,
    ]),
  );

export const formatPropertyStandoutItemsForEditor = (
  items: Array<PropertyDetailStandoutItem | null | undefined>,
) =>
  items
    .map((item) => {
      const title = String(item?.title ?? "").trim();
      const description = String(item?.description ?? "").trim();
      return title && description ? `${title} | ${description}` : "";
    })
    .filter(Boolean)
    .join("\n");

export const formatPropertyStringListForEditor = (
  items: Array<string | null | undefined> | null | undefined,
) => normalizeStringList(items).join("\n");

export const formatPropertyMetricsForEditor = (
  metrics: Array<PropertyDetailMetric | null | undefined> | null | undefined,
) =>
  normalizeMetrics(metrics)
    .map((item) => `${item.label} | ${item.value}`)
    .join("\n");

export const getPropertyMetricFallbackLabel = (value: string | null | undefined) => {
  const definition = getPropertyTemplateMetricDefinition(value);
  if (definition) {
    return definition.label;
  }

  const normalizedValue = String(value ?? "").trim();
  return normalizedValue ? titleCase(normalizedValue) : "";
};

const createMapQueryUrl = (query: string, outputMode: "embed" | "open") => {
  if (outputMode === "embed") {
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const resolveGoogleMapsUrl = (
  value: string | null | undefined,
  outputMode: "embed" | "open",
) => {
  const trimmedValue = String(value ?? "").trim();
  if (!trimmedValue) {
    return null;
  }

  try {
    const url = new URL(trimmedValue);

    if (!url.hostname.includes("google.")) {
      return outputMode === "open" ? trimmedValue : null;
    }

    const queryValue =
      url.searchParams.get("q")?.trim() || url.searchParams.get("query")?.trim();
    if (queryValue) {
      return createMapQueryUrl(queryValue, outputMode);
    }

    if (outputMode === "embed") {
      url.searchParams.set("output", "embed");
      return url.toString();
    }

    return url.toString();
  } catch {
    return createMapQueryUrl(trimmedValue, outputMode);
  }
};

export const getPropertyGoogleMapsEmbedUrl = (
  mapUrl: string | null | undefined,
  fallbackQuery?: string | null,
) => resolveGoogleMapsUrl(mapUrl || fallbackQuery, "embed");

export const getPropertyGoogleMapsOpenUrl = (
  mapUrl: string | null | undefined,
  fallbackQuery?: string | null,
) => resolveGoogleMapsUrl(mapUrl || fallbackQuery, "open");
