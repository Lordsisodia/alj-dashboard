'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { Sparkles, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { fadeUp } from '../../constants';

interface Props { onAnalyse: (postId: string) => void; }

function QueueCard({ post, index, onAnalyse }: {
  post: { _id: string; handle: string; niche: string; contentType: string; thumbnailUrl: string; engagementRate: number; outlierRatio: number };
  index: number;
  onAnalyse: (id: string) => void;
}) {
  const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
  return (
    <motion.div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: 120, overflow: 'hidden' }}>
        {isGrad
          ? <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
          : <Image src={post.thumbnailUrl} alt={post.handle} fill className="object-cover" referrerPolicy="no-referrer" />
        }
        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
          <Flame size={8} /> {post.outlierRatio.toFixed(1)}×
        </div>
      </div>
      <div className="p-2 space-y-2">
        <div>
          <p className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</p>
          <p className="text-[9px] text-neutral-400">{post.niche} · {post.contentType} · {(post.engagementRate * 100).toFixed(1)}% ER</p>
        </div>
        <button
          onClick={() => onAnalyse(post._id)}
          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Sparkles size={9} /> Analyse
        </button>
      </div>
    </motion.div>
  );
}

export function AnalysisQueue({ onAnalyse }: Props) {
  const queue = useQuery(api.intelligence.getAnalysisQueue, { days: 90 });

  if (queue === undefined) {
    return (
      <div className="grid grid-cols-8 gap-3">
        {[...Array(8)].map((_, i) => <div key={i} className="rounded-xl h-48 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />)}
      </div>
    );
  }

  if (queue.length === 0) return null;

  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-neutral-900">Analysis Queue</p>
          <p className="text-[10px] text-neutral-400">{queue.length} qualified posts waiting for AI analysis - ranked by outlier ratio</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,0,105,0.08)', color: '#ff0069' }}>
          {queue.length} pending
        </span>
      </div>
      <div className="grid grid-cols-8 gap-3">
        {queue.slice(0, 8).map((post, i) => (
          <QueueCard key={post._id} post={post} index={i} onAnalyse={onAnalyse} />
        ))}
      </div>
    </motion.div>
  );
}
