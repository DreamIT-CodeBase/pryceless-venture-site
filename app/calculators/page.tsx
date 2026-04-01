import brrrrIcon from "@/app/assets/calculator 2inroi.svg";
import roiCalculatorIcon from "@/app/assets/calculatorinroi.svg";
import mortgageIcon from "@/app/assets/finance 1inroi.svg";
import valueAddIcon from "@/app/assets/metrics 1inroi.svg";
import { PastelActionCardGrid } from "@/components/public/pastel-action-card-grid";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";

const calculatorTitleClassName =
  "max-w-none whitespace-nowrap text-[17px] tracking-[-0.04em] sm:text-[18px]";
const calculatorDescriptionClassName =
  "mx-auto w-fit max-w-full whitespace-nowrap text-center text-[13px] sm:text-[13.5px] sm:leading-[1.2]";
const calculatorButtonTextClassName =
  "max-w-none whitespace-nowrap text-[13.5px] sm:text-[14px]";
const calculatorTitleOffsetClassName = "mt-[26px] sm:mt-[30px]";
const calculatorDescriptionOffsetClassName = "mt-[12px] sm:mt-[14px]";

const calculatorCards = [
  {
    title: "ROI Calculator",
    description: "Earn passive income through",
    ctaLabel: "Calculate ROI",
    href: "/calculators",
    icon: roiCalculatorIcon,
    backgroundColor: "#d8f0fd",
    borderColor: "#c0dceb",
    iconClassName: "max-h-[58px] max-w-[58px]",
    buttonTextClassName: calculatorButtonTextClassName,
    titleClassName: `${calculatorTitleClassName} ${calculatorTitleOffsetClassName}`,
    descriptionClassName: `${calculatorDescriptionClassName} ${calculatorDescriptionOffsetClassName}`,
  },
  {
    title: "BRRRR Calculator",
    description: "Earn passive income through",
    ctaLabel: "Analyze BRRRR",
    href: "/calculators",
    icon: brrrrIcon,
    backgroundColor: "#eed7ef",
    borderColor: "#d7bdd9",
    iconClassName: "max-h-[58px] max-w-[58px]",
    buttonTextClassName: calculatorButtonTextClassName,
    titleClassName: `${calculatorTitleClassName} ${calculatorTitleOffsetClassName} text-[17px] sm:text-[18px]`,
    descriptionClassName: `${calculatorDescriptionClassName} ${calculatorDescriptionOffsetClassName}`,
  },
  {
    title: "Mortgage Calculator",
    description: "Earn passive income through",
    ctaLabel: "Calculate Mortgage",
    href: "/calculators",
    icon: mortgageIcon,
    backgroundColor: "#f7e7bc",
    borderColor: "#e0c89b",
    iconClassName: "max-h-[50px] max-w-[50px]",
    buttonTextClassName: calculatorButtonTextClassName,
    titleClassName: `${calculatorTitleClassName} ${calculatorTitleOffsetClassName} text-[16px] sm:text-[17px]`,
    descriptionClassName: `${calculatorDescriptionClassName} ${calculatorDescriptionOffsetClassName}`,
  },
  {
    title: "Value-Add Analysis",
    description: "Earn passive income through",
    ctaLabel: "Analyze Deal",
    href: "/calculators",
    icon: valueAddIcon,
    backgroundColor: "#c7ebe4",
    borderColor: "#acd6cd",
    iconClassName: "max-h-[50px] max-w-[50px]",
    buttonTextClassName: calculatorButtonTextClassName,
    titleClassName: `${calculatorTitleClassName} ${calculatorTitleOffsetClassName} text-[16px] sm:text-[17px]`,
    descriptionClassName: `${calculatorDescriptionClassName} ${calculatorDescriptionOffsetClassName}`,
  },
] as const;

export default function CalculatorsPage() {
  return (
    <SiteShell cta={{ href: "/capital-rates", label: "Request Funding Info" }}>
      <PageSectionHero
        currentLabel="ROI Calculators"
        intro="Evaluate real estate investments using professional-grade financial models"
        title="ROI Calculators"
      />
      <PastelActionCardGrid
        disclaimer={{
          label: "Disclaimer:",
          text: "Calculator outputs are estimates based on user inputs and assumptions and are for educational purposes only.",
        }}
        items={calculatorCards}
        variant="spacious"
      />
    </SiteShell>
  );
}
