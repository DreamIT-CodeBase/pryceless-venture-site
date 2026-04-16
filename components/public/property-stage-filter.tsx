"use client";

import { useMemo, useState } from "react";

import { ThreeUpCollectionGrid } from "@/components/public/collection-card-layout";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { OpportunityCard } from "@/components/public/opportunity-card";
import type { PropertyPortfolioStage } from "@/lib/property-portfolio";

type PropertyStageCard = {
  address: string;
  bulletItems: string[];
  ctaLabel: string;
  href: string;
  id: string;
  imageAlt: string;
  imageUrl: string;
  propertyType: string;
  statItems: Array<{ label: string; value: string }>;
  strategy: string;
  summary: string;
  title: string;
};

type PropertyStageSection = {
  cards: PropertyStageCard[];
  count: number;
  emptyMessage: string;
  helper: string;
  stage: PropertyPortfolioStage;
  title: string;
};

const stageHelperText: Record<PropertyPortfolioStage, string> = {
  FOR_SALE: "Available now",
  SOLD: "Closed deals",
  IN_PROGRESS: "Rehab updates",
};

export function PropertyStageFilter({
  sections,
}: {
  sections: PropertyStageSection[];
}) {
  const initialStage = useMemo(
    () => sections.find((section) => section.count > 0)?.stage ?? sections[0]?.stage ?? "FOR_SALE",
    [sections],
  );
  const [activeStage, setActiveStage] = useState<PropertyPortfolioStage>(initialStage);

  const activeSection =
    sections.find((section) => section.stage === activeStage) ?? sections[0];

  if (!activeSection) {
    return null;
  }

  return (
    <div id="property-stage-filter">
      <div className="mx-auto grid max-w-[1050px] gap-5 sm:grid-cols-3 sm:gap-6">
        {sections.map((section) => {
          const isActive = section.stage === activeStage;

          return (
            <button
              className={`group flex min-h-[88px] flex-col justify-between rounded-[24px] border bg-white px-5 py-3 text-left transition duration-300 sm:min-h-[96px] sm:px-6 sm:py-4 ${
                isActive
                  ? "border-[rgba(191,147,117,0.92)] text-[#18314b] shadow-[0_0_0_1px_rgba(191,147,117,0.85),0_14px_34px_rgba(191,147,117,0.12)]"
                  : "border-[rgba(191,147,117,0.28)] text-[#18314b] shadow-[0_12px_32px_rgba(15,23,42,0.06)] pv-interactive-card [--pv-hover-card-shadow:0_16px_36px_rgba(15,23,42,0.08)] transition-[transform,box-shadow,border-color] duration-300 hover:border-[rgba(191,147,117,0.62)]"
              }`}
              key={section.stage}
              onClick={() => setActiveStage(section.stage)}
              type="button"
            >
              <div>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.24em] sm:text-[12px] ${
                    isActive ? "text-[#b68255]" : "text-[#bf9375]"
                  }`}
                >
                  {stageHelperText[section.stage]}
                </p>
                <h3 className="mt-2 text-[22px] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[26px]">
                  {section.title}
                </h3>
              </div>

              <div className="mt-3 flex items-end justify-between gap-4">
                <p
                  className={`text-[12.5px] leading-[1.4] ${
                    isActive ? "text-slate-600" : "text-slate-500"
                  }`}
                >
                  {section.helper}
                </p>
                <span
                  className={`text-[24px] font-semibold leading-none tracking-[-0.04em] sm:text-[28px] ${
                    isActive ? "text-[#b68255]" : "text-[#18314b]"
                  }`}
                >
                  {String(section.count).padStart(2, "0")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-[28px] w-full">
        {activeSection.cards.length ? (
          <ThreeUpCollectionGrid
            desktopCardWidth={320}
            desktopGap={38}
            wideDesktopCardWidth={456}
            wideDesktopGap={32}
          >
            {activeSection.cards.map((property) => (
              <OpportunityCard
                bulletItems={property.bulletItems}
                ctaLabel={property.ctaLabel}
                footer={{ label: "Strategy", value: property.strategy }}
                href={property.href}
                image={property.imageUrl}
                imageAlt={property.imageAlt}
                key={property.id}
                metaIcon="location"
                metaText={property.address}
                statItems={property.statItems}
                summary={property.summary}
                title={property.title}
              />
            ))}
          </ThreeUpCollectionGrid>
        ) : (
          <EmptyCollectionCard message={activeSection.emptyMessage} />
        )}
      </div>
    </div>
  );
}
