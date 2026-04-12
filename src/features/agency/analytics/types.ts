export type Tab = 'overview' | 'growth' | 'revenue';
export type Period = '7d' | '30d' | '90d';
export type PostSortKey = 'likes' | 'comments' | 'saves' | 'reach';
export type ModelId = 'tyler' | 'ren' | 'ella' | 'sam';

export interface ModelProfile {
  id: ModelId;
  handle: string;
  displayName: string;
  niche: string;
  location: string;
  color: string;
  initials: string;
  revenue: number;
}

export interface AudienceLocation {
  city: string;
  flag: string;
  pct: number;
}

export interface AgeRange {
  range: string;
  pct: number;
}

export interface GenderSplit {
  male: number;
  female: number;
}

export interface ModelStats {
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  avgSaves: number;
  avgReach: number;
}

export interface ModelAnalyticsData {
  stats: ModelStats;
  followerGrowth: GrowthPoint[];
  engagementData: EngagementPoint[];
  topPosts: TopPost[];
  audienceLocations: AudienceLocation[];
  ageRanges: AgeRange[];
  genderSplit: GenderSplit;
  activeHours: string[];
}

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

export interface KpiData {
  totalRevenue: number;
  avgEngagement: number;
  activeModels: number;
  contentOutput: number;
  revenueChange: number;
  engagementChange: number;
  modelsChange: number;
  contentChange: number;
}

export interface RevenuePoint {
  label: string;
  value: number;
  model: string;
}
