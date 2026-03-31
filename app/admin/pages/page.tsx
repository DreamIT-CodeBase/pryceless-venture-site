import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/authz";
import { getSingletonPagesAdmin } from "@/lib/data/admin";
import { singletonPageLabels } from "@/lib/content-blueprint";

export default async function AdminPagesPage() {
  await requireAdminSession();
  const pages = await getSingletonPagesAdmin();

  return (
    <AdminShell title="Pages" subtitle="Edit the seeded singleton copy for launch pages and the Home singleton separately.">
      <div className="grid gap-4 md:grid-cols-2">
        <Link className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50" href="/admin/pages/home">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Home</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Home Page</h2>
          <p className="mt-2 text-sm text-slate-600">Hero, metrics, segments, platform cards, portfolio, case highlights, and testimonials.</p>
        </Link>
        {pages.map((page) => (
          <Link className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50" href={`/admin/pages/${page.key}`} key={page.id}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{page.routePath}</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{singletonPageLabels[page.key]}</h2>
            <p className="mt-2 text-sm text-slate-600">{page.pageTitle}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
