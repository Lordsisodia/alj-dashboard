'use client';

import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InsightsData, TrendsData, RatedPost } from '../../types';

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

interface Props {
  data:           InsightsData;
  highlightedPostId: string | null;
  onPostClick:    (postId: string) => void;
  trends:         TrendsData | undefined;
  insights:      string[];
}

export function TopRatedSection({ data, highlightedPostId, onPostClick, trends, insights }: Props) {
  const postCount = data.topRatedPosts?.length ?? 0;

  return (
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
      <div className="overflow-x-auto flex gap-3 pb-2 -mx-1 px-1 items-start">
        {data.topRatedPosts.map((post, i) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            onClick={() => onPostClick(post._id)}
            className={cn(
              "relative shrink-0 w-32 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
              highlightedPostId === post._id
                ? "ring-2 ring-[#ff0069] scale-105 z-10 shadow-lg shadow-[#ff0069]/20"
                : "hover:scale-[1.04] hover:shadow-md hover:shadow-black/10"
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
            <p className="text-[10px] text-neutral-300">Rate posts to see your top picks here</p>
          </div>
        )}
      </div>

      {/* Signals section */}
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
  );
}