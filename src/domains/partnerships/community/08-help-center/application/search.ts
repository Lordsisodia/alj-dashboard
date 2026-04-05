import { HelpCollectionsSchema, type HelpArticle } from "../domain/schema";

export type HelpSearchResult = {
  article: HelpArticle;
  collectionSlug: string;
};

export function searchHelpCollections(rawCollections: unknown, query: string): HelpSearchResult[] {
  const collections = HelpCollectionsSchema.parse(rawCollections);
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return collections.flatMap((collection) =>
    collection.articles
      .filter((article) =>
        [article.title, article.summary, ...(article.tags ?? []), ...(article.sections?.flatMap((s) => s.body) ?? [])]
          .filter(Boolean)
          .some((text) => text.toLowerCase().includes(term)),
      )
      .map((article) => ({ article, collectionSlug: collection.slug })),
  );
}
