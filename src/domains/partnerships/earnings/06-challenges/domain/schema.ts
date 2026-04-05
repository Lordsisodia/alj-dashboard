import { z } from "zod";
import type { ChallengeAction, EarningsChallenge } from "../data/earningsChallenges";

export const ChallengeActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  completed: z.boolean(),
});

export const EarningsChallengeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  reward: z.string(),
  rewardDetails: z.string().optional(),
  type: z.enum(["solo", "team"]),
  points: z.number().nonnegative(),
  progress: z.number().min(0).max(100),
  deadline: z.string(),
  status: z.enum(["active", "upcoming", "completed"]),
  actions: z.array(ChallengeActionSchema),
  teamName: z.string().optional(),
  teammates: z.array(z.string()).optional(),
  region: z.string().optional(),
});

export const EarningsChallengesSchema = z.array(EarningsChallengeSchema);

export function parseChallengeActions(data: unknown): ChallengeAction[] {
  return z.array(ChallengeActionSchema).parse(data);
}

export function parseEarningsChallenges(data: unknown): EarningsChallenge[] {
  return EarningsChallengesSchema.parse(data);
}
