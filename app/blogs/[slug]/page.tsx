import Image from "next/image";
import { notFound } from "next/navigation";

import {
  DetailBreadcrumbs,
  DetailGlassPanel,
  DetailPageCanvas,
  DetailSection,
  DetailSectionHeading,
  detailPrimaryButtonClassName,
  detailSecondaryButtonClassName,
} from "@/components/public/slug-detail-ui";
import { SiteShell } from "@/components/public/site-shell";
import {
  formatBlogCategoryLabel,
  formatBlogDate,
  getBlogImageAlt,
  getBlogImageSource,
  splitBlogParagraphs,
} from "@/lib/blog-content";
import { getPublishedBlogPost } from "@/lib/data/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blogPost = await getPublishedBlogPost(slug);

  if (!blogPost) {
    notFound();
  }

  const paragraphs = splitBlogParagraphs(blogPost.content);
  const publishedLabel = formatBlogDate(blogPost.publishedAt);

  return (
    <SiteShell cta={{ href: "/get-financing", label: "Apply Now" }}>
      <DetailPageCanvas>
        <DetailSection className="pb-14 pt-10 sm:pt-12 lg:pb-18 lg:pt-14">
          <DetailBreadcrumbs currentLabel={blogPost.title} href="/blogs" hrefLabel="Insights" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,720px)_minmax(360px,500px)] lg:items-start lg:gap-12">
            <div className="max-w-[760px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-[rgba(191,147,117,0.28)] bg-[rgba(255,249,241,0.96)] px-4 py-2 text-[12px] font-medium tracking-[0.01em] text-[#18314b]">
                  {formatBlogCategoryLabel(blogPost.category)}
                </span>
                {publishedLabel ? (
                  <span className="text-[13px] font-medium text-slate-500">{publishedLabel}</span>
                ) : null}
                {blogPost.readTime ? (
                  <span className="text-[13px] font-medium text-slate-500">{blogPost.readTime}</span>
                ) : null}
              </div>

              <h1 className="mt-5 text-balance text-[34px] font-medium leading-[1.02] tracking-[-0.05em] text-[#111827] sm:text-[46px] lg:text-[56px]">
                {blogPost.title}
              </h1>

              <p className="mt-8 max-w-[720px] text-[17px] leading-[1.85] text-slate-700">
                {blogPost.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a className={detailPrimaryButtonClassName} href="/get-financing">
                  Apply Now
                </a>
                <a className={detailSecondaryButtonClassName} href="/blogs">
                  Back to Insights
                </a>
              </div>

              {blogPost.authorName ? (
                <p className="mt-8 text-[14px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  By {blogPost.authorName}
                </p>
              ) : null}
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.38)]">
              <Image
                alt={getBlogImageAlt(blogPost)}
                className="object-cover"
                fill
                sizes="(max-width: 1023px) 100vw, 500px"
                src={getBlogImageSource(blogPost)}
              />
            </div>
          </div>
        </DetailSection>

        <DetailSection className="pb-14 lg:pb-20">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <DetailGlassPanel>
              <DetailSectionHeading
                eyebrow="Article"
                title="Read the full insight"
                body="The content below is managed from the admin portal and publishes to its own slug page automatically."
              />
              <div className="mt-6 space-y-5 text-[16px] leading-[1.9] text-slate-700">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </DetailGlassPanel>

            <div className="grid gap-6 lg:sticky lg:top-[96px] lg:self-start">
              <DetailGlassPanel>
                <DetailSectionHeading eyebrow="Article Meta" title="Quick details" />
                <div className="mt-5 space-y-4 text-[15px] leading-[1.8] text-slate-700">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">
                      Category
                    </p>
                    <p className="mt-2">{formatBlogCategoryLabel(blogPost.category)}</p>
                  </div>
                  {publishedLabel ? (
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">
                        Published
                      </p>
                      <p className="mt-2">{publishedLabel}</p>
                    </div>
                  ) : null}
                  {blogPost.readTime ? (
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#bf9375]">
                        Read Time
                      </p>
                      <p className="mt-2">{blogPost.readTime}</p>
                    </div>
                  ) : null}
                </div>
              </DetailGlassPanel>

              <DetailGlassPanel>
                <DetailSectionHeading
                  eyebrow="Need Financing?"
                  title="Turn the next article into the next deal"
                  body="If you are planning an acquisition, refinance, or bridge scenario, move from research into the right financing program."
                />
                <div className="mt-5">
                  <a className={detailPrimaryButtonClassName} href="/get-financing">
                    Explore Loan Programs
                  </a>
                </div>
              </DetailGlassPanel>
            </div>
          </div>
        </DetailSection>
      </DetailPageCanvas>
    </SiteShell>
  );
}
