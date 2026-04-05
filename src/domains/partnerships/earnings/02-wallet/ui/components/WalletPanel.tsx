"use client";

import { EarningsWalletBoard } from "@/domains/partnerships/earnings/02-wallet/ui/components/EarningsWalletBoard";
import {
  complianceChecklist,
  paymentMethods,
  walletSummary,
} from "@/domains/partnerships/earnings/02-wallet/data/walletData";
import { payoutHistory } from "@/domains/partnerships/earnings/02-wallet/data/walletData";

export function WalletPanel() {
  return (
    <EarningsWalletBoard
      walletSummary={walletSummary}
      paymentMethods={paymentMethods}
      payoutHistory={payoutHistory.slice(0, 6)}
      complianceChecklist={complianceChecklist}
    />
  );
}
