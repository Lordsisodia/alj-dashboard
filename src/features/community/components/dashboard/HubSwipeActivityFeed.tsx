'use client';

import { Heart, X, Send } from 'lucide-react';
import { MOCK_SWIPE_ACTIVITY } from '../../constants';

const DECISION_CONFIG = {
  like: { icon: <Heart size={10} className="fill-current" />, color: '#f43f5e', label: 'Rated' },
  pass: { icon: <X size={10} />,                              color: '#a3a3a3', label: 'Passed' },
  sent: { icon: <Send size={10} />,                           color: '#833ab4', label: 'Sent'   },
};

export function HubSwipeActivityFeed() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <p className="text-xs font-bold text-neutral-800">Recent Decisions</p>
        <span className="text-[10px] text-neutral-400">{MOCK_SWIPE_ACTIVITY.length} today</span>
      </div>

      <div className="divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'rgba(0,0,0,0.04)' } as React.CSSProperties}>
        {MOCK_SWIPE_ACTIVITY.map(entry => {
          const cfg = DECISION_CONFIG[entry.decision];
          return (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors">
              {/* Gradient thumbnail */}
              <div
                className="w-8 h-10 rounded-lg flex-shrink-0"
                style={{ background: entry.gradient }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="flex items-center gap-0.5 text-[10px] font-bold"
                    style={{ color: cfg.color }}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  {entry.sentTo && (
                    <span className="text-[10px] text-neutral-400">→ {entry.sentTo}</span>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-neutral-700 truncate">
                  {entry.handle}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">{entry.caption}</p>
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-neutral-300 flex-shrink-0">{entry.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
