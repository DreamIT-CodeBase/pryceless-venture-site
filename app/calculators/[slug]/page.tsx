import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CalculatorWorkbench } from "@/components/public/calculator-workbench";
import { PageSectionHero } from "@/components/public/page-section-hero";
import {
  DetailBadgeRow,
  DetailGlassPanel,
  DetailNarrativeBlock,
  DetailPageCanvas,
  DetailSection,
  DetailSectionHeading,
  detailPrimaryButtonClassName,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import {
  getCanonicalCalculatorPath,
  normalizeCalculatorType,
} from "@/lib/calculator-content";
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
  const canonicalPath = getCanonicalCalculatorPath({ slug });

  if (canonicalPath !== `/calculators/${slug}`) {
    redirect(canonicalPath);
  }

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

  const canonicalTypePath = getCanonicalCalculatorPath({
    calculatorType: calculator.calculatorType,
    slug,
  });

  if (canonicalTypePath !== `/calculators/${slug}`) {
    redirect(canonicalTypePath);
  }

  const descriptionParagraphs = splitParagraphs(calculator.shortDescription);
  const disclaimerParagraphs = splitParagraphs(calculator.disclaimer);

  return (
    <SiteShell>
      <DetailPageCanvas>
        <PageSectionHero
          currentLabel={calculator.title}
          intro={calculator.shortDescription}
          title={calculator.title}
        />

        <section className="bg-white px-4 pt-[40px] sm:px-6 sm:pt-[44px] lg:px-0 lg:pt-[56px] 2xl:pt-[64px]">
          <div className="mx-auto w-full max-w-[1480px] 2xl:max-w-[1760px] lg:px-[125px] 2xl:px-[164px]">
            <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
              <DetailBadgeRow items={[formatDisplayValue(calculator.calculatorType)]} />
              <Link className={detailPrimaryButtonClassName} href="/calculators">
                Browse Calculators
              </Link>
            </div>

            <div className="mt-7">
              <CalculatorWorkbench
                calculatorType={calculator.calculatorType}
                disclaimer={calculator.disclaimer}
                shortDescription={calculator.shortDescription}
                title={calculator.title}
              />
            </div>
          </div>
        </section>

        <DetailSection className="pb-14 pt-10 lg:pb-18 lg:pt-12">
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
