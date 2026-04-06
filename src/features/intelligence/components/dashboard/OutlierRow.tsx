'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Flame, ArrowRight } from 'lucide-react';
import { NICHE_COLORS } from '../../constants';
import type { OutlierPost } from '../../types';

interface Props { posts: OutlierPost[]; }

function OutlierCard({ post, index }: { post: OutlierPost; index: number }) {
  const router     = useRouter();
  const isGrad     = post.thumbnailUrl.startsWith('linear-gradient');
  const nicheColor = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';

  return (
    <motion.div
      className="rounded-xl overflow-hidden flex-shrink-0 group cursor-pointer"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff', width: 148 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ y: -3, boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}
    >
      {/* Thumbnail - 9:16 */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: 200 }}>
        {isGrad
          ? <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
          : <Image src={post.thumbnailUrl} alt={post.handle} fill className="object-cover" referrerPolicy="no-referrer" />
        }

        {/* Outlier badge */}
        <div className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
          <Flame size={8} /> {post.outlierRatio.toFixed(1)}×
        </div>

        {/* Brief CTA on hover */}
        <button
          onClick={() => router.push(`/isso/ideas?${new URLSearchParams({ niche: post.niche, format: post.contentType, hook: post.hook.slice(0, 80) }).toString()}`)}
          className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          Brief <ArrowRight size={8} />
        </button>
      </div>

      {/* Meta */}
      <div className="px-2.5 py-2 space-y-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</p>
          <span className="text-[8px] font-semibold px-1 py-0.5 rounded text-white flex-shrink-0"
            style={{ backgroundColor: nicheColor }}>{post.niche}</span>
        </div>
        <p className="text-[9px] text-neutral-400 line-clamp-1 italic">"{post.hook.slice(0, 50)}{post.hook.length > 50 ? '...' : ''}"</p>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-semibold text-neutral-600">{(post.engagementRate * 100).toFixed(1)}% ER</span>
          {post.views > 0 && <span className="text-[9px] text-neutral-400">{post.views >= 1000 ? `${(post.views / 1000).toFixed(0)}k` : post.views} views</span>}
        </div>
      </div>
    </motion.div>
  );
}

export function OutlierRow({ posts }: Props) {
  const visible = posts.slice(0, 7);

  if (visible.length === 0) {
    return (
      <div className="flex gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-xl flex-shrink-0 animate-pulse" style={{ width: 148, height: 260, backgroundColor: 'rgba(0,0,0,0.05)' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {visible.map((post, i) => (
        <OutlierCard key={post._id} post={post} index={i} />
      ))}
    </div>
  );
}
