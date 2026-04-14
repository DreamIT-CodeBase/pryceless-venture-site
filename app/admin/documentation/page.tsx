import Link from "next/link";
import { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminArrowRightIcon,
  AdminBlogIcon,
  AdminBookIcon,
  AdminBuildingIcon,
  AdminInvestmentIcon,
  AdminPagesIcon,
  AdminSubmissionsIcon,
} from "@/components/admin/admin-icons";
import { requireAdminSession } from "@/lib/authz";

const overviewCards = [
  {
    title: "Properties",
    body: "Create listings, manage images, control lifecycle status, and connect inquiry forms.",
    href: "/admin/properties",
    icon: AdminBuildingIcon,
  },
  {
    title: "Investments",
    body: "Manage opportunities, returns copy, deal packet forms, galleries, and lifecycle visibility.",
    href: "/admin/investments",
    icon: AdminInvestmentIcon,
  },
  {
    title: "Blogs",
    body: "Publish articles with featured images, dates, excerpts, and slug-based detail pages that feed the footer automatically.",
    href: "/admin/blogs",
    icon: AdminBlogIcon,
  },
  {
    title: "Pages & Forms",
    body: "Keep homepage content, singleton pages, and lead capture forms updated without code changes.",
    href: "/admin/pages",
    icon: AdminPagesIcon,
  },
  {
    title: "Submissions",
    body: "Review lead submissions, confirm delivery status, and validate incoming details in one feed.",
    href: "/admin/submissions",
    icon: AdminSubmissionsIcon,
  },
] as const;

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(148,163,184,0.12)] lg:px-8">
      <h3 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      <div className="mt-5 space-y-3 text-[16px] leading-8 text-slate-600">{children}</div>
    </section>
  );
}

export default async function AdminDocumentationPage() {
  await requireAdminSession();

  return (
    <AdminShell
      title="Documentation"
      subtitle="A simple guide to the Pryceless Venture CMS so editors know where to create content, how data is saved, and how publishing works."
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(148,163,184,0.12)] transition hover:-translate-y-1"
              href={card.href}
              key={card.title}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-[22px] font-semibold tracking-[-0.02em] text-slate-950">{card.title}</h3>
              <p className="mt-3 text-[16px] leading-8 text-slate-600">{card.body}</p>
            </Link>
          );
        })}
      </section>

      <SectionCard title="How the admin portal is organized">
        <p>The sidebar is split into General, Modules, and Resources so editors can move quickly between dashboard work, content management, and documentation.</p>
        <p>The header keeps documentation one click away, and every main content section opens in its own CRUD area: Properties, Investments, Loan Programs, Blogs, Case Studies, Pages, Forms, and Submissions.</p>
        <p>Authentication is handled with Microsoft Entra ID. Only approved admin email addresses can enter the portal.</p>
      </SectionCard>

      <SectionCard title="Editing behavior">
        <p>When an editor starts a new record and leaves before publishing, the CMS automatically saves a draft to the database. When they return, they can continue instead of starting from scratch.</p>
        <p>Slugs are created automatically from the title or form name when a record is saved. Editors do not need to manage slug fields manually.</p>
        <p>Success messages appear as polished admin popups after important actions such as save, publish, archive, and delete.</p>
      </SectionCard>

      <SectionCard title="Recommended workflow">
        <p>1. Create or update the record in the correct module.</p>
        <p>2. Review the title, summary copy, lifecycle status, market status, forms, and images.</p>
        <p>3. Confirm the correct form connections for leads or deal packets.</p>
        <p>4. Publish only after checking the public-facing route and media presentation.</p>
      </SectionCard>

      <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(148,163,184,0.12)] lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-950">Quick jump links</h3>
            <p className="mt-3 text-[16px] leading-8 text-slate-600">Open the most common admin areas directly from this documentation page.</p>
          </div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-700">
            <AdminBookIcon className="h-5 w-5" />
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/admin/properties", label: "Open Properties" },
            { href: "/admin/blogs", label: "Open Blogs" },
            { href: "/admin/forms", label: "Open Forms" },
            { href: "/admin/submissions", label: "Open Submissions" },
          ].map((item) => (
            <Link
              className="inline-flex items-center justify-between rounded-[20px] border border-slate-200 bg-[#fbfcff] px-5 py-4 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-white"
              href={item.href}
              key={item.href}
            >
              <span>{item.label}</span>
              <AdminArrowRightIcon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
