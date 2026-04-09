import type { Creator, Post, ContentType, Niche } from './types';

export const CREATORS: Creator[] = [
  { handle: '@abg.ricebunny', initials: 'AB', color: '#2563eb',  followers: 245000, engagementRate: 4.2 },
  { handle: '@onlytylerrex',  initials: 'OT', color: '#fcaf45',  followers: 189000, engagementRate: 3.8 },
  { handle: '@rhinxrenx',     initials: 'RR', color: '#2563eb',  followers: 312000, engagementRate: 5.1 },
  { handle: '@ellamira',      initials: 'EM', color: '#78c257',  followers: 97000,  engagementRate: 6.3 },
];

export const LEADERBOARD_ENTRIES = [
  { rank: 1, ...CREATORS[2] },
  { rank: 2, ...CREATORS[0] },
  { rank: 3, ...CREATORS[1] },
  { rank: 4, ...CREATORS[3] },
];

export const GRADIENTS: Record<string, string> = {
  pink:   'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3b82f6 100%)',
  purple: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  amber:  'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  green:  'linear-gradient(135deg, #78c257 0%, #00f4e2 100%)',
  indigo: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  teal:   'linear-gradient(135deg, #00f4e2 0%, #2563eb 100%)',
};

export const POSTS: Post[] = [
  {
    id: '1',
    type: 'Reel',
    niche: 'fitness',
    creator: CREATORS[0],
    gradient: GRADIENTS.pink,
    caption: 'Monday grind starts early. No excuses, just results. 5am club is real.',
    hashtags: ['#gymmotivation', '#gaybear', '#fitness'],
    likes: 8412, comments: 234, saves: 180, views: 89400,
    postedAt: '2h ago',
    isVideo: true,
    approved: true,
  },
  {
    id: '2',
    type: 'Post',
    niche: 'lifestyle',
    creator: CREATORS[2],
    gradient: GRADIENTS.purple,
    caption: 'Vibes only. That aesthetic everyone keeps trying to copy.',
    hashtags: ['#lifestyle', '#aesthetic'],
    likes: 6200, comments: 89, saves: 214, views: 67200,
    postedAt: '4h ago',
    isVideo: false,
    approved: true,
  },
  {
    id: '3',
    type: 'Carousel',
    niche: 'fashion',
    creator: CREATORS[1],
    gradient: GRADIENTS.amber,
    caption: 'OOTD but make it intentional. Every detail matters.',
    hashtags: ['#ootd', '#fashion', '#style'],
    likes: 4120, comments: 56, saves: 98, views: 34100,
    postedAt: '6h ago',
    isVideo: false,
  },
  {
    id: '4',
    type: 'Reel',
    niche: 'fitness',
    creator: CREATORS[3],
    gradient: GRADIENTS.green,
    caption: 'Transformation Tuesday. 12 weeks in. Same mirror, different energy.',
    hashtags: ['#transformation', '#fitness', '#progress'],
    likes: 7100, comments: 198, saves: 241, views: 76300,
    postedAt: '8h ago',
    isVideo: true,
    approved: true,
  },
  {
    id: '5',
    type: 'Post',
    niche: 'fitness',
    creator: CREATORS[0],
    gradient: GRADIENTS.indigo,
    caption: 'Post-workout glow. Consistency is the only hack you need.',
    hashtags: ['#postworkout', '#gymlife'],
    likes: 5500, comments: 112, saves: 132, views: 55000,
    postedAt: '12h ago',
    isVideo: false,
  },
  {
    id: '6',
    type: 'Reel',
    niche: 'fitness',
    creator: CREATORS[2],
    gradient: GRADIENTS.teal,
    caption: 'Pull-up progression: Week 1 to Week 12. No shortcuts.',
    hashtags: ['#calisthenics', '#progress', '#pullup'],
    likes: 12300, comments: 312, saves: 480, views: 145000,
    postedAt: '1d ago',
    isVideo: true,
    approved: true,
  },
  {
    id: '7',
    type: 'Carousel',
    niche: 'wellness',
    creator: CREATORS[1],
    gradient: GRADIENTS.amber,
    caption: '5 ways to stay consistent with your fitness goals.',
    hashtags: ['#fitnessgoals', '#tips', '#consistency'],
    likes: 3870, comments: 67, saves: 312, views: 28900,
    postedAt: '1d ago',
    isVideo: false,
    saved: true,
  },
  {
    id: '8',
    type: 'Reel',
    niche: 'lifestyle',
    creator: CREATORS[3],
    gradient: GRADIENTS.green,
    caption: 'Golden hour at the rooftop. When the city lights up.',
    hashtags: ['#goldenhour', '#lifestyle', '#rooftop'],
    likes: 9800, comments: 145, saves: 203, views: 91200,
    postedAt: '2d ago',
    isVideo: true,
    saved: true,
  },
  {
    id: '9',
    type: 'Post',
    niche: 'wellness',
    creator: CREATORS[2],
    gradient: GRADIENTS.purple,
    caption: 'Rest day = recovery day. This is where the growth actually happens.',
    hashtags: ['#restday', '#recovery', '#mobility'],
    likes: 4200, comments: 78, saves: 156, views: 38500,
    postedAt: '2d ago',
    isVideo: false,
  },
  {
    id: '10',
    type: 'Carousel',
    niche: 'fashion',
    creator: CREATORS[0],
    gradient: GRADIENTS.pink,
    caption: 'What I eat in a day. Full transparency, no shortcuts.',
    hashtags: ['#nutrition', '#mealprep', '#bodybuilding'],
    likes: 6800, comments: 189, saves: 427, views: 72000,
    postedAt: '3d ago',
    isVideo: false,
    saved: true,
  },
];

export const TYPE_COLORS: Record<ContentType, { color: string; bg: string }> = {
  Reel:     { color: '#2563eb', bg: 'rgba(37,99,235,0.12)' },
  Post:     { color: '#2563eb', bg: 'rgba(37,99,235,0.12)' },
  Carousel: { color: '#2563eb', bg: 'rgba(37,99,235,0.12)' },
};

export const NICHE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  fitness:   { label: 'Fitness',   color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  lifestyle: { label: 'Lifestyle', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  fashion:   { label: 'Fashion',   color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  wellness:  { label: 'Wellness',  color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
};

// Seed data for the Hub Dashboard tab - mock recent swipe decisions
export const MOCK_SWIPE_ACTIVITY = [
  { id: 'a1', decision: 'like' as const,  handle: '@rhinxrenx',    caption: 'Vibes only. That aesthetic everyone keeps trying to copy.', gradient: GRADIENTS.purple, sentTo: null,      timestamp: '2m ago'  },
  { id: 'a2', decision: 'pass' as const,  handle: '@abg.ricebunny', caption: 'Monday grind starts early. No excuses, just results.',      gradient: GRADIENTS.pink,   sentTo: null,      timestamp: '5m ago'  },
  { id: 'a3', decision: 'sent' as const,  handle: '@ellamira',      caption: 'Transformation Tuesday. 12 weeks in.',                      gradient: GRADIENTS.green,  sentTo: 'Tyler',   timestamp: '8m ago'  },
  { id: 'a4', decision: 'like' as const,  handle: '@rhinxrenx',    caption: 'Pull-up progression: Week 1 to Week 12.',                   gradient: GRADIENTS.teal,   sentTo: null,      timestamp: '12m ago' },
  { id: 'a5', decision: 'pass' as const,  handle: '@onlytylerrex', caption: 'Post-workout glow. Consistency is the only hack.',           gradient: GRADIENTS.amber,  sentTo: null,      timestamp: '18m ago' },
];

// Mock last session stats for Dashboard tab
export const MOCK_LAST_SESSION = {
  rated: 5,
  passed: 3,
  sent: 2,
  durationMs: 252000, // 4m 12s
  date: 'Today, 9:14 AM',
  previousSession: { rated: 18, passed: 9, sent: 3 },
  streakDays: 5,
  dailyTarget: 10,
  paceVsAvgPct: 12,
};

export const MOCK_SENT_THIS_WEEK = 14;
export const MOCK_IN_QUEUE = 7;
export const MOCK_PACE = 1.2; // posts/sec

export const MOCK_NICHE_TARGETS: Record<string, number> = {
  fitness: 15, lifestyle: 10, fashion: 12, wellness: 8,
};

export const MOCK_SEND_QUEUE = [
  {
    id: 'q1',
    handle: '@rhinxrenx',
    caption: 'Vibes only. That aesthetic everyone keeps trying to copy.',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    niche: 'lifestyle',
    approvedAt: '2h ago',
  },
  {
    id: 'q2',
    handle: '@ellamira',
    caption: 'Transformation Tuesday. 12 weeks in. Same mirror, different energy.',
    gradient: 'linear-gradient(135deg, #78c257 0%, #00f4e2 100%)',
    niche: 'fitness',
    approvedAt: '4h ago',
  },
  {
    id: 'q3',
    handle: '@abg.ricebunny',
    caption: 'Monday grind starts early. No excuses, just results.',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3b82f6 100%)',
    niche: 'fitness',
    approvedAt: '6h ago',
  },
];
