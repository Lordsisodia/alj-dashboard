import { describe, expect, it } from "vitest";
import {
  complianceChecklist,
  ledgerEntries,
  paymentMethods,
  payoutHistory,
  payoutSchedule,
  walletSummary,
} from "../../data/walletData";
import {
  LedgerEntrySchema,
  PaymentMethodSchema,
  parseWalletSnapshot,
} from "../schema";

describe("wallet schemas", () => {
  it("parses the full wallet snapshot", () => {
    const parsed = parseWalletSnapshot({
      summary: walletSummary,
      ledger: ledgerEntries,
      paymentMethods,
      payoutSchedule,
      complianceChecklist,
      payoutHistory,
    });

    expect(parsed.summary.balance).toBe("$18,420");
    expect(parsed.ledger).toHaveLength(4);
    expect(parsed.paymentMethods[0].status).toBe("active");
  });

  it("rejects unsupported ledger status", () => {
    const bad = { ...ledgerEntries[0], status: "paused" } as unknown;
    expect(() => LedgerEntrySchema.parse(bad)).toThrow();
  });

  it("rejects invalid payment method type", () => {
    const bad = { ...paymentMethods[0], type: "cash" } as unknown;
    expect(() => PaymentMethodSchema.parse(bad)).toThrow();
  });
});
