'use client';

import { useQuery, useMutation } from 'convex/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { ImageOff, Brain, TrendingUp, Hash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { api } from '../../../../../convex/_generated/api';

const IntelligenceAssistant = dynamic(
  () => import('../assistant/IntelligenceAssistantPage'),
  { ssr: false }
);
import { RatingSummaryBar }    from './RatingSummaryBar';
import { LearningSignal }      from './LearningSignal';
import { PostDetailDrawer }    from '../drawer/PostDetailDrawer';
import { PipelineStatusStrip } from '../dashboard/PipelineStatusStrip';
import { cn }                  from '@/lib/utils';
import type { InsightsData, TrendsData } from '../../types';
import type { DrawerPost }  from '../../types';

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

// ── Helpers ──────────────────────────────────────────────────────────────────

function MiniBar({ label, value, max, color = '#ff0069' }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-neutral-500 w-16 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-semibold text-neutral-700 w-10 text-right shrink-0">{(pct).toFixed(0)}%</span>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function NichePerf({ trends }: { trends: TrendsData }) {
  const niches = trends.nicheStats.slice(0, 6);
  const max = niches[0]?.avgER ?? 1;
  return (
    <div className="flex flex-col gap-1.5">
      {niches.map(n => (
        <MiniBar
          key={n.niche}
          label={n.niche}
          value={n.avgER}
          max={max}
          color="var(--pink)"
        />
      ))}
    </div>
  );
}

function FormatPerf({ trends }: { trends: TrendsData }) {
  const formats = trends.formatStats;
  const max = formats[0]?.avgER ?? 1;
  return (
    <div className="flex flex-col gap-1.5">
      {formats.map(f => (
        <MiniBar
          key={f.format}
          label={f.format}
          value={f.avgER}
          max={max}
          color="#833ab4"
        />
      ))}
    </div>
  );
}

function OutlierPosts({ trends }: { trends: TrendsData }) {
  const outliers = trends.outlierPosts.slice(0, 3);
  if (!outliers.length) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {outliers.map(p => (
        <div key={p._id} className="flex items-center gap-2 py-1">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-neutral-800 truncate">@{p.handle}</p>
            <p className="text-[9px] text-neutral-400">{p.niche} · {p.contentType}</p>
          </div>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
            style={{ background: GRAD }}
          >
            {p.outlierRatio.toFixed(1)}x
          </span>
        </div>
      ))}
    </div>
  );
}

