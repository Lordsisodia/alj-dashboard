'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AnimatePresence, motion } from 'framer-motion';
import { ListVideo, History, Ban, RefreshCw, Check, X, CheckCheck, Plus } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { cn } from '@/lib/utils';
import type { ActiveJob, Provider, JobStatus } from './queue/types';
import { StatsStrip }    from './queue/StatsStrip';
import { ActiveJobCard } from './queue/ActiveJobCard';
import { HistorySection } from './queue/HistorySection';
import { NewJobModal } from './queue/NewJobModal';
import { SEED_ACTIVE, SEED_HISTORY } from './queue/seed';

// Convex - types auto-resolve after `npx convex dev` regenerates _generated/api.d.ts
const cgApi = api as any;

const TABS = [
  { id: 'active',  label: 'In Progress', icon: <ListVideo size={14} /> },
  { id: 'history', label: 'History',     icon: <History   size={14} /> },
] as const;
type Tab = (typeof TABS)[number]['id'];

const STATUS_FILTERS: { label: string; value: JobStatus | 'All' }[] = [
  { label: 'All',        value: 'All'        },
  { label: 'Generating', value: 'Generating' },
  { label: 'Queued',     value: 'Queued'     },
  { label: 'Failed',     value: 'Failed'     },
];

const PROVIDER_FILTERS: { label: string; value: Provider | 'All' }[] = [
  { label: 'All',        value: 'All'        },
  { label: 'FLUX',       value: 'FLUX'       },
  { label: 'Kling',      value: 'Kling'      },
  { label: 'Higgsfield', value: 'Higgsfield' },
];

