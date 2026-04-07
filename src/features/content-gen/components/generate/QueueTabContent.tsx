'use client';

import type { Id } from '@/convex/_generated/dataModel';
import type { ConvexJob, ConvexModel } from './types';
import { JobCard } from './JobCard';

interface Props {
  jobs: ConvexJob[];
  models: ConvexModel[];
  generatingCount: number;
  onDismiss: (id: Id<'ideas'>) => void;
}

export function QueueTabContent({ jobs, models, generatingCount, onDismiss }: Props) {
  const active  = jobs.filter(j => j.status === 'generating');
  const history = jobs.filter(j => j.status !== 'generating');

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col gap-3 max-w-2xl mx-auto">

        <div className="flex items-center gap-2 mb-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">In Progress</p>
          {generatingCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />}
        </div>

        {active.length === 0 ? (
          <div className="flex items-center justify-center h-16 rounded-2xl text-xs text-neutral-300 select-none mb-2" style={{ backgroundColor: '#f5f5f4' }}>
            No active jobs
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-2">
            {active.map(job => <JobCard key={job._id} job={job} models={models} onDismiss={onDismiss} />)}
          </div>
        )}

        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mt-2 mb-1">History</p>

        {history.length === 0 ? (
          <div className="flex items-center justify-center h-16 rounded-2xl text-xs text-neutral-300 select-none" style={{ backgroundColor: '#f5f5f4' }}>
            No history yet
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map(job => <JobCard key={job._id} job={job} models={models} onDismiss={onDismiss} />)}
          </div>
        )}

      </div>
    </div>
  );
}
