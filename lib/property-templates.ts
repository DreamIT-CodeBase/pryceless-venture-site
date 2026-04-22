import { titleCase } from "@/lib/utils";

export const propertyDealTypeValues = ["FIX_FLIP", "BUY_HOLD", "WHOLESALE"] as const;

export type PropertyDealType = (typeof propertyDealTypeValues)[number];

export type PropertyTemplateMetricKey =
  | "purchasePrice"
  | "rehabBudget"
  | "holdTime"
  | "arv"
  | "grossProfit"
  | "capitalPartnerProfit"
  | "annualizedRoi"
  | "capitalPartnerRoi"
  | "cashInvested"
  | "noi"
  | "capitalPartnerReturn"
  | "salePrice";

export type PropertyTemplateMetricDefinition = {
  key: PropertyTemplateMetricKey;
  label: string;
  placeholder: string;
};

export type PropertyTemplateConfig = {
  detailMetricKeys: PropertyTemplateMetricKey[];
  heroMetricKeys: PropertyTemplateMetricKey[];
  helperText: string;
  label: string;
  queryValue: string;
  value: PropertyDealType;
};

export const propertyTemplateMetricDefinitions: Record<
  PropertyTemplateMetricKey,
  PropertyTemplateMetricDefinition
> = {
  purchasePrice: {
    key: "purchasePrice",
    label: "Purchase Price",
    placeholder: "$470,000",
  },
  rehabBudget: {
    key: "rehabBudget",
    label: "Rehab Budget",
    placeholder: "$45,000",
  },
  holdTime: {
    key: "holdTime",
    label: "Hold Time",
    placeholder: "3 Months",
  },
  arv: {
    key: "arv",
    label: "ARV",
    placeholder: "$585,000",
  },
  grossProfit: {
    key: "grossProfit",
    label: "Gross Profit",
    placeholder: "$70,000",
  },
  capitalPartnerProfit: {
    key: "capitalPartnerProfit",
    label: "Capital Partner Profit",
    placeholder: "$35,000",
  },
  annualizedRoi: {
    key: "annualizedRoi",
    label: "Annualized ROI",
    placeholder: "68.3%",
  },
  capitalPartnerRoi: {
    key: "capitalPartnerRoi",
    label: "Capital Partner ROI",
    placeholder: "34.1%",
  },
  cashInvested: {
    key: "cashInvested",
    label: "Cash Invested",
    placeholder: "$150,000",
  },
  noi: {
    key: "noi",
    label: "NOI",
    placeholder: "$14,670 / month",
  },
  capitalPartnerReturn: {
    key: "capitalPartnerReturn",
    label: "Capital Partner Return",
    placeholder: "$22,000 / year",
  },
  salePrice: {
    key: "salePrice",
    label: "Sale Price",
    placeholder: "$1,150,000",
  },
};

export const propertyTemplateConfigs: PropertyTemplateConfig[] = [
  {
    detailMetricKeys: [
      "holdTime",
      "capitalPartnerProfit",
      "annualizedRoi",
      "capitalPartnerRoi",
    ],
    heroMetricKeys: ["purchasePrice", "rehabBudget", "arv", "grossProfit"],
    helperText:
      "Capture the acquisition, rehab, exit, and partner-return numbers that power a fix and flip story.",
    label: "Fix & Flip",
    queryValue: "fix-flip",
    value: "FIX_FLIP",
  },
  {
    detailMetricKeys: ["capitalPartnerRoi"],
    heroMetricKeys: [
      "purchasePrice",
      "cashInvested",
      "noi",
      "capitalPartnerReturn",
    ],
    helperText:
      "Focus on the hold basis, operating income, and partner return story for long-term rental deals.",
    label: "Buy & Hold",
    queryValue: "buy-hold",
    value: "BUY_HOLD",
  },
  {
    detailMetricKeys: ["holdTime"],
    heroMetricKeys: ["purchasePrice", "cashInvested", "salePrice", "grossProfit"],
    helperText:
      "Track the contract basis, cash in, resale basis, timeline, and profit for wholesale deals.",
    label: "Wholesale",
    queryValue: "wholesale",
    value: "WHOLESALE",
  },
] as const;

export const propertyTemplateConfigMap = Object.fromEntries(
  propertyTemplateConfigs.map((config) => [config.value, config]),
) as Record<PropertyDealType, PropertyTemplateConfig>;

export const propertyTemplateQueryValueMap = Object.fromEntries(
  propertyTemplateConfigs.map((config) => [config.value, config.queryValue]),
) as Record<PropertyDealType, string>;

export const propertyTemplateQueryMap = Object.fromEntries(
  propertyTemplateConfigs.map((config) => [config.queryValue, config.value]),
) as Record<string, PropertyDealType>;

export const propertyDealTypeOptions = propertyTemplateConfigs.map((config) => ({
  label: config.label,
  value: config.value,
})) as ReadonlyArray<{ label: string; value: PropertyDealType }>;

const propertyMetricAliasMap: Record<string, PropertyTemplateMetricKey> = {
  annualizedroi: "annualizedRoi",
  arv: "arv",
  capitalpartnerprofit: "capitalPartnerProfit",
  capitalpartnerreturn: "capitalPartnerReturn",
  capitalpartnerroi: "capitalPartnerRoi",
  cashinvested: "cashInvested",
  grossprofit: "grossProfit",
  holdtime: "holdTime",
  monthlycashflow: "noi",
  netoperatingincome: "noi",
  noi: "noi",
  purchaseprice: "purchasePrice",
  rehab: "rehabBudget",
  rehabbudget: "rehabBudget",
  renovationcost: "rehabBudget",
  saleprice: "salePrice",
};

const legacyPropertyDealTypeMap: Record<string, PropertyDealType | null> = {
  BRRRR: "BUY_HOLD",
  BUY_HOLD: "BUY_HOLD",
  FIX_FLIP: "FIX_FLIP",
  OTHER: null,
  VALUE_ADD: "BUY_HOLD",
  WHOLESALE: "WHOLESALE",
};

export const normalizePropertyTemplateMetricKey = (value: string | null | undefined) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

export const getPropertyTemplateMetricDefinition = (
  value: string | null | undefined,
) => {
  const normalizedValue = normalizePropertyTemplateMetricKey(value);
  const metricKey = propertyMetricAliasMap[normalizedValue];

  return metricKey ? propertyTemplateMetricDefinitions[metricKey] : null;
};

export const getPropertyTemplateMetricFields = (
  value: string | null | undefined,
): PropertyTemplateMetricDefinition[] => {
  const normalizedDealType = normalizePropertyDealType(value) ?? "FIX_FLIP";
  const config = propertyTemplateConfigMap[normalizedDealType];

  return [...config.heroMetricKeys, ...config.detailMetricKeys].map(
    (metricKey) => propertyTemplateMetricDefinitions[metricKey],
  );
};

export const normalizePropertyDealType = (
  value: string | null | undefined,
): PropertyDealType | null => {
  const normalizedValue = String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  return legacyPropertyDealTypeMap[normalizedValue] ?? null;
};

export const coercePropertyDealType = (
  value: string | null | undefined,
): PropertyDealType => normalizePropertyDealType(value) ?? "FIX_FLIP";

export const getPropertyDealTypeLabel = (value: string | null | undefined) => {
  const normalizedDealType = normalizePropertyDealType(value);

  if (normalizedDealType) {
    return propertyTemplateConfigMap[normalizedDealType].label;
  }

  const trimmedValue = String(value ?? "").trim();
  return trimmedValue ? titleCase(trimmedValue) : "Opportunity";
};
