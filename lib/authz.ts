import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const getAdminSession = async () => {
  const session = await auth();
  return session?.user?.isAdmin ? session : null;
};

export const requireAdminSession = async () => {
  const session = await getAdminSession();
  if (!session?.user?.adminId) {
    redirect("/admin/login");
  }
  return session;
};
