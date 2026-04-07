'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check, Eye, Heart, PlayCircle, Bookmark, TrendingUp, Clock, ChevronDown, LayoutGrid, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Sort ──────────────────────────────────────────────────────────────────────

export type SortId =
  | 'newest'
  | 'oldest'
  | 'most-likes'
  | 'most-views'
  | 'most-saves'
  | 'top-engagement'
  | 'trending'
  | 'viral';

export interface SortOption {
  id: SortId;
  label: string;
  icon: React.ReactNode;
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'newest',       label: 'Newest',           icon: <Clock size={12} />       },
  { id: 'oldest',       label: 'Oldest',           icon: <Clock size={12} />       },
  { id: 'most-likes',   label: 'Most Likes',       icon: <Heart size={12} />       },
  { id: 'most-views',   label: 'Most Views',       icon: <PlayCircle size={12} />  },
  { id: 'most-saves',   label: 'Most Saves',       icon: <Bookmark size={12} />    },
  { id: 'top-engagement', label: 'Top Engagement', icon: <TrendingUp size={12} />  },
  { id: 'trending',     label: 'Trending',         icon: <TrendingUp size={12} />  },
  { id: 'viral',        label: 'Viral First',     icon: <Zap size={12} />        },
];

export function SortPill({
  value,
  onChange,
}: {
  value: SortId;
  onChange: (id: SortId) => void;
}) {
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
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
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

// ─── Visibility toggles ────────────────────────────────────────────────────────

export interface VisibilityState {
  brandDetails: boolean;
  likeCount:    boolean;
  viewCount:    boolean;
  saveCount:    boolean;
}

export const DEFAULT_VISIBILITY: VisibilityState = {
  brandDetails: true,
  likeCount:    true,
  viewCount:    true,
  saveCount:    true,
};

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="text-xs text-neutral-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0',
          checked ? 'bg-[#833ab4]' : 'bg-neutral-200',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

export function VisibilityPill({
  value,
  onChange,
}: {
  value: VisibilityState;
  onChange: (v: VisibilityState) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function set<K extends keyof VisibilityState>(key: K, val: boolean) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
          open ? 'bg-black/[0.07] text-neutral-800' : 'text-neutral-500 hover:text-neutral-700 hover:bg-black/[0.04]',
        )}
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
      >
        <Eye size={13} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] w-48 rounded-xl z-50 overflow-hidden"
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <div
            className="px-3 py-2"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
          >
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Show / Hide</span>
          </div>
          <ToggleRow label="Brand Details"  checked={value.brandDetails} onChange={v => set('brandDetails', v)} />
          <ToggleRow label="Like Count"     checked={value.likeCount}    onChange={v => set('likeCount', v)}    />
          <ToggleRow label="View Count"     checked={value.viewCount}    onChange={v => set('viewCount', v)}    />
          <ToggleRow label="Save Count"     checked={value.saveCount}    onChange={v => set('saveCount', v)}    />
        </div>
      )}
    </div>
  );
}

// ─── Density ────────────────────────────────────────────────────────────────────

export const DENSITY_OPTIONS = [2, 3, 4, 6, 8] as const;
export type DensityId = typeof DENSITY_OPTIONS[number];

export function DensityPill({
  value,
  onChange,
}: {
  value: DensityId;
  onChange: (id: DensityId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

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
        <LayoutGrid size={12} />
        {value}
        <ChevronDown size={10} className={cn('transition-transform duration-150', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] w-32 rounded-xl py-1 z-50"
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {DENSITY_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => { onChange(n); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-neutral-700 hover:bg-black/[0.04] transition-colors"
            >
              <span>{n} cols</span>
              {value === n && <Check size={11} className="text-neutral-500 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
