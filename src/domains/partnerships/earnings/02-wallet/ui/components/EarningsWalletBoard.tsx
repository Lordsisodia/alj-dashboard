"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import Progress from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Shield, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/domains/shared/utils/cn";
import { EarningsHeroBackLink } from "@/domains/partnerships/earnings/shared/ui/components/EarningsHeroBackLink";
import {
  nestedCardClass,
  primaryGradientButtonClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";

import type {
  WalletSummary,
  PaymentMethod,
  ComplianceItem,
} from "@/domains/partnerships/earnings/02-wallet/data/walletData";
import type { PayoutHistoryEntry } from "@/domains/partnerships/earnings/02-wallet/data/walletData";

const primaryActionButtonClass = primaryGradientButtonClass;
const WalletLedgerTable = dynamic(() => import("./WalletLedgerTable.client"), {
  ssr: false,
  loading: () => <LedgerTableSkeleton />,
});
type EarningsWalletBoardProps = {
  walletSummary: WalletSummary;
  paymentMethods: PaymentMethod[];
  payoutHistory: PayoutHistoryEntry[];
  complianceChecklist: ComplianceItem[];
};

export function EarningsWalletBoard({
  walletSummary,
  paymentMethods,
  payoutHistory,
  complianceChecklist,
}: EarningsWalletBoardProps) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-siso-bg-primary text-siso-text-primary">
      <TierProgressBackdrop />

      <PartnersPageContainer
        width="wide"
        className="relative z-10 flex w-full flex-col gap-6 pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-8"
      >
        <div className="relative min-h-[128px]">
          <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
            <EarningsHeroBackLink />
          </div>
          <div className="relative">
            <HighlightCard
              color="orange"
              className="w-full max-w-none pl-12 pr-16"
              title="Wallet & payouts"
              description="Manage balances, payout cadence, and compliance in one place."
              hideDivider
              hideFooter
              titleClassName="uppercase tracking-[0.35em] font-semibold text-[28px] leading-[1.2]"
              descriptionClassName="text-xs"
              icon={<Wallet className="h-5 w-5" />}
              metricValue=""
              metricLabel=""
              buttonText=""
              onButtonClick={() => {}}
              showCornerIcon={false}
              fullWidth
            />
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <SettingsGroupCallout
          icon={<Wallet className="h-4 w-4" />}
          title="Overview"
          subtitle="Balance visibility plus quick actions"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "grid gap-4 p-4 md:grid-cols-2")}>
            <section className={cn(nestedCardClass, "p-4")}>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Balance</p>
              <p className="text-4xl font-semibold text-white">{walletSummary.balance}</p>
              <p className="text-xs text-white/70">Next payout {walletSummary.nextPayoutDate}</p>
              <div className="mt-4 space-y-2">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Connected rails</p>
                <div className="flex flex-wrap gap-2 text-white/90">
                  {walletSummary.connected.map((method) => (
                    <Badge key={method} className="bg-white/5 text-white/90">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>
            <section className={cn(nestedCardClass, "p-4")}>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Quick actions</p>
              <p className="text-xs text-white/70">Move funds or wire payouts instantly.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className={primaryActionButtonClass}>Withdraw</Button>
                <Button variant="secondary" className={secondaryActionButtonClass}>
                  Transfer
                </Button>
              </div>
            </section>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<Wallet className="h-4 w-4" />}
          title="Payment methods"
          subtitle="Set defaults, sync accounts, add new methods"
          showChevron={false}
        >
          <div className="grid gap-3 md:grid-cols-3">
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
            <button
              type="button"
              className={cn(nestedCardClass, "border-dashed border-white/20 p-4 text-center text-sm text-white/70")}
            >
              + Add method
            </button>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<Sparkles className="h-4 w-4" />}
          title="Recent payout history"
          subtitle="Last 4 releases"
          showChevron={false}
        >
          <Suspense fallback={<LedgerTableSkeleton />}>
            <WalletLedgerTable entries={payoutHistory} />
          </Suspense>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<Shield className="h-4 w-4" />}
          title="Compliance checklist"
          subtitle="Keep payouts flowing by staying compliant"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "space-y-3 p-4")}>
            {complianceChecklist.map((item) => (
              <div key={item.id} className={cn(nestedCardClass, "p-4")}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-white/70">{item.description}</p>
                  </div>
                  <Badge className="bg-white/10 text-white/80">{item.progress}%</Badge>
                </div>
                <Progress value={item.progress} className="mt-3" />
                {item.actionLabel ? (
                  <Button size="sm" variant="secondary" className={cn(secondaryActionButtonClass, "mt-3")}>
                    {item.actionLabel}
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<HelpCircle className="h-4 w-4" />}
          title="Need help with a payout?"
          subtitle="Our payouts team replies within 24h"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "p-4")}>
            <p className="text-sm text-white/80">
              Open a ticket or browse the help center for troubleshooting steps on Stripe Connect, bank transfers, and tax documents.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button className={primaryActionButtonClass}>Open ticket</Button>
              <Button variant="secondary" className={secondaryActionButtonClass}>
                Visit Help Center
              </Button>
            </div>
          </div>
        </SettingsGroupCallout>
      </PartnersPageContainer>
    </section>
  );
}

function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  const statusLabel = method.status === "active" ? "Active" : method.status === "needs_sync" ? "Needs sync" : "Draft";
  const statusClass = method.status === "active"
    ? "bg-emerald-500/20 text-emerald-200"
    : method.status === "needs_sync"
      ? "bg-amber-500/20 text-amber-200"
      : "bg-white/10 text-white/70";

  return (
    <div className={cn(nestedCardClass, "p-4")}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{method.label}</p>
          <p className="text-xs text-white/70">Ending {method.ending}</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.3em]", statusClass)}>
          {statusLabel}
        </span>
      </div>
      <p className="mt-3 text-xs text-white/70">Last sync {method.lastSync}</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" className={primaryActionButtonClass}>
          Set default
        </Button>
        <Button size="sm" variant="secondary" className={secondaryActionButtonClass}>
          Sync
        </Button>
      </div>
    </div>
  );
}

function LedgerTableSkeleton() {
  return (
    <div className={cn(stackedPanelClass, "space-y-2 p-4")}>
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className="h-10 animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  );
}
