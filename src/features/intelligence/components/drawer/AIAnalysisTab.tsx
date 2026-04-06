'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { Sparkles, Loader2, Zap, Mic, Lightbulb } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { ScoreRing } from '../shared/ScoreRing';
import type { DrawerPost } from '../../types';

const EMOTION_COLORS: Record<string, string> = {
  motivational: '#833ab4', energetic: '#ff0069', emotional: '#f97316',
  funny: '#eab308', sensual: '#ec4899', aspirational: '#06b6d4',
  relatable: '#22c55e', dramatic: '#ef4444',
};

export function AIAnalysisTab({ post }: { post: DrawerPost }) {
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [localAnalysis, setLocalAnalysis] = useState(post.aiAnalysis ?? null);
  const patchAnalysis = useMutation(api.intelligence.patchAnalysis);

  const analysis = localAnalysis ?? post.aiAnalysis;

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch('/api/intelligence/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ post }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const result = {
        transcript:  data.transcript ?? undefined,
        hookScore:   data.hookScore  ?? 5,
        hookLine:    data.hookLine   ?? '',
        emotions:    data.emotions   ?? [],
        breakdown:   data.breakdown  ?? '',
        suggestions: data.suggestions ?? [],
        analyzedAt:  Date.now(),
      };
      setLocalAnalysis(result);
      await patchAnalysis({ postId: post._id, ...result });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.1), rgba(131,58,180,0.1))' }}>
          <Sparkles size={20} style={{ color: '#833ab4' }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-800">Analyze with Gemini</p>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            {post.videoUrl ? 'Sends the R2 video to Gemini 1.5 Flash' : 'Caption-based analysis'}
            <br />for hook score, transcript & insights.
          </p>
        </div>
        {error && <p className="text-xs text-red-500 px-2">{error}</p>}
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-60 transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          {loading ? 'Analysing...' : 'Run Analysis'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hook score */}
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}>
        <ScoreRing score={analysis.hookScore} />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Hook Score</p>
          <p className="text-xs text-neutral-700 leading-snug mt-0.5 italic">"{analysis.hookLine}"</p>
        </div>
      </div>

      {/* Emotions */}
      {analysis.emotions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-1"><Zap size={9} />Emotion Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.emotions.map(e => (
              <span key={e} className="px-2 py-0.5 rounded-lg text-[11px] font-medium text-white capitalize"
                style={{ backgroundColor: EMOTION_COLORS[e.toLowerCase()] ?? '#833ab4' }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div>
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><Lightbulb size={9} />Breakdown</p>
        <p className="text-xs text-neutral-700 leading-relaxed">{analysis.breakdown}</p>
      </div>

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Suggestions</p>
          <ul className="space-y-1.5">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-xs text-neutral-700">
                <span className="text-[#833ab4] font-bold flex-shrink-0">{i + 1}.</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Transcript */}
      {analysis.transcript && (
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><Mic size={9} />Transcript</p>
          <p className="text-xs text-neutral-600 leading-relaxed italic">"{analysis.transcript}"</p>
        </div>
      )}

      {/* Re-run */}
      <button
        onClick={runAnalysis}
        disabled={loading}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04] transition-colors disabled:opacity-40"
      >
        {loading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
        {loading ? 'Re-analysing...' : 'Re-run analysis'}
      </button>
    </div>
  );
}
