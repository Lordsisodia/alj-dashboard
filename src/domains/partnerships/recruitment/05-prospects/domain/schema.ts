import { z } from "zod";
import type { ProspectAttachment, ProspectTask, RecruitmentProspect } from "../ui/screens/types";

export const ProspectTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  due: z.string(),
  owner: z.string(),
  complete: z.boolean(),
});

export const ProspectAttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.string(),
});

export const RecruitmentProspectSchema = z.object({
  id: z.string(),
  candidateName: z.string(),
  email: z.string().email(),
  tier: z.string(),
  segment: z.enum(["potential", "onboarding", "active", "dormant"]),
  complianceStatus: z.enum(["pending", "cleared", "blocked"]),
  dealsClosed: z.number().int().nonnegative(),
  revenueToDate: z.number().nonnegative(),
  progress: z.number().min(0).max(1),
  referralSource: z.string(),
  mentor: z.string(),
  overrideBps: z.number().nonnegative(),
  inviteSentOn: z.string(),
  nextAction: z.string(),
  lastAction: z.string(),
  lastContactAgo: z.string(),
  timezone: z.string(),
  notes: z.array(z.string()),
  tasks: z.array(ProspectTaskSchema),
  attachments: z.array(ProspectAttachmentSchema),
});

export const RecruitmentProspectsSchema = z.array(RecruitmentProspectSchema);

export function parseRecruitmentProspects(data: unknown): RecruitmentProspect[] {
  return RecruitmentProspectsSchema.parse(data);
}

export function parseRecruitmentProspect(data: unknown): RecruitmentProspect {
  return RecruitmentProspectSchema.parse(data);
}

export function parseProspectTasks(data: unknown): ProspectTask[] {
  return z.array(ProspectTaskSchema).parse(data);
}

export function parseProspectAttachments(data: unknown): ProspectAttachment[] {
  return z.array(ProspectAttachmentSchema).parse(data);
}
