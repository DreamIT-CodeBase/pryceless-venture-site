"use client";

import { useMemo, useState } from "react";

import {
  calculateMortgage,
  defaultMortgageInputs,
  type MortgageInputs,
} from "@/lib/calculator-engine";

import { CalculatorLayout, DonutChart, ResultRows, SliderInput } from "./calculator-ui";
import { calculatorThemes, formatCurrency, formatPercent, ResetButton, shareOfTotal } from "./calculator-page-helpers";

export function MortgageCalculatorPage() {
  const theme = calculatorThemes.mortgage;
  const [inputs, setInputs] = useState<MortgageInputs>({ ...defaultMortgageInputs });

  const mortgage = useMemo(() => calculateMortgage(inputs), [inputs]);
  const escrowShare = shareOfTotal(mortgage.monthlyEscrows, mortgage.totalMonthlyPayment);
  const setValue = <K extends keyof MortgageInputs>(key: K) => (value: number) =>
    setInputs((current) => ({ ...current, [key]: value }));

  return (
    <CalculatorLayout
      calculatorTitle="Monthly payment snapshot"
      chartPanel={
        <DonutChart
          centerLabel="Escrow share"
          centerValue={formatPercent(escrowShare)}
          segments={[
            { color: "#eef2ff", label: "Principal & interest", value: mortgage.monthlyPrincipalAndInterest },
            { color: theme.accent, label: "Taxes, insurance, HOA & PMI", value: mortgage.monthlyEscrows },
          ]}
          title="Monthly payment mix"
        />
      }
      description="Adjust U.S. mortgage assumptions to estimate principal, interest, escrows, and total monthly payment."
      inputPanel={
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#243752]">Loan details</p>
            <ResetButton
              accentDark={theme.accentDark}
              accentSoft={theme.accentSoft}
              onClick={() => setInputs({ ...defaultMortgageInputs })}
            />
          </div>

          <div className="mt-4">
            <SliderInput
              accent={theme.accent}
              label="Purchase price"
              max={5000000}
              min={75000}
              prefix="$"
              step={10000}
              value={inputs.purchasePrice}
              onChange={setValue("purchasePrice")}
            />
            <SliderInput
              accent={theme.accent}
              label="Down payment"
              max={40}
              min={5}
              step={1}
              suffix="%"
              value={inputs.downPaymentPercent}
              onChange={setValue("downPaymentPercent")}
            />
            <SliderInput
              accent={theme.accent}
              label="Interest rate"
              max={12}
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
            <SliderInput
              accent={theme.accent}
              label="Annual property tax"
              max={60000}
              min={0}
              prefix="$"
              step={250}
              value={inputs.annualPropertyTax}
              onChange={setValue("annualPropertyTax")}
            />
            <SliderInput
              accent={theme.accent}
              label="Annual insurance"
              max={12000}
              min={0}
              prefix="$"
              step={100}
              value={inputs.annualInsurance}
              onChange={setValue("annualInsurance")}
            />

            <details className="mt-4 rounded-[18px] border border-[#e7edf4] bg-white px-4 py-4">
              <summary className="cursor-pointer text-[14px] font-semibold text-[#243752]">
                Advanced options
              </summary>
              <div className="mt-4">
                <SliderInput
                  accent={theme.accent}
                  label="Monthly HOA"
                  max={2000}
                  min={0}
                  prefix="$"
                  step={25}
                  value={inputs.monthlyHoa}
                  onChange={setValue("monthlyHoa")}
                />
                <SliderInput
                  accent={theme.accent}
                  label="Monthly PMI"
                  max={800}
                  min={0}
                  prefix="$"
                  step={10}
                  value={inputs.monthlyPmi}
                  onChange={setValue("monthlyPmi")}
                />
              </div>
            </details>
          </div>
        </>
      }
      resultPanel={
        <ResultRows
          items={[
            { label: "Total monthly payment", value: formatCurrency(mortgage.totalMonthlyPayment) },
            { label: "Principal & interest", value: formatCurrency(mortgage.monthlyPrincipalAndInterest) },
            { label: "Taxes, insurance, HOA & PMI", value: formatCurrency(mortgage.monthlyEscrows) },
            { label: "Down payment", value: formatCurrency(mortgage.downPaymentAmount) },
            { label: "Loan amount", value: formatCurrency(mortgage.loanAmount) },
          ]}
        />
      }
      theme={theme}
      title="Mortgage Payment Calculator"
    />
  );
}
