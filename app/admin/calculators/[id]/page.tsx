import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CalculatorForm } from "@/components/admin/calculator-form";
import { requireAdminSession } from "@/lib/authz";
import { getCalculatorAdmin } from "@/lib/data/admin";

export default async function EditCalculatorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const calculator = await getCalculatorAdmin(id);
  const errorMessage = (await searchParams)?.error;
  if (!calculator) notFound();

  return (
    <AdminShell title={calculator.title} subtitle="Keep the calculator description and disclaimer ready for launch.">
      <CalculatorForm calculator={calculator} errorMessage={errorMessage} />
    </AdminShell>
  );
}
