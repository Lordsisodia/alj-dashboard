import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "../../../domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Button } from "@/components/ui/button";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";
import {
  getAchievementSnapshot,
  getChallengeSnapshot,
  getTierProgressSnapshot,
  getWalletSnapshot,
} from "@/domains/partnerships/earnings/01-dashboard/application/dashboard-data";
import { EarningsWidgets } from "./EarningsWidgets.client";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";

export default function EarningsDashboardPage() {
  const { walletSummary, ledgerEntries, complianceChecklist } = getWalletSnapshot();
  const { tierMeta, tierMetrics } = getTierProgressSnapshot();
  const { badgeCollection, leaderboardEntries } = getAchievementSnapshot();
  const { earningsChallenges } = getChallengeSnapshot();

  return (
    <>
      <EarningsNavSync />
      <main className="relative min-h-screen overflow-hidden bg-siso-bg-primary text-siso-text-primary">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,#20140a,#050505)]"
          style={{ opacity: 0.45 }}
          aria-hidden="true"
        />
        <PartnersPageContainer className="relative z-10 space-y-6 py-8">
          <div className="relative">
            <HighlightCard
              color="orange"
              title="Earnings Dashboard"
              description="Monitor payouts, commissions, recognition, and tier momentum from one place."
              icon={<span className="text-xl" aria-hidden="true">💰</span>}
              hideDivider
              showCornerIcon={false}
              className="w-full max-w-none"
              fullWidth
              titleClassName="uppercase tracking-[0.35em] text-white"
              descriptionClassName="text-sm"
            />
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <EarningsWidgets
              walletSummary={walletSummary}
              ledgerEntries={ledgerEntries}
              complianceChecklist={complianceChecklist}
              tierMeta={tierMeta}
              tierMetrics={tierMetrics}
              badgeCollection={badgeCollection}
              leaderboardEntries={leaderboardEntries}
              earningsChallenges={earningsChallenges}
            />
          </div>
        </PartnersPageContainer>
      </main>
    </>
  );
}

function CalloutButton({ href, label }: { href: string; label: string }) {
  return (
    <Button
      asChild
      size="sm"
      className="mt-4 w-full rounded-full bg-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-white/25"
    >
      <Link href={href} className="inline-flex items-center justify-center gap-2">
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
