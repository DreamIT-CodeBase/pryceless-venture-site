import Link from "next/link";
import type { ReactNode } from "react";

const joinClasses = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

export const detailPrimaryButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-[rgba(191,147,117,0.7)] bg-[linear-gradient(135deg,#18314b_0%,#1f4367_100%)] px-5 py-3 text-sm font-semibold tracking-[0.01em] text-white shadow-[0_14px_32px_rgba(15,23,42,0.12)] transition duration-300 hover:brightness-[1.04]";

export const detailSecondaryButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-[rgba(191,147,117,0.38)] bg-[rgba(255,249,241,0.96)] px-5 py-3 text-sm font-semibold tracking-[0.01em] text-[#18314b] transition duration-300 hover:border-[var(--pv-sand)] hover:bg-white hover:text-[var(--pv-sand)]";

export function DetailPageCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white text-[#111827]">
      <div className="relative">{children}</div>
    </div>
  );
}

export function DetailSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={joinClasses("mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-[125px] 2xl:max-w-[1760px] 2xl:px-[164px]", className)}>{children}</section>;
}

export function DetailBreadcrumbs({
  currentLabel,
  href,
  hrefLabel = "Home",
}: {
  currentLabel: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-[9px] text-[12px] leading-none text-[#6b7380]">
      {href ? (
        <Link className="transition hover:text-[#18314b]" href={href}>
          {hrefLabel}
        </Link>
      ) : (
        <span>{hrefLabel}</span>
      )}
      <svg aria-hidden="true" className="h-[8px] w-[8px] text-[rgba(191,147,117,0.62)]" fill="none" viewBox="0 0 10 10">
        <path d="M1.5 5h6M5.5 2l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
      </svg>
      <span className="text-[var(--pv-sand)]">{currentLabel}</span>
    </div>
  );
}

export function DetailGlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "rounded-[30px] border border-[rgba(191,147,117,0.22)] bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)] sm:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DetailSectionHeading({
  eyebrow,
  title,
  body,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-[#bf9375]">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#111827] sm:text-[32px]">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 max-w-[720px] text-[15px] leading-[1.78] text-slate-600 sm:text-[16px]">{body}</p>
      ) : null}
    </div>
  );
}

export function DetailBadgeRow({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span
          className="rounded-full border border-[rgba(191,147,117,0.28)] bg-[rgba(255,249,241,0.96)] px-4 py-2 text-[12px] font-medium tracking-[0.01em] text-[#18314b]"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function DetailStatGrid({
  items,
  columns = 2,
}: {
  items: Array<{ label: string; value: string }>;
  columns?: 2 | 3 | 4;
}) {
  const columnClassName =
    columns === 4
      ? "lg:grid-cols-4"
      : columns === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2";

  return (
    <div className={joinClasses("grid gap-3 sm:grid-cols-2", columnClassName)}>
      {items.map((item) => (
        <div
          className="rounded-[22px] border border-[rgba(191,147,117,0.2)] bg-[rgba(255,250,244,0.9)] px-4 py-4"
          key={`${item.label}-${item.value}`}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">{item.label}</p>
          <p className="mt-3 text-[18px] font-semibold leading-[1.2] text-[#111827] sm:text-[20px]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function DetailBulletList({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li className="flex items-start gap-3" key={`${item}-${index}`}>
          <span className="mt-[8px] h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--pv-sand)]" />
          <p className="text-[15px] leading-[1.8] text-slate-700 sm:text-[16px]">{item}</p>
        </li>
      ))}
    </ul>
  );
}

export function DetailKeyValueList({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <dl className="space-y-4">
      {items.map((item) => (
        <div className="flex flex-col gap-2 border-b border-[rgba(191,147,117,0.16)] pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5" key={`${item.label}-${item.value}`}>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">{item.label}</dt>
          <dd className="text-left text-[15px] leading-[1.65] text-slate-700 sm:max-w-[62%] sm:text-right sm:text-[16px]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailNarrativeBlock({
  title,
  body,
  eyebrow,
}: {
  title: string;
  body: ReactNode;
  eyebrow?: string;
}) {
  return (
    <DetailGlassPanel>
      <DetailSectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-4 space-y-4 text-[15px] leading-[1.82] text-slate-700 sm:text-[16px]">{body}</div>
    </DetailGlassPanel>
  );
}

export function DetailQuoteBand({
  title,
  body,
  quotes,
}: {
  title: string;
  body: string;
  quotes: Array<{ quote: string; person: string; role: string }>;
}) {
  return (
    <DetailGlassPanel className="overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-slate-200 px-6 py-7 sm:px-7 lg:border-b-0 lg:border-r lg:px-8 lg:py-9">
          <DetailSectionHeading body={body} eyebrow="Client Confidence" title={title} />
        </div>
        <div className="grid gap-0 divide-y divide-slate-200">
          {quotes.map((item) => (
            <div className="px-6 py-6 sm:px-7 lg:px-8" key={`${item.person}-${item.role}`}>
              <p className="text-[15px] leading-[1.8] text-slate-700 sm:text-[16px]">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-4">
                <p className="text-[14px] font-semibold text-[#111827]">{item.person}</p>
                <p className="mt-1 text-[12px] uppercase tracking-[0.24em] text-slate-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DetailGlassPanel>
  );
}
