import type { Competitor, DailyVolume } from './types';

// 8 enrichable data points, each worth 12.5 pts → max 100%

export function computeProfileHealth(c: Competitor): number {
  const checks = [
    !!c.followers,
    !!c.engagementRate,
    !!c.bio,
    !!c.profilePicUrl,
    c.verified !== undefined,
    c.postsPerWeek > 0,
    c.trend.length >= 3,
    c.niche !== 'Unknown',
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ── Real scraped creators ──────────────────────────────────────────────────────

export const COMPETITORS: Competitor[] = [
  {
    id: 1, handle: '@minaxash', displayName: 'Mina Ash',
    niche: 'GFE', nicheColor: '#ff0069', avatarColor: '#ff0069', initials: 'MA',
    followers: '597K', engagementRate: '1.1%', postsPerWeek: 14,
    lastScraped: '9 days ago', status: 'active',
    trend: [62, 68, 71, 65, 70, 72, 74], postsToday: 47, jobStatus: 'idle',
    score: 72, favorited: false,
    verified: true,
    bio: 'Australian 🇦🇺 · I only respond here 🔽🩷',
    profilePicUrl: 'https://scontent-ord5-3.cdninstagram.com/v/t51.2885-19/470893956_950435536412346_7560289651989814639_n.jpg',
  },
  {
    id: 2, handle: '@tinaxkitsune', displayName: 'Tina Kitsune',
    niche: 'GFE', nicheColor: '#ff0069', avatarColor: '#ec4899', initials: 'TK',
    followers: '', engagementRate: '', postsPerWeek: 0,
    lastScraped: '30 days ago', status: 'active',
    trend: [7800, 0, 0, 0, 0, 7700, 7600], postsToday: 3, jobStatus: 'idle',
    score: 38, favorited: false,
    verified: undefined, bio: '', profilePicUrl: '',
  },
  {
    id: 3, handle: '@a55tr1d', displayName: 'Astrid',
    niche: 'Lifestyle', nicheColor: '#4a9eff', avatarColor: '#4a9eff', initials: 'AS',
    followers: '', engagementRate: '', postsPerWeek: 5,
    lastScraped: '14 days ago', status: 'active',
    trend: [800, 1200, 900, 1400, 1100, 1300, 1500], postsToday: 38, jobStatus: 'idle',
    score: 35, favorited: false,
    verified: undefined, bio: '', profilePicUrl: '',
  },
  {
    id: 4, handle: '@amammyw', displayName: 'Sasithon Miyawong',
    niche: 'Lifestyle', nicheColor: '#4a9eff', avatarColor: '#f97316', initials: 'AW',
    followers: '', engagementRate: '', postsPerWeek: 5,
    lastScraped: '13 days ago', status: 'active',
    trend: [12000, 18000, 14000, 20000, 16000, 19000, 16196], postsToday: 52, jobStatus: 'idle',
    score: 52, favorited: false,
    verified: undefined, bio: '', profilePicUrl: '',
  },
  {
    id: 5, handle: '@nerd_nattiyaseehanamm', displayName: 'Ñërd ◡̈',
    niche: 'Unknown', nicheColor: '#9ca3af', avatarColor: '#833ab4', initials: 'NN',
    followers: '', engagementRate: '', postsPerWeek: 0,
    lastScraped: '6 mo. ago', status: 'paused',
    trend: [60910], postsToday: 0, jobStatus: 'idle',
    score: 32, favorited: false,
    verified: undefined, bio: '', profilePicUrl: '',
  },
  {
    id: 6, handle: '@tongohmm', displayName: 'Tongohmm Klaatawan',
    niche: 'Lifestyle', nicheColor: '#4a9eff', avatarColor: '#fcaf45', initials: 'TG',
    followers: '', engagementRate: '', postsPerWeek: 2,
    lastScraped: '6 mo. ago', status: 'paused',
    trend: [25000, 30000, 28000, 35000, 30750, 32000, 28000], postsToday: 0, jobStatus: 'idle',
    score: 42, favorited: false,
    verified: undefined, bio: '', profilePicUrl: '',
  },
  {
    id: 7, handle: '@kittygoofygirl', displayName: 'kittygoofygirl',
    niche: 'Unknown', nicheColor: '#9ca3af', avatarColor: '#9ca3af', initials: 'KG',
    followers: '', engagementRate: '', postsPerWeek: 0,
    lastScraped: 'Never', status: 'paused',
    trend: [], postsToday: 0, jobStatus: 'idle',
    score: 0, favorited: false,
    verified: undefined, bio: '', profilePicUrl: '',
  },
  {
    id: 8, handle: '@tootinytrina', displayName: 'tootinytrina',
    niche: 'Unknown', nicheColor: '#9ca3af', avatarColor: '#6b7280', initials: 'TT',
    followers: '', engagementRate: '', postsPerWeek: 0,
    lastScraped: 'Never', status: 'paused',
    trend: [], postsToday: 0, jobStatus: 'idle',
    score: 0, favorited: false,
    verified: undefined, bio: '', profilePicUrl: '',
  },
];

export const DAILY_VOLUME: DailyVolume[] = [
  { label: 'Mar 24', total: 142 }, { label: 'Mar 25', total: 198 }, { label: 'Mar 26', total: 167 }, { label: 'Mar 27', total: 214 },
  { label: 'Mar 28', total: 189 }, { label: 'Mar 29', total: 203 }, { label: 'Mar 30', total: 231 }, { label: 'Mar 31', total: 178 },
  { label: 'Apr 1',  total: 256 }, { label: 'Apr 2',  total: 221 }, { label: 'Apr 3',  total: 244 }, { label: 'Apr 4',  total: 198 },
  { label: 'Apr 5',  total: 267 }, { label: 'Apr 6',  total: 284 },
];

// ── Scrape log ─────────────────────────────────────────────────────────────────
export type LogStatus = 'success' | 'running' | 'failed';
export interface LogEntry { id: number; timestamp: string; action: string; handle: string; status: LogStatus; }

export const LOG_ENTRIES: LogEntry[] = [
  { id: 1,  timestamp: 'Today, 3:42 PM',  action: 'Scraped 47 reels from',     handle: '@minaxash',              status: 'success' },
  { id: 2,  timestamp: 'Today, 3:12 PM',  action: 'Scraped 38 reels from',     handle: '@a55tr1d',               status: 'success' },
  { id: 3,  timestamp: 'Today, 2:58 PM',  action: 'Scraped 52 posts from',     handle: '@amammyw',               status: 'success' },
  { id: 4,  timestamp: 'Today, 1:30 PM',  action: 'Profile scrape failed for', handle: '@tinaxkitsune',          status: 'failed'  },
  { id: 5,  timestamp: 'Today, 11:14 AM', action: 'Scraped 3 reels from',      handle: '@tinaxkitsune',          status: 'success' },
  { id: 6,  timestamp: 'Mar 28, 9:05 AM', action: 'Full profile enriched for', handle: '@minaxash',              status: 'success' },
  { id: 7,  timestamp: 'Mar 24, 6:22 PM', action: 'Rate limit hit scraping',   handle: '@kittygoofygirl',        status: 'failed'  },
  { id: 8,  timestamp: 'Mar 24, 4:10 PM', action: 'Scraped 4 posts from',      handle: '@tongohmm',              status: 'success' },
  { id: 9,  timestamp: 'Mar 24, 2:00 PM', action: 'Scraped 1 post from',       handle: '@nerd_nattiyaseehanamm', status: 'success' },
  { id: 10, timestamp: 'Mar 24, 1:00 PM', action: 'Added to tracking list',    handle: '@tootinytrina',          status: 'success' },
];
