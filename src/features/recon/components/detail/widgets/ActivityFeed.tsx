'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LOG_ENTRIES, type LogStatus } from '../../../constants';
import { containerVariants, fadeUp } from '../../../constants';

const STATUS_CFG: Record<LogStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  success: { icon: <CheckCircle2 size={13} />, color: '#4a8a2d', bg: 'rgba(120,194,87,0.10)' },
  running: { icon: <Loader2 size={13} className="animate-spin" />, color: '#2563eb', bg: 'rgba(74,158,255,0.10)' },
  failed:  { icon: <XCircle size={13} />, color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
};

function fmtTs(ts: number): string {
  const now  = Date.now();
  const diff = now - ts;
  const m    = Math.floor(diff / 60_000);
  const h    = Math.floor(diff / 3_600_000);
  const d    = Math.floor(diff / 86_400_000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ActivityFeed() {
  const live = useQuery(api.intelligence.getRecentActivity);

  // Build display entries: real data when available, fallback to LOG_ENTRIES
  const entries = live && live.length > 0
    ? live.map(e => ({
        id:        e.id,
        handle:    e.handle,
        action:    `Scraped ${e.count} ${e.contentType}${e.count !== 1 ? 's' : ''} from`,
        timestamp: fmtTs(e.ts),
        status:    'success' as LogStatus,
      }))
    : LOG_ENTRIES.map(e => ({ id: e.id, handle: e.handle, action: e.action, timestamp: e.timestamp, status: e.status }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Live Activity</p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-neutral-400 font-medium">
            {live && live.length > 0 ? 'Live' : 'Sample'}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col overflow-y-auto flex-1"
      >
        {entries.map((entry, i) => {
          const cfg    = STATUS_CFG[entry.status];
          const isLast = i === entries.length - 1;
          return (
            <motion.div
              key={entry.id}
              variants={fadeUp}
              className="flex gap-3 px-4 py-3 relative"
              style={{ borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.04)' }}
            >
              {!isLast && (
                <div
                  className="absolute left-[27px] top-9 bottom-0 w-px"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                />
              )}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                {cfg.icon}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <p className="text-xs text-neutral-700 leading-snug">
                  {entry.action}{' '}
                  <span className="font-semibold" style={{ color: '#ff0069' }}>{entry.handle}</span>
                </p>
                <span className="text-[10px] text-neutral-400">{entry.timestamp}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
