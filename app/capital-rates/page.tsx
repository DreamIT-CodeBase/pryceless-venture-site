import acquisitionsIcon from "@/app/assets/agreement 1.svg";
import bridgeCapitalIcon from "@/app/assets/gain 1.svg";
import portfolioScalingIcon from "@/app/assets/equity 1.svg";
import renovationsIcon from "@/app/assets/renovation 1.svg";
import { PastelActionCardGrid } from "@/components/public/pastel-action-card-grid";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";

const capitalRateCards = [
  {
    title: "Acquisitions",
    description: "Earn passive income through",
    ctaLabel: "More Details",
    href: "/capital-rates",
    icon: acquisitionsIcon,
    backgroundColor: "#d8f0fd",
    borderColor: "#c0dceb",
    iconClassName: "max-h-[54px] max-w-[54px]",
  },
  {
    title: "Renovations",
    description: "Earn passive income through",
    ctaLabel: "More Details",
    href: "/capital-rates",
    icon: renovationsIcon,
    backgroundColor: "#eed7ef",
    borderColor: "#d7bdd9",
    iconClassName: "max-h-[62px] max-w-[62px]",
  },
  {
    title: "Bridge Capital",
    description: "Earn passive income through",
    ctaLabel: "More Details",
    href: "/capital-rates",
    icon: bridgeCapitalIcon,
    backgroundColor: "#f7e7bc",
    borderColor: "#e0c89b",
    iconClassName: "max-h-[56px] max-w-[56px]",
  },
  {
    title: "Portfolio Scaling",
    description: "Earn passive income through",
    ctaLabel: "More Details",
    href: "/capital-rates",
    icon: portfolioScalingIcon,
    backgroundColor: "#c7ebe4",
    borderColor: "#acd6cd",
    iconClassName: "max-h-[60px] max-w-[60px]",
  },
] as const;

export default function CapitalRatesPage() {
  return (
    <SiteShell cta={{ href: "/investments", label: "View Investments" }}>
      <PageSectionHero
        currentLabel="Capital Rates"
        intro="Evaluate real estate investments using professional-grade financial models"
        title={
          <>
            <span className="block">Capital &amp; Rates</span>
            <span className="block">Overview</span>
          </>
        }
      />
      <PastelActionCardGrid items={capitalRateCards} />
    </SiteShell>
  );
}
