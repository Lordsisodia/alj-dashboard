'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useQuery } from 'convex/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { api } from '../../../../../convex/_generated/api';
import { groupByDay, timeAgo } from '../../utils';
import { NICHE_COLORS } from '../../constants';
import { AnalysisBreadcrumb } from './AnalysisBreadcrumb';
import { PostDetailDrawer } from '../drawer/PostDetailDrawer';
import type { DrawerPost } from '../../types';

interface Props {
  days: number;
  niche: string;
  onBack: () => void;
}

type PostRow = {
  _id: string; handle: string; niche: string; contentType: string;
  thumbnailUrl: string; aiAnalysis: { hookScore: number; hookLine: string; analyzedAt: number } | null;
};

function PostRowItem({ post, index, onClick }: { post: PostRow; index: number; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
  const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      whileHover={{ x: 2, backgroundColor: 'rgba(0,0,0,0.04)' }}
      onClick={onClick}
    >
      <div className="w-4 h-4 rounded border border-neutral-200 flex-shrink-0" />

      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
        {isGrad || imgError ? (
          <div className="w-full h-full" style={{ background: isGrad ? post.thumbnailUrl : nicheColor }} />
        ) : (
          <Image
            src={post.thumbnailUrl}
            alt={post.handle}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-semibold text-neutral-800">{post.handle}</p>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: nicheColor }}>
            {post.niche}
          </span>
          <span className="text-[9px] text-neutral-400">{post.contentType}</span>
        </div>
        <p className="text-[9px] text-neutral-400 truncate italic">"{post.aiAnalysis!.hookLine}"</p>
      </div>

      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        hook {post.aiAnalysis!.hookScore.toFixed(1)}
      </span>

      <p className="text-[10px] text-neutral-400 flex-shrink-0">
        {timeAgo(post.aiAnalysis!.analyzedAt ?? 0)}
      </p>
    </motion.div>
  );
}

export function AllPostsView({ days, niche, onBack }: Props) {
  const analysed = useQuery(api.intelligence.getAnalysedPosts, {
    days,
    niche: niche !== 'all' ? niche : undefined,
    limit: 500,
  });

  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const posts = [...(analysed ?? [])]
    .filter(p => p.aiAnalysis?.analyzedAt)
    .sort((a, b) => (b.aiAnalysis!.analyzedAt ?? 0) - (a.aiAnalysis!.analyzedAt ?? 0));

  const dayGroups = groupByDay(posts, p => p.aiAnalysis!.analyzedAt ?? 0);

  type Row =
    | { kind: 'header'; label: string }
    | { kind: 'post'; post: PostRow; index: number };

  const rows: Row[] = [];
  dayGroups.forEach((group, gi) => {
    rows.push({ kind: 'header', label: group.label });
    group.posts.forEach((post, pi) => {
      rows.push({ kind: 'post', post: post as PostRow, index: gi * 100 + pi });
    });
  });

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => rows[i]?.kind === 'header' ? 32 : 64,
    overscan: 10,
  });

  return (
    <>
      <div className="flex flex-col h-full">
        <AnalysisBreadcrumb current="All Analysed Posts" onBack={onBack} />

        {analysed === undefined ? (
          <div className="flex-1 space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="w-4 h-4 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
                <div className="w-10 h-10 rounded-lg animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.06)', width: '50%' }} />
                  <div className="h-2 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.04)', width: '35%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,0,105,0.08)' }}>
              <span className="text-lg">📭</span>
            </div>
            <p className="text-[12px] text-neutral-400">No analysed posts yet</p>
            <p className="text-[10px] text-neutral-400 text-center">Run AI analysis on queued posts<br />to see them here</p>
          </div>
        ) : (
          <div
            ref={parentRef}
            className="flex-1 overflow-y-auto pr-2"
            style={{ contain: 'strict' }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((vrow) => {
                const row = rows[vrow.index];
                if (row.kind === 'header') {
                  return (
                    <div
                      key={vrow.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${vrow.size}px`,
                        transform: `translateY(${vrow.start}px)`,
                      }}
                      className="flex items-center px-2"
                    >
                      <div className="w-1.5 h-4 rounded-full mr-2 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }} />
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                        {row.label}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={vrow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${vrow.size}px`,
                      transform: `translateY(${vrow.start}px)`,
                    }}
                  >
                    <PostRowItem
                      post={row.post}
                      index={row.index}
                      onClick={() => {
                        const idx = posts.findIndex(p => p._id === row.post._id);
                        if (idx !== -1) setDrawerIndex(idx);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {drawerIndex !== null && posts && (
          <PostDetailDrawer
            posts={posts as unknown as DrawerPost[]}
            initialIndex={drawerIndex}
            onClose={() => setDrawerIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
