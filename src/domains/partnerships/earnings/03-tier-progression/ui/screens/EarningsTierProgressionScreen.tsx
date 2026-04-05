import { EarningsTierProgressionBoard } from "../components/EarningsTierProgressionBoard.client";
import type {
  TierHistoryEntry,
  UnlockMission,
} from "@/domains/partnerships/earnings/03-tier-progression/data/tierProgression";

type TierMetaState = {
  currentTier: string;
  nextTier: string;
  pointsToNext: number;
  estUpgradeDate: string;
  progressPct: number;
};

type EarningsTierProgressionScreenProps = {
  tierMeta: TierMetaState;
  tierHistory: TierHistoryEntry[];
  unlockMissions: UnlockMission[];
};

export function EarningsTierProgressionScreen(props: EarningsTierProgressionScreenProps) {
  return <EarningsTierProgressionBoard {...props} />;
}
