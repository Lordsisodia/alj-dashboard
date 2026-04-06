import { computeProfileHealth } from '../../constants';
import type { Competitor } from '../../types';
import type { CreatorFilters } from './CreatorsFilterBar';

// ── Column definitions ─────────────────────────────────────────────────────────
export type ColKey =
  | 'health' | 'niche' | 'followers' | 'following' | 'posts'
  | 'engRate' | 'score' | 'trend' | 'category' | 'linkInBio' | 'email';

export interface ColDef {
  key:            ColKey;
  label:          string;
  width:          string;
  defaultVisible: boolean;
  enrichOnly:     boolean;
}

export const COLUMN_DEFS: ColDef[] = [
  { key: 'health',    label: 'Profile Health', width: '150px', defaultVisible: true,  enrichOnly: false },
  { key: 'niche',     label: 'Niche',          width: '110px', defaultVisible: true,  enrichOnly: false },
  { key: 'followers', label: 'Followers',      width: '110px', defaultVisible: true,  enrichOnly: false },
  { key: 'following', label: 'Following',      width: '90px',  defaultVisible: true,  enrichOnly: true  },
  { key: 'posts',     label: 'Posts',          width: '70px',  defaultVisible: true,  enrichOnly: true  },
  { key: 'engRate',   label: 'Eng. Rate',      width: '100px', defaultVisible: true,  enrichOnly: false },
  { key: 'score',     label: 'Score',          width: '85px',  defaultVisible: true,  enrichOnly: false },
  { key: 'trend',     label: 'Trend',          width: '100px', defaultVisible: true,  enrichOnly: false },
  { key: 'category',  label: 'IG Category',    width: '130px', defaultVisible: false, enrichOnly: true  },
  { key: 'linkInBio', label: 'Link in Bio',    width: '80px',  defaultVisible: false, enrichOnly: true  },
  { key: 'email',     label: 'Email',          width: '150px', defaultVisible: false, enrichOnly: true  },
];

export type ColVisibility = Record<ColKey, boolean>;

export const DEFAULT_COL_VISIBILITY: ColVisibility = Object.fromEntries(
  COLUMN_DEFS.map(c => [c.key, c.defaultVisible])
) as ColVisibility;

/** Build the CSS grid-template-columns string from visibility state */
export function buildGridCols(vis: ColVisibility): string {
  const middle = COLUMN_DEFS
    .filter(c => vis[c.key])
    .map(c => c.width)
    .join(' ');
  return `40px 36px 220px ${middle} 44px 100px`;
}

/** Compute the minimum pixel width of the table for a given visibility state.
 *  Used to fix virtualizer horizontal scroll - absolute rows need an explicit width. */
export function computeTableWidth(vis: ColVisibility): number {
  // Fixed columns: checkbox(40) + #(36) + creator(220) + heart(44) + actions(100)
  const fixed = 40 + 36 + 220 + 44 + 100;
  const cols  = COLUMN_DEFS
    .filter(c => vis[c.key])
    .reduce((sum, c) => sum + parseInt(c.width, 10), 0);
  return fixed + cols;
}

// Keep for backward compat (used nowhere new now)
export const TABLE_COLS = buildGridCols(DEFAULT_COL_VISIBILITY);
export const COL_BORDER = '1px solid rgba(0,0,0,0.06)';

// ── Status filter view ─────────────────────────────────────────────────────────
export type StatusView = 'all' | 'raw' | 'enriched' | 'scraped' | 'failed';

export interface StatusViewDef {
  key:    StatusView;
  label:  string;
  color:  string;   // active text colour
  bg:     string;   // active background
}

export const STATUS_VIEWS: StatusViewDef[] = [
  { key: 'all',      label: 'All',      color: '#6b7280', bg: 'rgba(107,114,128,0.10)' },
  { key: 'raw',      label: 'Raw',      color: '#d97706', bg: 'rgba(217,119,6,0.10)'   },
  { key: 'enriched', label: 'Enriched', color: '#16a34a', bg: 'rgba(22,163,74,0.10)'   },
  { key: 'scraped',  label: 'Scraped',  color: '#2563eb', bg: 'rgba(37,99,235,0.10)'   },
  { key: 'failed',   label: 'Failed',   color: '#dc2626', bg: 'rgba(220,38,38,0.10)'   },
];

type EnrichedCompetitor = Competitor & { _totalPosts?: number; _enrichStatus?: string | null };

