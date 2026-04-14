"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType } from "react";

import logoHeader from "@/app/assets/headerlogo.svg";
import {
  AdminBlogIcon,
  AdminBookIcon,
  AdminBuildingIcon,
  AdminCaseStudyIcon,
  AdminChevronDownIcon,
  AdminCreateIcon,
  AdminDocumentIcon,
  AdminFormsIcon,
  AdminHelpIcon,
  AdminHomeIcon,
  AdminInvestmentIcon,
  AdminPagesIcon,
  AdminSubmissionsIcon,
} from "@/components/admin/admin-icons";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "General",
    items: [{ href: "/admin", label: "Home", icon: AdminHomeIcon }],
  },
  {
    title: "Modules",
    items: [
      { href: "/admin/properties", label: "Properties", icon: AdminBuildingIcon },
      { href: "/admin/investments", label: "Investments", icon: AdminInvestmentIcon },
      { href: "/admin/loan-programs", label: "Loan Programs", icon: AdminInvestmentIcon },
      { href: "/admin/blogs", label: "Blogs", icon: AdminBlogIcon },
      { href: "/admin/case-studies", label: "Case Studies", icon: AdminCaseStudyIcon },
      { href: "/admin/pages", label: "Pages", icon: AdminPagesIcon },
      { href: "/admin/forms", label: "Forms", icon: AdminFormsIcon },
      { href: "/admin/submissions", label: "Submissions", icon: AdminSubmissionsIcon },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/admin/documentation", label: "Documentation", icon: AdminBookIcon },
      { href: "/admin/how-to-create", label: "How to Create", icon: AdminCreateIcon },
      { href: "/admin/creation-doc", label: "Creation Doc", icon: AdminDocumentIcon },
    ],
  },
  {
    title: "Settings",
    items: [{ href: "/admin/documentation#support", label: "Help & Support", icon: AdminHelpIcon }],
  },
];

const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="relative overflow-hidden rounded-[2rem] border border-white/16 bg-[linear-gradient(180deg,#4d46e5_0%,#453ccf_48%,#39319f_100%)] px-5 pb-7 pt-6 shadow-[0_28px_60px_rgba(58,46,160,0.34)] lg:min-h-[calc(100vh-48px)] lg:rounded-[2.2rem]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),transparent_68%)]"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <Image
            alt="Pryceless Venture"
            className="h-auto w-[162px]"
            priority
            sizes="162px"
            src={logoHeader}
          />
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/18 bg-white/6 text-white/90"
            type="button"
            aria-label="Sidebar panel"
          >
            <span className="grid gap-[3px]">
              <span className="block h-[2px] w-4 rounded-full bg-current" />
              <span className="block h-[2px] w-4 rounded-full bg-current" />
              <span className="block h-[2px] w-4 rounded-full bg-current" />
            </span>
          </button>
        </div>

        <div className="mt-8 space-y-7">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-semibold !text-white">{section.title}</h2>
                {section.items.length > 1 ? (
                  <AdminChevronDownIcon className="h-4 w-4 !text-white" />
                ) : null}
              </div>

              <div className="mt-3 space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[18px] font-medium transition ${
                        active
                          ? "bg-white/18 !text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "!text-white hover:bg-white/10"
                      }`}
                      href={item.href}
                      key={item.href}
                    >
                      <Icon className="h-5 w-5 shrink-0 !text-white" />
                      <span className="!text-white">{item.label}</span>
                      {item.badge ? (
                        <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb44a]">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

      </div>
    </aside>
  );
}
