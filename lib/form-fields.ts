import { slugify } from "@/lib/utils";

export const dynamicFormFieldTypes = [
  "TEXT",
  "EMAIL",
  "PHONE",
  "NUMBER",
  "SELECT",
  "RADIO",
  "TEXTAREA",
  "FILE",
] as const;

export type DynamicFormFieldType = (typeof dynamicFormFieldTypes)[number];

export type DynamicFormFieldDefinition = {
  fieldKey: string;
  label: string;
  type: DynamicFormFieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
};

type FormFieldEditorInput = {
  fieldKey?: string;
  label?: string;
  name?: string;
  options?: string[] | string | null;
  placeholder?: string | null;
  required?: boolean;
  type?: string;
};

const allowedFieldTypes = new Set<string>(dynamicFormFieldTypes);

const parseLooseLines = (value: string | undefined) =>
  (value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const parsePipeRows = (value: string | undefined) =>
  parseLooseLines(value).map((line) => line.split("|").map((segment) => segment.trim()));

const sanitizeFieldKey = (value: string) => slugify(value).replace(/-/g, "_");

export const normalizeDynamicFormFieldType = (
  value: string | null | undefined,
): DynamicFormFieldType => {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  const aliasedValue =
    normalized === "TEXT_AREA"
      ? "TEXTAREA"
      : normalized === "TEL"
        ? "PHONE"
        : normalized === "FILE_UPLOAD"
          ? "FILE"
          : normalized;

  if (allowedFieldTypes.has(aliasedValue)) {
    return aliasedValue as DynamicFormFieldType;
  }

  return "TEXT";
};

export const parseStoredFieldOptions = (value: string | null | undefined) => {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(normalized) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .map((option) => String(option ?? "").trim())
        .filter(Boolean);
    }
  } catch {
    // Fall back to loose parsing for legacy editor values.
  }

  return normalized
    .split(/\r?\n|,/)
    .map((option) => option.trim())
    .filter(Boolean);
};

const normalizeFieldDefinition = (
  value: FormFieldEditorInput,
): DynamicFormFieldDefinition | null => {
  const fieldKey = sanitizeFieldKey(value.fieldKey || value.name || value.label || "");
  const label = String(value.label ?? "").trim();

  if (!fieldKey || !label) {
    return null;
  }

  const options =
    Array.isArray(value.options)
      ? value.options.map((option) => String(option ?? "").trim()).filter(Boolean)
      : parseStoredFieldOptions(typeof value.options === "string" ? value.options : undefined);

  return {
    fieldKey,
    label,
    type: normalizeDynamicFormFieldType(value.type),
    required: Boolean(value.required),
    options: options.length ? options : undefined,
    placeholder: String(value.placeholder ?? "").trim() || undefined,
  };
};

export const parseFormFieldsEditorValue = (value: string | undefined) => {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    return [] as DynamicFormFieldDefinition[];
  }

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((field) =>
            normalizeFieldDefinition(
              (field && typeof field === "object" ? field : {}) as FormFieldEditorInput,
            ),
          )
          .filter((field): field is DynamicFormFieldDefinition => Boolean(field));
      }
    } catch {
      // Fall through to the legacy pipe parser.
    }
  }

  return parsePipeRows(trimmed)
    .map((row) =>
      normalizeFieldDefinition({
        fieldKey: row[0],
        label: row[1],
        options: row[4],
        placeholder: row[5],
        required: (row[3] || "").toLowerCase() === "true",
        type: row[2],
      }),
    )
    .filter((field): field is DynamicFormFieldDefinition => Boolean(field));
};

export const formatFormFieldsEditorValue = (
  fields: Array<{
    fieldKey: string;
    label: string;
    options?: string | null;
    placeholder?: string | null;
    required: boolean;
    type: string;
  }>,
) =>
  JSON.stringify(
    fields.map((field) => ({
      label: field.label,
      name: field.fieldKey,
      type: normalizeDynamicFormFieldType(field.type).toLowerCase(),
      required: Boolean(field.required),
      options: parseStoredFieldOptions(field.options),
      placeholder: field.placeholder || "",
    })),
    null,
    2,
  );
