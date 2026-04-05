import { EarningsMissionsScreen } from "@/domains/partnerships/earnings/07-missions/ui/screens/EarningsMissionsScreen";
import { EarningsNavSync } from "@/domains/partnerships/earnings/shared/ui/components/EarningsNavSync.client";
import { unlockMissionsInitial } from "@/domains/partnerships/earnings/03-tier-progression/data/tierProgression";

export default function EarningsMissionsPage() {
  return (
    <>
      <EarningsNavSync />
      <EarningsMissionsScreen missionsInitial={unlockMissionsInitial} />
    </>
  );
}
