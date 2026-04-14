import Link from "next/link";

import { deleteBlogPost } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusPill } from "@/components/admin/status-pill";
import { requireAdminSession } from "@/lib/authz";
import { formatBlogDate } from "@/lib/blog-content";
import { getBlogPostsAdmin } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AdminBlogsPage() {
  await requireAdminSession();
  const blogPosts = await getBlogPostsAdmin();

  return (
    <AdminShell
      title="Blogs"
      subtitle="Manage public blog articles, featured images, publishing dates, and the content that feeds the footer and financing carousel."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center self-start rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700 shadow-sm shadow-violet-100/70">
          {blogPosts.length} records
        </div>
        <Link className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white shadow-lg shadow-slate-300/30 transition hover:-translate-y-0.5 hover:!text-white visited:!text-white" href="/admin/blogs/new">
          New Blog Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-lg shadow-slate-200/50">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Lifecycle</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Published</th>
              <th className="px-6 py-4 font-medium">Updated</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {blogPosts.map((blogPost) => {
              const isSeedFallback = Boolean(blogPost.isSeedFallback);
              const publishedLabel = formatBlogDate(blogPost.publishedAt) ?? "Not set";

              return (
                <tr className="transition-colors hover:bg-slate-50/80" key={blogPost.id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {isSeedFallback ? (
                        <span className="font-semibold text-slate-900">{blogPost.title}</span>
                      ) : (
                        <Link className="font-semibold text-slate-900 transition hover:text-violet-700" href={`/admin/blogs/${blogPost.id}`}>
                          {blogPost.title}
                        </Link>
                      )}
                      {isSeedFallback ? (
                        <span className="text-xs text-amber-700">
                          Seed fallback preview until the blog schema is active.
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <AdminStatusPill value={blogPost.lifecycleStatus} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">{blogPost.category}</td>
                  <td className="px-6 py-4 text-slate-600">{publishedLabel}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDateTime(blogPost.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {isSeedFallback ? (
                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
                          Read only
                        </span>
                      ) : (
                        <>
                          <Link
                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                            href={`/admin/blogs/${blogPost.id}`}
                          >
                            Edit
                          </Link>
                          <form action={deleteBlogPost}>
                            <input name="recordId" type="hidden" value={blogPost.id} />
                            <button
                              className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100"
                              type="submit"
                            >
                              Delete
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
