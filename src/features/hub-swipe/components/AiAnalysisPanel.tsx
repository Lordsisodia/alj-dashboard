'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, Eye, Heart, MessageCircle, Bookmark, TrendingUp } from 'lucide-react';
import type { SwipeReelAiAnalysis } from '../types';

const EMOTION_COLORS: Record<string, string> = {
  motivational: '#833ab4', energetic: '#ff0069', emotional: '#f97316',
  funny: '#eab308', sensual: '#ec4899', aspirational: '#06b6d4',
  relatable: '#22c55e', dramatic: '#ef4444', playful: '#f59e0b',
  educational: '#3b82f6',
};

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

interface Props {
  analysis?:      SwipeReelAiAnalysis | null;
  views?:         number;
  likes?:         number;
  comments?:      number;
  saves?:         number;
  engagementRate?: number;
}

export function AiAnalysisPanel({ analysis, views, likes, comments, saves, engagementRate }: Props) {
  const [expanded,    setExpanded]    = useState(false);
  const [showAllSugg, setShowAllSugg] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const hasStats = views != null || likes != null || comments != null || saves != null;

  return (
    <div
      className="rounded-xl overflow-hidden bg-white flex flex-col gap-0"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <Sparkles size={13} style={{ color: '#833ab4' }} />
        <span className="text-xs font-semibold text-neutral-900">AI Analysis</span>
        {analysis && (
          <span
            className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: analysis.hookScore >= 70 ? 'linear-gradient(135deg, #ff0069, #833ab4)' : '#d4d4d4' }}
          >
            Hook {analysis.hookScore}/100
          </span>
        )}
      </div>

      {!analysis ? (
        <div className="px-4 py-8 text-center">
          <p className="text-[11px] font-medium text-neutral-500">No AI analysis yet</p>
          <p className="text-[10px] text-neutral-400 mt-1">Decide from the visuals and engagement stats below.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0 divide-y divide-black/[0.05]">

          {/* Hook score bar + line */}
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-neutral-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${analysis.hookScore}%`,
                    background: analysis.hookScore >= 70
                      ? 'linear-gradient(135deg, #ff0069, #833ab4)'
                      : analysis.hookScore >= 40
                      ? 'linear-gradient(135deg, #f97316, #eab308)'
                      : '#d4d4d4',
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-neutral-500 w-6 text-right">{analysis.hookScore}</span>
            </div>
            {analysis.hookLine && (
              <p className="text-[11px] italic text-neutral-600 leading-relaxed">
                &ldquo;{analysis.hookLine}&rdquo;
              </p>
            )}
          </div>

          {/* Emotions */}
          {analysis.emotions.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {analysis.emotions.slice(0, 5).map(e => (
                  <span
                    key={e}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white capitalize"
                    style={{ backgroundColor: EMOTION_COLORS[e.toLowerCase()] ?? '#833ab4' }}
                  >
                    {e}
                  </span>
                ))}
                {analysis.emotions.length > 5 && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-500">
                    +{analysis.emotions.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Breakdown */}
          {analysis.breakdown && (
            <div className="px-4 py-3">
              <p
                className={`text-[11px] text-neutral-600 leading-relaxed ${!expanded ? 'line-clamp-4' : ''}`}
              >
                {analysis.breakdown}
              </p>
              {analysis.breakdown.length > 200 && (
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="flex items-center gap-0.5 mt-1 text-[10px] font-semibold text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {expanded ? 'Show less' : 'Read more'}
                  <ChevronDown size={10} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="px-4 py-3 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Replicate this</p>
              {(showAllSugg ? analysis.suggestions : analysis.suggestions.slice(0, 3)).map((s, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <Sparkles size={9} className="mt-0.5 flex-shrink-0 text-violet-400" />
                  <p className="text-[11px] text-neutral-600 leading-snug">{s}</p>
                </div>
              ))}
              {analysis.suggestions.length > 3 && (
                <button
                  onClick={() => setShowAllSugg(v => !v)}
                  className="text-[10px] font-semibold text-neutral-400 hover:text-neutral-600 transition-colors mt-0.5"
                >
                  {showAllSugg ? 'Show less' : `+${analysis.suggestions.length - 3} more`}
                </button>
              )}
            </div>
          )}

          {/* Transcript */}
          {analysis.transcript && (
            <div className="px-4 py-2">
              <button
                onClick={() => setShowTranscript(v => !v)}
                className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Transcript
                <ChevronDown size={9} className={`transition-transform ${showTranscript ? 'rotate-180' : ''}`} />
              </button>
              {showTranscript && (
                <p className="mt-2 text-[10px] text-neutral-500 leading-relaxed max-h-32 overflow-y-auto">
                  {analysis.transcript}
                </p>
              )}
            </div>
          )}

        </div>
      )}

      {/* Engagement footer */}
      {hasStats && (
        <div
          className="px-4 py-2.5 flex items-center gap-3 flex-wrap"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa' }}
        >
          {views    != null && <StatItem icon={<Eye          size={10} />} value={fmtK(views)}    />}
          {likes    != null && <StatItem icon={<Heart        size={10} />} value={fmtK(likes)}    />}
          {comments != null && <StatItem icon={<MessageCircle size={10} />} value={fmtK(comments)} />}
          {saves    != null && <StatItem icon={<Bookmark     size={10} />} value={fmtK(saves)}    />}
          {engagementRate != null && (
            <StatItem icon={<TrendingUp size={10} />} value={`${engagementRate.toFixed(1)}%`} accent="#ff0069" />
          )}
        </div>
      )}
    </div>
  );
}

function StatItem({ icon, value, accent }: { icon: React.ReactNode; value: string; accent?: string }) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-neutral-500">
      <span className="text-neutral-400">{icon}</span>
      <span className="font-semibold" style={accent ? { color: accent } : undefined}>{value}</span>
    </div>
  );
}
