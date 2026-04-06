'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Radar, Library, Clock } from 'lucide-react';
import { COMPETITORS, DAILY_VOLUME, containerVariants } from '../../constants';
import type { Competitor } from '../../types';
import { StatCard }            from './StatCard';
import { VolumeChart }         from './VolumeChart';
import { PipelineFunnel }      from './PipelineFunnel';
import { ActivityFeed }        from './ActivityFeed';
import { CreatorPipelineRow }  from './CreatorPipelineRow';

const TOTAL_IN_LIBRARY = DAILY_VOLUME.reduce((s, d) => s + d.total, 0);

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
        const existingIds = new Set(prev.map(c => c.id));
        const fresh = extraCreators.filter(c => !existingIds.has(c.id));
        return fresh.length > 0 ? [...fresh, ...prev] : prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraCreators]);

  useEffect(() => {
    if (runAllTrigger === 0) return;
    setCompetitors(prev => prev.map(c => c.status === 'active' ? { ...c, jobStatus: 'running' } : c));
    const timer = setTimeout(() => {
      setCompetitors(prev => prev.map(c =>
        c.jobStatus === 'running'
          ? { ...c, jobStatus: 'idle', postsToday: c.postsToday + Math.floor(Math.random() * 8) + 3 }
          : c
      ));
    }, 3000);
    return () => clearTimeout(timer);
  }, [runAllTrigger]);

  function toggleStatus(id: number) {
    setCompetitors(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
  }

  function retryCreator(id: number) {
    setCompetitors(prev => prev.map(c => c.id === id ? { ...c, jobStatus: 'running' } : c));
    setTimeout(() => {
      setCompetitors(prev => prev.map(c =>
        c.id === id && c.jobStatus === 'running'
          ? { ...c, jobStatus: 'idle', postsToday: c.postsToday + Math.floor(Math.random() * 5) + 1 }
          : c
      ));
    }, 2500);
  }

  const postsToday  = competitors.filter(c => c.status === 'active').reduce((s, c) => s + c.postsToday, 0);
  const activeCount = competitors.filter(c => c.status === 'active').length;
  const sorted = [...competitors].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return b.postsToday - a.postsToday;
  });

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full space-y-4">
      <PipelineFunnel />

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Posts today"      value={String(postsToday)}                   sub="across all active creators"           icon={<Database size={15} />} iconColor="#4a9eff" delay={0}    />
        <StatCard label="Active creators"  value={`${activeCount} / ${competitors.length}`} sub={`${competitors.length - activeCount} paused`} icon={<Radar size={15} />}    iconColor="#833ab4" delay={0.05} />
        <StatCard label="Total in library" value={TOTAL_IN_LIBRARY.toLocaleString()}    sub="posts scraped all-time"               icon={<Library size={15} />}  iconColor="#ff0069" delay={0.10} />
        <StatCard label="Last run"         value="3:42 PM"                              sub="Next: ~6:00 PM · every 3h"            icon={<Clock size={15} />}    iconColor="#78c257" delay={0.15} />
      </div>

      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0 space-y-4">
          <VolumeChart data={DAILY_VOLUME} />

          <div className="rounded-xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <p className="text-sm font-semibold text-neutral-900">Creator pipeline</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 text-[10px] text-neutral-400">
                  {[['#78c257', '≤7d'], ['#f59e0b', '≤21d'], ['#dc2626', 'stale']].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-neutral-400">{activeCount} of {competitors.length} scraped today</span>
              </div>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-3 space-y-1.5">
              {sorted.map(c => (
                <CreatorPipelineRow key={c.id} c={c} onToggle={toggleStatus} onRetry={retryCreator} />
              ))}
            </motion.div>
          </div>
        </div>

        <div className="w-72 flex-shrink-0">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
