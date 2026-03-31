import { AdminShell } from "@/components/admin/admin-shell";
import { CalculatorForm } from "@/components/admin/calculator-form";
import { requireAdminSession } from "@/lib/authz";

export default async function NewCalculatorPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const errorMessage = (await searchParams)?.error;

  return (
    <AdminShell title="New Calculator" subtitle="Create a calculator record with launch copy and disclaimers.">
      <CalculatorForm errorMessage={errorMessage} />
    </AdminShell>
  );
}
