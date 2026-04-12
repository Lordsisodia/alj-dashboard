'use client';

import { useMemo } from 'react';
import type { ActiveJob, Provider } from './types';

const PROVIDERS: Provider[] = ['FLUX', 'Kling', 'Higgsfield'];

const STATS = [
  { key: 'Generating' as const, label: 'Generating', dot: '#3b82f6', pulse: true  },
  { key: 'Queued'     as const, label: 'Queued',     dot: '#9ca3af', pulse: false },
  { key: 'Failed'     as const, label: 'Failed',     dot: '#ef4444', pulse: false },
];

interface Props { jobs: ActiveJob[] }

export function StatsStrip({ jobs }: Props) {
  const providerStats = useMemo(() => {
    const stats: Record<Provider, { total: number; done: number; rate: number }> = {
      FLUX:       { total: 0, done: 0, rate: 0 },
      Kling:      { total: 0, done: 0, rate: 0 },
      Higgsfield: { total: 0, done: 0, rate: 0 },
    };

    jobs.forEach(job => {
      if (job.provider in stats) {
        stats[job.provider].total++;
        if (job.status === 'Done') {
          stats[job.provider].done++;
        }
      }
    });

    PROVIDERS.forEach(p => {
      if (stats[p].total > 0) {
        stats[p].rate = Math.round((stats[p].done / stats[p].total) * 100);
      }
    });

    return stats;
  }, [jobs]);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
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

      {/* Provider success rate badges */}
      {PROVIDERS.map(p => {
        const { total, done, rate } = providerStats[p];
        if (total === 0) return null;
        return (
          <div key={p} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: '#f5f5f4' }}>
            <span className="text-xs font-semibold text-neutral-700">{p}</span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">{rate}%</span>
            {rate === 100 && <span className="text-green-600 text-xs">✅</span>}
          </div>
        );
      })}
    </div>
  );
}
