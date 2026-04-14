import { CalculatorExperiencePage } from "@/components/public/calculators/calculator-pages";
import { SiteShell } from "@/components/public/site-shell";

export default function RoiCalculatorRoute() {
  return (
    <SiteShell>
      <CalculatorExperiencePage kind="roi" />
    </SiteShell>
  );
}
