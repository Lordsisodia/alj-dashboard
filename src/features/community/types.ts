export type Tab = 'feed' | 'trending' | 'saved';
export type ContentType = 'Reel' | 'Post' | 'Carousel';

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
}
