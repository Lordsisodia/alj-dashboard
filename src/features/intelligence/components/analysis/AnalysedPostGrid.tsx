'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { containerVariants, fadeUp } from '../../constants';
import { AnalysedPostCard } from './AnalysedPostCard';

interface Post {
  _id: string; handle: string; niche: string; contentType: string;
  thumbnailUrl: string; engagementRate: number; hookScore: number;
  hookLine: string; emotions: string[];
}

interface Props { posts: Post[]; onSelect: (id: string) => void; }

export function AnalysedPostGrid({ posts, onSelect }: Props) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 rounded-2xl gap-2 text-center"
        style={{ border: '1px dashed rgba(0,0,0,0.09)', backgroundColor: '#fafafa' }}>
        <CheckCircle size={18} className="text-neutral-300" />
        <p className="text-xs text-neutral-400">No analysed posts yet - run analysis on queued posts above</p>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-neutral-900">Analysed Posts</p>
        <p className="text-[10px] text-neutral-400">{posts.length} posts - sorted by hook score. Click any to open full analysis.</p>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-8 gap-3"
      >
        {posts.map((post, i) => (
          <AnalysedPostCard key={post._id} post={post} index={i} onClick={onSelect} />
        ))}
      </motion.div>
    </motion.div>
  );
}
