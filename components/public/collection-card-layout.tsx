import Link from "next/link";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

export const COLLECTION_CARD_DESKTOP_WIDTH = 296;
export const COLLECTION_CARD_DESKTOP_GAP = 30;
export const COLLECTION_CARD_TABLET_GAP = 24;
export const COLLECTION_CARD_MOBILE_GAP = 16;

export const standardCollectionButtonClassName =
  "mt-auto inline-flex h-[39px] w-fit items-center justify-center rounded-[4px] bg-[#18314b] px-[18px] text-[12px] font-semibold leading-none text-white transition-colors duration-300 group-hover:bg-[#234766] hover:bg-[#234766]";

export function ThreeUpCollectionGrid({
  children,
  className = "",
  desktopCardWidth = COLLECTION_CARD_DESKTOP_WIDTH,
  desktopGap = COLLECTION_CARD_DESKTOP_GAP,
}: {
  children: ReactNode;
  className?: string;
  desktopCardWidth?: number;
  desktopGap?: number;
}) {
  const resolvedClassName = "mx-auto w-full xl:max-w-[var(--three-up-max-width)]";
  const gridStyle = {
    "--three-up-card-width": `${desktopCardWidth}px`,
    "--three-up-gap": `${desktopGap}px`,
    "--three-up-max-width": `${desktopCardWidth * 3 + desktopGap * 2}px`,
  } as CSSProperties;

  return (
    <div
      className={`${resolvedClassName} ${className}`.trim()}
      style={gridStyle}
    >
      <div className="grid gap-y-[24px] sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 min-[1025px]:grid-cols-3 min-[1025px]:gap-x-6 min-[1025px]:gap-y-10 xl:grid-cols-[repeat(3,var(--three-up-card-width))] xl:justify-center xl:gap-x-[var(--three-up-gap)] xl:gap-y-[48px]">
        {children}
      </div>
    </div>
  );
}

export function StandardCollectionCard({
  children,
  className = "",
  ...articleProps
}: {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"article">) {
  const resolvedClassName =
    `flex min-h-[460px] flex-col overflow-hidden rounded-[18px] border border-[rgba(215,215,215,1)] bg-white sm:min-h-[484px] ${className}`.trim();

  return (
    <article {...articleProps} className={resolvedClassName}>
      {children}
    </article>
  );
}

export function StandardCollectionCardLink({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  const resolvedClassName =
    `group flex min-h-[460px] flex-col overflow-hidden rounded-[18px] border border-[rgba(215,215,215,1)] bg-white transition-transform duration-300 hover:-translate-y-[2px] sm:min-h-[484px] ${className}`.trim();

  return (
    <Link className={resolvedClassName} href={href}>
      {children}
    </Link>
  );
}
