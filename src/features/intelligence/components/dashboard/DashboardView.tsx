'use client';

import { useRouter } from 'next/navigation';
import Link        from 'next/link';
import { motion }  from 'framer-motion';
import { useQuery } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import { api }      from '../../../../../convex/_generated/api';
import { containerVariants, fadeUp } from '../../constants';
import { FileText, TrendingUp, Flame, Sparkles } from 'lucide-react';
import { PipelineStatusStrip } from './PipelineStatusStrip';
import { KPIDeltaTile }        from './KPIDeltaTile';
import { OutlierRow }          from './OutlierRow';
import { ActionQueue }         from './ActionQueue';
import { LearningSignal }       from '../insights/LearningSignal';
import { FormatChart }         from '../trends/FormatChart';
import { NicheLeaderboard }    from '../trends/NicheLeaderboard';
import { IntelligenceBrief }    from './IntelligenceBrief';
import { PulseReportCard }     from './PulseReportCard';
import type { TrendsData }  from '../../types';
import type { InsightsData } from '../../types';

export function DashboardView() {
  const router = useRouter();

  const stats    = useQuery(api.intelligence.getStats, {});
  const trends   = useQuery(api.intelligence.getTrends, { days: 7 }) as TrendsData  | undefined;
  const insights = useQuery(api.insights.getInsights, {})            as InsightsData | undefined;

  const isLoading = stats === undefined || trends === undefined;

  // Delta calcs
  const weekDelta    = (stats?.postsThisWeek ?? 0) - (stats?.postsLastWeek ?? 0);
  const outlierCount = trends?.outlierPosts.length ?? 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

      {/* ── 1. Pipeline status ── */}
      <PipelineStatusStrip
        totalIndexed={stats?.totalIndexed   ?? 0}
        postsThisWeek={stats?.postsThisWeek ?? 0}
        latestScrapeAt={stats?.latestScrapeAt ?? 0}
      />

      {/* ── 2. KPI tiles ── */}
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

      {/* ── 3. Top outliers row ── */}
      <motion.div variants={fadeUp} className="space-y-2">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Top outliers this week</p>
        <OutlierRow posts={trends?.outlierPosts ?? []} />
      </motion.div>

      {/* ── 4. Intelligence Brief + Learning Signal (companion row) ── */}
      {trends && (
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
          {/* Intelligence Brief — ~65% */}
          <div className="col-span-2">
            <IntelligenceBrief trends={trends} />
          </div>
          {/* Learning Signal — ~35% */}
          {insights && (
            <LearningSignal data={insights} />
          )}
        </motion.div>
      )}

      {/* ── 5. Pulse Report ── */}
      <PulseReportCard
        stats={stats ?? null}
        trends={trends ?? null}
        hookStats={null}
        insights={insights ?? null}
      />

      {/* ── 6. Action queue ── */}
      <ActionQueue
        unanalysedCount={stats?.unanalysedCount ?? 0}
        unratedCount={0}
        onGoAnalysis={() => {}}
        onGoHub={() => router.push('/isso/community')}
      />

      {/* ── 7. Format & Niche row (with section label) ── */}
      {trends && (
        <>
          <motion.p variants={fadeUp} className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
            Format &amp; Niche breakdown
          </motion.p>
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
            <FormatChart formats={trends.formatStats} metric={'er'} />
            <NicheLeaderboard niches={trends.nicheStats} />
          </motion.div>
        </>
      )}

      {/* ── 8. Summary links strip ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        <Link
          href="/isso/intelligence"
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-black/[0.07] hover:border-[#ff0069]/30 transition-colors group"
        >
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Top hooks</p>
            <p className="text-xs font-medium text-neutral-700 mt-0.5">
              {trends?.topHooks?.[0]?.hook?.slice(0, 48) ?? 'No hooks yet'}
              {(trends?.topHooks?.[0]?.hook?.length ?? 0) > 48 ? '...' : ''}
            </p>
          </div>
          <ArrowRight size={12} className="text-neutral-300 group-hover:text-[#ff0069] transition-colors shrink-0" />
        </Link>
        <Link
          href="/isso/intelligence"
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-black/[0.07] hover:border-[#ff0069]/30 transition-colors group"
        >
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Hashtag patterns</p>
            <p className="text-xs font-medium text-neutral-700 mt-0.5">View correlation analysis →</p>
          </div>
          <ArrowRight size={12} className="text-neutral-300 group-hover:text-[#ff0069] transition-colors shrink-0" />
        </Link>
      </motion.div>

    </motion.div>
  );
}
