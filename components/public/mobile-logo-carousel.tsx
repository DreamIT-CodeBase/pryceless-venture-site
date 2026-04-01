"use client";

import Image, { type StaticImageData } from "next/image";

type MobileLogoCarouselItem = {
  alt: string;
  logo: string | StaticImageData;
  logoClassName?: string;
  panelClassName?: string;
};

export function MobileLogoCarousel({
  items,
}: {
  items: MobileLogoCarouselItem[];
}) {
  const loopingItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-[linear-gradient(90deg,#f5f5f5_20%,rgba(245,245,245,0)_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-[linear-gradient(270deg,#f5f5f5_20%,rgba(245,245,245,0)_100%)]" />

      <div className="flex w-max gap-[14px] py-[4px] [animation:mobile-logo-carousel_18s_linear_infinite]">
        {loopingItems.map((item, index) => (
          <div
            className="flex h-[82px] w-[152px] shrink-0 items-center justify-center rounded-[18px] border border-[rgba(230,222,212,0.96)] bg-white px-[18px] shadow-[0_16px_34px_rgba(15,23,42,0.06)]"
            key={`${item.alt}-${index}`}
          >
            <div
              className={`flex items-center justify-center rounded-[2px] bg-transparent ${
                item.panelClassName ?? ""
              }`}
            >
              <Image
                alt={item.alt}
                className={`h-auto object-contain ${item.logoClassName ?? "w-[92px]"}`}
                sizes="152px"
                src={item.logo}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes mobile-logo-carousel {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 7px));
          }
        }
      `}</style>
    </div>
  );
}
