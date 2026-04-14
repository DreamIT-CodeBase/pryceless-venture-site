import { titleCase } from "@/lib/utils";

const tones = {
  emerald:
    "border border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border border-amber-200 bg-amber-50 text-amber-700",
  rose: "border border-rose-200 bg-rose-50 text-rose-700",
  slate: "border border-slate-200 bg-slate-100 text-slate-700",
  violet:
    "border border-violet-200 bg-violet-50 text-violet-700",
} as const;

const getTone = (normalized: string) => {
  if (
    ["PUBLISHED", "AVAILABLE", "OPEN", "ACTIVE", "LIVE", "FOR_SALE"].includes(normalized)
  ) {
    return tones.emerald;
  }

  if (["DRAFT", "COMING_SOON", "UNDER_CONTRACT", "IN_PROGRESS"].includes(normalized)) {
    return tones.amber;
  }

  if (["ARCHIVED", "SOLD", "CLOSED", "INACTIVE"].includes(normalized)) {
    return tones.slate;
  }

  if (["EMAIL", "CRM", "BOTH"].includes(normalized)) {
    return tones.violet;
  }

  return tones.slate;
};

export function AdminStatusPill({
  value,
}: {
  value: string | boolean | null | undefined;
}) {
  const raw =
    typeof value === "boolean"
      ? value
        ? "ACTIVE"
        : "INACTIVE"
      : String(value ?? "UNKNOWN");
  const normalized = raw.replace(/\s+/g, "_").toUpperCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getTone(
        normalized,
      )}`}
    >
      {titleCase(raw)}
    </span>
  );
}
