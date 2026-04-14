import { CalculatorExperiencePage } from "@/components/public/calculators/calculator-pages";
import { SiteShell } from "@/components/public/site-shell";

export default function MortgageCalculatorRoute() {
  return (
    <SiteShell>
      <CalculatorExperiencePage kind="mortgage" />
    </SiteShell>
  );
}
