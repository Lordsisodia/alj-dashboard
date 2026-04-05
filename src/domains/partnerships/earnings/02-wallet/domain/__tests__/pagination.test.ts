// @ts-nocheck
// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ledgerEntries } from "../../data/walletData";
import { formatLedgerAmount, paginateLedger } from "../pagination";

describe("wallet ledger helpers", () => {
  it("paginates entries", () => {
    const page = paginateLedger(ledgerEntries, 1, 2);
    expect(page).toHaveLength(2);
    expect(page[0].id).toBe("l1");
  });

  it("formats deduction with explicit sign", () => {
    const deduction = { ...ledgerEntries[2], type: "deduction" };
    expect(formatLedgerAmount(deduction)).toBe("-$300");
  });
});
