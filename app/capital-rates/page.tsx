import acquisitionsIcon from "@/app/assets/agreement 1.svg";
import bridgeCapitalIcon from "@/app/assets/gain 1.svg";
import portfolioScalingIcon from "@/app/assets/equity 1.svg";
import renovationsIcon from "@/app/assets/renovation 1.svg";
import { PublicForm } from "@/components/forms/public-form";
import { Surface } from "@/components/public/marketing-ui";
import { PastelActionCardGrid } from "@/components/public/pastel-action-card-grid";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getCapitalUseFallbackDescription } from "@/lib/content-blueprint";
import { getActiveFormBySlug, getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;

const fallbackPageTitle = "Capital & Funding Overview";
const fallbackIntro =
  "We work with active real estate investors to structure capital solutions aligned with deal risk, duration, and execution strategy.";
const fallbackDisclaimer =
  "Funding terms vary based on asset profile, market conditions, and investment structure. All opportunities are evaluated individually.";
const fallbackUses = ["Acquisitions", "Renovations", "Bridge capital", "Portfolio scaling"];

const capitalUseVisuals = [
  {
    backgroundColor: "#d8f0fd",
    borderColor: "#c0dceb",
    icon: acquisitionsIcon,
    iconClassName: "max-h-[54px] max-w-[54px]",
  },
  {
    backgroundColor: "#eed7ef",
    borderColor: "#d7bdd9",
    icon: renovationsIcon,
    iconClassName: "max-h-[62px] max-w-[62px]",
  },
  {
    backgroundColor: "#f7e7bc",
    borderColor: "#e0c89b",
    icon: bridgeCapitalIcon,
    iconClassName: "max-h-[56px] max-w-[56px]",
  },
  {
    backgroundColor: "#c7ebe4",
    borderColor: "#acd6cd",
    icon: portfolioScalingIcon,
    iconClassName: "max-h-[60px] max-w-[60px]",
  },
] as const;

export default async function CapitalRatesPage() {
  const [page, form] = await Promise.all([
    getSingletonPage("CAPITAL_RATES"),
    getActiveFormBySlug("funding-info-request"),
  ]);

  const supportedUses =
    page?.items
      .filter((item) => item.groupKey === "supported_uses")
      .map((item) => ({
        description: item.body?.trim() || getCapitalUseFallbackDescription(item.title),
        title: item.title,
      })) ?? [];
  const displayedUses = supportedUses.length
    ? supportedUses
    : fallbackUses.map((title) => ({
        description: getCapitalUseFallbackDescription(title),
        title,
      }));
  const capitalRateCards = displayedUses.slice(0, 4).map((item, index) => ({
    ...capitalUseVisuals[index % capitalUseVisuals.length],
    ctaLabel: page?.ctaLabel ?? "Request Funding Information",
    description: item.description,
    href: page?.ctaHref ?? "#funding-info",
    title: item.title,
  }));

  return (
    <SiteShell cta={{ href: page?.ctaHref ?? "#funding-info", label: page?.ctaLabel ?? "Request Funding Information" }}>
      <div className="pb-[72px]">
        <PageSectionHero
          currentLabel={page?.pageTitle ?? fallbackPageTitle}
          intro={page?.intro ?? fallbackIntro}
          title={page?.pageTitle ?? fallbackPageTitle}
        />

        <PastelActionCardGrid
          disclaimer={{
            label: "Capital Note:",
            text: page?.disclaimer ?? fallbackDisclaimer,
          }}
          items={capitalRateCards}
        />

        <section className="bg-white px-4 pt-[6px] sm:px-6 lg:px-[126px] lg:pt-[10px] 2xl:px-0 2xl:pt-[18px]">
          <div className="mx-auto w-full 2xl:max-w-[1760px] 2xl:px-[164px]">
            <div className="mx-auto grid w-full max-w-[1080px] gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start 2xl:mx-0 2xl:max-w-[1280px] 2xl:grid-cols-[minmax(0,668px)_minmax(0,580px)] 2xl:gap-[32px]">
              <Surface className="overflow-hidden p-6 sm:p-8 2xl:p-9">
                <p className="text-[13px] font-normal leading-[21px] tracking-[0] text-[var(--pv-sand)] lg:text-[14px] lg:leading-[22px]">
                  Funding Info Request
                </p>
                <h2 className="mt-[8px] text-[32px] font-bold leading-[1.08] tracking-[-0.045em] text-[#0f172a] sm:text-[42px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0] 2xl:max-w-[580px] 2xl:text-[42px] 2xl:leading-[1.08] 2xl:tracking-[-0.04em]">
                  Request Funding Information
                </h2>
                <p className="mt-[16px] max-w-[620px] text-[15px] leading-[1.75] text-[var(--pv-text)] sm:text-[16px] 2xl:max-w-[600px] 2xl:text-[17px]">
                  Share your deal focus, timing, and capital objectives. Our team reviews each request individually and responds with the next steps that best fit the opportunity.
                </p>

                <div className="mt-[24px] grid gap-4 sm:grid-cols-2 2xl:mt-[30px] 2xl:gap-[16px]">
                  {displayedUses.slice(0, 4).map((item) => (
                    <div
                      className="rounded-[18px] bg-slate-50 px-4 py-4 text-[15px] leading-6 text-[var(--pv-text)] sm:text-[16px] sm:leading-7 2xl:min-h-[92px] 2xl:px-5 2xl:py-5"
                      key={item.title}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </Surface>

              <div id="funding-info">
                {form ? (
                  <PublicForm form={form} sourcePath="/capital-rates" title={page?.ctaLabel ?? form.formName} />
                ) : (
                  <Surface className="p-6 text-[var(--pv-text)] sm:p-8">
                    Assign the funding information request form in the admin portal to collect submissions here.
                  </Surface>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
