import { PublicForm } from "@/components/forms/public-form";
import {
  DetailGlassPanel,
  DetailSectionHeading,
} from "@/components/public/slug-detail-ui";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getActiveFormBySlug, getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;

type CashOfferPageData = Awaited<ReturnType<typeof getSingletonPage>>;

type ContentCard = {
  title: string;
  body?: string | null;
};

const fallbackCashOfferImageUrl =
  "https://images.pexels.com/photos/7578861/pexels-photo-7578861.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";
const fallbackCashOfferImageAlt = "House with a for-sale sign";

const fallbackHowItWorks: ContentCard[] = [
  {
    title: "Submit property details",
    body: "Share the address, condition, and timing so the team can review the property quickly.",
  },
  {
    title: "We review and analyze the asset",
    body: "Our team looks at the property profile, seller goals, and next-step fit before following up.",
  },
  {
    title: "Receive a no-obligation cash offer",
    body: "If the property is a fit, we come back with a clear next conversation and offer path.",
  },
];

const fallbackSellerBenefits: ContentCard[] = [
  {
    title: "No listings or showings",
    body: "Avoid public-market prep, repeated walkthroughs, and the uncertainty of a traditional listing cycle.",
  },
  {
    title: "Flexible timelines",
    body: "Discuss a timeline that works for your move instead of forcing the transaction into a rigid schedule.",
  },
  {
    title: "Straightforward process",
    body: "Get practical communication, direct review, and a simpler path from submission to next steps.",
  },
];

const getGroupItems = (page: CashOfferPageData, groupKey: string) =>
  page?.items.filter((item) => item.groupKey === groupKey) ?? [];

const resolveContentCards = (
  page: CashOfferPageData,
  groupKey: string,
  fallback: ContentCard[],
) => {
  const fallbackByTitle = new Map(
    fallback.map((item) => [item.title.trim().toLowerCase(), item.body?.trim() || null]),
  );
  const items = getGroupItems(page, groupKey);
  const dedupedCards = new Map<string, ContentCard>();

  items.forEach((item, index) => {
    const title = item.title.trim();

    if (!title) {
      return;
    }

    const key = title.toLowerCase();
    const body =
      item.body?.trim() ||
      fallbackByTitle.get(key) ||
      fallback[index]?.body ||
      null;
    const existing = dedupedCards.get(key);

    if (!existing || (!existing.body && body)) {
      dedupedCards.set(key, { title, body });
    }
  });

  return dedupedCards.size ? Array.from(dedupedCards.values()) : fallback;
};

const resolveFeatureImage = (page: CashOfferPageData) => {
  const imageItem = getGroupItems(page, "feature_image")[0];
  const imageUrl = imageItem?.title?.trim() || fallbackCashOfferImageUrl;
  const imageAlt = imageItem?.body?.trim() || fallbackCashOfferImageAlt;

  return { imageAlt, imageUrl };
};

export default async function CashOfferPage() {
  const [page, form] = await Promise.all([
    getSingletonPage("CASH_OFFER"),
    getActiveFormBySlug("cash-offer"),
  ]);

  const howItWorks = resolveContentCards(page, "how_it_works", fallbackHowItWorks);
  const sellerBenefits = resolveContentCards(page, "seller_benefits", fallbackSellerBenefits);
  const { imageAlt, imageUrl } = resolveFeatureImage(page);
  const pageTitle = page?.pageTitle ?? "Get a Cash Offer";
  const pageIntro =
    page?.intro ??
    "Sell your property without the uncertainty of traditional listings. Our team evaluates properties quickly and presents clear, data-backed offers.";
  const pageAction =
    page?.ctaLabel && page?.ctaHref
      ? { href: page.ctaHref, label: page.ctaLabel }
      : { href: "#cash-offer-form", label: "Submit Details" };

  return (
    <SiteShell cta={pageAction}>
      <div className="space-y-12 pb-16 sm:space-y-16 sm:pb-20">
        <PageSectionHero
          currentLabel="Get a Cash Offer"
          intro={pageIntro}
          title={pageTitle}
        />

        <section className="pv-container">
          <div className="mx-auto max-w-[1120px] text-center">
            <div className="mb-4 flex items-center justify-center gap-4 sm:gap-6">
              <span className="hidden h-px w-full max-w-[220px] self-center bg-slate-300 sm:block lg:max-w-[320px]" />
              <h2 className="shrink-0 text-[22px] font-bold leading-none sm:text-[28px] lg:text-[32px]">
                Sell With Clarity
              </h2>
              <span className="hidden h-px w-full max-w-[220px] self-center bg-slate-300 sm:block lg:max-w-[320px]" />
            </div>
            <div className="flex justify-center">
              <p className="max-w-[640px] text-center text-[15px] leading-7 text-[var(--pv-text)] sm:text-[16px] sm:leading-8">
                A simple submission flow designed for fast reviews and clear next steps.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-6 lg:mt-12">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-stretch">
              <DetailGlassPanel className="p-5 sm:p-7">
                <DetailSectionHeading
                  eyebrow="Process"
                  title="How It Works"
                  body="A simple review sequence built to keep sellers informed from submission through follow-up."
                />

                <div className="mt-5 space-y-3">
                  {howItWorks.map((item, index) => (
                    <div
                      className="rounded-[18px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
                      key={item.title}
                    >
                      <div className="flex items-start gap-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[rgba(191,147,117,0.28)] bg-[rgba(255,249,241,0.96)] text-sm font-semibold text-[#18314b]">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[17px] font-semibold leading-[1.35] text-[#111827] sm:text-[18px]">
                            {item.title}
                          </h3>
                          {item.body ? (
                            <p className="mt-2 text-[14px] leading-[1.7] text-slate-600 sm:text-[15px]">
                              {item.body}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailGlassPanel>

              <div className="overflow-hidden rounded-[30px] border border-[rgba(191,147,117,0.22)] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
                <div className="relative h-full min-h-[300px]">
                  <img
                    alt={imageAlt}
                    className="h-full w-full object-cover"
                    src={imageUrl}
                  />
                </div>
              </div>
            </div>

            <DetailGlassPanel className="p-5 sm:p-7">
              <DetailSectionHeading
                eyebrow="Benefits"
                title="Seller Benefits"
                body="Styled with the same cleaner card language used across the loan detail pages, while keeping every point editable from the CMS."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {sellerBenefits.map((item) => (
                  <div
                    className="rounded-[18px] border border-[rgba(191,147,117,0.2)] bg-[rgba(255,250,244,0.9)] px-4 py-4 shadow-[0_8px_22px_rgba(191,147,117,0.08)]"
                    key={item.title}
                  >
                    <p className="text-[16px] font-semibold leading-[1.4] text-[#111827] sm:text-[17px]">
                      {item.title}
                    </p>
                    {item.body ? (
                      <p className="mt-2 text-[14px] leading-[1.7] text-slate-600">
                        {item.body}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </DetailGlassPanel>

            <div className="max-w-[760px]" id="cash-offer-form">
              {form ? (
                <PublicForm
                  className="rounded-[30px] p-6 sm:p-8"
                  description="Submit your details and our team will respond with the next steps."
                  form={form}
                  layout="wide"
                  sourcePath="/cash-offer"
                  submitLabel="Submit Request"
                  title={form.formName}
                />
              ) : (
                <DetailGlassPanel className="p-5 text-[var(--pv-text)] sm:p-7">
                  Assign the cash offer form in the admin portal to collect submissions here.
                </DetailGlassPanel>
              )}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
