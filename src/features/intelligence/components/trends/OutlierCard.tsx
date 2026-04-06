'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Flame, Sparkles, ArrowRight, Eye, Heart } from 'lucide-react';
import { NICHE_COLORS } from '../../constants';
import { fmtNum } from '../../utils';
import type { OutlierPost } from '../../types';

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';
const FORMAT_LABELS: Record<string, string> = { reel: 'Reel', post: 'Post', carousel: 'Carousel', story: 'Story' };

function briefParams(post: OutlierPost) {
  return new URLSearchParams({ niche: post.niche, format: post.contentType, hook: post.hook, from: post.handle });
}

function Thumbnail({ post, rank, hovered, onBrief }: { post: OutlierPost; rank: number; hovered: boolean; onBrief: () => void }) {
  const bg = post.thumbnailUrl?.startsWith('linear') ? post.thumbnailUrl : '#f5f5f4';
  return (
    <div className="relative w-full h-32" style={{ background: bg }}>
      <div className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff' }}>
        {rank}
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white" style={{ background: GRAD }}>
        <Flame size={9} />{post.outlierRatio.toFixed(1)}× baseline
      </div>
      <motion.div className="absolute inset-0 flex items-end p-2" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.15 }}>
        <button onClick={onBrief} className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[10px] font-semibold text-white" style={{ background: GRAD }}>
          <Sparkles size={10} />Turn into Brief<ArrowRight size={10} />
        </button>
      </motion.div>
    </div>
  );
}

function CardBody({ post, nicheColor }: { post: OutlierPost; nicheColor: string }) {
  return (
    <div className="px-3 py-2.5 space-y-2">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-semibold text-neutral-700 truncate">{post.handle}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: nicheColor }}>{post.niche}</span>
          <span className="text-[9px] text-neutral-400">{FORMAT_LABELS[post.contentType] ?? post.contentType}</span>
        </div>
      </div>
      <p className="text-[11px] text-neutral-600 leading-snug line-clamp-2 min-h-[2.5rem]">{post.hook || '-'}</p>
      <div className="flex items-center justify-between pt-1.5" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-1"><Eye size={10} className="text-neutral-300" /><span className="text-[10px] text-neutral-500">{fmtNum(post.views)}</span></div>
        <div className="flex items-center gap-1"><Heart size={10} className="text-neutral-300" /><span className="text-[10px] text-neutral-500">{fmtNum(post.likes)}</span></div>
        <span className="text-[10px] font-bold" style={{ color: nicheColor }}>{(post.engagementRate * 100).toFixed(1)}% ER</span>
      </div>
    </div>
  );
}

export function OutlierCard({ post, rank }: { post: OutlierPost; rank: number }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';

  return (
    <motion.div
      className="flex-shrink-0 w-52 rounded-2xl overflow-hidden cursor-default"
      style={{ border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#fff' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
    >
      <Thumbnail post={post} rank={rank} hovered={hovered} onBrief={() => router.push(`/isso/ideas?${briefParams(post)}`)} />
      <CardBody post={post} nicheColor={nicheColor} />
    </motion.div>
  );
}
