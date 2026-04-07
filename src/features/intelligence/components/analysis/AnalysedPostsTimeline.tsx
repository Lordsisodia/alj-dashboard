'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { timeAgo } from '../../utils';
import { NICHE_COLORS } from '../../constants';

interface Props {
  days: number;
  niche: string;
  onViewAll: () => void;
  onSelectPost: (postId: string) => void;
}

export function AnalysedPostsTimeline({ days, niche, onViewAll, onSelectPost }: Props) {
  const analysed = useQuery(api.intelligence.getAnalysedPosts, {
    days,
    niche: niche !== 'all' ? niche : undefined,
    limit: 100,
  });

  const posts = [...(analysed ?? [])]
    .filter(p => p.aiAnalysis?.analyzedAt)
    .sort((a, b) => (b.aiAnalysis!.analyzedAt ?? 0) - (a.aiAnalysis!.analyzedAt ?? 0))
    .slice(0, 10);

  const total = analysed?.length ?? 0;

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-[11px] text-neutral-400">No analysed posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {posts.map((post, i) => {
        const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
        const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

        return (
          <motion.div
            key={post._id}
            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            onClick={() => onSelectPost(post._id)}
            whileHover={{ x: 2, backgroundColor: 'rgba(0,0,0,0.04)' }}
          >
            {/* Thumbnail */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
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

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] font-semibold text-neutral-800 truncate">{post.handle}</p>
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white flex-shrink-0"
                  style={{ backgroundColor: nicheColor }}
                >
                  {post.niche}
                </span>
                <span className="text-[9px] text-neutral-400">{post.contentType}</span>
              </div>
              <p className="text-[9px] text-neutral-400 truncate italic">"{post.aiAnalysis!.hookLine}"</p>
            </div>

            {/* Right: score + time */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              >
                {post.aiAnalysis!.hookScore.toFixed(1)}
              </span>
              <p className="text-[9px] text-neutral-400">{timeAgo(post.aiAnalysis!.analyzedAt ?? 0)}</p>
            </div>
          </motion.div>
        );
      })}

      {total > 10 && (
        <button
          onClick={onViewAll}
          className="w-full text-center text-[11px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors py-1"
        >
          See all {total} posts →
        </button>
      )}
    </div>
  );
}
