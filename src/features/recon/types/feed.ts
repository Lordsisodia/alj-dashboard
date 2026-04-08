// Shared types for recon feed tab
// These were previously imported from @/features/intelligence/utils

export interface NicheERMap {
  [niche: string]: number; // avg ER for niche
}

export interface CreatorStats {
  handle:         string;
  postsThisWeek: number;
  trendBuckets:  number[]; // [day-7, day-6, ..., day-0]
}