'use client';

import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NICHE_COLORS } from '../../constants';

const NICHES = Object.keys(NICHE_COLORS);
const TYPES  = ['reel', 'post', 'carousel'];

interface Props {
  niche:               string;
  onNicheChange:       (v: string) => void;
  contentType:         string;
  onContentTypeChange: (v: string) => void;
}

export function FeedFilterDropdown({ niche, onNicheChange, contentType, onContentTypeChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const activeCount = (niche ? 1 : 0) + (contentType ? 1 : 0);

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
        <SlidersHorizontal size={12} style={{ color: '#7c3aed' }} />
        Filters
        {activeCount > 0 && (
          <span
            className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white leading-none"
            style={{ backgroundColor: '#7c3aed' }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] w-52 rounded-xl z-50 overflow-hidden"
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
          >
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Filters</span>
            {activeCount > 0 && (
              <button
                onClick={() => { onNicheChange(''); onContentTypeChange(''); }}
                className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={10} /> Clear all
              </button>
            )}
          </div>

          {/* Niche */}
          <div className="px-3 pt-2.5 pb-1">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Niche</span>
          </div>
          <div className="px-2 pb-2 flex flex-col">
            <button
              onClick={() => onNicheChange('')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-neutral-700 hover:bg-black/[0.03] transition-colors"
            >
              All niches
              {!niche && <Check size={11} className="text-neutral-400 flex-shrink-0" />}
            </button>
            {NICHES.map(n => {
              const color  = NICHE_COLORS[n];
              const active = niche === n;
              return (
                <button
                  key={n}
                  onClick={() => onNicheChange(active ? '' : n)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-black/[0.03] transition-colors"
                  style={{ color: active ? color : '#525252' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    {n}
                  </div>
                  {active && <Check size={11} style={{ color }} className="flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />

          {/* Content type */}
          <div className="px-3 pt-2.5 pb-1">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Content Type</span>
          </div>
          <div className="px-2 pb-3 flex flex-col">
            <button
              onClick={() => onContentTypeChange('')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-neutral-700 hover:bg-black/[0.03] transition-colors"
            >
              All types
              {!contentType && <Check size={11} className="text-neutral-400 flex-shrink-0" />}
            </button>
            {TYPES.map(t => {
              const active = contentType === t;
              return (
                <button
                  key={t}
                  onClick={() => onContentTypeChange(active ? '' : t)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs capitalize hover:bg-black/[0.03] transition-colors"
                  style={{ color: active ? '#7c3aed' : '#525252' }}
                >
                  {t}
                  {active && <Check size={11} style={{ color: '#7c3aed' }} className="flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
