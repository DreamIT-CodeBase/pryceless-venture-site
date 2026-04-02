"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { TestimonialCard } from "@/components/public/marketing-ui";

type TestimonialCarouselItem = {
  avatar?: string | StaticImageData | null;
  city: string;
  name: string;
  quote: string;
};

const AUTO_PLAY_MS = 4200;

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
    return 44;
  }

  if (width >= 1024) {
    return 34;
  }

  if (width >= 640) {
    return 26;
  }

  return 16;
};

export function TestimonialsCarousel({
  items,
}: {
  items: TestimonialCarouselItem[];
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const safeItems = items.filter((item) => item?.name && item?.city && item?.quote);
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

    const firstCard = viewport.querySelector<HTMLElement>("[data-testimonial-card='true']");
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
      className="mx-auto w-full max-w-[380px] overflow-hidden sm:max-w-[610px] lg:max-w-[944px] 2xl:max-w-[1168px]"
      onBlurCapture={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="pv-hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-[6px] sm:gap-[26px] lg:gap-[34px] 2xl:gap-[44px]"
        ref={viewportRef}
      >
        {safeItems.map((item, index) => (
          <div
            className="flex min-w-full snap-start justify-center sm:min-w-[292px] 2xl:min-w-[360px]"
            data-testimonial-card="true"
            key={`${item.name}-${index}`}
          >
            <TestimonialCard
              avatar={item.avatar}
              city={item.city}
              name={item.name}
              quote={item.quote}
            />
          </div>
        ))}
      </div>

      {safeItems.length > 1 ? (
        <div className="mt-[18px] flex items-center justify-center gap-[8px]">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              aria-label={`Show testimonial slide ${index + 1}`}
              className={`h-[8px] rounded-full transition-all ${index === activeIndex ? "w-[22px] bg-[#2496f0]" : "w-[8px] bg-[#c9d3e0]"}`}
              key={`testimonial-dot-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
