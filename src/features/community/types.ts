export type Tab = 'dashboard' | 'vault' | 'approve' | 'saved';
export type ContentType = 'Reel' | 'Post' | 'Carousel';
export type Niche = 'fitness' | 'lifestyle' | 'fashion' | 'wellness';

export interface Creator {
  handle: string;
  initials: string;
  color: string;
  followers: number;
  engagementRate: number;
}

export interface Post {
  id: string;
  type: ContentType;
  niche: Niche;
  creator: Creator;
  gradient: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  saves: number;
  views: number;
  postedAt: string;
  isVideo: boolean;
  saved?: boolean;
  approved?: boolean;
  sentAt?: string;
}
