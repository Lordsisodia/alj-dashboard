import { walletSummary, ledgerEntries, complianceChecklist } from "../../02-wallet/data/walletData"
import { earningsChallenges } from "../../06-challenges/data/earningsChallenges"
import { badgeCollection, leaderboardEntries } from "../../04-achievements/data/earningsAchievements"
import { tierMeta, tierMetrics } from "../../03-tier-progression/data/tierProgression"

export function getWalletSnapshot() {
  return { walletSummary, ledgerEntries, complianceChecklist }
}

export function getTierProgressSnapshot() {
  return { tierMeta, tierMetrics }
}

export function getAchievementSnapshot() {
  return { badgeCollection, leaderboardEntries }
}

export function getChallengeSnapshot() {
  return { earningsChallenges }
}
