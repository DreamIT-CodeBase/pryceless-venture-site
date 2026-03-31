"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  StandardCollectionCardLink,
} from "@/components/public/collection-card-layout";

type FeaturedPropertyCarouselItem = {
  id: string;
  title: string;
  address: string;
  image: string | StaticImageData;
  href: string;
  progressPercent: number;
  raisedSummary: string;
  leftMetricLabel: string;
  annualReturn: string;
  rightMetricLabel: string;
  propertyType: string;
  timeLabel: string;
  timeLeft: string;
};

const AUTO_PLAY_MS = 3800;
const FEATURED_PROPERTY_DESKTOP_WIDTH = 310;
const FEATURED_PROPERTY_TABLET_WIDTH = 278;
const FEATURED_PROPERTY_DESKTOP_GAP = 38;
const FEATURED_PROPERTY_TABLET_GAP = 26;
const FEATURED_PROPERTY_MOBILE_GAP = 16;
const featuredPropertyButtonClassName =
  "inline-flex h-[40px] min-w-[116px] items-center justify-center rounded-[8px] bg-[#18314b] px-[18px] text-[12px] font-semibold leading-none text-white transition-all duration-300 group-hover:bg-[#234766] hover:bg-[#234766]";

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

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" fill="currentColor" r="5.8" />
      <path
        d="M7 4.15v3.1l2.03 1.17"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
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
}: {
  items: FeaturedPropertyCarouselItem[];
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
      className="mx-auto w-full max-w-full sm:max-w-[582px] lg:max-w-[1006px]"
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onBlurCapture={() => setIsPaused(false)}
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      <div
        className="pv-hide-scrollbar flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-[6px] sm:gap-[26px] lg:gap-[38px]"
        ref={viewportRef}
      >
        {safeItems.map((item) => (
          <StandardCollectionCardLink
            className="!min-h-[454px] h-[454px] min-w-full snap-start rounded-[18px] sm:!min-h-[454px] sm:h-[454px] sm:min-w-[278px] lg:!min-h-[454px] lg:h-[454px] lg:min-w-[310px]"
            href={item.href}
            key={item.id}
          >
            <div className="px-[15px] pt-[15px]">
              <div className="relative h-[198px] overflow-hidden rounded-[16px]">
                <Image
                  alt={`${item.title} featured property`}
                  className="object-cover"
                  fill
                  sizes={`(max-width: 639px) 100vw, (max-width: 1023px) ${FEATURED_PROPERTY_TABLET_WIDTH}px, ${FEATURED_PROPERTY_DESKTOP_WIDTH}px`}
                  src={item.image}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col px-[16px] pb-[15px] pt-[14px]">
              <h3 className="truncate text-left text-[19px] font-bold leading-[1.12] tracking-[-0.02em] text-[rgba(15,23,42,1)]">
                {item.title}
              </h3>

              <p className="mt-[6px] flex items-center gap-[5px] text-left text-[11.5px] font-normal leading-[16px] tracking-[0] text-[rgba(97,97,97,1)]">
                <LocationPinIcon className="h-[12px] w-[10px] shrink-0 text-[rgba(43,47,56,1)]" />
                <span className="truncate">{item.address}</span>
              </p>

              <div className="mt-[12px] h-[8px] overflow-hidden rounded-full bg-[rgba(231,236,242,1)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#29d869_0%,#39cf7b_100%)]"
                  style={{ width: `${item.progressPercent}%` }}
                />
              </div>

              <p className="mt-[8px] text-left text-[11px] font-normal leading-[15px] tracking-[0] text-[rgba(97,97,97,1)]">
                {item.raisedSummary}
              </p>

              <div className="mt-[16px] grid grid-cols-2 border-y border-[rgba(215,215,215,1)]">
                <div className="px-[13px] py-[11px]">
                  <p className="text-left text-[11px] font-normal leading-[15px] tracking-[0] text-[rgba(97,97,97,1)]">
                    {item.leftMetricLabel}
                  </p>
                  <p className="mt-[4px] text-left text-[11.5px] font-semibold leading-[16px] tracking-[0] text-[rgba(53,53,53,1)]">
                    {item.annualReturn}
                  </p>
                </div>
                <div className="border-l border-[rgba(215,215,215,1)] px-[13px] py-[11px]">
                  <p className="text-left text-[11px] font-normal leading-[15px] tracking-[0] text-[rgba(97,97,97,1)]">
                    {item.rightMetricLabel}
                  </p>
                  <p className="mt-[4px] truncate text-left text-[11.5px] font-semibold leading-[16px] tracking-[0] text-[rgba(53,53,53,1)]">
                    {item.propertyType}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between gap-[14px] pt-[20px]">
                <div className="min-w-0">
                  <p className="text-left text-[10px] font-normal leading-[14px] tracking-[0] text-[rgba(97,97,97,1)]">
                    {item.timeLabel}
                  </p>
                  <div className="mt-[4px] flex items-center gap-[4px]">
                    <ClockIcon className="h-[10px] w-[10px] shrink-0 text-[rgba(43,47,56,1)]" />
                    <p className="truncate text-left text-[12px] font-bold leading-[16px] tracking-[0] text-[rgba(15,23,42,1)]">
                      {item.timeLeft}
                    </p>
                  </div>
                </div>

                <span className={featuredPropertyButtonClassName}>Invest Now</span>
              </div>
            </div>
          </StandardCollectionCardLink>
        ))}
      </div>
    </div>
  );
}
