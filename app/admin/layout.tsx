import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { AdminFlashToast } from "@/components/admin/admin-flash-toast";
import type { AdminFlash } from "@/lib/admin-flash";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const flashCookie = (await cookies()).get("pv-admin-flash")?.value;
  let initialFlash: AdminFlash | null = null;

  if (flashCookie) {
    try {
      initialFlash = JSON.parse(decodeURIComponent(flashCookie)) as AdminFlash;
    } catch {
      initialFlash = null;
    }
  }

  return (
    <>
      <AdminFlashToast initialFlash={initialFlash} />
      {children}
    </>
  );
}
