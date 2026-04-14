import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { requireAdminSession } from "@/lib/authz";
import { getBlogPostAdmin } from "@/lib/data/admin";

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const blogPost = await getBlogPostAdmin(id);
  const errorMessage = (await searchParams)?.error;

  if (!blogPost) {
    notFound();
  }

  if (blogPost.isSeedFallback) {
    return (
      <AdminShell title={blogPost.title} subtitle="Blog schema fallback">
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-900 shadow-sm">
          <h2 className="text-xl font-semibold">Read-only seed preview</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7">
            This blog post is being shown from the local seed data because the running Prisma client
            or database schema does not yet expose the <code>BlogPost</code> model. Apply the latest
            migration and restart the dev server to edit blogs from the admin portal.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={blogPost.title}
      subtitle="Update article content, publishing date, and featured imagery for the public blog experience."
    >
      <BlogPostForm blogPost={blogPost} errorMessage={errorMessage} />
    </AdminShell>
  );
}
