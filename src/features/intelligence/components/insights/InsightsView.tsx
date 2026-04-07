'use client';

import { useQuery, useMutation } from 'convex/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { containerVariants } from '../../constants';
import { RatingSummaryBar } from './RatingSummaryBar';
import { TopRatedPosts }    from './TopRatedPosts';
import { WinningHooks }     from './WinningHooks';
import { LearningSignal }   from './LearningSignal';
import { InsightCards }     from './InsightCards';
import { AIChatPanel }      from '../trends/AIChatPanel';
import type { InsightsData } from '../../types';
import type { TrendsData }   from '../../types';

export function InsightsView() {
  const [chatOpen, setChatOpen] = useState(true);

  const data        = useQuery(api.insights.getInsights, {}) as InsightsData | undefined;
  const trends      = useQuery(api.intelligence.getTrends, { days: 30 }) as TrendsData | undefined;
  const seedRatings = useMutation(api.insightsSeed.seedSwipeRatings);

  useEffect(() => {
    if (data && data.summary.totalRatings === 0) seedRatings({});
  }, [data, seedRatings]);

  if (data === undefined) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => <div key={i} className="rounded-xl h-28 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />)}
        </div>
        <div className="rounded-xl h-24 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
        <div className="rounded-xl h-96 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
      </div>
    );
  }

  const topRater = data.raterActivity[0];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Row 1 - KPI strip */}
      <RatingSummaryBar summary={data.summary} topRater={topRater} />

      {/* Row 2 - Insight cards */}
      <InsightCards trends={trends} insights={data} />

      {/* Row 3 - Learning signal */}
      <LearningSignal data={data} />

      {/* Row 4 - AI Chat (primary surface) */}
      {chatOpen
        ? <AIChatPanel data={trends} insightsData={data} onClose={() => setChatOpen(false)} />
        : (
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            Ask Intelligence
          </button>
        )
      }

      {/* Row 5 - Winning hooks */}
      <WinningHooks posts={data.topRatedPosts} />

      {/* Row 6 - Top rated posts */}
      <TopRatedPosts posts={data.topRatedPosts} />
    </motion.div>
  );
}
