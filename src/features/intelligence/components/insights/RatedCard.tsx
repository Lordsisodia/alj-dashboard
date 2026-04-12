'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ThumbsUp, Bookmark, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NICHE_COLORS } from '../../constants';
import type { RatedPost } from '../../types';

interface Props {
  post:  RatedPost;
  index: number;
}

function buildBriefParams(post: RatedPost): string {
  const params = new URLSearchParams({
    niche:  post.niche,
    format: post.contentType,
    from:   post.handle,
    ...(post.caption ? { hook: post.caption.slice(0, 80) } : {}),
  });
  return params.toString();
}

export function RatedCard({ post, index }: Props) {
  const router  = useRouter();
  const color   = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';
  const score   = post.upCount + post.saveCount * 2;
  const isGrad  = post.thumbnailUrl.startsWith('linear-gradient');

  return (
    <motion.div
      className="rounded-xl overflow-hidden group cursor-pointer"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 }}
    >
      <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: 160, overflow: 'hidden' }}>
        {isGrad
          ? <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
          : <Image src={post.thumbnailUrl} alt={post.handle} fill className="object-cover" referrerPolicy="no-referrer" />
        }

        <div
          className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-white text-[9px] font-bold"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          ★ {score}
        </div>

        <button
          onClick={() => router.push(`/content-gen/ideas?${buildBriefParams(post)}`)}
          className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Sparkles size={9} /> Turn into Brief <ArrowRight size={9} />
        </button>
      </div>

      <div className="p-2 space-y-1.5" style={{ backgroundColor: '#fff' }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</span>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white flex-shrink-0 ml-1"
            style={{ backgroundColor: color }}
          >
            {post.niche}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-600">
            <ThumbsUp size={9} /> {post.upCount}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: '#ff0069' }}>
            <Bookmark size={9} /> {post.saveCount}
          </span>
          <span className="text-[10px] text-neutral-300 ml-auto">
            {post.downCount > 0 ? `${post.downCount} skip` : ''}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
