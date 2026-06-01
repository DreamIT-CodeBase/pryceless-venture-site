"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { StandardCollectionCardLink } from "@/components/public/collection-card-layout";

type FeaturedPropertyCarouselItem = {
  id: string;
  title: string;
  address: string;
  image: string | StaticImageData;
  imageAlt?: string;
  href: string;
  summary: string;
  statItems: Array<{ label: string; value: string }>;
  dealType: string;
  ctaLabel?: string;
};

const AUTO_PLAY_MS = 3800;
const FEATURED_PROPERTY_DESKTOP_WIDTH = 330;
const FEATURED_PROPERTY_XL_WIDTH = 420;
const FEATURED_PROPERTY_2XL_WIDTH = 420;
const FEATURED_PROPERTY_TABLET_WIDTH = 278;
const FEATURED_PROPERTY_DESKTOP_GAP = 38;
const FEATURED_PROPERTY_XL_GAP = 46;
const FEATURED_PROPERTY_2XL_GAP = 50;
const FEATURED_PROPERTY_TABLET_GAP = 26;
const FEATURED_PROPERTY_MOBILE_GAP = 16;
const featuredPropertyButtonClassName =
  "inline-flex min-h-[55px] w-full max-w-[190px] items-center justify-center rounded-[8px] bg-[#14314f] px-5 py-3 text-center text-[14px] font-semibold leading-[1.2] text-white pv-interactive-button transition-[background-color,box-shadow,transform] duration-300 group-hover:-translate-y-[1px] group-hover:bg-[#234766] group-hover:shadow-[0_14px_28px_rgba(20,49,79,0.18)] hover:bg-[#234766]";

function LocationPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 14 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 16.5c2.4-3.2 3.6-5.6 3.6-7.2A3.6 3.6 0 1 0 3.4 9.3c0 1.6 1.2 4 3.6 7.2Z"
        fill="currentColor"
      />
      <circle cx="7" cy="7.1" fill="#fff" r="1.55" />
    </svg>
  );
}

const getVisibleCount = (width: number) => {
  if (width >= 1024) {
    return 3;
  }

  if (width >= 640) {
    return 2;
  }

  return 1;
};

const getGap = (width: number) => {
  if (width >= 1536) {
    return FEATURED_PROPERTY_2XL_GAP;
  }

  if (width >= 1280) {
    return FEATURED_PROPERTY_XL_GAP;
  }

  if (width >= 1024) {
    return FEATURED_PROPERTY_DESKTOP_GAP;
  }

  if (width >= 640) {
    return FEATURED_PROPERTY_TABLET_GAP;
  }

  return FEATURED_PROPERTY_MOBILE_GAP;
};

