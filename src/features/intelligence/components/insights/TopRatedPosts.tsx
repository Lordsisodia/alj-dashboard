'use client';

import { motion } from 'framer-motion';
import { containerVariants } from '../../constants';
import type { RatedPost } from '../../types';
import { RatedCard } from './RatedCard';

interface Props {
  posts: RatedPost[];
}

export function TopRatedPosts({ posts }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-neutral-900">Top rated posts</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">
          Highest scored by your team - saves count double. Hover to turn into a brief.
        </p>
      </div>

      {posts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-10 rounded-2xl gap-2"
          style={{ border: '1px dashed rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }}
        >
          <p className="text-xs text-neutral-400">No rated posts yet</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-6 gap-3"
        >
          {posts.map((post, i) => (
            <RatedCard key={post._id} post={post} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
