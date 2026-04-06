'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  StackedNormalizedAreaChart,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  StackedNormalizedAreaSeries,
  Line,
  Area,
  Gradient,
  GradientStop,
  GridlineSeries,
  Gridline,
} from 'reaviz';
import { TrendingUp, TrendingDown, FileStack, Users, Zap } from 'lucide-react';

// ── Legend ────────────────────────────────────────────────────────────────────

const LEGEND = [
  { name: 'GFE',       color: '#fca5a5' },
  { name: 'ABG',       color: '#dc2626' },
  { name: 'Lifestyle', color: '#7f1d1d' },
];

const COLOR_SCHEME = ['#fca5a5', '#dc2626', '#7f1d1d'];

// ── Chart data - 14 days of niche scraping volume ────────────────────────────

const now = new Date();
function daysAgo(n: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d;
}

const RAW_DATA = [
  {
    key: 'GFE',
    data: [47,52,38,61,55,43,58,71,49,63,44,57,68,73].map((v, i) => ({
      key: daysAgo(13 - i), data: v,
    })),
  },
  {
    key: 'ABG',
    data: [31,28,35,42,38,29,44,37,51,45,33,48,41,54].map((v, i) => ({
      key: daysAgo(13 - i), data: v,
    })),
  },
  {
    key: 'Lifestyle',
    data: [19,22,17,25,21,18,27,20,24,29,16,23,31,26].map((v, i) => ({
      key: daysAgo(13 - i), data: v,
    })),
  },
];

// ── Metric rows ───────────────────────────────────────────────────────────────

const METRICS = [
  {
    id: 'posts',
    icon: <FileStack size={16} color="#dc2626" />,
    label: 'Posts scraped today',
    value: '284',
    trend: 'up',
    trendLabel: '+23%',
    good: true,
  },
  {
    id: 'creators',
    icon: <Users size={16} color="#dc2626" />,
    label: 'Active creators',
    value: '4 / 8',
    trend: 'down',
    trendLabel: '-1',
    good: false,
  },
  {
    id: 'velocity',
    icon: <Zap size={16} color="#dc2626" />,
    label: 'Avg posts / creator',
    value: '71',
    trend: 'up',
    trendLabel: '+12%',
    good: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function ScrapingReport() {
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
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
            Scraping Report
          </p>
          <p className="text-[10px] text-neutral-300">Last 14 days</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 pb-3">
          {LEGEND.map(item => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] text-neutral-400">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="px-2 h-[160px]">
          <StackedNormalizedAreaChart
            height={160}
            data={RAW_DATA}
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
              <StackedNormalizedAreaSeries
                line={<Line strokeWidth={2} />}
                area={
                  <Area
                    gradient={
                      <Gradient
                        stops={[
                          <GradientStop key={1} stopOpacity={0} />,
                          <GradientStop key={2} offset="80%" stopOpacity={0.15} />,
                        ]}
                      />
                    }
                  />
                }
                colorScheme={COLOR_SCHEME}
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
          {METRICS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between py-3"
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
                  {m.trend === 'up'
                    ? <TrendingUp size={9} />
                    : <TrendingDown size={9} />
                  }
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
