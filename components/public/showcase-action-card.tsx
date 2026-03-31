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
        "flex min-h-[306px] w-full max-w-[260px] flex-col items-center rounded-[18px] px-[18px] pb-[18px] pt-[18px] text-center",
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
  return (
    <ShowcasePanelCard
      className={joinClasses(
        "border border-[rgba(203,203,203,0.92)] shadow-[0_1px_0_rgba(255,255,255,0.45)_inset]",
        cardClassName,
      )}
      style={cardStyle}
    >
      <div
        className={joinClasses(
          "mx-auto mt-[10px] grid h-[106px] w-[120px] place-items-center rounded-[13px] border border-white/90",
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

      <div className="flex w-full flex-1 flex-col items-center text-center">
        <h3
          className={joinClasses(
            "mx-auto mt-[16px] w-full max-w-[208px] text-center text-[18px] font-semibold leading-[32px] tracking-[0] text-[#182544]",
            titleClassName,
          )}
        >
          {title}
        </h3>

        <p
          className={joinClasses(
            "mx-auto mt-[7px] w-auto max-w-none whitespace-nowrap text-center text-[13px] font-normal leading-[17px] tracking-[0] text-[rgba(97,97,97,1)]",
            bodyClassName,
          )}
        >
          {body}
        </p>

        <div className={joinClasses("mt-auto flex w-full justify-center pt-[18px]", buttonWrapClassName)}>
          <Link
            className={joinClasses(
              "inline-flex h-[44px] w-fit min-w-[154px] items-center justify-center rounded-[10px] border border-[#284868] bg-[linear-gradient(180deg,#1d3a59_0%,#11283e_100%)] px-[22px] text-[13px] font-semibold leading-[16px] tracking-[-0.01em] text-white shadow-[0_10px_22px_rgba(17,40,62,0.18)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#33577d] hover:shadow-[0_14px_26px_rgba(17,40,62,0.22)]",
              buttonClassName,
            )}
            href={href}
            style={{ color: "#ffffff" }}
          >
            <span style={{ color: "#ffffff" }}>{ctaLabel}</span>
          </Link>
        </div>
      </div>
    </ShowcasePanelCard>
  );
}
