"use client";

import { useMemo, useState } from "react";

import { calculateValueAdd, type ValueAddInputs } from "@/lib/calculator-engine";

import { CalculatorLayout, DonutChart, ResultRows, SliderInput } from "./calculator-ui";
import { calculatorThemes, formatCurrency, formatPercent, formatYears, ResetButton } from "./calculator-page-helpers";

const defaultValueAddPageInputs: ValueAddInputs = {
  annualOperatingExpensesCurrent: 2200000,
  annualOperatingExpensesStabilized: 2450000,
  annualOtherIncomeCurrent: 90000,
  annualOtherIncomeStabilized: 180000,
  avgCurrentRent: 22000,
  avgStabilizedRent: 29500,
  currentOccupancyPercent: 86,
  exitCapRatePercent: 7.25,
  renovationBudget: 3600000,
  stabilizedOccupancyPercent: 95,
  unitCount: 12,
};

export function ValueAddCalculatorPage() {
  const theme = calculatorThemes["value-add"];
  const [inputs, setInputs] = useState<ValueAddInputs>(defaultValueAddPageInputs);
  const results = useMemo(() => calculateValueAdd(inputs), [inputs]);

  const setValue = <K extends keyof ValueAddInputs>(key: K) => (value: number) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const valueCreatedSegments = [
    { color: theme.accentSoft, label: "Renovation budget", value: results.renovationBudget },
    { color: theme.accent, label: "Estimated value created", value: Math.max(results.estimatedValueCreated, 0) },
  ].filter((segment) => segment.value > 0);

  const renovationReturn =
    results.returnOnRenovationCostPercent == null
      ? "N/A"
      : formatPercent(results.returnOnRenovationCostPercent);

  return (
    <CalculatorLayout
      calculatorTitle="Stabilized upside"
      chartPanel={
        <DonutChart
          centerLabel="Net value created"
          centerValue={formatCurrency(results.netValueCreated)}
          segments={valueCreatedSegments}
          title="Budget vs value created"
        />
      }
      description="Compare current vs stabilized operations to see if NOI lift supports your renovation budget."
      inputPanel={
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#243752]">Plan inputs</p>
            <ResetButton
              accentDark={theme.accentDark}
              accentSoft={theme.accentSoft}
              onClick={() => setInputs(defaultValueAddPageInputs)}
            />
          </div>

          <div className="mt-4">
            <SliderInput
              accent={theme.accent}
              label="Unit count"
              max={200}
              min={1}
              step={1}
              value={inputs.unitCount}
              onChange={setValue("unitCount")}
            />
            <SliderInput
              accent={theme.accent}
              label="Current avg rent / unit"
              max={100000}
              min={2000}
              prefix="₹"
              step={500}
              value={inputs.avgCurrentRent}
              onChange={setValue("avgCurrentRent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Stabilized avg rent / unit"
              max={120000}
              min={2000}
              prefix="₹"
              step={500}
              value={inputs.avgStabilizedRent}
              onChange={setValue("avgStabilizedRent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Stabilized occupancy"
              max={100}
              min={40}
              step={1}
              suffix="%"
              value={inputs.stabilizedOccupancyPercent}
              onChange={setValue("stabilizedOccupancyPercent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Renovation budget"
              max={20000000}
              min={0}
              prefix="₹"
              step={100000}
              value={inputs.renovationBudget}
              onChange={setValue("renovationBudget")}
            />
            <SliderInput
              accent={theme.accent}
              label="Exit cap rate"
              max={15}
              min={3}
              step={0.1}
              suffix="%"
              value={inputs.exitCapRatePercent}
              onChange={setValue("exitCapRatePercent")}
            />

            <details className="mt-4 rounded-[18px] border border-[#e7edf4] bg-white px-4 py-4">
              <summary className="cursor-pointer text-[14px] font-semibold text-[#243752]">
                Advanced options
              </summary>
              <div className="mt-4">
                <SliderInput
                  accent={theme.accent}
                  label="Current occupancy"
                  max={100}
                  min={40}
                  step={1}
                  suffix="%"
                  value={inputs.currentOccupancyPercent}
                  onChange={setValue("currentOccupancyPercent")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Current other income (annual)"
                  max={1000000}
                  min={0}
                  prefix="₹"
                  step={10000}
                  value={inputs.annualOtherIncomeCurrent}
                  onChange={setValue("annualOtherIncomeCurrent")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Stabilized other income (annual)"
                  max={1000000}
                  min={0}
                  prefix="₹"
                  step={10000}
                  value={inputs.annualOtherIncomeStabilized}
                  onChange={setValue("annualOtherIncomeStabilized")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Current operating expenses (annual)"
                  max={10000000}
                  min={0}
                  prefix="₹"
                  step={50000}
                  value={inputs.annualOperatingExpensesCurrent}
                  onChange={setValue("annualOperatingExpensesCurrent")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Stabilized operating expenses (annual)"
                  max={12000000}
                  min={0}
                  prefix="₹"
                  step={50000}
                  value={inputs.annualOperatingExpensesStabilized}
                  onChange={setValue("annualOperatingExpensesStabilized")}
                />
              </div>
            </details>
          </div>
        </>
      }
      resultPanel={
        <ResultRows
          items={[
            { label: "Net value created", value: formatCurrency(results.netValueCreated) },
            { label: "Annual NOI gain", value: formatCurrency(results.annualNoiGain) },
            { label: "Payback period", value: formatYears(results.paybackPeriodYears) },
            { label: "Return on renovation cost", value: renovationReturn },
          ]}
        />
      }
      theme={theme}
      title="Value-Add Analysis"
    />
  );
}

