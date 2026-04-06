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

  const rawPosts = useQuery(api.intelligence.getFeed, {
    sortBy,
    niche:       niche       && niche !== 'all'       ? niche       : undefined,
    contentType: contentType && contentType !== 'all' ? contentType : undefined,
    limit,
  });

  const posts = rawPosts && handle
    ? (rawPosts as unknown as Array<{ handle?: string } & object>).filter(p => p.handle === handle)
    : rawPosts;

  // Auto-seed on first load if DB is empty
  if (rawPosts !== undefined && rawPosts.length === 0) {
    seed().catch(() => {});
  }

  return {
    posts:     posts as unknown as DrawerPost[] | undefined,
    isLoading: posts === undefined,
    isEmpty:   posts !== undefined && posts.length === 0,
  };
}
