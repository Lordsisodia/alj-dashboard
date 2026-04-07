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

type EventRow = {
  _id: string; handle: string; niche: string; contentType: string;
  thumbnailUrl: string; aiAnalysis: { hookScore: number; hookLine: string; analyzedAt: number } | null;
};

function EventRowItem({ post, onClick }: { post: EventRow; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
  const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
      whileHover={{ x: 2, backgroundColor: 'rgba(0,0,0,0.04)' }}
      onClick={onClick}
    >
      <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
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
        <p className="text-[9px] text-neutral-400 italic truncate">"{post.aiAnalysis!.hookLine}"</p>
      </div>

      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        {post.aiAnalysis!.hookScore.toFixed(1)}
      </span>

      <p className="text-[10px] text-neutral-400 flex-shrink-0">
        {timeAgo(post.aiAnalysis!.analyzedAt ?? 0)}
      </p>
    </motion.div>
  );
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
    | { kind: 'event'; post: EventRow };

  const rows: Row[] = [];
  dayGroups.forEach((group) => {
    rows.push({ kind: 'header', label: group.label });
    group.posts.forEach((post) => {
      rows.push({ kind: 'event', post: post as EventRow });
    });
  });

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => rows[i]?.kind === 'header' ? 32 : 60,
    overscan: 10,
  });

  return (
    <>
      <div className="flex flex-col h-full">
        <AnalysisBreadcrumb current="Analysis Activity" onBack={onBack} />

        {analysed === undefined ? (
          <div className="flex-1 space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="w-9 h-9 rounded-lg animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.06)', width: '45%' }} />
                  <div className="h-2 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.04)', width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,0,105,0.08)' }}>
              <span className="text-lg">📭</span>
            </div>
            <p className="text-[12px] text-neutral-400">No activity yet</p>
            <p className="text-[10px] text-neutral-400 text-center">Analysed posts will appear<br />in the activity feed</p>
          </div>
        ) : (
          <>
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
                      <EventRowItem
                        post={row.post}
                        onClick={() => {
                          const idx = events.findIndex(p => p._id === row.post._id);
                          if (idx !== -1) setDrawerIndex(idx);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
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
