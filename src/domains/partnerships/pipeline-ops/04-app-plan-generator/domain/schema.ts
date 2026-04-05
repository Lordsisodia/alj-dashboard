import { z } from "zod";

export const PlanPromptSchema = z.object({
  id: z.string(),
  question: z.string(),
  helper: z.string().optional(),
  field: z.string(),
  required: z.boolean().default(true),
});

export const PlanInputSchema = z.object({
  companyName: z.string(),
  vertical: z.string(),
  painPoint: z.string(),
  goals: z.array(z.string()).min(1),
  timeline: z.string().optional(),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
});

export const PlanRecommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  effort: z.enum(["low", "medium", "high"]),
  impact: z.enum(["low", "medium", "high"]),
  owner: z.string().optional(),
  etaDays: z.number().int().positive().optional(),
});

export const PlanGeneratorSnapshotSchema = z.object({
  prompts: z.array(PlanPromptSchema),
  recommendations: z.array(PlanRecommendationSchema).optional(),
  input: PlanInputSchema.optional(),
});

export type PlanInput = z.infer<typeof PlanInputSchema>;
export type PlanRecommendation = z.infer<typeof PlanRecommendationSchema>;

export function parsePlanPrompts(data: unknown) {
  return z.array(PlanPromptSchema).parse(data);
}

export function parsePlanInput(data: unknown): PlanInput {
  return PlanInputSchema.parse(data);
}

export function parsePlanRecommendations(data: unknown): PlanRecommendation[] {
  return z.array(PlanRecommendationSchema).parse(data);
}

export function parsePlanGeneratorSnapshot(data: unknown) {
  return PlanGeneratorSnapshotSchema.parse(data);
}
