import Link from "next/link";
import { notFound } from "next/navigation";

import { CalculatorWorkbench } from "@/components/public/calculator-workbench";
import {
  DetailBadgeRow,
  DetailBreadcrumbs,
  DetailGlassPanel,
  DetailNarrativeBlock,
  DetailPageCanvas,
  DetailSection,
  DetailSectionHeading,
  detailPrimaryButtonClassName,
  detailSecondaryButtonClassName,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import { normalizeCalculatorType } from "@/lib/calculator-content";
import { getPublishedCalculator } from "@/lib/data/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const splitParagraphs = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

const formatDisplayValue = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

export default async function CalculatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publishedCalculator = await getPublishedCalculator(slug);
  const calculator = publishedCalculator
    ? {
        ...publishedCalculator,
        calculatorType: normalizeCalculatorType(publishedCalculator.calculatorType),
      }
    : null;

  if (!calculator) {
    notFound();
  }

  const descriptionParagraphs = splitParagraphs(calculator.shortDescription);
  const disclaimerParagraphs = splitParagraphs(calculator.disclaimer);

  return (
    <SiteShell cta={{ href: "/capital-rates", label: "Request Funding Info" }}>
      <DetailPageCanvas>
        <DetailSection className="pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
          <DetailBreadcrumbs currentLabel={calculator.title} href="/calculators" hrefLabel="Calculators" />

          <div className="mt-7 max-w-[760px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[#bf9375] sm:text-[13px]">
              Calculator Detail
            </p>
            <h1 className="mt-4 text-[32px] font-semibold leading-[1.04] tracking-[-0.045em] text-[#111827] sm:text-[46px] lg:text-[56px]">
              {calculator.title}
            </h1>
            <p className="mt-5 max-w-[640px] text-[16px] leading-[1.85] text-slate-700 sm:text-[17px]">
              {calculator.shortDescription}
            </p>

            <div className="mt-7">
              <DetailBadgeRow items={[formatDisplayValue(calculator.calculatorType)]} />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link className={detailPrimaryButtonClassName} href="/calculators">
                Browse Calculators
              </Link>
              <Link className={detailSecondaryButtonClassName} href="/capital-rates">
                Request Funding Information
              </Link>
            </div>
          </div>
        </DetailSection>

        <DetailSection className="pb-14 lg:pb-18">
          <CalculatorWorkbench
            calculatorType={calculator.calculatorType}
            disclaimer={calculator.disclaimer}
            shortDescription={calculator.shortDescription}
            title={calculator.title}
          />
        </DetailSection>

        <DetailSection className="pb-14 lg:pb-18">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
            <DetailNarrativeBlock
              body={descriptionParagraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
              eyebrow="Description"
              title={calculator.title}
            />

            <DetailGlassPanel>
              <DetailSectionHeading
                body={disclaimerParagraphs[0]}
                eyebrow="Disclaimer"
                title="Use this estimate with caution"
              />
              <div className="mt-4 space-y-4 text-[15px] leading-[1.82] text-slate-700 sm:text-[16px]">
                {disclaimerParagraphs.slice(1).map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </DetailGlassPanel>
          </div>
        </DetailSection>
      </DetailPageCanvas>
    </SiteShell>
  );
}
