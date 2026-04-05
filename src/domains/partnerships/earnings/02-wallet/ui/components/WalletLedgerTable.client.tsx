// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/domains/shared/utils/cn";
import type { PayoutHistoryEntry } from "@/domains/partnerships/earnings/02-wallet/data/walletData";
import { paginateLedger } from "@/domains/partnerships/earnings/02-wallet/domain/pagination";
import { Button } from "@/components/ui/button";

type WalletLedgerTableProps = {
  entries: PayoutHistoryEntry[];
};

export default function WalletLedgerTable({ entries }: WalletLedgerTableProps) {
  const pageSize = 4;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const pageEntries = useMemo(() => paginateLedger(entries as unknown as any[], page, pageSize) as PayoutHistoryEntry[], [entries, page]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={cn("overflow-x-auto rounded-[24px] border border-white/10 bg-white/5")}> 
      <table className="w-full min-w-[600px] text-left text-sm text-white/80">
        <thead>
          <tr>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-white/60">Date</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-white/60">Source</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-white/60">Amount</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-white/60">Status</th>
          </tr>
        </thead>
        <tbody>
          {pageEntries.map((entry) => (
            <tr key={entry.id} className="border-t border-white/5">
              <td className="px-4 py-3">{entry.date}</td>
              <td className="px-4 py-3">{entry.source}</td>
              <td className="px-4 py-3 font-semibold text-white">{entry.amount}</td>
              <td className="px-4 py-3">
                <Badge className="bg-emerald-500/20 text-emerald-200">{entry.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-white/70">
        <span>
          Page {page} / {totalPages}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" disabled={!canPrev} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <Button variant="ghost" size="sm" disabled={!canNext} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
