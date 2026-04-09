'use client';

import { Heart, X, Send, Clock, Layers, AlertTriangle } from 'lucide-react';
import { MOCK_SWIPE_ACTIVITY, MOCK_SEND_QUEUE, MOCK_NICHE_TARGETS, NICHE_CONFIG, POSTS } from '../../constants';
import type { Niche } from '../../types';

const NICHES: Niche[] = ['fitness', 'lifestyle', 'fashion', 'wellness'];

const DECISION_CONFIG = {
  like: { icon: <Heart size={10} className="fill-current" />, color: '#2563eb', label: 'Rated' },
  pass: { icon: <X size={10} />,                              color: '#a3a3a3', label: 'Passed' },
  sent: { icon: <Send size={10} />,                           color: '#22c55e', label: 'Sent' },
};

function SectionLabel({
  icon,
  children,
  count,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="px-4 pt-4 pb-1.5 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wide">{children}</span>
      </div>
      {count != null && <span className="text-[9px] text-neutral-400 tabular-nums">{count}</span>}
    </div>
  );
}

export function HubSwipeActivityFeed() {
  // Compute niche fill percentages for gap detection
  const counts = NICHES.reduce<Record<Niche, number>>((acc, n) => {
    acc[n] = POSTS.filter(p => p.niche === n).length;
    return acc;
  }, {} as Record<Niche, number>);

  const nicheGaps = NICHES.map(niche => {
    const count   = counts[niche];
    const target  = MOCK_NICHE_TARGETS[niche] ?? 20;
    const fillPct = Math.min(100, Math.round((count / target) * 100));
    const need    = Math.max(0, target - count);
    return { niche, fillPct, need };
  })
    .sort((a, b) => a.fillPct - b.fillPct)
    .slice(0, 2);

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <Layers size={13} style={{ color: '#2563eb' }} />
          <p className="text-xs font-bold text-neutral-800">Swipe Triage</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-[10px] text-neutral-400 font-medium">Live</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto pt-1 pb-4">

        {/* ── Section A: Send Queue ── */}
        <SectionLabel icon={<Send size={10} style={{ color: '#22c55e' }} />} count={MOCK_SEND_QUEUE.length}>
          Send Queue
        </SectionLabel>

        {MOCK_SEND_QUEUE.length === 0 ? (
          <p className="px-4 py-4 text-xs text-neutral-400 text-center">Queue is empty</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {MOCK_SEND_QUEUE.map(item => (
              <div key={item.id} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-neutral-50 transition-colors">
                {/* Accent rail */}
                <div className="w-0.5 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: '#2563eb' }} />
                {/* Gradient thumbnail */}
                <div
                  className="w-7 h-9 rounded-lg flex-shrink-0"
                  style={{ background: item.gradient }}
                />
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-neutral-700 truncate">{item.handle}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{item.caption}</p>
                  <p className="text-[9px] text-neutral-300 mt-0.5">{item.approvedAt}</p>
                </div>
                {/* Send chip */}
                <span
                  className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
                >
                  Send →
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Section B: Niche Gaps ── */}
        <SectionLabel icon={<AlertTriangle size={10} style={{ color: '#f59e0b' }} />}>
          Niche Gaps
        </SectionLabel>

        <div className="grid grid-cols-2 gap-2 px-3 pt-1 pb-3">
          {nicheGaps.map(({ niche, fillPct, need }) => {
            const cfg = NICHE_CONFIG[niche];
            const chipColor = fillPct >= 80 ? '#16a34a' : fillPct >= 40 ? '#d97706' : '#dc2626';
            const chipBg    = fillPct >= 80 ? 'rgba(34,197,94,0.1)' : fillPct >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
            const chipLabel = fillPct >= 80 ? 'OK' : fillPct >= 40 ? 'Low' : 'Empty';

            return (
              <div
                key={niche}
                className="rounded-xl p-2.5 flex flex-col gap-1"
                style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                  <span
                    className="text-[9px] font-bold px-1 py-0.5 rounded"
                    style={{ background: chipBg, color: chipColor }}
                  >
                    {chipLabel}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500">Need {need} more</p>
              </div>
            );
          })}
        </div>

        {/* ── Section C: Recent Activity ── */}
        <SectionLabel icon={<Clock size={10} style={{ color: '#a3a3a3' }} />} count={3}>
          Recent Activity
        </SectionLabel>

        <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
          {MOCK_SWIPE_ACTIVITY.slice(0, 3).map(entry => {
            const cfg = DECISION_CONFIG[entry.decision];
            return (
              <div key={entry.id} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-neutral-50 transition-colors">
                {/* Accent rail */}
                <div className="w-0.5 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                {/* Decision icon tile */}
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: cfg.color + '18', color: cfg.color }}
                >
                  {cfg.icon}
                </span>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-neutral-700 truncate">{entry.handle}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{entry.caption}</p>
                </div>
                {/* Timestamp chip */}
                <span
                  className="flex-shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(0,0,0,0.04)', color: '#a3a3a3' }}
                >
                  {entry.timestamp}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
