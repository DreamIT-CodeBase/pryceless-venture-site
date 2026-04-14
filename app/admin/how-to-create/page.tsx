import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminArrowRightIcon,
  AdminBlogIcon,
  AdminBuildingIcon,
  AdminCaseStudyIcon,
  AdminFormsIcon,
  AdminInvestmentIcon,
  AdminPagesIcon,
} from "@/components/admin/admin-icons";
import { requireAdminSession } from "@/lib/authz";

const guides = [
  {
    title: "Create a property",
    body: "Open Properties, click New Property, write the listing title and summary, connect the inquiry form, upload media, and set lifecycle plus market status.",
    href: "/admin/properties/new",
    icon: AdminBuildingIcon,
  },
  {
    title: "Create an investment",
    body: "Open Investments, add the opportunity title, strategy, summary, minimum investment details, returns disclaimer, and deal packet form.",
    href: "/admin/investments/new",
    icon: AdminInvestmentIcon,
  },
  {
    title: "Create a blog post",
    body: "Open Blogs, add the article title, excerpt, full content, publishing date, featured image, and publish the slug-based article page.",
    href: "/admin/blogs/new",
    icon: AdminBlogIcon,
  },
  {
    title: "Create a case study",
    body: "Open Case Studies, write the overview, business plan, execution, outcome summary, and add asset profile plus takeaway rows.",
    href: "/admin/case-studies/new",
    icon: AdminCaseStudyIcon,
  },
  {
    title: "Create or update a page",
    body: "Open Pages to edit the Home page or any singleton page. Update headlines, intro copy, CTA labels, and grouped content items.",
    href: "/admin/pages",
    icon: AdminPagesIcon,
  },
  {
    title: "Manage a form",
    body: "Open Forms, choose the approved definition, then update the destination, success message, and field ordering for the launch workflow.",
    href: "/admin/forms",
    icon: AdminFormsIcon,
  },
] as const;

export default async function AdminHowToCreatePage() {
  await requireAdminSession();

  return (
    <AdminShell
      title="How to Create"
      subtitle="Step-by-step guidance for creating and publishing content in the Pryceless Venture CMS without exposing extra fields or technical complexity."
    >
      <section className="grid gap-5 xl:grid-cols-2">
        {guides.map((guide) => {
          const Icon = guide.icon;

          return (
            <article
              className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(148,163,184,0.12)]"
              key={guide.title}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-[24px] font-semibold tracking-[-0.02em] text-slate-950">{guide.title}</h3>
              <p className="mt-3 text-[16px] leading-8 text-slate-600">{guide.body}</p>
              <Link
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                href={guide.href}
              >
                Open module
                <AdminArrowRightIcon className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(148,163,184,0.12)] lg:px-8">
        <h3 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-950">Creation notes</h3>
        <div className="mt-5 space-y-3 text-[16px] leading-8 text-slate-600">
          <p>Drafts save automatically while editing, so it is safe to pause work and return later.</p>
          <p>Slugs are created from the title when saving. Editors do not have to fill slug fields manually.</p>
          <p>Always review images, CTA links, and status values before publishing to the live site.</p>
        </div>
      </section>
    </AdminShell>
  );
}
