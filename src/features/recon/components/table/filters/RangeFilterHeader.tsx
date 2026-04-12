'use client';

import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NumericRange } from './CreatorsFilterBar';

function fmtNum(n: number, suffix = '') {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M${suffix}`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K${suffix}`;
  return `${n}${suffix}`;
}

interface RangeFilterHeaderProps {
  label: string;
  icon?: React.ReactNode;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  align?: 'left' | 'right';
  onChange: (range: NumericRange) => void;
  style?: React.CSSProperties;
  tooltip?: string;
}

export function RangeFilterHeader({
  label, icon, min: glMin, max: glMax, step, suffix = '', align = 'left', onChange, style, tooltip,
}: RangeFilterHeaderProps) {
  const [open, setOpen] = useState(false);
  const [lo, setLo]     = useState(glMin);
  const [hi, setHi]     = useState(glMax === Infinity ? '' : glMax);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = glMin > 0 || glMax < Infinity;
  const effectiveMax = glMax === Infinity ? Math.max(Number(hi) || 500000, 100000) : glMax;

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function handleApply() {
    onChange({ min: lo, max: hi === '' ? Infinity : Number(hi) });
    setOpen(false);
  }

  function handleClear() {
    setLo(0); setHi('');
    onChange({ min: 0, max: Infinity });
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn('relative flex items-center h-full', align === 'right' && 'justify-end')} style={style}>
      <button
        onClick={() => { setLo(glMin); setHi(glMax === Infinity ? '' : glMax); setOpen(v => !v); }}
        className={cn(
          'flex items-center gap-1 px-3 h-full w-full text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-neutral-100/80 cursor-pointer group/hdr',
          align === 'right' && 'justify-end',
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
        <ChevronDown size={9} className={cn('flex-shrink-0 transition-transform duration-150', open && 'rotate-180', isActive ? 'text-blue-500' : 'text-neutral-300 group-hover/hdr:text-neutral-400')} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 rounded-xl py-3 px-3 min-w-[220px]"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.09)' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 mb-3">{label}</p>

          {/* Dual slider */}
          <div className="px-1 mb-4">
            <div className="relative h-4 flex items-center">
              <div className="absolute left-0 right-0 h-1 rounded-full bg-neutral-200" />
              <div
                className="absolute h-1 rounded-full bg-[#ff0069]"
                style={{
                  left:  `${Math.min(lo, hi === '' ? lo : Number(hi)) / effectiveMax * 100}%`,
                  right: `${hi === '' ? 0 : Math.max(0, (1 - Number(hi) / effectiveMax) * 100)}%`,
                }}
              />
              <input
                type="range" min={0} max={effectiveMax} step={step} value={lo}
                onChange={e => setLo(Math.min(Number(e.target.value), hi === '' ? Number(e.target.value) : Number(hi)))}
                className="absolute w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-[#ff0069] [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-grab"
              />
              <input
                type="range" min={0} max={effectiveMax} step={step}
                value={hi === '' ? effectiveMax : Number(hi)}
                onChange={e => setHi(String(Math.max(Number(hi === '' ? effectiveMax : hi), Number(e.target.value))))}
                className="absolute w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-[#ff0069] [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-grab"
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-neutral-400">
              <span>0</span>
              <span>{glMax === Infinity ? '∞' : fmtNum(glMax, suffix)}</span>
            </div>
          </div>

          {/* Custom inputs */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="text-[9px] uppercase tracking-wide text-neutral-400 mb-1 block">Min</label>
              <input type="number" value={lo} onChange={e => setLo(Number(e.target.value))} placeholder="0"
                className="w-full px-2 py-1 text-xs rounded-md border border-neutral-200 focus:border-[#ff0069] focus:outline-none" />
            </div>
            <span className="text-neutral-300 mt-3">–</span>
            <div className="flex-1">
              <label className="text-[9px] uppercase tracking-wide text-neutral-400 mb-1 block">Max</label>
              <input type="number" value={hi} onChange={e => setHi(e.target.value)} placeholder="∞"
                className="w-full px-2 py-1 text-xs rounded-md border border-neutral-200 focus:border-[#ff0069] focus:outline-none" />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleClear} className="flex-1 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 transition-colors border border-neutral-200">Clear</button>
            <button onClick={handleApply} className="flex-1 py-1.5 rounded-lg text-xs text-white font-medium" style={{ backgroundColor: '#ff0069' }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
