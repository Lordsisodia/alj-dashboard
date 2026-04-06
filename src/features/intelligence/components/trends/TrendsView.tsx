'use client';

import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { containerVariants } from '../../constants';
import { StatsBar }           from './StatsBar';
import { FormatChart }        from './FormatChart';
import { NicheLeaderboard }   from './NicheLeaderboard';
import { HooksTable }         from './HooksTable';
import { OutlierFeed }        from './OutlierFeed';
import { PatternInsights }    from './PatternInsights';
import { HashtagCorrelation } from './HashtagCorrelation';
import type { TrendsData }    from '../../types';

interface Props {
  days:      number;
  metric:    'er' | 'views';
  niche?:    string;
  platform?: string;
}

export function TrendsView({ days, metric, niche = 'all', platform = 'all' }: Props) {
  const raw = useQuery(api.intelligence.getTrends, {
    days,
    niche:    niche    !== 'all' ? niche    : undefined,
    platform: platform !== 'all' ? platform : undefined,
  }) as TrendsData | undefined;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 min-w-0 space-y-5">
      <StatsBar data={raw} days={days} />
      <OutlierFeed posts={raw?.outlierPosts ?? []} />

      <div className="grid grid-cols-2 gap-4">
        <FormatChart formats={raw?.formatStats ?? []} metric={metric} />
        <NicheLeaderboard niches={raw?.nicheStats ?? []} />
      </div>

      <HashtagCorrelation days={days} niche={niche} />
      <HooksTable hooks={raw?.topHooks ?? []} />
      <PatternInsights days={days} niche={niche} />
    </motion.div>
  );
}
