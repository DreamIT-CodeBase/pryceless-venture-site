"use client";

import { useMemo, useState } from "react";

import {
  calculateValueAdd,
  defaultValueAddInputs,
  type ValueAddInputs,
} from "@/lib/calculator-engine";

import { CalculatorLayout, DonutChart, ResultRows, SliderInput } from "./calculator-ui";
import { calculatorThemes, formatCurrency, formatPercent, formatYears, ResetButton } from "./calculator-page-helpers";

export function ValueAddCalculatorPage() {
  const theme = calculatorThemes["value-add"];
  const [inputs, setInputs] = useState<ValueAddInputs>({ ...defaultValueAddInputs });
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
      description="Compare current vs stabilized operations to see whether NOI growth justifies the renovation budget."
      inputPanel={
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#243752]">Plan inputs</p>
            <ResetButton
              accentDark={theme.accentDark}
              accentSoft={theme.accentSoft}
              onClick={() => setInputs({ ...defaultValueAddInputs })}
            />
          </div>

          <div className="mt-4">
            <SliderInput
              accent={theme.accent}
              label="Unit count"
              max={250}
              min={1}
              step={1}
              value={inputs.unitCount}
              onChange={setValue("unitCount")}
            />
            <SliderInput
              accent={theme.accent}
              label="Current average rent per unit"
              max={5000}
              min={500}
              prefix="$"
              step={25}
              value={inputs.avgCurrentRent}
              onChange={setValue("avgCurrentRent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Stabilized average rent per unit"
              max={7000}
              min={500}
              prefix="$"
              step={25}
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
              max={2500000}
              min={0}
              prefix="$"
              step={5000}
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
                  max={250000}
                  min={0}
                  prefix="$"
                  step={1000}
                  value={inputs.annualOtherIncomeCurrent}
                  onChange={setValue("annualOtherIncomeCurrent")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Stabilized other income (annual)"
                  max={250000}
                  min={0}
                  prefix="$"
                  step={1000}
                  value={inputs.annualOtherIncomeStabilized}
                  onChange={setValue("annualOtherIncomeStabilized")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Current operating expenses (annual)"
                  max={2000000}
                  min={0}
                  prefix="$"
                  step={5000}
                  value={inputs.annualOperatingExpensesCurrent}
                  onChange={setValue("annualOperatingExpensesCurrent")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Stabilized operating expenses (annual)"
                  max={2500000}
                  min={0}
                  prefix="$"
                  step={5000}
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
