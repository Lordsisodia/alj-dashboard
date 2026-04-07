'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { OutlierFeed } from '../trends/OutlierFeed';
import type { TrendsData } from '../../types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { GRAD } from '../../constants';

interface Props {
  days:   number;
  niche?: string;
}

export function OutlierPanel({ days, niche = 'all' }: Props) {
  const raw = useQuery(api.intelligence.getTrends, {
    days,
    niche: niche !== 'all' ? niche : undefined,
  }) as TrendsData | undefined;

  const count = raw?.outlierPosts?.length ?? 0;

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
            <p className="text-[9px] text-neutral-400">{count} signals · outperforming baseline</p>
          </div>
        </div>
      </div>

      {/* Scrollable feed */}
      <div className="flex-1 overflow-y-auto p-3">
        <OutlierFeed
          posts={raw?.outlierPosts ?? []}
          hideHeader
          vertical
        />
      </div>
    </motion.div>
  );
}
