import type { Metadata } from "next";
import { EarningsBadgesScreen } from "@/domains/partnerships/earnings/09-badges/ui/screens/EarningsBadgesScreen";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";
import {
  badgeTotals,
  badgeCollection,
  nextUnlocks,
} from "@/domains/partnerships/earnings/04-achievements/data/earningsAchievements";

export const metadata: Metadata = {
  title: "Badges • Earnings",
  description: "Browse every badge you've earned plus what's left to unlock.",
};

export default function PartnersEarningsBadgesPage() {
  return (
    <>
      <EarningsNavSync />
      <EarningsBadgesScreen
        badgeTotals={badgeTotals}
        badgeCollection={badgeCollection}
        nextUnlocks={nextUnlocks}
      />
    </>
  );
}
