'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { GRAD } from '../../constants';

const BANDS = [
  { label: 'All',  value: 0 },
  { label: '2×+', value: 1 },
  { label: '5×+', value: 5 },
  { label: '10×+', value: 10 },
  { label: '20×+', value: 20 },
];

const DAYS_OPTIONS = [
  { label: '7d',  value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

interface QualifyToolbarProps {
  search: string;
  onSearch: (s: string) => void;
  band: number;
  onBand: (b: number) => void;
  total: number;
  savedCount: number;
  days: number;
  onDaysChange: (d: number) => void;
}

export function QualifyToolbar({
  search, onSearch, band, onBand, total, savedCount, days, onDaysChange,
}: QualifyToolbarProps) {
  const [bandOpen, setBandOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBandOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}
    >
      {/* Left: search + band chips */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)' }}
        >
          <Search size={11} className="text-neutral-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Filter by handle..."
            className="text-[11px] text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none w-36"
          />
        </div>

        {/* Band filter dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setBandOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors"
            style={band === 0
              ? { border: '1px solid rgba(0,0,0,0.09)', color: '#6b7280', backgroundColor: '#fff' }
              : { border: '1px solid rgba(0,0,0,0.09)', background: GRAD, color: '#fff' }
            }
          >
            <span>{BANDS.find(b => b.value === band)?.label ?? 'All bands'}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {bandOpen && (
            <div
              className="absolute left-0 top-[calc(100%+4px)] w-36 rounded-xl z-50 overflow-hidden"
              style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
            >
              {BANDS.map(b => (
                <button
                  key={b.value}
                  onClick={() => { onBand(b.value); setBandOpen(false); }}
                  className="w-full flex items-center px-3 py-2.5 text-[11px] text-neutral-700 hover:bg-black/[0.04] transition-colors text-left"
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-[11px] text-neutral-400 tabular-nums">{savedCount} saved · {total} shown</span>
      </div>

      {/* Right: days pills */}
      <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
        {DAYS_OPTIONS.map(d => (
          <button
            key={d.value}
            onClick={() => onDaysChange(d.value)}
            className="px-2.5 py-1.5 text-[10px] font-semibold transition-all active:scale-95"
            style={days === d.value
              ? { background: GRAD, color: '#fff' }
              : { color: '#9ca3af' }
            }
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}