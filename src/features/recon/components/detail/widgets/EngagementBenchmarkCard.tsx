'use client';

import { useState, useEffect, useRef } from 'react';
import { Target, RefreshCw, Clock } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const STORAGE_KEY = 'recon_engagement_benchmark';
interface Stored { text: string; generatedAt: number; }

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const h    = Math.floor(diff / 3_600_000);
  const m    = Math.floor(diff / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h >= 1)  return `${h}h ago`;
  return `${m}m ago`;
}

export function EngagementBenchmarkCard() {
  const [text,      setText]      = useState('');
  const [streaming, setStreaming] = useState(false);
  const [storedAt,  setStoredAt]  = useState<number | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const trends = useQuery(api.intelligence.getTrends, { days: 7 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: Stored = JSON.parse(raw);
        setText(stored.text);
        setStoredAt(stored.generatedAt);
      }
    } catch { /* ignore */ }
  }, []);

  async function generate() {
    if (!trends) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setStreaming(true);
    setError(null);
    setText('');

    const last  = trends.nicheStats.length - 1;
    const stats = {
      avgER:             (trends.avgER * 100).toFixed(2),
      totalPosts:        trends.totalPosts,
      topNiche:          trends.nicheStats[0]?.niche   ?? 'N/A',
      topNicheER:        ((trends.nicheStats[0]?.avgER ?? 0) * 100).toFixed(2),
      bottomNiche:       trends.nicheStats[last]?.niche ?? 'N/A',
      bottomNicheER:     ((trends.nicheStats[last]?.avgER ?? 0) * 100).toFixed(2),
      topFormat:         trends.formatStats[0]?.format ?? 'N/A',
      topFormatER:       ((trends.formatStats[0]?.avgER ?? 0) * 100).toFixed(2),
      excellentThreshold: ((trends.avgER * 2) * 100).toFixed(2),
    };

    try {
      const res = await fetch('/api/recon/benchmark', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ stats }),
        signal:  abortRef.current.signal,
      });
      if (!res.ok) throw new Error(await res.text());

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setText(full);
      }
      const now = Date.now();
      setStoredAt(now);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ text: full, generatedAt: now }));
    } catch (e: unknown) {
      if ((e as Error).name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(59,130,246,0.18)', background: 'linear-gradient(135deg, rgba(59,130,246,0.025), rgba(6,182,212,0.04))' }}
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
        >
          <Target size={10} className="text-white" />
        </div>

        <span className="text-[11px] font-semibold text-neutral-700 flex-1">Engagement Benchmark</span>

        {storedAt && !streaming && (
          <span className="flex items-center gap-1 text-[10px] text-neutral-400 flex-shrink-0">
            <Clock size={9} />{timeAgo(storedAt)}
          </span>
        )}

        <button
          onClick={generate}
          disabled={streaming || !trends}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-neutral-600 disabled:opacity-40 transition-colors hover:bg-black/[0.06]"
          style={{ border: '1px solid rgba(0,0,0,0.10)' }}
        >
          <RefreshCw size={9} className={streaming ? 'animate-spin' : ''} />
          {streaming ? 'Generating...' : text ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {(text || streaming || error) && (
        <div className="px-4 pt-1 pb-3" style={{ borderTop: '1px solid rgba(59,130,246,0.10)' }}>
          {error   && <p className="text-xs text-red-500">{error}</p>}
          {!error  && (
            <p className="text-xs text-neutral-600 leading-relaxed">
              {text}
              {streaming && <span className="inline-block w-1 h-3 ml-0.5 bg-neutral-400 animate-pulse rounded-sm align-middle" />}
            </p>
          )}
        </div>
      )}

      {!text && !streaming && !error && (
        <p className="px-4 pb-2.5 text-[10px] text-neutral-400 -mt-1">
          What counts as good ER this week — baseline, ceiling, and what to aim for.
        </p>
      )}
    </div>
  );
}
