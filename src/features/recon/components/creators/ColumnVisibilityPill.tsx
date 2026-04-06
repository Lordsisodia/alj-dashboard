'use client';

import { useState, useRef, useEffect } from 'react';
import { Columns3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COLUMN_DEFS, type ColVisibility } from './tableUtils';

function ToggleRow({ label, checked, enrichOnly, onChange }: { label: string; checked: boolean; enrichOnly: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-neutral-700 truncate">{label}</span>
        {enrichOnly && <span className="text-[9px] font-medium px-1 py-0.5 rounded bg-violet-50 text-violet-500 flex-shrink-0">Enriched</span>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn('relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0 ml-2', checked ? 'bg-[#833ab4]' : 'bg-neutral-200')}
      >
        <span className={cn('absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200', checked ? 'translate-x-4' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}

export function ColumnVisibilityPill({ value, onChange }: { value: ColVisibility; onChange: (v: ColVisibility) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const visibleCount = Object.values(value).filter(Boolean).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
          open
            ? 'bg-black/[0.07] text-neutral-800 border-black/[0.09]'
            : 'text-neutral-500 border-transparent hover:border-neutral-200 hover:bg-white',
        )}
        title="Show / hide columns"
      >
        <Columns3 size={12} />
        <span>Columns</span>
        <span className="bg-neutral-100 text-neutral-500 rounded px-1 tabular-nums">{visibleCount}</span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] w-52 rounded-xl z-50 overflow-hidden"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Show / Hide Columns</span>
          </div>
          {COLUMN_DEFS.map(col => (
            <ToggleRow
              key={col.key}
              label={col.label}
              enrichOnly={col.enrichOnly}
              checked={value[col.key]}
              onChange={v => onChange({ ...value, [col.key]: v })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
