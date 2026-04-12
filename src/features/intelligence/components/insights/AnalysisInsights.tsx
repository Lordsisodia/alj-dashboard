'use client';

import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '../../../../../convex/_generated/api';
import { Brain, Zap, Film, Hash, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUp } from '../../constants';

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

// ── ColHeader ─────────────────────────────────────────────────────────────────

function ColHeader({ title, count, accentColor }: { title: string; count: number; accentColor: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ borderBottom: `1px solid ${accentColor}18` }}>
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>{title}</p>
      <span className="ml-auto px-1.5 py-0.5 rounded-md text-[10px] font-semibold tabular-nums"
        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>{count}</span>
    </div>
  );
}

// ── Hook Score Distribution ───────────────────────────────────────────────────

function HookScoreDist({ distribution }: { distribution: { label: string; count: number }[] }) {
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#4a9eff', '#22c55e'];
  const max = Math.max(...distribution.map(b => b.count), 1);

  return (
    <div className="flex flex-col h-full">
      <ColHeader title="Hook Scores" count={distribution.reduce((s, b) => s + b.count, 0)} accentColor="#6d28d9" />
      <div className="flex-1 min-h-0 flex flex-col justify-end gap-1 px-3 py-3">
        <div className="flex items-end gap-1 flex-1">
          {distribution.map((b, i) => {
            const h = max > 0 ? (b.count / max) * 100 : 0;
            return (
              <div key={b.label} className="flex flex-col items-center gap-0.5 flex-1">
                <span className="text-[9px] font-semibold text-neutral-500">{b.count > 0 ? b.count : ''}</span>
                <div className="w-full rounded-t-sm" style={{ backgroundColor: COLORS[i], height: `${h}%`, minHeight: 4 }} />
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">
          {distribution.map((b, i) => (
            <span key={b.label} className="flex-1 text-center text-[8px] text-neutral-400">{b.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Emotion Frequency ─────────────────────────────────────────────────────────

const EMOTION_COLORS: Record<string, string> = {
  confident: '#059669', playful: '#ea580c', neutral: '#9ca3af',
  intense: '#dc2626', excited: '#f97316', vulnerable: '#7c3aed',
  seductive: '#db2777', deadpan: '#6b7280', angry: '#ef4444',
  joyful: '#eab308', motivational: '#833ab4',
};

function EmotionFreq({ emotions }: { emotions: { emotion: string; count: number; avgER: number }[] }) {
  const max = Math.max(...emotions.map(e => e.count), 1);

  return (
    <div className="flex flex-col h-full">
      <ColHeader title="Emotions" count={emotions.length} accentColor="#ff0069" />
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-1.5">
        {emotions.map((e, i) => {
          const color = EMOTION_COLORS[e.emotion.toLowerCase()] ?? '#833ab4';
          const w = (e.count / max) * 100;
          return (
            <div key={e.emotion} className="flex items-center gap-1.5">
              <span className="text-[9px] font-medium text-neutral-600 capitalize w-16 shrink-0 truncate">{e.emotion}</span>
              <div className="flex-1 relative h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${w}%` }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                />
              </div>
              <span className="text-[9px] font-semibold text-neutral-500 w-4 text-right shrink-0">{e.count}</span>
              <span className="text-[8px] text-neutral-400 w-10 shrink-0 text-right">{(e.avgER * 100).toFixed(1)}%</span>
            </div>
          );
        })}
        {emotions.length === 0 && (
          <p className="text-[10px] text-neutral-400 text-center py-4">No emotion data yet</p>
        )}
      </div>
    </div>
  );
}

// ── Rule Leaderboard ──────────────────────────────────────────────────────────

type GroupBy = 'hook' | 'format' | 'vibe' | 'emotion';

interface LeaderboardEntry { dimension: string; niche: string; count: number; avgOutlier: number; avgER: number; }

const GROUP_COLORS: Record<GroupBy, string> = {
  hook: '#833ab4', format: '#ff0069', vibe: '#22c55e', emotion: '#f97316',
};

const GROUP_ICONS: Record<GroupBy, React.ReactNode> = {
  hook:   <Hash size={10} />,
  format: <Film size={10} />,
  vibe:   <Zap size={10} />,
  emotion: <Brain size={10} />,
};

function RuleCard({ groupBy, data }: { groupBy: GroupBy; data: LeaderboardEntry[] }) {
  const accent = GROUP_COLORS[groupBy];
  const label = groupBy === 'hook' ? 'Winning Hooks' : groupBy === 'format' ? 'Winning Formats' : groupBy === 'vibe' ? 'Winning Vibes' : 'Winning Emotions';
  const top = data[0];

  return (
    <div className="flex flex-col h-full">
      <ColHeader title={label} count={data.length} accentColor={accent} />
      <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-1">
        {data.slice(0, 5).map((row, i) => (
          <div key={row.dimension} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
            style={{ backgroundColor: i === 0 ? `${accent}08` : 'transparent' }}>
            <span className="text-[9px] font-bold w-4 text-center shrink-0"
              style={{ color: i === 0 ? accent : '#9ca3af' }}>#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-neutral-700 capitalize truncate">
                {row.dimension.replace(/_/g, ' ')}
              </p>
              <p className="text-[8px] text-neutral-400">{row.count} posts · {row.niche}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[9px] font-bold" style={{ color: accent }}>{row.avgOutlier.toFixed(1)}×</p>
              <p className="text-[8px] text-neutral-400">{row.avgER.toFixed(1)}% ER</p>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-[10px] text-neutral-400 text-center py-4">No data yet</p>
        )}
        {!top && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-neutral-300">
            <TrendingUp size={16} />
            <p className="text-[10px]">Analyse posts to see {groupBy} signals</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type TabId = 'hook' | 'format' | 'vibe' | 'emotion';

const TABS: { id: TabId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'hook',    label: 'Hooks',   icon: <Hash size={10} />,   color: '#833ab4' },
  { id: 'format',  label: 'Formats', icon: <Film size={10} />,   color: '#ff0069' },
  { id: 'vibe',    label: 'Vibes',   icon: <Zap size={10} />,   color: '#22c55e' },
  { id: 'emotion', label: 'Emotions', icon: <Brain size={10} />, color: '#f97316' },
];

export function AnalysisInsights() {
  const hookStats = useQuery(api.intelligence.getHookStats, { days: 30 });
  const [activeTab, setActiveTab] = useState<TabId>('hook');

  const ruleData = useQuery(api.intelligence.getRuleLeaderboard, {
    groupBy: activeTab,
    limit: 10,
  }) as LeaderboardEntry[] | undefined;

  const distribution = hookStats?.scoreDistribution ?? [];
  const emotions = hookStats?.emotionFrequency ?? [];

  return (
    <motion.div variants={fadeUp} className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}>

      {/* Section header */}
      <div className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'linear-gradient(135deg, rgba(109,40,217,0.04), rgba(255,0,105,0.03))' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
          <Brain size={11} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-neutral-900">Analysis Intelligence</p>
          <p className="text-[9px] text-neutral-400">Hook quality, emotional triggers & winning patterns from AI analysis</p>
        </div>
        {/* Tab switcher */}
        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold transition-all',
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-neutral-500 hover:bg-black/[0.04]'
              )}
              style={activeTab === tab.id ? { background: `linear-gradient(135deg, ${tab.color}, ${tab.color}bb)` } : {}}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-4 divide-x" style={{ minHeight: 180 }}>
        {/* Hook score dist */}
        <div style={{ borderRight: '1px solid rgba(0,0,0,0.05)' }}>
          <HookScoreDist distribution={distribution} />
        </div>

        {/* Emotion freq */}
        <div style={{ borderRight: '1px solid rgba(0,0,0,0.05)' }}>
          <EmotionFreq emotions={emotions} />
        </div>

        {/* Rule leaderboard — spans 2 cols */}
        <div className="col-span-2">
          <RuleCard groupBy={activeTab} data={ruleData ?? []} />
        </div>
      </div>

    </motion.div>
  );
}
