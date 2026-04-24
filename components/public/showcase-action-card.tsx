import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

const joinClasses = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

type ShowcasePanelCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ShowcasePanelCard({
  children,
  className,
  style,
}: ShowcasePanelCardProps) {
  return (
    <article
      className={joinClasses(
        "group flex min-h-[280px] w-full min-w-0 max-w-full flex-col items-center rounded-[18px] px-4 pb-4 pt-4 text-center pv-interactive-card transition-[transform,box-shadow,border-color] duration-300 sm:min-h-[306px] sm:max-w-[320px] sm:px-[18px] sm:pb-[18px] sm:pt-[18px] 2xl:min-h-[332px] 2xl:max-w-[348px] 2xl:px-[22px] 2xl:pb-[22px] 2xl:pt-[22px]",
        className,
      )}
      style={style}
    >
      {children}
    </article>
  );
}

type ShowcaseActionCardProps = {
  title: ReactNode;
  body: ReactNode;
  ctaLabel: ReactNode;
  href: string;
  fullCardClickable?: boolean;
  icon: string | StaticImageData;
  iconAlt?: string;
  iconClassName?: string;
  imageSizes?: string;
  cardClassName?: string;
  cardStyle?: CSSProperties;
  panelClassName?: string;
  panelStyle?: CSSProperties;
  titleClassName?: string;
  bodyClassName?: string;
  buttonWrapClassName?: string;
  buttonClassName?: string;
};

export function ShowcaseActionCard({
  title,
  body,
  ctaLabel,
  href,
  fullCardClickable = false,
  icon,
  iconAlt,
  iconClassName,
  imageSizes = "120px",
  cardClassName,
  cardStyle,
  panelClassName,
  panelStyle,
  titleClassName,
  bodyClassName,
  buttonWrapClassName,
  buttonClassName,
}: ShowcaseActionCardProps) {
  const buttonContent = (
    <span className="inline-flex w-full items-center justify-center text-center leading-[1.2] !text-white" style={{ color: "#ffffff" }}>
      {ctaLabel}
    </span>
  );

  const card = (
    <ShowcasePanelCard
      className={joinClasses(
        "border border-[rgba(203,203,203,0.92)] shadow-[0_1px_0_rgba(255,255,255,0.45)_inset]",
        cardClassName,
      )}
      style={cardStyle}
    >
      <div
        className={joinClasses(
          "mx-auto mt-2.5 grid h-[94px] w-[108px] place-items-center rounded-[13px] border border-white/90 sm:mt-[10px] sm:h-[106px] sm:w-[120px] 2xl:h-[116px] 2xl:w-[132px]",
          panelClassName,
        )}
        style={panelStyle}
      >
        <Image
          alt={iconAlt ?? "Showcase card icon"}
          className={joinClasses("object-contain", iconClassName)}
          sizes={imageSizes}
          src={icon}
        />
      </div>

      <div className="mx-auto flex w-full max-w-[252px] flex-1 flex-col items-center pt-[22px] text-center sm:pt-[24px] 2xl:max-w-[284px]">
        <h3
          className={joinClasses(
            "mx-auto mt-5 max-w-full px-2 text-center text-[18px] font-semibold leading-[1.18] tracking-[0] text-[#182544] sm:mt-[20px] sm:text-[19px] sm:leading-[1.2] 2xl:text-[20px]",
            titleClassName,
          )}
        >
          {title}
        </h3>

        <p
          className={joinClasses(
            "mx-auto mt-[10px] max-w-full px-2 text-center text-[12.5px] font-normal leading-[1.35] tracking-[0] text-[rgba(97,97,97,1)] whitespace-normal sm:text-[13px] 2xl:text-[13.5px] 2xl:leading-[1.45]",
            bodyClassName,
          )}
        >
          {body}
        </p>

        <div className={joinClasses("mx-auto mt-auto flex w-full max-w-[210px] justify-center pt-[18px]", buttonWrapClassName)}>
          {fullCardClickable ? (
            <span
              className={joinClasses(
                "inline-flex min-h-[44px] w-full max-w-none items-center justify-center rounded-[10px] border border-[#284868] bg-[linear-gradient(180deg,#1d3a59_0%,#11283e_100%)] px-6 py-3 text-center text-[13px] font-semibold leading-[16px] tracking-[-0.01em] !text-white shadow-[0_10px_22px_rgba(17,40,62,0.18)] pv-interactive-button transition-[transform,box-shadow,border-color,background-color] duration-300 group-hover:-translate-y-[1px] group-hover:shadow-[0_14px_26px_rgba(17,40,62,0.22)] hover:border-[#33577d] hover:!text-white visited:!text-white 2xl:min-h-[48px] 2xl:text-[13.5px]",
                buttonClassName,
              )}
            >
              {buttonContent}
            </span>
          ) : (
            <Link
              className={joinClasses(
                "inline-flex min-h-[44px] w-full max-w-none items-center justify-center rounded-[10px] border border-[#284868] bg-[linear-gradient(180deg,#1d3a59_0%,#11283e_100%)] px-6 py-3 text-center text-[13px] font-semibold leading-[16px] tracking-[-0.01em] !text-white shadow-[0_10px_22px_rgba(17,40,62,0.18)] pv-interactive-button transition-[transform,box-shadow,border-color,background-color] duration-300 group-hover:-translate-y-[1px] group-hover:shadow-[0_14px_26px_rgba(17,40,62,0.22)] hover:border-[#33577d] hover:!text-white visited:!text-white 2xl:min-h-[48px] 2xl:text-[13.5px]",
                buttonClassName,
              )}
              href={href}
              style={{ color: "#ffffff" }}
            >
              {buttonContent}
            </Link>
          )}
        </div>
      </div>
    </ShowcasePanelCard>
  );

  if (fullCardClickable) {
    return (
      <Link className="block w-full max-w-full no-underline" href={href}>
        {card}
      </Link>
    );
  }

  return card;
}
