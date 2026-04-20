import Image from "next/image";

import viewOpportunityHeaderIcon from "@/app/assets/viewoppertunitysvg.svg";
import { ThreeUpCollectionGrid } from "@/components/public/collection-card-layout";
import { InvestmentVideoPreview } from "@/components/public/investment-video-preview";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { OpportunityCard } from "@/components/public/opportunity-card";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedLoanPrograms, getSingletonPage } from "@/lib/data/public";
import {
  defaultLoanProgramImages,
  getDefaultLoanProgramImage,
} from "@/lib/loan-program-images";

export const revalidate = 300;

const legacyGetFinancingTitle = "Get Financing for Your Real Estate Deals";
const defaultLoanOffersTitle = "Loan Offers for Your Real Estate Deals";
const featuredLoanVideoSrc = "/videos/Video_Generation_with_Brand_Mention.mp4";

const formatAmountRange = (minAmount: string | null | undefined, maxAmount: string | null | undefined) => {
  if (minAmount && maxAmount) {
    return `${minAmount} - ${maxAmount}`;
  }

  return minAmount || maxAmount || null;
};

const formatDisplayValue = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const splitHighlights = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

const splitTrailingWord = (value: string, trailingWord: string) => {
  const trimmedValue = value.trim();
  const trailingPattern = new RegExp(`^(.*)\\s+(${trailingWord})$`, "i");
  const match = trimmedValue.match(trailingPattern);

  if (!match) {
    return null;
  }

  return {
    leading: match[1],
    trailing: match[2],
  };
};

const getPageGroupItems = (
  page: Awaited<ReturnType<typeof getSingletonPage>>,
  groupKey: string,
) => page?.items.filter((item) => item.groupKey === groupKey) ?? [];

const getPageGroupItem = (
  page: Awaited<ReturnType<typeof getSingletonPage>>,
  groupKey: string,
  index = 0,
) => getPageGroupItems(page, groupKey)[index] ?? null;
const lenderRedirectFormUrl =
  "https://media.prycelessventures.com/widget/form/ZiMxWHPiHAmTZtx8dNCC";

