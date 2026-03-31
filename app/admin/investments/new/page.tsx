import { AdminShell } from "@/components/admin/admin-shell";
import { InvestmentForm } from "@/components/admin/investment-form";
import { requireAdminSession } from "@/lib/authz";
import { getFormsForSelect } from "@/lib/data/admin";

export default async function NewInvestmentPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const forms = await getFormsForSelect();
  const errorMessage = (await searchParams)?.error;

  return (
    <AdminShell title="New Investment" subtitle="Create a draft investment and connect the correct deal packet form.">
      <InvestmentForm errorMessage={errorMessage} forms={forms} />
    </AdminShell>
  );
}
