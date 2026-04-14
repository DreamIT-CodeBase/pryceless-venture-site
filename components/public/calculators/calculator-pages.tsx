import { BrrrrCalculatorPage } from "./brrrr-calculator-page";
import type { CalculatorPageKind } from "./calculator-page-helpers";
import { MortgageCalculatorPage } from "./mortgage-calculator-page";
import { RoiCalculatorPage } from "./roi-calculator-page";
import { ValueAddCalculatorPage } from "./value-add-calculator-page";

export function CalculatorExperiencePage({
  kind,
}: {
  kind: CalculatorPageKind;
}) {
  if (kind === "mortgage") {
    return <MortgageCalculatorPage />;
  }

  if (kind === "roi") {
    return <RoiCalculatorPage />;
  }

  if (kind === "brrrr") {
    return <BrrrrCalculatorPage />;
  }

  return <ValueAddCalculatorPage />;
}
