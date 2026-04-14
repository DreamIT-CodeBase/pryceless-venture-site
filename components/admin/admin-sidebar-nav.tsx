"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AdminBlogIcon,
  AdminBuildingIcon,
  AdminCaseStudyIcon,
  AdminChevronDownIcon,
  AdminFormsIcon,
  AdminHomeIcon,
  AdminInvestmentIcon,
  AdminPagesIcon,
  AdminSubmissionsIcon,
} from "@/components/admin/admin-icons";

const navSections = [
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
] as const;

const isItemActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="mt-10 space-y-7">
      {navSections.map((section) => (
        <section className="border-t border-white/18 pt-6 first:border-t-0 first:pt-0" key={section.title}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] !text-white">
              {section.title}
            </h2>
            <AdminChevronDownIcon className="h-4 w-4 !text-white" />
          </div>

          <div className="space-y-1.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(pathname, item.href);

              return (
                <Link
                  className={`group flex items-center gap-3 rounded-[18px] px-4 py-3 text-[15px] font-medium transition ${
                    active
                      ? "bg-white/16 !text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "!text-white hover:bg-white/10 hover:!text-white"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                      active ? "bg-white/10" : "bg-transparent"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] !text-white" />
                  </span>
                  <span className="!text-white">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
