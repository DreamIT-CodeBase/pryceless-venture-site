"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { StandardCollectionCardLink } from "@/components/public/collection-card-layout";

type BlogCarouselItem = {
  category: string;
  excerpt: string;
  href: string;
  id: string;
  image: string | StaticImageData;
  imageAlt: string;
  title: string;
};

const AUTO_PLAY_MS = 4200;
const DESKTOP_WIDTH = 336;
const WIDE_WIDTH = 392;
const TABLET_WIDTH = 300;
const DESKTOP_GAP = 28;
const WIDE_GAP = 32;
const TABLET_GAP = 24;
const MOBILE_GAP = 16;

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
    return WIDE_GAP;
  }

  if (width >= 1024) {
    return DESKTOP_GAP;
  }

  if (width >= 640) {
    return TABLET_GAP;
  }

  return MOBILE_GAP;
};

export function BlogCardsCarousel({
  items,
}: {
  items: BlogCarouselItem[];
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const safeItems = useMemo(() => items.filter(Boolean), [items]);
  const maxIndex = Math.max(0, safeItems.length - visibleCount);

  useEffect(() => {
    const syncViewport = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
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

    const nextLeft = activeIndex * (firstCard.offsetWidth + getGap(window.innerWidth));
    viewport.scrollTo({ left: nextLeft, behavior: "smooth" });
  }, [activeIndex, visibleCount]);

  if (!safeItems.length) {
    return null;
  }

  return (
    <div
      className="mx-auto w-full max-w-full sm:max-w-[624px] lg:max-w-[1064px] 2xl:max-w-[1240px]"
      onBlurCapture={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="pv-hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-[6px] sm:gap-6 lg:gap-7 2xl:gap-8"
        ref={viewportRef}
      >
        {safeItems.map((item) => (
          <StandardCollectionCardLink
            className="!min-h-[480px] min-w-full snap-start rounded-[24px] border-0 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:min-w-[300px] lg:min-w-[336px] 2xl:min-w-[392px]"
            href={item.href}
            key={item.id}
          >
            <div className="px-5 pt-5">
              <div className="relative h-[238px] overflow-hidden rounded-[24px] sm:h-[224px] lg:h-[244px] 2xl:h-[258px]">
                <Image
                  alt={item.imageAlt}
                  className="object-cover"
                  fill
                  sizes={`(max-width: 639px) 100vw, (max-width: 1023px) ${TABLET_WIDTH}px, (max-width: 1535px) ${DESKTOP_WIDTH}px, ${WIDE_WIDTH}px`}
                  src={item.image}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
              <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.12em] text-[#18314b]">
                {item.category}
              </div>

              <h3
                className="mt-5 text-[20px] font-semibold leading-[1.2] tracking-[-0.035em] text-[#101828] sm:text-[21px] lg:text-[22px]"
                style={{
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {item.title}
              </h3>

              <p
                className="mt-4 text-[15px] leading-[1.8] text-slate-600"
                style={{
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 4,
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {item.excerpt}
              </p>

              <div className="mt-auto flex items-center justify-between pt-8">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 text-[#101828] transition group-hover:border-[#18314b] group-hover:text-[#18314b]">
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M5 15 15 5M7.5 5H15v7.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
                <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#18314b]">
                  Read Article
                </span>
              </div>
            </div>
          </StandardCollectionCardLink>
        ))}
      </div>

      {safeItems.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          {safeItems.map((item, index) => (
            <button
              aria-label={`Show blog slide ${index + 1}: ${item.title}`}
              className={`h-[8px] rounded-full transition-all ${
                index === activeIndex ? "w-[24px] bg-[#18314b]" : "w-[8px] bg-slate-300"
              }`}
              key={`${item.id}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