export function FeaturedPropertiesCarousel({
  items,
  ctaLabel = "Request Details",
}: {
  items: FeaturedPropertyCarouselItem[];
  ctaLabel?: string;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const safeItems = useMemo(() => items.filter(Boolean), [items]);
  const maxIndex = Math.max(0, safeItems.length - visibleCount);

  useEffect(() => {
    const syncViewport = () => {
      const width = window.innerWidth;
      setVisibleCount(getVisibleCount(width));
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (maxIndex <= 0 || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(interval);
  }, [isPaused, maxIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const firstCard = viewport.firstElementChild as HTMLElement | null;
    if (!firstCard) {
      return;
    }

    const gap = getGap(window.innerWidth);
    const nextLeft = activeIndex * (firstCard.offsetWidth + gap);
    viewport.scrollTo({ left: nextLeft, behavior: "smooth" });
  }, [activeIndex, visibleCount]);

  if (!safeItems.length) {
    return null;
  }

  return (
    <div
      className="mx-auto w-full max-w-full sm:max-w-[582px] lg:max-w-[1066px] min-[1280px]:max-w-[1352px] 2xl:max-w-[1360px]"
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onBlurCapture={() => setIsPaused(false)}
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      <div
        className="pv-hide-scrollbar flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-[22px] pt-[2px] sm:gap-[26px] lg:gap-[38px] min-[1280px]:gap-[46px] 2xl:gap-[50px]"
        ref={viewportRef}
      >
        {safeItems.map((item) => (
          <StandardCollectionCardLink
            className="!min-h-[506px] h-auto min-w-full snap-start rounded-[22px] border-[#d7d7d7] shadow-[0_18px_42px_rgba(19,29,54,0.08)] sm:!min-h-[522px] sm:h-auto sm:min-w-[278px] lg:!min-h-[528px] lg:h-auto lg:min-w-[330px] min-[1280px]:!min-h-[610px] min-[1280px]:min-w-[420px] 2xl:!min-h-[610px] 2xl:h-auto 2xl:min-w-[420px]"
            href={item.href}
            key={item.id}
          >
            <div className="px-[12px] pt-[12px] min-[1280px]:px-[20px] min-[1280px]:pt-[20px]">
              <div className="relative h-[188px] overflow-hidden rounded-[15px] sm:h-[196px] lg:h-[198px] min-[1280px]:h-[224px]">
                <Image
                  alt={item.imageAlt ?? `${item.title} featured property`}
                  className="object-cover"
                  fill
                  sizes={`(max-width: 639px) 100vw, (max-width: 1023px) ${FEATURED_PROPERTY_TABLET_WIDTH}px, (max-width: 1279px) ${FEATURED_PROPERTY_DESKTOP_WIDTH}px, (max-width: 1535px) ${FEATURED_PROPERTY_XL_WIDTH}px, ${FEATURED_PROPERTY_2XL_WIDTH}px`}
                  src={item.image}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col px-[20px] pb-[18px] pt-[16px] min-[1280px]:px-[20px] min-[1280px]:pb-[17px] min-[1280px]:pt-[15px]">
              <h3
                className="min-h-[48px] text-left text-[20px] font-normal leading-[1.16] tracking-[0] text-[#131d36] sm:min-h-[52px] sm:text-[21px] min-[1280px]:min-h-[58px] min-[1280px]:text-[25px]"
                style={{
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {item.title}
              </h3>

              <p className="mt-[10px] flex min-h-[18px] items-start gap-[7px] text-left text-[13px] font-normal leading-[1.45] tracking-[0] text-[#6b7280] min-[1280px]:min-h-[20px] min-[1280px]:text-[15px]">
                <LocationPinIcon className="mt-[1px] h-[13px] w-[11px] shrink-0 text-[#30343b] min-[1280px]:h-[14px] min-[1280px]:w-[12px]" />
                <span className="break-words">{item.address}</span>
              </p>

              <p className="mt-[8px] min-h-[44px] text-left text-[12px] font-normal leading-[1.62] tracking-[0] text-[#6b7280] min-[1280px]:min-h-[48px] min-[1280px]:text-[14px]">
                <span
                  style={{
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    display: "-webkit-box",
                    overflow: "hidden",
                  }}
                >
                  {item.summary}
                </span>
              </p>

              <div className="mt-[12px] grid border-y border-[#d7d7d7] text-left sm:grid-cols-2 sm:min-h-[74px] min-[1280px]:mt-[16px] min-[1280px]:min-h-[86px]">
                {item.statItems.slice(0, 2).map((stat, index) => (
                  <div
                    className={`flex min-h-[64px] flex-col justify-start px-[16px] py-[9px] sm:min-h-[74px] min-[1280px]:min-h-[86px] min-[1280px]:px-[16px] min-[1280px]:py-[11px] ${
                      index === 0 && item.statItems.length > 1
                        ? "border-b border-[#d7d7d7] sm:border-b-0 sm:border-r"
                        : ""
                    }`}
                    key={`${item.id}-${stat.label}`}
                  >
                    <p className="text-[12px] font-normal leading-[16px] tracking-[0] text-[#6b7280] min-[1280px]:text-[14px]">
                      {stat.label}
                    </p>
                    <p
                      className="mt-[2px] text-[14px] font-semibold leading-[18px] tracking-[0] text-[#30343b] min-[1280px]:text-[16px]"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        display: "-webkit-box",
                        overflow: "hidden",
                      }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-[12px]">
                <p className="min-h-[16px] text-left text-[12px] font-normal leading-[16px] tracking-[0] text-[#6b7280] min-[1280px]:min-h-[18px] min-[1280px]:text-[14px]">
                  <span className="font-medium text-[#30343b]">Deal Type:</span> {item.dealType}
                </p>

                <div className="pt-[16px]">
                  <span className={featuredPropertyButtonClassName}>
                    {item.ctaLabel ?? ctaLabel}
                  </span>
                </div>
              </div>
            </div>
          </StandardCollectionCardLink>
        ))}
      </div>
    </div>
  );
}
