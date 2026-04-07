import type { Id } from '@/convex/_generated/dataModel';

export type Tab = 'dashboard' | 'qualify' | 'analysis' | 'insights';

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
  videoUrl?:       string;
  likes:           number;
  views:           number;
  saves:           number;
  engagementRate?: number;
  outlierRatio?:   number;
  postedAt:        number;
  saved:           boolean;
  contentType:     string;
  platform?:       string;
  caption?:        string;
  hashtags?:       string[];
};

// Full shape for the detail drawer
export interface DrawerPost {
  _id:             Id<'scrapedPosts'>;
  externalId:      string;
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
  outlierRatio?:   number;
  postedAt:        number;
  scrapedAt?:      number;
  saved:           boolean;
  aiAnalysis?: {
    transcript?:  string;
    hookScore:    number;
    hookLine:     string;
    emotions:     string[];
    breakdown:    string;
    suggestions:  string[];
    analyzedAt:   number;
  };
}

// Re-export domain-specific types
export * from './trendsTypes';
export * from './insightsTypes';
