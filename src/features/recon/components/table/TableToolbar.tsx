'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hasActiveFilters, type CreatorFilters } from './filters/CreatorsFilterBar';
import { STATUS_VIEWS, type StatusView } from './tableUtils';

export { StatusDropdown };

// -- Status dropdown ------------------------------------------------------------

function StatusDropdown({ value, onChange, counts }: {
  value:    StatusView;
  onChange: (v: StatusView) => void;
  counts:   Record<StatusView, number>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = STATUS_VIEWS.find(s => s.key === value)!;

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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all"
        style={open
          ? { borderColor: `${current.color}40`, backgroundColor: current.bg, color: current.color }
          : { borderColor: 'rgba(0,0,0,0.09)', color: '#6b7280', backgroundColor: 'transparent' }
        }
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: current.color }} />
        {current.label}
        <span
          className="tabular-nums text-[10px] rounded-full px-1.5"
          style={{ backgroundColor: open ? `${current.color}20` : 'rgba(0,0,0,0.06)', color: open ? current.color : '#9ca3af' }}
        >
          {counts[value]}
        </span>
        <ChevronDown size={10} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+4px)] w-44 rounded-xl z-50 overflow-hidden py-1"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
        >
          {STATUS_VIEWS.map(sv => (
            <button
              key={sv.key}
              onClick={() => { onChange(sv.key); setOpen(false); }}
              className="flex items-center justify-between w-full px-3 py-2 text-xs transition-colors hover:bg-neutral-50"
              style={value === sv.key ? { backgroundColor: sv.bg } : {}}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sv.color }} />
                <span style={{ color: value === sv.key ? sv.color : '#374151', fontWeight: value === sv.key ? 600 : 400 }}>
                  {sv.label}
                </span>
              </div>
              <span className="tabular-nums" style={{ color: '#9ca3af' }}>{counts[sv.key]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// -- Percentile pill group ------------------------------------------------------

const PERCENTILES = [
  { label: 'Top 10%', value: 10  },
  { label: 'Top 25%', value: 25  },
  { label: 'Top 50%', value: 50  },
  { label: 'All',     value: 100 },
] as const;

// -- Main toolbar ---------------------------------------------------------------

interface Props {
  count:              number;
  total:              number;
  filters:            CreatorFilters;
  onClearFilters:     () => void;
  percentile:         number;
  onPercentileChange: (n: number) => void;
  onOpenWeights:      () => void;
}

export function TableToolbar({ count, total, filters, onClearFilters, percentile, onPercentileChange, onOpenWeights }: Props) {
  const active = hasActiveFilters(filters);
  const showBar = active || count < total || percentile < 100;
  if (!showBar) return null;

  return (
    <div
      className="flex items-center gap-2 px-4 py-1.5 border-b"
      style={{ borderColor: 'rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}
    >
      {active && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X size={10} /> clear filters
        </button>
      )}
      {count < total && (
        <span className="text-[11px] text-neutral-400 tabular-nums">{count} of {total} shown</span>
      )}

      <div className="flex-1" />

      {/* Percentile pill group */}
      <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
        {PERCENTILES.map(p => (
          <button
            key={p.value}
            onClick={() => onPercentileChange(p.value)}
            className="px-2 py-0.5 rounded-md text-[11px] font-medium transition-all"
            style={percentile === p.value
              ? { backgroundColor: '#7c3aed', color: '#fff' }
              : { backgroundColor: 'transparent', color: '#9ca3af' }
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Weights button */}
      <button
        onClick={onOpenWeights}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all"
        style={{ backgroundColor: 'rgba(124,58,237,0.08)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.18)' }}
        title="Score weights"
      >
        <SlidersHorizontal size={11} />
        Weights
      </button>
    </div>
  );
}
