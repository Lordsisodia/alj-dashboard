'use client';

import { Sparkles } from 'lucide-react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { ConvexJob, ConvexModel } from './types';
import { JobCard } from './JobCard';

interface Props {
  jobs: ConvexJob[];
  models: ConvexModel[];
  generatingCount: number;
  onDismiss: (id: Id<'ideas'>) => void;
}

export function RecentJobsPanel({ jobs, models, generatingCount, onDismiss }: Props) {
  return (
    <div className="w-72 flex-shrink-0 flex flex-col overflow-hidden">
      <div className="px-4 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Recent Jobs</p>
        {generatingCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {generatingCount} running
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Sparkles size={22} className="text-neutral-200" />
            <p className="text-xs text-neutral-300 select-none text-center">
              No jobs yet -<br />write a brief to start
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {jobs.map(job => (
              <JobCard key={job._id} job={job} models={models} onDismiss={onDismiss} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
