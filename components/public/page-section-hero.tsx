import Link from "next/link";
import type { ReactNode } from "react";

const joinClasses = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

type PageSectionHeroProps = {
  currentLabel: string;
  title: ReactNode;
  intro: ReactNode;
  variant?: "compact" | "feature";
  sectionClassName?: string;
  innerClassName?: string;
  titleWrapClassName?: string;
  titleClassName?: string;
  introWrapClassName?: string;
  introClassName?: string;
  currentLabelClassName?: string;
  introColor?: string;
  heroContent?: ReactNode;
  heroContentPosition?: "below" | "side";
  heroContentWrapClassName?: string;
};

export function PageSectionHero({
  currentLabel,
  title,
  intro,
  sectionClassName,
  innerClassName,
  titleWrapClassName,
  titleClassName,
  introWrapClassName,
  introClassName,
  currentLabelClassName,
  introColor = "rgba(255,255,255,0.8)",
  heroContent,
  heroContentPosition = "below",
  heroContentWrapClassName,
}: PageSectionHeroProps) {
  const isSideHeroContent = heroContent && heroContentPosition === "side";

  return (
    <section
      className={joinClasses(
        "w-full overflow-hidden rounded-b-[30px] bg-[rgba(17,40,62,1)] sm:rounded-b-[36px] lg:rounded-b-[45px]",
        sectionClassName,
      )}
    >
      <div
        className={joinClasses(
          "mx-auto w-full max-w-[1360px] px-4 pb-[28px] pt-[24px] sm:px-6 sm:pb-[34px] sm:pt-[30px] min-[1025px]:min-h-[252px] min-[1025px]:pb-[42px] min-[1025px]:pl-[320px] min-[1025px]:pr-[125px] min-[1025px]:pt-[42px] 2xl:max-w-[1760px] 2xl:min-h-[280px] 2xl:pb-[52px] 2xl:pl-[164px] 2xl:pr-[164px] 2xl:pt-[48px]",
          innerClassName,
        )}            
      >
        <div className="flex flex-col gap-[18px]">
          <div
            className={joinClasses(
              isSideHeroContent
                ? "min-[1025px]:flex min-[1025px]:items-end min-[1025px]:justify-between min-[1025px]:gap-10 2xl:gap-14"
                : "",
            )}
          >
            <div
              className={joinClasses(
                "pv-page-section-hero-title-wrap flex max-w-[794px] flex-col gap-[24px] min-[1025px]:pl-[88px] sm:gap-[28px] min-[1025px]:gap-[34px] 2xl:max-w-[940px] 2xl:gap-[30px] 2xl:pl-0",
                isSideHeroContent ? "min-[1025px]:min-w-0 min-[1025px]:flex-1" : "",
                titleWrapClassName,
              )}
            >
              <div className="pv-page-section-hero-breadcrumb flex items-center gap-[6px] text-[13.5px] font-normal leading-[21px] tracking-[0] text-white min-[1025px]:text-[14.5px] min-[1025px]:leading-[22px]">
                <Link className="text-white" href="/" style={{ color: "#ffffff" }}>
                  Home
                </Link>
                <svg
                  aria-hidden="true"
                  className="h-[11px] w-[11px] text-white"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                  <path
                    d="M1.5 5h6M5.5 2l3 3-3 3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                  />
                </svg>
                <span
                  className={joinClasses("text-[rgba(191,147,117,1)]", currentLabelClassName)}
                  style={{ color: "rgba(191,147,117,1)" }}
                >
                  {currentLabel}
                </span>
              </div>

              <h1
                className={joinClasses(
                  "pv-page-section-hero-title text-[28px] font-bold leading-[1.08] tracking-[-0.04em] text-white sm:text-[38px] min-[1025px]:max-w-[794px] min-[1025px]:text-[30.5px] min-[1025px]:leading-[42px] min-[1025px]:tracking-[0] 2xl:max-w-[900px] 2xl:text-[50px] 2xl:leading-[1.04] 2xl:tracking-[-0.04em]",
                  titleClassName,
                )}
                style={{ color: "#ffffff" }}
              >
                {title}
              </h1>

              <div
                className={joinClasses(
                  "max-w-[794px] 2xl:max-w-[760px]",
                  introWrapClassName,
                )}
              >
                <p
                  className={joinClasses(
                    "pv-page-section-hero-intro text-[14px] font-normal leading-[1.65] tracking-[0] text-white/80 sm:text-[15px] min-[1025px]:text-[11.5px] min-[1025px]:leading-[19px] 2xl:text-[17px] 2xl:leading-[1.65]",
                    introClassName,
                  )}
                  style={{ color: introColor }}
                >
                  {intro}
                </p>
              </div>
            </div>

            {heroContent ? (
              <div
                className={joinClasses(
                  isSideHeroContent
                    ? "mt-6 min-[1025px]:mt-0 min-[1025px]:w-[360px] min-[1025px]:shrink-0 2xl:w-[392px]"
                    : "max-w-[794px] 2xl:max-w-[760px]",
                  heroContentWrapClassName,
                )}
              >
                {heroContent}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
