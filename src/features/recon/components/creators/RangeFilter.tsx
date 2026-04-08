'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export interface NumericRange {
  min: number;
  max: number;
}

function fmtNum(n: number, suffix = '') {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M${suffix}`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K${suffix}`;
  return `${n}${suffix}`;
}

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (range: NumericRange) => void;
}

function RangeFilter({ label, min: glMin, max: glMax, step, suffix = '', onChange }: RangeFilterProps) {
  const [open, setOpen]       = useState(false);
  const [lo,   setLo]         = useState(glMin);
  const [hi,   setHi]         = useState(glMax === Infinity ? '' : glMax);

  const isActive = glMin > 0 || glMax < Infinity;

  function handleApply() {
    onChange({ min: lo, max: hi === '' ? Infinity : Number(hi) });
    setOpen(false);
  }

  function handleClear() {
    setLo(0);
    setHi('');
    onChange({ min: 0, max: Infinity });
    setOpen(false);
  }

  const effectiveMax = glMax === Infinity ? Math.max(Number(hi) || 500000, 100000) : glMax;

  return (
    <div className="relative">
      <button
        onClick={() => { setLo(glMin); setHi(glMax === Infinity ? '' : glMax); setOpen(v => !v); }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all select-none whitespace-nowrap border ${
          isActive
            ? 'bg-[#ff006910] text-[#ff0069] border-[#ff006930]'
            : 'text-neutral-600 hover:text-neutral-800 hover:bg-black/[0.04] border-transparent hover:border-neutral-200'
        }`}
      >
        {isActive
          ? `${fmtNum(glMin, suffix)} - ${glMax === Infinity ? '∞' : fmtNum(glMax, suffix)}`
          : label}
        <SlidersHorizontal size={10} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] min-w-[220px] rounded-xl py-3 px-3 z-50"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
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
                type="range"
                min={0} max={effectiveMax} step={step}
                value={lo}
                onChange={e => setLo(Math.min(Number(e.target.value), hi === '' ? Number(e.target.value) : Number(hi)))}
                className="absolute w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-[#ff0069] [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-grab"
              />
              <input
                type="range"
                min={0} max={effectiveMax} step={step}
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
              <input
                type="number"
                value={lo}
                onChange={e => setLo(Number(e.target.value))}
                placeholder="0"
                className="w-full px-2 py-1 text-xs rounded-md border border-neutral-200 focus:border-[#ff0069] focus:outline-none"
              />
            </div>
            <span className="text-neutral-300 mt-3">–</span>
            <div className="flex-1">
              <label className="text-[9px] uppercase tracking-wide text-neutral-400 mb-1 block">Max</label>
              <input
                type="number"
                value={hi}
                onChange={e => setHi(e.target.value)}
                placeholder="∞"
                className="w-full px-2 py-1 text-xs rounded-md border border-neutral-200 focus:border-[#ff0069] focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={handleClear} className="flex-1 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 transition-colors border border-neutral-200">Clear</button>
            <button onClick={handleApply} className="flex-1 py-1.5 rounded-lg text-xs text-white font-medium" style={{ backgroundColor: '#ff0069' }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

export { RangeFilter };
