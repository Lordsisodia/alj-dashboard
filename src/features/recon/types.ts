// Recon types
export type ReconPageProps = Record<string, never>;

export type Tab = 'log' | 'discovery' | 'creators' | 'qualify';

export type CandidateStatus = 'pending' | 'approved' | 'rejected';

export type ColumnId = 'unapproved' | 'approved' | 'scraped';

export interface Candidate {
  id: number;
  handle: string;
  displayName: string;
  niche: string;
  nicheColor: string;
  avatarColor: string;
  initials: string;
  followers: string;        // display string e.g. "84K"
  followersRaw: number;     // numeric for ratio calc
  avgViews: number;         // avg views per post (numeric)
  outlierRatio: number;     // avgViews / followersRaw
  engagementRate: string;
  postsPerWeek: number;
  suggestedBy: string | null; // null = manually added
  source: 'pre_approved' | 'scraper' | 'manual';
  discoveredAt: string;
  status: CandidateStatus;
  sampleGradients: [string, string][]; // 6 placeholder post colours
  bio?: string;
}

export interface DrawerState { posts: import('@/features/intelligence/types').DrawerPost[]; index: number; initialTab?: 'details' | 'ai' | 'transcript'; }

export type CompetitorStatus = 'active' | 'paused' | 'failed';
export type JobStatus = 'idle' | 'running' | 'failed';

export interface Competitor {
  id: number;
  handle: string;
  displayName: string;
  niche: string;
  nicheColor: string;
  avatarColor: string;
  initials: string;
  followers: string;
  engagementRate: string;
  postsPerWeek: number;
  lastScraped: string;
  status: CompetitorStatus;
  trend: number[];
  postsToday: number;
  jobStatus: JobStatus;
  score: number;
  favorited: boolean;
  // enrichable fields
  verified?:              boolean;
  bio?:                   string;
  profilePicUrl?:         string;
  followsCount?:          number;
  postsCount?:            number;
  externalUrl?:           string;
  isBusinessAccount?:     boolean;
  isProfessionalAccount?: boolean;
  businessCategoryName?:  string;
  businessEmail?:         string;
  isPrivate?:             boolean;
  igtvVideoCount?:        number;
  instagramId?:           string;
  // AI verdict — joined from creatorCandidates
  aiScore?:              number;
  aiVerdict?:            'HIRE' | 'WATCH' | 'PASS';
  aiReason?:             string;
  // creatorCandidates fields not in trackedAccounts
  highlightReelCount?:   number;
  avgViews?:             number;
  outlierRatio?:         number;
  source?:               'pre_approved' | 'scraper' | 'manual';
  // posts-per-week from scrapedPosts aggregation
  postsThisWeek?:        number;
}

export interface DailyVolume { label: string; total: number; }

// Convex candidate document — returned from api.candidates.list
export type ConvexCandidate = {
  _id: string;
  handle: string;
  displayName: string;
  niche?: string;
  followerCount?: number;
  followsCount?: number;
  postsCount?: number;
  avgViews?: number;
  outlierRatio?: number;
  avgEngagementRate?: number;
  postsPerWeek?: number;
  suggestedBy?: string;
  addedAt: number;
  enrichedAt?: number;
  status: 'pending' | 'approved' | 'rejected';
  source: 'pre_approved' | 'scraper' | 'manual';
  aiScore?: number;
  aiVerdict?: 'HIRE' | 'WATCH' | 'PASS';
  aiReason?: string;
  enrichStatus?: string;
  avatarUrl?: string;
  bio?: string;
  verified?: boolean;
  isPrivate?: boolean;
  isBusinessAccount?: boolean;
  externalUrl?: string;
  igtvVideoCount?: number;
  instagramId?: string;
  highlightReelCount?: number;
};

// MappedCandidate = Candidate shape + Convex _id + enrich fields
export type MappedCandidate = Candidate & {
  _convexId: string;
  suggestedBy?: string | null;
  avatarUrl?: string;
  enrichStatus?: string;
  enrichedAt?: number;
  followsCount?: number;
  postsCount?: number;
  verified?: boolean;
  isPrivate?: boolean;
  isBusinessAccount?: boolean;
  externalUrl?: string;
  igtvVideoCount?: number;
  instagramId?: string;
  highlightReelCount?: number;
};
