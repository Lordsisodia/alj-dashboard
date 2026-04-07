'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Film, Waves, CheckCircle2, XCircle, Hourglass, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { SEED_ACTIVE, SEED_HISTORY } from '../queue/seed';
import { PROVIDER_CFG } from '../queue/types';
import type { ActiveJob } from '../queue/types';
import { ModelAvatar, ProviderBadge, StatusBadge } from '../queue/atoms';
import { EtaCountdown } from '../queue/EtaCountdown';
import { StatsStrip } from '../queue/StatsStrip';
import { HistorySection } from '../queue/HistorySection';

// api cast - Convex types generated separately
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cgApi: any = null; // replaced by real api import once Convex types are stable

const TABS = [
  { id: 'live',    label: 'Live',    icon: <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" /></span> },
  { id: 'history', label: 'History', icon: null },
] as const;

type Tab = 'live' | 'history';

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === 'FLUX')       return <Zap size={11} />;
  if (provider === 'Kling')      return <Film size={11} />;
  if (provider === 'Higgsfield') return <Waves size={11} />;
  return null;
}

function LiveJobCard({ job, onRetry, onCancel }: {
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
      {/* Provider accent bar */}
      <div className="w-1 flex-shrink-0" style={{ backgroundColor: bar, opacity: isQueued ? 0.3 : 1 }} />

      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
        {/* Header */}
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

        {/* Scene */}
        <p className="text-xs text-neutral-500 leading-relaxed px-3 py-2.5 rounded-xl" style={{ backgroundColor: '#f5f5f4' }}>
          {job.scene}
        </p>

        {/* Animated progress - Generating only */}
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

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            {!isFailed && job.etaSeconds !== undefined && <EtaCountdown initialSeconds={job.etaSeconds} />}
            {isFailed && <span className="text-xs text-red-400 font-medium">Generation failed</span>}
          </div>
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

export default function LivePipelinePage() {
  const [tab, setTab] = useState<Tab>('live');

  // Convex - falls back to seed until real API is wired
  const activeJobs  = SEED_ACTIVE  as ActiveJob[];
  const historyJobs = SEED_HISTORY;

  const handleRetry  = (_id: Id<'contentGenJobs'>) => {};
  const handleCancel = (_id: Id<'contentGenJobs'>) => {};

  const generatingCount = activeJobs.filter(j => j.status === 'Generating').length;

  return (
    <div className="p-5">
      <div className="flex items-center gap-1 mb-4">
        <button
          onClick={() => setTab('live')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            tab === 'live' ? 'text-white' : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]'
          )}
          style={tab === 'live' ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : undefined}
        >
          {generatingCount > 0 && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
            </span>
          )}
          Live
        </button>
        <button
          onClick={() => setTab('history')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            tab === 'history' ? 'text-white' : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]'
          )}
          style={tab === 'history' ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : undefined}
        >
          History
        </button>
      </div>
        {tab === 'live' && (
          <>
            <StatsStrip jobs={activeJobs} />
            <AnimatePresence mode="popLayout">
              {activeJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-48 gap-3"
                >
                  <Hourglass size={28} className="text-neutral-200" />
                  <p className="text-sm font-medium text-neutral-300">No active jobs - add scenes to the queue</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-3 max-w-2xl">
                  {activeJobs.map(job => (
                    <LiveJobCard
                      key={job._id}
                      job={job}
                      onRetry={handleRetry}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </>
        )}

        {tab === 'history' && (
          historyJobs.length === 0
            ? <p className="text-sm text-neutral-400 text-center py-12">No completed jobs yet.</p>
            : <div className="max-w-2xl"><HistorySection jobs={historyJobs} /></div>
        )}
      </div>
  );
}
