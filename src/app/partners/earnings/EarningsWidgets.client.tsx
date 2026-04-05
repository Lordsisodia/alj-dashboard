"use client";

import dynamic from "next/dynamic";
import { WidgetHydrator } from "@/domains/partnerships/earnings/01-dashboard/ui/components/WidgetHydrator.client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Flag, Trophy, Award as AwardIcon, Target, Wallet as WalletIcon } from "lucide-react";
import type {
  walletSummary as walletSummaryType,
  ledgerEntries as ledgerEntriesType,
  complianceChecklist as complianceChecklistType,
} from "@/domains/partnerships/earnings/02-wallet/data/walletData";
import type {
  tierMeta as tierMetaType,
  tierMetrics as tierMetricsType,
} from "@/domains/partnerships/earnings/03-tier-progression/data/tierProgression";
import type {
  badgeCollection as badgeCollectionType,
  leaderboardEntries as leaderboardEntriesType,
} from "@/domains/partnerships/earnings/04-achievements/data/earningsAchievements";
import type { earningsChallenges as earningsChallengesType } from "@/domains/partnerships/earnings/06-challenges/data/earningsChallenges";

const ChallengesWidget = dynamic(() => import("@/domains/partnerships/earnings/01-dashboard/ui/components/widgets").then((m) => m.ChallengesWidget), {
  loading: () => <WidgetSkeleton />,
  ssr: false,
});
const LeaderboardWidget = dynamic(() => import("@/domains/partnerships/earnings/01-dashboard/ui/components/widgets").then((m) => m.LeaderboardWidget), {
  loading: () => <WidgetSkeleton />,
  ssr: false,
});
const AchievementsWidget = dynamic(() => import("@/domains/partnerships/earnings/01-dashboard/ui/components/widgets").then((m) => m.AchievementsWidget), {
  loading: () => <WidgetSkeleton />,
  ssr: false,
});
const TierWidget = dynamic(() => import("@/domains/partnerships/earnings/01-dashboard/ui/components/widgets").then((m) => m.TierWidget), {
  loading: () => <WidgetSkeleton />,
  ssr: false,
});
const WalletWidget = dynamic(() => import("@/domains/partnerships/earnings/01-dashboard/ui/components/widgets").then((m) => m.WalletWidget), {
  loading: () => <WidgetSkeleton />,
  ssr: false,
});

function WidgetSkeleton() {
  return <div className="h-32 w-full animate-pulse rounded-xl bg-white/5" />;
}

export type EarningsWidgetsProps = {
  walletSummary: typeof walletSummaryType;
  ledgerEntries: typeof ledgerEntriesType;
  complianceChecklist: typeof complianceChecklistType;
  tierMeta: typeof tierMetaType;
  tierMetrics: typeof tierMetricsType;
  badgeCollection: typeof badgeCollectionType;
  leaderboardEntries: typeof leaderboardEntriesType;
  earningsChallenges: typeof earningsChallengesType;
};

export function EarningsWidgets({
  walletSummary,
  ledgerEntries,
  complianceChecklist,
  tierMeta,
  tierMetrics,
  badgeCollection,
  leaderboardEntries,
  earningsChallenges,
}: EarningsWidgetsProps) {
  const activeChallenges = earningsChallenges.filter((challenge) => challenge.status === "active");
  const upcomingChallenges = earningsChallenges.filter((challenge) => challenge.status === "upcoming");
  const featuredChallenge = activeChallenges[0]
    ? { ...activeChallenges[0], name: activeChallenges[0].name.split(" ").slice(0, 2).join(" ") }
    : undefined;

  return (
    <div className="space-y-5">
      <Section
        icon={<WalletIcon className="h-4 w-4" aria-hidden="true" />}
        title="Wallet & payouts"
        subtitle="Manage balances, payout cadence, rails, and compliance."
        actionHref="/partners/earnings/wallet"
        actionLabel="Open wallet"
      >
        <WidgetHydrator fallback={<WidgetSkeleton />}>
          <WalletWidget
            balance={walletSummary.balance}
            nextPayout={walletSummary.nextPayoutDate}
            connectedRails={walletSummary.connected}
            ledgerPreview={ledgerEntries}
            compliance={complianceChecklist}
          />
        </WidgetHydrator>
      </Section>

      <Section
        icon={<Target className="h-4 w-4" aria-hidden="true" />}
        title="Tier progression"
        subtitle="Track XP, missions, and the perks unlocking next."
        actionHref="/partners/earnings/tier-progression"
        actionLabel="Open tier board"
      >
        <WidgetHydrator fallback={<WidgetSkeleton />}>
          <TierWidget tierMeta={tierMeta} metrics={tierMetrics} />
        </WidgetHydrator>
      </Section>

      <Section
        icon={<AwardIcon className="h-4 w-4" aria-hidden="true" />}
        title="Achievements"
        subtitle="Badges, boosters, and recognition moments unlocked by your work."
        actionHref="/partners/earnings/achievements"
        actionLabel="Open achievements"
      >
        <WidgetHydrator fallback={<WidgetSkeleton />}>
          <AchievementsWidget
            earnedBadges={badgeCollection.filter((badge) => badge.status === "earned")}
            inProgressBadges={badgeCollection.filter((badge) => badge.status === "in-progress")}
          />
        </WidgetHydrator>
      </Section>

      <Section
        icon={<Trophy className="h-4 w-4" aria-hidden="true" />}
        title="Leaderboard"
        subtitle="See where you rank and borrow plays from the top partners."
        actionHref="/partners/earnings/leaderboard"
        actionLabel="Open leaderboard"
      >
        <WidgetHydrator fallback={<WidgetSkeleton />}>
          <LeaderboardWidget leaders={leaderboardEntries} />
        </WidgetHydrator>
      </Section>

      <Section
        icon={<Flag className="h-4 w-4" aria-hidden="true" />}
        title="Challenges"
        subtitle="Sprint missions with payout boosts and ops rewards."
        actionHref="/partners/earnings/challenges"
        actionLabel="Open challenges"
      >
        <WidgetHydrator fallback={<WidgetSkeleton />}>
          <ChallengesWidget
            featured={featuredChallenge}
            activeCount={activeChallenges.length}
            upcomingCount={upcomingChallenges.length}
          />
        </WidgetHydrator>
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  actionHref,
  actionLabel,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actionHref: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-white">
          {icon}
          <div>
            <p className="text-base font-semibold text-white">{title}</p>
            <p className="text-xs text-white/60">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
      <Button
        asChild
        size="sm"
        className="mt-4 w-full rounded-full bg-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-white/25"
      >
        <Link href={actionHref} className="inline-flex items-center justify-center gap-2">
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
