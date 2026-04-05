export const HELP_ROUTES = {
  base: "/partners/community/help",
  collection: (slug: string) => `/partners/community/help/${slug}`,
  article: (collection: string, slug: string) => `/partners/community/help/${collection}/${slug}`,
} as const;
