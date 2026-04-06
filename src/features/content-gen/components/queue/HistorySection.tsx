'use client';

import { motion } from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';
import type { HistoryJob } from './types';
import { PROVIDER_CFG } from './types';
import { ProviderBadge, OutcomeBadge } from './atoms';
import { fmtDuration, fmtRelTime, groupByDate } from './utils';

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-3 first:mt-0">
      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest flex-shrink-0">{label}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
    </div>
  );
}

function HistoryRow({ job }: { job: HistoryJob }) {
  const { bar } = PROVIDER_CFG[job.provider];
  const thumb   = job.thumbnailColor ?? '#888';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-black/[0.025] cursor-default"
      style={{ border: '1px solid rgba(0,0,0,0.06)' }}
    >
      {/* Thumbnail swatch - simulates a video frame */}
      <div className="w-16 h-10 rounded-lg flex-shrink-0 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${thumb}cc, ${thumb}55)` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center">
            <Play size={8} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: bar }} />
      </div>

      {/* Name + model + duration */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-xs font-mono font-semibold text-neutral-700 truncate leading-snug" title={job.name}>{job.name}</span>
        <span className="text-[11px] text-neutral-400 leading-none">
          {job.modelName}
          {job.durationSec !== undefined && <> · <span className="tabular-nums">{fmtDuration(job.durationSec)}</span></>}
        </span>
      </div>

      <ProviderBadge provider={job.provider} />
      {job.outcome && <OutcomeBadge outcome={job.outcome} />}

      <span className="text-[11px] text-neutral-400 flex-shrink-0 hidden lg:block tabular-nums w-14 text-right">
        {job.completedAt ? fmtRelTime(job.completedAt) : '-'}
      </span>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-lg hover:bg-black/[0.06] transition-colors">
          <ArrowUpRight size={11} /> Review
        </button>
      </div>
    </motion.div>
  );
}

interface Props { jobs: HistoryJob[] }

export function HistorySection({ jobs }: Props) {
  const groups = groupByDate(jobs);
  return (
    <div>
      {groups.map(({ label, items }) => (
        <div key={label}>
          <DateDivider label={label} />
          <div className="flex flex-col gap-1.5">
            {items.map(job => <HistoryRow key={job._id} job={job} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
