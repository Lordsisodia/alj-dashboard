import { z } from "zod";
import type { TeamMember, TeamMemberAction, TeamMemberTraining } from "../data/team/members";

export const TeamMemberActionSchema = z.object({
  id: z.string(),
  title: z.string(),
  due: z.string(),
  owner: z.string(),
  type: z.enum(["coaching", "compliance", "pipeline"]),
});

export const TeamMemberTrainingSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(["clear", "due", "blocked"]),
  detail: z.string(),
});

export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  tier: z.string(),
  activity: z.string(),
  status: z.string(),
  focus: z.string(),
  coverage: z.string(),
  timezone: z.string(),
  invitesThisMonth: z.number().int().nonnegative(),
  referralsYtd: z.number().int().nonnegative(),
  liveDeals: z.number().int().nonnegative(),
  readiness: z.string(),
  mentorStatus: z.string(),
  bio: z.string(),
  actions: z.array(TeamMemberActionSchema),
  training: z.array(TeamMemberTrainingSchema),
  achievements: z.array(z.string()),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    slack: z.string(),
  }),
});

export const TeamMembersSchema = z.array(TeamMemberSchema);

export function parseTeamMembers(data: unknown): TeamMember[] {
  return TeamMembersSchema.parse(data);
}

export function parseTeamMemberActions(data: unknown): TeamMemberAction[] {
  return z.array(TeamMemberActionSchema).parse(data);
}

export function parseTeamMemberTraining(data: unknown): TeamMemberTraining[] {
  return z.array(TeamMemberTrainingSchema).parse(data);
}

export type TeamMemberParsed = z.infer<typeof TeamMemberSchema>;
