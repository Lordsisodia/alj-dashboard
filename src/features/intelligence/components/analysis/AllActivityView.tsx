'use client';

import Image from 'next/image';
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

export function AllActivityView({ days, niche, onBack }: Props) {
  const analysed = useQuery(api.intelligence.getAnalysedPosts, {
    days,
    niche: niche !== 'all' ? niche : undefined,
    limit: 500,
  });

  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const events = [...(analysed ?? [])]
    .filter(p => p.aiAnalysis?.analyzedAt)
    .sort((a, b) => (b.aiAnalysis!.analyzedAt ?? 0) - (a.aiAnalysis!.analyzedAt ?? 0));

  const dayGroups = groupByDay(events, p => p.aiAnalysis!.analyzedAt ?? 0);

  type Row =
    | { kind: 'header'; label: string }
    | { kind: 'event'; post: typeof events[0] };

  const rows: Row[] = [];
  for (const group of dayGroups) {
    rows.push({ kind: 'header', label: group.label });
    for (const post of group.posts) {
      rows.push({ kind: 'event', post });
    }
  }

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => rows[i]?.kind === 'header' ? 28 : 52,
    overscan: 10,
  });

  return (
    <>
      <div className="flex flex-col h-full">
        <AnalysisBreadcrumb current="Analysis Activity" onBack={onBack} />

        <p className="text-[10px] text-neutral-400 mb-3">All analysis events - newest first</p>

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
                    className="flex items-center px-1"
                  >
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                      {row.label}
                    </span>
                  </div>
                );
              }

              const { post } = row;
              const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
              const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

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
                  className="flex items-center gap-3 px-1 py-1 cursor-pointer hover:bg-black/[0.03] rounded-lg transition-colors"
                  onClick={() => {
                    const idx = events.findIndex(p => p._id === post._id);
                    if (idx !== -1) setDrawerIndex(idx);
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                    {isGrad ? (
                      <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
                    ) : (
                      <Image src={post.thumbnailUrl} alt={post.handle} fill className="object-cover" referrerPolicy="no-referrer" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] font-semibold text-neutral-800">{post.handle}</p>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: nicheColor }}>
                        {post.niche}
                      </span>
                      <span className="text-[9px] text-neutral-400">{post.contentType}</span>
                    </div>
                    <p className="text-[9px] text-neutral-400 italic truncate">"{post.aiAnalysis!.hookLine}"</p>
                  </div>

                  {/* Hook score */}
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                  >
                    {post.aiAnalysis!.hookScore.toFixed(1)}
                  </span>

                  {/* Timestamp */}
                  <p className="text-[10px] text-neutral-400 flex-shrink-0">
                    {timeAgo(post.aiAnalysis!.analyzedAt ?? 0)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawerIndex !== null && events && (
          <PostDetailDrawer
            posts={events as unknown as DrawerPost[]}
            initialIndex={drawerIndex}
            onClose={() => setDrawerIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
