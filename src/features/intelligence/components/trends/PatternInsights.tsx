'use client';

import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { GitBranch } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { fadeUp } from '../../constants';
import { PatternCard } from './PatternCard';
import type { PatternCluster } from '../../types';

interface Props {
  days:  number;
  niche: string;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 rounded-2xl gap-2 text-center" style={{ border: '1px dashed rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }}>
      <GitBranch size={20} className="text-neutral-300" />
      <p className="text-xs font-medium text-neutral-500">No recurring patterns detected</p>
      <p className="text-[10px] text-neutral-400">Patterns emerge when ≥ 2 posts share a hashtag in the window</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl h-44 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
      ))}
    </div>
  );
}

export function PatternInsights({ days, niche }: Props) {
  const clusters = useQuery(
    api.intelligence.getPatterns,
    { days, niche: niche !== 'all' ? niche : undefined },
  ) as PatternCluster[] | undefined;

  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4a9eff, #833ab4)' }}>
          <GitBranch size={13} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-900">Cross-Account Patterns</p>
          <p className="text-[10px] text-neutral-400">Recurring themes across tracked creators this window</p>
        </div>
      </div>

      {clusters === undefined ? (
        <SkeletonGrid />
      ) : clusters.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {clusters.map((cluster, i) => (
            <PatternCard key={cluster.theme} cluster={cluster} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
