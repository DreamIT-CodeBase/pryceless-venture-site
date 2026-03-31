import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { InvestmentForm } from "@/components/admin/investment-form";
import { requireAdminSession } from "@/lib/authz";
import { getFormsForSelect, getInvestmentAdmin } from "@/lib/data/admin";

export default async function EditInvestmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const [investment, forms] = await Promise.all([getInvestmentAdmin(id), getFormsForSelect()]);
  const errorMessage = (await searchParams)?.error;
  if (!investment) notFound();

  return (
    <AdminShell title={investment.title} subtitle="Update lifecycle status, highlights, deal packet form selection, and the primary image.">
      <InvestmentForm errorMessage={errorMessage} forms={forms} investment={investment} />
    </AdminShell>
  );
}
