import type { Candidate, Competitor } from '../../types';

// ── Constants ──────────────────────────────────────────────────────────────────

export const NICHES = ['GFE', 'Fitness', 'Lifestyle', 'ABG', 'Alt', 'Cosplay'];

export const NICHE_COLORS: Record<string, string> = {
  GFE: '#ff0069', Fitness: '#78c257', Lifestyle: '#4a9eff',
  ABG: '#833ab4', Alt: '#6b7280', Cosplay: '#fcaf45', Unknown: '#9ca3af',
};

// ── Shared input styles ────────────────────────────────────────────────────────

export const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-colors';
export const inputStyle = { border: '1px solid rgba(0,0,0,0.12)' };

// ── Factory helpers ────────────────────────────────────────────────────────────

function toInitials(handle: string): string {
  const s = handle.replace(/^@/, '').replace(/[._-]/g, ' ').trim();
  const parts = s.split(' ').filter(Boolean);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : s.slice(0, 2).toUpperCase();
}

function autoGradients(color: string): [string, string][] {
  const palette = ['#fcaf45', '#833ab4', '#4a9eff', '#78c257', '#ff0069'].filter(c => c !== color);
  return [
    [color, palette[0]], [palette[0], color],
    [color, palette[1]], [palette[1], color],
    [color, palette[2]], [palette[2], color],
  ];
}

export function makeCandidate(handle: string, niche: string): Candidate {
  const h = handle.startsWith('@') ? handle : `@${handle}`;
  const color = NICHE_COLORS[niche] ?? '#9ca3af';
  return {
    id: Date.now(),
    handle: h,
    displayName: h.replace('@', ''),
    niche,
    nicheColor: color,
    avatarColor: color,
    initials: toInitials(h),
    followers: '-',
    followersRaw: 0,
    avgViews: 0,
    outlierRatio: 0,
    engagementRate: '-',
    postsPerWeek: 0,
    suggestedBy: null,
    discoveredAt: 'Just now',
    status: 'pending',
    sampleGradients: autoGradients(color),
  };
}

export function makeCreator(handle: string, niche: string): Competitor {
  const h = handle.startsWith('@') ? handle : `@${handle}`;
  const color = NICHE_COLORS[niche] ?? '#9ca3af';
  return {
    id: Date.now(),
    handle: h,
    displayName: h.replace('@', ''),
    niche,
    nicheColor: color,
    avatarColor: color,
    initials: toInitials(h),
    followers: '',
    engagementRate: '',
    postsPerWeek: 0,
    lastScraped: 'Never',
    status: 'active',
    trend: [],
    postsToday: 0,
    jobStatus: 'idle',
    score: 0,
    favorited: false,
  };
}