function TopHashtags({ hashtags }: { hashtags: any[] }) {
  const top = hashtags.slice(0, 5);
  if (!top.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {top.map(h => (
        <span
          key={h.hashtag}
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,0,105,0.08)', color: '#ff0069' }}
        >
          #{h.hashtag}
        </span>
      ))}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

export function InsightsView() {
  const data        = useQuery(api.insights.getInsights, {}) as InsightsData | undefined;
  const trends      = useQuery(api.intelligence.getTrends, { days: 30 }) as TrendsData | undefined;
  const hashtags    = useQuery(api.intelligence.getHashtagCorrelation, { days: 30 });
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

  const topRater = data?.raterActivity[0];
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
      className="space-y-4"
    >
      {/* Pipeline strip */}
      <PipelineStatusStrip
        totalIndexed={stats?.totalIndexed ?? 0}
        postsThisWeek={stats?.postsThisWeek ?? 0}
        latestScrapeAt={stats?.latestScrapeAt ?? 0}
      />

      {/* KPI strip */}
      <RatingSummaryBar summary={data.summary} topRater={topRater} />

      {/* 3-column layout */}
      <div className="grid grid-cols-12 gap-4">

        {/* LEFT (24%) - Team Curation */}
        <div className="col-span-3 flex flex-col gap-3">
          {/* Rating breakdown */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
                <TrendingUp size={11} className="text-white" />
              </div>
              <p className="text-[11px] font-semibold text-neutral-900">Team Signal</p>
            </div>
            <div className="px-3 py-3 space-y-2">
              {data.nichePreferences.slice(0, 4).map(n => (
                <div key={n.niche} className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-700">{n.niche}</span>
                  <span className="text-[10px] font-bold" style={{ color: '#ff0069' }}>
                    {(n.upRate * 100).toFixed(0)}% ↑
                  </span>
                </div>
              ))}
              {(!data.nichePreferences || data.nichePreferences.length === 0) && (
                <p className="text-[11px] text-neutral-400">Rate posts to see niche signal</p>
              )}
            </div>
          </div>

          {/* Format preferences */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}
            >
              <p className="text-[11px] font-semibold text-neutral-900">Format Signal</p>
            </div>
            <div className="px-3 py-3 space-y-2">
              {data.formatPreferences.slice(0, 3).map(f => (
                <div key={f.format} className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-700 capitalize">{f.format}</span>
                  <span className="text-[10px] font-bold" style={{ color: '#833ab4' }}>
                    {(f.upRate * 100).toFixed(0)}% ↑
                  </span>
                </div>
              ))}
              {(!data.formatPreferences || data.formatPreferences.length === 0) && (
                <p className="text-[11px] text-neutral-400">No format signal yet</p>
              )}
            </div>
          </div>

          {/* Rater leaderboard */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}
            >
              <p className="text-[11px] font-semibold text-neutral-900">Top Raters</p>
            </div>
            <div className="px-3 py-3 space-y-2">
              {data.raterActivity.slice(0, 5).map((r, i) => (
                <div key={r.ratedBy} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {i < 3 && (
                      <span className="text-[9px] font-bold" style={{ color: i === 0 ? '#ff0069' : i === 1 ? '#833ab4' : '#06b6d4' }}>
                        #{i + 1}
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-700">{r.ratedBy}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">{r.total} ratings</span>
                </div>
              ))}
              {(!data.raterActivity || data.raterActivity.length === 0) && (
                <p className="text-[11px] text-neutral-400">No ratings yet</p>
              )}
            </div>
          </div>
        </div>

        {/* CENTER (50%) - Performance Intelligence */}
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
              <p className="text-[9px] text-neutral-400 truncate">Click any post to open detail drawer</p>
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
          <div className="overflow-x-auto flex gap-3 pb-2 -mx-1 px-1 items-start">
            {data.topRatedPosts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => openDrawer(post._id)}
                className={cn(
                  "relative shrink-0 w-32 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
                  "hover:scale-[1.04] hover:shadow-md hover:shadow-black/10"
                )}
                style={{ height: '176px' }}
              >
                {post.thumbnailUrl.startsWith('linear-gradient') ? (
                  <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.thumbnailUrl} alt={post.handle} className="w-full h-full object-cover" />
                )}
                <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[9px] text-white font-bold">
                    {post.engagementRate > 0 ? `${(post.engagementRate * 100).toFixed(1)}%` : '-'}
                  </p>
                </div>
                <div className="absolute top-1.5 right-1.5">
                  <span
                    className="text-[8px] font-bold px-1 py-0.5 rounded text-white"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                  >
                    ★ {post.upCount + post.saveCount * 2}
                  </span>
                </div>
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
              </div>
            )}
          </div>

          {/* Niche performance */}
          {trends ? (
            <div
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5">Niche ER</p>
              <NichePerf trends={trends} />
            </div>
          ) : (
            <div className="rounded-xl px-4 py-3 space-y-2" style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="h-3 rounded-md animate-pulse w-20" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-2 rounded-md animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
              ))}
            </div>
          )}

          {/* Format performance */}
          {trends ? (
            <div
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5">Format ER</p>
              <FormatPerf trends={trends} />
            </div>
          ) : null}

          {/* Outlier posts + Hashtag correlation in 2-col grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Outliers */}
            {trends ? (
              <div
                className="rounded-xl px-3 py-3"
                style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Top Outliers</p>
                <OutlierPosts trends={trends} />
              </div>
            ) : null}

            {/* Hashtag correlation */}
            {hashtags && hashtags.length > 0 ? (
              <div
                className="rounded-xl px-3 py-3"
                style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                  <Hash size={9} className="inline mr-1" />
                  Top Tags
                </p>
                <TopHashtags hashtags={hashtags} />
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT (26%) - Actions + Learning */}
        <div className="col-span-3 flex flex-col gap-3">

          {/* Embedded Intelligence Assistant */}
          <div
            className="rounded-xl overflow-hidden border border-black/[0.07] flex flex-col"
            style={{ backgroundColor: '#fff', height: '480px' }}
          >
            <IntelligenceAssistant onClose={() => {}} />
          </div>

          {/* Trend alerts */}
          <div
            className="rounded-xl px-3 py-3"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5">Alerts</p>
            {trendAlerts.length > 0 ? (
              <div className="space-y-2">
                {trendAlerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-700">
                    <span className="mt-1 shrink-0 w-1 h-1 rounded-full" style={{ backgroundColor: '#7c3aed' }} />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400">No alerts yet</p>
            )}
          </div>

          {/* Learning Signal */}
          <div
            className="rounded-xl overflow-hidden border border-black/[0.07]"
            style={{ backgroundColor: '#fff' }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
                <Brain size={11} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-900">Team Learning</p>
                <p className="text-[9px] text-neutral-400">Curation signals</p>
              </div>
            </div>
            <div className="px-3 py-3">
              <LearningSignal data={data} />
            </div>
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
