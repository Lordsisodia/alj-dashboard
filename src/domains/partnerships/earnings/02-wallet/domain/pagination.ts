import type { LedgerEntry } from "../data/walletData";

export function paginateLedger(entries: LedgerEntry[], page: number, pageSize: number): LedgerEntry[] {
  if (page < 1 || pageSize < 1) return [];
  const start = (page - 1) * pageSize;
  return entries.slice(start, start + pageSize);
}

export function formatLedgerAmount(entry: LedgerEntry): string {
  const sign = entry.type === "deduction" ? "-" : entry.amount.startsWith("-") ? "" : "";
  return `${sign}${entry.amount.replace(/^[-+]/, "")}`;
}
