'use client';

import { motion } from 'framer-motion';
import { PostCard } from '../feed/PostCard';
import { NICHE_CONFIG } from '../../../community/data';
import type { Niche, Post } from '../../../community/types';

export function NicheGroup({ niche, posts }: { niche: Niche; posts: Post[] }) {
  const cfg = NICHE_CONFIG[niche];
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px]">📌</span>
        <span className="text-xs font-bold" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {posts.length}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
