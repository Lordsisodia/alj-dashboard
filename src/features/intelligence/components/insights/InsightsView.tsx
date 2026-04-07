'use client';

import { useQuery, useMutation } from 'convex/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Sparkles, ImageOff } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { RatingSummaryBar } from './RatingSummaryBar';
import { LearningSignal }   from './LearningSignal';
import { AIChatPanel }      from '../trends/AIChatPanel';
import { PostDetailDrawer }  from '../drawer/PostDetailDrawer';
import { cn }                from '@/lib/utils';
import type { InsightsData, TrendsData } from '../../types';
import type { DrawerPost }  from '../../types';

export function InsightsView() {
  const [chatOpen,           setChatOpen]           = useState(false);
  const [highlightedPostId,  setHighlightedPostId]  = useState<string | null>(null);
  const [drawerIndex,        setDrawerIndex]        = useState<number | null>(null);

  const data        = useQuery(api.insights.getInsights, {}) as InsightsData | undefined;
  const trends      = useQuery(api.intelligence.getTrends, { days: 30 }) as TrendsData | undefined;
  const hookStats   = useQuery(api.intelligence.getHookStats, { days: 30 });
  const seedRatings = useMutation(api.insightsSeed.seedSwipeRatings);

  useEffect(() => {
    if (data && data.summary.totalRatings === 0) seedRatings({});
  }, [data, seedRatings]);

  // Build handle+niche -> postId lookup for hook hover highlighting
  const postIdMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of data?.topRatedPosts ?? []) {
      m.set(`${p.handle}|${p.niche}`, p._id);
    }
    return m;
  }, [data?.topRatedPosts]);

  // Build drawer posts from topRatedPosts (DrawerPost shape)
  const drawerPosts: DrawerPost[] = useMemo(() =>
    (data?.topRatedPosts ?? []).map(p => ({
      _id:            p._id as any,
      externalId:     '',
      handle:         p.handle,
      platform:       'instagram',
      niche:          p.niche,
      contentType:    p.contentType,
      thumbnailUrl:   p.thumbnailUrl,
      caption:        p.caption,
      hashtags:       [],
      likes:          0,
      views:          0,
      saves:          0,
      engagementRate: p.engagementRate,
      outlierRatio:   undefined,
      postedAt:       0,
      saved:          false,
      aiAnalysis:    undefined,
    })),
  [data?.topRatedPosts]);

  function openDrawer(postId: string) {
    const idx = (data?.topRatedPosts ?? []).findIndex(p => p._id === postId);
    if (idx !== -1) setDrawerIndex(idx);
  }

  // Derive insight bullets from trends + insights data
  function deriveInsights(): string[] {
    const bullets: string[] = [];
    if (!trends) return bullets;
    const topNiche = trends.nicheStats[0];
    if (topNiche) {
      bullets.push(
        `${topNiche.niche} leads with ${(topNiche.avgER * 100).toFixed(1)}% avg ER across ${topNiche.count} posts`
      );
    }
    const topFormat = trends.formatStats[0];
    const nextFormat = trends.formatStats[1];
    if (topFormat && nextFormat) {
      const lift = topFormat.avgER / (nextFormat.avgER || 1);
      bullets.push(
        `${topFormat.format.charAt(0).toUpperCase() + topFormat.format.slice(1)}s outperform by ${((lift - 1) * 100).toFixed(0)}% vs ${nextFormat.format}`
      );
    }
    const topOutlier = trends.outlierPosts[0];
    if (topOutlier) {
      bullets.push(
        `@${topOutlier.handle} hit ${topOutlier.outlierRatio.toFixed(1)}x baseline ER - best outlier this window`
      );
    }
    if (data && data.summary.totalRatings > 0) {
      const saveRate = Math.round((data.summary.saveCount / data.summary.totalRatings) * 100);
      bullets.push(
        saveRate >= 50
          ? `${saveRate}% team save rate - strong curation signal`
          : `${saveRate}% save rate - tighten the feed for better signal`
      );
    }
    return bullets;
  }

  const insights = deriveInsights();
  const topRater = data?.raterActivity[0];
  const hookCount = hookStats?.hookLines?.length ?? 0;
  const postCount = data?.topRatedPosts?.length ?? 0;

  // Loading skeleton
  if (data === undefined) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl h-28 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
          ))}
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 rounded-xl h-80 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
          <div className="col-span-6 rounded-xl h-80 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
          <div className="col-span-3 rounded-xl h-80 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
        </div>
      </div>
    );
  }

  const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >

      {/* KPI strip */}
      <RatingSummaryBar summary={data.summary} topRater={topRater} />

      {/* 3-column layout */}
      <div className="grid grid-cols-12 gap-4">

        {/* LEFT (24%) - Winning Hooks */}
        <div className="col-span-3 flex flex-col gap-2">
          {/* Section header */}
          <div
            className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
                <Sparkles size={11} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-900">Winning Hooks</p>
                <p className="text-[9px] text-neutral-400">Top hooks by score</p>
              </div>
            </div>
            {hookCount > 0 && (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md text-white"
                style={{ background: GRAD }}
              >
                {hookCount}
              </span>
            )}
          </div>

          {/* Hook rows - loading skeleton */}
          {hookStats === undefined ? (
            <div
              className="flex flex-col rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5 py-3 px-3 border-b border-black/5 last:border-0">
                  <div className="h-3 rounded-md animate-pulse" style={{ width: '80%', backgroundColor: 'rgba(0,0,0,0.06)' }} />
                  <div className="h-2.5 rounded-md animate-pulse mt-0.5" style={{ width: '33%', backgroundColor: 'rgba(0,0,0,0.05)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
            >
              {hookCount === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                    <ImageOff size={14} className="text-neutral-300" />
                  </div>
                  <p className="text-[11px] text-neutral-400">No hook data yet</p>
                  <p className="text-[10px] text-neutral-300 text-center px-4">Run analysis on posts to surface winning hooks</p>
                </div>
              )}
              {(hookStats?.hookLines ?? []).map((hook, i) => {
                const mappedId = postIdMap.get(`${hook.handle}|${hook.niche}`);
                const isHighlighted = highlightedPostId === mappedId;
                return (
                  <div
                    key={i}
                    className={cn(
                      "relative flex flex-col gap-1 py-2.5 px-3 border-b border-black/5 cursor-pointer transition-all last:border-0",
                      isHighlighted
                        ? "bg-[#ff006908]"
                        : "hover:bg-black/[0.02] hover:translate-x-0.5"
                    )}
                    onMouseEnter={() => mappedId && setHighlightedPostId(mappedId)}
                    onMouseLeave={() => setHighlightedPostId(null)}
                  >
                    {/* Left accent bar — visible only when highlighted */}
                    {isHighlighted && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                        style={{ background: GRAD }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                    <p className="text-[11px] font-medium text-neutral-800 leading-relaxed line-clamp-2 pr-3">
                      &ldquo;{hook.hookLine}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400">@{hook.handle}</span>
                      <span className="text-[10px] font-bold" style={{ color: '#ff0069' }}>
                        {hook.hookScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CENTER (50%) - Top Rated Posts + Patterns */}
        <div className="col-span-6 flex flex-col gap-3">

          {/* Section header */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="text-white">
                <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" />
                <rect x="7" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="1" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-neutral-900">Top Rated Posts</p>
              <p className="text-[9px] text-neutral-400 truncate">Saves count double - hover hooks to highlight</p>
            </div>
            {postCount > 0 && (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md text-white shrink-0"
                style={{ background: GRAD }}
              >
                {postCount}
              </span>
            )}
          </div>

          {/* Horizontal scrollable post strip */}
          <div className="overflow-x-auto flex gap-3 pb-2 -mx-1 px-1">
            {data.topRatedPosts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => openDrawer(post._id)}
                className={cn(
                  "relative shrink-0 w-32 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
                  highlightedPostId === post._id
                    ? "ring-2 ring-[#ff0069] scale-105 z-10 shadow-lg shadow-[#ff0069]/20"
                    : "hover:scale-[1.04] hover:shadow-md hover:shadow-black/10"
                )}
                style={{ aspectRatio: '9/16' }}
              >
                {post.thumbnailUrl.startsWith('linear-gradient') ? (
                  <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.thumbnailUrl} alt={post.handle} className="w-full h-full object-cover" />
                )}
                {/* Bottom gradient + ER */}
                <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[9px] text-white font-bold">
                    {post.engagementRate > 0 ? `${(post.engagementRate * 100).toFixed(1)}%` : '-'}
                  </p>
                </div>
                {/* Score badge */}
                <div className="absolute top-1.5 right-1.5">
                  <span
                    className="text-[8px] font-bold px-1 py-0.5 rounded text-white"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                  >
                    ★ {post.upCount + post.saveCount * 2}
                  </span>
                </div>
                {/* Niche tag */}
                <div className="absolute top-1.5 left-1.5">
                  <span
                    className="text-[8px] font-semibold px-1 py-0.5 rounded text-white"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                  >
                    {post.niche}
                  </span>
                </div>
              </motion.div>
            ))}
            {data.topRatedPosts.length === 0 && (
              <div
                className="flex flex-col items-center justify-center gap-2 w-full rounded-xl py-12"
                style={{ border: '1px dashed rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                  <ImageOff size={14} className="text-neutral-300" />
                </div>
                <p className="text-xs text-neutral-400">No rated posts yet</p>
                <p className="text-[10px] text-neutral-300">Rate posts to see your top picks here</p>
              </div>
            )}
          </div>

          {/* Patterns / Signals section */}
          {trends === undefined ? (
            <div
              className="rounded-xl px-4 py-3 space-y-2"
              style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              <div className="h-3 rounded-md animate-pulse w-20" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full mt-1.5 shrink-0 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
                  <div className="h-3 rounded-md animate-pulse flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5">
                Signals
              </p>
              {insights.length === 0 ? (
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Rate posts to surface signals - patterns appear as your team curates content
                </p>
              ) : (
                <div className="space-y-2">
                  {insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[11px] text-neutral-700">
                      <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full" style={{ backgroundColor: '#ff0069' }} />
                      <span className="leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT (26%) - AI Chat + Learning */}
        <div className="col-span-3 flex flex-col gap-3">

          {/* Ask Intelligence - compact card */}
          <div
            className={cn(
              "rounded-xl overflow-hidden border border-black/[0.07] transition-colors",
              !chatOpen && "shadow-sm shadow-black/5"
            )}
            style={{ backgroundColor: '#fff' }}
          >
            {/* Card header */}
            <div
              className="flex items-center justify-between px-3 py-2.5"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
                  <Sparkles size={11} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-neutral-900">Ask Intelligence</p>
                  <p className="text-[9px] text-neutral-400">MiniMax - full context</p>
                </div>
              </div>
              {!chatOpen ? (
                <button
                  onClick={() => setChatOpen(true)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg text-white shadow-sm transition-all hover:shadow hover:opacity-90 active:scale-95"
                  style={{ background: GRAD }}
                >
                  Open
                </button>
              ) : (
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg text-[#ff0069] hover:bg-[#ff006908] transition-colors active:scale-95"
                >
                  Close
                </button>
              )}
            </div>

            {/* Expanded AI chat */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <AIChatPanel
                    data={trends}
                    insightsData={data}
                    onClose={() => setChatOpen(false)}
                    embedded
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Learning Signal */}
          <LearningSignal data={data} />

        </div>
      </div>

      {/* PostDetailDrawer */}
      <AnimatePresence>
        {drawerIndex !== null && (
          <PostDetailDrawer
            posts={drawerPosts}
            initialIndex={drawerIndex}
            onClose={() => setDrawerIndex(null)}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
}
