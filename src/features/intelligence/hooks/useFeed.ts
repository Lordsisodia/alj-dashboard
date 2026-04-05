'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { SortId, DrawerPost } from '../types';

interface Options {
  sortBy:       SortId;
  handle?:      string;
  niche?:       string;
  contentType?: string;
  limit?:       number;
}

export function useFeed({ sortBy, handle, niche, contentType, limit = 40 }: Options) {
  const seed  = useMutation(api.intelligence.seedIntelligenceFeed);

  const posts = useQuery(api.intelligence.getFeed, {
    sortBy,
    handle:      handle      || undefined,
    niche:       niche       && niche !== 'all'       ? niche       : undefined,
    contentType: contentType && contentType !== 'all' ? contentType : undefined,
    limit,
  });

  // Auto-seed on first load if DB is empty
  if (posts !== undefined && posts.length === 0) {
    seed().catch(() => {});
  }

  return {
    posts:     posts as unknown as DrawerPost[] | undefined,
    isLoading: posts === undefined,
    isEmpty:   posts !== undefined && posts.length === 0,
  };
}
