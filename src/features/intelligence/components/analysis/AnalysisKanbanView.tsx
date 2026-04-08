'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Zap, Video } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { PipelineColumn } from '@/features/recon/components/discovery';
import { LivePipelineCard } from './LivePipelineCard';
import { AnalysisCard } from './AnalysisCard';
import { AnalysisDetailPanel } from './AnalysisDetailPanel';
import { ActivityFeed } from './ActivityFeed';
import { HookLineGallery } from './HookLineGallery';
import { RuleCards } from './RuleCards';
import { HookScoreDistribution } from './HookScoreDistribution';
import { EmotionFrequency } from './EmotionFrequency';
import { GRAD } from '../../constants';

// ── Types ──────────────────────────────────────────────────────────────────────

type PostStatus = 'queue' | 'downloading' | 'analysing' | 'analysed';

interface KanbanPost {
  _id: string;
  handle: string;
  niche: string;
  contentType: string;
  thumbnailUrl: string;
  videoUrl?: string;
  caption?: string;
  engagementRate: number;
  outlierRatio: number;
  likes: number;
  views: number;
  saves: number;
  comments: number;
  aiAnalysis?: {
    hookScore: number;
    hookLine: string;
    emotions: string[];
    breakdown: string;
    suggestions: string[];
    transcript?: string;
    analyzedAt: number;
  };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ColumnSkeleton({ color }: { color: string }) {
  return (
    <div className="flex-shrink-0 w-52 rounded-2xl overflow-hidden" style={{ border: `1px solid ${color}20` }}>
      <div className="px-3 py-2" style={{ backgroundColor: `${color}10` }}>
        <div className="h-3 w-16 rounded animate-pulse" style={{ backgroundColor: `${color}30` }} />
      </div>
      <div className="p-2 space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl px-2.5 py-3 animate-pulse" style={{ border: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fff' }}>
            <div className="h-20 rounded-lg mb-2" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
            <div className="h-2 w-16 rounded animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
            <div className="h-2 w-10 rounded animate-pulse mt-1" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analyse button ─────────────────────────────────────────────────────────────

function AnalyseBtn({ postId, onStart }: { postId: string; onStart: (id: string) => void }) {
  return (
    <button
      onClick={() => onStart(postId)}
      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-opacity hover:opacity-90"
      style={{ background: GRAD }}
    >
      <Sparkles size={9} /> Analyse
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface KanbanProps { days: number; niche: string; }

export function AnalysisKanbanView({ days, niche }: KanbanProps) {
  // ── Queries ──────────────────────────────────────────────────────────────
  const queue    = useQuery(api.intelligence.getAnalysisQueue, { days, limit: 50 }) as KanbanPost[] | undefined;
  const patchAnalysis = useMutation(api.intelligence.patchAnalysis);
  const analysed  = useQuery(api.intelligence.getAnalysedPosts, { days, niche: niche !== 'all' ? niche : undefined, limit: 100 }) as KanbanPost[] | undefined;
  const hookStats = useQuery(api.intelligence.getHookStats, { days }) as any;

  // ── Local state ──────────────────────────────────────────────────────────
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [analysingIds,  setAnalysingIds]  = useState<Set<string>>(new Set());
  const [selectedPost,   setSelectedPost]   = useState<KanbanPost | null>(null);

  // ── Derived pools ────────────────────────────────────────────────────────
  const queueIds     = new Set((queue    ?? []).map(p => p._id));
  const analysedIds  = new Set((analysed ?? []).map(p => p._id));

  const downloadingPosts = (queue ?? []).filter(p => downloadingIds.has(p._id));
  const analysingPosts   = (queue ?? []).filter(p => analysingIds.has(p._id));
  const remainingQueue   = (queue ?? []).filter(p => !downloadingIds.has(p._id) && !analysingIds.has(p._id) && !analysedIds.has(p._id));

  const allAnalysed = [
    ...(analysed ?? []),
    ...(queue ?? []).filter(p => p.aiAnalysis && !analysedIds.has(p._id)),
  ];

  // ── Actions ──────────────────────────────────────────────────────────────

  async function handleAnalyse(post: KanbanPost) {
    // Move to downloading → analysing → done
    setDownloadingIds(prev => new Set([...prev, post._id]));
    await new Promise(r => setTimeout(r, 800)); // simulate download
    setDownloadingIds(prev => { const s = new Set(prev); s.delete(post._id); return s; });

    setAnalysingIds(prev => new Set([...prev, post._id]));
    try {
      const res = await fetch('/api/intelligence/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Patch result back to Convex
      await patchAnalysis({
        postId: post._id as any,
        transcript: data.transcript ?? null,
        hookScore: data.hookScore ?? 5,
        hookLine: data.hookLine ?? '',
        emotions: data.emotions ?? [],
        breakdown: data.breakdown ?? '',
        suggestions: data.suggestions ?? [],
      });
    } catch (e) {
      console.error('[analyse]', e);
    } finally {
      setAnalysingIds(prev => { const s = new Set(prev); s.delete(post._id); return s; });
    }
  }

  async function handleRunAll() {
    const posts = remainingQueue.slice(0, 8); // cap at 8 to avoid overload
    for (const post of posts) {
      await handleAnalyse(post);
    }
  }

  const isLoading = queue === undefined || analysed === undefined;
  const hasQueuePosts = remainingQueue.length > 0 || downloadingPosts.length > 0 || analysingPosts.length > 0;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex gap-4" style={{ height: 'calc(100vh - 220px)' }}>

        {/* ── LEFT: Kanban (42%) ──────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex gap-3 h-full" style={{ width: '42%' }}>

          {isLoading ? (
            <>
              <ColumnSkeleton color="#ff0069" />
              <ColumnSkeleton color="#833ab4" />
              <ColumnSkeleton color="#7c3aed" />
              <ColumnSkeleton color="#4a9eff" />
            </>
          ) : (
            <>
              {/* Queue */}
              <div className="flex-1 min-h-0"><PipelineColumn
                title="Queue"
                count={remainingQueue.length}
                accentColor="#ff0069"
                columnBg="rgba(255,0,105,0.035)"
                tooltip="Qualified posts waiting for analysis. Click Analyse or run all."
                headerExtra={remainingQueue.length > 0 && (
                  <button
                    onClick={handleRunAll}
                    className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold text-white"
                    style={{ background: GRAD }}
                    title="Run all (up to 8)"
                  >
                    <Zap size={9} /> Run all
                  </button>
                )}
              >
                {remainingQueue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Video size={18} className="text-neutral-200" />
                    <p className="text-[10px] text-center text-neutral-300">Queue is empty</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {remainingQueue.map(post => (
                      <AnalysisCard
                        key={post._id}
                        post={post}
                        onAnalyse={() => handleAnalyse(post)}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </PipelineColumn></div>

              {/* Downloading */}
              <div className="flex-1 min-h-0"><PipelineColumn
                title="Downloading"
                count={downloadingPosts.length}
                accentColor="#833ab4"
                columnBg="rgba(131,58,180,0.04)"
                tooltip="Videos being fetched to R2 storage."
              >
                {downloadingPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 size={16} className="text-neutral-200 animate-spin" />
                    <p className="text-[10px] text-center text-neutral-300">Waiting...</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {downloadingPosts.map(post => (
                      <LivePipelineCard key={post._id} post={post} phase="downloading" />
                    ))}
                  </AnimatePresence>
                )}
              </PipelineColumn></div>

              {/* Analysing */}
              <div className="flex-1 min-h-0"><PipelineColumn
                title="Analysing"
                count={analysingPosts.length}
                accentColor="#7c3aed"
                columnBg="rgba(124,58,237,0.04)"
                tooltip="Posts being analyzed by AI (Gemini)."
              >
                {analysingPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Sparkles size={16} className="text-neutral-200" />
                    <p className="text-[10px] text-center text-neutral-300">Idle</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {analysingPosts.map(post => (
                      <LivePipelineCard key={post._id} post={post} phase="analysing" />
                    ))}
                  </AnimatePresence>
                )}
              </PipelineColumn></div>

              {/* Analyzed */}
              <div className="flex-1 min-h-0"><PipelineColumn
                title="Analyzed"
                count={allAnalysed.length}
                accentColor="#4a9eff"
                columnBg="rgba(74,158,255,0.04)"
                tooltip="Posts with completed AI analysis. Click to open full analysis + chat."
              >
                {allAnalysed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Sparkles size={18} className="text-neutral-200" />
                    <p className="text-[10px] text-center text-neutral-300">No analyses yet</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {allAnalysed.map(post => (
                      <motion.div
                        key={post._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      >
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="w-full text-left rounded-xl overflow-hidden flex flex-col"
                          style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
                        >
                          <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: 100, overflow: 'hidden' }}>
                            {post.thumbnailUrl.startsWith('linear-gradient') ? (
                              <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={post.thumbnailUrl} alt={post.handle} className="w-full h-full object-cover" />
                            )}
                            {/* Hook score badge */}
                            {post.aiAnalysis && (
                              <div
                                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                              >
                                {post.aiAnalysis.hookScore.toFixed(1)}
                              </div>
                            )}
                          </div>
                          <div className="p-2 space-y-1">
                            <p className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</p>
                            <p className="text-[9px] text-neutral-400">{post.niche} · {(post.engagementRate * 100).toFixed(1)}% ER</p>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </PipelineColumn></div>
            </>
          )}
        </div>

        {/* ── RIGHT: Insights (58%) ───────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 overflow-y-auto">

          {/* Top: Hook Line Gallery */}
          {hookStats && hookStats.hookLines?.length > 0 && (
            <HookLineGallery hookLines={hookStats.hookLines} />
          )}

          {/* Middle: Rules + Score Distribution + Emotions */}
          <div className="grid grid-cols-2 gap-3">
            {hookStats && hookStats.scoreDistribution?.length > 0 && (
              <HookScoreDistribution distribution={hookStats.scoreDistribution} />
            )}
            {hookStats && hookStats.emotionFrequency?.length > 0 && (
              <EmotionFrequency emotions={hookStats.emotionFrequency} />
            )}
          </div>

          {/* Rules derived from analysed posts */}
          {allAnalysed.length >= 3 && (
            <RuleCards
              posts={allAnalysed.map(p => ({
                hookLine:    p.aiAnalysis?.hookLine    ?? '',
                hookScore:   p.aiAnalysis?.hookScore   ?? 0,
                engagementRate: p.engagementRate,
                emotions:    p.aiAnalysis?.emotions     ?? [],
              }))}
            />
          )}

          {/* Activity feed */}
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Recent activity</p>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(() => { const AF = ActivityFeed as React.ComponentType<any>; return <AF />; })()}
          </div>
        </div>
      </div>

      {/* ── Side panel ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPost && (
          <AnalysisDetailPanel
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
