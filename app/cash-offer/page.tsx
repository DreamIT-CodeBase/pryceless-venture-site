import Image from "next/image";

import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import { PublicForm } from "@/components/forms/public-form";
import { SectionTitle, Surface } from "@/components/public/marketing-ui";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getActiveFormBySlug, getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;

const fallbackHowItWorks = [
  "Submit property details",
  "We review and analyze the asset",
  "Receive a no-obligation cash offer",
];

const fallbackSellerBenefits = [
  "No listings or showings",
  "Flexible timelines",
  "Straightforward process",
];

export default async function CashOfferPage() {
  const [page, form] = await Promise.all([
    getSingletonPage("CASH_OFFER"),
    getActiveFormBySlug("cash-offer"),
  ]);

  const howItWorks = page?.items.filter((item) => item.groupKey === "how_it_works") ?? [];
  const sellerBenefits = page?.items.filter((item) => item.groupKey === "seller_benefits") ?? [];

  return (
    <SiteShell cta={{ href: "/properties", label: "View Properties" }}>
      <div className="space-y-16 pb-16 sm:pb-20">
        <PageSectionHero
          currentLabel="Get a Cash Offer"
          intro={
            page?.intro ??
            "Sell your property without the uncertainty of traditional listings. Our team evaluates properties quickly and presents clear, data-backed offers."
          }
          title={page?.pageTitle ?? "Get a Cash Offer"}
        />

        <section className="pv-container">
          <SectionTitle
            subtitle="A simple submission flow designed for fast reviews and clear next steps."
            title="Sell With Clarity"
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <Surface className="overflow-hidden">
                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                  <div className="p-7">
                    <h2 className="text-[30px] font-bold">How It Works</h2>
                    <ul className="mt-5 space-y-4 text-[17px] leading-8 text-[var(--pv-text)]">
                      {(howItWorks.length
                        ? howItWorks.map((item) => item.title)
                        : fallbackHowItWorks).map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative min-h-[260px]">
                    <Image
                      alt="Styled bedroom"
                      className="object-cover"
                      fill
                      sizes="280px"
                      src={aboutSectionImage}
                    />
                  </div>
                </div>
              </Surface>

              <Surface className="p-7">
                <h2 className="text-[30px] font-bold">Seller Benefits</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {(sellerBenefits.length
                    ? sellerBenefits.map((item) => item.title)
                    : fallbackSellerBenefits).map((item) => (
                    <li
                      className="rounded-[18px] bg-slate-50 px-4 py-4 text-[16px] leading-7 text-[var(--pv-text)]"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Surface>
            </div>

            <div>
              {form ? (
                <PublicForm form={form} sourcePath="/cash-offer" />
              ) : (
                <Surface className="p-7 text-[var(--pv-text)]">
                  Assign the cash offer form in the admin portal to collect submissions here.
                </Surface>
              )}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
