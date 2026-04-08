'use client';

import { Sparkles, Loader2 } from 'lucide-react';

export type Verdict = { verdict: 'HIRE' | 'WATCH' | 'PASS'; score: number; reason: string };

const STYLES: Record<string, { bg: string; color: string; border: string }> = {
  HIRE:  { bg: 'rgba(34,197,94,0.08)',  color: '#16a34a', border: 'rgba(34,197,94,0.25)'  },
  WATCH: { bg: 'rgba(234,179,8,0.08)',  color: '#ca8a04', border: 'rgba(234,179,8,0.25)'  },
  PASS:  { bg: 'rgba(239,68,68,0.08)',  color: '#dc2626', border: 'rgba(239,68,68,0.25)'  },
};

interface Props { verdict: Verdict | null; loading: boolean; error: string | null; }

export function VerdictSection({ verdict, loading, error }: Props) {
  if (loading) return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
      style={{ backgroundColor: 'rgba(131,58,180,0.05)', border: '1px solid rgba(131,58,180,0.1)' }}>
      <Loader2 size={11} className="animate-spin flex-shrink-0" style={{ color: '#833ab4' }} />
      <span className="text-[10px] text-neutral-500">ORACLE scoring...</span>
    </div>
  );
  if (error) return (
    <div className="px-3 py-2 rounded-xl"
      style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
      <p className="text-[10px] text-red-400">Verdict unavailable - all models busy</p>
    </div>
  );
  if (!verdict) return null;
  const vs = STYLES[verdict.verdict];
  return (
    <div className="px-3 py-2.5 rounded-xl" style={{ backgroundColor: vs.bg, border: `1px solid ${vs.border}` }}>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={10} style={{ color: vs.color }} />
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: vs.color }}>
          ORACLE: {verdict.verdict}
        </span>
        <span className="ml-auto text-sm font-bold tabular-nums" style={{ color: vs.color }}>
          {verdict.score}/10
        </span>
      </div>
      <p className="text-[11px] leading-snug" style={{ color: vs.color }}>{verdict.reason}</p>
    </div>
  );
}
