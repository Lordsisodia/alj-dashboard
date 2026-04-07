'use client';

import { motion } from 'framer-motion';
import { Database, Zap, TrendingUp, Star, Flame } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { fadeUp } from '../../constants';
import type { TrendsData } from '../../types';

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

  const statsData = useQuery(api.intelligence.getStats);

  const total         = raw?.totalPosts ?? 0;
  const outlierCount  = raw?.outlierPosts?.length ?? 0;

  // Posts from last 24 hours
  const oneDayMs = 24 * 60 * 60 * 1000;
  const new24h = statsData
    ? raw?.outlierPosts?.filter(p => {
        // use postedAt from outlier post shape if available, else approximate from days filter
        const t = p.postedAt ?? 0;
        return t > Date.now() - oneDayMs;
      }).length ?? 0
    : 0;

  // Above-median percentage: posts with baselineScore >= 1
  // outlierPosts already sorted by outlierRatio desc; use the top half as "above median"
  const aboveMedianPct = raw && raw.outlierPosts.length > 0
    ? Math.round((raw.outlierPosts.filter(p => (p.outlierRatio ?? 0) >= 1).length / Math.max(raw.outlierPosts.length, 1)) * 100)
    : 0;

  // Top creator: handle with most appearances in outlier posts
  const topCreator = raw?.outlierPosts
    ? Object.entries(
        raw.outlierPosts.reduce<Record<string, number>>((acc, p) => {
          acc[p.handle] = (acc[p.handle] ?? 0) + 1;
          return acc;
        }, {})
      )
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-'
    : '-';

  const PILLS = [
    { label: 'Posts indexed',   value: total.toLocaleString(), icon: <Database size={14} />,   color: '#833ab4', bg: 'rgba(131,58,180,0.09)' },
    { label: 'New 24h',         value: new24h.toString(),      icon: <Zap size={14} />,        color: '#22c55e', bg: 'rgba(34,197,94,0.09)' },
    { label: 'Above median',    value: `${aboveMedianPct}%`,   icon: <TrendingUp size={14} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.09)' },
    { label: 'Top creator',     value: topCreator !== '-' ? topCreator.replace('@', '') : '-', icon: <Star size={14} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.09)' },
    { label: 'Outliers',        value: outlierCount.toString(), icon: <Flame size={14} />,      color: '#ff0069', bg: 'rgba(255,0,105,0.09)' },
  ];

  return (
    <motion.div
      variants={fadeUp}
      className="grid grid-cols-5 gap-3 mb-4"
    >
      {PILLS.map((s) => (
        <div
          key={s.label}
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: s.bg, color: s.color }}
          >
            {s.icon}
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
