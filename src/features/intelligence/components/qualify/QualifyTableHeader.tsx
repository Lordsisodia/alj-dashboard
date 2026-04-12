'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortKey = 'baselineScore' | 'views' | 'likes' | 'comments' | 'handle' | 'postedAt';

const COL = '40px 200px 90px 80px 76px 80px 90px';
const DIV = { borderRight: '1px solid rgba(0,0,0,0.06)' } as const;

interface SortProps {
  sortKey: SortKey;
  sortAsc: boolean;
  onSort: (k: SortKey, asc: boolean) => void;
}

function SortColumnHeader({
  k, label, align = 'left', divider = false, sortKey, sortAsc, onSort,
}: {
  k: SortKey; label: string; align?: 'left' | 'right' | 'center'; divider?: boolean;
} & SortProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = sortKey === k;
  const isText = k === 'handle';
  const opts = isText
    ? [{ label: 'A → Z', asc: true }, { label: 'Z → A', asc: false }]
    : [{ label: 'High → Low', asc: false }, { label: 'Low → High', asc: true }];

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center h-full',
        align === 'right' && 'justify-end',
        align === 'center' && 'justify-center',
      )}
      style={divider ? { borderRight: '1px solid rgba(0,0,0,0.06)' } : undefined}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1 h-full w-full text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-neutral-100/80 group/hdr whitespace-nowrap',
          align === 'right' ? 'justify-end pr-1' : align === 'center' ? 'justify-center' : 'justify-start pl-3',
          isActive ? 'text-neutral-700' : 'text-neutral-400',
        )}
      >
        {label}
        <ChevronDown
          size={9}
          className={cn(
            'flex-shrink-0 transition-transform duration-150',
            open && 'rotate-180',
            isActive ? 'text-neutral-500' : 'text-neutral-300 group-hover/hdr:text-neutral-400',
          )}
        />
      </button>
      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-1 rounded-xl bg-white py-1 min-w-[140px]',
            align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0',
          )}
          style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.09)' }}
        >
          {opts.map(opt => {
            const checked = isActive && sortAsc === opt.asc;
            return (
              <button
                key={String(opt.asc)}
                onClick={() => { onSort(k, opt.asc); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-neutral-50 transition-colors"
              >
                <div
                  className={cn(
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center border flex-shrink-0 transition-colors',
                    checked ? 'bg-blue-500 border-blue-500' : 'border-neutral-200',
                  )}
                >
                  {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={checked ? 'text-neutral-900 font-medium' : 'text-neutral-500'}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function QualifyTableHeader({ sortKey, sortAsc, onSort }: SortProps) {
  return (
    <div
      className="grid items-center"
      style={{
        gridTemplateColumns: COL,
        height: 36,
        borderBottom: '1px solid rgba(0,0,0,0.10)',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div className="flex items-center justify-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400" style={DIV}>#</div>
      <SortColumnHeader k="handle"        label="Creator"  align="left"   divider sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
      <SortColumnHeader k="postedAt"      label="Posted"   align="center" divider sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
      <SortColumnHeader k="views"         label="Views"    align="center" divider sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
      <SortColumnHeader k="likes"         label="Likes"    align="center" divider sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
      <SortColumnHeader k="comments"      label="Comments" align="center" divider sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
      <SortColumnHeader k="baselineScore" label="vs Median" align="center" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
    </div>
  );
}
