import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const joinClasses = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

const gridVariants = {
  compact: {
    sectionClassName: "mx-auto w-full max-w-[1180px] bg-white px-4 pb-[72px] pt-[56px] sm:px-6 sm:pb-[88px] sm:pt-[76px] lg:px-0",
    gridClassName: "mx-auto grid max-w-[928px] gap-4 sm:grid-cols-2 xl:grid-cols-4",
    cardClassName:
      "flex h-full min-h-[286px] flex-col items-center rounded-[18px] border px-4 pb-6 pt-7 text-center shadow-[0_2px_8px_rgba(24,36,63,0.03)] sm:min-h-[314px] sm:px-[14px] sm:pt-[33px] sm:pb-[25px]",
    iconShellClassName:
      "mb-5 flex h-[94px] w-[104px] items-center justify-center rounded-[14px] border border-white/80 bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:mb-[22px] sm:h-[102px] sm:w-[113px]",
    iconClassName: "h-auto w-auto max-h-[58px] max-w-[62px]",
    titleClassName: "max-w-[220px] text-[18px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#18243f] sm:max-w-[178px] sm:text-[19px]",
    descriptionClassName:
      "mt-[6px] max-w-[220px] text-[13.5px] leading-[1.4] tracking-[-0.01em] text-[#6d6d6d] sm:max-w-[178px] sm:leading-[1.28]",
    buttonClassName:
      "mt-auto flex min-h-[39px] w-full max-w-[180px] items-center justify-center rounded-[4px] bg-[#16324d] px-4 py-2 text-[13.5px] font-semibold tracking-[-0.01em] !text-white transition-colors hover:bg-[#16324d] hover:!text-white visited:!text-white",
    buttonTextClassName: "max-w-[148px] text-center leading-[1.2]",
    disclaimerWrapClassName: "mx-auto mt-[48px] max-w-[928px]",
    disclaimerLabelClassName: "text-[14px] font-semibold leading-none tracking-[-0.01em] text-[#555555]",
    disclaimerTextClassName: "mt-[6px] max-w-[885px] text-[14px] leading-[1.46] tracking-[-0.01em] text-[#6d6d6d]",
  },
  spacious: {
    sectionClassName: "mx-auto w-full max-w-[1440px] bg-white px-4 pb-[56px] pt-[56px] sm:px-6 sm:pb-[62px] sm:pt-[74px] lg:px-[125px] 2xl:max-w-[1760px] 2xl:px-[164px]",
    gridClassName: "mx-auto grid max-w-[1074px] gap-4 sm:grid-cols-2 sm:gap-[20px] xl:grid-cols-4 2xl:max-w-[1280px] 2xl:gap-[24px]",
    cardClassName:
      "flex h-full min-h-[308px] flex-col items-center rounded-[18px] border px-4 pb-6 pt-8 text-center shadow-[0_2px_8px_rgba(24,36,63,0.03)] sm:min-h-[354px] sm:px-[18px] sm:pt-[37px] sm:pb-[30px] 2xl:min-h-[372px]",
    iconShellClassName:
      "mb-5 flex h-[102px] w-[116px] items-center justify-center rounded-[14px] border border-white/80 bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:mb-[23px] sm:h-[116px] sm:w-[136px]",
    iconClassName: "h-auto w-auto max-h-[62px] max-w-[72px]",
    titleClassName: "max-w-[228px] text-[18px] font-semibold leading-[1.18] tracking-[-0.032em] text-[#18243f] sm:max-w-[205px] sm:text-[21.5px]",
    descriptionClassName:
      "mt-[10px] max-w-[228px] text-[14px] leading-[1.45] tracking-[-0.01em] text-[#6d6d6d] sm:max-w-[210px] sm:text-[16px] sm:leading-[1.3]",
    buttonClassName:
      "mt-auto flex min-h-[44px] w-full max-w-[196px] items-center justify-center rounded-[4px] bg-[#16324d] px-4 py-2 text-[14px] font-semibold tracking-[-0.01em] !text-white transition-colors hover:bg-[#16324d] hover:!text-white visited:!text-white sm:text-[15px]",
    buttonTextClassName: "max-w-[138px] text-center leading-[1.18]",
    disclaimerWrapClassName: "mx-auto mt-[56px] max-w-[1074px] 2xl:max-w-[1280px]",
    disclaimerLabelClassName: "text-[14px] font-semibold leading-none tracking-[-0.01em] text-[#555555]",
    disclaimerTextClassName: "mt-[7px] text-[14px] leading-[1.5] tracking-[-0.01em] text-[#6d6d6d]",
  },
} as const;

export type PastelActionCardItem = {
  title: ReactNode;
  description: ReactNode;
  ctaLabel: ReactNode;
  href: string;
  icon: StaticImageData;
  iconAlt?: string;
  backgroundColor: string;
  borderColor: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  buttonTextClassName?: string;
};

export function PastelActionCardGrid({
  items,
  disclaimer,
  sectionClassName,
  gridClassName,
  variant = "spacious",
}: {
  items: readonly PastelActionCardItem[];
  disclaimer?: { label: string; text: string };
  sectionClassName?: string;
  gridClassName?: string;
  variant?: keyof typeof gridVariants;
}) {
  const styles = gridVariants[variant];

  return (
    <section className={joinClasses(styles.sectionClassName, sectionClassName)}>
      <div className={joinClasses(styles.gridClassName, gridClassName)}>
        {items.map((item, index) => (
          <Link
            className={styles.cardClassName}
            href={item.href}
            key={`pastel-card-${index}`}
            style={{
              backgroundColor: item.backgroundColor,
              borderColor: item.borderColor,
            }}
          >
            <div className={styles.iconShellClassName}>
              <Image
                alt={item.iconAlt ?? (typeof item.title === "string" ? `${item.title} icon` : "Card icon")}
                className={joinClasses(styles.iconClassName, item.iconClassName)}
                sizes="72px"
                src={item.icon}
              />
            </div>

            <h2
              className={joinClasses(
                styles.titleClassName,
                item.titleClassName,
              )}
            >
              {item.title}
            </h2>

            <p
              className={joinClasses(
                styles.descriptionClassName,
                item.descriptionClassName,
              )}
            >
              {item.description}
            </p>

            <span className={styles.buttonClassName} style={{ color: "#ffffff" }}>
              <span className={joinClasses(styles.buttonTextClassName, item.buttonTextClassName)}>
                {item.ctaLabel}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {disclaimer ? (
        <div className={styles.disclaimerWrapClassName}>
          <p className={styles.disclaimerLabelClassName}>
            {disclaimer.label}
          </p>
          <p className={styles.disclaimerTextClassName}>
            {disclaimer.text}
          </p>
        </div>
      ) : null}
    </section>
  );
}
