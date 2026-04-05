'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants } from '../../constants';
import { useFeed } from '../../hooks/useFeed';
import { PostCard } from './PostCard';
import { PostListItem } from './PostListItem';
import { SkeletonCard } from './SkeletonCard';
import type { SortId, VisibilityState, DrawerPost } from '../../types';

interface Props {
  sortBy:       SortId;
  visibility:   VisibilityState;
  viewMode:     'grid' | 'list';
  handle?:      string;
  niche?:       string;
  contentType?: string;
  onPostClick:  (index: number, posts: DrawerPost[]) => void;
}

export function FeedView({ sortBy, visibility, viewMode, handle, niche, contentType, onPostClick }: Props) {
  const { posts, isLoading, isEmpty } = useFeed({ sortBy, handle, niche, contentType });

  if (isLoading) {
    return (
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4"><SkeletonCard tall={i % 3 === 0} /></div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={28} className="animate-spin text-neutral-300" />
        <p className="text-sm text-neutral-400">Seeding feed…</p>
      </div>
    );
  }

  const drawerPosts = posts!;

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className="flex flex-col rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(0,0,0,0.07)' }}
      >
        {drawerPosts.map((post, i) => (
          <PostListItem key={post._id} post={post as any} visibility={visibility} onPostClick={() => onPostClick(i, drawerPosts)} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="columns-2 sm:columns-3 lg:columns-4 gap-4">
      {drawerPosts.map((post, i) => (
        <div key={post._id} className="break-inside-avoid mb-4">
          <PostCard post={post as any} visibility={visibility} onPostClick={() => onPostClick(i, drawerPosts)} />
        </div>
      ))}
    </motion.div>
  );
}
