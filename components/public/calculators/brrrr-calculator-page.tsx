"use client";

import { useMemo, useState } from "react";

import { calculateBrrrr, type BrrrrInputs } from "@/lib/calculator-engine";

import { CalculatorLayout, DonutChart, ResultRows, SliderInput } from "./calculator-ui";
import { calculatorThemes, formatCurrency, formatPercent, ResetButton } from "./calculator-page-helpers";

const defaultBrrrrPageInputs: BrrrrInputs = {
  afterRepairValue: 11000000,
  closingCosts: 180000,
  downPaymentPercent: 20,
  monthlyOperatingExpenses: 22000,
  monthlyRent: 90000,
  otherMonthlyIncome: 4000,
  purchasePrice: 8200000,
  refinanceInterestRate: 8.1,
  refinanceLoanTermYears: 20,
  refinanceLtvPercent: 75,
  rehabBudget: 1400000,
  vacancyRate: 5,
};

export function BrrrrCalculatorPage() {
  const theme = calculatorThemes.brrrr;
  const [inputs, setInputs] = useState<BrrrrInputs>(defaultBrrrrPageInputs);
  const results = useMemo(() => calculateBrrrr(inputs), [inputs]);

  const recoveredCash = Math.min(results.cashOutAtRefinance, results.initialCashRequired);
  const remainingCash = Math.max(results.initialCashRequired - recoveredCash, 0);

  const setValue = <K extends keyof BrrrrInputs>(key: K) => (value: number) =>
    setInputs((current) => ({ ...current, [key]: value }));

  return (
    <CalculatorLayout
      calculatorTitle="After-refi snapshot"
      chartPanel={
        <DonutChart
          centerLabel="Cash recovered"
          centerValue={formatPercent(results.cashRecoveredPercent)}
          segments={[
            { color: theme.accent, label: "Recovered at refi", value: recoveredCash },
            { color: theme.accentSoft, label: "Cash left in deal", value: remainingCash },
          ].filter((segment) => segment.value > 0)}
          title="Refinance cash recovery"
        />
      }
      description="Model buy + rehab + refinance quickly to see how much cash comes back out and what stays in the deal."
      inputPanel={
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#243752]">Strategy inputs</p>
            <ResetButton
              accentDark={theme.accentDark}
              accentSoft={theme.accentSoft}
              onClick={() => setInputs(defaultBrrrrPageInputs)}
            />
          </div>

          <div className="mt-4">
            <SliderInput
              accent={theme.accent}
              label="Purchase price"
              max={50000000}
              min={500000}
              prefix="₹"
              step={100000}
              value={inputs.purchasePrice}
              onChange={setValue("purchasePrice")}
            />
            <SliderInput
              accent={theme.accent}
              label="Rehab budget"
              max={15000000}
              min={0}
              prefix="₹"
              step={50000}
              value={inputs.rehabBudget}
              onChange={setValue("rehabBudget")}
            />
            <SliderInput
              accent={theme.accent}
              label="After repair value (ARV)"
              max={60000000}
              min={500000}
              prefix="₹"
              step={100000}
              value={inputs.afterRepairValue}
              onChange={setValue("afterRepairValue")}
            />
            <SliderInput
              accent={theme.accent}
              label="Down payment"
              max={60}
              min={5}
              step={1}
              suffix="%"
              value={inputs.downPaymentPercent}
              onChange={setValue("downPaymentPercent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Refinance LTV"
              max={90}
              min={50}
              step={1}
              suffix="%"
              value={inputs.refinanceLtvPercent}
              onChange={setValue("refinanceLtvPercent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Monthly rent"
              max={250000}
              min={5000}
              prefix="₹"
              step={2500}
              value={inputs.monthlyRent}
              onChange={setValue("monthlyRent")}
            />

            <details className="mt-4 rounded-[18px] border border-[#e7edf4] bg-white px-4 py-4">
              <summary className="cursor-pointer text-[14px] font-semibold text-[#243752]">
                Advanced options
              </summary>
              <div className="mt-4">
                <SliderInput
                  accent={theme.accent}
                  label="Closing costs"
                  max={1500000}
                  min={0}
                  prefix="₹"
                  step={10000}
                  value={inputs.closingCosts}
                  onChange={setValue("closingCosts")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Monthly operating expenses"
                  max={150000}
                  min={0}
                  prefix="₹"
                  step={1000}
                  value={inputs.monthlyOperatingExpenses}
                  onChange={setValue("monthlyOperatingExpenses")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Vacancy rate"
                  max={20}
                  min={0}
                  step={0.5}
                  suffix="%"
                  value={inputs.vacancyRate}
                  onChange={setValue("vacancyRate")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Other monthly income"
                  max={75000}
                  min={0}
                  prefix="₹"
                  step={1000}
                  value={inputs.otherMonthlyIncome}
                  onChange={setValue("otherMonthlyIncome")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Refinance interest rate"
                  max={18}
                  min={1}
                  step={0.1}
                  suffix="%"
                  value={inputs.refinanceInterestRate}
                  onChange={setValue("refinanceInterestRate")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Refinance loan term"
                  max={30}
                  min={5}
                  step={1}
                  suffix="Yr"
                  value={inputs.refinanceLoanTermYears}
                  onChange={setValue("refinanceLoanTermYears")}
                />
              </div>
            </details>
          </div>
        </>
      }
      resultPanel={
        <ResultRows
          items={[
            { label: "Cash recovered", value: formatPercent(results.cashRecoveredPercent) },
            { label: "Cash left in deal", value: formatCurrency(results.cashLeftInDeal) },
            { label: "Equity created", value: formatCurrency(results.equityCreated) },
            { label: "Annual cash flow", value: formatCurrency(results.annualCashFlow) },
          ]}
        />
      }
      theme={theme}
      title="BRRRR Calculator"
    />
  );
}

