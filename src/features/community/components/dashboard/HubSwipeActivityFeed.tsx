'use client';

import { Heart, X, Send, Clock, Layers, AlertTriangle } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MOCK_NICHE_TARGETS, NICHE_CONFIG } from '../../constants';
import { timeAgo } from '@/features/intelligence/utils';

const DECISION_CONFIG = {
  up:   { icon: <Heart size={10} className="fill-current" />, color: '#2563eb', label: 'Rated' },
  down: { icon: <X size={10} />,                              color: '#a3a3a3', label: 'Passed' },
  save: { icon: <Send size={10} />,                           color: '#22c55e', label: 'Sent' },
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
  const sendQueue      = useQuery(api.hub.getSendQueue);
  const recentActivity = useQuery(api.hub.getRecentActivity);
  const nicheCounts    = useQuery(api.hub.getNicheQueueCounts);

  // Compute niche gaps from real queue counts vs config targets
  const nicheGaps = nicheCounts == null
    ? []
    : Object.entries(MOCK_NICHE_TARGETS).map(([niche, target]) => {
        const entry   = nicheCounts.find((n) => n.niche.toLowerCase() === niche.toLowerCase());
        const count   = entry?.count ?? 0;
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

        {/* Section A: Send Queue */}
        <SectionLabel icon={<Send size={10} style={{ color: '#22c55e' }} />} count={sendQueue?.length}>
          Send Queue
        </SectionLabel>

        {sendQueue == null ? (
          <div className="px-3 py-2 space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : sendQueue.length === 0 ? (
          <p className="px-4 py-4 text-xs text-neutral-400 text-center">Queue is empty</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {sendQueue.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-neutral-50 transition-colors">
                {/* Accent rail */}
                <div className="w-0.5 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: '#2563eb' }} />
                {/* Thumbnail or gradient fallback */}
                <div
                  className="w-7 h-9 rounded-lg flex-shrink-0 bg-neutral-100 overflow-hidden"
                >
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }} />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-neutral-700 truncate">{item.handle}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{item.niche}</p>
                  <p className="text-[9px] text-neutral-300 mt-0.5">{timeAgo(item.savedAt)}</p>
                </div>
                {/* Send chip */}
                <span
                  className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
                >
                  Send
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Section B: Niche Gaps */}
        <SectionLabel icon={<AlertTriangle size={10} style={{ color: '#f59e0b' }} />}>
          Niche Gaps
        </SectionLabel>

        <div className="grid grid-cols-2 gap-2 px-3 pt-1 pb-3">
          {nicheGaps.length === 0 && nicheCounts != null ? (
            <p className="col-span-2 text-xs text-neutral-400 text-center py-2">All niches on target</p>
          ) : (
            nicheGaps.map(({ niche, fillPct, need }) => {
              const cfg       = NICHE_CONFIG[niche.toLowerCase()] ?? { label: niche, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' };
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
            })
          )}
        </div>

        {/* Section C: Recent Activity */}
        <SectionLabel icon={<Clock size={10} style={{ color: '#a3a3a3' }} />} count={recentActivity?.length ?? 0}>
          Recent Activity
        </SectionLabel>

        {recentActivity == null ? (
          <div className="px-3 py-2 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <p className="px-4 py-4 text-xs text-neutral-400 text-center">No activity yet</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {recentActivity.slice(0, 3).map((entry, idx) => {
              const cfg = DECISION_CONFIG[entry.decision] ?? DECISION_CONFIG.down;
              return (
                <div key={idx} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-neutral-50 transition-colors">
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
                    <p className="text-[10px] text-neutral-400 truncate">{entry.niche}</p>
                  </div>
                  {/* Timestamp chip */}
                  <span
                    className="flex-shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(0,0,0,0.04)', color: '#a3a3a3' }}
                  >
                    {timeAgo(entry._creationTime)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
