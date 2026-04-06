'use client';

import { Sparkles, CheckCircle2, Clock } from 'lucide-react';
import type { ModelSummary } from './types';

interface Props { model: ModelSummary }

export function ModelSummaryCard({ model }: Props) {
  const total     = model.clipsToday;
  const approvedPct = total > 0 ? Math.round((model.approved / total) * 100) : 0;

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl"
      style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
          style={{ backgroundColor: model.color }}
        >
          {model.name.slice(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-900 truncate">{model.name}</p>
          <p className="text-[11px] text-neutral-400">{total} clips today</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${approvedPct}%`,
              background: 'linear-gradient(90deg, #10b981, #059669)',
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-neutral-400">{approvedPct}% approved</span>
          <span className="text-[10px] text-neutral-400">{total} total</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
          <CheckCircle2 size={11} />
          {model.approved} approved
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
          <Clock size={11} />
          {model.pending} pending
        </div>
        {total > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium ml-auto">
            <Sparkles size={11} />
            {total}
          </div>
        )}
      </div>
    </div>
  );
}
