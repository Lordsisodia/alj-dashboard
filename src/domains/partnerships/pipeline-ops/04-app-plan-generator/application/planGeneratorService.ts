import { withTimeout } from "../../shared/application/withTimeout";
import { PlanGeneratorSnapshotSchema, PlanInputSchema, PlanRecommendationSchema } from "../domain/schema";
import type { PlanInput, PlanRecommendation } from "../domain/schema";

export async function generatePlanRecommendations(input: PlanInput, timeoutMs = 2000): Promise<PlanRecommendation[]> {
  const validatedInput = PlanInputSchema.parse(input);

  const simulated = new Promise<PlanRecommendation[]>((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            id: "rec-1",
            title: "Refine ICP",
            description: `Focus on ${validatedInput.vertical} accounts with churn signals`,
            effort: "medium",
            impact: "high",
            etaDays: 14,
          },
          {
            id: "rec-2",
            title: "Launch nurture track",
            description: "Add 3-step nurture with proof links",
            effort: "low",
            impact: "medium",
            etaDays: 7,
          },
        ]),
      200,
    );
  });

  const recommendations = await withTimeout(simulated, timeoutMs, () => []);
  return recommendations.map((rec) => PlanRecommendationSchema.parse(rec));
}

export function buildPlanSnapshot(input: PlanInput, recommendations: PlanRecommendation[]) {
  return PlanGeneratorSnapshotSchema.parse({
    prompts: [],
    input,
    recommendations,
  });
}
