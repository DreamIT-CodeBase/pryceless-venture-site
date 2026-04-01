"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/investments", label: "Investments" },
  { href: "/properties", label: "Properties" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/calculators", label: "ROI Calculators" },
  { href: "/capital-rates", label: "Capital Rates" },
];

const isItemActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function SiteNav({
  mobileCta,
}: {
  mobileCta?: { href: string; label: string };
}) {
  const pathname = usePathname();
  const menuId = useId();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="min-[1025px]:hidden">
        <button
          aria-controls={menuId}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="relative z-[60] inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-slate-200 bg-white text-[#111827] shadow-[0_12px_28px_rgba(15,23,42,0.1)] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18357a]/30"
          onClick={() => setMobileOpen((current) => !current)}
          type="button"
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "top-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "top-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <div
          aria-hidden={!mobileOpen}
          className={`fixed inset-0 z-40 bg-[#0f172a]/28 backdrop-blur-[1px] transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          aria-hidden={!mobileOpen}
          className={`fixed inset-x-4 top-[74px] z-50 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.16)] transition-all duration-300 ease-out sm:inset-x-6 sm:top-[88px] ${
            mobileOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          }`}
          id={menuId}
          role="dialog"
        >
          <nav aria-label="Mobile primary" className="flex flex-col">
            {navItems.map((item) => {
              const active = isItemActive(pathname, item.href);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`rounded-[14px] border-b border-slate-100 px-3 py-3.5 text-[15px] leading-none tracking-[-0.014em] transition-colors last:border-b-0 ${
                    active ? "font-semibold text-[#bf9375]" : "font-normal text-[#111111]"
                  }`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {mobileCta ? (
            <Link
              className="mt-4 inline-flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#18357a] px-5 text-[15px] font-medium leading-none text-white transition hover:bg-[#18357a] hover:text-white"
              href={mobileCta.href}
              onClick={() => setMobileOpen(false)}
            >
              {mobileCta.label}
            </Link>
          ) : null}
        </div>
      </div>

      <nav aria-label="Primary" className="hidden min-[1025px]:flex min-[1025px]:items-center min-[1025px]:justify-center min-[1025px]:gap-6 xl:gap-8">
        {navItems.map((item) => {
          const active = isItemActive(pathname, item.href);
          const isHovered = hoveredHref === item.href;
          const linkColor = isHovered ? "#d4af37" : active ? "#bf9375" : "#111111";

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center py-[5px] text-[15px] leading-none tracking-[-0.014em] transition-colors duration-200 focus-visible:outline-none ${
                active ? "font-semibold" : "font-normal"
              }`}
              href={item.href}
              key={item.href}
              onBlur={() => setHoveredHref((current) => (current === item.href ? null : current))}
              onFocus={() => setHoveredHref(item.href)}
              onMouseEnter={() => setHoveredHref(item.href)}
              onMouseLeave={() => setHoveredHref((current) => (current === item.href ? null : current))}
              style={{ color: linkColor }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
