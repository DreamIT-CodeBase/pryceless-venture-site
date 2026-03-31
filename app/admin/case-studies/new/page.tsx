import { AdminShell } from "@/components/admin/admin-shell";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import { requireAdminSession } from "@/lib/authz";

export default async function NewCaseStudyPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const errorMessage = (await searchParams)?.error;

  return (
    <AdminShell title="New Case Study" subtitle="Create a case study draft with asset profile and key takeaways.">
      <CaseStudyForm errorMessage={errorMessage} />
    </AdminShell>
  );
}
