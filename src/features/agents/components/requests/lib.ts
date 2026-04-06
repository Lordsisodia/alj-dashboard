import type { RequestStatus, Priority } from '../../types';

// ── Filter / form constants ────────────────────────────────────────

export type FilterOption = 'All' | RequestStatus;

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
export const FILTERS: FilterOption[] = ['All', 'Queued', 'In Progress', 'Delivered'];

// ── DisplayRequest - union of Convex doc shape + local seed shape ──

export interface DisplayRequest {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  requestedBy: string;
  submittedAt?: number; // Convex docs
  date?: string;        // local constants fallback
  status: RequestStatus;
  eta: string;
  priority: Priority;
}

// ── Status badge config ────────────────────────────────────────────

export const STATUS_CFG: Record<RequestStatus, { bg: string; color: string; pulse: boolean }> = {
  Queued:        { bg: 'rgba(251,191,36,0.12)', color: '#92640a',  pulse: false },
  'In Progress': { bg: 'rgba(74,158,255,0.12)', color: '#1d6eb5',  pulse: true  },
  Delivered:     { bg: 'rgba(120,194,87,0.12)', color: '#4a8a2d',  pulse: false },
};

// ── SLA helpers ────────────────────────────────────────────────────

export function resolveTs(r: DisplayRequest): number {
  if (r.submittedAt !== undefined) return r.submittedAt;
  if (r.date) return new Date(r.date).getTime();
  return Date.now();
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function getSla(submittedAt: number) {
  const deadline = submittedAt + 72 * 60 * 60 * 1000;
  const diffMs   = deadline - Date.now();
  const diffH    = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
  const overdue  = diffMs < 0;
  const urgent   = !overdue && diffH < 24;
  return {
    label: overdue ? `${diffH}h overdue` : `${diffH}h left`,
    overdue,
    urgent,
    bg:    overdue ? 'rgba(220,38,38,0.1)' : urgent ? 'rgba(234,88,12,0.1)' : 'rgba(251,191,36,0.12)',
    color: overdue ? '#dc2626'             : urgent ? '#ea580c'             : '#92640a',
  };
}
