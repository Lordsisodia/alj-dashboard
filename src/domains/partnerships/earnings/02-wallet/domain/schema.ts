import { z } from "zod";
import type {
  ComplianceItem,
  LedgerEntry,
  PaymentMethod,
  PayoutHistoryEntry,
  PayoutSchedule,
  WalletSummary,
} from "../data/walletData";

export const LedgerEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string(),
  type: z.enum(["earnings", "bonus", "deduction"]),
  amount: z.string(),
  status: z.enum(["released", "hold", "processing"]),
  note: z.string().optional(),
});

export const PaymentMethodSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["stripe", "bank", "crypto"]),
  ending: z.string(),
  status: z.enum(["active", "needs_sync", "draft"]),
  lastSync: z.string(),
});

export const ComplianceItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  progress: z.number().min(0).max(100),
  actionLabel: z.string().optional(),
});

export const WalletSummarySchema = z.object({
  balance: z.string(),
  currency: z.string().min(1),
  nextPayoutDate: z.string(),
  pendingWithdrawal: z.string(),
  connected: z.array(z.string()),
});

export const PayoutHistoryEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  source: z.string(),
  amount: z.string(),
  status: z.enum(["paid", "hold", "processing"]),
});

export const PayoutScheduleSchema = z.object({
  cadence: z.string(),
  threshold: z.string(),
  nextCutoff: z.string(),
  pending: z.string(),
});

export const WalletSnapshotSchema = z.object({
  summary: WalletSummarySchema,
  ledger: z.array(LedgerEntrySchema),
  paymentMethods: z.array(PaymentMethodSchema),
  payoutSchedule: PayoutScheduleSchema,
  complianceChecklist: z.array(ComplianceItemSchema),
  payoutHistory: z.array(PayoutHistoryEntrySchema),
});

export type WalletSnapshot = z.infer<typeof WalletSnapshotSchema>;

export function parseLedgerEntries(data: unknown): LedgerEntry[] {
  return z.array(LedgerEntrySchema).parse(data);
}

export function parsePaymentMethods(data: unknown): PaymentMethod[] {
  return z.array(PaymentMethodSchema).parse(data);
}

export function parseComplianceChecklist(data: unknown): ComplianceItem[] {
  return z.array(ComplianceItemSchema).parse(data);
}

export function parseWalletSummary(data: unknown): WalletSummary {
  return WalletSummarySchema.parse(data);
}

export function parsePayoutHistory(data: unknown): PayoutHistoryEntry[] {
  return z.array(PayoutHistoryEntrySchema).parse(data);
}

export function parsePayoutSchedule(data: unknown): PayoutSchedule {
  return PayoutScheduleSchema.parse(data);
}

export function parseWalletSnapshot(data: unknown): WalletSnapshot {
  return WalletSnapshotSchema.parse(data);
}
