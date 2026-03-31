import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminArrowRightIcon,
  AdminBookIcon,
  AdminFormsIcon,
  AdminPagesIcon,
} from "@/components/admin/admin-icons";
import { requireAdminSession } from "@/lib/authz";

function ChecklistSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(148,163,184,0.12)] lg:px-8">
      <h3 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      <ul className="mt-5 space-y-3 text-[16px] leading-8 text-slate-600">
        {items.map((item) => (
          <li className="flex gap-3" key={item}>
            <span className="mt-[10px] h-2.5 w-2.5 rounded-full bg-violet-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function AdminCreationDocPage() {
  await requireAdminSession();

  return (
    <AdminShell
      title="Creation Doc"
      subtitle="A practical publishing checklist for editors so every property, investment, page, and form is complete before it reaches the public site."
    >
      <section className="grid gap-5 xl:grid-cols-2">
        <ChecklistSection
          items={[
            "Use a clear, readable title because the slug is generated from it automatically.",
            "Write summary copy that is concise, specific, and consistent with the brand tone.",
            "Confirm all CTA labels and links are present before publishing.",
            "Review lifecycle and market status carefully so the record appears correctly in the admin and on the site.",
          ]}
          title="Before you publish"
        />
        <ChecklistSection
          items={[
            "Make sure primary images are selected and supporting media is ordered correctly.",
            "Check that linked forms point to the right inquiry or deal packet destination.",
            "Confirm that auto-saved drafts were fully finished and not left in an incomplete state.",
            "Open the public page after publishing to verify spacing, media, and text rendering.",
          ]}
          title="Media and form checks"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {[
          {
            title: "Page content review",
            body: "Use this when editing Home or singleton pages so headings, sections, CTA copy, and grouped items stay consistent.",
            href: "/admin/pages",
            icon: AdminPagesIcon,
          },
          {
            title: "Form setup review",
            body: "Check destination email, success message, field ordering, and required flags before connecting the form to a property or investment.",
            href: "/admin/forms",
            icon: AdminFormsIcon,
          },
          {
            title: "Portal guide",
            body: "Need the broader admin overview again? Return to the main documentation page for workflow notes and navigation guidance.",
            href: "/admin/documentation",
            icon: AdminBookIcon,
          },
        ].map((card) => {
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
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
                Open
                <AdminArrowRightIcon className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </section>
    </AdminShell>
  );
}
