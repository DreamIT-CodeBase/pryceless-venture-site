"use client";

import { useMemo, useState } from "react";

import {
  coercePropertyDealType,
  getPropertyTemplateMetricFields,
  propertyDealTypeOptions,
  propertyTemplateConfigMap,
  type PropertyDealType,
  type PropertyTemplateMetricKey,
} from "@/lib/property-templates";

type PropertyTemplateFieldsProps = {
  initialMetricValues: Partial<Record<PropertyTemplateMetricKey, string>>;
  initialStrategy?: string | null;
};

export function PropertyTemplateFields({
  initialMetricValues,
  initialStrategy,
}: PropertyTemplateFieldsProps) {
  const [strategy, setStrategy] = useState<PropertyDealType>(
    coercePropertyDealType(initialStrategy),
  );
  const [metricValues, setMetricValues] = useState<
    Partial<Record<PropertyTemplateMetricKey, string>>
  >(initialMetricValues);

  const templateConfig = propertyTemplateConfigMap[strategy];
  const templateFields = useMemo(() => getPropertyTemplateMetricFields(strategy), [strategy]);

  return (
    <>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Deal Type</span>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          name="strategy"
          onChange={(event) => setStrategy(event.target.value as PropertyDealType)}
          value={strategy}
        >
          {propertyDealTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          This controls the public property template, the portfolio filter, and which metric boxes
          appear across the CMS and slug page.
        </span>
      </label>

      <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/70 p-5 md:col-span-2">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <h3 className="text-base font-semibold text-slate-900">
              Template-Specific Deal Metrics
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {templateConfig.helperText} Photos stay shared in the gallery uploader below, and the
              long description is processed into overview boxes and bullet-driven standout content.
            </p>
          </div>

          {templateFields.map((field) => (
            <label className="block" key={field.key}>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                {field.label}
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                name={`templateMetric_${field.key}`}
                onChange={(event) =>
                  setMetricValues((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                placeholder={field.placeholder}
                value={metricValues[field.key] ?? ""}
              />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
