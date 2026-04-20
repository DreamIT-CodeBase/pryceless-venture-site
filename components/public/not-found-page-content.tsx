import Link from "next/link";

import { SectionTitle, Surface } from "@/components/public/marketing-ui";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";

type SingletonPageItem = {
  groupKey: string;
  title: string;
  body?: string | null;
};

type SingletonPageData = {
  pageTitle?: string | null;
  intro?: string | null;
  disclaimer?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  items: SingletonPageItem[];
} | null;

type ContentCard = {
  title: string;
  body?: string | null;
};

const fallbackSupportPoints: ContentCard[] = [
  {
    title: "The page may have moved",
    body: "Links can change as opportunities, resources, and launch pages are updated across the site.",
  },
  {
    title: "You can jump back in quickly",
    body: "Use the links below to head straight to the most active sections of the Pryceless Ventures website.",
  },
  {
    title: "Need a hand from the team?",
    body: "If you were trying to reach a specific page, contact us and we will help you find the right route.",
  },
];

const fallbackQuickLinks: ContentCard[] = [
  { title: "Loan Offers", body: "/get-financing" },
  { title: "Properties", body: "/properties" },
  { title: "Case Studies", body: "/case-studies" },
  { title: "Insights", body: "/blogs" },
];

const getGroupItems = (page: SingletonPageData, groupKey: string) =>
  page?.items.filter((item) => item.groupKey === groupKey) ?? [];

const resolveContentCards = (
  page: SingletonPageData,
  groupKey: string,
  fallback: ContentCard[],
) => {
  const items = getGroupItems(page, groupKey)
    .map((item) => ({
      title: item.title.trim(),
      body: item.body?.trim() || null,
    }))
    .filter((item) => item.title);

  return items.length ? items : fallback;
};

const normalizeHref = (value: string | null | undefined) => {
  const href = String(value ?? "").trim();

  if (!href) {
    return "/";
  }

  if (href.startsWith("/") || href.startsWith("#") || href.startsWith("http")) {
    return href;
  }

  return `/${href.replace(/^\/+/, "")}`;
};

export function NotFoundPageContent({ page }: { page: SingletonPageData }) {
  const supportPoints = resolveContentCards(page, "support_points", fallbackSupportPoints);
  const quickLinks = resolveContentCards(page, "quick_links", fallbackQuickLinks);
  const primaryAction =
    page?.ctaLabel && page?.ctaHref
      ? { href: normalizeHref(page.ctaHref), label: page.ctaLabel }
      : { href: "/", label: "Return Home" };
  const secondaryAction =
    quickLinks.find((item) => normalizeHref(item.body) !== primaryAction.href) ?? fallbackQuickLinks[0];
  const pageTitle = page?.pageTitle ?? "Page Not Found";
  const pageIntro =
    page?.intro ??
    "The page you were trying to reach is unavailable, but the rest of Pryceless Ventures is still within easy reach.";

  return (
    <SiteShell cta={primaryAction}>
      <div className="space-y-12 pb-16 sm:space-y-16 sm:pb-20">
        <PageSectionHero
          currentLabel="404"
          heroContent={
            <div className="overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.08] p-4 shadow-[0_30px_80px_rgba(2,10,20,0.32)] backdrop-blur-xl">
              <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.03)_100%)] px-6 py-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-white/58">
                  Error
                </p>
                <p className="mt-3 text-[64px] font-bold leading-none tracking-[-0.06em] text-white">
                  404
                </p>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  Use the actions below or jump to one of the core sections of the site.
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  className="inline-flex min-h-[52px] items-center justify-center rounded-[16px] bg-white px-5 py-3 text-sm font-semibold text-[var(--pv-ink)] transition hover:bg-slate-100"
                  href={primaryAction.href}
                >
                  {primaryAction.label}
                </Link>
                <Link
                  className="inline-flex min-h-[52px] items-center justify-center rounded-[16px] border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                  href={normalizeHref(secondaryAction.body)}
                >
                  {secondaryAction.title}
                </Link>
              </div>
            </div>
          }
          heroContentPosition="side"
          heroContentWrapClassName="min-[1025px]:w-[350px] 2xl:w-[390px]"
          intro={pageIntro}
          title={pageTitle}
        />

        {page?.disclaimer ? (
          <section className="pv-container">
            <div className="rounded-[24px] border border-[rgba(207,162,123,0.22)] bg-[linear-gradient(135deg,rgba(255,250,245,1)_0%,rgba(249,244,239,1)_100%)] px-5 py-4 text-sm leading-7 text-[var(--pv-text)] sm:px-6">
              <span className="font-semibold text-[var(--pv-ink)]">Helpful note:</span> {page.disclaimer}
            </div>
          </section>
        ) : null}

        <section className="pv-container">
          <SectionTitle
            subtitle="Use the cards below to jump back into the most active parts of the website."
            title="Let's Get You Back On Track"
          />

          <div className="mt-10 grid gap-8 lg:mt-12">
            <div className="grid gap-4 md:grid-cols-3">
              {supportPoints.map((item) => (
                <Surface className="p-6" key={item.title}>
                  <div className="h-2 w-16 rounded-full bg-[linear-gradient(90deg,var(--pv-sky)_0%,var(--pv-sand)_100%)]" />
                  <h2 className="mt-4 text-[23px] font-semibold leading-[1.12] text-[var(--pv-ink)]">
                    {item.title}
                  </h2>
                  {item.body ? (
                    <p className="mt-3 text-[15px] leading-7 text-[var(--pv-text)]">{item.body}</p>
                  ) : null}
                </Surface>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickLinks.map((item) => (
                <Link href={normalizeHref(item.body)} key={`${item.title}-${item.body ?? "/"}`}>
                  <Surface className="group h-full p-6 transition-[border-color,box-shadow] duration-300 hover:border-[#b9d8f2]">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pv-sand)]">
                      Quick Link
                    </p>
                    <div className="mt-5 flex items-end justify-between gap-4">
                      <h2 className="text-[24px] font-semibold leading-[1.08] text-[var(--pv-ink)]">
                        {item.title}
                      </h2>
                      <span className="text-[28px] leading-none text-[var(--pv-sky)] transition-transform duration-300 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </div>
                    <p className="mt-4 text-[15px] leading-7 text-[var(--pv-text)]">
                      Go directly to this section and keep exploring.
                    </p>
                  </Surface>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
