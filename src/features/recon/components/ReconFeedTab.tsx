'use client';

import { FeedView } from '@/features/intelligence/components/feed/FeedView';
import type { DrawerPost } from '@/features/intelligence/types';
import type { SortId, VisibilityState } from '@/isso/ui/FeedControls';

interface ReconFeedTabProps {
  sortBy:      SortId;
  visibility:  VisibilityState;
  viewMode:    'grid' | 'list';
  onPostClick: (index: number, posts: DrawerPost[]) => void;
}

export function ReconFeedTab({ sortBy, visibility, viewMode, onPostClick }: ReconFeedTabProps) {
  return (
    <FeedView
      sortBy={sortBy}
      visibility={visibility}
      viewMode={viewMode}
      onPostClick={onPostClick}
    />
  );
}
