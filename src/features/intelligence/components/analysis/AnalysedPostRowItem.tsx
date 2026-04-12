'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { timeAgo } from '../../utils';
import { NICHE_COLORS } from '../../constants';

export type AnalysedPostRowItemProps = {
  _id: string;
  handle: string;
  niche: string;
  contentType: string;
  thumbnailUrl: string;
  aiAnalysis: { hookScore: number; hookLine: string; analyzedAt: number } | null;
};

interface Props {
  post: AnalysedPostRowItemProps;
  index?: number;
  variant?: 'posts' | 'activity';
  onClick: () => void;
}

export function AnalysedPostRowItem({ post, index = 0, variant = 'posts', onClick }: Props) {
  const [imgError, setImgError] = useState(false);
  const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
  const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';
  const isPostsVariant = variant === 'posts';

  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
      initial={isPostsVariant ? { opacity: 0, y: 4 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={isPostsVariant ? { delay: index * 0.03, duration: 0.2 } : undefined}
      whileHover={{ x: 2, backgroundColor: 'rgba(0,0,0,0.04)' }}
      onClick={onClick}
    >
      {isPostsVariant && <div className="w-4 h-4 rounded border border-neutral-200 flex-shrink-0" />}

      <div className="relative rounded-lg overflow-hidden flex-shrink-0"
        style={{ width: isPostsVariant ? 40 : 36, height: isPostsVariant ? 40 : 36 }}
      >
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
        {isPostsVariant ? 'hook ' : ''}{post.aiAnalysis!.hookScore.toFixed(1)}
      </span>

      <p className="text-[10px] text-neutral-400 flex-shrink-0">
        {timeAgo(post.aiAnalysis!.analyzedAt ?? 0)}
      </p>
    </motion.div>
  );
}
