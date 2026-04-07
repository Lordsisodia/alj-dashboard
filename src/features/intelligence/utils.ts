// Single source of truth for all Intelligence helpers.
// Import from here - never define these inline in components.

const AVATAR_PALETTE = ['#ff0069','#833ab4','#4a9eff','#78c257','#fcaf45','#ff6b35','#06b6d4'];

export function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const d    = Math.floor(diff / 86_400_000);
  if (d === 0) {
    const h = Math.floor(diff / 3_600_000);
    return h === 0 ? 'Just now' : `${h}h`;
  }
  if (d < 30) return `${d}d`;
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
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}
