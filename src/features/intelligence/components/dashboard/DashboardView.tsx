'use client';

import { useRouter } from 'next/navigation';
import { motion }  from 'framer-motion';
import { useQuery } from 'convex/react';
import { Zap, Radio, Flame, Brain, LayoutGrid } from 'lucide-react';
import { api }      from '../../../../../convex/_generated/api';
import { containerVariants, fadeUp } from '../../constants';
import { PipelineStatusStrip } from './PipelineStatusStrip';
import { OutlierRow }          from './OutlierRow';
import { IntelligenceBrief }   from './IntelligenceBrief';
import { PulseReportCard }     from './PulseReportCard';
import { IntelligenceActivityFeed } from './IntelligenceActivityFeed';
import { StatCard } from '@/features/analytics/components/stats';
import type { TrendsData }   from '../../types';
import type { InsightsData } from '../../types';

export function DashboardView() {
  const router = useRouter();

  const stats    = useQuery(api.intelligence.getStats, {});
  const trends   = useQuery(api.intelligence.getTrends, { days: 7 }) as TrendsData  | undefined;
  const insights = useQuery(api.insights.getInsights, {})            as InsightsData | undefined;

  const outlierCount = trends?.outlierPosts.length ?? 0;

  const weekChange = stats && (stats as any).postsLastWeek > 0
    ? Math.round((((stats.postsThisWeek - (stats as any).postsLastWeek) / (stats as any).postsLastWeek) * 100))
    : undefined;

  const kpis = [
    {
      label: 'Posts Indexed',
      value: stats?.totalIndexed ?? 0,
      icon:  <Radio size={15} />,
      iconColor: '#7c3aed',
      delay: 0,
    },
    {
      label: 'This Week',
      value: stats?.postsThisWeek ?? 0,
      icon:  <Zap size={15} />,
      iconColor: '#7c3aed',
      change: weekChange,
      changeLabel: 'vs last week',
      delay: 0.07,
    },
    {
      label: 'Outliers',
      value: outlierCount,
      icon:  <Flame size={15} />,
      iconColor: '#ff0069',
      delay: 0.14,
    },
    {
      label: 'Avg ER',
      value: parseFloat(((trends?.avgER ?? 0) * 100).toFixed(1)),
      suffix: '%',
      icon:  <Brain size={15} />,
      iconColor: '#7c3aed',
      delay: 0.21,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex gap-5 h-full"
    >

      {/* ── Main column ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5 overflow-y-auto pb-4 px-4">

        {/* ── 1. Pipeline status ── */}
        <PipelineStatusStrip
          totalIndexed={stats?.totalIndexed   ?? 0}
          postsThisWeek={stats?.postsThisWeek ?? 0}
          latestScrapeAt={stats?.latestScrapeAt ?? 0}
          inQueue={stats?.unanalysedCount}
          avgER={trends?.avgER}
          outlierCount={outlierCount}
        />

        {/* ── 2. KPI row ── */}
        <div className="grid grid-cols-4 gap-3">
          {kpis.map(k => (
            <StatCard key={k.label} {...k} />
          ))}
        </div>

        {/* ── 3. Top outliers card ── */}
        <motion.div
          variants={fadeUp}
          className="rounded-xl overflow-hidden"
          style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <Flame size={13} style={{ color: '#ff0069' }} />
            <p className="text-[11px] font-bold text-neutral-800">Top Outliers This Week</p>
          </div>
          <div className="p-3">
            <OutlierRow posts={trends?.outlierPosts ?? []} />
          </div>
        </motion.div>

        {/* ── 4. Pulse Report + Quick Actions ── */}
        <div className="grid grid-cols-2 gap-4">
          <PulseReportCard
            stats={stats ?? null}
            trends={trends ?? null}
            hookStats={null}
            insights={insights ?? null}
          />

          {/* Quick Actions */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
            >
              <LayoutGrid size={13} className="text-neutral-400" />
              <p className="text-[11px] font-bold text-neutral-800">Quick Actions</p>
            </div>
            <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <button
                onClick={() => router.push('/isso/intelligence?tab=analysis')}
                className="flex flex-col items-center gap-2 px-4 py-4 transition-colors hover:bg-neutral-50 text-center"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)' }}
                >
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-neutral-800">Run Analysis</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Process content</p>
                </div>
              </button>
              <button
                onClick={() => router.push('/isso/intelligence?tab=feed')}
                className="flex flex-col items-center gap-2 px-4 py-4 transition-colors hover:bg-neutral-50 text-center"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#f5f5f4' }}>
                  <Radio size={16} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-neutral-800">Browse Feed</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Community posts</p>
                </div>
              </button>
              <button
                onClick={() => router.push('/isso/intelligence?tab=insights')}
                className="flex flex-col items-center gap-2 px-4 py-4 transition-colors hover:bg-neutral-50 text-center"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#f5f5f4' }}>
                  <Brain size={16} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-neutral-800">View Insights</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">System learnings</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── 5. Intelligence Brief ── */}
        {trends && (
          <motion.div variants={fadeUp}>
            <IntelligenceBrief trends={trends} />
          </motion.div>
        )}

      </div>

      {/* ── Right sidebar (280px) ─────────────────────────── */}
      <div
        className="w-[280px] flex-shrink-0 rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#fff',
          border: '1px solid rgba(0,0,0,0.07)',
          height: 'calc(100vh - 180px)',
          position: 'sticky',
          top: 0,
        }}
      >
        {trends && <IntelligenceActivityFeed trends={trends} />}
      </div>

    </motion.div>
  );
}