export default async function GetFinancingPage() {
  const [page, loanPrograms] = await Promise.all([
    getSingletonPage("GET_FINANCING_INDEX"),
    getPublishedLoanPrograms(),
  ]);

  const pageTitle =
    page?.pageTitle === legacyGetFinancingTitle
      ? defaultLoanOffersTitle
      : page?.pageTitle ?? defaultLoanOffersTitle;
  const featuredLoanProgram = loanPrograms[0] ?? null;
  const featuredImage =
    featuredLoanProgram?.imageUrl ||
    getDefaultLoanProgramImage(featuredLoanProgram?.slug) ||
    defaultLoanProgramImages[0];
  const cardCtaLabel = page?.ctaLabel ?? "View Details";
  const overviewSectionTitle =
    getPageGroupItem(page, "overview_section_title")?.title ?? "Loan Program Overview";
  const snapshotCard = getPageGroupItem(page, "snapshot_card");
  const snapshotCountLabels = getPageGroupItems(page, "snapshot_count_labels")
    .map((item) => item.title)
    .filter(Boolean);
  const programsSectionContent = getPageGroupItem(page, "programs_section_content");
  const programsSectionTitle = programsSectionContent?.title ?? pageTitle;
  const programsSectionTitleSplit = splitTrailingWord(programsSectionTitle, "Strategy");
  const lenderSectionEyebrow =
    getPageGroupItem(page, "lender_section_eyebrow")?.title ?? "For Lenders";
  const lenderSectionContent = getPageGroupItem(page, "lender_section_content");
  const cardStatLabels = getPageGroupItems(page, "card_stat_labels")
    .map((item) => item.title)
    .filter(Boolean);
  const opportunitySnapshotValue = String(loanPrograms.length || 0);
  const opportunitySnapshotLabel =
    loanPrograms.length === 1
      ? snapshotCountLabels[0] ?? "Published loan offer"
      : snapshotCountLabels[1] ?? snapshotCountLabels[0] ?? "Published loan offers";

  return (
    <SiteShell cta={{ href: "/get-financing", label: "Apply Now" }}>
      <div className="pb-[78px]">
        <PageSectionHero
          currentLabel={pageTitle}
          intro={page?.intro ?? ""}
          titleClassName="pv-get-financing-hero-title min-[1025px]:text-[28px] min-[1025px]:leading-[38px] 2xl:max-w-[980px] 2xl:text-[44px] 2xl:leading-[1.05]"
          title={pageTitle}
        />

        <section className="bg-white px-4 pb-[34px] pt-[48px] sm:px-6 lg:px-[126px] lg:pb-[42px] lg:pt-[56px] 2xl:px-0 2xl:pb-[54px] 2xl:pt-[72px]">
          <div className="mx-auto w-full 2xl:max-w-[1760px] 2xl:px-[164px]">
            <div className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center lg:max-w-[1080px] 2xl:max-w-[1320px]">
              <p className="text-center text-[15px] font-normal leading-[22px] tracking-[0] text-[var(--pv-sand)] lg:text-[16px] lg:leading-[24px]">
                {getPageGroupItem(page, "overview_eyebrow")?.title ?? "Opportunity Overview"}
              </p>
              <h2 className="pv-get-financing-overview-title mt-[8px] w-full max-w-[720px] text-center text-[32px] font-bold leading-[1.08] tracking-[-0.045em] text-[#0f172a] sm:text-[40px] lg:max-w-none lg:whitespace-nowrap lg:text-[29px] lg:leading-[38px] lg:tracking-[0] 2xl:max-w-none 2xl:text-[38px] 2xl:leading-[1.08] 2xl:tracking-[-0.04em]">
                {overviewSectionTitle}
              </h2>
            </div>

            <div className="mx-auto mt-[22px] grid w-full max-w-[1080px] gap-[14px] lg:mt-[24px] lg:grid-cols-[minmax(0,1fr)_303px] lg:items-stretch lg:gap-[22px] 2xl:mt-[30px] 2xl:max-w-[1432px] 2xl:grid-cols-[minmax(0,1fr)_400px] 2xl:gap-[32px]">
              <InvestmentVideoPreview
                posterSrc={featuredImage}
                title={featuredLoanProgram?.title ?? pageTitle}
                videoSrc={featuredLoanVideoSrc}
              />

              <article className="flex h-full flex-col rounded-[10px] bg-[#f5f5f5] px-6 pb-6 pt-6 lg:h-[330px] lg:w-[303px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px] 2xl:h-[360px] 2xl:w-[400px] 2xl:px-[34px] 2xl:pb-[34px] 2xl:pt-[34px]">
                <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#1f1f1f]">
                  <Image
                    alt=""
                    className="h-[17px] w-[17px] object-contain brightness-0 invert"
                    src={viewOpportunityHeaderIcon}
                  />
                </div>
                <h3 className="mt-[18px] text-[20px] font-normal leading-[1.3] tracking-[0] text-[#0f172a] lg:text-[20.5px] lg:leading-[42px] 2xl:mt-[22px] 2xl:text-[31px] 2xl:leading-[1.16]">
                  {snapshotCard?.title ?? "Opportunity Snapshot"}
                </h3>
                <p className="mt-2 max-w-[262px] text-[12px] font-normal leading-[19px] tracking-[0] text-[rgba(0,0,0,0.8)] lg:mt-[-1px] lg:text-[11.5px] 2xl:mt-[10px] 2xl:max-w-[300px] 2xl:text-[13.5px] 2xl:leading-[1.7]">
                  {snapshotCard?.body ?? ""}
                </p>

                <div className="mt-auto flex items-end gap-4 pt-[24px]">
                  <p className="text-[48px] font-semibold leading-none tracking-[-0.04em] text-[#2d2d2d] sm:text-[57px] 2xl:text-[72px]">
                    {opportunitySnapshotValue}
                  </p>
                  <p className="max-w-[132px] pb-[4px] text-[12px] font-normal leading-[19px] tracking-[0] text-[rgba(0,0,0,0.8)] sm:max-w-[112px] sm:pb-[6px] sm:text-[11.5px] 2xl:max-w-[144px] 2xl:pb-[8px] 2xl:text-[13px] 2xl:leading-[1.55]">
                    {opportunitySnapshotLabel}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 sm:px-6 lg:px-0">
          <div className="mx-auto w-full 2xl:max-w-[1760px] 2xl:px-[164px]">
            <div className="mx-auto w-full max-w-[1080px] 2xl:mx-0 2xl:max-w-[760px]">
              <div className="text-left">
                <p className="whitespace-nowrap text-[15px] font-medium uppercase leading-[20px] tracking-[0.03em] text-[#bf9375] lg:text-[15.5px] lg:leading-[22px]">
                  {getPageGroupItem(page, "programs_section_eyebrow")?.title ?? "Loan Programs"}
                </p>
                <h2
                  className="pv-get-financing-programs-title mt-[8px] max-w-[489px] text-[32px] font-bold leading-[1.08] tracking-[-0.05em] text-[#0f172a] sm:text-[44px] lg:max-w-none lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0] 2xl:max-w-none 2xl:text-[42px] 2xl:leading-[1.08] 2xl:tracking-[-0.04em]"
                  id="loan-programs"
                >
                  {programsSectionTitleSplit ? (
                    <>
                      <span className="block lg:whitespace-nowrap">{programsSectionTitleSplit.leading}</span>
                      <span className="block">{programsSectionTitleSplit.trailing}</span>
                    </>
                  ) : (
                    programsSectionTitle
                  )}
                </h2>
              </div>
              {programsSectionContent?.body ? (
                <p className="pv-get-financing-programs-copy mt-4 max-w-[760px] text-[16px] leading-[1.85] text-slate-600">
                  {programsSectionContent.body}
                </p>
              ) : null}
            </div>

            <div className="mt-[20px]">
              {loanPrograms.length ? (
                <ThreeUpCollectionGrid
                  desktopCardWidth={330}
                  desktopGap={38}
                  wideDesktopCardWidth={456}
                  wideDesktopGap={32}
                >
                  {loanPrograms.map((program) => {
                    const amountRange = formatAmountRange(program.minAmount, program.maxAmount);

                    return (
                      <OpportunityCard
                        bulletItems={splitHighlights(program.keyHighlights)}
                        ctaLabel={cardCtaLabel}
                        compactDetails
                        footer={amountRange ? { label: cardStatLabels[2] ?? "Loan Size", value: amountRange } : null}
                        href={`/get-financing/${program.slug}`}
                        image={program.imageUrl || getDefaultLoanProgramImage(program.slug) || defaultLoanProgramImages[0]}
                        imageAlt={program.imageAlt || program.title}
                        key={program.id}
                        metaIcon="document"
                        metaText={formatDisplayValue(program.crmTag) || "Loan Program"}
                        statItems={[
                          { label: cardStatLabels[0] ?? "Rate", value: program.interestRate || "" },
                          { label: cardStatLabels[1] ?? "Max LTV / LTC", value: program.ltv || "" },
                        ]}
                        summary={program.shortDescription}
                        title={program.title}
                      />
                    );
                  })}
                </ThreeUpCollectionGrid>
              ) : (
                <EmptyCollectionCard
                  message={
                    getPageGroupItem(page, "empty_state_message")?.title ??
                    "Published loan programs will appear here after the admin team adds and activates them."
                  }
                />
              )}
            </div>
          </div>
        </section>

        
      </div>
    </SiteShell>
  );
}
