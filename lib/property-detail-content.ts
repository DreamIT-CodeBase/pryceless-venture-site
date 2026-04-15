import { z } from "zod";

export type PropertyDetailStandoutItem = {
  title: string;
  description: string;
};

export type PropertyDetailContent = {
  googleMapsUrl: string | null;
  investorProfile: string[];
  locationBenefits: string[];
  performance: {
    capRate: string | null;
    investmentHorizon: string | null;
    monthlyCashFlow: string | null;
    roi: string | null;
  };
  snapshot: {
    arv: string | null;
    estimatedRent: string | null;
    purchasePrice: string | null;
    renovationCost: string | null;
  };
  standoutItems: PropertyDetailStandoutItem[];
};

const optionalString = z.string().optional().nullable();

const propertyDetailContentSchema = z.object({
  googleMapsUrl: optionalString,
  investorProfile: z.array(z.string()).optional(),
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

const createEmptyContent = (): PropertyDetailContent => ({
  googleMapsUrl: null,
  investorProfile: [],
  locationBenefits: [],
  performance: {
    capRate: null,
    investmentHorizon: null,
    monthlyCashFlow: null,
    roi: null,
  },
  snapshot: {
    arv: null,
    estimatedRent: null,
    purchasePrice: null,
    renovationCost: null,
  },
  standoutItems: [],
});

export const parsePropertyDetailContent = (
  value: string | null | undefined,
): PropertyDetailContent => {
  if (!value) {
    return createEmptyContent();
  }

  try {
    const parsedValue = propertyDetailContentSchema.safeParse(JSON.parse(value));
    if (!parsedValue.success) {
      return createEmptyContent();
    }

    return {
      googleMapsUrl: normalizeOptionalString(parsedValue.data.googleMapsUrl),
      investorProfile: normalizeStringList(parsedValue.data.investorProfile),
      locationBenefits: normalizeStringList(parsedValue.data.locationBenefits),
      performance: {
        capRate: normalizeOptionalString(parsedValue.data.performance?.capRate),
        investmentHorizon: normalizeOptionalString(
          parsedValue.data.performance?.investmentHorizon,
        ),
        monthlyCashFlow: normalizeOptionalString(
          parsedValue.data.performance?.monthlyCashFlow,
        ),
        roi: normalizeOptionalString(parsedValue.data.performance?.roi),
      },
      snapshot: {
        arv: normalizeOptionalString(parsedValue.data.snapshot?.arv),
        estimatedRent: normalizeOptionalString(parsedValue.data.snapshot?.estimatedRent),
        purchasePrice: normalizeOptionalString(parsedValue.data.snapshot?.purchasePrice),
        renovationCost: normalizeOptionalString(parsedValue.data.snapshot?.renovationCost),
      },
      standoutItems: normalizeStandoutItems(parsedValue.data.standoutItems),
    };
  } catch {
    return createEmptyContent();
  }
};

export const stringifyPropertyDetailContent = (
  value: Partial<PropertyDetailContent> | null | undefined,
) => {
  const content = {
    googleMapsUrl: normalizeOptionalString(value?.googleMapsUrl),
    investorProfile: normalizeStringList(value?.investorProfile),
    locationBenefits: normalizeStringList(value?.locationBenefits),
    performance: {
      capRate: normalizeOptionalString(value?.performance?.capRate),
      investmentHorizon: normalizeOptionalString(value?.performance?.investmentHorizon),
      monthlyCashFlow: normalizeOptionalString(value?.performance?.monthlyCashFlow),
      roi: normalizeOptionalString(value?.performance?.roi),
    },
    snapshot: {
      arv: normalizeOptionalString(value?.snapshot?.arv),
      estimatedRent: normalizeOptionalString(value?.snapshot?.estimatedRent),
      purchasePrice: normalizeOptionalString(value?.snapshot?.purchasePrice),
      renovationCost: normalizeOptionalString(value?.snapshot?.renovationCost),
    },
    standoutItems: normalizeStandoutItems(value?.standoutItems),
  };

  const hasContent =
    content.googleMapsUrl ||
    content.investorProfile.length ||
    content.locationBenefits.length ||
    Object.values(content.performance).some(Boolean) ||
    Object.values(content.snapshot).some(Boolean) ||
    content.standoutItems.length;

  return hasContent ? JSON.stringify(content) : null;
};

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