function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all',
            value === opt.value
              ? 'bg-neutral-800 text-white'
              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function QueueFeaturePage() {
  const [tab, setTab]                 = useState<Tab>('active');
  const [statusFilter, setStatus]     = useState<JobStatus | 'All'>('All');
  const [providerFilter, setProvider] = useState<Provider | 'All'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const rawActive  = useQuery(cgApi.contentGen?.getActiveJobs)             ?? null;
  const rawHistory = useQuery(cgApi.contentGen?.getHistory, { limit: 50 }) ?? null;
  const retryMut   = useMutation(cgApi.contentGen?.retryJob);
  const cancelMut  = useMutation(cgApi.contentGen?.cancelJob);
  const reviewMut  = useMutation(cgApi.contentGen?.submitForReview);
  const outcomeMut = useMutation(cgApi.contentGen?.updateOutcome);

  const allActive  = (rawActive  ?? SEED_ACTIVE)  as ActiveJob[];
  const allHistory = rawHistory ?? SEED_HISTORY;

  // Apply status + provider filters to active jobs
  const activeJobs = useMemo(() => allActive.filter(job => {
    const statusOk   = statusFilter   === 'All' || job.status   === statusFilter;
    const providerOk = providerFilter === 'All' || job.provider === providerFilter;
    return statusOk && providerOk;
  }), [allActive, statusFilter, providerFilter]);

  // Apply provider filter to history (status is always "Done")
  const historyJobs = useMemo(() => allHistory.filter((job: any) =>
    providerFilter === 'All' || job.provider === providerFilter,
  ), [allHistory, providerFilter]);

  const handleRetry  = (id: Id<'contentGenJobs'>) => retryMut?.({ jobId: id });
  const handleCancel = (id: Id<'contentGenJobs'>) => cancelMut?.({ jobId: id });
  const handleReview = (id: Id<'contentGenJobs'>) => reviewMut?.({ jobId: id });

  const toggleActive  = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleHistory = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAllActive  = () => setSelectedIds(new Set(activeJobs.map((j: ActiveJob) => j._id)));
  const selectAllHistory = () => setSelectedIds(new Set(historyJobs.map((j: any) => j._id)));
  const clearSelection   = () => setSelectedIds(new Set());

  const bulkRetry   = () => { selectedIds.forEach(id => retryMut?.({ jobId: id as Id<'contentGenJobs'> })); clearSelection(); };
  const bulkCancel  = () => { selectedIds.forEach(id => cancelMut?.({ jobId: id as Id<'contentGenJobs'> })); clearSelection(); };
  const bulkApprove = () => { selectedIds.forEach(id => outcomeMut?.({ jobId: id as Id<'contentGenJobs'>, outcome: 'Approved' })); clearSelection(); };
  const bulkReject  = () => { selectedIds.forEach(id => outcomeMut?.({ jobId: id as Id<'contentGenJobs'>, outcome: 'Rejected' })); clearSelection(); };

  const selCount = selectedIds.size;
  const showBulk = selCount > 0;

  const [showNewJobModal, setShowNewJobModal] = useState(false);

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="content-gen" />}
        title="Content Gen Queue"
        actionLabel="New Job"
        actionIcon={<Plus size={14} />}
        onAction={() => setShowNewJobModal(true)}
      >
        {/* Tab bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: '#f5f5f4' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); clearSelection(); }}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  tab === t.id
                    ? 'bg-white text-neutral-800 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-600',
                )}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
          {tab === 'active' && activeJobs.length > 0 && (
            <button
              onClick={selectedIds.size === activeJobs.length ? clearSelection : selectAllActive}
              className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-lg hover:bg-black/[0.05] transition-colors"
            >
              <CheckCheck size={12} />
              {selectedIds.size === activeJobs.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
          {tab === 'history' && historyJobs.length > 0 && (
            <button
              onClick={selectedIds.size === historyJobs.length ? clearSelection : selectAllHistory}
              className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-lg hover:bg-black/[0.05] transition-colors"
            >
              <CheckCheck size={12} />
              {selectedIds.size === historyJobs.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {tab === 'active' && (
            <>
              <div className="flex gap-1 overflow-x-auto snap-x pb-1 -mb-1 flex-nowrap min-w-0">
                <FilterChips options={STATUS_FILTERS} value={statusFilter} onChange={setStatus} />
              </div>
              <div className="h-4 w-px bg-neutral-200 flex-shrink-0 hidden sm:block" />
            </>
          )}
          <div className="flex gap-1 overflow-x-auto snap-x pb-1 -mb-1 flex-nowrap min-w-0">
            <FilterChips options={PROVIDER_FILTERS} value={providerFilter} onChange={setProvider} />
          </div>
        </div>

        {/* Active tab */}
        {tab === 'active' && (
          <>
            <StatsStrip jobs={allActive} />
            <AnimatePresence mode="popLayout">
              {activeJobs.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-12">No jobs match the selected filters.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeJobs.map((job: ActiveJob) => (
                    <ActiveJobCard
                      key={job._id}
                      job={job}
                      onRetry={handleRetry}
                      onCancel={handleCancel}
                      selected={selectedIds.has(job._id)}
                      onToggle={() => toggleActive(job._id)}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* History tab */}
        {tab === 'history' && (
          historyJobs.length === 0
            ? <p className="text-sm text-neutral-400 text-center py-12">No completed jobs match the selected filters.</p>
            : <HistorySection jobs={historyJobs} onReview={handleReview} selectedIds={selectedIds} onToggle={toggleHistory} />
        )}
      </ContentPageShell>

      <NewJobModal open={showNewJobModal} onClose={() => setShowNewJobModal(false)} />

      {/* Bulk action bar — slides up when items are selected */}
      <AnimatePresence>
        {showBulk && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border border-black/10"
            style={{ backgroundColor: '#1a1a1a', minWidth: 360 }}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: '#f0abfc', color: '#701a75' }}>
              {selCount}
            </span>
            <span className="text-xs font-medium text-white/80 flex-shrink-0">selected</span>

            <div className="w-px h-4 bg-white/20 flex-shrink-0 mx-1" />

            {tab === 'active' && (
              <>
                <button onClick={bulkCancel} className="flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <Ban size={13} /> Cancel
                </button>
                <button onClick={bulkRetry} className="flex items-center gap-1.5 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <RefreshCw size={13} /> Retry
                </button>
              </>
            )}
            {tab === 'history' && (
              <>
                <button onClick={bulkApprove} className="flex items-center gap-1.5 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <Check size={13} /> Approve
                </button>
                <button onClick={bulkReject} className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white/90 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X size={13} /> Reject
                </button>
              </>
            )}

            <button onClick={clearSelection} className="ml-1 flex items-center justify-center w-6 h-6 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
