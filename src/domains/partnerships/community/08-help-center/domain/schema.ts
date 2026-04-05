import { z } from "zod";

export const HelpArticleSectionSchema = z.object({
  heading: z.string().optional(),
  body: z.array(z.string()),
  icon: z.enum(["clock", "sparkles", "credit-card", "edit"]).optional(),
});

export const HelpArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  lastUpdated: z.string(),
  sections: z.array(HelpArticleSectionSchema),
  tags: z.array(z.string()).optional(),
});

export const HelpCollectionSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.enum(["life-buoy", "credit-card", "sparkles", "shield-check", "bar-chart", "users", "bell"]),
  articles: z.array(HelpArticleSchema),
});

export const HelpCollectionsSchema = z.array(HelpCollectionSchema);

export type HelpArticleSection = z.infer<typeof HelpArticleSectionSchema>;
export type HelpArticle = z.infer<typeof HelpArticleSchema>;
export type HelpCollection = z.infer<typeof HelpCollectionSchema>;
