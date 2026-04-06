'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { NICHE_COLORS } from '../../constants';
import { ScoreRing } from '../shared/ScoreRing';

const EMOTION_COLORS: Record<string, string> = {
  motivational: '#833ab4', energetic: '#ff0069', emotional: '#f97316',
  funny: '#eab308', sensual: '#ec4899', aspirational: '#06b6d4',
  relatable: '#22c55e', dramatic: '#ef4444',
};

interface Post {
  _id: string; handle: string; niche: string; contentType: string;
  thumbnailUrl: string; engagementRate: number; hookScore: number;
  hookLine: string; emotions: string[];
}

interface Props { post: Post; index: number; onClick: (id: string) => void; }

export function AnalysedPostCard({ post, index, onClick }: Props) {
  const isGrad    = post.thumbnailUrl.startsWith('linear-gradient');
  const topEmotion = post.emotions[0];
  const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

  return (
    <motion.div
      className="rounded-xl overflow-hidden cursor-pointer group"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={() => onClick(post._id)}
      whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
    >
      <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: 140, overflow: 'hidden' }}>
        {isGrad
          ? <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
          : <Image src={post.thumbnailUrl} alt={post.handle} fill className="object-cover" referrerPolicy="no-referrer" />
        }
        <div className="absolute top-2 right-2">
          <ScoreRing score={post.hookScore} size={36} />
        </div>
        {topEmotion && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-semibold text-white capitalize"
            style={{ backgroundColor: EMOTION_COLORS[topEmotion.toLowerCase()] ?? '#833ab4' }}>
            {topEmotion}
          </div>
        )}
      </div>
      <div className="p-2 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</p>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white flex-shrink-0 ml-1"
            style={{ backgroundColor: nicheColor }}>{post.niche}</span>
        </div>
        <p className="text-[9px] text-neutral-400 line-clamp-2 italic">"{post.hookLine}"</p>
      </div>
    </motion.div>
  );
}
