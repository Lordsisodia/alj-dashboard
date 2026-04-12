'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Video, Sparkles } from 'lucide-react';
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

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

// ── Hook Analysis ─────────────────────────────────────────────────────────────
interface ScoreDist { label: string; count: number }
interface EmotionFreq { emotion: string; count: number; avgER: number }
interface HookLine { hookLine: string; hookScore: number; handle: string; niche: string; engagementRate: number }

function HookBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-neutral-500 w-8 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: GRAD }}
        />
      </div>
      <span className="text-[10px] font-semibold text-neutral-700 w-5 text-right">{count}</span>
    </div>
  );
}

function HookAnalysis({ hookStats }: { hookStats: ReturnType<typeof useQuery<typeof api.intelligence.getHookStats>> }) {
  const dist: ScoreDist[] = hookStats?.scoreDistribution ?? [];
  const emotions: EmotionFreq[] = (hookStats?.emotionFrequency ?? []).slice(0, 5);
  const topHooks: HookLine[] = (hookStats?.hookLines ?? []).slice(0, 3);
  const maxCount = Math.max(...dist.map((d: ScoreDist) => d.count), 1);

  const loading = hookStats === undefined;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
          <Sparkles size={11} className="text-white" />
        </div>
        <p className="text-[11px] font-semibold text-neutral-900">Hook Analysis</p>
      </div>

      <div className="px-3 py-3 space-y-4">
        {/* Score distribution bars */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Score distribution</p>
          {loading ? (
            <div className="space-y-1.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-2.5 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
                  <div className="flex-1 h-2.5 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
                  <div className="w-5 h-2.5 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
                </div>
              ))}
            </div>
          ) : dist.length === 0 ? (
            <p className="text-[10px] text-neutral-400 py-1">No score data yet</p>
          ) : (
            dist.map((d: ScoreDist) => (
              <HookBar key={d.label} label={d.label} count={d.count} max={maxCount} />
            ))
          )}
        </div>

        {/* Emotion pills */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Top emotions</p>
          {loading ? (
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 w-16 rounded-full animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
              ))}
            </div>
          ) : emotions.length === 0 ? (
            <p className="text-[10px] text-neutral-400 py-1">No emotion data yet</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {emotions.map((em: EmotionFreq, i: number) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                  style={{ background: GRAD }}
                >
                  {em.emotion} {em.count}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Top hook lines */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Top hooks</p>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg px-3 py-2.5 animate-pulse" style={{ background: 'rgba(0,0,0,0.03)' }}>
                  <div className="h-3 rounded mb-1" style={{ width: '85%', background: 'rgba(0,0,0,0.06)' }} />
                  <div className="h-2.5 rounded" style={{ width: '40%', background: 'rgba(0,0,0,0.05)' }} />
                </div>
              ))}
            </div>
          ) : topHooks.length === 0 ? (
            <p className="text-[10px] text-neutral-400 py-1">No hook lines yet</p>
          ) : (
            topHooks.map((hook: HookLine, i: number) => (
              <div
                key={i}
                className="rounded-lg px-3 py-2.5"
                style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <p className="text-[11px] text-neutral-700 italic leading-relaxed line-clamp-2 mb-1.5">
                  &ldquo;{hook.hookLine}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400">@{hook.handle}</span>
                  <span className="text-[10px] text-neutral-300">·</span>
                  <span className="text-[10px] text-neutral-400">{hook.niche}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white ml-auto"
                    style={{ background: GRAD }}
                  >
                    {hook.hookScore.toFixed(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface Props { days: number; niche: string; }

export function AnalysisView({ days, niche }: Props) {
  const [viewMode, setViewMode] = useState<AnalysisViewMode>('default');
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);

  const analysed = useQuery(api.intelligence.getAnalysedPosts, {
    days,
    niche: niche !== 'all' ? niche : undefined,
  });
  const stats = useQuery(api.intelligence.getAnalysisPipelineStats, {});
  const hookStats = useQuery(api.intelligence.getHookStats, { days });

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

              {/* Hook Analysis section */}
              <HookAnalysis hookStats={hookStats} />
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
