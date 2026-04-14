import { titleCase } from "@/lib/utils";

export const propertyStatusValues = ["FOR_SALE", "SOLD", "IN_PROGRESS"] as const;

export type PropertyEditorStatus = (typeof propertyStatusValues)[number];
export type PropertyPortfolioStage = PropertyEditorStatus;

export const propertyStatusOptions = [
  { value: "FOR_SALE", label: "For Sale" },
  { value: "SOLD", label: "Sold" },
  { value: "IN_PROGRESS", label: "In Progress" },
] as const;

export const propertyPortfolioStageOrder = [
  "FOR_SALE",
  "SOLD",
  "IN_PROGRESS",
] as const satisfies readonly PropertyPortfolioStage[];

const soldStatusFragments = ["SOLD", "CLOSED"];
const inProgressStatusFragments = [
  "IN_PROGRESS",
  "PROGRESS",
  "RENOV",
  "REHAB",
  "REMODEL",
  "CONSTRUCTION",
];

const normalizeStatus = (value: string | null | undefined) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, "_")
    .toUpperCase();

export const getPropertyPortfolioStage = (
  status: string | null | undefined,
): PropertyPortfolioStage => {
  const normalized = normalizeStatus(status);

  if (soldStatusFragments.some((fragment) => normalized.includes(fragment))) {
    return "SOLD";
  }

  if (inProgressStatusFragments.some((fragment) => normalized.includes(fragment))) {
    return "IN_PROGRESS";
  }

  return "FOR_SALE";
};

export const getPropertyEditorStatus = (
  status: string | null | undefined,
): PropertyEditorStatus => getPropertyPortfolioStage(status);

export const formatPropertyStatusLabel = (status: string | null | undefined) =>
  titleCase(normalizeStatus(status) || "FOR_SALE");

export const getPropertyStageLabel = (stage: PropertyPortfolioStage) =>
  propertyStatusOptions.find((option) => option.value === stage)?.label ?? "For Sale";

export const parsePropertyHighlights = (
  highlights: Array<string | null | undefined>,
): {
  bullets: string[];
  metrics: Array<{ label: string; value: string }>;
} => {
  const bullets: string[] = [];
  const metrics: Array<{ label: string; value: string }> = [];

  highlights.forEach((item) => {
    const value = String(item ?? "").trim();
    if (!value) {
      return;
    }

    const [label, ...rest] = value.split("|").map((segment) => segment.trim());
    const metricValue = rest.join(" | ").trim();

    if (label && metricValue) {
      metrics.push({ label, value: metricValue });
      return;
    }

    bullets.push(value);
  });

  return { bullets, metrics };
};

export const getPropertyStageContent = (stage: PropertyPortfolioStage) => {
  if (stage === "SOLD") {
    return {
      cardCtaLabel: "View Underwriting",
      detailHeroEyebrow: "Sold Property",
      detailNarrativeEyebrow: "Execution Overview",
      detailNarrativeTitle: "Deal Overview",
      detailNotesEyebrow: "Execution Commentary",
      detailNotesTitle: "Execution Notes",
      detailSnapshotEyebrow: "Underwriting Snapshot",
      detailSnapshotTitle: "Underwriting Snapshot",
      detailUpdateEyebrow: "Execution Highlights",
      detailUpdateTitle: "Execution Highlights",
      emptyMessage:
        "Sold properties will appear here as Pryceless adds completed deal profiles and underwriting snapshots.",
      indexBody:
        "Closed Pryceless deals that highlight acquisition basis, execution discipline, and sale outcomes.",
      indexEyebrow: "Track Record",
      indexTitle: "Sold",
      supportForm: false,
    };
  }

  if (stage === "IN_PROGRESS") {
    return {
      cardCtaLabel: "View Progress",
      detailHeroEyebrow: "In Progress",
      detailNarrativeEyebrow: "Renovation Overview",
      detailNarrativeTitle: "Project Overview",
      detailNotesEyebrow: "Project Commentary",
      detailNotesTitle: "Renovation Notes",
      detailSnapshotEyebrow: "Rehab Snapshot",
      detailSnapshotTitle: "Rehab Snapshot",
      detailUpdateEyebrow: "Current Updates",
      detailUpdateTitle: "Current Updates",
      emptyMessage:
        "In-progress projects will appear here once active rehab properties are published from the admin portal.",
      indexBody:
        "Active renovation projects with current photos, rehab notes, and progress visibility as work moves forward.",
      indexEyebrow: "Active Renovation",
      indexTitle: "In Progress",
      supportForm: false,
    };
  }

  return {
    cardCtaLabel: "Request Details",
    detailHeroEyebrow: "For Sale",
    detailNarrativeEyebrow: "Property Overview",
    detailNarrativeTitle: "Property Overview",
    detailNotesEyebrow: "Buyer Alignment",
    detailNotesTitle: "Buyer Fit",
    detailSnapshotEyebrow: "Property Snapshot",
    detailSnapshotTitle: "Property Snapshot",
    detailUpdateEyebrow: "Property Highlights",
    detailUpdateTitle: "Property Highlights",
    emptyMessage:
      "For-sale properties will appear here once active portfolio inventory is published from the admin portal.",
    indexBody:
      "Active Pryceless inventory presented as a polished portfolio of properties currently available for review.",
    indexEyebrow: "Portfolio Inventory",
    indexTitle: "For Sale",
    supportForm: true,
  };
};
