"use client";

import type { ReactNode } from "react";

import type { CalculatorTheme } from "./calculator-ui";

export type CalculatorPageKind = "brrrr" | "mortgage" | "roi" | "value-add";

export type TableColumn = {
  align?: "left" | "right";
  label: string;
};

export type TableRow = {
  cells: ReactNode[];
  key: string;
};

export const calculatorThemes: Record<CalculatorPageKind, CalculatorTheme> = {
  brrrr: {
    accent: "#b14bdc",
    accentDark: "#6d2d85",
    accentSoft: "#f4e7f8",
    border: "#d7bdd9",
    glow: "rgba(177,75,220,0.26)",
    heroBackground: "linear-gradient(135deg, #f8ebfb 0%, #ffffff 72%)",
  },
  mortgage: {
    accent: "#f59e0b",
    accentDark: "#8b5711",
    accentSoft: "#fdf2d3",
    border: "#e0c89b",
    glow: "rgba(245,158,11,0.26)",
    heroBackground: "linear-gradient(135deg, #fff3cf 0%, #ffffff 72%)",
  },
  roi: {
    accent: "#4caef4",
    accentDark: "#245986",
    accentSoft: "#e7f6ff",
    border: "#c0dceb",
    glow: "rgba(76,174,244,0.24)",
    heroBackground: "linear-gradient(135deg, #e7f6ff 0%, #ffffff 72%)",
  },
  "value-add": {
    accent: "#14b8a6",
    accentDark: "#0f6f64",
    accentSoft: "#ddf6f2",
    border: "#acd6cd",
    glow: "rgba(20,184,166,0.24)",
    heroBackground: "linear-gradient(135deg, #dff5ef 0%, #ffffff 72%)",
  },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const ratioFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const formatCurrency = (value: number) => currencyFormatter.format(Math.round(value));
export const formatNumber = (value: number) => numberFormatter.format(value);
export const formatPercent = (value: number, digits = 1) => `${value.toFixed(digits)}%`;
export const formatRatio = (value: number | null) =>
  value == null ? "N/A" : `${ratioFormatter.format(value)}x`;
export const formatYears = (value: number | null) =>
  value == null ? "N/A" : `${numberFormatter.format(value)} years`;
export const shareOfTotal = (value: number, total: number) => (total > 0 ? (value / total) * 100 : 0);

export function SnapshotPanel({
  accent,
  accentSoft,
  description,
  items,
  title,
}: {
  accent: string;
  accentSoft: string;
  description: string;
  items: Array<{ label: string; value: string }>;
  title: string;
}) {
  return (
    <>
      <div
        className="inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]"
        style={{ backgroundColor: accentSoft, color: accent }}
      >
        Current Scenario
      </div>
      <h2 className="mt-4 text-[28px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#14253f]">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-[1.75] text-[#5f6f84]">{description}</p>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            className="flex items-center justify-between rounded-[20px] border border-[#e7edf4] bg-[#fbfdff] px-4 py-3"
            key={item.label}
          >
            <span className="text-sm font-medium text-[#5f6f84]">{item.label}</span>
            <span className="text-[17px] font-semibold text-[#14253f]">{item.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export function ResetButton({
  accentDark,
  accentSoft,
  onClick,
}: {
  accentDark: string;
  accentSoft: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex min-h-[40px] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
      style={{ backgroundColor: accentSoft, color: accentDark }}
      type="button"
      onClick={onClick}
    >
      Reset Scenario
    </button>
  );
}

export function InputSection({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="space-y-4 border-t border-[#e7edf4] pt-5 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-[21px] font-semibold tracking-[-0.035em] text-[#14253f]">{title}</h3>
        <p className="mt-2 text-[15px] leading-[1.7] text-[#5f6f84]">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function BreakdownPanel({
  children,
  description,
  theme,
  title,
}: {
  children: ReactNode;
  description: string;
  theme: CalculatorTheme;
  title: string;
}) {
  return (
    <div
      className="rounded-[32px] border bg-white px-5 py-6 shadow-[0_20px_52px_rgba(20,49,79,0.08)] sm:px-7"
      style={{ borderColor: theme.border }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: theme.accentDark }}>
        Breakdown
      </p>
      <h3 className="mt-3 text-[30px] font-semibold leading-[1.06] tracking-[-0.045em] text-[#14253f]">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-[1.75] text-[#5f6f84]">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: TableColumn[];
  rows: TableRow[];
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e7edf4]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white">
          <thead>
            <tr className="bg-[#f6f9fc]">
              {columns.map((column) => (
                <th
                  className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8798] ${column.align === "right" ? "text-right" : "text-left"}`}
                  key={column.label}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#fbfdff]"} key={row.key}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    className={`px-4 py-4 text-sm leading-[1.7] text-[#243752] ${columns[cellIndex]?.align === "right" ? "text-right" : "text-left"}`}
                    key={`${row.key}-${cellIndex}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InsightBand({
  body,
  theme,
  title,
}: {
  body: string;
  theme: CalculatorTheme;
  title: string;
}) {
  return (
    <div className="rounded-[24px] px-5 py-5" style={{ backgroundColor: theme.accentSoft }}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: theme.accentDark }}>
        Insight
      </p>
      <p className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-[#14253f]">{title}</p>
      <p className="mt-3 text-[15px] leading-[1.7] text-[#526174]">{body}</p>
    </div>
  );
}
