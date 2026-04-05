import type { Id } from '../../../convex/_generated/dataModel';

export type Tab = 'feed' | 'brands' | 'experts';

export type SortId =
  | 'newest'
  | 'oldest'
  | 'most-likes'
  | 'most-views'
  | 'most-saves'
  | 'top-engagement'
  | 'trending';

export interface VisibilityState {
  brandDetails: boolean;
  likeCount:    boolean;
  viewCount:    boolean;
  saveCount:    boolean;
}

export const DEFAULT_VISIBILITY: VisibilityState = {
  brandDetails: true,
  likeCount:    true,
  viewCount:    true,
  saveCount:    true,
};

// Minimal shape for feed cards (fast, denormalised)
export type Post = {
  _id:             Id<'scrapedPosts'>;
  externalId:      string;
  handle:          string;
  niche:           string;
  thumbnailUrl:    string;
  likes:           number;
  views:           number;
  saves:           number;
  engagementRate?: number;
  postedAt:        number;
  saved:           boolean;
  contentType:     string;
};

// Full shape for the detail drawer
export interface DrawerPost {
  _id:             Id<'scrapedPosts'>;
  externalId:      string;   // Instagram shortcode — used for embed URL
  handle:          string;
  platform:        string;
  niche:           string;
  contentType:     string;
  thumbnailUrl:    string;
  videoUrl?:       string;
  caption?:        string;
  hashtags?:       string[];
  likes:           number;
  views:           number;
  saves:           number;
  engagementRate?: number;
  postedAt:        number;
  scrapedAt?:      number;
  saved:           boolean;
}

export interface Board {
  id:          number;
  name:        string;
  count:       number;
  lastUpdated: string;
  colors:      string[];
}
