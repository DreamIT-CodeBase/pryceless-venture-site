import { AdminShell } from "@/components/admin/admin-shell";
import { LoanProgramForm } from "@/components/admin/loan-program-form";
import { requireAdminSession } from "@/lib/authz";

export default async function NewLoanProgramPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const errorMessage = (await searchParams)?.error;

  return (
    <AdminShell
      title="New Loan Program"
      subtitle="Create a financing program and publish it when the rates, terms, and application flow are ready."
    >
      <LoanProgramForm
        errorMessage={errorMessage}
        loanProgram={{
          forms: [],
          isActive: true,
          sortOrder: 0,
        }}
      />
    </AdminShell>
  );
}
