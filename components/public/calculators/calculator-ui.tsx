"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const joinClasses = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");
const sliderBoundFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const parseNumericValue = (rawValue: string) => {
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : 0;
};

const clampValue = (value: number, min?: number, max?: number) => {
  const lowerBound = min ?? value;
  const upperBound = max ?? value;
  return Math.min(Math.max(value, lowerBound), upperBound);
};

const formatBoundValue = (value: number, prefix?: string, suffix?: string) => {
  const formatted = sliderBoundFormatter.format(value);

  if (prefix) {
    return `${prefix}${formatted}`;
  }

  if (suffix) {
    return `${formatted} ${suffix}`;
  }

  return formatted;
};

export type CalculatorTheme = {
  accent: string;
  accentDark: string;
  accentSoft: string;
  border: string;
  glow: string;
  heroBackground: string;
};

type NumberInputProps = {
  accent: string;
  ariaLabel: string;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  prefix?: string;
  step?: number;
  suffix?: string;
  value: number;
};

export function NumberInput({
  accent,
  ariaLabel,
  max,
  min,
  onChange,
  prefix,
  step = 1,
  suffix,
  value,
}: NumberInputProps) {
  return (
    <div
      className="relative min-w-[138px] overflow-hidden rounded-[16px] border bg-white shadow-[0_10px_24px_rgba(20,49,79,0.05)]"
      style={{ borderColor: `${accent}44`, backgroundColor: `${accent}0f` }}
    >
      {prefix ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5d6a7d]">
          {prefix}
        </span>
      ) : null}
      <input
        aria-label={ariaLabel}
        className={joinClasses(
          "h-12 w-full border-0 bg-transparent text-right text-[15px] font-semibold text-[#1f2f4d] outline-none",
          prefix ? "pl-9 pr-10" : suffix ? "pl-4 pr-10" : "px-4",
        )}
        inputMode="decimal"
        max={max}
        min={min}
        step={step}
        type="number"
        value={value}
        onBlur={(event) => onChange(clampValue(parseNumericValue(event.target.value), min, max))}
        onChange={(event) => onChange(parseNumericValue(event.target.value))}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5d6a7d]">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

type SliderInputProps = {
  accent: string;
  helper?: ReactNode;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  prefix?: string;
  step?: number;
  suffix?: string;
  value: number;
};

