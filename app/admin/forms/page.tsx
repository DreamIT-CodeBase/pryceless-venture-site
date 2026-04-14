import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusPill } from "@/components/admin/status-pill";
import { requireAdminSession } from "@/lib/authz";
import { getFormsAdmin } from "@/lib/data/admin";
import { titleCase } from "@/lib/utils";

export default async function AdminFormsPage() {
  await requireAdminSession();
  const forms = await getFormsAdmin();

  return (
    <AdminShell title="Forms" subtitle="Create forms, link them to loan programs, and manage destinations, webhooks, and success messaging.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center self-start rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700 shadow-sm shadow-violet-100/70">
          {forms.length} records
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50" href="/admin/forms">
            Refresh Forms
          </Link>
          <Link className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white shadow-lg shadow-slate-300/30 transition hover:-translate-y-0.5 hover:!text-white visited:!text-white" href="/admin/forms/new">
            New Form
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-lg shadow-slate-200/50">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Form</th>
              <th className="px-6 py-4 font-medium">Loan Program</th>
              <th className="px-6 py-4 font-medium">Destination</th>
              <th className="px-6 py-4 font-medium">Active</th>
              <th className="px-6 py-4 font-medium">Submissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {forms.map((form) => (
              <tr className="transition-colors hover:bg-slate-50/80" key={form.id}>
                <td className="px-6 py-4"><Link className="font-semibold text-slate-900 transition hover:text-violet-700" href={`/admin/forms/${form.id}`}>{form.formName}</Link></td>
                <td className="px-6 py-4 text-slate-600">{form.linkedLoanProgram?.title ?? "Unlinked"}</td>
                <td className="px-6 py-4"><AdminStatusPill value={titleCase(form.destination)} /></td>
                <td className="px-6 py-4"><AdminStatusPill value={form.isActive ? "Active" : "Inactive"} /></td>
                <td className="px-6 py-4 text-slate-600">{form._count.submissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
