import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { PropertyForm } from "@/components/admin/property-form";
import { requireAdminSession } from "@/lib/authz";
import { getFormsForSelect, getPropertyAdmin } from "@/lib/data/admin";

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const [property, forms] = await Promise.all([getPropertyAdmin(id), getFormsForSelect()]);
  const errorMessage = (await searchParams)?.error;
  if (!property) notFound();

  return (
    <AdminShell title={property.title} subtitle="Update lifecycle status, highlights, inquiry forms, and the primary image.">
      <PropertyForm errorMessage={errorMessage} forms={forms} property={property} />
    </AdminShell>
  );
}
