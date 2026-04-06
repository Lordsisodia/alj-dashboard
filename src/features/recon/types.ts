// Recon types
export type ReconPageProps = Record<string, never>;

export type Tab = 'log' | 'discovery' | 'creators' | 'feed';

export type CandidateStatus = 'pending' | 'approved' | 'rejected';

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
  discoveredAt: string;
  status: CandidateStatus;
  sampleGradients: [string, string][]; // 6 placeholder post colours
}

export interface DrawerState { posts: import('@/features/intelligence/types').DrawerPost[]; index: number; }

export type CompetitorStatus = 'active' | 'paused';
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
}

export interface DailyVolume { label: string; total: number; }
