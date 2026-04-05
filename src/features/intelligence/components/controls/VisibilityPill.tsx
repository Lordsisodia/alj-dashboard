'use client';

import { useState, useRef, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VisibilityState } from '../../types';

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="text-xs text-neutral-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn('relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0', checked ? 'bg-[#833ab4]' : 'bg-neutral-200')}
      >
        <span className={cn('absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200', checked ? 'translate-x-4' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}

export function VisibilityPill({ value, onChange }: { value: VisibilityState; onChange: (v: VisibilityState) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function set<K extends keyof VisibilityState>(key: K, val: boolean) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn('flex items-center justify-center w-8 h-8 rounded-lg transition-colors', open ? 'bg-black/[0.07] text-neutral-800' : 'text-neutral-500 hover:text-neutral-700 hover:bg-black/[0.04]')}
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
      >
        <Eye size={13} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] w-48 rounded-xl z-50 overflow-hidden"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Show / Hide</span>
          </div>
          <ToggleRow label="Brand Details" checked={value.brandDetails} onChange={v => set('brandDetails', v)} />
          <ToggleRow label="Like Count"    checked={value.likeCount}    onChange={v => set('likeCount', v)}    />
          <ToggleRow label="View Count"    checked={value.viewCount}    onChange={v => set('viewCount', v)}    />
          <ToggleRow label="Save Count"    checked={value.saveCount}    onChange={v => set('saveCount', v)}    />
        </div>
      )}
    </div>
  );
}
