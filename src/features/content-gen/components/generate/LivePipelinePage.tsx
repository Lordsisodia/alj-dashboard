'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Hourglass, Loader2, XCircle } from 'lucide-react';

import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';

import { GeneratePipelineStrip } from './GeneratePipelineStrip';
import { ModelAvatar, ProviderBadge, StatusBadge } from '../queue/atoms';
import { PROVIDER_CFG } from '../queue/types';
import { ManualGenerateDrawer } from './ManualGenerateDrawer';

function LiveJobCard({ job, onRetry, onCancel }: {
  job: Doc<'contentGenJobs'>;
  onRetry: (id: Id<'contentGenJobs'>) => void;
  onCancel: (id: Id<'contentGenJobs'>) => void;
}) {
  const { bar } = PROVIDER_CFG[job.provider];
  const isGen = job.status === 'Generating';
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
        border: isFailed ? '1px solid #fecaca' : isGen ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(0,0,0,0.07)',
        backgroundColor: isFailed ? '#fff8f8' : '#ffffff',
        boxShadow: isGen ? '0 0 0 4px rgba(59,130,246,0.07), 0 2px 16px rgba(59,130,246,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
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
            <StatusBadge status={job.status} />
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

        {isFailed && job.errorMessage && (
          <p className="text-xs text-red-500">{job.errorMessage}</p>
        )}

        <div className="flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2">
            {isQueued && (
              <button onClick={() => onCancel(job._id)} className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700 px-2.5 py-1 rounded-lg hover:bg-black/[0.05] transition-colors">
                <XCircle size={11} /> Cancel
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <Hourglass size={28} className="text-neutral-200" />
      <p className="text-sm font-medium text-neutral-300">No active jobs</p>
      <p className="text-xs text-neutral-400">Approve a scene to kick off generation</p>
    </div>
  );
}

export default function LivePipelinePage() {
  const [manualOpen, setManualOpen] = useState(false);

  const active = useQuery(api.contentGen.getActiveJobs) ?? [];
  const history = useQuery(api.contentGen.getHistory, { limit: 50 }) ?? [];
  const retry = useMutation(api.contentGen.retryJob);
  const cancel = useMutation(api.contentGen.cancelJob);

  const startOfDay = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }, []);

  const live = active.filter(j => j.status === 'Generating').length;
  const ready = active.filter(j => j.status === 'Queued').length;
  const failed = active.filter(j => j.status === 'Failed').length;
  const completedToday = useMemo(
    () => history.filter(j => (j.completedAt ?? 0) > startOfDay).length,
    [history, startOfDay],
  );
  const lastCompletedAt = history[0]?.completedAt ?? 0;

  return (
    <div className="p-5 flex flex-col gap-4">
      <GeneratePipelineStrip
        readyCount={ready}
        inFlightCount={live}
        completedTodayCount={completedToday}
        lastCompletedAt={lastCompletedAt || undefined}
      />

      <div className="flex justify-end">
        <button
          onClick={() => setManualOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:brightness-105 transition-all"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          <Plus size={12} /> Manual Generate
        </button>
      </div>

      {active.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          <AnimatePresence mode="popLayout">
            {active.map(job => (
              <LiveJobCard
                key={job._id}
                job={job}
                onRetry={id => retry({ jobId: id })}
                onCancel={id => cancel({ jobId: id })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {manualOpen && <ManualGenerateDrawer onClose={() => setManualOpen(false)} />}
    </div>
  );
}
