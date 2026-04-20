import { NotFoundPageContent } from "@/components/public/not-found-page-content";
import { getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;

export default async function NotFound() {
  const page = await getSingletonPage("NOT_FOUND");

  return <NotFoundPageContent page={page} />;
}
