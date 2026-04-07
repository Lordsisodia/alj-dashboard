'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { containerVariants } from '../../constants';
import { PostDetailDrawer }      from '../drawer/PostDetailDrawer';
import { AnalysisQueue }         from './AnalysisQueue';
import { AnalysedPostGrid }      from './AnalysedPostGrid';
import { AnalysisPipelineStrip } from './AnalysisPipelineStrip';
import type { DrawerPost }       from '../../types';

interface Props { days: number; niche: string; }

export function AnalysisView({ days, niche }: Props) {
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);

  const analysed = useQuery(api.intelligence.getAnalysedPosts, {
    days,
    niche: niche !== 'all' ? niche : undefined,
  });

  function openDrawer(postId: string) {
    const idx = (analysed ?? []).findIndex(p => p._id === postId);
    if (idx !== -1) setDrawerIndex(idx);
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <AnalysisPipelineStrip />

        <AnalysisQueue onAnalyse={openDrawer} />

        <AnalysedPostGrid
          posts={(analysed ?? []).map(p => ({
            _id:            p._id,
            handle:         p.handle,
            niche:          p.niche,
            contentType:    p.contentType,
            thumbnailUrl:   p.thumbnailUrl,
            engagementRate: p.engagementRate,
            hookScore:      p.aiAnalysis.hookScore,
            hookLine:       p.aiAnalysis.hookLine,
            emotions:       p.aiAnalysis.emotions,
          }))}
          onSelect={openDrawer}
        />
      </motion.div>

      <AnimatePresence>
        {drawerIndex !== null && analysed && (
          <PostDetailDrawer
            posts={analysed as unknown as DrawerPost[]}
            initialIndex={drawerIndex}
            onClose={() => setDrawerIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
