import Link from "next/link";

import {
  autosaveBlogPostDraft,
  deleteBlogPost,
  saveBlogPost,
} from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";
import { ImageUrlField } from "@/components/admin/image-url-field";

const formatDateInputValue = (value: Date | string | null | undefined) => {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

export function BlogPostForm({
  blogPost,
  errorMessage,
}: {
  blogPost?: any;
  errorMessage?: string;
}) {
  return (
    <div className="space-y-6">
      <AdminAutosaveForm
        autosaveAction={autosaveBlogPostDraft}
        className="space-y-6"
        initialRecordId={blogPost?.id ?? ""}
        submitAction={saveBlogPost}
      >
        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={blogPost?.title ?? ""}
                minLength={2}
                name="title"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={blogPost?.category ?? ""}
                name="category"
                placeholder="Financing Strategy"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Read Time</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={blogPost?.readTime ?? ""}
                name="readTime"
                placeholder="5 min read"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Author Name</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={blogPost?.authorName ?? ""}
                name="authorName"
                placeholder="Pryceless Ventures Team"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Published Date</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={formatDateInputValue(blogPost?.publishedAt)}
                name="publishedAt"
                type="date"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Excerpt</span>
              <textarea
                className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={blogPost?.excerpt ?? ""}
                minLength={10}
                name="excerpt"
                placeholder="Write the short summary that appears on cards, the blogs page, and the footer feed."
                required
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Full Article</span>
              <textarea
                className="min-h-[280px] w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={blogPost?.content ?? ""}
                minLength={10}
                name="content"
                placeholder="Use blank lines between paragraphs so the public article page formats the content cleanly."
                required
              />
            </label>

            <ImageUrlField
              description="Upload the featured image used on the blog cards, detail page hero, and financing carousel."
              folder="blogs"
              initialValue={blogPost?.featuredImageUrl}
              label="Featured Image"
              name="featuredImageUrl"
              previewAlt={blogPost?.title ?? "Blog featured image"}
            />

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Image Alt Text</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={blogPost?.featuredImageAlt ?? ""}
                name="featuredImageAlt"
                placeholder="Describe the featured image for accessibility."
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="draft">
            Save Draft
          </button>
          <button className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="publish">
            Publish
          </button>
          <button className="rounded-full border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800" name="intent" type="submit" value="archive">
            Archive
          </button>
          <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/blogs">
            Back to List
          </Link>
        </div>
      </AdminAutosaveForm>

      {blogPost?.id ? (
        <form action={deleteBlogPost}>
          <input name="recordId" type="hidden" value={blogPost.id} />
          <button className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700" type="submit">
            Delete Blog Post
          </button>
        </form>
      ) : null}
    </div>
  );
}
