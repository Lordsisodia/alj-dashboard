'use client';

import { useState, useEffect } from 'react';
import { Radar } from 'lucide-react';
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
import { HubQuickActions }      from '@/features/community/components/dashboard/HubQuickActions';


interface LogDashboardProps {
  extraCreators?:      Competitor[];
  onStartDiscovery?:   () => void;
  onAddCreator?:       () => void;
  onRunAll?:           () => void;
}

export function LogDashboard({
  extraCreators = [],
  onStartDiscovery,
  onAddCreator,
  onRunAll,
}: LogDashboardProps = {}) {
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

        {/* ① Pipeline status strip — all metrics inlined */}
        <div className="px-3 pt-4">
          <PipelineStatusStrip
            totalIndexed={library}
            postsThisWeek={dbStats?.postsThisWeek ?? 0}
            latestScrapeAt={lastRunAt ?? 0}
            postsToday={postsToday}
            activeCreators={activeCount}
            totalCreators={totalCount}
            lastRunFormatted={fmtLastRun(lastRunAt)}
          />
        </div>

        {/* ② Heatmap + Scraping report side by side */}
        <div className="px-3 pt-3 grid grid-cols-2 gap-3 items-start">
          <IncidentHeatmapReportCard />
          <div className="flex flex-col gap-3">
            <ScrapingReport />
            <PostsScrapedBarChart />
          </div>
        </div>

        {/* ③ Quick actions */}
        <div className="px-3 mt-3 pb-6">
          <HubQuickActions
            onStartSession={onStartDiscovery ?? (() => {})}
            onBrowseVault={onAddCreator ?? (() => {})}
            onSendToClient={onRunAll ?? (() => {})}
          />
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
