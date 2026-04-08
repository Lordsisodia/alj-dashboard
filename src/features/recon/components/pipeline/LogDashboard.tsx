'use client';

import { useState, useEffect } from 'react';
import { Database, Clock, FileStack, Users } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { COMPETITORS } from '../../constants'; // COMPETITORS seeds initial state
import type { Competitor } from '../../types';
import { useLogDashboard } from '../../hooks/useLogDashboard';
import IncidentHeatmapReportCard from '@/components/ui/heat-map-xl';
import { PipelineStatusStrip }  from '@/features/intelligence/components/dashboard/PipelineStatusStrip';
import { ActivityFeed }         from '../detail/widgets/ActivityFeed';
import { ScrapingReport }       from '@/components/ui/scraping-report';
import { PostsScrapedBarChart } from './PostsScrapedBarChart';
import { DashboardMetricCard }  from '@/components/ui/dashboard-overview';


export function LogDashboard({
  extraCreators = [],
}: {
  extraCreators?: Competitor[];
} = {}) {
  const { runAllTrigger } = useLogDashboard();
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
  const library     = dbStats?.totalInLibrary ?? 0;
  const lastRunAt   = dbStats?.lastRunAt      ?? null;

  function fmtLastRun(ts: number | null) {
    if (!ts) return '-';
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }


  return (
    <div className="flex items-start w-full">

      {/* -- Main content column ------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ① Pipeline status strip */}
        <div className="px-3 pt-4">
          <PipelineStatusStrip
            totalIndexed={library}
            postsThisWeek={dbStats?.postsThisWeek ?? 0}
            latestScrapeAt={lastRunAt ?? 0}
          />
        </div>

        {/* ② Metric cards */}
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

        {/* ③ Heatmap + Scraping report side by side */}
        <div className="px-3 pt-3 pb-6 grid grid-cols-2 gap-3 items-start">
          <IncidentHeatmapReportCard />
          <div className="flex flex-col gap-3">
            <ScrapingReport />
            <PostsScrapedBarChart />
          </div>
        </div>

      </div>

      {/* -- Right sidebar: Live Activity ---------------------------- */}
      <div
        className="w-72 flex-shrink-0 sticky top-0 self-start flex flex-col relative rounded-2xl overflow-hidden mx-3 mt-4 mb-6"
        style={{
          border: '1px solid rgba(0,0,0,0.07)',
          backgroundColor: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          height: 'calc(100vh - 200px)',
        }}
      >
        <ActivityFeed />
      </div>

    </div>
  );
}
