import type { StaticImageData } from "next/image";

import brrrrIcon from "@/app/assets/calculator 2inroi.svg";
import roiCalculatorIcon from "@/app/assets/calculatorinroi.svg";
import mortgageIcon from "@/app/assets/finance 1inroi.svg";
import valueAddIcon from "@/app/assets/metrics 1inroi.svg";

type CalculatorRecord = {
  calculatorType: string;
  disclaimer: string;
  shortDescription: string | null;
  slug: string;
  title: string;
};

export type CalculatorContent = {
  backgroundColor: string;
  borderColor: string;
  calculatorType: string;
  ctaLabel: string;
  disclaimer: string;
  icon: StaticImageData;
  iconClassName?: string;
  shortDescription: string;
  slug: string;
  title: string;
};

const sharedDisclaimer =
  "Calculator outputs are estimates based on user inputs and assumptions and are for educational purposes only.";

const genericCalculatorDescription =
  "Review real estate assumptions, compare modeled outcomes, and use this calculator to evaluate live deal scenarios.";

const phaseOneCalculators: readonly CalculatorContent[] = [
  {
    backgroundColor: "#d8f0fd",
    borderColor: "#c0dceb",
    calculatorType: "ROI",
    ctaLabel: "Calculate ROI",
    disclaimer: sharedDisclaimer,
    icon: roiCalculatorIcon,
    iconClassName: "max-h-[58px] max-w-[58px]",
    shortDescription:
      "Evaluate projected cash flow, return potential, and overall investment performance for a real estate opportunity.",
    slug: "roi-calculator",
    title: "ROI Calculator",
  },
  {
    backgroundColor: "#eed7ef",
    borderColor: "#d7bdd9",
    calculatorType: "BRRRR",
    ctaLabel: "Analyze BRRRR",
    disclaimer: sharedDisclaimer,
    icon: brrrrIcon,
    iconClassName: "max-h-[58px] max-w-[58px]",
    shortDescription:
      "Model the buy, rehab, rent, refinance, and repeat strategy with live acquisition, refinance, and cash-flow outputs.",
    slug: "brrrr-calculator",
    title: "BRRRR Calculator",
  },
  {
    backgroundColor: "#f7e7bc",
    borderColor: "#e0c89b",
    calculatorType: "MORTGAGE",
    ctaLabel: "Calculate Mortgage",
    disclaimer: sharedDisclaimer,
    icon: mortgageIcon,
    iconClassName: "max-h-[50px] max-w-[50px]",
    shortDescription:
      "Estimate monthly financing impact, principal and interest structure, and debt service assumptions for a deal.",
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
  },
  {
    backgroundColor: "#c7ebe4",
    borderColor: "#acd6cd",
    calculatorType: "VALUE_ADD",
    ctaLabel: "Analyze Deal",
    disclaimer: sharedDisclaimer,
    icon: valueAddIcon,
    iconClassName: "max-h-[50px] max-w-[50px]",
    shortDescription:
      "Assess renovation scenarios, operational upside, and the path to improved asset performance in a value-add plan.",
    slug: "value-add-analysis",
    title: "Value-Add Analysis",
  },
] as const;

const calculatorTypeAliases: Record<string, string> = {
  BRRRR: "BRRRR",
  MORTGAGE: "MORTGAGE",
  ROI: "ROI",
  VALUEADD: "VALUE_ADD",
  VALUE_ADD: "VALUE_ADD",
};

const canonicalCalculatorPathByType: Record<string, string> = {
  BRRRR: "/calculators/brrrr",
  MORTGAGE: "/calculators/mortgage",
  ROI: "/calculators/roi",
  VALUE_ADD: "/calculators/value-add",
};

const legacyCalculatorPathBySlug: Record<string, string> = {
  "brrrr-calculator": canonicalCalculatorPathByType.BRRRR,
  "mortgage-calculator": canonicalCalculatorPathByType.MORTGAGE,
  "roi-calculator": canonicalCalculatorPathByType.ROI,
  "value-add-analysis": canonicalCalculatorPathByType.VALUE_ADD,
};

export const normalizeCalculatorType = (value: string | null | undefined) => {
  const normalized = String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  return calculatorTypeAliases[normalized] ?? normalized;
};

export const getCanonicalCalculatorPath = ({
  calculatorType,
  slug,
}: {
  calculatorType?: string | null;
  slug?: string | null;
}) => {
  if (slug && legacyCalculatorPathBySlug[slug]) {
    return legacyCalculatorPathBySlug[slug];
  }

  const normalizedType = normalizeCalculatorType(calculatorType);
  if (canonicalCalculatorPathByType[normalizedType]) {
    return canonicalCalculatorPathByType[normalizedType];
  }

  return slug ? `/calculators/${slug}` : "/calculators";
};

const getPhaseOneCalculatorBySlug = (slug: string) =>
  phaseOneCalculators.find((calculator) => calculator.slug === slug) ?? null;

const getPhaseOneCalculatorByType = (calculatorType: string | null | undefined) =>
  phaseOneCalculators.find(
    (calculator) => calculator.calculatorType === normalizeCalculatorType(calculatorType),
  ) ?? null;

export const getPhaseOneCalculators = () => phaseOneCalculators;

export const mergeWithCalculatorFallback = (calculator: CalculatorRecord): CalculatorContent => {
  const fallback =
    getPhaseOneCalculatorBySlug(calculator.slug) ??
    getPhaseOneCalculatorByType(calculator.calculatorType) ??
    phaseOneCalculators[0];

  return {
    ...fallback,
    calculatorType: normalizeCalculatorType(calculator.calculatorType) || fallback.calculatorType,
    disclaimer: calculator.disclaimer || fallback.disclaimer,
    shortDescription:
      calculator.shortDescription?.trim() || fallback.shortDescription || genericCalculatorDescription,
    slug: calculator.slug || fallback.slug,
    title: calculator.title || fallback.title,
  };
};

export const buildPhaseOneCalculatorCollection = (calculators: CalculatorRecord[]) => {
  const matchedIds = new Set<string>();

  const primaryCalculators = phaseOneCalculators.map((fallback) => {
    const match =
      calculators.find((calculator) => calculator.slug === fallback.slug) ??
      calculators.find(
        (calculator) => normalizeCalculatorType(calculator.calculatorType) === fallback.calculatorType,
      ) ??
      calculators.find((calculator) => calculator.title === fallback.title);

    if (match) {
      matchedIds.add(match.slug);
      return mergeWithCalculatorFallback(match);
    }

    return fallback;
  });

  const additionalCalculators = calculators
    .filter((calculator) => !matchedIds.has(calculator.slug))
    .map((calculator) => mergeWithCalculatorFallback(calculator));

  return [...primaryCalculators, ...additionalCalculators];
};

export const getCalculatorContentBySlug = (slug: string, calculator?: CalculatorRecord | null) => {
  if (calculator) {
    return mergeWithCalculatorFallback(calculator);
  }

  return getPhaseOneCalculatorBySlug(slug);
};
