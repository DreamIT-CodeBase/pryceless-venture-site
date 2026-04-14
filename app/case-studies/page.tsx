import type { StaticImageData } from "next/image";

import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import featuredPropertiesLeftImage from "@/app/assets/featuredpropertieslegftboximage.png";
import featuredPropertiesRightLowerImage from "@/app/assets/featuredpropoertiesrightboxlowerimage.jpg";
import featuredPropertiesRightUpperImage from "@/app/assets/featuredpropertiesstaicrightupperboximages.jpg";
import heroSectionImage from "@/app/assets/herosectionimage.jpg";
import {
  ThreeUpCollectionGrid,
} from "@/components/public/collection-card-layout";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { OpportunityCard } from "@/components/public/opportunity-card";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedCaseStudies, getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;

const caseStudyImages = [
  featuredPropertiesLeftImage,
  aboutSectionImage,
  heroSectionImage,
  featuredPropertiesRightLowerImage,
  featuredPropertiesRightUpperImage,
  featuredPropertiesLeftImage,
];

type CaseStudyCardImage = StaticImageData | string;

const categoryLabels: Record<string, string> = {
  FIX_FLIP: "Fix & Flip",
  OTHER: "Other",
  TURNAROUND: "Turnaround Strategy",
  VALUE_ADD_MULTIFAMILY: "Value-Add Multifamily",
};

const truncate = (value: string, limit: number) =>
  value.length > limit ? `${value.slice(0, limit).trim()}...` : value;

const formatCategoryLabel = (value: string | null | undefined) =>
  categoryLabels[String(value ?? "").trim().toUpperCase()] ??
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

export default async function CaseStudiesPage() {
  const [page, caseStudies] = await Promise.all([
    getSingletonPage("CASE_STUDIES_INDEX"),
    getPublishedCaseStudies(),
  ]);

  const configuredCategoryOrder =
    page?.items.filter((item) => item.groupKey === "categories").map((item) => item.title) ?? [];
  const storiesByCategory = new Map<
    string,
    Array<{
      assetProfile: Array<{ label: string; value: string }>;
      category: string;
      href: string;
      image: CaseStudyCardImage;
      imageAlt: string;
      overview: string;
      takeaways: string[];
      title: string;
    }>
  >();

  caseStudies.forEach((caseStudy, index) => {
    const categoryLabel = formatCategoryLabel(caseStudy.category);
    const currentStories = storiesByCategory.get(categoryLabel) ?? [];
    const assetProfile = Array.isArray(caseStudy.assetProfile) ? caseStudy.assetProfile : [];
    const takeaways = Array.isArray(caseStudy.takeaways) ? caseStudy.takeaways : [];

    currentStories.push({
      assetProfile,
      category: categoryLabel,
      href: `/case-studies/${caseStudy.slug}`,
      image:
        caseStudy.primaryImage?.mediaFile.blobUrl ??
        caseStudy.images?.[0]?.mediaFile.blobUrl ??
        caseStudyImages[index % caseStudyImages.length],
      imageAlt:
        caseStudy.primaryImage?.altText ??
        caseStudy.primaryImage?.mediaFile.altText ??
        caseStudy.images?.[0]?.altText ??
        caseStudy.images?.[0]?.mediaFile.altText ??
        caseStudy.title,
      overview: truncate(caseStudy.overview, 230),
      takeaways: takeaways.map((item) => truncate(item.takeaway, 48)),
      title: caseStudy.title,
    });

    storiesByCategory.set(categoryLabel, currentStories);
  });

  const orderedCategories = [
    ...configuredCategoryOrder.filter((label) => storiesByCategory.has(label)),
    ...Array.from(storiesByCategory.keys()).filter((label) => !configuredCategoryOrder.includes(label)),
  ];

  return (
    <SiteShell cta={{ href: "/get-financing", label: "Apply Now" }}>
      <div className="pb-[92px]">
        <PageSectionHero
          currentLabel={page?.pageTitle ?? "Case Studies"}
          intro={
            page?.intro ??
            "Examples of investment strategies, execution frameworks, and lessons learned across real estate asset types."
          }
          title={page?.pageTitle ?? "Case Studies"}
        />

        <section className="bg-white px-4 pt-[56px] sm:px-6 lg:px-0 lg:pt-[76px] 2xl:pt-[84px]">
          <div className="mx-auto w-full 2xl:max-w-[1760px] 2xl:px-[164px]">
            <div className="mx-auto flex max-w-[760px] flex-col items-center text-center 2xl:mx-0 2xl:max-w-[760px] 2xl:items-start 2xl:text-left">
              <p className="text-[13px] font-normal leading-[21px] tracking-[0] text-[var(--pv-sand)] lg:text-[14px] lg:leading-[22px]">
                Case Studies
              </p>
              <h2 className="mt-[8px] text-[32px] font-bold leading-[1.08] tracking-[-0.05em] text-[#0f172a] sm:text-[44px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0] 2xl:max-w-[720px] 2xl:text-[42px] 2xl:leading-[1.08] 2xl:tracking-[-0.04em]">
                {page?.pageTitle ?? "Case Studies"}
              </h2>
            </div>

            <div className="mx-auto mt-[44px] w-full max-w-[1088px] space-y-[38px] 2xl:mt-[50px] 2xl:max-w-[1432px] 2xl:space-y-[44px]">
              {orderedCategories.length ? (
                orderedCategories.map((categoryLabel) => {
                  const stories = storiesByCategory.get(categoryLabel) ?? [];

                  return (
                    <section key={categoryLabel}>
                      <div className="mb-[18px] flex items-center gap-[12px] 2xl:justify-start">
                        <span className="h-px flex-1 bg-[#d8d8d4] 2xl:max-w-[300px] 2xl:flex-none" />
                        <h3 className="shrink-0 text-[18px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#182544] sm:text-[21px] 2xl:text-[24px]">
                          {categoryLabel}
                        </h3>
                        <span className="h-px flex-1 bg-[#d8d8d4]" />
                      </div>

                      <ThreeUpCollectionGrid
                        desktopCardWidth={330}
                        desktopGap={38}
                        wideDesktopCardWidth={456}
                        wideDesktopGap={32}
                      >
                        {stories.map((story, index) => (
                          <OpportunityCard
                            bulletItems={story.takeaways}
                            ctaLabel={page?.ctaLabel ?? "Explore More"}
                            footer={{ label: "Category", value: story.category }}
                            href={story.href}
                            image={story.image}
                            imageAlt={story.imageAlt}
                            key={`${categoryLabel}-${story.title}-${index}`}
                            metaIcon="briefcase"
                            metaText="Case Study"
                            statItems={story.assetProfile.slice(0, 2)}
                            summary={story.overview}
                            title={story.title}
                          />
                        ))}
                      </ThreeUpCollectionGrid>
                    </section>
                  );
                })
              ) : (
                <EmptyCollectionCard message="Published case studies will appear here after the admin team publishes them." />
              )}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
