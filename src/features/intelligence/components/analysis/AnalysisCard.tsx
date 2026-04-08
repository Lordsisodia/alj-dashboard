'use client';

import { motion } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';
import { GRAD } from '../../constants';

interface Post {
  _id: string;
  handle: string;
  niche: string;
  contentType: string;
  thumbnailUrl: string;
  engagementRate: number;
  outlierRatio: number;
}

interface Props {
  post: Post;
  onAnalyse: (post: Post) => void;
}

export function AnalysisCard({ post, onAnalyse }: Props) {
  const isGrad = post.thumbnailUrl.startsWith('linear-gradient');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
    >
      {/* Thumbnail */}
      <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: 100, overflow: 'hidden' }}>
        {isGrad ? (
          <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.thumbnailUrl} alt={post.handle} className="w-full h-full object-cover" />
        )}
        {/* Outlier badge */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white" style={{ background: GRAD }}>
          <Flame size={8} /> {post.outlierRatio.toFixed(1)}×
        </div>
      </div>

      {/* Meta + button */}
      <div className="p-2 space-y-2">
        <div>
          <p className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</p>
          <p className="text-[9px] text-neutral-400">{post.niche} · {post.contentType} · {(post.engagementRate * 100).toFixed(1)}% ER</p>
        </div>
        <button
          onClick={() => onAnalyse(post)}
          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: GRAD }}
        >
          <Sparkles size={9} /> Analyse
        </button>
      </div>
    </motion.div>
  );
}
