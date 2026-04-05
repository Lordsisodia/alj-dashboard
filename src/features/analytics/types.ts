export type Tab = 'overview' | 'growth' | 'revenue';

export type PostSortKey = 'likes' | 'comments' | 'saves' | 'reach';

export interface GrowthPoint {
  label: string;
  value: number;
}

export interface EngagementPoint {
  week: string;
  rate: number;
}

export interface TopPost {
  id: number;
  gradientFrom: string;
  gradientTo: string;
  handle: string;
  handleColor: string;
  caption: string;
  likes: number;
  comments: number;
  saves: number;
  reach: number;
  posted: string;
  likesChange?: number;
}
