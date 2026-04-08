'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, LayoutGrid, List, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hasActiveFilters, type CreatorFilters } from './filters/CreatorsFilterBar';
import { ColumnVisibilityPill } from './filters/ColumnVisibilityPill';
import { STATUS_VIEWS, type ColVisibility, type StatusView } from './tableUtils';

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

// -- Main toolbar ---------------------------------------------------------------

interface Props {
  count:               number;
  total:               number;
  filters:             CreatorFilters;
  onClearFilters:      () => void;
  showFavoritesOnly:   boolean;
  onToggleFavorites:   () => void;
  viewMode:            'list' | 'grid';
  onViewModeChange:    (v: 'list' | 'grid') => void;
  colVis:              ColVisibility;
  onColVisChange:      (v: ColVisibility) => void;
}

export function TableToolbar({ count, total, filters, onClearFilters, showFavoritesOnly, onToggleFavorites, viewMode, onViewModeChange, colVis, onColVisChange }: Props) {
  const active = hasActiveFilters(filters);

  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b"
      style={{ borderColor: 'rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}
    >
      {/* Left: status dropdown + filter indicator */}
      <div className="flex items-center gap-2">
        {active && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={10} /> clear filters
          </button>
        )}
        {count < total && (
          <span className="text-[11px] text-neutral-400 tabular-nums">{count} shown</span>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFavorites}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
            showFavoritesOnly
              ? 'text-[#ff0069] border-[#ff006930] bg-[#ff006908]'
              : 'text-neutral-500 border-transparent hover:border-neutral-200 hover:bg-white',
          )}
        >
          <Heart size={12} fill={showFavoritesOnly ? '#ff0069' : 'none'} /> Favorites
        </button>

        {viewMode === 'list' && (
          <ColumnVisibilityPill value={colVis} onChange={onColVisChange} />
        )}

        <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.09)' }}>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn('flex items-center justify-center w-7 h-7 transition-colors', viewMode === 'list' ? 'bg-violet-50 text-violet-600' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50')}
            title="List view"
          >
            <List size={12} />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn('flex items-center justify-center w-7 h-7 transition-colors', viewMode === 'grid' ? 'bg-violet-50 text-violet-600' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50')}
            title="Grid view"
          >
            <LayoutGrid size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
