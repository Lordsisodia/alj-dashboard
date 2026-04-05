// Recon types
export type ReconPageProps = Record<string, never>;

export type Tab = 'log' | 'creators' | 'feed';

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
}

export interface DailyVolume { label: string; total: number; }