export function applyStatusFilter(creators: EnrichedCompetitor[], view: StatusView): EnrichedCompetitor[] {
  if (view === 'all') return creators;
  return creators.filter(c => {
    const health     = computeProfileHealth(c);
    const isEnriched = c._enrichStatus === 'done';
    const isScraped  = (c._totalPosts ?? 0) > 0;
    switch (view) {
      case 'raw':      return health < 50 && !isEnriched && !isScraped;
      case 'enriched': return isEnriched;
      case 'scraped':  return isScraped;
      case 'failed':   return (isEnriched || isScraped) && health < 50;
      default:         return true;
    }
  });
}

// Filter option lists
export const NICHE_OPTS     = ['GFE','Fitness','Lifestyle','ABG','Cosplay','Alt','Unknown'].map(v => ({ value: v }));
export const FOLLOW_OPTS    = [{ value: 'under-100k', label: '<100K' }, { value: '100k-500k', label: '100K-500K' }, { value: 'over-500k', label: '500K+' }];
export const FOLLOWING_OPTS = [{ value: 'under-500', label: '<500' }, { value: '500-5k', label: '500-5K' }, { value: 'over-5k', label: '5K+' }];
export const POSTS_OPTS     = [{ value: 'under-100', label: '<100' }, { value: '100-500', label: '100-500' }, { value: 'over-500', label: '500+' }];
export const ENG_OPTS       = [{ value: 'under-2', label: '<2%' }, { value: '2-5', label: '2-5%' }, { value: 'over-5', label: '5%+' }];
export const SCORE_OPTS     = [{ value: 'low', label: '< 50' }, { value: 'mid', label: '50-70' }, { value: 'high', label: '70+' }];
export const HEALTH_OPTS    = [{ value: 'critical', label: '< 25%' }, { value: 'partial', label: '25-74%' }, { value: 'healthy', label: '75%+' }];

export function relativeTime(ms: number | null): string {
  if (!ms) return 'Never';
  const diff = Date.now() - ms;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  2) return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  <  7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function formatFollowers(n: number): string {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function parseFollowers(str: string): number {
  if (!str) return 0;
  const n = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (str.toUpperCase().includes('K')) return n * 1_000;
  if (str.toUpperCase().includes('M')) return n * 1_000_000;
  return n;
}

function parseEngRate(str: string): number {
  return parseFloat(str.replace('%', '')) || 0;
}

export function applyFilters(creators: Competitor[], f: CreatorFilters): Competitor[] {
  return creators.filter(c => {
    if (f.niche.length > 0 && !f.niche.includes(c.niche)) return false;
    if (f.platform.length > 0 && !f.platform.includes('Instagram')) return false;
    if (f.status.length > 0) {
      const s = c.status === 'active' ? 'Active' : 'Paused';
      if (!f.status.includes(s)) return false;
    }
    const followers = parseFollowers(c.followers);
    if (f.followers === 'under-100k'  && (followers === 0 || followers >= 100_000)) return false;
    if (f.followers === '100k-500k'   && (followers < 100_000 || followers >= 500_000)) return false;
    if (f.followers === 'over-500k'   && followers < 500_000) return false;
    const following = (c as any).followsCount ?? 0;
    if (f.following === 'under-500' && (following === 0 || following >= 500)) return false;
    if (f.following === '500-5k'    && (following < 500 || following >= 5_000)) return false;
    if (f.following === 'over-5k'   && following < 5_000) return false;
    const posts = (c as any).postsCount ?? 0;
    if (f.posts === 'under-100' && (posts === 0 || posts >= 100)) return false;
    if (f.posts === '100-500'   && (posts < 100 || posts >= 500)) return false;
    if (f.posts === 'over-500'  && posts < 500) return false;
    const eng = parseEngRate(c.engagementRate);
    if (f.engRate === 'under-2' && (eng === 0 || eng >= 2)) return false;
    if (f.engRate === '2-5'     && (eng < 2 || eng >= 5)) return false;
    if (f.engRate === 'over-5'  && eng < 5) return false;
    if (f.score === 'low'  && c.score >= 50) return false;
    if (f.score === 'mid'  && (c.score < 50 || c.score >= 70)) return false;
    if (f.score === 'high' && c.score < 70) return false;
    const health = computeProfileHealth(c);
    if (f.health === 'critical' && health >= 25) return false;
    if (f.health === 'partial'  && (health < 25 || health >= 75)) return false;
    if (f.health === 'healthy'  && health < 75) return false;
    return true;
  });
}
