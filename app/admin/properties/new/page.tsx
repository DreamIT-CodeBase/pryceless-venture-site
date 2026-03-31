import { AdminShell } from "@/components/admin/admin-shell";
import { PropertyForm } from "@/components/admin/property-form";
import { requireAdminSession } from "@/lib/authz";
import { getFormsForSelect } from "@/lib/data/admin";

export default async function NewPropertyPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const forms = await getFormsForSelect();
  const errorMessage = (await searchParams)?.error;

  return (
    <AdminShell title="New Property" subtitle="Create a draft property, attach an inquiry form, and upload media.">
      <PropertyForm errorMessage={errorMessage} forms={forms} />
    </AdminShell>
  );
}
