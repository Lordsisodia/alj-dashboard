'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants } from '../../constants';
import { useFeed } from '../../hooks/useFeed';
import { PostCard } from './PostCard';
import { PostListItem, PostListHeader } from './PostListItem';
import { SkeletonCard } from './SkeletonCard';
import type { DensityId, SortId, VisibilityState, DrawerPost } from '../../types';
import type { CreatorStats, NicheERMap } from '../../utils';

interface Props {
  sortBy:           SortId;
  visibility:       VisibilityState;
  viewMode:         'grid' | 'list';
  columns:          DensityId;
  handle?:          string;
  niche?:           string;
  contentType?:     string;
  onlyAnalyzed?:    boolean;
  onPostClick:      (index: number, posts: DrawerPost[]) => void;
  onAnalyzeClick?:  (index: number, posts: DrawerPost[]) => void;
  creatorStatsMap?:  Record<string, CreatorStats>;
  nicheERMap?:      NicheERMap;
}

export function FeedView({ sortBy, visibility, viewMode, columns, handle, niche, contentType, onlyAnalyzed, onPostClick, onAnalyzeClick, creatorStatsMap, nicheERMap }: Props) {
  const { posts, isLoading, isEmpty } = useFeed({ sortBy, handle, niche, contentType, onlyAnalyzed });

  if (isLoading) {
    return (
      <div className="gap-4" style={{ columns: viewMode === 'grid' ? columns : undefined }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4"><SkeletonCard tall={i % 3 === 0} /></div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    if (onlyAnalyzed) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Sparkles size={28} className="text-neutral-300" />
          <p className="text-sm font-medium text-neutral-500">No analyzed posts yet</p>
          <p className="text-xs text-neutral-400">Run analysis on qualified posts to populate this feed</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={28} className="animate-spin text-neutral-300" />
        <p className="text-sm text-neutral-400">Seeding feed...</p>
      </div>
    );
  }

  const drawerPosts = posts!;

  if (viewMode === 'list') {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        <PostListHeader />
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {drawerPosts.map((post, i) => (
            <PostListItem key={post._id} post={post as any} rowIdx={i} visibility={visibility} onPostClick={() => onPostClick(i, drawerPosts)} />
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="gap-4"
      style={{ columns: viewMode === 'grid' ? columns : undefined }}
    >
      {drawerPosts.map((post, i) => (
        <div key={post._id} className="break-inside-avoid mb-4">
          <PostCard
            post={post as any}
            visibility={visibility}
            columns={columns}
            onPostClick={() => onPostClick(i, drawerPosts)}
            onAnalyzeClick={onAnalyzeClick ? () => onAnalyzeClick(i, drawerPosts) : undefined}
            creatorStatsMap={creatorStatsMap}
            nicheERMap={nicheERMap}
          />
        </div>
      ))}
    </motion.div>
  );
}
