type BlogImageSource = string;

type BlogImageLike = {
  slug?: string | null;
  title?: string | null;
  featuredImageAlt?: string | null;
  featuredImageUrl?: string | null;
};

const fallbackImages: BlogImageSource[] = [
  "https://images.pexels.com/photos/8293779/pexels-photo-8293779.jpeg?cs=srgb&dl=pexels-rdne-8293779.jpg&fm=jpg",
  "https://images.pexels.com/photos/8292879/pexels-photo-8292879.jpeg?cs=srgb&dl=pexels-rdne-8292879.jpg&fm=jpg",
  "https://images.pexels.com/photos/7599735/pexels-photo-7599735.jpeg?cs=srgb&dl=pexels-freestockpro-7599735.jpg&fm=jpg",
  "https://images.pexels.com/photos/27641056/pexels-photo-27641056.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-27641056.jpg&fm=jpg",
  "https://images.pexels.com/photos/31424880/pexels-photo-31424880.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-31424880.jpg&fm=jpg",
  "https://images.pexels.com/photos/34135038/pexels-photo-34135038.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-34135038.jpg&fm=jpg",
];

const fallbackImageBySlug: Record<string, BlogImageSource> = {
  "bridge-loans-explained-for-real-estate-investors":
    "https://images.pexels.com/photos/8293779/pexels-photo-8293779.jpeg?cs=srgb&dl=pexels-rdne-8293779.jpg&fm=jpg",
  "how-dscr-loans-help-build-a-rental-portfolio":
    "https://images.pexels.com/photos/7599735/pexels-photo-7599735.jpeg?cs=srgb&dl=pexels-freestockpro-7599735.jpg&fm=jpg",
  "fix-and-flip-financing-what-lenders-look-for":
    "https://images.pexels.com/photos/31424880/pexels-photo-31424880.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-31424880.jpg&fm=jpg",
  "when-to-refinance-an-investment-property":
    "https://images.pexels.com/photos/27641056/pexels-photo-27641056.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-27641056.jpg&fm=jpg",
  "how-to-prepare-a-loan-package-that-gets-faster-approvals":
    "https://images.pexels.com/photos/8292879/pexels-photo-8292879.jpeg?cs=srgb&dl=pexels-rdne-8292879.jpg&fm=jpg",
  "choosing-between-bridge-rental-and-refinance-loans":
    "https://images.pexels.com/photos/34135038/pexels-photo-34135038.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-34135038.jpg&fm=jpg",
};

export const getBlogImageSource = (blog: BlogImageLike, index = 0): BlogImageSource =>
  blog.featuredImageUrl?.trim() ||
  (blog.slug ? fallbackImageBySlug[blog.slug] : undefined) ||
  fallbackImages[index % fallbackImages.length];

export const getBlogImageAlt = (blog: BlogImageLike) =>
  blog.featuredImageAlt?.trim() || blog.title?.trim() || "Pryceless Ventures blog article";

export const formatBlogCategoryLabel = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

export const formatBlogDate = (value: Date | string | null | undefined) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const splitBlogParagraphs = (value: string | null | undefined) =>
  String(value ?? "")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

export const truncateBlogText = (value: string | null | undefined, limit: number) => {
  const safeValue = String(value ?? "").trim();

  if (safeValue.length <= limit) {
    return safeValue;
  }

  return `${safeValue.slice(0, limit).trim()}...`;
};
