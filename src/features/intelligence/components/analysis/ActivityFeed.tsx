'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '../../../../../convex/_generated/api';
import { timeAgo } from '../../utils';
import { NICHE_COLORS } from '../../constants';

interface Props {
  onViewAll: () => void;
  onSelectPost: (postId: string) => void;
}

function ActivityRow({ post, onSelect }: {
  post: { _id: string; handle: string; niche: string; thumbnailUrl: string; aiAnalysis: { hookScore: number; analyzedAt: number } | null };
  onSelect: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
  const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

  return (
    <motion.div
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer"
      whileHover={{ x: 1 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(post._id)}
    >
      {/* Thumbnail */}
      <div className="relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
        {isGrad || imgError ? (
          <div className="w-full h-full" style={{ background: isGrad ? post.thumbnailUrl : '#833ab4' }} />
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

      <p className="text-[11px] font-medium text-neutral-700 truncate flex-1 min-w-0">
        {post.handle}
      </p>

      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
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

export function ActivityFeed({ onViewAll, onSelectPost }: Props) {
  const analysed = useQuery(api.intelligence.getAnalysedPosts, { days: 90, limit: 100 });

  const events = [...(analysed ?? [])]
    .filter(p => p.aiAnalysis?.analyzedAt)
    .sort((a, b) => (b.aiAnalysis!.analyzedAt ?? 0) - (a.aiAnalysis!.analyzedAt ?? 0))
    .slice(0, 15);

  return (
    <div className="flex flex-col h-full">
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Recent analysis
      </p>

      {analysed === undefined ? (
        <div className="flex-1 space-y-1.5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5">
              <div className="w-6 h-6 rounded-md animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
              <div className="h-3 flex-1 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
              <div className="w-8 h-3 rounded-full animate-pulse" style={{ background: 'rgba(0,0,0,0.06)' }} />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,0,105,0.08)' }}>
            <span className="text-sm" style={{ color: '#ff0069' }}>📭</span>
          </div>
          <p className="text-[11px] text-neutral-400">No analyses yet</p>
          <p className="text-[10px] text-neutral-400 text-center">Run analysis on queued posts<br />to see activity here</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {events.map((post) => (
            <ActivityRow key={post._id} post={post} onSelect={onSelectPost} />
          ))}
        </div>
      )}

      {analysed !== undefined && events.length > 0 && (
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
