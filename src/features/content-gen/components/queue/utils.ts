import type { HistoryJob } from './types';

export function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function fmtRelTime(ts: number): string {
  const diff = Date.now() - ts;
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor(diff / 60_000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${Math.max(1, m)}m ago`;
}

const _today     = () => new Date().toDateString();
const _yesterday = () => new Date(Date.now() - 86_400_000).toDateString();

export function groupByDate(jobs: HistoryJob[]): { label: string; items: HistoryJob[] }[] {
  const today     = _today();
  const yesterday = _yesterday();
  const map = new Map<string, HistoryJob[]>();

  for (const job of jobs) {
    const d = new Date(job.completedAt ?? 0).toDateString();
    const label =
      d === today     ? 'Today' :
      d === yesterday ? 'Yesterday' :
      new Date(job.completedAt ?? 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(job);
  }

  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}
