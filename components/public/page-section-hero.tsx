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
}: PageSectionHeroProps) {
  return (
    <section
      className={joinClasses(
        "w-full overflow-hidden rounded-b-[30px] bg-[rgba(17,40,62,1)] sm:rounded-b-[36px] lg:rounded-b-[45px]",
        sectionClassName,
      )}
    >
      <div
        className={joinClasses(
          "mx-auto w-full max-w-[1360px] px-4 pb-[28px] pt-[24px] sm:px-6 sm:pb-[34px] sm:pt-[30px] min-[1025px]:min-h-[252px] min-[1025px]:pb-[42px] min-[1025px]:pl-[320px] min-[1025px]:pr-[125px] min-[1025px]:pt-[42px]",
          innerClassName,
        )}
      >
        <div className="flex flex-col gap-[18px]">
          <div
            className={joinClasses(
              "flex max-w-[794px] flex-col gap-[24px] min-[1025px]:pl-[88px] sm:gap-[28px] min-[1025px]:gap-[34px]",
              titleWrapClassName,
            )}
          >
            <div className="flex items-center gap-[6px] text-[13.5px] font-normal leading-[21px] tracking-[0] text-white min-[1025px]:text-[14.5px] min-[1025px]:leading-[22px]">
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
                "text-[28px] font-bold leading-[1.08] tracking-[-0.04em] text-white sm:text-[38px] min-[1025px]:max-w-[794px] min-[1025px]:text-[30.5px] min-[1025px]:leading-[42px] min-[1025px]:tracking-[0]",
                titleClassName,
              )}
              style={{ color: "#ffffff" }}
            >
              {title}
            </h1>

            <div
              className={joinClasses(
                "max-w-[794px]",
                introWrapClassName,
              )}
            >
              <p
                className={joinClasses(
                  "text-[14px] font-normal leading-[1.65] tracking-[0] text-white/80 sm:text-[15px] min-[1025px]:text-[11.5px] min-[1025px]:leading-[19px]",
                  introClassName,
                )}
                style={{ color: introColor }}
              >
                {intro}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
