import type { Metadata } from "next";
import { EarningsChallengesScreen } from "@/domains/partnerships/earnings/06-challenges/ui/screens/EarningsChallengesScreen";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";
import { getEarningsChallenges } from "@/domains/partnerships/earnings/06-challenges/application/challenges-service";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Challenges • Earnings",
  description: "Track seasonal boosts, team missions, and payout multipliers.",
};

export default async function PartnersEarningsChallengesPage() {
  const challenges = await getEarningsChallenges();
  return (
    <>
      <EarningsNavSync />
      <EarningsChallengesScreen challenges={challenges} />
    </>
  );
}
