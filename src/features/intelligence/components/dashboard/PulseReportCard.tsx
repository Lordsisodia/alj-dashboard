'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ChevronDown, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

interface PulseData {
  topTrends: string[];
  hookPatterns: string[];
  outliers: string[];
  recommendations: string[];
}

interface Props {
  stats: {
    postsThisWeek: number;
    postsLastWeek: number;
    unanalysedCount: number;
    totalIndexed: number;
    latestScrapeAt: number;
  } | null;
  trends: import('../../types').TrendsData | null;
  hookStats: {
    scoreDistribution: { label: string; count: number }[];
    emotionFrequency: { emotion: string; count: number; avgER: number }[];
    hookLines: { hookLine: string; hookScore: number; handle: string; niche: string; engagementRate: number }[];
  } | null;
  insights: import('../../types').InsightsData | null;
}

function Section({ icon, title, items, color }: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-black/5 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 py-2.5 px-3 hover:bg-black/[0.02] transition-colors"
      >
        <span style={{ color }}>{icon}</span>
        <span className="text-[11px] font-semibold text-neutral-700 flex-1 text-left">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={11} className="text-neutral-400" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <ul className="px-3 pb-2.5 space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[10px] text-neutral-600 leading-relaxed">
              <span className="mt-0.5" style={{ color }}>·</span>
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export function PulseReportCard({ stats, trends, hookStats, insights }: Props) {
  const [pulse,     setPulse]     = useState<PulseData | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  async function generate() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/intelligence/pulse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ stats, trends, hookStats, insights }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPulse(data);
    } catch (e) {
      setError('Generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
            <Sparkles size={13} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-900">Pulse Report</p>
            <p className="text-[10px] text-neutral-400">AI weekly brief · MiniMax</p>
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5 rounded-lg text-white transition-opacity disabled:opacity-50"
          style={{ background: GRAD }}
        >
          {loading
            ? <RefreshCw size={10} className="animate-spin" />
            : <Sparkles size={10} />}
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </div>

      {/* Content */}
      {error && (
        <p className="px-4 py-3 text-[10px] text-red-500">{error}</p>
      )}

      {!pulse && !loading && !error && (
        <div className="px-4 py-6 text-center">
          <p className="text-[11px] text-neutral-400">No report yet. Click Generate to create your weekly brief.</p>
        </div>
      )}

      {pulse && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Section
            icon={<TrendingUp size={11} />}
            title="Top Trends"
            items={pulse.topTrends}
            color="#833ab4"
          />
          <Section
            icon={<Lightbulb size={11} />}
            title="Hook Patterns"
            items={pulse.hookPatterns}
            color="#ff0069"
          />
          <Section
            icon={<AlertTriangle size={11} />}
            title="Outliers"
            items={pulse.outliers}
            color="#f97316"
          />
          <Section
            icon={<Sparkles size={11} />}
            title="Recommendations"
            items={pulse.recommendations}
            color="#22c55e"
          />
        </motion.div>
      )}
    </div>
  );
}
