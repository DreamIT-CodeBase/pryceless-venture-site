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
    <AdminShell title="New Case Study" subtitle="Create a case study draft, upload Azure Blob images, and choose the primary profile image.">
      <CaseStudyForm errorMessage={errorMessage} />
    </AdminShell>
  );
}
