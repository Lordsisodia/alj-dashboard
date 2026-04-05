import { z } from "zod";

export const PartnerProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  location: z.string().optional(),
  avatar: z.string().optional(),
  status: z.string().optional(),
});

export const HelpArticleSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional(),
  body: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const HelpCollectionSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  articles: z.array(HelpArticleSchema),
});

export const PartnerDirectorySchema = z.array(PartnerProfileSchema);
export const HelpCollectionsSchema = z.array(HelpCollectionSchema);

export type PartnerProfileDto = z.infer<typeof PartnerProfileSchema>;
export type HelpCollectionDto = z.infer<typeof HelpCollectionSchema>;
