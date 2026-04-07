'use client';

import { useRouter } from 'next/navigation';
import { motion }    from 'framer-motion';
import { useQuery }  from 'convex/react';
import { api }       from '@/convex/_generated/api';
import { containerVariants, fadeUp } from '../../constants';
import { FileText, TrendingUp, Flame, Sparkles } from 'lucide-react';
import { PipelineStatusStrip } from './PipelineStatusStrip';
import { KPIDeltaTile }        from './KPIDeltaTile';
import { OutlierRow }          from './OutlierRow';
import { ActionQueue }         from './ActionQueue';
import { LearningSignal }      from '../insights/LearningSignal';
import { FormatChart }         from '../trends/FormatChart';
import { NicheLeaderboard }    from '../trends/NicheLeaderboard';
import { HooksTable }          from '../trends/HooksTable';
import { PatternInsights }         from '../trends/PatternInsights';
import { HashtagCorrelation }      from '../trends/HashtagCorrelation';
import { HookScoreDistribution }   from '../analysis/HookScoreDistribution';
import { EmotionFrequency }        from '../analysis/EmotionFrequency';
import { HookLineGallery }         from '../analysis/HookLineGallery';
import { RuleCards }               from '../analysis/RuleCards';
import { PulseReportCard }         from './PulseReportCard';
import type { TrendsData }        from '../../types';
import type { InsightsData }      from '../../types';

export function DashboardView() {
  const router = useRouter();

  const stats     = useQuery(api.intelligence.getStats, {});
  const trends    = useQuery(api.intelligence.getTrends, { days: 7 }) as TrendsData   | undefined;
  const insights  = useQuery(api.insights.getInsights,  {})           as InsightsData | undefined;
  const hookStats = useQuery(api.intelligence.getHookStats, { days: 30 });

  const isLoading = stats === undefined || trends === undefined;

  // Trending one-liner
  const topNiche  = trends?.nicheStats[0];
  const topFormat = trends?.formatStats[0];
  const trendLine = topNiche && topFormat
    ? `${topNiche.niche} ${topFormat.format}s are leading this week - ${(topNiche.avgER * 100).toFixed(1)}% avg ER`
    : null;

  // Delta calcs
  const weekDelta   = (stats?.postsThisWeek ?? 0) - (stats?.postsLastWeek ?? 0);
  const outlierCount = trends?.outlierPosts.length ?? 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

      {/* Pipeline status */}
      <PipelineStatusStrip
        totalIndexed={stats?.totalIndexed   ?? 0}
        postsThisWeek={stats?.postsThisWeek ?? 0}
        latestScrapeAt={stats?.latestScrapeAt ?? 0}
      />

      {/* KPI tiles */}
      <motion.div variants={fadeUp} className="grid grid-cols-4 gap-3">
        <KPIDeltaTile
          label="Posts this week"
          value={stats?.postsThisWeek ?? '-'}
          delta={weekDelta}
          icon={<FileText size={14} />}
          iconBg="rgba(131,58,180,0.09)"
          iconColor="#833ab4"
        />
        <KPIDeltaTile
          label="Avg engagement (7d)"
          value={trends ? `${(trends.avgER * 100).toFixed(2)}%` : '-'}
          icon={<TrendingUp size={14} />}
          iconBg="rgba(34,197,94,0.09)"
          iconColor="#22c55e"
        />
        <KPIDeltaTile
          label="Outliers this week"
          value={isLoading ? '-' : outlierCount}
          icon={<Flame size={14} />}
          iconBg="rgba(255,0,105,0.09)"
          iconColor="#ff0069"
          cta={outlierCount > 0 ? { label: 'View in Qualify', onClick: () => {} } : undefined}
        />
        <KPIDeltaTile
          label="Needs analysis"
          value={stats?.unanalysedCount ?? '-'}
          icon={<Sparkles size={14} />}
          iconBg="rgba(74,158,255,0.09)"
          iconColor="#4a9eff"
          cta={(stats?.unanalysedCount ?? 0) > 0 ? { label: 'Go to Analysis', onClick: () => router.push('/isso/intelligence') } : undefined}
        />
      </motion.div>

      {/* Top outliers row */}
      <motion.div variants={fadeUp} className="space-y-2">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Top outliers this week</p>
        <OutlierRow posts={trends?.outlierPosts ?? []} />
      </motion.div>

      {/* Trending signal */}
      {trendLine && (
        <motion.div variants={fadeUp}
          className="px-4 py-3 rounded-xl text-xs font-medium text-neutral-700"
          style={{ background: 'linear-gradient(135deg, rgba(131,58,180,0.06), rgba(255,0,105,0.04))', border: '1px solid rgba(131,58,180,0.12)' }}>
          📈 {trendLine}
        </motion.div>
      )}

      {/* What the system is learning */}
      {insights && <LearningSignal data={insights} />}

      {/* Pulse Report */}
      <PulseReportCard
        stats={stats ?? null}
        trends={trends ?? null}
        hookStats={hookStats ?? null}
        insights={insights ?? null}
      />

      {/* Action queue */}
      <ActionQueue
        unanalysedCount={stats?.unanalysedCount ?? 0}
        unratedCount={0}
        onGoAnalysis={() => {}}
        onGoHub={() => router.push('/isso/community')}
      />

      {/* ── Moved from TrendsView ── */}
      {trends && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormatChart formats={trends.formatStats} metric={'er'} />
            <NicheLeaderboard niches={trends.nicheStats} />
          </div>

          <HashtagCorrelation days={7} niche="all" />
          <HooksTable hooks={trends.topHooks} />
          <PatternInsights days={7} niche="all" />
        </>
      )}

      {/* ── Analysis insights (moved from Analysis tab) ── */}
      {hookStats && hookStats.scoreDistribution.some(b => b.count > 0) && (
        <>
          <motion.p variants={fadeUp} className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide pt-2">
            Analysis insights
          </motion.p>
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
            <HookScoreDistribution distribution={hookStats.scoreDistribution} />
            <EmotionFrequency emotions={hookStats.emotionFrequency} />
          </motion.div>
          {hookStats.hookLines.length > 0 && (
            <HookLineGallery hookLines={hookStats.hookLines} />
          )}
          {hookStats.hookLines.length >= 3 && (
            <RuleCards posts={hookStats.hookLines.map(h => ({
              hookLine:       h.hookLine,
              hookScore:      h.hookScore,
              engagementRate: h.engagementRate,
              emotions:       [],
            }))} />
          )}
        </>
      )}

    </motion.div>
  );
}
