import type { CreatorScoreWeights } from '../constants/creatorScoreWeights';

export interface ScoreableCreator {
  followerCount:     number;
  followsCount?:     number;
  postsCount?:       number;
  avgViews?:         number;
  outlierRatio?:     number;
  avgEngagementRate?: number;
  verified?:         boolean;
  isPrivate?:        boolean;
  isBusinessAccount?: boolean;
  externalUrl?:      string;
  highlightReelCount?: number;
  igtvVideoCount?:   number;
  // Post-scrape live signals (from getCreatorStats)
  avgEngagement?:    number; // real post ER from scrapedPosts
  postsThisWeek?:    number;
  totalPosts?:       number; // how many posts we've actually scraped
}

export interface ScoreBreakdown {
  score:             number; // 0-100
  components: {
    virality:        number;
    engagement:      number;
    audience:        number;
    followRatio:     number;
    activity:        number;
    liveBoost:       number;
    qualityFlags:    number;
  };
  dealbreaker:       'none' | 'private' | 'too_small';
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function computeCreatorScore(c: ScoreableCreator, w: CreatorScoreWeights): ScoreBreakdown {
  const empty = {
    score: 0,
    components: { virality: 0, engagement: 0, audience: 0, followRatio: 0, activity: 0, liveBoost: 0, qualityFlags: 0 },
    dealbreaker: 'none' as const,
  };

  // Dealbreakers
  if (c.isPrivate)              return { ...empty, dealbreaker: 'private' };
  if (c.followerCount < 1000)   return { ...empty, dealbreaker: 'too_small' };

  // Static signals, each normalized to 0-100
  const virality = clamp((c.outlierRatio ?? 0) * 20, 0, 100); // ratio 5 → 100
  const engagement = clamp((c.avgEngagementRate ?? 0) * 5, 0, 100); // 20% ER → 100
  const audience = clamp(Math.log10(Math.max(c.followerCount, 1)) * 16.66, 0, 100); // 1M → 100
  const followRatio = c.followsCount && c.followsCount > 0
    ? clamp((1 - c.followsCount / c.followerCount) * 100, 0, 100)
    : 50; // unknown = neutral
  const activity = clamp(((c.postsCount ?? 0) / 500) * 100, 0, 100); // 500+ posts → 100

  // Weighted static portion (sum = 1.0 across weights → max 100)
  const staticScore =
      virality    * w.virality
    + engagement  * w.engagement
    + audience    * w.audience
    + followRatio * w.followRatio
    + activity    * w.activity;

  // Live boost — only if we have post-level data
  const hasLive = (c.totalPosts ?? 0) > 0;
  const liveBoost = hasLive
    ? clamp(
        (clamp((c.avgEngagement ?? 0) * 10, 0, 100) * 0.6
       + clamp((c.postsThisWeek ?? 0) * 15, 0, 100) * 0.4)
        * (w.liveBoostMax / 100),
        0,
        w.liveBoostMax
      )
    : 0;

  // Quality flags bonus
  let qualityFlags = 0;
  if (c.verified)                      qualityFlags += 5;
  if (c.isBusinessAccount)             qualityFlags += 3;
  if (c.externalUrl)                   qualityFlags += 2;
  if ((c.highlightReelCount ?? 0) > 5) qualityFlags += 3;
  if ((c.igtvVideoCount ?? 0) > 10)    qualityFlags += 2;
  qualityFlags = Math.min(qualityFlags, w.qualityFlagMax);

  const total = clamp(Math.round(staticScore + liveBoost + qualityFlags), 0, 100);

  return {
    score: total,
    components: { virality, engagement, audience, followRatio, activity, liveBoost, qualityFlags },
    dealbreaker: 'none',
  };
}
