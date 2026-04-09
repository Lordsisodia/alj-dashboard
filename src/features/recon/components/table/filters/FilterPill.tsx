'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PillOption { value: string; label?: string; }

interface FilterPillProps {
  label: string;
  options: PillOption[];
  value: string[] | string;
  multi?: boolean;
  onChange: (v: string[] | string) => void;
  accentColor?: string;
  neutral?: boolean;
}

export function FilterPill({ label, options, value, multi = false, onChange, accentColor = '#ff0069', neutral = false }: FilterPillProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = neutral ? false : (Array.isArray(value) ? value.length > 0 : !!value);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function toggle(opt: string) {
    if (multi && Array.isArray(value)) {
      const next = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt];
      onChange(next);
    } else {
      onChange(value === opt ? '' : opt);
      setOpen(false);
    }
  }

  const displayLabel = Array.isArray(value) && value.length > 0
    ? value.length === 1 ? value[0] : `${label} · ${value.length}`
    : (!Array.isArray(value) && value) ? value
    : label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all select-none whitespace-nowrap',
          isActive
            ? 'border'
            : 'text-neutral-600 hover:text-neutral-800 hover:bg-black/[0.04] border border-transparent hover:border-neutral-200',
        )}
        style={isActive ? {
          backgroundColor: `${accentColor}10`,
          color: accentColor,
          borderColor: `${accentColor}30`,
        } : undefined}
      >
        {displayLabel}
        <ChevronDown size={10} className={cn('transition-transform duration-150', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] min-w-[152px] rounded-xl py-1 z-50"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          {options.map(opt => {
            const sel = Array.isArray(value) ? value.includes(opt.value) : value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-neutral-700 hover:bg-black/[0.04] transition-colors"
              >
                {opt.label ?? opt.value}
                {sel && <Check size={11} className="flex-shrink-0" style={{ color: accentColor }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-[#ff006910] text-[#ff0069] border border-[#ff006928]">
      {label}
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
        <X size={9} strokeWidth={2.5} />
      </button>
    </span>
  );
}
