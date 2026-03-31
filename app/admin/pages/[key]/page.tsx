import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { SingletonPageForm } from "@/components/admin/singleton-page-form";
import { requireAdminSession } from "@/lib/authz";
import { getSingletonPageAdmin } from "@/lib/data/admin";
import { singletonPageLabels } from "@/lib/content-blueprint";

export default async function EditSingletonPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  await requireAdminSession();
  const { key } = await params;
  const page = await getSingletonPageAdmin(key);
  if (!page) notFound();

  return (
    <AdminShell title={singletonPageLabels[key] ?? page.pageTitle} subtitle={`Edit the seeded content for ${page.routePath}.`}>
      <SingletonPageForm page={page} />
    </AdminShell>
  );
}
