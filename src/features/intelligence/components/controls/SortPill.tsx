'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check, Heart, PlayCircle, Bookmark, TrendingUp, Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SortId } from '../../types';

const SORT_OPTIONS = [
  { id: 'newest'         as SortId, label: 'Newest',         icon: <Clock       size={12} /> },
  { id: 'oldest'         as SortId, label: 'Oldest',         icon: <Clock       size={12} /> },
  { id: 'most-likes'     as SortId, label: 'Most Likes',     icon: <Heart       size={12} /> },
  { id: 'most-views'     as SortId, label: 'Most Views',     icon: <PlayCircle  size={12} /> },
  { id: 'most-saves'     as SortId, label: 'Most Saves',     icon: <Bookmark    size={12} /> },
  { id: 'top-engagement' as SortId, label: 'Top Engagement', icon: <TrendingUp  size={12} /> },
  { id: 'trending'       as SortId, label: 'Trending',       icon: <TrendingUp  size={12} /> },
];

export function SortPill({ value, onChange }: { value: SortId; onChange: (id: SortId) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const active = SORT_OPTIONS.find(o => o.id === value) ?? SORT_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none',
          open ? 'bg-black/[0.07] text-neutral-800' : 'text-neutral-600 hover:text-neutral-800 hover:bg-black/[0.04]',
        )}
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
      >
        <ArrowUpDown size={12} />
        {active.label}
        <ChevronDown size={10} className={cn('transition-transform duration-150', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] w-44 rounded-xl py-1 z-50"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-neutral-700 hover:bg-black/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-neutral-400">{opt.icon}</span>
                {opt.label}
              </div>
              {value === opt.id && <Check size={11} className="text-neutral-500 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
