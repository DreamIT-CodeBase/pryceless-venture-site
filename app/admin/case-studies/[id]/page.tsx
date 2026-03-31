import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import { requireAdminSession } from "@/lib/authz";
import { getCaseStudyAdmin } from "@/lib/data/admin";

export default async function EditCaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const caseStudy = await getCaseStudyAdmin(id);
  const errorMessage = (await searchParams)?.error;
  if (!caseStudy) notFound();

  return (
    <AdminShell title={caseStudy.title} subtitle="Keep the qualitative narrative and structured case study sections aligned.">
      <CaseStudyForm caseStudy={caseStudy} errorMessage={errorMessage} />
    </AdminShell>
  );
}
