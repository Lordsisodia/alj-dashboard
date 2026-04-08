import type { MappedCandidate } from './data';

export interface DiscoveryStatsData {
  avgViews: number;
  avgEngagement: number;
  avgFollowers: number;
  topNiche: string;
  duplicateHandles: Set<string>;
  duplicateCount: number;
}

export function computeDiscoveryStats(
  scraped: MappedCandidate[],
  approved: MappedCandidate[],
  pending: MappedCandidate[],
): DiscoveryStatsData {
  const avgViews = scraped.length > 0
    ? scraped.reduce((s, c) => s + (c.avgViews ?? 0), 0) / scraped.length
    : 0;

  const avgEngagement = scraped.length > 0
    ? scraped.reduce((s, c) => s + (parseFloat(c.engagementRate) || 0), 0) / scraped.length
    : 0;

  const avgFollowers = scraped.length > 0
    ? scraped.reduce((s, c) => s + (c.followersRaw ?? 0), 0) / scraped.length
    : 0;

  const nicheCount = new Map<string, number>();
  approved.forEach(c => { if (c.niche) nicheCount.set(c.niche, (nicheCount.get(c.niche) ?? 0) + 1); });
  const topNiche = [...nicheCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  const handleCount = new Map<string, number>();
  pending.forEach(c => handleCount.set(c.handle.toLowerCase(), (handleCount.get(c.handle.toLowerCase()) ?? 0) + 1));
  const duplicateHandles = new Set([...handleCount.entries()].filter(([, n]) => n > 1).map(([h]) => h));
  const duplicateCount = pending.filter(c => duplicateHandles.has(c.handle.toLowerCase())).length;

  return { avgViews, avgEngagement, avgFollowers, topNiche, duplicateHandles, duplicateCount };
}
