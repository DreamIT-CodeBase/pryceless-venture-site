"use client";

import { useState } from "react";

import type { CalculatorContent } from "@/lib/calculator-content";
import {
  calculateBrrrr,
  calculateMortgage,
  calculateRoi,
  calculateValueAdd,
  defaultBrrrrInputs,
  defaultMortgageInputs,
  defaultRoiInputs,
  defaultValueAddInputs,
  isSupportedCalculatorType,
  type BrrrrInputs,
  type MortgageInputs,
  type RoiInputs,
  type ValueAddInputs,
} from "@/lib/calculator-engine";

type CalculatorWorkbenchProps = Pick<
  CalculatorContent,
  "calculatorType" | "disclaimer" | "shortDescription" | "title"
>;

type FieldConfig = {
  description?: string;
  key: string;
  label: string;
  min?: number;
  prefix?: string;
  step?: number;
  suffix?: string;
};

type InputSection = {
  description: string;
  fields: FieldConfig[];
  title: string;
};

type OutputMetric = {
  label: string;
  value: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatNumber = (value: number) => numberFormatter.format(value);
const formatPercent = (value: number | null | undefined) =>
  value == null ? "N/A" : `${value.toFixed(1)}%`;
const formatRatio = (value: number | null | undefined) =>
  value == null ? "N/A" : `${value.toFixed(2)}x`;
const formatYears = (value: number | null | undefined) =>
  value == null ? "N/A" : `${value.toFixed(1)} yrs`;

const parseInputNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function NumericField({
  description,
  label,
  min,
  onChange,
  prefix,
  step = 1,
  suffix,
  value,
}: FieldConfig & {
  onChange: (nextValue: number) => void;
  value: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
            {prefix}
          </span>
        ) : null}
        <input
          className={`w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 ${
            prefix ? "pl-8 pr-4" : suffix ? "pl-4 pr-12" : "px-4"
          }`}
          inputMode="decimal"
          min={min}
          step={step}
          type="number"
          value={value}
          onChange={(event) => onChange(parseInputNumber(event.target.value))}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
            {suffix}
          </span>
        ) : null}
      </div>
      {description ? <span className="mt-2 block text-xs leading-5 text-slate-500">{description}</span> : null}
    </label>
  );
}

function OutputCard({ label, value }: OutputMetric) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-[21px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#111827]">
        {value}
      </p>
    </div>
  );
}

