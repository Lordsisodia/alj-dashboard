'use client';

import { motion } from 'framer-motion';
import { Bookmark, Sparkles } from 'lucide-react';
import { NICHE_COLORS } from '../../constants';
import type { RatedPost } from '../../types';

interface Props {
  posts: RatedPost[];
}

export function WinningHooks({ posts }: Props) {
  const hooks = posts
    .filter(p => p.caption && p.caption.trim().length > 15 && p.saveCount > 0)
    .slice(0, 6);

  if (hooks.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={12} className="text-neutral-400" />
        <div>
          <p className="text-xs font-semibold text-neutral-900">Winning hooks</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Captions your team saves most - copy-worthy openings</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {hooks.map((post, i) => {
          const color = (NICHE_COLORS as Record<string, string>)[post.niche] ?? '#833ab4';
          const text  = post.caption!.trim();
          const hook  = text.slice(0, 130);

          return (
            <motion.div
              key={post._id}
              className="rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between"
              style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.07 }}
            >
              <p className="text-[11px] text-neutral-700 leading-relaxed line-clamp-3">
                &ldquo;{hook}{text.length > 130 ? '\u2026' : ''}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 truncate">@{post.handle}</span>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: color }}
                  >
                    {post.niche}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: '#ff0069' }}>
                    <Bookmark size={9} /> {post.saveCount}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
