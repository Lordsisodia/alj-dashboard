export type LeaderboardEntry = {
  rank: number;
  name: string;
  metricLabel: string;
  metricValue: number;
  trend: "up" | "down" | "flat";
  region?: string;
};

export const leaderboardEntries: LeaderboardEntry[] = [
  { rank: 1, name: "Avery Diaz", metricLabel: "Payouts", metricValue: 48200, trend: "up", region: "NA" },
  { rank: 2, name: "Marin Patel", metricLabel: "Payouts", metricValue: 45500, trend: "flat", region: "NA" },
  { rank: 3, name: "Jordan Kim", metricLabel: "Referrals", metricValue: 18, trend: "up", region: "LATAM" },
  { rank: 4, name: "Nova Chen", metricLabel: "Engagement", metricValue: 12, trend: "up", region: "NA" },
];

export const leaderboardHighlights = {
  topPerformer: "Avery Diaz",
  fastestMover: "Jordan Kim",
  biggestDeal: "$72k retail",
};
