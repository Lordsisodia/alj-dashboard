import { z } from "zod";

const balanceToNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const numeric = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
  }
  return 0;
};

export const HubWalletSummarySchema = z.object({
  balance: z.preprocess(balanceToNumber, z.number().min(0).default(0)),
  currency: z.string().default("USD"),
});

export const HubEarningsSchema = z.object({
  walletSummary: HubWalletSummarySchema,
  ledgerEntries: z.array(z.any()).default([]),
  complianceChecklist: z.array(z.any()).default([]),
});

export const HubPipelineSchema = z.object({
  prospectCount: z.number().int().nonnegative().default(0),
});

export const HubWorkspaceTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
});

export const HubWorkspaceSchema = z.object({
  tasks: z.array(HubWorkspaceTaskSchema).default([]),
});

export const HubTierSchema = z.object({
  tierMeta: z.preprocess(
    (value) => (Array.isArray(value) ? value : value ? [value] : []),
    z.array(z.any()).default([]),
  ),
  tierMetrics: z.array(z.any()).default([]),
});

export const HubDashboardSchema = z.object({
  earnings: HubEarningsSchema,
  pipeline: HubPipelineSchema,
  workspace: HubWorkspaceSchema,
  tier: HubTierSchema,
});

export type HubDashboard = z.infer<typeof HubDashboardSchema>;
