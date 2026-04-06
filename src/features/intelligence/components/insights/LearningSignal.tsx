'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import type { InsightsData } from '../../types';

interface Props {
  data: InsightsData;
}

export function LearningSignal({ data }: Props) {
  const signals: { label: string; value: string; color: string }[] = [];

  // Top niche
  const topNiche = data.nichePreferences[0];
  if (topNiche) {
    const pct = Math.round((topNiche.upRate + topNiche.saveRate) * 100);
    signals.push({
      label: 'Strongest niche',
      value: `${topNiche.niche} - ${pct}% positive signal`,
      color: '#833ab4',
    });
  }

  // Top format
  const topFormat = data.formatPreferences[0];
  if (topFormat) {
    const pct = Math.round((topFormat.upRate + topFormat.saveRate) * 100);
    const label = topFormat.format.charAt(0).toUpperCase() + topFormat.format.slice(1);
    signals.push({
      label: 'Preferred format',
      value: `${label}s save ${pct}% of the time`,
      color: '#4a9eff',
    });
  }

  // Save rate vs skip rate
  const { saveCount, downCount, totalRatings } = data.summary;
  if (totalRatings > 0) {
    const saveRate = Math.round((saveCount / totalRatings) * 100);
    const skipRate = Math.round((downCount / totalRatings) * 100);
    if (saveRate > skipRate) {
      signals.push({
        label: 'Curation quality',
        value: `Team saves ${saveRate - skipRate}% more than they skip - high signal`,
        color: '#22c55e',
      });
    } else {
      signals.push({
        label: 'Curation quality',
        value: `Team skips ${skipRate - saveRate}% more than they save - tighten the feed`,
        color: '#f97316',
      });
    }
  }

  if (signals.length === 0) return null;

  return (
    <motion.div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: 'linear-gradient(135deg, rgba(131,58,180,0.06), rgba(255,0,105,0.04))',
        border: '1px solid rgba(131,58,180,0.15)',
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center gap-2">
        <Brain size={13} style={{ color: '#833ab4' }} />
        <p className="text-xs font-semibold text-neutral-800">What the system is learning</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {signals.map(s => (
          <div
            key={s.label}
            className="rounded-lg p-3 space-y-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: s.color }}>{s.label}</p>
            <p className="text-[11px] text-neutral-700 leading-snug">{s.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
