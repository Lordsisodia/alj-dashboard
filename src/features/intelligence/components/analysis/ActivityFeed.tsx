'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { timeAgo } from '../../utils';
import { NICHE_COLORS } from '../../constants';
import { useState } from 'react';

interface Props {
  onViewAll: () => void;
  onSelectPost: (postId: string) => void;
}

export function ActivityFeed({ onViewAll, onSelectPost }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const analysed = useQuery(api.intelligence.getAnalysedPosts, { days: 90, limit: 100 });

  // Most recent 15 by analysedAt
  const events = [...(analysed ?? [])]
    .filter(p => p.aiAnalysis?.analyzedAt)
    .sort((a, b) => (b.aiAnalysis!.analyzedAt ?? 0) - (a.aiAnalysis!.analyzedAt ?? 0))
    .slice(0, 15);

  return (
    <div className="flex flex-col h-full">
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Recent analysis
      </p>

      {events.length === 0 ? (
        <p className="text-[11px] text-neutral-400 text-center py-6">No analyses yet</p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {events.map((post) => {
            const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
            const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

            return (
              <motion.div
                key={post._id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
                style={{ backgroundColor: hovered === post._id ? 'rgba(0,0,0,0.04)' : 'transparent' }}
                onMouseEnter={() => setHovered(post._id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectPost(post._id)}
                whileHover={{ x: 1 }}
                transition={{ duration: 0.15 }}
              >
                {/* Thumbnail */}
                <div className="relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
                  {isGrad ? (
                    <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
                  ) : (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.handle}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>

                {/* Handle */}
                <p className="text-[11px] font-medium text-neutral-700 truncate flex-1 min-w-0">
                  {post.handle}
                </p>

                {/* Hook score pill */}
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  {post.aiAnalysis!.hookScore.toFixed(1)}
                </span>

                {/* Timestamp */}
                <p className="text-[10px] text-neutral-400 flex-shrink-0">
                  {timeAgo(post.aiAnalysis!.analyzedAt ?? 0)}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* See all link */}
      {events.length > 0 && (
        <button
          onClick={onViewAll}
          className="mt-3 text-[11px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors text-center"
        >
          See all →
        </button>
      )}
    </div>
  );
}
