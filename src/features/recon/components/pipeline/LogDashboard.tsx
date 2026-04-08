'use client';

import { useState, useEffect } from 'react';
import { Database, Clock, FileStack, Users } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { COMPETITORS, DAILY_VOLUME } from '../../constants'; // COMPETITORS seeds initial state
import type { Competitor } from '../../types';
import { useLogDashboard } from '../../hooks/useLogDashboard';
import { PostsScrapedChart } from './PostsScrapedChart';
import { PipelineFunnel }    from './PipelineFunnel';
import { ActivityFeed }      from '../detail/widgets/ActivityFeed';
import { ScrapingReport }    from '@/components/ui/scraping-report';
import { DashboardMetricCard } from '@/components/ui/dashboard-overview';

const TOTAL_IN_LIBRARY = DAILY_VOLUME.reduce((s, d) => s + d.total, 0);


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
  const library     = dbStats?.totalInLibrary ?? TOTAL_IN_LIBRARY;
  const lastRunAt   = dbStats?.lastRunAt      ?? null;

  function fmtLastRun(ts: number | null) {
    if (!ts) return '-';
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }


  return (
    <div className="flex items-start w-full">

      {/* -- Main content column ------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ① Pipeline funnel — first thing you see */}
        <div className="px-3 pt-4">
          <PipelineFunnel counts={dbStats?.funnel} />
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

        {/* ③ Posts scraped chart — full width */}
        <div className="px-3 pt-3">
          <PostsScrapedChart data={DAILY_VOLUME} />
        </div>

        {/* ④ Scraping report */}
        <div className="px-3 pt-3 pb-6">
          <ScrapingReport />
        </div>

      </div>

      {/* -- Right sidebar: Live Activity ---------------------------- */}
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
