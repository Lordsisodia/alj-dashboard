'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArrowRight, Download } from 'lucide-react';

export function AnalysisPipelineStrip() {
  const stats = useQuery(api.intelligence.getAnalysisPipelineStats, {});

  const qualified  = stats?.totalQualified    ?? 0;
  const downloaded = stats?.downloaded        ?? 0;
  const pending    = stats?.pendingDownload   ?? 0;
  const analyzed   = stats?.analyzed         ?? 0;
  const queued     = stats?.queuedForAnalysis ?? 0;

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
          Pipeline status
        </p>
        <button
          disabled
          title="Auto-download coming soon"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-neutral-500 bg-white/[0.04] cursor-not-allowed border border-white/[0.06]"
        >
          <Download size={11} />
          Download All Pending
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Stage 1 — Qualified */}
        <div className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-3">
          <p
            className="text-[22px] font-bold leading-none"
            style={{
              background: 'linear-gradient(135deg, #ff0069, #833ab4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {qualified}
          </p>
          <p className="text-[11px] font-medium text-neutral-300 mt-1">Qualified reels</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Top 10% saved</p>
        </div>

        <ArrowRight size={14} className="text-neutral-600 shrink-0" />

        {/* Stage 2 — Downloaded */}
        <div className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-3">
          <p
            className="text-[22px] font-bold leading-none"
            style={{
              background: 'linear-gradient(135deg, #ff0069, #833ab4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {downloaded}
          </p>
          <p className="text-[11px] font-medium text-neutral-300 mt-1">Downloaded to DB</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">{pending} pending</p>
        </div>

        <ArrowRight size={14} className="text-neutral-600 shrink-0" />

        {/* Stage 3 — Analyzed */}
        <div className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-3">
          <p
            className="text-[22px] font-bold leading-none"
            style={{
              background: 'linear-gradient(135deg, #ff0069, #833ab4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {analyzed}
          </p>
          <p className="text-[11px] font-medium text-neutral-300 mt-1">Analyzed</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">{queued} queued</p>
        </div>
      </div>
    </div>
  );
}
