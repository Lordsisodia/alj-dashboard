'use client';

import type { Id } from '@/convex/_generated/dataModel';
import type { ConvexJob, ConvexModel } from '../generate/types';
import { JobCard } from '../generate/JobCard';

interface Props {
  jobs: ConvexJob[];
  models: ConvexModel[];
  activeLabel?: string;
  historyLabel?: string;
  onDismiss: (id: Id<'ideas'>) => void;
}

export function JobList({ jobs, models, activeLabel = 'In Progress', historyLabel = 'History', onDismiss }: Props) {
  const active  = jobs.filter(j => j.status === 'generating');
  const history = jobs.filter(j => j.status !== 'generating');

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{activeLabel}</p>
      </div>

      {active.length === 0 ? (
        <div className="flex items-center justify-center h-16 rounded-2xl text-xs text-neutral-300 select-none" style={{ backgroundColor: '#f5f5f4' }}>
          No active jobs
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {active.map(job => <JobCard key={job._id} job={job} models={models} onDismiss={onDismiss} />)}
        </div>
      )}

      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mt-2 mb-1">{historyLabel}</p>

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
  );
}
