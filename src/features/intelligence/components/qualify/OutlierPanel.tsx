'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { OutlierCard } from '../trends/OutlierCard';
import type { OutlierPost } from '../../types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { GRAD } from '../../constants';

interface Props {
  days?:  number;
  niche?: string;
}

export function OutlierPanel({ niche: _niche }: Props) {
  const raw = useQuery(api.intelligence.getQualifyPosts, {}) as
    | Array<{
        _id:            string;
        handle:         string;
        niche:          string;
        contentType:    string;
        caption:        string;
        thumbnailUrl:   string;
        likes:          number;
        views:          number;
        saves:          number;
        engagementRate: number;
        baselineScore:  number;
        postedAt:       number;
      }>
    | undefined;

  // All posts with real view data, ranked by how much they outperform their creator's median
  const outlierPosts: OutlierPost[] = useMemo(() => {
    if (!raw) return [];
    return raw
      .filter(p => p.views > 0)
      .sort((a, b) => b.baselineScore - a.baselineScore)
      .slice(0, 20)
      .map(p => ({
        _id:            p._id,
        handle:         p.handle,
        niche:          p.niche,
        contentType:    p.contentType,
        hook:           (p.caption ?? '').split('\n')[0].slice(0, 120),
        thumbnailUrl:   p.thumbnailUrl,
        likes:          p.likes,
        views:          p.views,
        saves:          p.saves,
        engagementRate: p.engagementRate,
        outlierRatio:   p.baselineScore,
        postedAt:       p.postedAt,
      }));
  }, [raw]);

  const aboveBaseline = outlierPosts.filter(p => p.outlierRatio >= 1).length;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="absolute right-0 top-0 bottom-0 w-72 flex flex-col overflow-hidden rounded-xl"
      style={{ border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#fff' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fafafa' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: GRAD }}>
            <Flame size={13} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-700">Outlier Alert Feed</p>
            <p className="text-[9px] text-neutral-400">{aboveBaseline} signals above baseline</p>
          </div>
        </div>
      </div>

      {/* Scrollable feed */}
      <div className="flex-1 overflow-y-auto p-3">
        {outlierPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-2xl gap-2 text-center" style={{ border: '1px dashed rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }}>
            <Flame size={20} className="text-neutral-300" />
            <p className="text-xs font-medium text-neutral-500">No reels indexed yet</p>
            <p className="text-[10px] text-neutral-400">Scrape posts to see outliers</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {outlierPosts.map((post, i) => (
              <OutlierCard key={post._id.toString()} post={post} rank={i + 1} fullWidth portrait />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