function AssumptionsPanel({
  items,
  title,
}: {
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white px-6 py-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)] sm:px-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">Assumptions</p>
      <h3 className="mt-3 text-[24px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#111827]">
        {title}
      </h3>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li className="flex items-start gap-3" key={item}>
            <span className="mt-[8px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#111827]" />
            <p className="text-[15px] leading-[1.75] text-slate-700">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CalculatorLayout<T extends Record<string, number>>({
  assumptions,
  metrics,
  onReset,
  sections,
  setValue,
  summaryLabel,
  summaryValue,
  values,
}: {
  assumptions: string[];
  metrics: OutputMetric[];
  onReset: () => void;
  sections: InputSection[];
  setValue: (key: keyof T, nextValue: number) => void;
  summaryLabel: string;
  summaryValue: string;
  values: T;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
      <div className="rounded-[32px] border border-slate-200 bg-slate-50 px-5 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">Interactive Inputs</p>
            <h2 className="mt-2 text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#111827]">
              Enter your deal assumptions
            </h2>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            type="button"
            onClick={onReset}
          >
            Reset Defaults
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {sections.map((section) => (
            <div className="rounded-[28px] border border-slate-200 bg-white px-4 py-4 sm:px-5 sm:py-5" key={section.title}>
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#111827]">{section.title}</h3>
                <p className="mt-2 max-w-[620px] text-sm leading-6 text-slate-500">{section.description}</p>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <NumericField
                    {...field}
                    key={field.key}
                    value={values[field.key as keyof T] as number}
                    onChange={(nextValue) => setValue(field.key as keyof T, nextValue)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-[#0f172a] px-6 py-6 text-white shadow-[0_26px_70px_rgba(15,23,42,0.2)] sm:px-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-300">Live Output</p>
          <p className="mt-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.045em]">
            {summaryValue}
          </p>
          <p className="mt-3 max-w-[320px] text-sm leading-6 text-slate-300">{summaryLabel}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <OutputCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>

        <AssumptionsPanel items={assumptions} title="How to read the model" />
      </div>
    </div>
  );
}

function RoiWorkbench() {
  const [inputs, setInputs] = useState<RoiInputs>(defaultRoiInputs);
  const results = calculateRoi(inputs);

  const sections: InputSection[] = [
    {
      description: "Define the acquisition and upfront capital stack for the deal.",
      title: "Acquisition",
      fields: [
        { key: "purchasePrice", label: "Purchase Price", prefix: "$", step: 1000, min: 0 },
        { key: "rehabBudget", label: "Rehab Budget", prefix: "$", step: 1000, min: 0 },
        { key: "closingCosts", label: "Closing Costs", prefix: "$", step: 500, min: 0 },
        { key: "downPaymentPercent", label: "Down Payment", suffix: "%", step: 1, min: 0 },
      ],
    },
    {
      description: "Capture rent, vacancy, and expense assumptions to estimate operating performance.",
      title: "Operations",
      fields: [
        { key: "monthlyRent", label: "Monthly Rent", prefix: "$", step: 50, min: 0 },
        { key: "otherMonthlyIncome", label: "Other Monthly Income", prefix: "$", step: 25, min: 0 },
        { key: "vacancyRate", label: "Vacancy Rate", suffix: "%", step: 0.5, min: 0 },
        { key: "monthlyOperatingExpenses", label: "Monthly Operating Expenses", prefix: "$", step: 50, min: 0 },
      ],
    },
    {
      description: "Use financing and appreciation assumptions to model levered performance.",
      title: "Financing",
      fields: [
        { key: "interestRate", label: "Interest Rate", suffix: "%", step: 0.125, min: 0 },
        { key: "loanTermYears", label: "Loan Term", suffix: "yrs", step: 1, min: 1 },
        {
          key: "annualAppreciationRate",
          label: "Annual Appreciation",
          suffix: "%",
          step: 0.25,
          min: 0,
        },
      ],
    },
  ];

  const metrics: OutputMetric[] = [
    { label: "Total Project Cost", value: formatCurrency(results.totalProjectCost) },
    { label: "Cash Invested", value: formatCurrency(results.cashInvested) },
    { label: "Monthly Debt Service", value: formatCurrency(results.monthlyDebtService) },
    { label: "Annual NOI", value: formatCurrency(results.annualNoi) },
    { label: "Annual Cash Flow", value: formatCurrency(results.annualCashFlow) },
    { label: "Cap Rate", value: formatPercent(results.capRatePercent) },
    { label: "Cash-On-Cash Return", value: formatPercent(results.cashOnCashReturnPercent) },
    { label: "DSCR", value: formatRatio(results.dscr) },
  ];

  return (
    <CalculatorLayout<RoiInputs>
      assumptions={[
        "Operating expenses should include taxes, insurance, repairs, management, and reserves, but not mortgage payments.",
        "Cash-on-cash return is based on annual cash flow divided by upfront cash invested.",
        "First-year ROI includes modeled appreciation, which may not materialize in real market conditions.",
      ]}
      metrics={metrics}
      onReset={() => setInputs(defaultRoiInputs)}
      sections={sections}
      setValue={(key, nextValue) => setInputs({ ...inputs, [key]: nextValue })}
      summaryLabel="Estimated first-year return on invested cash, combining annual cash flow and modeled appreciation."
      summaryValue={formatPercent(results.firstYearRoiPercent)}
      values={inputs}
    />
  );
}

function BrrrrWorkbench() {
  const [inputs, setInputs] = useState<BrrrrInputs>(defaultBrrrrInputs);
  const results = calculateBrrrr(inputs);

  const sections: InputSection[] = [
    {
      description: "Model the capital needed to acquire and renovate the asset before refinance.",
      title: "Buy + Rehab",
      fields: [
        { key: "purchasePrice", label: "Purchase Price", prefix: "$", step: 1000, min: 0 },
        { key: "rehabBudget", label: "Rehab Budget", prefix: "$", step: 1000, min: 0 },
        { key: "closingCosts", label: "Closing Costs", prefix: "$", step: 500, min: 0 },
        { key: "downPaymentPercent", label: "Down Payment", suffix: "%", step: 1, min: 0 },
      ],
    },
    {
      description: "Use stabilized valuation and refinance terms to estimate cash returned and the ongoing debt load.",
      title: "Refinance",
      fields: [
        { key: "afterRepairValue", label: "After Repair Value", prefix: "$", step: 1000, min: 0 },
        { key: "refinanceLtvPercent", label: "Refinance LTV", suffix: "%", step: 1, min: 0 },
        { key: "refinanceInterestRate", label: "Refi Interest Rate", suffix: "%", step: 0.125, min: 0 },
        { key: "refinanceLoanTermYears", label: "Refi Loan Term", suffix: "yrs", step: 1, min: 1 },
      ],
    },
    {
      description: "Estimate the stabilized rent roll and operating profile after the rehab and refinance are complete.",
      title: "Stabilized Operations",
      fields: [
        { key: "monthlyRent", label: "Monthly Rent", prefix: "$", step: 50, min: 0 },
        { key: "otherMonthlyIncome", label: "Other Monthly Income", prefix: "$", step: 25, min: 0 },
        { key: "vacancyRate", label: "Vacancy Rate", suffix: "%", step: 0.5, min: 0 },
        { key: "monthlyOperatingExpenses", label: "Monthly Operating Expenses", prefix: "$", step: 50, min: 0 },
      ],
    },
  ];

  const metrics: OutputMetric[] = [
    { label: "Initial Cash Required", value: formatCurrency(results.initialCashRequired) },
    { label: "Refinance Loan Amount", value: formatCurrency(results.refinanceLoanAmount) },
    { label: "Cash Out At Refi", value: formatCurrency(results.cashOutAtRefinance) },
    {
      label: "Cash Left In Deal",
      value: results.cashLeftInDeal > 0 ? formatCurrency(results.cashLeftInDeal) : "$0",
    },
    { label: "Equity Created", value: formatCurrency(results.equityCreated) },
    { label: "Annual Cash Flow", value: formatCurrency(results.annualCashFlow) },
    {
      label: "Cash-On-Cash After Refi",
      value:
        results.cashLeftInDeal > 0
          ? formatPercent(results.cashOnCashAfterRefiPercent)
          : "All cash returned",
    },
    { label: "DSCR After Refi", value: formatRatio(results.dscr) },
  ];

  return (
    <CalculatorLayout<BrrrrInputs>
      assumptions={[
        "This model assumes the refinance loan is based on ARV multiplied by your selected LTV.",
        "Cash left in the deal equals initial cash required minus estimated refinance proceeds above the initial acquisition loan.",
        "If your refinance returns all initial cash, the cash-on-cash metric is shown as fully returned rather than an infinite percentage.",
      ]}
      metrics={metrics}
      onReset={() => setInputs(defaultBrrrrInputs)}
      sections={sections}
      setValue={(key, nextValue) => setInputs({ ...inputs, [key]: nextValue })}
      summaryLabel="Estimated cash remaining in the deal after refinance, which is the core BRRRR leverage checkpoint."
      summaryValue={
        results.cashLeftInDeal > 0
          ? formatCurrency(results.cashLeftInDeal)
          : "All Cash Returned"
      }
      values={inputs}
    />
  );
}

function MortgageWorkbench() {
  const [inputs, setInputs] = useState<MortgageInputs>(defaultMortgageInputs);
  const results = calculateMortgage(inputs);

  const sections: InputSection[] = [
    {
      description: "Start with the purchase price and your intended down payment structure.",
      title: "Loan Structure",
      fields: [
        { key: "purchasePrice", label: "Purchase Price", prefix: "$", step: 1000, min: 0 },
        { key: "downPaymentPercent", label: "Down Payment", suffix: "%", step: 1, min: 0 },
        { key: "interestRate", label: "Interest Rate", suffix: "%", step: 0.125, min: 0 },
        { key: "loanTermYears", label: "Loan Term", suffix: "yrs", step: 1, min: 1 },
      ],
    },
    {
      description: "Add the monthly ownership costs that sit on top of principal and interest.",
      title: "Monthly Housing Costs",
      fields: [
        { key: "annualPropertyTax", label: "Annual Property Tax", prefix: "$", step: 250, min: 0 },
        { key: "annualInsurance", label: "Annual Insurance", prefix: "$", step: 100, min: 0 },
        { key: "monthlyHoa", label: "Monthly HOA", prefix: "$", step: 25, min: 0 },
        { key: "monthlyPmi", label: "Monthly PMI", prefix: "$", step: 25, min: 0 },
      ],
    },
  ];

  const metrics: OutputMetric[] = [
    { label: "Down Payment", value: formatCurrency(results.downPaymentAmount) },
    { label: "Loan Amount", value: formatCurrency(results.loanAmount) },
    {
      label: "Monthly Principal + Interest",
      value: formatCurrency(results.monthlyPrincipalAndInterest),
    },
    { label: "Monthly Escrows + Fees", value: formatCurrency(results.monthlyEscrows) },
    { label: "Total Monthly Payment", value: formatCurrency(results.totalMonthlyPayment) },
    { label: "Total Interest Paid", value: formatCurrency(results.totalInterestPaid) },
    {
      label: "Principal Paid In 5 Years",
      value: formatCurrency(results.principalPaidAfterFiveYears),
    },
    {
      label: "Balance After 5 Years",
      value: formatCurrency(results.remainingBalanceAfterFiveYears),
    },
  ];

  return (
    <CalculatorLayout<MortgageInputs>
      assumptions={[
        "Principal and interest are calculated using a standard fully amortizing fixed-rate mortgage formula.",
        "Taxes, insurance, HOA, and PMI are layered on top of principal and interest to estimate the all-in monthly payment.",
        "The five-year balance view is useful when comparing hold strategies or refinance timing.",
      ]}
      metrics={metrics}
      onReset={() => setInputs(defaultMortgageInputs)}
      sections={sections}
      setValue={(key, nextValue) => setInputs({ ...inputs, [key]: nextValue })}
      summaryLabel="Estimated total monthly housing payment including principal, interest, taxes, insurance, HOA, and PMI."
      summaryValue={formatCurrency(results.totalMonthlyPayment)}
      values={inputs}
    />
  );
}

function ValueAddWorkbench() {
  const [inputs, setInputs] = useState<ValueAddInputs>(defaultValueAddInputs);
  const results = calculateValueAdd(inputs);

  const sections: InputSection[] = [
    {
      description: "Set the unit count plus the current and stabilized rental assumptions.",
      title: "Income Upside",
      fields: [
        { key: "unitCount", label: "Unit Count", step: 1, min: 0 },
        { key: "avgCurrentRent", label: "Current Avg Rent / Unit", prefix: "$", step: 25, min: 0 },
        {
          key: "avgStabilizedRent",
          label: "Stabilized Avg Rent / Unit",
          prefix: "$",
          step: 25,
          min: 0,
        },
        { key: "currentOccupancyPercent", label: "Current Occupancy", suffix: "%", step: 1, min: 0 },
        {
          key: "stabilizedOccupancyPercent",
          label: "Stabilized Occupancy",
          suffix: "%",
          step: 1,
          min: 0,
        },
      ],
    },
    {
      description: "Capture other income and operating cost assumptions before and after stabilization.",
      title: "Operations",
      fields: [
        {
          key: "annualOtherIncomeCurrent",
          label: "Current Other Income",
          prefix: "$",
          step: 500,
          min: 0,
        },
        {
          key: "annualOtherIncomeStabilized",
          label: "Stabilized Other Income",
          prefix: "$",
          step: 500,
          min: 0,
        },
        {
          key: "annualOperatingExpensesCurrent",
          label: "Current Operating Expenses",
          prefix: "$",
          step: 1000,
          min: 0,
        },
        {
          key: "annualOperatingExpensesStabilized",
          label: "Stabilized Operating Expenses",
          prefix: "$",
          step: 1000,
          min: 0,
        },
      ],
    },
    {
      description: "Tie NOI growth to value using a market cap rate and renovation budget assumption.",
      title: "Capital Plan",
      fields: [
        { key: "renovationBudget", label: "Renovation Budget", prefix: "$", step: 5000, min: 0 },
        { key: "exitCapRatePercent", label: "Exit Cap Rate", suffix: "%", step: 0.1, min: 0.1 },
      ],
    },
  ];

  const metrics: OutputMetric[] = [
    { label: "Current NOI", value: formatCurrency(results.currentNoi) },
    { label: "Stabilized NOI", value: formatCurrency(results.stabilizedNoi) },
    { label: "Annual NOI Gain", value: formatCurrency(results.annualNoiGain) },
    { label: "Current Value", value: formatCurrency(results.currentValue) },
    { label: "Stabilized Value", value: formatCurrency(results.stabilizedValue) },
    { label: "Estimated Value Created", value: formatCurrency(results.estimatedValueCreated) },
    { label: "Net Value Created", value: formatCurrency(results.netValueCreated) },
    {
      label: "Payback Period",
      value: results.paybackPeriodYears ? formatYears(results.paybackPeriodYears) : "N/A",
    },
  ];

  return (
    <CalculatorLayout<ValueAddInputs>
      assumptions={[
        "Value creation is estimated by dividing NOI growth by the selected cap rate, which is a common screening shortcut rather than a full valuation model.",
        "Renovation ROI compares estimated net value created against your renovation budget, so construction scope discipline matters.",
        "Use stabilized expenses realistically. Savings assumptions that are too optimistic can overstate value creation quickly.",
      ]}
      metrics={metrics}
      onReset={() => setInputs(defaultValueAddInputs)}
      sections={sections}
      setValue={(key, nextValue) => setInputs({ ...inputs, [key]: nextValue })}
      summaryLabel="Estimated net value created after subtracting the renovation budget from the cap-rate-driven value uplift."
      summaryValue={formatCurrency(results.netValueCreated)}
      values={inputs}
    />
  );
}

export function CalculatorWorkbench({
  calculatorType,
}: CalculatorWorkbenchProps) {
  if (!isSupportedCalculatorType(calculatorType)) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-slate-50 px-6 py-8 text-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">Calculator Unavailable</p>
        <h2 className="mt-3 text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#111827]">
          This calculator type does not have an interactive model attached yet.
        </h2>
        <p className="mt-4 max-w-[720px] text-[15px] leading-[1.8] text-slate-600">
          The page is live, but the formula set for this calculator has not been mapped in the app yet. Supported calculator types render a full working model with editable assumptions and live outputs.
        </p>
      </div>
    );
  }

  if (calculatorType === "ROI") {
    return <RoiWorkbench />;
  }

  if (calculatorType === "BRRRR") {
    return <BrrrrWorkbench />;
  }

  if (calculatorType === "MORTGAGE") {
    return <MortgageWorkbench />;
  }

  return <ValueAddWorkbench />;
}
