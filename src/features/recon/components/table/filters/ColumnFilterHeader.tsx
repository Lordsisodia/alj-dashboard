'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption { value: string; label?: string; }

interface Props {
  label: string;
  align?: 'left' | 'right';
  options?: FilterOption[];
  value?: string | string[];
  multi?: boolean;
  onChange?: (v: string | string[]) => void;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  tooltip?: string;
}

export function ColumnFilterHeader({ label, align = 'left', options, value, multi, onChange, style, icon, tooltip }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = Array.isArray(value) ? value.length > 0 : !!value;
  const hasFilter = !!(options?.length && onChange);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function toggle(v: string) {
    if (!onChange) return;
    if (multi) {
      const arr = (value as string[]) ?? [];
      onChange(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
    } else {
      onChange(value === v ? '' : v);
    }
  }

  const checked = (v: string) => Array.isArray(value) ? value.includes(v) : value === v;

  return (
    <div ref={ref} className={cn('relative flex items-center h-full', align === 'right' && 'justify-end')} style={style}>
      <button
        onClick={() => hasFilter && setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1 px-3 h-full w-full text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors',
          align === 'right' && 'justify-end',
          hasFilter ? 'hover:bg-neutral-100/80 cursor-pointer group/hdr' : 'cursor-default',
          isActive ? 'text-blue-600' : 'text-neutral-400',
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {label}
        {tooltip && (
          <span className="relative group/tip flex-shrink-0" onClick={e => e.stopPropagation()}>
            <Info size={8} className="text-neutral-300 hover:text-neutral-500 cursor-default" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-2.5 py-2 rounded-lg text-[10px] text-neutral-600 leading-relaxed bg-white shadow-lg border border-neutral-100 opacity-0 group-hover/tip:opacity-100 pointer-events-none z-[200] whitespace-normal text-left font-normal normal-case tracking-normal">
              {tooltip}
            </div>
          </span>
        )}
        {hasFilter && (
          <ChevronDown
            size={9}
            className={cn(
              'flex-shrink-0 transition-transform duration-150',
              open && 'rotate-180',
              isActive ? 'text-blue-500' : 'text-neutral-300 group-hover/hdr:text-neutral-400',
            )}
          />
        )}
      </button>

      {open && options && (
        <div
          className="absolute top-full left-0 z-50 mt-1 rounded-xl bg-white py-1 min-w-[160px]"
          style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.09)' }}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-neutral-50 transition-colors"
            >
              <div className={cn('w-3.5 h-3.5 rounded flex items-center justify-center border flex-shrink-0 transition-colors', checked(opt.value) ? 'bg-blue-500 border-blue-500' : 'border-neutral-200')}>
                {checked(opt.value) && <Check size={9} strokeWidth={3} className="text-white" />}
              </div>
              <span className={checked(opt.value) ? 'text-neutral-900 font-medium' : 'text-neutral-500'}>{opt.label ?? opt.value}</span>
            </button>
          ))}
          {isActive && (
            <div className="border-t mt-1 pt-1" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <button
                onClick={() => { onChange?.(multi ? [] : ''); setOpen(false); }}
                className="w-full px-3 py-1.5 text-left text-[11px] text-neutral-400 hover:text-red-500 hover:bg-neutral-50 transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