export function SliderInput({
  accent,
  helper,
  label,
  max,
  min,
  onChange,
  prefix,
  step = 1,
  suffix,
  showRangeLabels = false,
  variant = "inline",
  value,
}: SliderInputProps & { showRangeLabels?: boolean; variant?: "card" | "inline" }) {
  const safeValue = clampValue(value, min, max);
  const progress = max > min ? ((safeValue - min) / (max - min)) * 100 : 0;
  const rangeStyle = {
    "--range-accent": accent,
    background: `linear-gradient(90deg, ${accent} 0%, ${accent} ${progress}%, #e5ebf3 ${progress}%, #e5ebf3 100%)`,
  } as CSSProperties;

  return (
    <div
      className={joinClasses(
        variant === "card"
          ? "rounded-[24px] border border-[#e6ecf3] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(20,49,79,0.04)]"
          : "border-b border-[#edf2f8] py-5 first:pt-0 last:border-b-0 last:pb-0",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-[1.35] text-[#243752]">{label}</p>
          {variant === "card" && helper ? (
            <p className="mt-1 text-sm leading-[1.55] text-[#6d7a8c]">{helper}</p>
          ) : null}
        </div>
        <NumberInput
          accent={accent}
          ariaLabel={label}
          max={max}
          min={min}
          prefix={prefix}
          step={step}
          suffix={suffix}
          value={safeValue}
          onChange={(nextValue) => onChange(clampValue(nextValue, min, max))}
        />
      </div>

      <div className={variant === "card" ? "mt-5" : "mt-4"}>
        <input
          className="pv-range h-2 w-full appearance-none rounded-full"
          max={max}
          min={min}
          step={step}
          style={rangeStyle}
          type="range"
          value={safeValue}
          onChange={(event) => onChange(parseNumericValue(event.target.value))}
        />
        {showRangeLabels ? (
          <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-[#97a4b5]">
            <span>{formatBoundValue(min, prefix, suffix)}</span>
            <span>{formatBoundValue(max, prefix, suffix)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type ResultCardProps = {
  accent: string;
  detail?: ReactNode;
  label: string;
  value: ReactNode;
};

export function ResultCard({ accent, detail, label, value }: ResultCardProps) {
  return (
    <div
      className="rounded-[24px] border bg-white px-5 py-5 shadow-[0_16px_32px_rgba(20,49,79,0.06)]"
      style={{ borderColor: `${accent}26` }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8798]">{label}</p>
      <p className="mt-3 text-[26px] font-semibold leading-none tracking-[-0.04em] text-[#14253f]">
        {value}
      </p>
      {detail ? <p className="mt-3 text-sm leading-[1.6] text-[#627086]">{detail}</p> : null}
    </div>
  );
}

type ResultRow = {
  label: string;
  value: ReactNode;
};

export function ResultRows({ items }: { items: ResultRow[] }) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div
          className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#edf2f8] py-3 last:border-b-0 last:pb-0 first:pt-0"
          key={item.label}
        >
          <p className="text-[15px] leading-[1.6] text-[#5f6f84]">{item.label}</p>
          <p className="text-[17px] font-semibold leading-none tracking-[-0.02em] text-[#14253f]">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

type DonutChartSegment = {
  color: string;
  label: string;
  value: number;
};

type DonutChartProps = {
  centerLabel: string;
  centerValue: string;
  segments: DonutChartSegment[];
  title: string;
};

export function DonutChart({
  centerLabel,
  centerValue,
  segments,
  title,
}: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0);
  let currentPercentage = 0;
  const chartBackground =
    total > 0
      ? `conic-gradient(${segments
          .map((segment) => {
            const start = currentPercentage;
            const slice = (Math.max(segment.value, 0) / total) * 100;
            currentPercentage += slice;
            return `${segment.color} ${start}% ${currentPercentage}%`;
          })
          .join(", ")})`
      : "#e7edf5";

  return (
    <div className="rounded-[28px] border border-[#e5ebf3] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(20,49,79,0.06)] sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[21px] font-semibold tracking-[-0.035em] text-[#14253f]">{title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          {segments.map((segment) => (
            <div className="flex items-center gap-2" key={segment.label}>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-[#5f6f84]">{segment.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div
          className="relative h-[230px] w-[230px] rounded-full"
          style={{ background: chartBackground }}
        >
          <div className="absolute inset-[48px] rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(20,49,79,0.06)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#7b8798]">
              {centerLabel}
            </p>
            <p className="mt-3 text-[26px] font-semibold leading-none tracking-[-0.04em] text-[#14253f]">
              {centerValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type BarChartItem = {
  color: string;
  label: string;
  value: number;
  valueLabel: string;
};

type BarChartProps = {
  items: BarChartItem[];
  title: string;
};

export function BarChart({ items, title }: BarChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 0);

  return (
    <div className="rounded-[28px] border border-[#e5ebf3] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(20,49,79,0.06)] sm:px-6">
      <h3 className="text-[21px] font-semibold tracking-[-0.035em] text-[#14253f]">{title}</h3>
      <div className="mt-6 space-y-5">
        {items.map((item) => {
          const width = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[15px] font-medium text-[#243752]">{item.label}</p>
                <p className="text-sm font-semibold text-[#5f6f84]">{item.valueLabel}</p>
              </div>
              <div className="h-3 rounded-full bg-[#edf2f8]">
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{ backgroundColor: item.color, width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type CalculatorLayoutProps = {
  calculatorTitle: ReactNode;
  description?: ReactNode;
  chartPanel: ReactNode;
  inputPanel: ReactNode;
  resultPanel: ReactNode;
  sidebar?: ReactNode;
  theme: CalculatorTheme;
  title: ReactNode;
};

export function CalculatorLayout({
  calculatorTitle,
  description,
  chartPanel,
  inputPanel,
  resultPanel,
  sidebar,
  theme,
  title,
}: CalculatorLayoutProps) {
  const pathname = usePathname();
  const defaultSidebar = sidebar ?? (
    <div className="space-y-5">
      <div
        className="overflow-hidden rounded-[22px] border bg-white px-6 py-6 shadow-[0_14px_34px_rgba(20,49,79,0.08)]"
        style={{ borderColor: theme.border }}
      >
        <div
          className="grid h-12 w-12 place-items-center rounded-[16px]"
          style={{ backgroundColor: theme.accentSoft, color: theme.accentDark }}
        >
          <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 6v12m6-6H6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.03em] text-[#14253f]">
          Need financing for a deal?
        </h3>
        <p className="mt-3 text-[15px] leading-[1.7] text-[#5f6f84]">
          Explore investor-friendly loan offers and get a quick eligibility check.
        </p>
        <Link
          className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-[14px] px-5 text-sm font-semibold !text-white shadow-[0_14px_26px_rgba(20,49,79,0.14)] transition-transform duration-200 hover:-translate-y-0.5"
          href="/get-financing"
          style={{ backgroundColor: theme.accentDark, color: "#ffffff" }}
        >
          Check eligibility
        </Link>
      </div>

      <div
        className="overflow-hidden rounded-[22px] border bg-white px-6 py-5 shadow-[0_14px_34px_rgba(20,49,79,0.08)]"
        style={{ borderColor: theme.border }}
      >
        <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#14253f]">
          Popular calculators
        </h3>
        <div className="mt-4 divide-y divide-[#edf2f8]">
          {[
            { href: "/calculators/roi", label: "ROI Calculator" },
            { href: "/calculators/mortgage", label: "EMI Calculator" },
            { href: "/calculators/brrrr", label: "BRRRR Calculator" },
            { href: "/calculators/value-add", label: "Value-Add Analysis" },
          ].map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                className={joinClasses(
                  "flex items-center justify-between py-3 text-[14.5px] font-medium transition-colors",
                  isActive ? "text-[#14253f]" : "text-[#5f6f84] hover:text-[#14253f]",
                )}
                href={item.href}
                key={item.href}
              >
                <span>{item.label}</span>
                <svg
                  aria-hidden="true"
                  className={joinClasses("h-4 w-4", isActive ? "text-[#14253f]" : "text-[#94a3b8]")}
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M7 14l6-4-6-4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <section className="pv-container pb-10 pt-10 sm:pb-14 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            <Link
              className="text-sm font-semibold text-[var(--pv-sand)] transition-colors hover:text-[var(--pv-navy)]"
              href="/calculators"
            >
              ← Back to calculators
            </Link>
            <h1 className="mt-4 text-[32px] font-semibold leading-[1.04] tracking-[-0.05em] text-[#14253f] sm:text-[40px]">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-[780px] text-[16px] leading-[1.8] text-[#5f6f84]">
                {description}
              </p>
            ) : null}

            <div
              className="mt-7 rounded-[26px] border bg-white px-5 py-6 shadow-[0_20px_54px_rgba(20,49,79,0.08)] sm:px-8 sm:py-8"
              style={{ borderColor: theme.border }}
            >
              <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <div>{inputPanel}</div>
                <div>{chartPanel}</div>
              </div>

              <div className="mt-7 border-t border-[#edf2f8] pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: theme.accentDark }}>
                  Results
                </p>
                <p className="mt-2 text-[20px] font-semibold tracking-[-0.035em] text-[#14253f]">
                  {calculatorTitle}
                </p>
                <div className="mt-5">{resultPanel}</div>
              </div>
            </div>
          </div>

          <aside>{defaultSidebar}</aside>
        </div>
      </section>
    </div>
  );
}
