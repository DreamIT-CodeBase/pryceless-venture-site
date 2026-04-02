import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const publicContainerClass = "pv-container";

export const formatDisplayLabel = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const resolveAssetUrl = (value: string | StaticImageData) =>
  typeof value === "string" ? value : value.src;

export function SectionTitle({
  title,
  subtitle,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <span className={`hidden h-px flex-1 sm:block ${dark ? "bg-white/30" : "bg-slate-300"}`} />
        <h2 className={`text-[28px] font-bold leading-[1.1] sm:text-[54px] ${dark ? "text-white" : "text-[var(--pv-ink)]"}`}>
          {title}
        </h2>
        <span className={`hidden h-px flex-1 sm:block ${dark ? "bg-white/30" : "bg-slate-300"}`} />
      </div>
      {subtitle ? (
        <p className={`text-base sm:text-[17px] ${dark ? "text-white/80" : "text-[var(--pv-text)]"}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  backgroundImage,
  align = "left",
  actions,
  variant = "cover",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  backgroundImage: string | StaticImageData;
  align?: "left" | "center";
  actions?: Array<{ href: string; label: string; variant?: "primary" | "secondary" }>;
  variant?: "cover" | "strip";
}) {
  const imageUrl = resolveAssetUrl(backgroundImage);

  if (variant === "strip") {
    return (
      <section className={publicContainerClass}>
        <div className="relative overflow-hidden rounded-b-[34px] bg-[#18314b] px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%), url(${imageUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className={`relative z-10 ${align === "center" ? "mx-auto max-w-[980px] text-center" : "max-w-[860px]"}`}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-white/66">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-[34px] font-bold leading-[1.06] tracking-[-0.05em] text-white sm:text-[46px] lg:text-[58px]">
              {title}
            </h1>
            <p className="mt-4 max-w-4xl text-[16px] leading-[1.75] text-white/82 sm:text-[18px] lg:text-[19px]">
              {intro}
            </p>
            {actions?.length ? (
              <div className={`mt-7 flex flex-wrap gap-4 ${align === "center" ? "justify-center" : ""}`}>
                {actions.map((action) => (
                  <Link
                    className={`rounded-full px-6 py-3 text-sm font-semibold transition sm:text-base ${
                      action.variant === "secondary"
                        ? "border border-white/18 bg-white/8 text-white hover:bg-white/14"
                        : "bg-white text-[var(--pv-ink)] hover:bg-slate-100"
                    }`}
                    href={action.href}
                    key={action.href}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={publicContainerClass}>
      <div
        className={`relative overflow-hidden rounded-[34px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20 ${
          align === "center" ? "text-center" : "text-left"
        }`}
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15,27,48,0.82) 0%, rgba(15,27,48,0.58) 45%, rgba(15,27,48,0.18) 100%), url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`relative z-10 ${align === "center" ? "mx-auto max-w-3xl" : "max-w-[620px]"}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--pv-sand)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[34px] font-bold leading-[1.14] text-white sm:text-[48px] lg:text-[58px]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">{intro}</p>
          {actions?.length ? (
            <div className={`mt-8 flex flex-wrap gap-4 ${align === "center" ? "justify-center" : ""}`}>
              {actions.map((action) => (
                <Link
                  className={`rounded-xl px-6 py-3.5 text-sm font-semibold transition sm:text-base ${
                    action.variant === "secondary"
                      ? "bg-[var(--pv-sand)] text-white hover:brightness-95"
                      : "bg-white text-[var(--pv-ink)] hover:bg-slate-100"
                  }`}
                  href={action.href}
                  key={action.href}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ActionTile({
  title,
  body,
  href,
  ctaLabel,
  icon,
  iconShellClassName,
}: {
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  icon: string | StaticImageData;
  iconShellClassName?: string;
}) {
  const imageUrl = resolveAssetUrl(icon);

  return (
    <article className="flex h-full flex-col rounded-[28px] bg-white px-6 pb-6 pt-10 text-center shadow-[0_8px_20px_rgba(7,15,33,0.1)]">
      <div
        className={`mx-auto grid h-20 w-20 place-items-center rounded-[18px] ${
          iconShellClassName ?? "bg-slate-50"
        }`}
      >
        <img alt={title} className="h-10 w-10 object-contain" src={imageUrl} />
      </div>
      <h3 className="mt-6 text-[28px] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--pv-ink)]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-[270px] text-[17px] leading-[1.55] text-[var(--pv-text)]">
        {body}
      </p>
      <div className="mt-auto pt-6">
        <Link
          className="inline-flex h-[58px] w-full items-center justify-center rounded-[10px] bg-[var(--pv-navy)] px-5 text-[17px] font-semibold text-white transition hover:bg-[var(--pv-navy-soft)]"
          href={href}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

export function MetricBand({
  title,
  items,
  dark = false,
  variant = title ? "card" : "strip",
}: {
  title?: string;
  items: Array<{ value: string; label: string; color: string }>;
  dark?: boolean;
  variant?: "card" | "strip";
}) {
  if (variant === "strip") {
    return (
      <div className="bg-[#f6f5f2]">
        <div className="mx-auto w-full max-w-[1492px] px-4 sm:px-6 lg:px-0">
          <div className="grid grid-cols-2 gap-y-8 py-[26px] sm:py-[30px] lg:grid-cols-4 lg:gap-0 lg:py-[42px]">
            {items.map((item, index) => (
              <div
                className="relative flex min-h-[90px] flex-col items-center justify-center px-4 text-center lg:min-h-[106px] lg:px-0"
                key={`${item.label}-${index}`}
              >
                {index < items.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 hidden h-[96px] w-px -translate-y-1/2 bg-[#dddeda] lg:block"
                  />
                ) : null}
                <p
                  className="text-[32px] font-semibold leading-[0.95] tracking-[-0.042em] sm:text-[44px] lg:text-[57px] lg:leading-[0.95]"
                  style={{ color: item.color }}
                >
                  {item.value}
                </p>
                <p className="mt-[9px] max-w-[150px] text-[13px] font-normal leading-[1.3] tracking-[-0.015em] text-[#2d3036] sm:text-[14px] lg:max-w-[180px] lg:text-[16px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={publicContainerClass}>
      <div className={`rounded-[28px] px-6 py-8 sm:px-10 ${dark ? "bg-[var(--pv-navy)]" : "bg-white"}`}>
        {title ? (
          <h2 className={`text-center text-[28px] font-bold sm:text-[46px] ${dark ? "text-white" : "text-[var(--pv-ink)]"}`}>
            {title}
          </h2>
        ) : null}
        <div className={`grid gap-6 ${title ? "mt-6" : ""} md:grid-cols-2 xl:grid-cols-4`}>
          {items.map((item, index) => (
            <div
              className={`flex flex-col items-center justify-center text-center ${
                index < items.length - 1 ? "xl:border-r xl:border-white/20" : ""
              }`}
              key={`${item.label}-${index}`}
            >
              <p className="text-[34px] font-bold sm:text-[54px]" style={{ color: item.color }}>
                {item.value}
              </p>
              <p className={`mt-1 text-base ${dark ? "text-white/84" : "text-[var(--pv-text)]"}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmptyCollectionCard({ message }: { message: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-[var(--pv-text)] sm:px-8 sm:py-16">
      {message}
    </div>
  );
}

export function ListingCard({
  title,
  location,
  description,
  imageUrl,
  href,
  ctaLabel,
  badge,
  meta,
}: {
  title: string;
  location?: string;
  description: string;
  imageUrl: string;
  href: string;
  ctaLabel: string;
  badge?: string;
  meta?: Array<{ label: string; value: string }>;
}) {
  return (
    <article className="pv-card-shadow overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <img alt={title} className="h-64 w-full object-cover" src={imageUrl} />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[30px] font-bold leading-tight text-[var(--pv-ink)]">{title}</h2>
            {location ? <p className="mt-2 text-base text-[var(--pv-text)]">{location}</p> : null}
          </div>
          {badge ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pv-navy)]">
              {badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-7 text-[var(--pv-text)]">{description}</p>

        {meta?.length ? (
          <div className="grid overflow-hidden rounded-[18px] border border-slate-200 sm:grid-cols-2">
            {meta.map((item, index) => (
              <div
                className={`px-4 py-3 ${index === 0 && meta.length > 1 ? "border-b border-slate-200 sm:border-b-0 sm:border-r" : ""}`}
                key={`${item.label}-${index}`}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--pv-ink)]">{item.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <Link
          className="inline-flex rounded-xl bg-[var(--pv-navy)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--pv-navy-soft)]"
          href={href}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

export function DarkFeatureCard({
  image,
  title,
  body,
  href,
  horizontal = false,
}: {
  image: string | StaticImageData;
  title: string;
  body: string;
  href: string;
  horizontal?: boolean;
}) {
  const imageUrl = resolveAssetUrl(image);

  return (
    <article
      className={`overflow-hidden rounded-[30px] bg-white p-5 shadow-[0_20px_50px_rgba(7,15,33,0.22)] ${
        horizontal ? "grid gap-5 md:grid-cols-[240px_1fr]" : "space-y-5"
      }`}
    >
      <img
        alt={title}
        className={`w-full rounded-[22px] object-cover ${horizontal ? "h-full min-h-[190px]" : "h-[255px]"}`}
        src={imageUrl}
      />
      <div className="space-y-4">
        <h3 className="text-[26px] font-bold leading-tight text-[var(--pv-ink)]">{title}</h3>
        <p className="text-base leading-7 text-[var(--pv-text)]">{body}</p>
        <Link
          className="inline-flex rounded-xl bg-[var(--pv-navy)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--pv-navy-soft)]"
          href={href}
        >
          Explore more
        </Link>
      </div>
    </article>
  );
}

export function TestimonialCard({
  avatar,
  name,
  city,
  quote,
}: {
  avatar?: string | StaticImageData | null;
  name: string;
  city: string;
  quote: string;
}) {
  const normalizedQuote = quote.replace(/^[\s"']+/, "").replace(/[\s"']+$/, "");
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <article className="relative flex min-h-[264px] w-full max-w-[380px] flex-col rounded-[22px] border border-[#d9e5f0] bg-white/92 px-[20px] pb-[20px] pt-[18px] shadow-[0_18px_38px_rgba(15,23,42,0.08)] backdrop-blur lg:h-[236px] lg:w-[292px] lg:max-w-none lg:rounded-[15px] lg:border-[#cfcfcf] lg:bg-white lg:px-[18px] lg:pb-[17px] lg:pt-[14px] lg:shadow-none 2xl:h-[258px] 2xl:w-[360px] 2xl:px-[24px] 2xl:pb-[20px] 2xl:pt-[18px]">
      <span
        aria-hidden="true"
        className="absolute right-[18px] top-[14px] text-[42px] font-bold leading-none tracking-[-0.16em] text-[#2496f0] lg:right-[17px] lg:top-[11px] lg:text-[36px]"
      >
        &rdquo;&rdquo;
      </span>

      <div className="flex items-start gap-[12px] pr-[44px] lg:gap-[10px] lg:pr-[40px]">
        <div className="relative h-[72px] w-[72px] shrink-0 rounded-full border border-[#2496f0] p-[2px] lg:h-[69px] lg:w-[69px]">
          {avatar ? (
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white bg-white">
              <Image
                alt={name}
                className="object-cover"
                fill
                sizes="72px"
                src={avatar}
              />
            </div>
          ) : (
            <div className="grid h-full w-full place-items-center rounded-full border border-white bg-[linear-gradient(180deg,#eef7ff_0%,#dcebfb_100%)] text-[21px] font-semibold tracking-[0.02em] text-[#2496f0] lg:text-[20px]">
              {initials || "PV"}
            </div>
          )}
        </div>

        <div className="pt-[14px] lg:pt-[13px]">
          <h3 className="text-[16px] font-bold leading-[20px] tracking-[0] text-[#252525] lg:text-[15px]">
            - {name}
          </h3>
          <p className="mt-[2px] text-[13px] font-medium italic leading-[16px] tracking-[0] text-[#2496f0] lg:mt-[1px] lg:text-[12px]">
            {city}
          </p>
        </div>
      </div>

      <p className="mt-[30px] max-w-none text-[14px] font-normal leading-[1.7] tracking-[0] text-[#5b6472] lg:mt-[30px] lg:max-w-[246px] lg:text-[12px] lg:leading-[1.58] lg:text-[#676767]">
        &ldquo;{normalizedQuote}&rdquo;
      </p>
    </article>
  );
}

export function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`pv-card-shadow rounded-[30px] border border-slate-200 bg-white ${className}`}>
      {children}
    </div>
  );
}
