import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminArrowRightIcon,
  AdminBlogIcon,
  AdminBookIcon,
  AdminBuildingIcon,
  AdminCaseStudyIcon,
  AdminFormsIcon,
  AdminInvestmentIcon,
  AdminPagesIcon,
  AdminSparkIcon,
  AdminSubmissionsIcon,
} from "@/components/admin/admin-icons";
import { requireAdminSession } from "@/lib/authz";
import { getDashboardCounts } from "@/lib/data/admin";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const counts = await getDashboardCounts();
  const userName = session.user?.name?.trim() || session.user?.email?.trim() || "Admin";
  const inlineUserName = userName.replace(/\s+/g, "\u00A0");

  const quickActions = [
    {
      label: "Create Property",
      description: "Launch a new property page, media set, and inquiry flow.",
      href: "/admin/properties/new",
      icon: AdminBuildingIcon,
      accent: "from-[#7c3aed] to-[#5b4af4]",
    },
    {
      label: "Add Loan Program",
      description: "Publish a financing program with terms, visibility, and linked application flow.",
      href: "/admin/loan-programs/new",
      icon: AdminInvestmentIcon,
      accent: "from-[#0ea5e9] to-[#2563eb]",
    },
    {
      label: "Manage Pages",
      description: "Refresh home or seeded singleton pages without developer help.",
      href: "/admin/pages",
      icon: AdminPagesIcon,
      accent: "from-[#38bdf8] to-[#4f46e5]",
    },
    {
      label: "Build Form",
      description: "Review approved launch forms and refine capture fields, destinations, and success copy.",
      href: "/admin/forms",
      icon: AdminFormsIcon,
      accent: "from-[#ec4899] to-[#ef4444]",
    },
  ] as const;

  const overviewCards = [
    { label: "Properties", value: counts.properties, href: "/admin/properties", icon: AdminBuildingIcon },
    { label: "Investments", value: counts.investments, href: "/admin/investments", icon: AdminInvestmentIcon },
    { label: "Loan Programs", value: counts.loanPrograms, href: "/admin/loan-programs", icon: AdminInvestmentIcon },
    { label: "Blogs", value: counts.blogs, href: "/admin/blogs", icon: AdminBlogIcon },
    { label: "Case Studies", value: counts.caseStudies, href: "/admin/case-studies", icon: AdminCaseStudyIcon },
    { label: "Forms", value: counts.forms, href: "/admin/forms", icon: AdminFormsIcon },
    { label: "Submissions", value: counts.submissions, href: "/admin/submissions", icon: AdminSubmissionsIcon },
  ] as const;

  const docsCards = [
    {
      title: "Documentation",
      body: "Learn how the portal is organized, how drafts work, and where each content type lives.",
      href: "/admin/documentation",
      icon: AdminBookIcon,
    },
    {
      title: "How to Create",
      body: "Follow step-by-step creation guides for properties, investments, case studies, pages, and forms.",
      href: "/admin/how-to-create",
      icon: AdminSparkIcon,
    },
    {
      title: "Creation Doc",
      body: "Use the publishing checklist for titles, media, forms, statuses, and review before go-live.",
      href: "/admin/creation-doc",
      icon: AdminPagesIcon,
    },
  ] as const;

  return (
    <AdminShell
      title="Dashboard"
      showPageHeader={false}
      showResourceLinks={false}
      subtitle="Create, review, publish, and document Pryceless Venture content from one polished Microsoft Entra-secured workspace."
    >
      <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,rgba(242,240,255,0.98),rgba(248,242,255,0.96),rgba(240,236,255,0.98))] px-6 py-10 shadow-[0_22px_60px_rgba(148,163,184,0.15)] lg:px-8 lg:py-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(rgba(123,97,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(123,97,255,0.06)_1px,transparent_1px)] [background-size:30px_30px]"
        />
        <div className="relative">
          <h2 className="text-[24px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[28px] lg:text-[40px] xl:whitespace-nowrap">
            Welcome to <span className="text-[#5b4af4]">Pryceless CMS</span>, {inlineUserName}
          </h2>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-[34px] font-semibold tracking-[-0.03em] text-slate-950">
            Explore our features
          </h3>
          <span className="rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
            Quick actions
          </span>
        </div>
        <div className="grid gap-5 xl:grid-cols-4">
          {quickActions.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(148,163,184,0.14)] transition hover:-translate-y-1"
                href={card.href}
                key={card.label}
              >
                <div className="flex items-center justify-center bg-[#fbfbff] px-6 py-8">
                  <span className={`inline-flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-br ${card.accent} text-white shadow-[0_16px_40px_rgba(99,102,241,0.24)]`}>
                    <Icon className="h-9 w-9" />
                  </span>
                </div>
                <div className="px-6 pb-7 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[18px] font-semibold leading-8 text-slate-950">{card.label}</h4>
                    <AdminArrowRightIcon className="mt-1 h-[18px] w-[18px] text-slate-800" />
                  </div>
                  <p className="mt-2 text-[16px] leading-8 text-slate-600">{card.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_20px_60px_rgba(148,163,184,0.14)] lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-[34px] font-semibold tracking-[-0.03em] text-slate-950">Usage overview</h3>
            <p className="mt-2 text-[16px] leading-7 text-slate-500">
              High-level counts across content, pages, forms, and submissions.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            href="/admin/documentation"
          >
            <AdminBookIcon className="h-4 w-4" />
            Help & docs
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overviewCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                className="rounded-[24px] border border-slate-200/80 bg-[#fbfcff] px-5 py-5 transition hover:-translate-y-0.5 hover:border-slate-300"
                href={card.href}
                key={card.label}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
                    <p className="mt-4 text-[42px] font-semibold leading-none tracking-[-0.04em] text-slate-950">{card.value}</p>
                  </div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {docsCards.map((card) => {
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
    </AdminShell>
  );
}
