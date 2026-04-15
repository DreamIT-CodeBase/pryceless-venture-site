import Link from "next/link";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

export const COLLECTION_CARD_DESKTOP_WIDTH = 296;
export const COLLECTION_CARD_DESKTOP_GAP = 30;
export const COLLECTION_CARD_TABLET_GAP = 24;
export const COLLECTION_CARD_MOBILE_GAP = 16;

export const standardCollectionButtonClassName =
  "mt-auto inline-flex min-h-[44px] w-full max-w-[180px] items-center justify-center self-start rounded-[8px] bg-[#18314b] px-4 py-2.5 text-center text-[13px] font-semibold leading-[1.2] text-white transition-colors duration-300 group-hover:bg-[#234766] hover:bg-[#234766]";

export function ThreeUpCollectionGrid({
  children,
  className = "",
  desktopCardWidth = COLLECTION_CARD_DESKTOP_WIDTH,
  desktopGap = COLLECTION_CARD_DESKTOP_GAP,
  wideDesktopCardWidth = desktopCardWidth,
  wideDesktopGap = desktopGap,
}: {
  children: ReactNode;
  className?: string;
  desktopCardWidth?: number;
  desktopGap?: number;
  wideDesktopCardWidth?: number;
  wideDesktopGap?: number;
}) {
  const resolvedClassName = "mx-auto w-full xl:max-w-[var(--three-up-max-width)] 2xl:max-w-[var(--three-up-max-width-2xl)]";
  const gridStyle = {
    "--three-up-card-width": `${desktopCardWidth}px`,
    "--three-up-gap": `${desktopGap}px`,
    "--three-up-max-width": `${desktopCardWidth * 3 + desktopGap * 2}px`,
    "--three-up-card-width-2xl": `${wideDesktopCardWidth}px`,
    "--three-up-gap-2xl": `${wideDesktopGap}px`,
    "--three-up-max-width-2xl": `${wideDesktopCardWidth * 3 + wideDesktopGap * 2}px`,
  } as CSSProperties;

  return (
    <div
      className={`${resolvedClassName} ${className}`.trim()}
      style={gridStyle}
    >
      <div className="grid gap-y-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 min-[1025px]:grid-cols-3 min-[1025px]:gap-x-6 min-[1025px]:gap-y-10 xl:grid-cols-[repeat(3,var(--three-up-card-width))] xl:justify-center xl:gap-x-[var(--three-up-gap)] xl:gap-y-[48px] 2xl:grid-cols-[repeat(3,var(--three-up-card-width-2xl))] 2xl:gap-x-[var(--three-up-gap-2xl)]">
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
    `flex h-full min-h-[420px] flex-col overflow-hidden rounded-[18px] border border-[rgba(215,215,215,1)] bg-white sm:min-h-[484px] ${className}`.trim();

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
    `group flex h-full min-h-[420px] flex-col overflow-hidden rounded-[18px] border border-[rgba(215,215,215,1)] bg-white transition-transform duration-300 hover:-translate-y-[2px] sm:min-h-[484px] ${className}`.trim();

  return (
    <Link className={resolvedClassName} href={href}>
      {children}
    </Link>
  );
}
