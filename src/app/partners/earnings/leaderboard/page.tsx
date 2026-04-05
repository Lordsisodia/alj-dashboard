import type { Metadata } from "next";
import { EarningsLeaderboardScreen } from "@/domains/partnerships/earnings/05-leaderboard/ui/screens/EarningsLeaderboardScreen";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";
import { getLeaderboardEntries } from "@/domains/partnerships/earnings/06-challenges/application/challenges-service";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Leaderboard • Earnings",
  description: "Top partners by payouts, points, and boosters for the current season.",
};

export default async function PartnersEarningsLeaderboardPage() {
  const leaders = await getLeaderboardEntries();
  return (
    <>
      <EarningsNavSync />
      <EarningsLeaderboardScreen leaders={leaders} />
    </>
  );
}
