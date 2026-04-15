import Image, { type StaticImageData } from "next/image";

import {
  StandardCollectionCardLink,
  standardCollectionButtonClassName,
} from "@/components/public/collection-card-layout";

type OpportunityCardProps = {
  bulletItems?: string[];
  ctaLabel: string;
  footer?: { label: string; value: string } | null;
  href: string;
  image: StaticImageData | string;
  imageAlt: string;
  metaIcon?: "briefcase" | "document" | "location";
  metaText?: string | null;
  statItems?: Array<{ label: string; value: string }>;
  summary?: string | null;
  title: string;
};

function OpportunityMetaIcon({ kind }: { kind: NonNullable<OpportunityCardProps["metaIcon"]> }) {
  if (kind === "document") {
    return (
      <svg
        aria-hidden="true"
        className="mt-[1px] h-[12px] w-[12px] shrink-0 stroke-[#30343b]"
        fill="none"
        viewBox="0 0 16 16"
      >
        <path d="M5 2.5h4l2.5 2.5v7.5A1.5 1.5 0 0 1 10 14H5A1.5 1.5 0 0 1 3.5 12.5V4A1.5 1.5 0 0 1 5 2.5Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        <path d="M9 2.5V5h2.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
      </svg>
    );
  }

  if (kind === "briefcase") {
    return (
      <svg
        aria-hidden="true"
        className="mt-[1px] h-[12px] w-[12px] shrink-0 stroke-[#30343b]"
        fill="none"
        viewBox="0 0 16 16"
      >
        <path d="M5.5 4V3.5A1.5 1.5 0 0 1 7 2h2a1.5 1.5 0 0 1 1.5 1.5V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        <path d="M2.5 5.5h11v6.25A1.75 1.75 0 0 1 11.75 13.5h-7.5A1.75 1.75 0 0 1 2.5 11.75V5.5Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        <path d="M2.5 7.75h11" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="mt-[1px] h-[12px] w-[12px] shrink-0 fill-[#30343b]"
      viewBox="0 0 24 24"
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 4.8 5.18 10.88 6.2 12.03a1 1 0 0 0 1.5 0C13.82 19.88 19 13.8 19 9a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
    </svg>
  );
}

export function OpportunityCard({
  bulletItems = [],
  ctaLabel,
  footer,
  href,
  image,
  imageAlt,
  metaIcon = "location",
  metaText,
  statItems = [],
  summary,
  title,
}: OpportunityCardProps) {
  const visibleBullets = bulletItems.filter(Boolean).slice(0, 2);
  const visibleStats = statItems.filter((item) => item.label && item.value).slice(0, 2);

  return (
    <StandardCollectionCardLink href={href}>
      <div className="px-[13px] pt-[13px]">
        <div className="relative h-[196px] overflow-hidden rounded-[14px] 2xl:h-[248px]">
          <Image
            alt={imageAlt}
            className="object-cover"
            fill
            sizes="(max-width: 1023px) 100vw, (max-width: 1535px) 330px, 456px"
            src={image}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-[13px] pb-[16px] pt-[14px]">
        <h3
          className="min-h-[42px] text-[19px] font-bold leading-[1.12] tracking-[-0.02em] text-[#131d36] 2xl:min-h-[52px] 2xl:text-[22px]"
          style={{
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            display: "-webkit-box",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>

        {metaText ? (
          <div className="mt-[7px] flex min-h-[16px] items-start gap-[6px] text-[12px] leading-[16px] text-[#6b7280] 2xl:min-h-[18px] 2xl:text-[13px]">
            <OpportunityMetaIcon kind={metaIcon} />
            <p className="truncate">{metaText}</p>
          </div>
        ) : null}

        {summary ? (
          <p
            className="mt-[9px] min-h-[35px] text-[12px] leading-[1.45] tracking-[0] text-[#6b7280] 2xl:min-h-[39px] 2xl:text-[13px] 2xl:leading-[1.5]"
            style={{
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              display: "-webkit-box",
              overflow: "hidden",
            }}
          >
            {summary}
          </p>
        ) : null}

        {visibleBullets.length ? (
          <div className="mt-[10px] min-h-[42px] space-y-[8px] text-[11.5px] leading-[1.4] text-[#646b75] 2xl:min-h-[46px] 2xl:text-[12px]">
            {visibleBullets.map((item, index) => (
              <div className="flex items-start gap-[6px]" key={`${title}-bullet-${index}`}>
                <span className="mt-[2px] text-[12px] font-semibold leading-none text-[#16213e]">
                  &#10003;
                </span>
                <p
                  style={{
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    display: "-webkit-box",
                    overflow: "hidden",
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-auto">
          {visibleStats.length ? (
            <div className="mt-[12px] grid border-y border-[#d7d7d7] text-left sm:grid-cols-2 sm:min-h-[88px]">
              {visibleStats.map((item, index) => (
                <div
                  className={`flex min-h-[74px] flex-col justify-start px-[13px] py-[9px] sm:min-h-[88px] ${
                    index === 0 && visibleStats.length > 1
                      ? "border-b border-[#d7d7d7] sm:border-b-0 sm:border-r"
                      : ""
                  }`}
                  key={`${title}-stat-${item.label}`}
                >
                  <p className="text-[11px] leading-[16px] text-[#6b7280] 2xl:text-[11.5px]">
                    {item.label}
                  </p>
                  <p
                    className="mt-[2px] text-[13px] font-semibold leading-[18px] text-[#30343b] 2xl:text-[14px]"
                    style={{
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      display: "-webkit-box",
                      overflow: "hidden",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {footer ? (
            <div className="mt-[10px] min-h-[16px] text-left text-[11px] leading-[16px] text-[#6b7280] 2xl:min-h-[18px] 2xl:text-[11.5px]">
              <span className="font-medium text-[#30343b]">{footer.label}:</span> {footer.value}
            </div>
          ) : null}

          <div className="pt-[16px]">
            <span className={`${standardCollectionButtonClassName} max-w-[188px] px-[20px] 2xl:max-w-[210px] 2xl:text-[13px]`}>
              {ctaLabel}
            </span>
          </div>
        </div>
      </div>
    </StandardCollectionCardLink>
  );
}
