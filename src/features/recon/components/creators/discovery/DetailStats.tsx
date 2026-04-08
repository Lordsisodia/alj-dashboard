'use client';

import { Radar, Zap, CheckCircle, Loader2 } from 'lucide-react';
import type { Candidate } from '../../../types';
import type { Verdict } from './VerdictSection';
import { VerdictSection } from './VerdictSection';
import { OutlierCard } from './OutlierCard';

interface DetailStatsProps {
  candidate: Candidate;
  verdict: Verdict | null;
  loading: boolean;
  error: string | null;
  enriched: boolean;
  enriching: boolean;
  onEnrich: () => void;
}

export function DetailStats({ candidate, verdict, loading, error, enriched, enriching, onEnrich }: DetailStatsProps) {
  return (
    <div className="flex-1 px-4 py-4 space-y-3">
      <VerdictSection verdict={verdict} loading={loading} error={error} />
      <OutlierCard candidate={candidate} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Followers', value: candidate.followers },
          { label: 'Eng. Rate', value: candidate.engagementRate },
          { label: 'Posts/Wk', value: String(candidate.postsPerWeek || '-') },
        ].map(({ label, value }) => (
          <div key={label} className="text-center p-2 rounded-xl" style={{ backgroundColor: '#f7f7f7' }}>
            <p className="text-xs font-bold text-neutral-900">{value}</p>
            <p className="text-[9px] text-neutral-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Bio */}
      {candidate.bio && (
        <p className="text-[11px] text-neutral-500 leading-snug">{candidate.bio}</p>
      )}

      {/* Source */}
      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
        <Radar size={10} />
        {candidate.suggestedBy
          ? <span>via <span className="font-semibold text-neutral-600">{candidate.suggestedBy}</span></span>
          : <span>Added manually</span>}
        <span className="ml-auto text-neutral-300">{candidate.discoveredAt}</span>
      </div>

      {/* Enrich button */}
      {!enriched && candidate.outlierRatio === 0 && (
        <button
          onClick={onEnrich}
          disabled={enriching}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff' }}
        >
          {enriching
            ? <><Loader2 size={11} className="animate-spin" /> Pulling Instagram data...</>
            : <><Zap size={11} /> Enrich with Apify</>}
        </button>
      )}
      {enriched && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-medium"
          style={{ backgroundColor: 'rgba(34,197,94,0.07)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.15)' }}
        >
          <CheckCircle size={11} /> Enriched - verdict will run on reopen
        </div>
      )}
    </div>
  );
}
