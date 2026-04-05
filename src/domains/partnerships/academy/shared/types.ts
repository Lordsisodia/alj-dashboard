// Shared Academy types (runtime-free)

export interface TierInfo {
  id: string;
  title: string;
  art?: string;
}

export interface LevelInfo {
  currentLevel: number;
  currentPoints: number;
  pointsToNextLevel: number;
  nextLevel: number;
  currentTierId: string;
  nextTierId: string;
}

export interface CertificateSummary {
  count: number;
  badges: number;
}

export interface XpEntry {
  id: string;
  title: string;
  source: string;
  xp: number;
  when: string;
}

export interface XpFeedPage {
  items: readonly XpEntry[];
  page: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface ProgressSnapshot {
  level: LevelInfo;
  tiers: readonly TierInfo[];
  xpFeed: XpFeedPage;
  certificates: CertificateSummary;
}

