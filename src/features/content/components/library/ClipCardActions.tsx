'use client';

import { Zap, Check } from 'lucide-react';
import type { ClipStatus } from '../../types';
import { ENHANCEMENTS } from '../../constants';

interface ClipCardActionsProps {
  status: ClipStatus;
  selected: string[];
  onToggle: (id: string) => void;
}

export function ClipCardActions({ status, selected, onToggle }: ClipCardActionsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {ENHANCEMENTS.map(e => (
          <label key={e.id} className="flex items-center gap-1.5 cursor-pointer">
            <div
              onClick={() => onToggle(e.id)}
              className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 border transition-colors cursor-pointer"
              style={{
                backgroundColor: selected.includes(e.id) ? e.color : 'transparent',
                borderColor: selected.includes(e.id) ? e.color : 'rgba(0,0,0,0.2)',
              }}
            >
              {selected.includes(e.id) && <Check size={8} className="text-white" />}
            </div>
            <span className="text-[10px] text-neutral-600">{e.label}</span>
          </label>
        ))}
      </div>

      {status === 'Raw' && (
        <button
          className="w-full py-1.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all hover:brightness-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Zap size={11} />
          Enhance
        </button>
      )}
      {status === 'Enhanced' && (
        <div
          className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: 'rgba(34,197,94,0.08)', color: '#16a34a' }}
        >
          <Check size={11} />
          Enhanced
        </div>
      )}
      {status === 'In Pipeline' && (
        <div
          className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: 'rgba(255,0,105,0.07)', color: '#ff0069' }}
        >
          <Zap size={11} />
          In Pipeline
        </div>
      )}
    </>
  );
}
