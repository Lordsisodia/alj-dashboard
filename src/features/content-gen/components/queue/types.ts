import type { Id } from '@/convex/_generated/dataModel';

export type Provider  = 'FLUX' | 'Kling' | 'Higgsfield';
export type JobStatus = 'Queued' | 'Generating' | 'Done' | 'Failed';
export type Outcome   = 'Approved' | 'Rejected' | 'Pending Review';

export interface ActiveJob {
  _id:        Id<'contentGenJobs'>;
  name:       string;
  modelName:  string;
  scene:      string;
  provider:   Provider;
  status:     JobStatus;
  etaSeconds?: number;
  progress?:   number;
  createdAt:  number;
}

export interface HistoryJob {
  _id:            Id<'contentGenJobs'>;
  name:           string;
  modelName:      string;
  provider:       Provider;
  outcome?:       Outcome;
  completedAt?:   number;
  durationSec?:   number;
  thumbnailColor?: string;
}

// Provider colour families - amber=FLUX, violet=Kling, emerald=Higgsfield.
// Consistent across every badge, accent bar, and thumbnail strip.
export const PROVIDER_CFG = {
  FLUX:       { bar: '#f59e0b', badgeBg: '#fef3c7', badgeText: '#b45309' },
  Kling:      { bar: '#8b5cf6', badgeBg: '#ede9fe', badgeText: '#7c3aed' },
  Higgsfield: { bar: '#10b981', badgeBg: '#d1fae5', badgeText: '#047857' },
} as const;

export const MODEL_HUE: Record<string, string> = {
  Tyler: '#f97316',
  Ren:   '#14b8a6',
  Ella:  '#3b82f6',
  Amam:  '#f59e0b',
};
