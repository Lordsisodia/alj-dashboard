'use client';

import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SceneCard } from './SceneCard';
import { SEED_SCENES } from './types';
import type { SceneStatus } from './types';

const DAY_LABELS = ['Today', 'Yesterday'];

function getDayLabel(date: number): string {
  const today = new Date();
  const d     = new Date(date);
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

export default function ScenesFeaturePage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const scenes = SEED_SCENES; // swap for useQuery when wired

  const filtered = useMemo(() => {
    return scenes
      .filter(s => activeFilter === 'all' || s.status === activeFilter)
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [scenes, activeFilter]);

  // Group by day
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach(s => {
      const label = getDayLabel(s.date);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(s);
    });
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }, [filtered]);

  const liveCount = scenes.filter(s => s.status === 'Generating').length;

  return (
    <div className="p-5">
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

        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Filter size={28} className="text-neutral-200" />
            <p className="text-sm font-medium text-neutral-300">No scenes match this filter</p>
          </div>
        ) : (
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
