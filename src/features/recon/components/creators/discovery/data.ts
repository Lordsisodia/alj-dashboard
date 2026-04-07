import type { ConvexCandidate, MappedCandidate } from '../../../types';
export type { ConvexCandidate, MappedCandidate };

export const AVATAR_COLORS = ['#dc2626','#b91c1c','#991b1b','#7f1d1d','#ef4444','#f87171'];

export const SAMPLE_GRADIENTS: [string, string][] = [
  ['#fecaca','#fee2e2'], ['#fca5a5','#fecaca'], ['#f87171','#fca5a5'],
  ['#ef4444','#f87171'], ['#dc2626','#ef4444'], ['#b91c1c','#dc2626'],
];

export type { ColumnId } from '../../../types';

export function stableNum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function fmtFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return n > 0 ? String(n) : '-';
}

export function getInitials(displayName: string, handle: string): string {
  const name = displayName?.trim() || handle.replace('@', '');
  const parts = name.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function convexToCandidate(doc: ConvexCandidate): MappedCandidate {
  const avatarIdx = stableNum(doc.handle) % AVATAR_COLORS.length;
  const daysAgo = Math.floor((Date.now() - doc.addedAt) / 86_400_000);
  const discoveredAt = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

  return {
    _convexId:       doc._id,
    id:              stableNum(doc._id),
    handle:          doc.handle,
    displayName:     doc.displayName,
    niche:           doc.niche ?? 'GFE',
    nicheColor:      '#dc2626',
    avatarColor:     AVATAR_COLORS[avatarIdx],
    initials:        getInitials(doc.displayName, doc.handle),
    followers:       fmtFollowers(doc.followerCount ?? 0),
    followersRaw:    doc.followerCount ?? 0,
    avgViews:        doc.avgViews ?? 0,
    outlierRatio:    doc.outlierRatio ?? 0,
    engagementRate:  doc.avgEngagementRate ? `${(doc.avgEngagementRate * 100).toFixed(1)}%` : '-',
    postsPerWeek:    doc.postsPerWeek ?? 0,
    suggestedBy:     doc.suggestedBy ?? null,
    source:          doc.source ?? 'manual',
    discoveredAt,
    status:          doc.status,
    sampleGradients: SAMPLE_GRADIENTS,
    avatarUrl:       doc.avatarUrl,
    enrichStatus:    doc.enrichStatus,
  };
}

export const PRE_APPROVED = [
  { handle: '@minaxash',              displayName: 'Mina Ash',            niche: 'GFE'       },
  { handle: '@tinaxkitsune',          displayName: 'Tina Kitsune',        niche: 'GFE'       },
  { handle: '@a55tr1d',               displayName: 'Astrid',              niche: 'Lifestyle' },
  { handle: '@amammyw',               displayName: 'Sasithon Miyawong',   niche: 'Lifestyle' },
  { handle: '@nerd_nattiyaseehanamm', displayName: 'Ñërd',             niche: 'Lifestyle' },
  { handle: '@tongohmm',              displayName: 'Tongohmm Klaatawan',  niche: 'Lifestyle' },
  { handle: '@kittygoofygirl',        displayName: 'kittygoofygirl',     niche: 'GFE'       },
  { handle: '@tootinytrina',          displayName: 'tootinytrina',        niche: 'GFE'       },
];
