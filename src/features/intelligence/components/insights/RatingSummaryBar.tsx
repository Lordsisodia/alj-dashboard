'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Bookmark, Users } from 'lucide-react';
import { fadeUp } from '../../constants';
import type { InsightsSummary, RaterStat } from '../../types';

interface Props {
  summary:      InsightsSummary;
  topRater:     RaterStat | undefined;
}

export function RatingSummaryBar({ summary, topRater }: Props) {
  const { totalRatings, upCount, downCount, saveCount } = summary;

  const upPct   = totalRatings > 0 ? Math.round((upCount   / totalRatings) * 100) : 0;
  const savePct = totalRatings > 0 ? Math.round((saveCount / totalRatings) * 100) : 0;
  const downPct = totalRatings > 0 ? Math.round((downCount / totalRatings) * 100) : 0;

  const chips = [
    {
      label:  'Total ratings',
      value:  totalRatings.toLocaleString(),
      icon:   <Users size={13} />,
      color:  '#833ab4',
      bgVar:  'rgba(131,58,180,0.08)',
    },
    {
      label:  'Liked',
      value:  `${upPct}%`,
      sub:    `${upCount} posts`,
      icon:   <ThumbsUp size={13} />,
      color:  '#22c55e',
      bgVar:  'rgba(34,197,94,0.08)',
    },
    {
      label:  'Saved',
      value:  `${savePct}%`,
      sub:    `${saveCount} posts`,
      icon:   <Bookmark size={13} />,
      color:  '#ff0069',
      bgVar:  'rgba(255,0,105,0.08)',
    },
    {
      label:  'Skipped',
      value:  `${downPct}%`,
      sub:    `${downCount} posts`,
      icon:   <ThumbsDown size={13} />,
      color:  '#9ca3af',
      bgVar:  'rgba(0,0,0,0.05)',
    },
    {
      label:  'Top rater',
      value:  topRater?.ratedBy ?? '-',
      sub:    topRater ? `${topRater.total} ratings` : undefined,
      icon:   <Users size={13} />,
      color:  '#4a9eff',
      bgVar:  'rgba(74,158,255,0.08)',
    },
  ];

  return (
    <motion.div variants={fadeUp} className="grid grid-cols-5 gap-3">
      {chips.map(chip => (
        <div
          key={chip.label}
          className="rounded-xl p-3 space-y-2"
          style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: chip.bgVar }}
        >
          <div className="flex items-center gap-1.5" style={{ color: chip.color }}>
            {chip.icon}
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
              {chip.label}
            </span>
          </div>
          <p className="text-lg font-bold text-neutral-800 leading-none">{chip.value}</p>
          {chip.sub && (
            <p className="text-[10px] text-neutral-400">{chip.sub}</p>
          )}
        </div>
      ))}
    </motion.div>
  );
}
