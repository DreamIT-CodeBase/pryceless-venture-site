import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { FormDefinitionForm } from "@/components/admin/form-definition-form";
import { requireAdminSession } from "@/lib/authz";
import { getFormAdmin, getLoanProgramsForSelect } from "@/lib/data/admin";

export default async function EditFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const [form, loanPrograms] = await Promise.all([getFormAdmin(id), getLoanProgramsForSelect()]);
  const errorMessage = (await searchParams)?.error;
  if (!form) notFound();

  if (form.isSeedFallback) {
    return (
      <AdminShell
        title={form.formName}
        subtitle="Form schema fallback"
      >
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-900 shadow-sm">
          <h2 className="text-xl font-semibold">Read-only seed preview</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7">
            This form is being shown from the local seed data because the running Prisma client or
            database schema is not fully aligned with the latest loan-program form system. Apply the
            latest migration and restart the dev server to edit this form directly from the admin
            portal.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={form.formName} subtitle="Edit the launch form schema, destination, and success response without exposing secrets.">
      <FormDefinitionForm errorMessage={errorMessage} form={form} loanPrograms={loanPrograms} />
    </AdminShell>
  );
}
