'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Video } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { containerVariants } from '../../constants';
import { PostDetailDrawer } from '../drawer/PostDetailDrawer';
import { AnalysisQueue } from './AnalysisQueue';
import { FunnelChart } from '@/components/ui/funnel-chart';
import { ActivityFeed } from './ActivityFeed';
import { AnalysedPostsTimeline } from './AnalysedPostsTimeline';
import { AllPostsView } from './AllPostsView';
import { AllQueueView } from './AllQueueView';
import { AllActivityView } from './AllActivityView';
import type { DrawerPost } from '../../types';

type AnalysisViewMode = 'default' | 'all-posts' | 'all-queue' | 'all-activity';

interface Props { days: number; niche: string; }

export function AnalysisView({ days, niche }: Props) {
  const [viewMode, setViewMode] = useState<AnalysisViewMode>('default');
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);

  const analysed = useQuery(api.intelligence.getAnalysedPosts, {
    days,
    niche: niche !== 'all' ? niche : undefined,
  });
  const stats = useQuery(api.intelligence.getAnalysisPipelineStats, {});

  function openDrawer(postId: string) {
    const idx = (analysed ?? []).findIndex(p => p._id === postId);
    if (idx !== -1) setDrawerIndex(idx);
  }

  // ── Default 3-column layout ─────────────────────────────────────────────────
  if (viewMode === 'default') {
    const funnelData = [
      { label: 'Qualified',  value: stats?.totalQualified ?? 1,  displayValue: String(stats?.totalQualified ?? 0),  color: '#ff0069' },
      { label: 'In R2',      value: stats?.downloaded     ?? 0,  displayValue: String(stats?.downloaded     ?? 0),  color: '#833ab4' },
      { label: 'Analyzed',   value: stats?.analyzed       ?? 0,  displayValue: String(stats?.analyzed       ?? 0),  color: '#4a9eff' },
    ];

    return (
      <>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="h-full"
        >
          {/* 3-column layout */}
          <div className="grid h-full" style={{ gridTemplateColumns: '22% 58% 20%', gap: '1rem', minHeight: 0 }}>
            {/* LEFT — FunnelChart */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Pipeline</p>
                {stats === undefined ? (
                  <div className="w-full rounded-xl animate-pulse" style={{ height: 200, background: 'rgba(0,0,0,0.05)' }} />
                ) : (
                  <FunnelChart
                    data={funnelData}
                    orientation="vertical"
                    layers={3}
                    showPercentage={false}
                    labelLayout="grouped"
                    style={{ height: 200 }}
                  />
                )}
              </div>
            </div>

            {/* MIDDLE — Queue + Timeline */}
            <div className="flex flex-col gap-4 overflow-y-auto min-h-0">
              {/* Video Tool link */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.06), rgba(131,58,180,0.06))', border: '1px solid rgba(255,0,105,0.12)' }}>
                <div>
                  <p className="text-[11px] font-semibold text-neutral-800">Analyse new content</p>
                  <p className="text-[10px] text-neutral-400">Upload a video and get AI hook analysis</p>
                </div>
                <Link
                  href="/isso/tools"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  <Video size={11} /> Video Tool
                </Link>
              </div>

              <AnalysisQueue
                onAnalyse={openDrawer}
                onViewAllQueue={() => setViewMode('all-queue')}
              />

              {/* Timeline section */}
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Recent analyses</p>
                <AnalysedPostsTimeline
                  days={days}
                  niche={niche}
                  onViewAll={() => setViewMode('all-posts')}
                  onSelectPost={openDrawer}
                />
              </div>
            </div>

            {/* RIGHT — ActivityFeed */}
            <div className="flex flex-col min-h-0 overflow-hidden">
              <ActivityFeed
                onViewAll={() => setViewMode('all-activity')}
                onSelectPost={openDrawer}
              />
            </div>
          </div>
        </motion.div>

        {/* Drawer */}
        <AnimatePresence>
          {drawerIndex !== null && analysed && (
            <PostDetailDrawer
              posts={analysed as unknown as DrawerPost[]}
              initialIndex={drawerIndex}
              onClose={() => setDrawerIndex(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── All Posts expanded view ─────────────────────────────────────────────────
  if (viewMode === 'all-posts') {
    return (
      <>
        <AllPostsView days={days} niche={niche} onBack={() => setViewMode('default')} />
        <AnimatePresence>
          {drawerIndex !== null && analysed && (
            <PostDetailDrawer
              posts={analysed as unknown as DrawerPost[]}
              initialIndex={drawerIndex}
              onClose={() => setDrawerIndex(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── All Queue expanded view ────────────────────────────────────────────────
  if (viewMode === 'all-queue') {
    return (
      <>
        <AllQueueView onBack={() => setViewMode('default')} onAnalyse={openDrawer} />
        <AnimatePresence>
          {drawerIndex !== null && analysed && (
            <PostDetailDrawer
              posts={analysed as unknown as DrawerPost[]}
              initialIndex={drawerIndex}
              onClose={() => setDrawerIndex(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── All Activity expanded view ─────────────────────────────────────────────
  return (
    <>
      <AllActivityView days={days} niche={niche} onBack={() => setViewMode('default')} />
      <AnimatePresence>
        {drawerIndex !== null && analysed && (
          <PostDetailDrawer
            posts={analysed as unknown as DrawerPost[]}
            initialIndex={drawerIndex}
            onClose={() => setDrawerIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
