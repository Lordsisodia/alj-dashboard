'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import { PROVIDER_CFG } from './types';
import type { ActiveJob } from './types';
import { ModelAvatar, ProviderBadge, StatusBadge } from './atoms';
import { EtaCountdown } from './EtaCountdown';

export function LiveJobCard({ job, onRetry, onCancel }: {
  job: ActiveJob;
  onRetry: (id: Id<'contentGenJobs'>) => void;
  onCancel: (id: Id<'contentGenJobs'>) => void;
}) {
  const { bar }  = PROVIDER_CFG[job.provider];
  const isGen    = job.status === 'Generating';
  const isFailed = job.status === 'Failed';
  const isQueued = job.status === 'Queued';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="flex overflow-hidden rounded-2xl"
      style={{
        border:          isFailed ? '1px solid #fecaca' : isGen ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(0,0,0,0.07)',
        backgroundColor: isFailed ? '#fff8f8' : '#ffffff',
        boxShadow:       isGen ? '0 0 0 4px rgba(59,130,246,0.07), 0 2px 16px rgba(59,130,246,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div className="w-1 flex-shrink-0" style={{ backgroundColor: bar, opacity: isQueued ? 0.3 : 1 }} />
      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ModelAvatar name={job.modelName} />
            <div className="min-w-0">
              <p className="text-xs font-mono font-semibold text-neutral-800 truncate leading-snug" title={job.name}>{job.name}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{job.modelName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            <ProviderBadge provider={job.provider} />
            <StatusBadge   status={job.status} />
          </div>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed px-3 py-2.5 rounded-xl" style={{ backgroundColor: '#f5f5f4' }}>
          {job.scene}
        </p>
        {isGen && job.progress !== undefined && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Progress</span>
              <span className="text-[10px] font-semibold text-neutral-600 tabular-nums">{job.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${job.progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            {!isFailed && job.etaSeconds !== undefined && <EtaCountdown initialSeconds={job.etaSeconds} />}
            {isFailed && <span className="text-xs text-red-400 font-medium">Generation failed</span>}
          </div>
          <div className="flex items-center gap-2">
            {isQueued && (
              <button onClick={() => onCancel(job._id)} className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700 px-2.5 py-1 rounded-lg hover:bg-black/[0.05] transition-colors">
                <Loader2 size={11} /> Cancel
              </button>
            )}
            {isFailed && (
              <button onClick={() => onRetry(job._id)} className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg hover:brightness-110 active:scale-95 transition-all" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
                <Loader2 size={11} /> Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
