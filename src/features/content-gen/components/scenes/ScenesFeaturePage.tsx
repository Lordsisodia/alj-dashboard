'use client';

import { useState, useMemo } from 'react';
import { Filter, Sparkles } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { SceneCard } from './SceneCard';
import type { SceneStatus } from './types';

function getDayLabel(ts: number): string {
  const today = new Date();
  const d     = new Date(ts);
  const diff  = Math.floor((today.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

const STATUS_FILTERS: { id: SceneStatus | 'all'; label: string }[] = [
  { id: 'all',        label: 'All'        },
  { id: 'Pending',    label: 'Pending'    },
  { id: 'Queued',     label: 'Queued'     },
  { id: 'Generating', label: 'Live'       },
  { id: 'Done',       label: 'Done'       },
];

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="animate-pulse rounded-2xl p-3 flex gap-3"
          style={{ backgroundColor: '#f9fafb', border: '1px solid rgba(0,0,0,0.05)', height: 72 }}
        >
          <div className="w-5 flex-shrink-0" />
          <div className="w-10 rounded-xl flex-shrink-0" style={{ background: '#e5e7eb', aspectRatio: '9/16' }} />
          <div className="w-10 rounded-xl flex-shrink-0" style={{ background: '#e5e7eb', aspectRatio: '9/16' }} />
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <div className="h-3 rounded bg-neutral-200 w-3/4" />
            <div className="h-3 rounded bg-neutral-100 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ScenesFeaturePage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const allScenes = useQuery(api.scenes.list, {});

  const filtered = useMemo(() => {
    if (!allScenes) return [];
    return allScenes
      .filter(s => activeFilter === 'all' || s.status === activeFilter)
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [allScenes, activeFilter]);

  // Group by day using _creationTime
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach(s => {
      const label = getDayLabel(s.createdAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(s);
    });
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }, [filtered]);

  const liveCount = allScenes?.filter(s => s.status === 'Generating').length ?? 0;
  const isLoading = allScenes === undefined;
  const isEmpty   = !isLoading && allScenes.length === 0;
  const noMatch   = !isLoading && !isEmpty && filtered.length === 0;

  return (
    <div className="p-5">
      {/* Filter bar */}
      <div className="flex items-center gap-1 mb-4">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
              activeFilter === f.id
                ? 'text-neutral-900 bg-black/[0.07]'
                : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Live indicator */}
      {liveCount > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl w-fit"
          style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-xs font-semibold text-blue-700">{liveCount} generating now</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}

      {/* True empty state — no scenes in DB yet */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <Sparkles size={28} className="text-neutral-200" />
          <p className="text-sm font-semibold text-neutral-400">No scenes yet</p>
          <p className="text-xs text-neutral-300 text-center max-w-[220px]">
            Save a post from Intelligence → Pipeline to create one
          </p>
        </div>
      )}

      {/* Filter empty state — scenes exist but none match active filter */}
      {noMatch && (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <Filter size={28} className="text-neutral-200" />
          <p className="text-sm font-medium text-neutral-300">No scenes match this filter</p>
        </div>
      )}

      {/* Scene groups */}
      {!isLoading && groups.length > 0 && (
        <div className="flex flex-col gap-6">
          {groups.map(({ label, items }) => (
            <div key={label}>
              {/* Day header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{label}</span>
                <span className="text-[10px] text-neutral-300">{items.length} scenes</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
              </div>

              {/* Priority-sorted scene list */}
              <div className="flex flex-col gap-2">
                {items.map((scene, i) => (
                  <SceneCard key={scene._id} scene={scene} rank={i + 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
