"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import { ThreeUpCollectionGrid } from "@/components/public/collection-card-layout";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { OpportunityCard } from "@/components/public/opportunity-card";
import {
  propertyTemplateQueryMap,
  propertyTemplateQueryValueMap,
  type PropertyDealType,
} from "@/lib/property-templates";

type PropertyTemplateCard = {
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

type PropertyTemplateSection = {
  cards: PropertyTemplateCard[];
  count: number;
  emptyMessage: string;
  helper: string;
  template: PropertyDealType;
  title: string;
};

export type PropertyTemplateFilterValue = PropertyDealType | "ALL";

type TemplateFilterOption = {
  count: number;
  helper: string;
  label: string;
  queryValue: string;
  value: PropertyTemplateFilterValue;
};

const allPropertiesHelper =
  "Browse the full portfolio across every deal template, then narrow it down with the dropdown.";

const buildFilterOptions = (
  sections: PropertyTemplateSection[],
): TemplateFilterOption[] => {
  const totalCount = sections.reduce((sum, section) => sum + section.cards.length, 0);

  return [
    {
      count: totalCount,
      helper: allPropertiesHelper,
      label: "Full Portfolio",
      queryValue: "all",
      value: "ALL",
    },
    ...sections.map((section) => ({
      count: section.cards.length,
      helper: section.helper,
      label: section.title,
      queryValue: propertyTemplateQueryValueMap[section.template],
      value: section.template,
    })),
  ];
};

export const getFilterValueFromTemplateParam = (
  templateParam: string | string[] | null | undefined,
): PropertyTemplateFilterValue => {
  const resolvedTemplateParam = Array.isArray(templateParam)
    ? templateParam[0]
    : templateParam;

  if (!resolvedTemplateParam || resolvedTemplateParam === "all") {
    return "ALL";
  }

  return propertyTemplateQueryMap[resolvedTemplateParam] ?? "ALL";
};

const getVisibleCards = (
  sections: PropertyTemplateSection[],
  activeFilter: PropertyTemplateFilterValue,
) => {
  if (activeFilter === "ALL") {
    return sections.flatMap((section) => section.cards);
  }

  return sections.find((section) => section.template === activeFilter)?.cards ?? [];
};

const getFilterEmptyMessage = (
  sections: PropertyTemplateSection[],
  activeFilter: PropertyTemplateFilterValue,
) => {
  if (activeFilter === "ALL") {
    return "Portfolio entries will appear here once listings are published from the admin portal.";
  }

  return (
    sections.find((section) => section.template === activeFilter)?.emptyMessage ??
    "No portfolio entries are available for the selected deal type yet."
  );
};

type PropertyTemplateFilterContextValue = {
  activeFilter: PropertyTemplateFilterValue;
  activeOption: TemplateFilterOption;
  emptyMessage: string;
  handleTemplateChange: (nextFilter: PropertyTemplateFilterValue) => void;
  isPending: boolean;
  options: TemplateFilterOption[];
  visibleCards: PropertyTemplateCard[];
};

const PropertyTemplateFilterContext =
  createContext<PropertyTemplateFilterContextValue | null>(null);

const readFilterValueFromWindow = () =>
  getFilterValueFromTemplateParam(
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("template"),
  );

function usePropertyTemplateSelection(
  sections: PropertyTemplateSection[],
) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useState<PropertyTemplateFilterValue>("ALL");

  const options = useMemo(() => buildFilterOptions(sections), [sections]);
  const activeOption = options.find((option) => option.value === activeFilter) ?? options[0];
  const visibleCards = useMemo(
    () => getVisibleCards(sections, activeFilter),
    [activeFilter, sections],
  );
  const emptyMessage = useMemo(
    () => getFilterEmptyMessage(sections, activeFilter),
    [activeFilter, sections],
  );

  useEffect(() => {
    const syncFromLocation = () => {
      setActiveFilter(readFilterValueFromWindow());
    };

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);

    return () => {
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, []);

  const handleTemplateChange = (nextFilter: PropertyTemplateFilterValue) => {
    setActiveFilter(nextFilter);

    const nextUrl =
      nextFilter === "ALL"
        ? pathname
        : `${pathname}?template=${propertyTemplateQueryValueMap[nextFilter]}`;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  return {
    activeFilter,
    activeOption,
    emptyMessage,
    handleTemplateChange,
    isPending,
    options,
    visibleCards,
  };
}

function usePropertyTemplateFilterContext() {
  const context = useContext(PropertyTemplateFilterContext);

  if (!context) {
    throw new Error("PropertyTemplateFilter components must be wrapped in PropertyTemplateFilterProvider.");
  }

  return context;
}

export function PropertyTemplateFilterProvider({
  children,
  sections,
}: {
  children: ReactNode;
  sections: PropertyTemplateSection[];
}) {
  const value = usePropertyTemplateSelection(sections);

  return (
    <PropertyTemplateFilterContext.Provider value={value}>
      {children}
    </PropertyTemplateFilterContext.Provider>
  );
}

export function PropertyTemplateHeroSelect() {
  const { activeFilter, activeOption, handleTemplateChange, isPending, options } =
    usePropertyTemplateFilterContext();

  return (
    <div className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)] px-4 py-3.5 text-white shadow-[0_20px_46px_rgba(3,12,25,0.24)] backdrop-blur-xl sm:px-5 sm:py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d7b18f]">
        Deal Type Filter
      </p>

      <div className="mt-3">
        <div className="relative">
          <select
            className="h-[54px] w-full appearance-none rounded-[18px] border border-white/12 bg-[#0f2740]/88 px-4 pr-12 text-[15px] font-medium tracking-[-0.015em] text-white outline-none transition-[border-color,box-shadow,background-color] duration-300 focus:border-[#d7b18f]/80 focus:bg-[#12314f] focus:shadow-[0_0_0_1px_rgba(215,177,143,0.65)] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            id="properties-template-select"
            onChange={(event) =>
              handleTemplateChange(event.target.value as PropertyTemplateFilterValue)
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

      <p className="mt-3 text-[12px] leading-[1.6] text-white/72">{activeOption.helper}</p>
    </div>
  );
}

export function PropertyTemplateFilter() {
  const { emptyMessage, visibleCards } = usePropertyTemplateFilterContext();

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
              footer={{ label: "Deal Type", value: property.strategy }}
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

export const PropertyStageHeroSelect = PropertyTemplateHeroSelect;
export const PropertyStageFilter = PropertyTemplateFilter;