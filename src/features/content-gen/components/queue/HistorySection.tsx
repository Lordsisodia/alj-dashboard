'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight, Check } from 'lucide-react';
import type { HistoryJob } from './types';
import { PROVIDER_CFG, PROVIDER_COST_PER_SEC } from './types';
import { ProviderBadge, OutcomeBadge } from './atoms';
import { fmtDuration, fmtRelTime, groupByDate } from './utils';
import { cn } from '@/lib/utils';

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-3 first:mt-0">
      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest flex-shrink-0">{label}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
    </div>
  );
}

function VideoThumb({ videoUrl, bar, thumb }: { videoUrl: string; bar: string; thumb: string }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleClick() {
    if (!playing) {
      videoRef.current?.play();
      setPlaying(true);
    }
  }

  return (
    <div
      className="w-16 h-10 rounded-lg flex-shrink-0 relative overflow-hidden cursor-pointer"
      style={{ background: `linear-gradient(135deg, ${thumb}cc, ${thumb}55)` }}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover rounded"
        muted
        playsInline
        preload="metadata"
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center">
            <Play size={8} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: bar }} />
    </div>
  );
}

function HistoryRow({ job, onReview, selected, onToggle }: { job: HistoryJob; onReview: (id: HistoryJob['_id']) => void; selected: boolean; onToggle: () => void }) {
  const { bar } = PROVIDER_CFG[job.provider];
  const thumb    = job.thumbnailColor ?? '#888';
  const videoUrl = job.generatedVideoR2Url ?? job.generatedVideoUrl;
  const isPendingReview = job.outcome === 'Pending Review';
  const costLabel = job.durationSec !== undefined
    ? `$${(job.durationSec * PROVIDER_COST_PER_SEC[job.provider]).toFixed(2)}`
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-black/[0.025] cursor-pointer',
        selected && 'ring-2 ring-fuchsia-500 ring-offset-1',
      )}
      style={{ border: '1px solid rgba(0,0,0,0.06)' }}
      onClick={onToggle}
    >
      {/* Selection checkbox */}
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        className={cn(
          'w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all',
          selected
            ? 'bg-fuchsia-500 text-white'
            : 'border border-neutral-300 bg-white hover:border-fuchsia-400',
        )}
      >
        {selected && <Check size={10} strokeWidth={3} />}
      </button>
      {/* Thumbnail — video player if available, else color swatch */}
      {videoUrl ? (
        <VideoThumb videoUrl={videoUrl} bar={bar} thumb={thumb} />
      ) : (
        <div className="w-12 sm:w-16 h-8 sm:h-10 rounded-lg flex-shrink-0 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${thumb}cc, ${thumb}55)` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center">
              <Play size={8} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: bar }} />
        </div>
      )}

      {/* Name + model */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-xs font-mono font-semibold text-neutral-700 truncate leading-snug" title={job.name}>{job.name}</span>
        <span className="text-[11px] text-neutral-400 leading-none hidden sm:inline">
          {job.modelName}
          {job.durationSec !== undefined && <> · <span className="tabular-nums">{fmtDuration(job.durationSec)}</span></>}
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <ProviderBadge provider={job.provider} />
        {job.outcome && <OutcomeBadge outcome={job.outcome} />}

        {costLabel && (
          <span className="text-[11px] font-medium text-neutral-400 tabular-nums flex-shrink-0">
            {costLabel}
          </span>
        )}

        <span className="text-[11px] text-neutral-400 flex-shrink-0 tabular-nums w-14 text-right">
          {job.completedAt ? fmtRelTime(job.completedAt) : '-'}
        </span>
      </div>

      {/* Mobile: compact badges in single line */}
      <div className="flex sm:hidden items-center gap-1.5 flex-shrink-0">
        <ProviderBadge provider={job.provider} />
        {job.outcome && <OutcomeBadge outcome={job.outcome} />}
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onReview(job._id)}
          disabled={isPendingReview}
          className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-lg hover:bg-black/[0.06] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowUpRight size={11} /> {isPendingReview ? 'In Review' : 'Review'}
        </button>
      </div>
    </motion.div>
  );
}

interface Props {
  jobs: HistoryJob[];
  onReview: (id: HistoryJob['_id']) => void;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function HistorySection({ jobs, onReview, selectedIds, onToggle }: Props) {
  const groups = groupByDate(jobs);
  return (
    <div>
      {groups.map(({ label, items }) => (
        <div key={label}>
          <DateDivider label={label} />
          <div className="flex flex-col gap-1.5">
            {items.map(job => (
              <HistoryRow
                key={job._id}
                job={job}
                onReview={onReview}
                selected={selectedIds.has(job._id)}
                onToggle={() => onToggle(job._id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
