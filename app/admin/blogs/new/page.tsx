import { AdminShell } from "@/components/admin/admin-shell";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { requireAdminSession } from "@/lib/authz";

export default async function NewBlogPostPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const errorMessage = (await searchParams)?.error;

  return (
    <AdminShell
      title="New Blog Post"
      subtitle="Create a blog article, upload the featured image, and publish content that auto-feeds the footer and financing carousel."
    >
      <BlogPostForm errorMessage={errorMessage} />
    </AdminShell>
  );
}
