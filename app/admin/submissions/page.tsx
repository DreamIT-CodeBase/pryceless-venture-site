import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/authz";
import { getFormSubmissionsAdmin } from "@/lib/data/admin";

export default async function AdminSubmissionsPage() {
  await requireAdminSession();
  const submissions = await getFormSubmissionsAdmin();

  return (
    <AdminShell title="Submissions" subtitle="Review every form submission, monitor email and webhook delivery, and verify incoming lead details.">
      <div className="space-y-4">
        {submissions.length ? (
          submissions.map((submission) => (
            <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50" key={submission.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    {submission.formDefinition.formName}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    {submission.submitterName || submission.submitterEmail || "Anonymous submission"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Submitted {submission.submittedAt.toLocaleString()}
                    {submission.sourcePath ? ` • ${submission.sourcePath}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                    Email {submission.submissionEmailStatus}
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                    Webhook {submission.submissionWebhookStatus}
                  </div>
                </div>
              </div>
              <dl className="mt-6 grid gap-4 md:grid-cols-2">
                {submission.values.map((value) => (
                  <div className="rounded-[1.5rem] bg-slate-50 p-4" key={value.id}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{value.label}</dt>
                    <dd className="mt-2 text-slate-700">{value.value || "-"}</dd>
                  </div>
                ))}
              </dl>
              {submission.emailError ? (
                <p className="mt-4 text-sm text-rose-600">{submission.emailError}</p>
              ) : null}
              {submission.webhookError ? (
                <p className="mt-2 text-sm text-rose-600">{submission.webhookError}</p>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-slate-500">
            Form submissions will appear here after the public forms go live.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
