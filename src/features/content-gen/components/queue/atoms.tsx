'use client';

import { Hourglass, Loader2, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROVIDER_CFG, MODEL_HUE } from './types';
import type { Provider, JobStatus, Outcome } from './types';

export function ProviderBadge({ provider }: { provider: Provider }) {
  const { badgeBg, badgeText } = PROVIDER_CFG[provider];
  return (
    <span
      className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: badgeBg, color: badgeText }}
    >
      {provider}
    </span>
  );
}

const STATUS_CFG: Record<JobStatus, { icon: React.ReactNode; label: string; cls: string }> = {
  Queued:     { icon: <Hourglass size={10} />,                         label: 'Queued',     cls: 'text-neutral-500 bg-neutral-100' },
  Generating: { icon: <Loader2  size={10} className="animate-spin" />, label: 'Generating', cls: 'text-blue-600 bg-blue-50' },
  Done:       { icon: <CheckCircle2 size={10} />,                       label: 'Done',       cls: 'text-emerald-600 bg-emerald-50' },
  Failed:     { icon: <XCircle size={10} />,                            label: 'Failed',     cls: 'text-red-500 bg-red-50' },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const { icon, label, cls } = STATUS_CFG[status];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', cls)}>
      {icon}{label}
    </span>
  );
}

const OUTCOME_CFG: Record<Outcome, { icon: React.ReactNode; cls: string }> = {
  'Approved':       { icon: <ThumbsUp   size={10} />, cls: 'text-emerald-600 bg-emerald-50' },
  'Rejected':       { icon: <ThumbsDown size={10} />, cls: 'text-red-500 bg-red-50' },
  'Pending Review': { icon: <Clock      size={10} />, cls: 'text-amber-600 bg-amber-50' },
};

export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const { icon, cls } = OUTCOME_CFG[outcome];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', cls)}>
      {icon}{outcome}
    </span>
  );
}

export function ModelAvatar({ name }: { name: string }) {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white select-none"
      style={{ backgroundColor: MODEL_HUE[name] ?? '#a78bfa' }}
    >
      {name.charAt(0)}
    </div>
  );
}
