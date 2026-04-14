import { PastelActionCardGrid } from "@/components/public/pastel-action-card-grid";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import {
  buildPhaseOneCalculatorCollection,
  getCanonicalCalculatorPath,
  getPhaseOneCalculators,
} from "@/lib/calculator-content";
import { getPublishedCalculators, getSingletonPage } from "@/lib/data/public";

const calculatorTitleClassName =
  "max-w-none whitespace-nowrap text-[17px] tracking-[-0.04em] sm:text-[18px]";
const calculatorDescriptionClassName =
  "mx-auto w-fit max-w-full whitespace-normal text-center text-[13px] sm:text-[13.5px] sm:leading-[1.2]";
const calculatorButtonTextClassName =
  "max-w-none whitespace-nowrap text-[13.5px] sm:text-[14px]";
const calculatorTitleOffsetClassName = "mt-[26px] sm:mt-[30px]";
const calculatorDescriptionOffsetClassName = "mt-[12px] sm:mt-[14px]";

const fallbackPageIntro =
  "Evaluate real estate investments using professional-grade financial models.";
const fallbackDisclaimer =
  "Calculator outputs are estimates based on user inputs and assumptions and are for educational purposes only.";

export default async function CalculatorsPage() {
  const [page, calculators] = await Promise.all([
    getSingletonPage("CALCULATORS_INDEX"),
    getPublishedCalculators(),
  ]);
  const calculatorPageItems =
    page?.items.filter((item) => item.groupKey === "calculator_list") ?? [];

  const calculatorCards = buildPhaseOneCalculatorCollection(calculators).map((calculator, index) => {
    const fallbackCalculator = getPhaseOneCalculators()[index] ?? getPhaseOneCalculators()[0];
    const pageItem = calculatorPageItems[index];

    return {
      backgroundColor: calculator.backgroundColor,
      borderColor: calculator.borderColor,
      buttonTextClassName: calculatorButtonTextClassName,
      ctaLabel: calculator.ctaLabel,
      description: pageItem?.body?.trim() || calculator.shortDescription,
      descriptionClassName: `${calculatorDescriptionClassName} ${calculatorDescriptionOffsetClassName}`,
      href: getCanonicalCalculatorPath({
        calculatorType: calculator.calculatorType,
        slug: calculator.slug,
      }),
      icon: calculator.icon,
      iconClassName: calculator.iconClassName ?? fallbackCalculator.iconClassName,
      title: pageItem?.title?.trim() || calculator.title,
      titleClassName:
        index >= 2
          ? `${calculatorTitleClassName} ${calculatorTitleOffsetClassName} text-[16px] sm:text-[17px]`
          : `${calculatorTitleClassName} ${calculatorTitleOffsetClassName}`,
    };
  });

  return (
    <SiteShell>
      <PageSectionHero
        currentLabel={page?.pageTitle ?? "Real Estate ROI Calculators"}
        intro={page?.intro ?? fallbackPageIntro}
        title={page?.pageTitle ?? "Real Estate ROI Calculators"}
      />
      <PastelActionCardGrid
        disclaimer={{
          label: "Disclaimer:",
          text: page?.disclaimer ?? fallbackDisclaimer,
        }}
        items={calculatorCards}
        variant="spacious"
      />
    </SiteShell>
  );
}
