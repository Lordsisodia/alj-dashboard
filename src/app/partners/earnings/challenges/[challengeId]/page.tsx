import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEarningsChallenges } from "@/domains/partnerships/earnings/06-challenges/application/challenges-service";
import { ChallengeDetailScreen } from "@/domains/partnerships/earnings/06-challenges/ui/screens/ChallengeDetailScreen";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Challenge • Earnings",
  description: "Explore earnings challenges and rewards.",
};

export async function generateStaticParams() {
  try {
      const challenges = await getEarningsChallenges();
      return challenges.map((challenge) => ({ challengeId: challenge.id }));
  } catch {
    return [];
  }
}

export default async function ChallengeDetailPage(props: any) {
  const challengeId = (await Promise.resolve(props?.params))?.challengeId;
  const challenges = await getEarningsChallenges();
  const challenge = challenges.find((c) => c.id === challengeId);

  if (!challenge) {
    notFound();
  }

  return (
    <>
      <EarningsNavSync />
      <ChallengeDetailScreen challenge={challenge} />
    </>
  );
}
