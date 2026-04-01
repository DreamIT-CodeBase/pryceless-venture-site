import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import logoHeader from "@/app/assets/headerlogo.svg";
import footerLogo from "@/app/assets/pvwhite.png";
import viewOpportunityHeaderIcon from "@/app/assets/viewoppertunitysvg.svg";
import { SiteNav } from "@/components/public/site-nav";

export function SiteShell({
  children,
  cta,
}: {
  children: ReactNode;
  cta?: { href: string; label: string };
}) {
  const headerCta = cta ?? { href: "/investments", label: "View Opportunities" };
  const footerLinks = [
    { href: "/", label: "Home" },
    { href: "/investments", label: "Investments" },
    { href: "/properties", label: "Properties" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/calculators", label: "ROI Calculators" },
    { href: "/capital-rates", label: "Capital Rates" },
    { href: "/cash-offer", label: "Enquiry" },
    { href: "/cash-offer", label: "Contact" },
  ];
  const blogLinks = [
    { href: "/case-studies", label: "The Future of Luxury Living -" },
    { href: "/case-studies", label: "Top 5 Emerging Real Estate -" },
    { href: "/case-studies", label: "Why Forest & Nature Inspire -" },
    { href: "/case-studies", label: "How to Choose the Perfect -" },
  ];
  const usefulLinkColumns = [
    footerLinks.slice(0, 4),
    footerLinks.slice(4, 8),
  ];
  const socialLinks = [
    {
      href: "https://www.facebook.com/thepvnetwork/",
      label: "Facebook",
      icon: (
        <svg aria-hidden="true" className="h-[19px] w-[19px] fill-[#1f2430]" viewBox="0 0 24 24">
          <path d="M13.37 21v-8.2h2.77l.42-3.2h-3.19V7.56c0-.93.26-1.56 1.59-1.56H16.7V3.14c-.3-.04-1.3-.14-2.47-.14-2.45 0-4.12 1.49-4.12 4.24V9.6H7.33v3.2h2.78V21h3.26Z" />
        </svg>
      ),
    },
    {
      href: "https://x.com",
      label: "X",
      icon: (
        <svg aria-hidden="true" className="h-[18px] w-[18px] fill-[#1f2430]" viewBox="0 0 24 24">
          <path d="M18.9 3H21l-4.58 5.24L21.8 21h-5.48l-4.29-5.64L7.1 21H5l4.9-5.6L2.8 3h5.62l3.88 5.11L18.9 3Zm-1.92 16.36h1.16L7.77 4.56H6.52l10.46 14.8Z" />
        </svg>
      ),
    },
    {
      href: "https://instagram.com",
      label: "Instagram",
      icon: (
        <svg aria-hidden="true" className="h-[19px] w-[19px] stroke-[#1f2430]" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect height="14" rx="4" width="14" x="5" y="5" />
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="16.6" cy="7.6" fill="#1f2430" r="1" stroke="none" />
        </svg>
      ),
    },
    {
      href: "https://www.linkedin.com/company/pryceless-ventures-llc/",
      label: "LinkedIn",
      icon: (
        <svg aria-hidden="true" className="h-[19px] w-[19px] fill-[#1f2430]" viewBox="0 0 24 24">
          <path d="M6.94 8.5A1.56 1.56 0 1 1 6.96 5.4 1.56 1.56 0 0 1 6.94 8.5ZM5.5 9.7h2.9V18H5.5V9.7Zm4.73 0H13v1.13h.04c.39-.74 1.34-1.52 2.76-1.52 2.95 0 3.5 1.94 3.5 4.47V18h-2.9v-3.75c0-.9-.01-2.05-1.25-2.05-1.25 0-1.44.98-1.44 1.98V18h-2.9V9.7Z" />
        </svg>
      ),
    },
  ];
  const contactItems = [
    {
      label: "(832) 981-3190",
      icon: (
        <svg aria-hidden="true" className="h-[12px] w-[12px] shrink-0 fill-white" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.3.56 3.58.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.28.19 2.47.56 3.58a1 1 0 0 1-.25 1.01l-2.19 2.2Z" />
        </svg>
      ),
    },
    {
      label: "info@prycelessventures.com",
      href: "https://outlook.office.com/mail/deeplink/compose?to=info%40prycelessventures.com",
      icon: (
        <svg aria-hidden="true" className="h-[12px] w-[12px] shrink-0 fill-white" viewBox="0 0 24 24">
          <path d="M20 5H4a2 2 0 0 0-2 2v.35l10 5.56 10-5.56V7a2 2 0 0 0-2-2Zm2 4.65-9.51 5.29a1 1 0 0 1-.98 0L2 9.65V17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.65Z" />
        </svg>
      ),
    },
    {
      label: "7306 Knox Street, Houston, TX 77088",
      href: "https://www.google.com/maps/search/?api=1&query=7306+Knox+Street,+Houston,+TX+77088",
      icon: (
        <svg aria-hidden="true" className="h-[12px] w-[12px] shrink-0 fill-white" viewBox="0 0 24 24">
          <path d="M12 2a7 7 0 0 0-7 7c0 4.8 5.18 10.88 6.2 12.03a1 1 0 0 0 1.5 0C13.82 19.88 19 13.8 19 9a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
        </svg>
      ),
    },
  ];
  const footerHeadingClassName =
    "!text-white text-[24px] font-bold leading-[26px] tracking-[0]";
  const footerRuleClassName = "mt-[15px] h-px w-full bg-[#19a7df]";
  const footerListLinkClassName =
    "block border-b border-white/18 text-[14px] leading-[30px] tracking-[0] !text-white transition hover:text-[var(--pv-sand)] sm:leading-[32px]";
  const footerIntroTextClassName =
    "text-[13px] font-normal leading-[22px] tracking-[0] !text-white";
  const footerSmallTextClassName =
    "text-[14px] font-normal leading-[24px] tracking-[0] !text-white";
  const footerContactLinkClassName =
    "text-[14px] font-normal leading-[24px] tracking-[0] !text-white transition hover:text-[var(--pv-sand)]";
  const footerBottomTextClassName =
    "text-[14px] leading-[24px] tracking-[0] !text-white";
  const footerIntroLines = [
    "Pryceless Ventures builds wealth",
    "through curated real estate",
    "opportunities backed by data,",
    "technology, and execution.",
  ];

  return (
    <div className="min-h-screen bg-white text-[var(--pv-ink)]">
      <header className="relative z-50 bg-white">
        <div className="mx-auto flex w-full max-w-[1478px] items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-5 min-[1025px]:grid min-[1025px]:min-h-[86px] min-[1025px]:grid-cols-[240px_minmax(0,1fr)_240px] min-[1025px]:items-center min-[1025px]:gap-x-[32px] min-[1025px]:px-[88px] min-[1025px]:py-0 xl:px-[124px]">
          <Link aria-label="Pryceless Ventures home" className="ml-2 max-w-[calc(100%-72px)] shrink-0 sm:ml-3 min-[1025px]:ml-0" href="/">
            <Image
              alt="Pryceless Ventures"
              className="h-auto w-[192px] sm:w-[208px] min-[1025px]:w-[216px]"
              priority
              sizes="(min-width: 1024px) 216px, (min-width: 640px) 208px, 192px"
              src={logoHeader}
            />
          </Link>

          <div className="ml-auto min-w-0 min-[1025px]:ml-0 min-[1025px]:flex min-[1025px]:w-full min-[1025px]:justify-center">
            <SiteNav mobileCta={headerCta} />
          </div>

          <div className="hidden shrink-0 min-[1025px]:flex min-[1025px]:w-[240px] min-[1025px]:justify-self-end min-[1025px]:justify-end">
            <Link
              className="inline-flex h-[50px] w-[196px] items-center justify-center gap-[9px] rounded-[6px] bg-[#18357a] px-[14px] text-[15px] leading-none font-medium text-white transition-none hover:bg-[#18357a] hover:text-white"
              href={headerCta.href}
            >
              <span className="flex shrink-0 items-center gap-[7px]">
                <Image
                  alt=""
                  className="h-[19px] w-[16px] object-contain"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(181deg) brightness(115%) contrast(108%)",
                  }}
                  src={viewOpportunityHeaderIcon}
                />
                <span className="block h-[22px] w-px shrink-0 bg-white/40" />
              </span>
              <span
                className="whitespace-nowrap leading-none tracking-[-0.016em] text-white"
                style={{ color: "#ffffff" }}
              >
                {headerCta.label}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-0">{children}</main>

      <footer
        className="mt-0 text-white"
        style={{ background: "rgba(0, 27, 40, 1)", color: "#ffffff" }}
      >
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-[24px] pt-[34px] sm:px-6 sm:pb-[28px] sm:pt-[38px] min-[1025px]:px-8 min-[1025px]:pb-[30px] min-[1025px]:pt-[44px]">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[minmax(0,214px)_minmax(0,286px)_minmax(0,314px)_minmax(0,252px)] xl:items-start xl:justify-between">
            <div className="max-w-[320px] self-start">
              <Image
                alt="Pryceless Ventures"
                className="-ml-[8px] -mt-[14px] mb-[14px] h-auto w-[228px] max-w-full object-contain"
                sizes="228px"
                src={footerLogo}
              />
              <p className={footerIntroTextClassName}>
                {footerIntroLines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </p>
              <div className="mt-[16px] flex items-center gap-[9px]">
                {socialLinks.map((item) => (
                  <Link
                    aria-label={item.label}
                    className="grid h-[33px] w-[33px] place-items-center rounded-full bg-white transition hover:-translate-y-0.5"
                    href={item.href}
                    key={item.label}
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            </div>

            <div className="min-w-0 xl:max-w-[286px]">
              <h3 className={footerHeadingClassName}>Useful link</h3>
              <div className={footerRuleClassName} />
              <div className="mt-[14px] grid gap-3 sm:max-w-[320px] sm:grid-cols-2 sm:gap-x-6">
                {usefulLinkColumns.map((column, columnIndex) => (
                  <div key={`useful-column-${columnIndex}`}>
                    {column.map((item) => (
                      <Link
                        className={footerListLinkClassName}
                        href={item.href}
                        key={`${item.href}-${item.label}`}
                        style={{ color: "#ffffff" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 xl:max-w-[314px]">
              <h3 className={footerHeadingClassName}>Latest Blog</h3>
              <div className={footerRuleClassName} />
              <div className="mt-[14px]">
                {blogLinks.map((item) => (
                  <Link
                    className={footerListLinkClassName}
                    href={item.href}
                    key={item.label}
                    style={{ color: "#ffffff" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="min-w-0 xl:max-w-[252px]">
              <h3 className={footerHeadingClassName}>Contact Info</h3>
              <div className={footerRuleClassName} />
              <div className="mt-[14px] space-y-[6px]">
                {contactItems.map((item) => (
                  <div className="flex items-start gap-[8px]" key={item.label}>
                    <span className="mt-[4px]">{item.icon}</span>
                    {item.href ? (
                      <a
                        className={footerContactLinkClassName}
                        href={item.href}
                        rel="noreferrer"
                        style={{ color: "#ffffff" }}
                        target="_blank"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <p className={footerSmallTextClassName}>{item.label}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-[38px] flex flex-col gap-3 border-t border-white/60 pt-[16px] text-center sm:text-left md:flex-row md:items-center md:justify-between min-[1025px]:mt-[46px]">
            <p className={footerBottomTextClassName}>&copy; Pryceless Ventures, LLC</p>
            <div className="flex flex-wrap items-center justify-center gap-x-[24px] gap-y-[8px] md:justify-end min-[1025px]:gap-x-[36px]">
              <Link className={footerBottomTextClassName} href="/capital-rates" style={{ color: "#ffffff" }}>
                Privacy Policy
              </Link>
              <Link className={footerBottomTextClassName} href="/cash-offer" style={{ color: "#ffffff" }}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
