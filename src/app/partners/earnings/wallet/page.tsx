import type { Metadata } from "next";
import { EarningsWalletScreen } from "@/domains/partnerships/earnings/02-wallet/ui/screens/EarningsWalletScreen";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";
import {
  walletSummary,
  paymentMethods,
  complianceChecklist,
} from "@/domains/partnerships/earnings/02-wallet/data/walletData";
import { payoutHistory } from "@/domains/partnerships/earnings/02-wallet/data/walletData";

export const metadata: Metadata = {
  title: "Wallet & Payouts • Earnings",
  description: "Manage partner balances, payout schedules, and compliance.",
};

export default function PartnersEarningsWalletPage() {
  return (
    <>
      <EarningsNavSync />
      <EarningsWalletScreen
        walletSummary={walletSummary}
        paymentMethods={paymentMethods}
        payoutHistory={payoutHistory}
        complianceChecklist={complianceChecklist}
      />
    </>
  );
}
