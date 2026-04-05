import type { Metadata } from "next";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";
import { EarningsTierProgressionScreen } from "@/domains/partnerships/earnings/03-tier-progression/ui/screens/EarningsTierProgressionScreen";
import { tierMeta, tierHistory, unlockMissions } from "@/domains/partnerships/earnings/03-tier-progression/data/tierProgression";

export const metadata: Metadata = {
  title: "Tier Progress",
  description: "Track partner tier progress and unlock missions.",
};

export default function PartnersEarningsTierProgressionPage() {
  return (
    <>
      <EarningsNavSync />
      <EarningsTierProgressionScreen
        tierMeta={tierMeta}
        tierHistory={tierHistory}
        unlockMissions={unlockMissions}
      />
    </>
  );
}
