'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { OutlierFeed } from '../trends/OutlierFeed';
import type { TrendsData } from '../../types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Props {
  days:  number;
  niche?: string;
}

export function OutlierPanel({ days, niche = 'all' }: Props) {
  const raw = useQuery(api.intelligence.getTrends, {
    days,
    niche: niche !== 'all' ? niche : undefined,
  }) as TrendsData | undefined;

  const outlierCount = raw?.outlierPosts?.length ?? 0;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="absolute right-0 top-0 bottom-0 w-72 overflow-y-auto"
      style={{ backgroundColor: '#fff', borderLeft: '1px solid rgba(0,0,0,0.08)' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-pink-500" />
          <span className="text-xs font-semibold text-neutral-900">Outlier Alerts</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,0,105,0.08)', color: '#ff0069' }}>
            {outlierCount}
          </span>
        </div>
      </div>

      {/* OutlierFeed content */}
      <div className="p-4">
        <OutlierFeed posts={raw?.outlierPosts ?? []} />
      </div>
    </motion.div>
  );
}
