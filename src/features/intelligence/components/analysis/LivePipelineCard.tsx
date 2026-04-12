'use client';

import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

interface Post {
  _id: string;
  handle: string;
  niche: string;
  thumbnailUrl: string;
  outlierRatio: number;
}

interface Props {
  post: Post;
  phase: 'downloading' | 'analysing';
}

export function LivePipelineCard({ post, phase }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -12, scale: 0.95, transition: { duration: 0.25 } }}
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
    >
      {/* Thumbnail */}
      <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: 100, overflow: 'hidden' }}>
        {post.thumbnailUrl.startsWith('linear-gradient') ? (
          <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.thumbnailUrl} alt={post.handle} className="w-full h-full object-cover opacity-60" />
        )}
        {/* Overlay shimmer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: phase === 'downloading' ? 'rgba(131,58,180,0.15)' : 'rgba(124,58,237,0.15)' }}
          >
            {phase === 'downloading' ? (
              <Loader2 size={14} className="animate-spin" style={{ color: '#833ab4' }} />
            ) : (
              <Sparkles size={14} style={{ color: '#7c3aed' }} />
            )}
          </div>
        </div>
      </div>

      {/* Progress bar + meta */}
      <div className="p-2 space-y-1.5">
        <p className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</p>
        <p className="text-[9px] text-neutral-400">{post.niche} · {post.outlierRatio.toFixed(1)}×</p>

        {/* Animated progress bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: phase === 'downloading' ? '#833ab4' : '#7c3aed' }}
            initial={{ width: '20%' }}
            animate={{ width: ['20%', '80%', '60%', '95%'] }}
            transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
          />
        </div>

        <p className="text-[9px] font-medium" style={{ color: phase === 'downloading' ? '#833ab4' : '#7c3aed' }}>
          {phase === 'downloading' ? 'Downloading...' : 'Analysing...'}
        </p>
      </div>
    </motion.div>
  );
}
