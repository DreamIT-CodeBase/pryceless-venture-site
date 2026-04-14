import { CalculatorExperiencePage } from "@/components/public/calculators/calculator-pages";
import { SiteShell } from "@/components/public/site-shell";

export default function ValueAddCalculatorRoute() {
  return (
    <SiteShell>
      <CalculatorExperiencePage kind="value-add" />
    </SiteShell>
  );
}
