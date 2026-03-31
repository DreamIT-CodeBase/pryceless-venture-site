import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const joinClasses = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

const gridVariants = {
  compact: {
    sectionClassName: "mx-auto w-full max-w-[1180px] bg-white px-4 pb-[88px] pt-[76px] sm:px-6 lg:px-0",
    gridClassName: "mx-auto grid max-w-[928px] gap-[16px] sm:grid-cols-2 xl:grid-cols-4",
    cardClassName:
      "flex min-h-[314px] flex-col items-center rounded-[18px] border px-[14px] pt-[33px] pb-[25px] text-center shadow-[0_2px_8px_rgba(24,36,63,0.03)]",
    iconShellClassName:
      "mb-[22px] flex h-[102px] w-[113px] items-center justify-center rounded-[14px] border border-white/80 bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    iconClassName: "h-auto w-auto max-h-[58px] max-w-[62px]",
    titleClassName: "max-w-[178px] text-[19px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#18243f]",
    descriptionClassName:
      "mt-[6px] max-w-[178px] text-[13.5px] leading-[1.28] tracking-[-0.01em] text-[#6d6d6d]",
    buttonClassName:
      "mt-auto flex h-[39px] w-full max-w-[171px] items-center justify-center rounded-[4px] bg-[#16324d] px-4 text-[13.5px] font-semibold tracking-[-0.01em] !text-white transition-colors hover:bg-[#16324d] hover:!text-white visited:!text-white",
    buttonTextClassName: "max-w-[132px] text-center leading-[1.08]",
    disclaimerWrapClassName: "mx-auto mt-[48px] max-w-[928px]",
    disclaimerLabelClassName: "text-[14px] font-semibold leading-none tracking-[-0.01em] text-[#555555]",
    disclaimerTextClassName: "mt-[6px] max-w-[885px] text-[14px] leading-[1.46] tracking-[-0.01em] text-[#6d6d6d]",
  },
  spacious: {
    sectionClassName: "mx-auto w-full max-w-[1440px] bg-white px-4 pb-[62px] pt-[74px] sm:px-6 lg:px-[125px]",
    gridClassName: "mx-auto grid max-w-[1074px] gap-[20px] sm:grid-cols-2 xl:grid-cols-4",
    cardClassName:
      "flex min-h-[354px] flex-col items-center rounded-[18px] border px-[18px] pt-[37px] pb-[30px] text-center shadow-[0_2px_8px_rgba(24,36,63,0.03)]",
    iconShellClassName:
      "mb-[23px] flex h-[116px] w-[136px] items-center justify-center rounded-[14px] border border-white/80 bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    iconClassName: "h-auto w-auto max-h-[62px] max-w-[72px]",
    titleClassName: "max-w-[205px] text-[21.5px] font-semibold leading-[1.12] tracking-[-0.032em] text-[#18243f]",
    descriptionClassName:
      "mt-[10px] max-w-[210px] text-[16px] leading-[1.3] tracking-[-0.01em] text-[#6d6d6d]",
    buttonClassName:
      "mt-auto flex h-[44px] w-full max-w-[196px] items-center justify-center rounded-[4px] bg-[#16324d] px-4 text-[15px] font-semibold tracking-[-0.01em] !text-white transition-colors hover:bg-[#16324d] hover:!text-white visited:!text-white",
    buttonTextClassName: "max-w-[122px] text-center leading-[1.08]",
    disclaimerWrapClassName: "mx-auto mt-[56px] max-w-[1074px]",
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
          <article
            className={styles.cardClassName}
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

            <Link
              className={styles.buttonClassName}
              href={item.href}
              style={{ color: "#ffffff" }}
            >
              <span className={joinClasses(styles.buttonTextClassName, item.buttonTextClassName)}>
                {item.ctaLabel}
              </span>
            </Link>
          </article>
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
