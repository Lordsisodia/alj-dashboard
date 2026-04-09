'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// ── Shared helper ─────────────────────────────────────────────────────────────

export function timeAgo(ts: number): string {
  if (!ts) return 'never';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface StatusStripStat {
  icon?:   ReactNode;
  value:   string | number;
  label:   string;
  accent?: string; // value text color — defaults to neutral-800
}

interface StatusIndicator {
  label:  string;
  active: boolean; // true = green pulse, false = amber pulse
}

export interface StatusStripProps {
  status?:    StatusIndicator; // optional left pulsing dot + label
  stats:      StatusStripStat[];
  rightSlot?: ReactNode;       // right-aligned slot (e.g. timestamp)
  iconColor?: string;          // Tailwind class for stat icons — defaults to text-red-600
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function StatusStrip({ status, stats, rightSlot, iconColor = 'text-red-600', className }: StatusStripProps) {
  return (
    <motion.div
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl${className ? ' ' + className : ''}`}
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Status indicator */}
      {status && (
        <>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.active ? 'bg-green-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status.active ? 'bg-green-500' : 'bg-amber-500'}`} />
            </span>
            <span className="text-[11px] font-semibold" style={{ color: status.active ? '#22c55e' : '#f59e0b' }}>
              {status.label}
            </span>
          </div>
          {stats.length > 0 && <span className="text-neutral-200 select-none">|</span>}
        </>
      )}

      {/* Stat items */}
      {stats.map((stat, i) => (
        <Fragment key={i}>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 flex-shrink-0">
            {stat.icon && <span className={iconColor}>{stat.icon}</span>}
            <span>
              <span className="font-semibold" style={{ color: stat.accent ?? '#171717' }}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </span>
              {' '}{stat.label}
            </span>
          </div>
          {i < stats.length - 1 && <span className="text-neutral-200 select-none">|</span>}
        </Fragment>
      ))}

      {/* Right slot */}
      {rightSlot && (
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 ml-auto flex-shrink-0">
          {rightSlot}
        </div>
      )}
    </motion.div>
  );
}
