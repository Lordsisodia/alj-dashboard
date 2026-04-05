import type { Metadata } from "next";
import { EarningsAchievementsScreen } from "@/domains/partnerships/earnings/04-achievements/ui/screens/EarningsAchievementsScreen";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";
import {
  badgeTotals,
  badgeCollectionInitial,
  certificateSummary,
  achievementFeed,
  nextUnlocks,
} from "@/domains/partnerships/earnings/04-achievements/data/earningsAchievements";

export const metadata: Metadata = {
  title: "Achievements • Earnings",
  description: "Badge progress, leaderboards, and shoutouts for the partner program.",
};

export default function PartnersEarningsAchievementsPage() {
  return (
    <>
      <EarningsNavSync />
      <EarningsAchievementsScreen
        badgeTotals={badgeTotals}
        badgeCollectionInitial={badgeCollectionInitial}
        certificateSummary={certificateSummary}
        achievementFeed={achievementFeed}
        nextUnlocks={nextUnlocks}
      />
    </>
  );
}
