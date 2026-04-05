// @ts-nocheck
import { HelpCollectionsSchema, type HelpCollection, type HelpArticle } from "../domain/schema";

export function filterCollections(collections: HelpCollection[], query: string): HelpCollection[] {
  const value = query.trim().toLowerCase();
  if (!value) return collections;
  return collections.filter((collection) =>
    [collection.title, collection.description, collection.category]
      .concat(collection.articles.map((article) => `${article.title} ${article.summary ?? ""}`))
      .some((text) => (text ?? "").toLowerCase().includes(value)),
  );
}

export function searchArticles(collections: HelpCollection[], query: string): HelpArticle[] {
  const value = query.trim().toLowerCase();
  if (!value) return [];
  return collections.flatMap((collection) =>
    collection.articles.filter((article) => `${article.title} ${article.summary ?? ""}`.toLowerCase().includes(value)),
  );
}

export function safeParseCollections(data: unknown): HelpCollection[] {
  const parsed = HelpCollectionsSchema.safeParse(data);
  return parsed.success ? parsed.data : [];
}
