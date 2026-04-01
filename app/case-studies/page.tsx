import Image from "next/image";

import aboutSectionImage from "@/app/assets/aboutsectionimage.jpg";
import featuredPropertiesLeftImage from "@/app/assets/featuredpropertieslegftboximage.png";
import featuredPropertiesRightLowerImage from "@/app/assets/featuredpropoertiesrightboxlowerimage.jpg";
import featuredPropertiesRightUpperImage from "@/app/assets/featuredpropertiesstaicrightupperboximages.jpg";
import heroSectionImage from "@/app/assets/herosectionimage.jpg";
import {
  StandardCollectionCardLink,
  ThreeUpCollectionGrid,
  standardCollectionButtonClassName,
} from "@/components/public/collection-card-layout";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import { getPublishedCaseStudies } from "@/lib/data/public";

export const revalidate = 300;

const caseStudyImages = [
  featuredPropertiesLeftImage,
  aboutSectionImage,
  heroSectionImage,
  featuredPropertiesRightLowerImage,
  featuredPropertiesRightUpperImage,
  featuredPropertiesLeftImage,
];

const truncate = (value: string, limit: number) =>
  value.length > limit ? `${value.slice(0, limit).trim()}...` : value;

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();
  const storyCards = caseStudies.slice(0, 9).map((caseStudy, index) => ({
    title: caseStudy.title,
    overview: truncate(caseStudy.overview, 230),
    href: `/case-studies/${caseStudy.slug}`,
    image: caseStudyImages[index % caseStudyImages.length],
  }));

  return (
    <SiteShell cta={{ href: "/investments", label: "View Opportunities" }}>
      <div className="pb-[92px]">
        <PageSectionHero
          currentLabel="Case Studies"
          intro="How strategic renovations and operational improvements transformed long-term returns"
          title={
            <>
              <span className="block">Unlocking Value in</span>
              <span className="block">Underperforming Assets</span>
            </>
          }
        />

        <section className="bg-white px-4 pt-[56px] sm:px-6 lg:px-0 lg:pt-[76px]">
          <div className="mx-auto flex max-w-[660px] flex-col items-center text-center">
            <p className="text-[13px] font-normal leading-[21px] tracking-[0] text-[var(--pv-sand)] lg:text-[14px] lg:leading-[22px]">
              Case Studies
            </p>
            <h2 className="mt-[8px] text-[32px] font-bold leading-[1.08] tracking-[-0.05em] text-[#0f172a] sm:text-[44px] lg:text-[31.5px] lg:leading-[42px] lg:tracking-[0]">
              From Acquisition to Acceleration
            </h2>
          </div>

          <div className="mx-auto mt-[44px] w-full">
            {storyCards.length ? (
              <ThreeUpCollectionGrid desktopCardWidth={330} desktopGap={38}>
                {storyCards.map((story, index) => (
                  <StandardCollectionCardLink href={story.href} key={`${story.title}-${index}`}>
                    <div className="px-[13px] pt-[13px]">
                      <div className="relative h-[196px] overflow-hidden rounded-[14px]">
                        <Image
                          alt={story.title}
                          className="object-cover"
                          fill
                          sizes="(max-width: 1023px) 100vw, 330px"
                          src={story.image}
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-[13px] pb-[16px] pt-[14px]">
                      <h3 className="min-h-[93px] text-left text-[19px] font-bold leading-[1.12] tracking-[-0.03em] text-[#131d36]">
                        {story.title}
                      </h3>
                      <p
                        className="mt-[9px] text-left text-[13px] font-normal leading-[1.36] tracking-[0] text-[rgba(97,97,97,1)]"
                        style={{
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 5,
                          display: "-webkit-box",
                          overflow: "hidden",
                        }}
                      >
                        {story.overview}
                      </p>
                      <span className={standardCollectionButtonClassName}>Explore more</span>
                    </div>
                  </StandardCollectionCardLink>
                ))}
              </ThreeUpCollectionGrid>
            ) : (
              <EmptyCollectionCard message="Published case studies will appear here after the admin team publishes them." />
            )}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
