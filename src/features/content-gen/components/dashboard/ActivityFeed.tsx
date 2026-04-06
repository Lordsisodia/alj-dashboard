'use client';

import { Sparkles, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import type { ActivityEvent, ActivityType } from './types';

const TYPE_CFG: Record<ActivityType, { icon: React.ReactNode; label: string; color: string }> = {
  generated:  { icon: <Sparkles   size={11} />, label: 'Generated',  color: '#8b5cf6' },
  approved:   { icon: <CheckCircle2 size={11} />, label: 'Approved',   color: '#10b981' },
  rejected:   { icon: <XCircle    size={11} />, label: 'Rejected',   color: '#ef4444' },
  queued:     { icon: <Clock      size={11} />, label: 'Queued',     color: '#f59e0b' },
  failed:     { icon: <Loader2    size={11} />, label: 'Failed',     color: '#ef4444' },
};

function fmtAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 60_000);
  if (diff < 1)   return 'just now';
  if (diff < 60)  return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

interface Props { events: ActivityEvent[] }

export function ActivityFeed({ events }: Props) {
  return (
    <div className="flex flex-col">
      {events.map((e, i) => {
        const cfg = TYPE_CFG[e.type];
        return (
          <div
            key={e.id}
            className="flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors"
            style={{ borderBottom: i < events.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
          >
            {/* Model dot */}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 mt-0.5"
              style={{ backgroundColor: e.modelColor }}
            >
              {e.modelName.slice(0, 1)}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-700 leading-snug">
                <span className="font-semibold">{e.modelName}</span>
                {' · '}
                <span style={{ color: cfg.color }} className="font-medium">{cfg.label}</span>
                {' '}
                <span className="text-neutral-500 line-clamp-1">{e.scene}</span>
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                {e.provider} · {fmtAgo(e.timestamp)}
              </p>
            </div>

            {/* Icon */}
            <span style={{ color: cfg.color }} className="flex-shrink-0 mt-0.5">
              {cfg.icon}
            </span>
          </div>
        );
      })}
    </div>
  );
}
