import { singletonPageSeed } from "@/lib/content-blueprint";

type SingletonPageItemLike = {
  body?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  groupKey: string;
  title: string;
};

type SingletonPageLike = {
  ctaHref?: string | null;
  ctaLabel?: string | null;
  disclaimer?: string | null;
  intro?: string | null;
  items: SingletonPageItemLike[];
  key: string;
  pageTitle: string;
  routePath: string;
};

const getSingletonPageSeedByKey = (key: string) =>
  singletonPageSeed.find((page) => page.key === key) ?? null;

const getItemKey = (item: SingletonPageItemLike) =>
  `${item.groupKey}::${item.title}::${item.body ?? ""}`;

export const mergeSingletonPageWithSeed = <
  T extends Partial<SingletonPageLike> & { key?: string; items?: SingletonPageItemLike[] },
>(
  page: T | null,
  key: string,
) => {
  const seed = getSingletonPageSeedByKey(key);

  if (!page && !seed) {
    return null;
  }

  if (!seed) {
    return page;
  }

  const existingItems = page?.items ?? [];
  const existingItemKeys = new Set(existingItems.map(getItemKey));
  const mergedItems = [
    ...existingItems,
    ...seed.items.filter((item) => !existingItemKeys.has(getItemKey(item))),
  ];

  return {
    ...seed,
    ...page,
    ctaHref: page?.ctaHref ?? seed.ctaHref ?? null,
    ctaLabel: page?.ctaLabel ?? seed.ctaLabel ?? null,
    disclaimer: page?.disclaimer ?? seed.disclaimer ?? null,
    intro: page?.intro ?? seed.intro ?? null,
    items: mergedItems,
    key: page?.key ?? seed.key,
    pageTitle: page?.pageTitle ?? seed.pageTitle,
    routePath: page?.routePath ?? seed.routePath,
  };
};

export const mergeSingletonPageListWithSeed = <
  T extends Partial<SingletonPageLike> & { key?: string; items?: SingletonPageItemLike[] },
>(
  pages: T[],
) => {
  const pageMap = new Map(
    pages
      .filter((page) => page.key)
      .map((page) => [page.key as string, page]),
  );

  const mergedSeedPages = singletonPageSeed.map((seedPage) =>
    mergeSingletonPageWithSeed(pageMap.get(seedPage.key) ?? null, seedPage.key),
  );
  const extraPages = pages.filter(
    (page) => page.key && !singletonPageSeed.some((seedPage) => seedPage.key === page.key),
  );

  return [...mergedSeedPages, ...extraPages].sort((left, right) =>
    String(left?.routePath ?? "").localeCompare(String(right?.routePath ?? "")),
  );
};
