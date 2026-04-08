export interface CreatorScoreWeights {
  virality:       number; // 0-1, default 0.35
  engagement:     number; // 0-1, default 0.25
  audience:       number; // 0-1, default 0.15
  followRatio:    number; // 0-1, default 0.10
  activity:       number; // 0-1, default 0.15
  liveBoostMax:   number; // 0-30, default 20 (cap on post-scrape boost)
  qualityFlagMax: number; // 0-30, default 15 (cap on verified/business/etc bonuses)
}

export const DEFAULT_WEIGHTS: CreatorScoreWeights = {
  virality:       0.35,
  engagement:     0.25,
  audience:       0.15,
  followRatio:    0.10,
  activity:       0.15,
  liveBoostMax:   20,
  qualityFlagMax: 15,
};

const STORAGE_KEY = 'recon-creator-score-weights-v1';

export function loadWeights(): CreatorScoreWeights {
  if (typeof window === 'undefined') return DEFAULT_WEIGHTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WEIGHTS;
    return { ...DEFAULT_WEIGHTS, ...JSON.parse(raw) };
  } catch { return DEFAULT_WEIGHTS; }
}

export function saveWeights(w: CreatorScoreWeights): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(w));
}
