import Link from "next/link";

import { deleteLoanProgram } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusPill } from "@/components/admin/status-pill";
import { requireAdminSession } from "@/lib/authz";
import { getLoanProgramsAdmin } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AdminLoanProgramsPage() {
  await requireAdminSession();
  const loanPrograms = await getLoanProgramsAdmin();

  return (
    <AdminShell
      title="Loan Programs"
      subtitle="Manage public financing programs, update terms, and control which programs are visible on the Get Financing page."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center self-start rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700 shadow-sm shadow-violet-100/70">
          {loanPrograms.length} records
        </div>
        <Link className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white shadow-lg shadow-slate-300/30 transition hover:-translate-y-0.5 hover:!text-white visited:!text-white" href="/admin/loan-programs/new">
          New Loan Program
        </Link>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-lg shadow-slate-200/50">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Program</th>
              <th className="px-6 py-4 font-medium">Lifecycle</th>
              <th className="px-6 py-4 font-medium">Visible</th>
              <th className="px-6 py-4 font-medium">Forms</th>
              <th className="px-6 py-4 font-medium">Updated</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {loanPrograms.map((program) => {
              const isSeedFallback = Boolean(program.isSeedFallback);

              return (
                <tr className="transition-colors hover:bg-slate-50/80" key={program.id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <Link className="font-semibold text-slate-900 transition hover:text-violet-700" href={`/admin/loan-programs/${program.id}`}>
                        {program.title}
                      </Link>
                      <span className="text-xs text-slate-500">Order {program.sortOrder}</span>
                      {isSeedFallback ? (
                        <span className="text-xs text-amber-700">
                          Local fallback editing is active until the loan program schema is live.
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4"><AdminStatusPill value={program.lifecycleStatus} /></td>
                  <td className="px-6 py-4"><AdminStatusPill value={program.isActive ? "Active" : "Inactive"} /></td>
                  <td className="px-6 py-4 text-slate-600">{program.forms.length}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDateTime(program.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                          href={`/admin/loan-programs/${program.id}`}
                        >
                          Edit
                        </Link>
                        <form action={deleteLoanProgram}>
                          <input name="recordId" type="hidden" value={program.id} />
                          <button
                            className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100"
                            type="submit"
                          >
                            Delete
                          </button>
                        </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
