'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { InfoTooltip } from './InfoTooltip';

interface PipelineColumnProps {
  title: string;
  count: number;
  accentColor: string;
  columnBg: string;
  tooltip: string;
  headerExtra?: ReactNode;
  children: ReactNode;
  glowKey?: string | number;
}

export function PipelineColumn({ title, count, accentColor, columnBg, tooltip, headerExtra, children, glowKey }: PipelineColumnProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)', borderLeft: `2px solid ${accentColor}`, backgroundColor: columnBg }}
    >
      <motion.div
        key={glowKey}
        initial={{ boxShadow: `0 0 0 0 ${accentColor}00` }}
        animate={{ boxShadow: [`0 0 0 0 ${accentColor}00`, `0 0 12px 2px ${accentColor}44`, `0 0 0 0 ${accentColor}00`] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${accentColor}18` }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>{title}</p>
        <InfoTooltip text={tooltip} />
        {headerExtra}
        <span
          className="ml-auto px-1.5 py-0.5 rounded-md text-[10px] font-semibold tabular-nums"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {count}
        </span>
      </motion.div>
      <div className="p-3 max-h-[440px] overflow-y-auto space-y-1.5 scrollbar-thin">
        {children}
      </div>
    </div>
  );
}
