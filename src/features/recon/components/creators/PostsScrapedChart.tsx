'use client';

import { TrendingUp } from 'lucide-react';
import BarChart, { Bar, BarXAxis, Grid, ChartTooltip } from '@/components/ui/bar-chart';
import type { DailyVolume } from '../../types';

interface PostsScrapedChartProps {
  data: DailyVolume[];
}

export function PostsScrapedChart({ data }: PostsScrapedChartProps) {
  const chartData = data.map(d => ({ label: d.label, total: d.total }));

  const half   = Math.floor(data.length / 2);
  const recent = data.slice(-half).reduce((s, d) => s + d.total, 0);
  const prior  = data.slice(0, half).reduce((s, d) => s + d.total, 0);
  const trendPct = prior > 0 ? Math.round(((recent - prior) / prior) * 100) : 0;
  const trendUp  = trendPct >= 0;

  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden w-full"
      style={{
        border: '1px solid rgba(0,0,0,0.07)',
        '--chart-background':        '#ffffff',
        '--chart-foreground':        '#171717',
        '--chart-foreground-muted':  '#737373',
        '--chart-label':             '#9ca3af',
        '--chart-line-primary':      '#dc2626',
        '--chart-line-secondary':    '#991b1b',
        '--chart-crosshair':         'rgba(220,38,38,0.3)',
        '--chart-grid':              'rgba(0,0,0,0.06)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
            Posts scraped
          </p>
          <p className="text-[10px] text-neutral-300 mt-0.5">Last 14 days - all creators</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
          style={{
            backgroundColor: trendUp ? 'rgba(120,194,87,0.10)' : 'rgba(220,38,38,0.08)',
            color: trendUp ? '#4a8a2d' : '#dc2626',
          }}
        >
          <TrendingUp size={11} style={{ transform: trendUp ? 'none' : 'scaleY(-1)' }} />
          {trendUp ? '+' : ''}{trendPct}% vs prior period
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pb-4">
        <BarChart
          data={chartData}
          xDataKey="label"
          aspectRatio="3 / 1"
          barGap={0.25}
          margin={{ top: 8, right: 4, bottom: 28, left: 4 }}
        >
          <Grid horizontal numTicksRows={4} stroke="rgba(0,0,0,0.05)" strokeDasharray="3,3" />
          <Bar dataKey="total" fill="#dc2626" animationType="grow" />
          <BarXAxis maxLabels={7} />
          <ChartTooltip
            content={({ point }) => {
              const p = point as { label: string; total: number };
              return (
                <div className="flex flex-col gap-1 px-3 py-2 text-[11px] bg-white rounded-lg shadow-lg border border-neutral-100">
                  <span className="font-semibold text-neutral-700">{p.label}</span>
                  <span className="text-neutral-500">{p.total} posts scraped</span>
                </div>
              );
            }}
          />
        </BarChart>
      </div>
    </div>
  );
}
