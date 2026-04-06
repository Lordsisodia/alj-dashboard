'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Clock } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';

const STORAGE_KEY = 'recon_weekly_digest';
interface Stored { text: string; generatedAt: number; }

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const h    = Math.floor(diff / 3_600_000);
  const m    = Math.floor(diff / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h >= 1)  return `${h}h ago`;
  return `${m}m ago`;
}

export function WeeklyDigestCard() {
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

    const handleCounts: Record<string, number> = {};
    for (const h of trends.topHooks) handleCounts[h.handle] = (handleCounts[h.handle] ?? 0) + 1;
    const mostActiveHandle = Object.entries(handleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
    const outliers = trends.outlierPosts ?? [];

    const stats = {
      totalPosts:       trends.totalPosts,
      accountCount:     Object.keys(handleCounts).length,
      topNiche:         trends.nicheStats[0]?.niche   ?? 'N/A',
      topNicheER:       ((trends.nicheStats[0]?.avgER ?? 0) * 100).toFixed(2),
      topFormat:        trends.formatStats[0]?.format ?? 'N/A',
      topFormatER:      ((trends.formatStats[0]?.avgER ?? 0) * 100).toFixed(2),
      topHook:          trends.topHooks[0]?.hook      ?? 'N/A',
      topHookHandle:    trends.topHooks[0]?.handle    ?? 'N/A',
      avgER:            ((trends.avgER ?? 0) * 100).toFixed(2),
      outlierCount:     outliers.length,
      mostActiveHandle,
      mostActivePosts:  handleCounts[mostActiveHandle] ?? 0,
      topPostHook:      outliers[0]?.hook  ?? 'N/A',
      topPostLikes:     outliers[0]?.likes ?? 0,
      topPostViews:     outliers[0]?.views ?? 0,
    };

    try {
      const res = await fetch('/api/recon/digest', {
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
      setError(e instanceof Error ? e.message : 'Failed to generate digest');
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div
      className="mx-3 mt-4 rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(131,58,180,0.18)', background: 'linear-gradient(135deg, rgba(255,0,105,0.025), rgba(131,58,180,0.04))' }}
    >
      {/* Single compact header row */}
      <div className="flex items-center gap-2.5 px-4 py-2.5">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Sparkles size={10} className="text-white" />
        </div>

        <span className="text-[11px] font-semibold text-neutral-700 flex-1">Weekly Intel Digest</span>

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

      {/* Body - only rendered when there's content */}
      {(text || streaming || error) && (
        <div className="px-4 pt-1 pb-3" style={{ borderTop: '1px solid rgba(131,58,180,0.10)' }}>
          {error   && <p className="text-xs text-red-500">{error}</p>}
          {!error  && (
            <p className="text-xs text-neutral-600 leading-relaxed">
              {text}
              {streaming && <span className="inline-block w-1 h-3 ml-0.5 bg-neutral-400 animate-pulse rounded-sm align-middle" />}
            </p>
          )}
        </div>
      )}

      {/* Empty hint - single line */}
      {!text && !streaming && !error && (
        <p className="px-4 pb-2.5 text-[10px] text-neutral-400 -mt-1">
          Hit Generate to get your weekly intel summary from scraped data.
        </p>
      )}
    </div>
  );
}
