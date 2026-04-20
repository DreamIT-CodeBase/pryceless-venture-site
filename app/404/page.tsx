import type { Metadata } from "next";

import { NotFoundPageContent } from "@/components/public/not-found-page-content";
import { getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: "404",
};

export default async function NotFoundPreviewPage() {
  const page = await getSingletonPage("NOT_FOUND");

  return <NotFoundPageContent page={page} />;
}
