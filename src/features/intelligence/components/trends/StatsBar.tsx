'use client';

import { motion } from 'framer-motion';
import { FileText, TrendingUp, Film, Tag, Flame } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { fadeUp } from '../../constants';
import type { TrendsData } from '../../types';

const ICONS = [
  { icon: <FileText size={14} />, color: '#833ab4', bg: 'rgba(131,58,180,0.09)' },
  { icon: <TrendingUp size={14} />, color: '#22c55e', bg: 'rgba(34,197,94,0.09)' },
  { icon: <Film size={14} />, color: '#ff0069', bg: 'rgba(255,0,105,0.09)' },
  { icon: <Tag size={14} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.09)' },
  { icon: <Flame size={14} />, color: '#ff0069', bg: 'rgba(255,0,105,0.09)' },
];

interface Props {
  days:      number;
  niche?:    string;
  platform?: string;
  metric?:   'er' | 'views';
}

export function StatsBar({ days, niche = 'all', platform = 'all' }: Props) {
  const raw = useQuery(api.intelligence.getTrends, {
    days,
    niche:    niche    !== 'all' ? niche    : undefined,
    platform: platform !== 'all' ? platform : undefined,
  }) as TrendsData | undefined;

  const topFormat     = raw?.formatStats[0]?.format ?? '-';
  const topNiche      = raw?.nicheStats[0]?.niche   ?? '-';
  const avgER         = raw ? (raw.avgER * 100).toFixed(2) + '%' : '-';
  const total         = raw?.totalPosts ?? 0;
  const outlierCount  = raw?.outlierPosts?.length ?? 0;

  const stats = [
    { label: `Posts (${days}d)`,  value: total.toLocaleString() },
    { label: 'Avg engagement',    value: avgER },
    { label: 'Top format',        value: topFormat.charAt(0).toUpperCase() + topFormat.slice(1) },
    { label: 'Top niche',         value: topNiche },
    { label: 'Outliers detected', value: outlierCount.toString() },
  ];

  return (
    <motion.div
      variants={fadeUp}
      className="grid grid-cols-5 gap-3 mb-4"
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: ICONS[i].bg, color: ICONS[i].color }}
          >
            {ICONS[i].icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide truncate">{s.label}</p>
            <p className="text-sm font-bold text-neutral-900 truncate">{s.value}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
