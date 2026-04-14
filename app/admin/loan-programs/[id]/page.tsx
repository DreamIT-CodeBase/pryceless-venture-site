import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { LoanProgramForm } from "@/components/admin/loan-program-form";
import { requireAdminSession } from "@/lib/authz";
import { getLoanProgramAdmin } from "@/lib/data/admin";

export default async function EditLoanProgramPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const loanProgram = await getLoanProgramAdmin(id);
  const errorMessage = (await searchParams)?.error;

  if (!loanProgram) {
    notFound();
  }

  return (
    <AdminShell
      title={loanProgram.title}
      subtitle="Update financing terms, visibility, imagery, and linked application workflows."
    >
      <LoanProgramForm errorMessage={errorMessage} loanProgram={loanProgram} />
    </AdminShell>
  );
}
