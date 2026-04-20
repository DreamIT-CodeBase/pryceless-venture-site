"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";

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

type PropertyStageFilterValue = PropertyPortfolioStage | "ALL";

type StageFilterOption = {
  count: number;
  helper: string;
  label: string;
  queryValue: string;
  value: PropertyStageFilterValue;
};

const stageQueryValueMap: Record<PropertyPortfolioStage, string> = {
  FOR_SALE: "for-sale",
  SOLD: "sold",
  IN_PROGRESS: "in-progress",
};

const queryValueStageMap: Record<string, PropertyPortfolioStage> = Object.fromEntries(
  Object.entries(stageQueryValueMap).map(([stage, value]) => [value, stage]),
) as Record<string, PropertyPortfolioStage>;

const allPropertiesHelper =
  "See every listing, sold deal, and rehab update together, then narrow the view with the dropdown.";

const buildFilterOptions = (sections: PropertyStageSection[]): StageFilterOption[] => {
  const totalCount = sections.reduce((sum, section) => sum + section.cards.length, 0);

  return [
    {
      count: totalCount,
      helper: allPropertiesHelper,
      label: "All Properties",
      queryValue: "all",
      value: "ALL",
    },
    ...sections.map((section) => ({
      count: section.cards.length,
      helper: section.helper,
      label: section.title,
      queryValue: stageQueryValueMap[section.stage],
      value: section.stage,
    })),
  ];
};

const getFilterValueFromSearch = (searchParams: ReturnType<typeof useSearchParams>): PropertyStageFilterValue => {
  const stageParam = searchParams.get("stage");

  if (!stageParam || stageParam === "all") {
    return "ALL";
  }

  return queryValueStageMap[stageParam] ?? "ALL";
};

const getVisibleCards = (
  sections: PropertyStageSection[],
  activeFilter: PropertyStageFilterValue,
) => {
  if (activeFilter === "ALL") {
    return sections.flatMap((section) => section.cards);
  }

  return sections.find((section) => section.stage === activeFilter)?.cards ?? [];
};

const getFilterEmptyMessage = (
  sections: PropertyStageSection[],
  activeFilter: PropertyStageFilterValue,
) => {
  if (activeFilter === "ALL") {
    return "Properties will appear here once portfolio listings are published from the admin portal.";
  }

  return (
    sections.find((section) => section.stage === activeFilter)?.emptyMessage ??
    "No properties are available for the selected stage yet."
  );
};

function usePropertyStageSelection(sections: PropertyStageSection[]) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const options = useMemo(() => buildFilterOptions(sections), [sections]);
  const activeFilter = getFilterValueFromSearch(searchParams);
  const activeOption = options.find((option) => option.value === activeFilter) ?? options[0];

  const handleStageChange = (nextFilter: PropertyStageFilterValue) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextFilter === "ALL") {
      params.delete("stage");
    } else {
      params.set("stage", stageQueryValueMap[nextFilter]);
    }

    const nextUrl = params.size ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  return {
    activeFilter,
    activeOption,
    handleStageChange,
    isPending,
    options,
  };
}

export function PropertyStageHeroSelect({
  sections,
}: {
  sections: PropertyStageSection[];
}) {
  const { activeFilter, activeOption, handleStageChange, isPending, options } =
    usePropertyStageSelection(sections);

  return (
    <div className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)] px-4 py-3.5 text-white shadow-[0_20px_46px_rgba(3,12,25,0.24)] backdrop-blur-xl sm:px-5 sm:py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d7b18f]">
        Property Filter
      </p>

      <div className="mt-3">
        <div className="relative">
          <select
            className="h-[54px] w-full appearance-none rounded-[18px] border border-white/12 bg-[#0f2740]/88 px-4 pr-12 text-[15px] font-medium tracking-[-0.015em] text-white outline-none transition-[border-color,box-shadow,background-color] duration-300 focus:border-[#d7b18f]/80 focus:bg-[#12314f] focus:shadow-[0_0_0_1px_rgba(215,177,143,0.65)] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            id="properties-stage-select"
            onChange={(event) =>
              handleStageChange(event.target.value as PropertyStageFilterValue)
            }
            value={activeFilter}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {`${option.label} (${String(option.count).padStart(2, "0")})`}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/72"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.25 5.75L8 10.5l4.75-4.75"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function PropertyStageFilter({
  sections,
}: {
  sections: PropertyStageSection[];
}) {
  const { activeFilter } = usePropertyStageSelection(sections);

  const visibleCards = useMemo(
    () => getVisibleCards(sections, activeFilter),
    [activeFilter, sections],
  );
  const emptyMessage = useMemo(
    () => getFilterEmptyMessage(sections, activeFilter),
    [activeFilter, sections],
  );

  return (
    <div id="property-stage-filter">
      {visibleCards.length ? (
        <ThreeUpCollectionGrid
          desktopCardWidth={320}
          desktopGap={38}
          wideDesktopCardWidth={456}
          wideDesktopGap={32}
        >
          {visibleCards.map((property) => (
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
        <EmptyCollectionCard message={emptyMessage} />
      )}
    </div>
  );
}
