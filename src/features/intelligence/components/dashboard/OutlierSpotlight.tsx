'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Flame, ArrowRight } from 'lucide-react';
import { NICHE_COLORS } from '../../constants';
import type { OutlierPost } from '../../types';

interface Props { post: OutlierPost | undefined; }

export function OutlierSpotlight({ post }: Props) {
  const router = useRouter();

  if (!post) {
    return <div className="rounded-xl h-28 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />;
  }

  const isGrad     = post.thumbnailUrl.startsWith('linear-gradient');
  const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

  return (
    <motion.div
      className="rounded-xl overflow-hidden flex gap-4 p-4"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative rounded-xl overflow-hidden flex-shrink-0"
        style={{ width: 64, height: 96 }}>
        {isGrad
          ? <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
          : <Image src={post.thumbnailUrl} alt={post.handle} fill className="object-cover" referrerPolicy="no-referrer" />
        }
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-white"
              style={{ backgroundColor: nicheColor }}>{post.niche}</span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
              <Flame size={10} /> {post.outlierRatio.toFixed(1)}× baseline
            </span>
          </div>
          <p className="text-xs font-semibold text-neutral-800">{post.handle}</p>
          <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed italic">
            "{post.hook}"
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-400">{(post.engagementRate * 100).toFixed(1)}% ER</span>
          <span className="text-[10px] text-neutral-400">{post.views.toLocaleString()} views</span>
          <button
            onClick={() => router.push(`/isso/ideas?${new URLSearchParams({ niche: post.niche, format: post.contentType, hook: post.hook.slice(0, 80) }).toString()}`)}
            className="ml-auto flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-lg text-white"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            Brief <ArrowRight size={8} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
