"use client";

import { useMemo, useState } from "react";

import { calculateEMI } from "@/lib/calculator-engine";

import { CalculatorLayout, DonutChart, ResultRows, SliderInput } from "./calculator-ui";
import { calculatorThemes, formatCurrency, formatPercent, ResetButton, shareOfTotal } from "./calculator-page-helpers";

const defaultMortgageInputs = {
  annualRate: 6.5,
  loanAmount: 1000000,
  years: 5,
};

export function MortgageCalculatorPage() {
  const theme = calculatorThemes.mortgage;
  const [loanAmount, setLoanAmount] = useState(defaultMortgageInputs.loanAmount);
  const [annualRate, setAnnualRate] = useState(defaultMortgageInputs.annualRate);
  const [years, setYears] = useState(defaultMortgageInputs.years);

  const mortgage = useMemo(() => calculateEMI(loanAmount, annualRate, years), [annualRate, loanAmount, years]);
  const interestShare = shareOfTotal(mortgage.totalInterest, mortgage.totalAmount);

  return (
    <CalculatorLayout
      calculatorTitle="Monthly EMI summary"
      chartPanel={
        <DonutChart
          centerLabel="Interest Share"
          centerValue={formatPercent(interestShare)}
          segments={[
            { color: "#eef2ff", label: "Principal amount", value: loanAmount },
            { color: theme.accent, label: "Interest amount", value: mortgage.totalInterest },
          ]}
          title="Principal vs interest"
        />
      }
      description="Adjust amount, interest rate, and tenure to instantly see your EMI and total repayment."
      inputPanel={
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#243752]">Loan details</p>
            <ResetButton
              accentDark={theme.accentDark}
              accentSoft={theme.accentSoft}
              onClick={() => {
                setLoanAmount(defaultMortgageInputs.loanAmount);
                setAnnualRate(defaultMortgageInputs.annualRate);
                setYears(defaultMortgageInputs.years);
              }}
            />
          </div>

          <div className="mt-4">
            <SliderInput
              accent={theme.accent}
              label="Loan amount"
              max={50000000}
              min={100000}
              prefix="₹"
              step={50000}
              value={loanAmount}
              onChange={setLoanAmount}
            />
            <SliderInput
              accent={theme.accent}
              label="Rate of interest (p.a.)"
              max={18}
              min={1}
              step={0.1}
              suffix="%"
              value={annualRate}
              onChange={setAnnualRate}
            />
            <SliderInput
              accent={theme.accent}
              label="Loan tenure"
              max={30}
              min={1}
              step={1}
              suffix="Yr"
              value={years}
              onChange={setYears}
            />
          </div>
        </>
      }
      resultPanel={
        <ResultRows
          items={[
            { label: "Monthly EMI", value: formatCurrency(mortgage.emi) },
            { label: "Principal amount", value: formatCurrency(loanAmount) },
            { label: "Total interest", value: formatCurrency(mortgage.totalInterest) },
            { label: "Total amount", value: formatCurrency(mortgage.totalAmount) },
          ]}
        />
      }
      theme={theme}
      title="Mortgage EMI Calculator"
    />
  );
}
