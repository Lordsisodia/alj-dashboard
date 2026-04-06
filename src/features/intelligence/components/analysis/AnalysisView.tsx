'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { containerVariants } from '../../constants';
import { PostDetailDrawer }    from '../drawer/PostDetailDrawer';
import { AnalysisQueue }       from './AnalysisQueue';
import { AnalysedPostGrid }    from './AnalysedPostGrid';
import { HookScoreDistribution } from './HookScoreDistribution';
import { EmotionFrequency }    from './EmotionFrequency';
import { HookLineGallery }     from './HookLineGallery';
import { RuleCards }           from './RuleCards';
import type { DrawerPost }     from '../../types';

interface Props { days: number; niche: string; }

export function AnalysisView({ days, niche }: Props) {
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);

  const analysed = useQuery(api.intelligence.getAnalysedPosts, {
    days,
    niche: niche !== 'all' ? niche : undefined,
  });
  const hookStats = useQuery(api.intelligence.getHookStats, { days });

  function openDrawer(postId: string) {
    const idx = (analysed ?? []).findIndex(p => p._id === postId);
    if (idx !== -1) setDrawerIndex(idx);
  }

  // Derive RuleCards input from analysed posts
  const ruleInput = (analysed ?? []).map(p => ({
    hookLine:       p.aiAnalysis.hookLine,
    hookScore:      p.aiAnalysis.hookScore,
    engagementRate: p.engagementRate,
    emotions:       p.aiAnalysis.emotions,
  }));

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Queue - unanalysed outliers waiting for AI */}
        <AnalysisQueue onAnalyse={openDrawer} />

        {/* Stats row - distribution + emotions */}
        {hookStats && (hookStats.scoreDistribution.some(b => b.count > 0)) && (
          <div className="grid grid-cols-2 gap-4">
            <HookScoreDistribution distribution={hookStats.scoreDistribution} />
            <EmotionFrequency emotions={hookStats.emotionFrequency} />
          </div>
        )}

        {/* Hook line gallery */}
        {hookStats && hookStats.hookLines.length > 0 && (
          <HookLineGallery hookLines={hookStats.hookLines} />
        )}

        {/* Derived rules */}
        {ruleInput.length >= 3 && <RuleCards posts={ruleInput} />}

        {/* Analysed post grid - click → drawer */}
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

      {/* Drawer */}
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
