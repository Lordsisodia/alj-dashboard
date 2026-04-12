'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  AreaChart,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  Area,
  Gradient,
  GradientStop,
  GridlineSeries,
  Gridline,
} from 'reaviz';
import { TrendingUp, TrendingDown, FileStack, Users, Zap } from 'lucide-react';

// ── Single-series colour ───────────────────────────────────────────────────────

const CHART_COLOR = '#ef4444';

// ── Component ─────────────────────────────────────────────────────────────────

export function ScrapingReport() {
  const stats    = useQuery(api.intelligence.getReconDashboardStats);
  const volume   = useQuery(api.intelligence.getDailyScrapedVolume, { days: 14 });

  // Real metric values derived from DB
  const postsToday   = stats?.postsToday   ?? 0;
  const activeCount  = stats?.activeCreators  ?? 0;
  const totalCount   = stats?.totalCreators   ?? 0;
  const postsThisWk  = stats?.postsThisWeek  ?? 0;
  const avgPerCreator = activeCount > 0 ? Math.round(postsThisWk / activeCount) : 0;

  // Trend direction for velocity (positive = more posts this week than last, neutral if 0)
  const velocityTrend = postsThisWk > 0 ? 'up' : 'neutral';
  const velocityGood  = postsThisWk > 0;

  const metrics = [
    {
      id: 'posts',
      icon: <FileStack size={16} color={CHART_COLOR} />,
      label: 'Posts scraped today',
      value: String(postsToday),
      trend: 'up' as const,
      trendLabel: 'today',
      good: true,
    },
    {
      id: 'creators',
      icon: <Users size={16} color={CHART_COLOR} />,
      label: 'Active creators',
      value: `${activeCount} / ${totalCount}`,
      trend: 'neutral' as const,
      trendLabel: '',
      good: true,
    },
    {
      id: 'velocity',
      icon: <Zap size={16} color={CHART_COLOR} />,
      label: 'Avg posts / creator',
      value: String(avgPerCreator),
      trend: velocityTrend,
      trendLabel: 'this week',
      good: velocityGood,
    },
  ];

  // Transform volume data to reaviz's {key:Date,data:number} shape.
  // Buckets are ordered oldest→newest, so index maps directly to day offset.
  const chartData = React.useMemo(() => {
    if (!volume) return [];
    const now = Date.now();
    const len = volume.length;
    return volume.map((v, i) => ({
      key:  new Date(now - (len - 1 - i) * 24 * 60 * 60 * 1000),
      data: v.total ?? 0,
    }));
  }, [volume]);

  return (
    <>
      <style jsx global>{`
        :root {
          --reaviz-tick-fill: #9ca3af;
          --reaviz-gridline-stroke: rgba(0,0,0,0.06);
        }
      `}</style>

      <div
        className="flex flex-col bg-white rounded-xl overflow-hidden w-full"
        style={{ border: '1px solid rgba(0,0,0,0.07)' }}
      >
        {/* Title */}
        <div className="px-5 pt-3 pb-1 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
            Scraping Report
          </p>
          <p className="text-[10px] text-neutral-300">Last 14 days</p>
        </div>

        {/* Legend — single series */}
        <div className="flex items-center gap-4 px-5 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLOR }} />
            <span className="text-[10px] text-neutral-400">Daily volume</span>
          </div>
        </div>

        {/* Chart */}
        <div className="px-2 h-[170px]">
          <AreaChart
            height={170}
            data={chartData}
            xAxis={
              <LinearXAxis
                type="time"
                tickSeries={
                  <LinearXAxisTickSeries
                    label={
                      <LinearXAxisTickLabel
                        format={v => new Date(v).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        fill="var(--reaviz-tick-fill)"
                      />
                    }
                    tickSize={8}
                  />
                }
              />
            }
            yAxis={
              <LinearYAxis
                axisLine={null}
                tickSeries={<LinearYAxisTickSeries line={null} label={null} tickSize={8} />}
              />
            }
            series={
              <Area
                gradient={
                  <Gradient
                    stops={[
                      <GradientStop key={1} stopOpacity={0} />,
                      <GradientStop key={2} offset="80%" stopOpacity={0.15} />,
                    ]}
                  />
                }
                color={() => CHART_COLOR}
              />
            }
            gridlines={
              <GridlineSeries line={<Gridline strokeColor="var(--reaviz-gridline-stroke)" />} />
            }
          />
        </div>

        {/* Metrics */}
        <div
          className="flex flex-col divide-y px-5 pt-1 pb-2"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderColor: 'rgba(0,0,0,0.05)' }}
        >
          {metrics.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2 text-neutral-500">
                {m.icon}
                <span className="text-[11px]">{m.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-neutral-900 tabular-nums">{m.value}</span>
                <div
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: m.good ? 'rgba(120,194,87,0.1)' : 'rgba(220,38,38,0.08)',
                    color: m.good ? '#4a8a2d' : '#dc2626',
                  }}
                >
                  {m.trend === 'up' && <TrendingUp size={9} />}
                  {m.trend === 'down' && <TrendingDown size={9} />}
                  {m.trendLabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
