'use client';

import { useState, useEffect } from 'react';
import { Database, Radar, Library, Clock, FileStack, Users, Zap, Play, List, SlidersHorizontal } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { COMPETITORS, DAILY_VOLUME } from '../../constants'; // COMPETITORS seeds initial state
import type { Competitor } from '../../types';
import { PostsScrapedChart } from './PostsScrapedChart';
import { PipelineFunnel }    from './PipelineFunnel';
import { ActivityFeed }      from './ActivityFeed';
import { WeeklyDigestCard }  from './WeeklyDigestCard';
import { ScrapingReport }    from '@/components/ui/scraping-report';
import { DashboardMetricCard } from '@/components/ui/dashboard-overview';

const TOTAL_IN_LIBRARY = DAILY_VOLUME.reduce((s, d) => s + d.total, 0);

const STATS = (postsToday: number, activeCount: number, total: number, totalCreators: number, lastRun: string) => [
  { label: 'Posts today',      value: String(postsToday),                  sub: 'across all active creators',         icon: <Database size={14} />, color: '#4a9eff' },
  { label: 'Active creators',  value: `${activeCount} / ${totalCreators}`, sub: `${totalCreators - activeCount} paused`, icon: <Radar size={14} />, color: '#833ab4' },
  { label: 'Total in library', value: total.toLocaleString(),              sub: 'posts scraped all-time',             icon: <Library size={14} />,  color: '#ff0069' },
  { label: 'Last run',         value: lastRun,                             sub: 'Next: ~6:00 PM · every 3h',          icon: <Clock size={14} />,    color: '#78c257' },
];

export function LogDashboard({
  extraCreators = [],
  runAllTrigger = 0,
}: {
  extraCreators?: Competitor[];
  runAllTrigger?: number;
} = {}) {
  const [competitors, setCompetitors] = useState<Competitor[]>(COMPETITORS);

  useEffect(() => {
    if (extraCreators.length > 0) {
      setCompetitors(prev => {
        const ids = new Set(prev.map(c => c.id));
        const fresh = extraCreators.filter(c => !ids.has(c.id));
        return fresh.length > 0 ? [...fresh, ...prev] : prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraCreators]);

  useEffect(() => {
    if (runAllTrigger === 0) return;
    setCompetitors(prev => prev.map(c => c.status === 'active' ? { ...c, jobStatus: 'running' } : c));
    const t = setTimeout(() => {
      setCompetitors(prev => prev.map(c =>
        c.jobStatus === 'running'
          ? { ...c, jobStatus: 'idle', postsToday: c.postsToday + Math.floor(Math.random() * 8) + 3 }
          : c
      ));
    }, 3000);
    return () => clearTimeout(t);
  }, [runAllTrigger]);

  const dbStats = useQuery(api.intelligence.getReconDashboardStats);

  // Use real DB stats when available, fall back to mock COMPETITORS data
  const postsToday  = dbStats?.postsToday  ?? competitors.filter(c => c.status === 'active').reduce((s, c) => s + c.postsToday, 0);
  const activeCount = dbStats?.activeCreators ?? competitors.filter(c => c.status === 'active').length;
  const totalCount  = dbStats?.totalCreators  ?? competitors.length;
  const library     = dbStats?.totalInLibrary ?? TOTAL_IN_LIBRARY;
  const lastRunAt   = dbStats?.lastRunAt      ?? null;

  function fmtLastRun(ts: number | null) {
    if (!ts) return '-';
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  const stats = STATS(postsToday, activeCount, library, totalCount, fmtLastRun(lastRunAt));

  return (
    <div className="flex items-start w-full">

      {/* ── Main content column ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ① Weekly digest - compact command bar at top */}
        <WeeklyDigestCard />

        {/* ② Pipeline funnel - inset card */}
        <div className="px-3 pt-3">
          <PipelineFunnel counts={dbStats?.funnel} />
        </div>

        {/* ③ Metric cards */}
        <div className="grid grid-cols-4 gap-3 px-3 mt-3">
          <DashboardMetricCard
            title="Posts today"
            value={String(postsToday)}
            icon={Database}
            trendChange="+23% vs yesterday"
            trendType="up"
          />
          <DashboardMetricCard
            title="Active creators"
            value={`${activeCount} / ${totalCount}`}
            icon={Users}
            trendChange={`${totalCount - activeCount} paused`}
            trendType="neutral"
          />
          <DashboardMetricCard
            title="Total in library"
            value={library.toLocaleString()}
            icon={FileStack}
            trendChange="posts scraped all-time"
            trendType="up"
          />
          <DashboardMetricCard
            title="Last run"
            value={fmtLastRun(lastRunAt)}
            icon={Clock}
            trendChange="Next: ~6:00 PM · every 3h"
            trendType="neutral"
          />
        </div>

        {/* ④ Volume chart + Scraping Report - side by side */}
        <div className="grid grid-cols-[2fr_1fr] gap-3 px-3 pt-4 pb-2">
          <PostsScrapedChart data={DAILY_VOLUME} />
          <ScrapingReport />
        </div>

        {/* ⑤ Quick-action row — desktop only */}
        <div className="hidden md:flex items-center gap-2 px-3 pt-2 pb-1">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white/70 hover:text-white hover:bg-white/8 border border-white/8 hover:border-white/15 transition-colors">
            <Play size={11} className="text-emerald-400" />
            Scrape Now
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white/70 hover:text-white hover:bg-white/8 border border-white/8 hover:border-white/15 transition-colors">
            <List size={11} className="text-blue-400" />
            View Full Log
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white/70 hover:text-white hover:bg-white/8 border border-white/8 hover:border-white/15 transition-colors">
            <SlidersHorizontal size={11} className="text-purple-400" />
            Filter by Niche
          </button>
        </div>

        {/* bottom clearance */}
        <div className="pb-6" />

      </div>

      {/* ── Right sidebar: Live Activity ──────────────────────────── */}
      <div
        className="w-72 flex-shrink-0 sticky top-0 self-start"
        style={{
          borderLeft: '1px solid rgba(0,0,0,0.06)',
          height: 'calc(100vh - 98px)',
          overflowY: 'auto',
        }}
      >
        <ActivityFeed />
      </div>

    </div>
  );
}
