'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Ban, Check } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import type { ActiveJob } from './types';
import { PROVIDER_CFG, PROVIDER_COST_PER_SEC } from './types';
import { ModelAvatar, ProviderBadge, StatusBadge } from './atoms';
import { EtaCountdown } from './EtaCountdown';
import { cn } from '@/lib/utils';

interface Props {
  job:      ActiveJob;
  onRetry:  (id: Id<'contentGenJobs'>) => void;
  onCancel: (id: Id<'contentGenJobs'>) => void;
  selected: boolean;
  onToggle: () => void;
}

function estimateCost(job: ActiveJob): string | null {
  const rate = PROVIDER_COST_PER_SEC[job.provider];
  let secs: number | undefined;
  if (job.durationSec !== undefined) {
    secs = job.durationSec;
  } else if (job.etaSeconds !== undefined && job.progress !== undefined && job.progress > 0) {
    // Estimate total duration from progress + eta
    const elapsed = (job.etaSeconds / (1 - job.progress / 100)) * (job.progress / 100);
    secs = elapsed + job.etaSeconds;
  }
  if (secs === undefined) return null;
  return `$${(secs * rate).toFixed(2)}`;
}

export function ActiveJobCard({ job, onRetry, onCancel, selected, onToggle }: Props) {
  const { bar }   = PROVIDER_CFG[job.provider];
  const isGen     = job.status === 'Generating';
  const isFailed  = job.status === 'Failed';
  const isQueued  = job.status === 'Queued';
  const retries   = job.retryCount ?? 0;
  const costLabel = estimateCost(job);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex overflow-hidden rounded-xl transition-all cursor-pointer',
        selected && 'ring-2 ring-fuchsia-500 ring-offset-1',
      )}
      style={{
        border:           isFailed ? '1px solid #fecaca' : isGen ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(0,0,0,0.07)',
        backgroundColor:  isFailed ? '#fff8f8' : '#ffffff',
        boxShadow:        isGen ? '0 0 0 3px rgba(59,130,246,0.06), 0 2px 12px rgba(59,130,246,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onClick={onToggle}
    >
      {/* Provider accent bar */}
      <div className="w-[3px] flex-shrink-0 rounded-l-xl" style={{ backgroundColor: bar, opacity: isQueued ? 0.35 : 1 }} />

      {/* Selection checkbox */}
      <div className="flex items-center pl-3 pr-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button
          onClick={onToggle}
          className={cn(
            'w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all',
            selected
              ? 'bg-fuchsia-500 text-white'
              : 'border border-neutral-300 bg-white hover:border-fuchsia-400',
          )}
        >
          {selected && <Check size={10} strokeWidth={3} />}
        </button>
      </div>

      <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 min-w-0">
        {/* Header: avatar + name + badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
            <ModelAvatar name={job.modelName} />
            <div className="min-w-0">
              <p className="text-xs font-mono font-semibold text-neutral-800 truncate leading-snug" title={job.name}>{job.name}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-none hidden sm:block">{job.modelName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            {/* Retry count badge — only shown on Failed cards that have been retried */}
            {isFailed && retries > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                🔁 {retries}
              </span>
            )}
            <ProviderBadge provider={job.provider} />
            <StatusBadge  status={job.status} />
          </div>
        </div>

        {/* Scene */}
        <p className="text-xs text-neutral-500 leading-relaxed px-3 py-2.5 rounded-lg" style={{ backgroundColor: '#f5f5f4' }}>
          {job.scene}
        </p>

        {/* Progress bar - only when Generating */}
        {isGen && job.progress !== undefined && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Progress</span>
              <span className="text-[10px] font-semibold text-neutral-600 tabular-nums">{job.progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${job.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
              />
            </div>
          </div>
        )}

        {/* Footer: ETA + cost + actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-3">
            {!isFailed && job.etaSeconds !== undefined && <EtaCountdown initialSeconds={job.etaSeconds} />}
            {isFailed && <span className="text-xs text-red-400 font-medium">Generation failed</span>}
            {costLabel && (
              <span className="text-[11px] text-neutral-400 tabular-nums hidden sm:inline">est. {costLabel}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isQueued && (
              <button onClick={() => onCancel(job._id)} className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700 px-2.5 py-1 rounded-lg hover:bg-black/[0.05] transition-colors">
                <Ban size={11} /> Cancel
              </button>
            )}
            {isFailed && (
              <button onClick={() => onRetry(job._id)} className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg hover:brightness-110 active:scale-95 transition-all" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
                <RefreshCw size={11} /> Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
