import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusPill } from "@/components/admin/status-pill";
import { requireAdminSession } from "@/lib/authz";
import { getCalculatorsAdmin } from "@/lib/data/admin";
import { formatDateTime, titleCase } from "@/lib/utils";

export default async function AdminCalculatorsPage() {
  await requireAdminSession();
  const calculators = await getCalculatorsAdmin();

  return (
    <AdminShell title="Calculators" subtitle="Manage calculator metadata, disclaimers, and publish status for the launch set.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center self-start rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700 shadow-sm shadow-violet-100/70">
          {calculators.length} records
        </div>
        <Link className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white shadow-lg shadow-slate-300/30 transition hover:-translate-y-0.5 hover:!text-white visited:!text-white" href="/admin/calculators/new">New Calculator</Link>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-lg shadow-slate-200/50">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Lifecycle</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {calculators.map((calculator) => (
              <tr className="transition-colors hover:bg-slate-50/80" key={calculator.id}>
                <td className="px-6 py-4"><Link className="font-semibold text-slate-900 transition hover:text-violet-700" href={`/admin/calculators/${calculator.id}`}>{calculator.title}</Link></td>
                <td className="px-6 py-4"><AdminStatusPill value={calculator.lifecycleStatus} /></td>
                <td className="px-6 py-4 text-slate-600">{titleCase(calculator.calculatorType)}</td>
                <td className="px-6 py-4 text-slate-600">{formatDateTime(calculator.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
