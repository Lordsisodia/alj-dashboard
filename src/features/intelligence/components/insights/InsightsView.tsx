'use client';

import { useQuery, useMutation } from 'convex/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { ImageOff, Brain } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { AIAssistantInterface } from '@/components/ui/ai-assistant-interface';
import { AnalysisInsights }    from './AnalysisInsights';
import { PostDetailDrawer }    from '../drawer/PostDetailDrawer';
import { PipelineStatusStrip } from '../dashboard/PipelineStatusStrip';
import { cn }                  from '@/lib/utils';
import type { InsightsData, TrendsData } from '../../types';
import type { DrawerPost }  from '../../types';

const GRAD = 'linear-gradient(135deg, #6d28d9, #4c1d95)';

// ── Main ────────────────────────────────────────────────────────────────────

export function InsightsView() {
  const data        = useQuery(api.insights.getInsights, {}) as InsightsData | undefined;
  const trends      = useQuery(api.intelligence.getTrends, { days: 30 }) as TrendsData | undefined;
  const stats       = useQuery(api.intelligence.getStats, {});
  const seedRatings = useMutation(api.insightsSeed.seedSwipeRatings);

  const postIds   = useMemo(() => (data?.topRatedPosts ?? []).map(p => p._id as any), [data?.topRatedPosts]);
  const fullPosts = useQuery(api.intelligence.getPostsByIds, { ids: postIds });

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

  // Build drawer posts from fullPosts (real likes/views/saves)
  const drawerPosts = useMemo(() => {
    if (!fullPosts) return [];
    return (fullPosts as any[]).map((p: any) => ({
      _id:            p._id,
      externalId:     p.externalId ?? '',
      handle:         p.handle,
      platform:       p.platform ?? 'instagram',
      niche:          p.niche ?? 'Unknown',
      contentType:    p.contentType ?? 'reel',
      thumbnailUrl:   p.thumbnailUrl ?? '',
      caption:        p.caption,
      hashtags:       p.hashtags ?? [],
      likes:          p.likes ?? 0,
      views:          p.views ?? 0,
      saves:          p.saves ?? 0,
      engagementRate: p.engagementRate ?? 0,
      outlierRatio:   p.outlierRatio,
      postedAt:       p.postedAt ?? 0,
      scrapedAt:      p.scrapedAt,
      saved:          p.saved ?? false,
      aiAnalysis:     p.aiAnalysis ?? undefined,
    }));
  }, [fullPosts]);

  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);

  function openDrawer(postId: string) {
    const idx = (data?.topRatedPosts ?? []).findIndex(p => p._id === postId);
    if (idx !== -1) setDrawerIndex(idx);
  }

  const postCount = data?.topRatedPosts?.length ?? 0;

  // Trend alerts
  const trendAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (!trends || !data) return alerts;
    const { stats } = trends as any;
    if (stats?.postsThisWeek !== undefined && stats?.postsLastWeek !== undefined) {
      const diff = stats.postsThisWeek - stats.postsLastWeek;
      if (diff > 0) alerts.push(`+${diff} posts scraped this week vs last`);
      else if (diff < 0) alerts.push(`${diff} posts scraped this week vs last`);
    }
    const topNiche = trends.nicheStats[0];
    if (topNiche && trends.nicheStats.length > 1) {
      const runnerUp = trends.nicheStats[1];
      const lift = (topNiche.avgER / (runnerUp?.avgER || 1) - 1) * 100;
      if (lift > 20) alerts.push(`${topNiche.niche} outperforms ${runnerUp.niche} by ${lift.toFixed(0)}%`);
    }
    return alerts;
  }, [trends, data]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full min-h-0 space-y-4"
    >
      {/* Pipeline strip — max 6 stats */}
      <PipelineStatusStrip
        totalIndexed={stats?.totalIndexed ?? 0}
        postsThisWeek={stats?.postsThisWeek ?? 0}
        latestScrapeAt={stats?.latestScrapeAt ?? 0}
        avgER={trends?.avgER}
        outlierCount={trends?.outlierPosts.length}
        totalRatings={data.summary.totalRatings}
      />

      {/* Analysis insights — hook scores, emotions, winning patterns */}
      <AnalysisInsights />

      {/* Bottom row: AI Intelligence (main) + Top Rated sidebar */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* AI Intelligence Assistant */}
        <div
          className="flex-1 rounded-xl overflow-hidden border border-black/[0.07] flex flex-col"
          style={{ backgroundColor: '#fff', minHeight: 280 }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3 shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.05), rgba(76,29,149,0.05))', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div className="w-6 h-6 rounded-xl flex items-center justify-center" style={{ background: GRAD }}>
              <Brain size={12} className="text-white" />
            </div>
            <p className="text-[12px] font-semibold text-neutral-900">Intelligence Assistant</p>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <AIAssistantInterface />
          </div>
        </div>

        {/* Top Rated Posts — right sidebar, fills row height, scrolls internally */}
        <div
          className="w-72 flex-shrink-0 flex flex-col rounded-xl overflow-hidden min-h-0"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          {/* Sidebar header */}
          <div
            className="flex items-center gap-2 px-3 py-2 shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.05), rgba(76,29,149,0.05))', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="text-violet-500">
              <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="7" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="1" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
            </svg>
            <p className="text-[11px] font-semibold text-neutral-900">Top Rated</p>
            {postCount > 0 && (
              <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600">
                {postCount}
              </span>
            )}
          </div>

          {/* Ranked scrollable list */}
          <div className="flex-1 overflow-y-auto flex flex-col py-1.5">
            {data.topRatedPosts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                onClick={() => openDrawer(post._id)}
                className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                {/* Rank */}
                <span className="w-4 text-center text-[9px] font-bold text-neutral-300 flex-shrink-0">
                  {i + 1}
                </span>

                {/* Thumbnail — 9/16 aspect, capped height */}
                <div
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 32, height: 48 }}
                >
                  {post.thumbnailUrl.startsWith('linear-gradient') ? (
                    <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnailUrl} alt={post.handle} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-neutral-800 truncate">@{post.handle}</p>
                  <p className="text-[9px] text-neutral-400 truncate">{post.niche} · {post.contentType}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {post.engagementRate > 0 && (
                      <span className="text-[9px] font-semibold text-neutral-500">
                        {(post.engagementRate * 100).toFixed(1)}% ER
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-violet-500">
                      ★ {post.upCount + post.saveCount * 2}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {data.topRatedPosts.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 mx-3 my-4 rounded-xl py-10" style={{ border: '1px dashed rgba(0,0,0,0.1)' }}>
                <ImageOff size={16} className="text-neutral-300" />
                <p className="text-[10px] text-neutral-400">No rated posts yet</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* PostDetailDrawer */}
      <AnimatePresence>
        {drawerIndex !== null && (
          <PostDetailDrawer
            posts={drawerPosts as DrawerPost[]}
            initialIndex={drawerIndex}
            onClose={() => setDrawerIndex(null)}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
}
