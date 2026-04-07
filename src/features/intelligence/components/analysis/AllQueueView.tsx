'use client';

import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { Sparkles } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { AnalysisBreadcrumb } from './AnalysisBreadcrumb';

interface Props {
  onBack: () => void;
  onAnalyse: (postId: string) => void;
}

export function AllQueueView({ onBack, onAnalyse }: Props) {
  const queue = useQuery(api.intelligence.getAnalysisQueue, { days: 90, limit: 100 });

  return (
    <div className="flex flex-col h-full">
      <AnalysisBreadcrumb current="Analysis Queue" onBack={onBack} />

      <div className="mb-4">
        <p className="text-xs font-semibold text-neutral-900">
          {queue?.length ?? 0} posts waiting for AI analysis
        </p>
        <p className="text-[10px] text-neutral-400">Ranked by outlier ratio</p>
      </div>

      {queue === undefined ? (
        <div className="grid grid-cols-8 gap-3">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="rounded-xl h-48 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
          ))}
        </div>
      ) : queue.length === 0 ? (
        <p className="text-[11px] text-neutral-400 text-center py-10">Queue is empty - all caught up!</p>
      ) : (
        <div className="grid grid-cols-8 gap-3 overflow-y-auto flex-1">
          {queue.map((post, i) => {
            const isGrad = post.thumbnailUrl.startsWith('linear-gradient');
            return (
              <motion.div
                key={post._id}
                className="rounded-xl overflow-hidden flex flex-col"
                style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
              >
                <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: 120, overflow: 'hidden' }}>
                  {isGrad ? (
                    <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnailUrl} alt={post.handle} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                  <div
                    className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                  >
                    {post.outlierRatio.toFixed(1)}×
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
          })}
        </div>
      )}
    </div>
  );
}
