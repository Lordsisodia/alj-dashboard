import type { AgentTask, Report, FeatureRequest, AgentType, ReportCategory, RequestStatus, Priority } from './types';

export const AGENT_TASKS: AgentTask[] = [
  {
    id: '1',
    agentName: 'Recon Scraper #1',
    type: 'Scraper',
    description: 'Scraping competitor @fitness_king  -  found 23 new posts',
    status: 'running',
    startedAt: 'Today, 3:40 PM',
    duration: '2m 14s',
    progress: 68,
    outputPreview: '23 posts found, 18 processed, 5 queued...',
  },
  {
    id: '2',
    agentName: 'Intelligence Indexer',
    type: 'Analyst',
    description: 'Indexing 412 new reels from community feed  -  niche tagging in progress',
    status: 'running',
    startedAt: 'Today, 3:35 PM',
    duration: '7m 02s',
    progress: 41,
    outputPreview: 'Tagged 169/412 reels. Dominant niches: Fitness (34%), GFE (28%)...',
  },
  {
    id: '3',
    agentName: 'Post Scheduler Bot',
    type: 'Scheduler',
    description: 'Scheduled 8 posts for @abg.ricebunny across the next 7 days',
    status: 'completed',
    startedAt: 'Today, 2:15 PM',
    duration: '0m 48s',
    progress: 100,
    outputPreview: '8 posts queued. Next: Apr 7 at 6:00 PM.',
  },
  {
    id: '4',
    agentName: 'Recon Scraper #2',
    type: 'Scraper',
    description: 'Attempted scrape of @glam.gfe  -  rate limit reached, retrying in 30 min',
    status: 'failed',
    startedAt: 'Today, 1:30 PM',
    duration: '0m 12s',
    progress: 0,
    outputPreview: 'Error: 429 Too Many Requests. Retry scheduled 2:00 PM.',
  },
  {
    id: '5',
    agentName: 'Weekly Report Agent',
    type: 'Analyst',
    description: 'Generated weekly intelligence report  -  14 insights extracted',
    status: 'completed',
    startedAt: 'Today, 9:00 AM',
    duration: '3m 21s',
    progress: 100,
    outputPreview: 'Report saved. Top insight: GFE engagement up 12% WoW.',
  },
];

export const REPORTS: Report[] = [
  {
    id: '1',
    title: 'Weekly Intelligence Report  -  Apr 6, 2026',
    insights: [
      'GFE content engagement up 12% week-over-week across tracked accounts',
      'Short-form reels under 30s outperforming 60s+ clips by 2.4x in saves',
      '@fitness_king posted 9 reels this week  -  highest cadence of tracked competitors',
      'Trending hook pattern: "Day in my life" style intros driving 3.1x saves vs. direct promo',
    ],
    generatedBy: 'Intelligence Indexer',
    generatedAt: Date.now() - 2 * 60 * 60 * 1000,
    category: 'Intelligence',
  },
  {
    id: '2',
    title: 'Competitor Recon Digest  -  Apr 3, 2026',
    insights: [
      '@gfe_luxe has the highest average engagement rate at 7.8%  -  up from 6.2% last month',
      'Competitors averaging 8.4 posts/week; our models currently at 6.2  -  gap to close',
      '@lifestyle.nova gained 22K followers this week, likely driven by a viral reel',
      'Paused competitors show 31% lower follower growth vs. active scraped accounts',
    ],
    generatedBy: 'Recon Scraper #1',
    generatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    category: 'Recon',
  },
  {
    id: '3',
    title: 'Performance Snapshot  -  Mar 31, 2026',
    insights: [
      'Top performing creator this week: @ellamira  -  19.8K likes on single post',
      'Schedule adherence at 94%  -  1 post missed due to approval delay',
      'Average time-to-post after approval: 4.2 hours (target: under 2 hours)',
    ],
    generatedBy: 'Weekly Report Agent',
    generatedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    category: 'Performance',
  },
];

export const FEATURE_REQUESTS: FeatureRequest[] = [
  {
    id: '1',
    title: 'Auto-caption generation for Reels',
    description: 'Automatically generate captions with relevant hashtags when scheduling a new reel, based on niche and content tags.',
    requestedBy: 'Shaan S.',
    date: 'Apr 4, 2026',
    status: 'In Progress',
    eta: 'Apr 10, 2026',
    priority: 'High',
  },
  {
    id: '2',
    title: 'Competitor content alerts',
    description: 'Push notification when a tracked competitor posts content that exceeds a set engagement threshold.',
    requestedBy: 'Shaan S.',
    date: 'Apr 2, 2026',
    status: 'Queued',
    eta: '72hr SLA',
    priority: 'Medium',
  },
  {
    id: '3',
    title: 'Board sharing via link',
    description: 'Allow boards in Intelligence to be shared externally via a read-only link for client presentations.',
    requestedBy: 'Shaan S.',
    date: 'Mar 30, 2026',
    status: 'Delivered',
    eta: 'Shipped',
    priority: 'Low',
  },
  {
    id: '4',
    title: 'CSV export for recon data',
    description: 'Export competitor stats (followers, engagement rate, posts/week) as a downloadable CSV for reporting.',
    requestedBy: 'Shaan S.',
    date: 'Mar 28, 2026',
    status: 'Queued',
    eta: '72hr SLA',
    priority: 'Low',
  },
];

export const TYPE_COLOR: Record<AgentType, string> = {
  Scraper: '#4a9eff',
  Scheduler: '#833ab4',
  Analyst: '#ff0069',
};

export const REPORT_CAT_COLOR: Record<ReportCategory, string> = {
  Intelligence: '#ff0069',
  Recon: '#4a9eff',
  Performance: '#78c257',
};

export const PRIORITY_CONFIG: Record<Priority, { bg: string; color: string }> = {
  Low:    { bg: 'rgba(120,194,87,0.12)',  color: '#4a8a2d' },
  Medium: { bg: 'rgba(251,191,36,0.12)', color: '#92640a' },
  High:   { bg: 'rgba(255,0,105,0.12)',  color: '#c0005a' },
};

export const REQUEST_STATUS_CONFIG: Record<RequestStatus, { bg: string; color: string }> = {
  Queued:        { bg: 'rgba(251,191,36,0.12)', color: '#92640a' },
  'In Progress': { bg: 'rgba(74,158,255,0.12)', color: '#1d6eb5' },
  Delivered:     { bg: 'rgba(120,194,87,0.12)', color: '#4a8a2d' },
};

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};
