import { AdminShell } from "@/components/admin/admin-shell";
import { FormDefinitionForm } from "@/components/admin/form-definition-form";
import { requireAdminSession } from "@/lib/authz";
import { getLoanProgramsForSelect } from "@/lib/data/admin";

export default async function NewFormPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const [loanPrograms, params] = await Promise.all([
    getLoanProgramsForSelect(),
    searchParams,
  ]);

  return (
    <AdminShell title="New Form" subtitle="Create a new CMS-controlled form, define its fields, and optionally link it to a loan program.">
      <FormDefinitionForm
        errorMessage={params?.error}
        form={{
          destination: "EMAIL",
          fields: [],
          formName: "",
          isActive: true,
          successMessage: "Thank you. Our team will follow up shortly.",
        }}
        loanPrograms={loanPrograms}
      />
    </AdminShell>
  );
}
