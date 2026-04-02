import { AdminShell } from "@/components/admin/admin-shell";
import { HomePageForm } from "@/components/admin/home-page-form";
import { requireAdminSession } from "@/lib/authz";
import { getHomePageAdmin } from "@/lib/data/admin";

export default async function HomeAdminPage() {
  await requireAdminSession();
  const homePage = await getHomePageAdmin();

  return (
    <AdminShell title="Home Page" subtitle="Edit the hero, why section, metrics, segments, platform cards, portfolio, case highlights, and testimonials.">
      <HomePageForm homePage={homePage} />
    </AdminShell>
  );
}
