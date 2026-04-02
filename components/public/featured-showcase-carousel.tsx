"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type FeaturedShowcaseCarouselItem = {
  body: string;
  ctaLabel: string;
  href: string;
  image: string | StaticImageData;
  title: string;
};

const AUTO_PLAY_MS = 4200;
const MOBILE_GAP = 18;

export function FeaturedShowcaseCarousel({
  items,
}: {
  items: FeaturedShowcaseCarouselItem[];
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const safeItems = items.filter(Boolean);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const firstCard = viewport.querySelector<HTMLElement>("[data-featured-showcase-slide='true']");
    if (!firstCard) {
      return;
    }

    const nextLeft = activeIndex * (firstCard.offsetWidth + MOBILE_GAP);
    viewport.scrollTo({ left: nextLeft, behavior: "smooth" });
  }, [activeIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const handleScroll = () => {
      const firstCard = viewport.querySelector<HTMLElement>("[data-featured-showcase-slide='true']");
      if (!firstCard) {
        return;
      }

      const nextIndex = Math.round(viewport.scrollLeft / (firstCard.offsetWidth + MOBILE_GAP));
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });

    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (safeItems.length <= 1 || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current >= safeItems.length - 1 ? 0 : current + 1));
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(interval);
  }, [isPaused, safeItems.length]);

  if (!safeItems.length) {
    return null;
  }

  return (
    <div
      className="mx-auto w-full max-w-[430px]"
      onBlurCapture={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="pv-hide-scrollbar flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-[6px]"
        ref={viewportRef}
      >
        {safeItems.map((item, index) => (
          <article
            className="flex min-w-full snap-start flex-col rounded-[18px] border border-[#dde2e8] bg-white p-[22px] shadow-[0_1px_0_rgba(255,255,255,0.06)]"
            data-featured-showcase-slide="true"
            key={`${item.title}-${index}`}
          >
            <div
              className="relative mx-auto h-auto w-full max-w-[386px] overflow-hidden rounded-[12px]"
              style={{ aspectRatio: "386 / 224" }}
            >
              <Image
                alt={item.title}
                className="object-cover"
                fill
                sizes="(max-width: 639px) calc(100vw - 48px), 386px"
                src={item.image}
              />
            </div>

            <div className="mt-[12px] px-[1px]">
              <h3
                className="text-[19px] font-bold leading-[1.18] tracking-[-0.02em] text-[#1f2940]"
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
                className="mt-[9px] text-[14.5px] font-normal leading-[1.58] tracking-[-0.01em] text-[#6b7280]"
                style={{
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 5,
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {item.body}
              </p>
            </div>

            <div className="mt-auto px-[1px] pt-[16px]">
              <Link
                className="inline-flex h-[40px] min-w-[132px] items-center justify-center rounded-[4px] bg-[#11283e] px-[20px] text-[12.5px] font-semibold leading-[16px] tracking-[0] text-white transition hover:bg-[#102236]"
                href={item.href}
                style={{ color: "#ffffff" }}
              >
                {item.ctaLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {safeItems.length > 1 ? (
        <div className="mt-[18px] flex items-center justify-center gap-[8px]">
          {safeItems.map((item, index) => (
            <button
              aria-label={`Show insight slide ${index + 1}: ${item.title}`}
              className={`h-[8px] rounded-full transition-all ${
                index === activeIndex ? "w-[22px] bg-white" : "w-[8px] bg-white/35"
              }`}
              key={`featured-showcase-dot-${item.title}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
