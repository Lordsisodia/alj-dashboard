// Single source of truth for all Intelligence helpers.
// Import from here - never define these inline in components.

const AVATAR_PALETTE = ['#ff0069','#833ab4','#4a9eff','#78c257','#fcaf45','#ff6b35','#06b6d4'];

export function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export interface NicheERMap {
  [niche: string]: number; // avg ER for niche
}

export function nicheERDelta(er: number, niche: string, nicheERMap: NicheERMap): string {
  const avg = nicheERMap[niche];
  if (avg == null || avg === 0) return '';
  const delta = er - avg;
  const sign  = delta >= 0 ? '+' : '';
  return `${sign}${(delta * 100).toFixed(1)}%`;
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1_000);
  if (s < 60)       return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60)       return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24)       return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7)        return `${d}d`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function daysLive(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 86_400_000);
  return d === 0 ? 'Today' : `${d}d`;
}

/** Deterministic avatar colour derived from handle string */
export function avatarColor(handle: string): string {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) hash = handle.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export function truncateId(id: string): string {
  return id.slice(-12).toUpperCase();
}

// ── Creator velocity ────────────────────────────────────────────────────────────

export interface CreatorStats {
  handle:         string;
  postsThisWeek: number;
  trendBuckets:  number[]; // [day-7, day-6, ..., day-0]
}

export function creatorVelocity(handle: string, stats: CreatorStats[]): { direction: 'up' | 'down' | 'same'; pct: number } {
  const s = stats.find(s => s.handle === handle);
  if (!s || s.trendBuckets.length < 14) return { direction: 'same', pct: 0 };

  const thisWeek  = s.trendBuckets.slice(-7).reduce((a, b) => a + b, 0);
  const lastWeek  = s.trendBuckets.slice(-14, -7).reduce((a, b) => a + b, 0);
  if (lastWeek === 0) return thisWeek > 0 ? { direction: 'up', pct: 100 } : { direction: 'same', pct: 0 };

  const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  if (pct > 5)  return { direction: 'up',   pct };
  if (pct < -5) return { direction: 'down', pct: Math.abs(pct) };
  return { direction: 'same', pct: 0 };
}

// ── Day grouping ────────────────────────────────────────────────────────────────

export interface DayGroup<T> {
  label: string; // e.g. "Apr 7 - Today"
  posts: T[];
}

/** Group items by day using a timestamp extractor function. */
export function groupByDay<T>(
  items: T[],
  getTimestamp: (item: T) => number,
): DayGroup<T>[] {
  const now = new Date();
  const todayStr     = now.toDateString();
  const yesterday    = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const ts  = getTimestamp(item);
    const key = new Date(ts).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  return Object.entries(groups)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([key, posts]) => {
      const d    = new Date(key);
      let label: string;
      if (d.toDateString() === todayStr) {
        label = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - Today`;
      } else if (d.toDateString() === yesterdayStr) {
        label = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - Yesterday`;
      } else {
        label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return { label, posts };
    });
}

/**
 * Returns a proxied image URL for Instagram CDN URLs.
 * Bypasses hotlink protection by routing through our server-side proxy
 * which spoofs the Instagram referrer header.
 */
export function igThumb(url: string): string {
  if (!url || !url.startsWith('http')) return url;           // CSS gradient - return as-is
  if (url.includes('localhost') || url.includes('127.0.0.1')) return url; // local
  if (url.includes('r2.dev') || url.includes('r2.cloudflarestorage.com')) return url; // R2 - no proxy needed
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}
