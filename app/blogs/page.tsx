import Image from "next/image";

import {
  StandardCollectionCardLink,
  ThreeUpCollectionGrid,
  standardCollectionButtonClassName,
} from "@/components/public/collection-card-layout";
import { EmptyCollectionCard } from "@/components/public/marketing-ui";
import { PageSectionHero } from "@/components/public/page-section-hero";
import { SiteShell } from "@/components/public/site-shell";
import {
  formatBlogCategoryLabel,
  formatBlogDate,
  getBlogImageAlt,
  getBlogImageSource,
  truncateBlogText,
} from "@/lib/blog-content";
import { getPublishedBlogPosts, getSingletonPage } from "@/lib/data/public";

export const revalidate = 300;
const legacyBlogsTitle = "Blogs";
const defaultInsightsTitle = "Insights";

export default async function BlogsPage() {
  const [page, blogPosts] = await Promise.all([
    getSingletonPage("BLOGS_INDEX"),
    getPublishedBlogPosts(18),
  ]);
  const pageTitle =
    page?.pageTitle === legacyBlogsTitle
      ? defaultInsightsTitle
      : page?.pageTitle ?? defaultInsightsTitle;

  return (
    <SiteShell cta={{ href: "/get-financing", label: "Apply Now" }}>
      <div className="pb-[92px]">
        <PageSectionHero
          currentLabel="Insights"
          intro={
            page?.intro ??
            "Read practical articles on financing strategy, borrower preparation, and the lending structures used across real estate deals."
          }
          title={pageTitle}
        />

        <section className="bg-white px-4 pt-[32px] sm:px-6 lg:px-0 lg:pt-[40px]" id="latest-blogs">
          <div className="mx-auto w-full max-w-[1480px] lg:px-[125px] 2xl:max-w-[1760px] 2xl:px-[164px]">
            <div className="mt-2 lg:mt-0">
              {blogPosts.length ? (
                <ThreeUpCollectionGrid
                  desktopCardWidth={330}
                  desktopGap={30}
                  wideDesktopCardWidth={420}
                  wideDesktopGap={28}
                >
                  {blogPosts.map((blogPost, index) => (
                    <StandardCollectionCardLink href={`/blogs/${blogPost.slug}`} key={blogPost.id}>
                      <div className="px-[15px] pt-[15px]">
                        <div className="relative h-[228px] overflow-hidden rounded-[18px] bg-[#eef4fb]">
                          <Image
                            alt={getBlogImageAlt(blogPost)}
                            className="object-cover"
                            fill
                            sizes="(max-width: 1023px) 100vw, 420px"
                            src={getBlogImageSource(blogPost, index)}
                          />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col px-[16px] pb-[18px] pt-[16px]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#18314b]">
                            {formatBlogCategoryLabel(blogPost.category)}
                          </span>
                          {formatBlogDate(blogPost.publishedAt) ? (
                            <span className="text-[12px] text-slate-500">
                              {formatBlogDate(blogPost.publishedAt)}
                            </span>
                          ) : null}
                        </div>

                        <h3
                          className="mt-5 text-[24px] font-semibold leading-[1.18] tracking-[-0.035em] text-[#131d36]"
                          style={{
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            display: "-webkit-box",
                            overflow: "hidden",
                          }}
                        >
                          {blogPost.title}
                        </h3>

                        <p className="mt-4 text-[14px] leading-[1.78] text-slate-600">
                          {truncateBlogText(blogPost.excerpt, 180)}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-slate-500">
                          {blogPost.authorName ? <span>{blogPost.authorName}</span> : null}
                          {blogPost.readTime ? <span>{blogPost.readTime}</span> : null}
                        </div>

                        <span className={`${standardCollectionButtonClassName} mt-[22px] max-w-[170px]`}>
                          Read Article
                        </span>
                      </div>
                    </StandardCollectionCardLink>
                  ))}
                </ThreeUpCollectionGrid>
              ) : (
                <EmptyCollectionCard message="Published blog posts will appear here after the admin team adds and publishes them." />
              )}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
