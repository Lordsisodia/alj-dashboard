'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AnimatePresence } from 'framer-motion';
import { ListVideo, History } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { cn } from '@/lib/utils';
import type { ActiveJob } from './queue/types';
import { StatsStrip }    from './queue/StatsStrip';
import { ActiveJobCard } from './queue/ActiveJobCard';
import { HistorySection } from './queue/HistorySection';
import { SEED_ACTIVE, SEED_HISTORY } from './queue/seed';

// Convex - types auto-resolve after `npx convex dev` regenerates _generated/api.d.ts
const cgApi = api as any;

const TABS = [
  { id: 'active',  label: 'In Progress', icon: <ListVideo size={14} /> },
  { id: 'history', label: 'History',     icon: <History   size={14} /> },
] as const;
type Tab = (typeof TABS)[number]['id'];

export default function QueueFeaturePage() {
  const [tab, setTab] = useState<Tab>('active');

  const rawActive  = useQuery(cgApi.contentGen?.getActiveJobs)             ?? null;
  const rawHistory = useQuery(cgApi.contentGen?.getHistory, { limit: 50 }) ?? null;
  const retryMut   = useMutation(cgApi.contentGen?.retryJob);
  const cancelMut  = useMutation(cgApi.contentGen?.cancelJob);

  const activeJobs  = (rawActive  ?? SEED_ACTIVE)  as ActiveJob[];
  const historyJobs = rawHistory ?? SEED_HISTORY;

  const handleRetry  = (id: Id<'contentGenJobs'>) => retryMut?.({ jobId: id });
  const handleCancel = (id: Id<'contentGenJobs'>) => cancelMut?.({ jobId: id });

  return (
    <ContentPageShell
      icon={<ProductIcon product="content-gen" />}
      title="Content Gen Queue"
    >
      {/* Tab bar */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit" style={{ backgroundColor: '#f5f5f4' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
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

        {/* Active tab */}
        {tab === 'active' && (
          <>
            <StatsStrip jobs={activeJobs} />
            <AnimatePresence mode="popLayout">
              {activeJobs.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-12">No active jobs right now.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeJobs.map((job: ActiveJob) => (
                    <ActiveJobCard
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

        {/* History tab */}
        {tab === 'history' && (
          historyJobs.length === 0
            ? <p className="text-sm text-neutral-400 text-center py-12">No completed jobs yet.</p>
            : <HistorySection jobs={historyJobs} />
        )}
      </div>
    </ContentPageShell>
  );
}
