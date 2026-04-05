import { EarningsWalletBoard } from "../components/EarningsWalletBoard";
import type {
  WalletSummary,
  PaymentMethod,
  ComplianceItem,
} from "@/domains/partnerships/earnings/02-wallet/data/walletData";
import type { PayoutHistoryEntry } from "@/domains/partnerships/earnings/02-wallet/data/walletData";

type EarningsWalletScreenProps = {
  walletSummary: WalletSummary;
  paymentMethods: PaymentMethod[];
  payoutHistory: PayoutHistoryEntry[];
  complianceChecklist: ComplianceItem[];
};

export function EarningsWalletScreen(props: EarningsWalletScreenProps) {
  return <EarningsWalletBoard {...props} />;
}
