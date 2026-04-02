"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

const AUTO_PLAY_MS = 5200;
const SWIPE_THRESHOLD = 42;

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export type DetailMediaCarouselItem = {
  id: string;
  src: string | StaticImageData;
  alt: string;
  eyebrow?: string;
  title?: string;
  caption?: string;
};

export function DetailMediaCarousel({
  items,
  className,
  imageSizes = "(max-width: 1023px) 100vw, 540px",
  autoPlayMs = AUTO_PLAY_MS,
  compact = false,
  priorityFirst = false,
}: {
  items: DetailMediaCarouselItem[];
  className?: string;
  imageSizes?: string;
  autoPlayMs?: number;
  compact?: boolean;
  priorityFirst?: boolean;
}) {
  const safeItems = items.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(safeItems.length - 1, 0)));
  }, [safeItems.length]);

  useEffect(() => {
    if (safeItems.length <= 1 || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeItems.length);
    }, autoPlayMs);

    return () => window.clearInterval(interval);
  }, [autoPlayMs, isPaused, safeItems.length]);

  if (!safeItems.length) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? safeItems.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % safeItems.length);
  };

  const activeItem = safeItems[activeIndex];

  return (
    <div
      className={joinClasses("group", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchEnd={(event) => {
        if (touchStartXRef.current === null) {
          return;
        }

        const deltaX = event.changedTouches[0]?.clientX - touchStartXRef.current;
        touchStartXRef.current = null;

        if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
          setIsPaused(false);
          return;
        }

        if (deltaX > 0) {
          goToPrevious();
          setIsPaused(false);
          return;
        }

        goToNext();
        setIsPaused(false);
      }}
      onTouchStart={(event) => {
        touchStartXRef.current = event.touches[0]?.clientX ?? null;
        setIsPaused(true);
      }}
    >
      <div
        className={joinClasses(
          "relative overflow-hidden rounded-[32px] border border-[rgba(191,147,117,0.22)] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]",
          compact
            ? "min-h-[320px] sm:min-h-[360px] lg:min-h-[400px]"
            : "min-h-[400px] sm:min-h-[460px] lg:min-h-[560px]",
        )}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {safeItems.map((item, index) => (
            <div className="relative min-w-full" key={item.id}>
              <div className={joinClasses("relative h-full w-full", compact ? "aspect-[16/11]" : "aspect-[16/12] lg:aspect-[17/15]")}>
                <Image
                  alt={item.alt}
                  className="object-cover"
                  fill
                  priority={priorityFirst && index === 0}
                  sizes={imageSizes}
                  src={item.src}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_42%,rgba(255,255,255,0.62)_100%)]" />
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
          <div className="max-w-[420px] rounded-[24px] border border-[rgba(191,147,117,0.22)] bg-white/92 px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:px-5">
            {activeItem.eyebrow ? (
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--pv-sand)]">
                {activeItem.eyebrow}
              </p>
            ) : null}
            {activeItem.title ? (
              <h3 className="mt-2 text-[22px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#111827] sm:text-[24px]">
                {activeItem.title}
              </h3>
            ) : null}
            {activeItem.caption ? (
              <p className="mt-2 text-[13px] leading-[1.65] text-slate-600 sm:text-[14px]">
                {activeItem.caption}
              </p>
            ) : null}
          </div>
        </div>

        {safeItems.length > 1 ? (
          <>
            <div className="absolute left-4 top-4 z-10 rounded-full border border-[rgba(191,147,117,0.22)] bg-white/92 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-[#18314b] shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              {String(activeIndex + 1).padStart(2, "0")} / {String(safeItems.length).padStart(2, "0")}
            </div>

            <button
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-[#111827] shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm transition hover:bg-white sm:left-4 sm:h-11 sm:w-11"
              onClick={goToPrevious}
              type="button"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
                <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
            </button>

            <button
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-[#111827] shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm transition hover:bg-white sm:right-4 sm:h-11 sm:w-11"
              onClick={goToNext}
              type="button"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
                <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
            </button>

            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 sm:bottom-4 sm:right-4">
              {safeItems.map((item, index) => (
                <button
                  aria-label={`Show image ${index + 1}`}
                  className={joinClasses(
                    "h-2.5 rounded-full transition-all",
                    index === activeIndex ? "w-8 bg-[var(--pv-sand)]" : "w-2.5 bg-slate-300 hover:bg-slate-400",
                  )}
                  key={item.id}
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                  type="button"
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
