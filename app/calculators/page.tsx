import brrrrIcon from "@/app/assets/calculator 2inroi.svg";
import roiCalculatorIcon from "@/app/assets/calculatorinroi.svg";
import mortgageIcon from "@/app/assets/finance 1inroi.svg";
import valueAddIcon from "@/app/assets/metrics 1inroi.svg";
import { PastelActionCardGrid } from "@/components/public/pastel-action-card-grid";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";

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
    titleClassName: "max-w-none whitespace-nowrap text-[19px]",
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
    buttonTextClassName: "max-w-[140px] whitespace-nowrap",
    titleClassName: "max-w-none whitespace-nowrap text-[19px]",
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
    titleClassName: "max-w-none whitespace-nowrap text-[19px]",
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
