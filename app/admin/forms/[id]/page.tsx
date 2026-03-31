import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { FormDefinitionForm } from "@/components/admin/form-definition-form";
import { requireAdminSession } from "@/lib/authz";
import { getFormAdmin } from "@/lib/data/admin";

export default async function EditFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const form = await getFormAdmin(id);
  const errorMessage = (await searchParams)?.error;
  if (!form) notFound();

  return (
    <AdminShell title={form.formName} subtitle="Edit the launch form schema, destination, and success response without exposing secrets.">
      <FormDefinitionForm errorMessage={errorMessage} form={form} />
    </AdminShell>
  );
}
