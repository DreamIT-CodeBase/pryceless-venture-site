"use client";

import { useMemo, useState } from "react";

import {
  calculateRoi,
  defaultRoiInputs,
  type RoiInputs,
} from "@/lib/calculator-engine";

import { CalculatorLayout, DonutChart, ResultRows, SliderInput } from "./calculator-ui";
import { calculatorThemes, formatCurrency, formatPercent, ResetButton } from "./calculator-page-helpers";

export function RoiCalculatorPage() {
  const theme = calculatorThemes.roi;
  const [inputs, setInputs] = useState<RoiInputs>({ ...defaultRoiInputs });
  const results = useMemo(() => calculateRoi(inputs), [inputs]);

  const annualOperatingExpenses = inputs.monthlyOperatingExpenses * 12;
  const annualDebtService = results.annualDebtService;
  const annualCashFlow = results.annualCashFlow;

  const incomeSegments = [
    { color: "#e2e8f0", label: "Operating expenses", value: annualOperatingExpenses },
    { color: "#94a3b8", label: "Debt service", value: annualDebtService },
    annualCashFlow >= 0
      ? { color: theme.accent, label: "Cash flow", value: annualCashFlow }
      : { color: "#ef4444", label: "Cash flow shortfall", value: Math.abs(annualCashFlow) },
  ].filter((segment) => segment.value > 0);

  const setValue = <K extends keyof RoiInputs>(key: K) => (value: number) =>
    setInputs((current) => ({ ...current, [key]: value }));

  return (
    <CalculatorLayout
      calculatorTitle="Key deal metrics"
      chartPanel={
        <DonutChart
          centerLabel="First-year ROI"
          centerValue={formatPercent(results.firstYearRoiPercent)}
          segments={incomeSegments}
          title="Annual income split"
        />
      }
      description="Update a few assumptions to instantly estimate cash flow and ROI for a rental property."
      inputPanel={
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#243752]">Deal inputs</p>
            <ResetButton
              accentDark={theme.accentDark}
              accentSoft={theme.accentSoft}
              onClick={() => setInputs({ ...defaultRoiInputs })}
            />
          </div>

          <div className="mt-4">
            <SliderInput
              accent={theme.accent}
              label="Purchase price"
              max={5000000}
              min={50000}
              prefix="$"
              step={10000}
              value={inputs.purchasePrice}
              onChange={setValue("purchasePrice")}
            />
            <SliderInput
              accent={theme.accent}
              label="Monthly rent"
              max={25000}
              min={500}
              prefix="$"
              step={100}
              value={inputs.monthlyRent}
              onChange={setValue("monthlyRent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Monthly operating expenses"
              max={10000}
              min={100}
              prefix="$"
              step={50}
              value={inputs.monthlyOperatingExpenses}
              onChange={setValue("monthlyOperatingExpenses")}
            />
            <SliderInput
              accent={theme.accent}
              label="Down payment"
              max={60}
              min={10}
              step={1}
              suffix="%"
              value={inputs.downPaymentPercent}
              onChange={setValue("downPaymentPercent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Interest rate"
              max={16}
              min={1}
              step={0.1}
              suffix="%"
              value={inputs.interestRate}
              onChange={setValue("interestRate")}
            />
            <SliderInput
              accent={theme.accent}
              label="Loan term"
              max={30}
              min={5}
              step={1}
              suffix="Yr"
              value={inputs.loanTermYears}
              onChange={setValue("loanTermYears")}
            />

            <details className="mt-4 rounded-[18px] border border-[#e7edf4] bg-white px-4 py-4">
              <summary className="cursor-pointer text-[14px] font-semibold text-[#243752]">
                Advanced options
              </summary>
              <div className="mt-4">
                <SliderInput
                  accent={theme.accent}
                  label="Rehab budget"
                  max={750000}
                  min={0}
                  prefix="$"
                  step={5000}
                  value={inputs.rehabBudget}
                  onChange={setValue("rehabBudget")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Closing costs"
                  max={150000}
                  min={0}
                  prefix="$"
                  step={1000}
                  value={inputs.closingCosts}
                  onChange={setValue("closingCosts")}
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
                  max={5000}
                  min={0}
                  prefix="$"
                  step={50}
                  value={inputs.otherMonthlyIncome}
                  onChange={setValue("otherMonthlyIncome")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Annual appreciation"
                  max={15}
                  min={0}
                  step={0.5}
                  suffix="%"
                  value={inputs.annualAppreciationRate}
                  onChange={setValue("annualAppreciationRate")}
                />
              </div>
            </details>
          </div>
        </>
      }
      resultPanel={
        <ResultRows
          items={[
            { label: "First-year ROI", value: formatPercent(results.firstYearRoiPercent) },
            { label: "Annual cash flow", value: formatCurrency(results.annualCashFlow) },
            { label: "Cap rate", value: formatPercent(results.capRatePercent) },
            { label: "Cash invested", value: formatCurrency(results.cashInvested) },
          ]}
        />
      }
      theme={theme}
      title="ROI Calculator"
    />
  );
}
