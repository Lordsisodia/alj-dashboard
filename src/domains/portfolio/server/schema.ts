import { z } from "zod";

export const PricingSchema = z.object({
  currency: z.string().nullable().optional(),
  min: z.number().nullable().optional(),
  max: z.number().nullable().optional(),
  sisoPrice: z.number().nullable().optional(),
});

export const TimelineSchema = z.object({
  durationDays: z.number().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const MetadataSchema = z.object({
  featured: z.boolean().optional().default(false),
  showInPortfolio: z.boolean().optional().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  industry: z.string().optional(),
});

export const TechStackSchema = z.object({
  frontend: z.array(z.string()).default([]),
  backend: z.array(z.string()).default([]),
  database: z.array(z.string()).default([]),
  hosting: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
});

export const MediaSchema = z.object({
  logo: z.string().optional(),
  hero: z.string().optional(),
  screenshots: z.object({
    desktop: z.array(z.string()).default([]),
    mobile: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
  }),
  videos: z.array(z.string()).optional(),
});

export const PortfolioClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string(),
  tagline: z.string().optional().default(""),
  description: z.string().optional().default(""),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  caseStudyUrl: z.string().optional(),
  projectType: z.string().optional().default("Website"),
  status: z.string().optional().default("Live"),
  launchDate: z.string().optional(),
  timeline: TimelineSchema.optional(),
  pricing: PricingSchema.optional(),
  features: z.object({
    key: z.array(z.string()).default([]),
    technical: z.array(z.string()).default([]),
    integrations: z.array(z.string()).default([]),
  }).optional(),
  techStack: TechStackSchema.optional().default({ frontend: [], backend: [], database: [], hosting: [], tools: [] }),
  marketAnalysis: z.any().optional(),
  aiAgents: z.any().optional(),
  results: z.any().optional(),
  testimonial: z.any().optional(),
  media: MediaSchema.optional(),
  pages: z.array(z.any()).optional(),
  pageLinks: z.array(z.any()).optional(),
  metadata: MetadataSchema.optional().default({}),
});

export const PortfolioIndexSchema = z.object({
  stats: z.any(),
  clients: z.array(PortfolioClientSchema).default([]),
});

export type PortfolioClientDto = z.infer<typeof PortfolioClientSchema>;
export type PortfolioIndexPayloadDto = z.infer<typeof PortfolioIndexSchema>;

