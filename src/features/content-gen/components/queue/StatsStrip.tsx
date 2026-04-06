'use client';

import type { ActiveJob } from './types';

const STATS = [
  { key: 'Generating' as const, label: 'Generating', dot: '#3b82f6', pulse: true  },
  { key: 'Queued'     as const, label: 'Queued',     dot: '#9ca3af', pulse: false },
  { key: 'Failed'     as const, label: 'Failed',     dot: '#ef4444', pulse: false },
];

interface Props { jobs: ActiveJob[] }

export function StatsStrip({ jobs }: Props) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {STATS.map(({ key, label, dot, pulse }) => {
        const n = jobs.filter(j => j.status === key).length;
        return (
          <div key={key} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#f5f5f4' }}>
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              {pulse && n > 0 && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: dot }} />
              )}
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: dot }} />
            </span>
            <span className="text-xs font-semibold text-neutral-700 tabular-nums">{n}</span>
            <span className="text-xs text-neutral-400">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
