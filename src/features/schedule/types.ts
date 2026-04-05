export type Tab = 'calendar' | 'analytics';
export type ContentType = 'reel' | 'post' | 'story' | 'carousel' | 'video';
export type FilterType = 'All' | 'Reels' | 'Stories' | 'Posts' | 'Carousels' | 'Videos';

export interface ScheduledPost {
  day: number;
  type: ContentType;
  handle: string;
}

export interface TopPost {
  rank: number;
  gradientFrom: string;
  gradientTo: string;
  likes: number;
  comments: number;
  saves: number;
}
