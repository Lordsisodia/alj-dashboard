'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ChevronDown, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Brief {
  _id: string;
  contentScore: number;
  consistencyScore: number;
  monetizationRating: number;
  topHooks: string[];
  contentPatterns: string[];
  overallVerdict: string;
  recommendation: string;
  generatedAt: number;
}

interface Props {
  handle: string;
  displayName: string;
  niche: string;
  followerCount?: number;
  engagementRate?: string;
  postsThisWeek?: number;
  source?: string;
  existingBrief?: Brief | null;
  onBriefGenerated: (brief: Brief) => void;
}

const VERDICT_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  HIRE:  { color: '#16a34a', bg: 'rgba(22,163,74,0.1)',  label: 'Hire' },
  WATCH: { color: '#d97706', bg: 'rgba(217,119,6,0.1)', label: 'Watch' },
  PASS:  { color: '#dc2626', bg: 'rgba(220,38,38,0.1)', label: 'Pass' },
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 10);
  const color = pct >= 70 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-neutral-400 w-20 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-semibold tabular-nums w-5 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-1.5">{children}</p>
  );
}

export function CreatorBriefSection({ handle, displayName, niche, followerCount, engagementRate, postsThisWeek, source, existingBrief, onBriefGenerated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [brief, setBrief]     = useState<Brief | null>(existingBrief ?? null);

  const verdictStyle = VERDICT_STYLE[brief?.overallVerdict ?? ''] ?? VERDICT_STYLE.WATCH;

  async function generateBrief() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recon/creator-brief', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle, displayName, niche, followerCount, engagementRate,
          postsThisWeek, source,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      const b: Brief = {
        _id: data._id ?? String(Date.now()),
        contentScore:       data.contentScore,
        consistencyScore:   data.consistencyScore,
        monetizationRating: data.monetizationRating,
        topHooks:          data.topHooks ?? [],
        contentPatterns:   data.contentPatterns ?? [],
        overallVerdict:    data.overallVerdict,
        recommendation:    data.recommendation,
        generatedAt:      Date.now(),
      };
      setBrief(b);
      onBriefGenerated(b);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2">
          <Sparkles size={13} style={{ color: '#833ab4' }} />
          <span className="text-xs font-semibold text-neutral-800">Creator Brief</span>
          {brief && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: verdictStyle.bg, color: verdictStyle.color }}
            >
              {verdictStyle.label}
            </span>
          )}
        </div>

        {!brief ? (
          <button
            onClick={generateBrief}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-105 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #833ab4, #ff0069)' }}
          >
            {loading
              ? <><Loader2 size={11} className="animate-spin" /> Analysing...</>
              : <><Sparkles size={11} /> Generate Brief</>
            }
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400">
              <Clock size={9} className="inline mr-0.5" />
              {new Date(brief.generatedAt).toLocaleTimeString()}
            </span>
            <button
              onClick={generateBrief}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border transition-all hover:bg-neutral-50 disabled:opacity-50"
              style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#6b7280' }}
            >
              {loading ? <Loader2 size={9} className="animate-spin" /> : <Sparkles size={9} />}
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      {error && (
        <div className="px-5 py-3 flex items-center gap-2 text-red-500 text-xs">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      {brief && (
        <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scores */}
          <div className="space-y-2.5">
            <SectionLabel>Scores</SectionLabel>
            <ScoreBar label="Content Quality" value={brief.contentScore} />
            <ScoreBar label="Consistency"      value={brief.consistencyScore} />
            <ScoreBar label="Monetisation"    value={brief.monetizationRating} />
          </div>

          {/* Recommendation + patterns */}
          <div className="space-y-3">
            <div>
              <SectionLabel>Recommendation</SectionLabel>
              <p className="text-xs text-neutral-700 leading-relaxed">{brief.recommendation}</p>
            </div>

            <div>
              <SectionLabel>Top Hooks</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {brief.topHooks.map((h, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(131,58,180,0.08)', color: '#833ab4' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Content Patterns</SectionLabel>
              <div className="flex flex-col gap-1">
                {brief.contentPatterns.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-green-500 flex-shrink-0" />
                    <span className="text-[11px] text-neutral-600">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!brief && !loading && !error && (
        <div className="px-5 py-6 flex flex-col items-center text-center">
          <Sparkles size={24} className="text-neutral-200 mb-2" />
          <p className="text-xs text-neutral-400">No brief yet. Generate one to get AI-powered insights on this creator.</p>
        </div>
      )}
    </div>
  );
}
