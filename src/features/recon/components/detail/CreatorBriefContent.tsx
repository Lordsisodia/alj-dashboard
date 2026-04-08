'use client';

import { CheckCircle2 } from 'lucide-react';
import { ScoreBar, SectionLabel } from './CreatorBriefScores';
import type { Brief } from './CreatorBriefSection';

interface BriefBodyContentProps {
  brief: Brief;
}

const VERDICT_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  HIRE:  { color: '#16a34a', bg: 'rgba(22,163,74,0.1)',  label: 'Hire' },
  WATCH: { color: '#d97706', bg: 'rgba(217,119,6,0.1)', label: 'Watch' },
  PASS:  { color: '#dc2626', bg: 'rgba(220,38,38,0.1)', label: 'Pass' },
};

export function BriefBodyContent({ brief }: BriefBodyContentProps) {
  return (
    <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2.5">
        <SectionLabel>Scores</SectionLabel>
        <ScoreBar label="Content Quality" value={brief.contentScore} />
        <ScoreBar label="Consistency"      value={brief.consistencyScore} />
        <ScoreBar label="Monetisation"    value={brief.monetizationRating} />
      </div>
      <div className="space-y-3">
        <div>
          <SectionLabel>Recommendation</SectionLabel>
          <p className="text-xs text-neutral-700 leading-relaxed">{brief.recommendation}</p>
        </div>
        <div>
          <SectionLabel>Top Hooks</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {brief.topHooks.map((h: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>{h}</span>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel>Content Patterns</SectionLabel>
          <div className="flex flex-col gap-1">
            {brief.contentPatterns.map((p: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle2 size={10} className="text-green-500 flex-shrink-0" />
                <span className="text-[11px] text-neutral-600">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
