import type { ModelId, ModelProfile, ModelAnalyticsData, GrowthPoint, EngagementPoint, Period } from './types';
export type { Period };export function fmtK(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return '£' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '£' + (n / 1_000).toFixed(1) + 'K';
  return '£' + n.toFixed(0);
}

// ─── Model Profiles ───────────────────────────────────────────────────────────

export const MODEL_PROFILES: ModelProfile[] = [
  {
    id: 'tyler',
    handle: '@tyler.rex',
    displayName: 'Tyler Rex',
    niche: 'Gay Bear Fitness',
    location: 'Manila, PH',
    color: '#ff0069',
    initials: 'TR',
    revenue: 4200,
  },
  {
    id: 'ren',
    handle: '@ren.rhynx',
    displayName: 'Ren Rhinx',
    niche: 'ABG Lifestyle',
    location: 'Quezon City, PH',
    color: '#833ab4',
    initials: 'RR',
    revenue: 3100,
  },
  {
    id: 'ella',
    handle: '@ella.mira',
    displayName: 'Ella Mira',
    niche: 'Fashion & Lifestyle',
    location: 'Cebu, PH',
    color: '#78c257',
    initials: 'EM',
    revenue: 2800,
  },
  {
    id: 'sam',
    handle: '@sam.chase',
    displayName: 'Sam Chase',
    niche: 'Thirst Trap',
    location: 'Manila, PH',
    color: '#fcaf45',
    initials: 'SC',
    revenue: 1900,
  },
];

// ─── Revenue by Period ────────────────────────────────────────────────────────

export const REVENUE_PERIODS: Record<Period, { total: number; modelRevenue: Record<ModelId, number> }> = {
  '7d': {
    total: 1210,
    modelRevenue: { tyler: 480, ren: 340, ella: 260, sam: 130 },
  },
  '30d': {
    total: 5200,
    modelRevenue: { tyler: 2100, ren: 1500, ella: 1000, sam: 600 },
  },
  '90d': {
    total: 12000,
    modelRevenue: { tyler: 4200, ren: 3100, ella: 2800, sam: 1900 },
  },
};

// ─── Follower Growth Data (combined, 12 months) ───────────────────────────────

export const FOLLOWER_GROWTH_DATA: GrowthPoint[] = [
  { label: 'Jan', value: 362000 },
  { label: 'Feb', value: 377000 },
  { label: 'Mar', value: 393000 },
  { label: 'Apr', value: 411000 },
  { label: 'May', value: 429000 },
  { label: 'Jun', value: 443000 },
  { label: 'Jul', value: 458000 },
  { label: 'Aug', value: 472000 },
  { label: 'Sep', value: 485000 },
  { label: 'Oct', value: 493000 },
  { label: 'Nov', value: 499500 },
  { label: 'Dec', value: 510200 },
];

// ─── Engagement Data (8 weeks) ────────────────────────────────────────────────

export const ENGAGEMENT_DATA: EngagementPoint[] = [
  { week: 'W1', rate: 4.8 },
  { week: 'W2', rate: 5.1 },
  { week: 'W3', rate: 4.9 },
  { week: 'W4', rate: 5.6 },
  { week: 'W5', rate: 5.3 },
  { week: 'W6', rate: 5.8 },
  { week: 'W7', rate: 5.5 },
  { week: 'W8', rate: 5.9 },
];

// ─── Per-Model Analytics Data ────────────────────────────────────────────────

export const PER_MODEL_DATA: Record<ModelId, ModelAnalyticsData> = {
  tyler: {
    stats: {
      followers: 245000,
      following: 892,
      posts: 1847,
      engagementRate: 4.2,
      avgLikes: 10300,
      avgComments: 389,
      avgSaves: 236,
      avgReach: 74200,
    },
    followerGrowth: [
      { label: 'Jan', value: 185000 }, { label: 'Feb', value: 194000 }, { label: 'Mar', value: 203000 },
      { label: 'Apr', value: 211000 }, { label: 'May', value: 218000 }, { label: 'Jun', value: 224000 },
      { label: 'Jul', value: 229000 }, { label: 'Aug', value: 234000 }, { label: 'Sep', value: 238000 },
      { label: 'Oct', value: 241000 }, { label: 'Nov', value: 243500 }, { label: 'Dec', value: 245000 },
    ],
    engagementData: [
      { week: 'W1', rate: 3.8 }, { week: 'W2', rate: 4.1 }, { week: 'W3', rate: 3.9 },
      { week: 'W4', rate: 4.4 }, { week: 'W5', rate: 4.2 }, { week: 'W6', rate: 4.7 },
      { week: 'W7', rate: 4.5 }, { week: 'W8', rate: 4.7 },
    ],
    topPosts: [
      { id: 1, gradientFrom: '#ff0069', gradientTo: '#fd1d1d', handle: '@tyler.rex', handleColor: '#ff0069', caption: 'Monday grind. 5am club is real.', likes: 8412, comments: 234, saves: 180, reach: 89400, posted: 'Apr 5, 2026', likesChange: 18 },
      { id: 2, gradientFrom: '#fcaf45', gradientTo: '#ff0069', handle: '@tyler.rex', handleColor: '#ff0069', caption: 'Transformation Tuesday. 12 weeks in.', likes: 7100, comments: 198, saves: 214, reach: 76300, posted: 'Apr 3, 2026', likesChange: 12 },
      { id: 3, gradientFrom: '#ff0069', gradientTo: '#833ab4', handle: '@tyler.rex', handleColor: '#ff0069', caption: 'Post-workout glow. Consistency is everything.', likes: 6200, comments: 178, saves: 141, reach: 67200, posted: 'Apr 1, 2026' },
      { id: 4, gradientFrom: '#833ab4', gradientTo: '#ff0069', handle: '@tyler.rex', handleColor: '#ff0069', caption: 'Leg day. Never skipped, never easy.', likes: 5800, comments: 145, saves: 122, reach: 61000, posted: 'Mar 29, 2026' },
      { id: 5, gradientFrom: '#fd1d1d', gradientTo: '#fcaf45', handle: '@tyler.rex', handleColor: '#ff0069', caption: 'Pull-up progression: Week 1 to Week 12.', likes: 5100, comments: 120, saves: 310, reach: 54800, posted: 'Mar 27, 2026' },
    ],
    audienceLocations: [
      { city: 'Manila', flag: '🇵🇭', pct: 42 }, { city: 'Quezon City', flag: '🇵🇭', pct: 18 },
      { city: 'Cebu', flag: '🇵🇭', pct: 8 }, { city: 'Davao', flag: '🇵🇭', pct: 5 },
      { city: 'Other', flag: '🌐', pct: 27 },
    ],
    ageRanges: [
      { range: '18-24', pct: 28 }, { range: '25-34', pct: 47 },
      { range: '35-44', pct: 18 }, { range: '45+', pct: 7 },
    ],
    genderSplit: { male: 78, female: 22 },
    activeHours: ['8 - 11am', '7 - 10pm'],
  },

  ren: {
    stats: {
      followers: 124000, following: 1240, posts: 934, engagementRate: 5.8,
      avgLikes: 7200, avgComments: 512, avgSaves: 418, avgReach: 48600,
    },
    followerGrowth: [
      { label: 'Jan', value: 88000 }, { label: 'Feb', value: 93000 }, { label: 'Mar', value: 98500 },
      { label: 'Apr', value: 103000 }, { label: 'May', value: 107000 }, { label: 'Jun', value: 110500 },
      { label: 'Jul', value: 113000 }, { label: 'Aug', value: 116000 }, { label: 'Sep', value: 119000 },
      { label: 'Oct', value: 121000 }, { label: 'Nov', value: 122800 }, { label: 'Dec', value: 124000 },
    ],
    engagementData: [
      { week: 'W1', rate: 5.1 }, { week: 'W2', rate: 5.4 }, { week: 'W3', rate: 5.2 },
      { week: 'W4', rate: 5.9 }, { week: 'W5', rate: 5.6 }, { week: 'W6', rate: 6.1 },
      { week: 'W7', rate: 5.8 }, { week: 'W8', rate: 6.2 },
    ],
    topPosts: [
      { id: 1, gradientFrom: '#833ab4', gradientTo: '#ff0069', handle: '@ren.rhynx', handleColor: '#833ab4', caption: 'ABG aesthetic at its finest. Golden hour hits different.', likes: 9800, comments: 412, saves: 580, reach: 62400, posted: 'Apr 5, 2026', likesChange: 22 },
      { id: 2, gradientFrom: '#ff0069', gradientTo: '#833ab4', handle: '@ren.rhynx', handleColor: '#833ab4', caption: 'Vibes only. No plan, just execution.', likes: 8100, comments: 380, saves: 490, reach: 54200, posted: 'Apr 3, 2026', likesChange: 15 },
      { id: 3, gradientFrom: '#833ab4', gradientTo: '#fcaf45', handle: '@ren.rhynx', handleColor: '#833ab4', caption: 'GRWM for a night out. The fit hits different.', likes: 7400, comments: 290, saves: 440, reach: 48900, posted: 'Apr 1, 2026' },
      { id: 4, gradientFrom: '#fcaf45', gradientTo: '#833ab4', handle: '@ren.rhynx', handleColor: '#833ab4', caption: 'Sunday reset mode. Self care is not optional.', likes: 6900, comments: 245, saves: 380, reach: 43100, posted: 'Mar 30, 2026' },
      { id: 5, gradientFrom: '#833ab4', gradientTo: '#78c257', handle: '@ren.rhynx', handleColor: '#833ab4', caption: 'This is what showing up every day looks like.', likes: 6200, comments: 198, saves: 312, reach: 39800, posted: 'Mar 28, 2026' },
    ],
    audienceLocations: [
      { city: 'Manila', flag: '🇵🇭', pct: 38 }, { city: 'Quezon City', flag: '🇵🇭', pct: 22 },
      { city: 'Los Angeles', flag: '🇺🇸', pct: 12 }, { city: 'Singapore', flag: '🇸🇬', pct: 7 },
      { city: 'Other', flag: '🌐', pct: 21 },
    ],
    ageRanges: [
      { range: '18-24', pct: 44 }, { range: '25-34', pct: 38 },
      { range: '35-44', pct: 12 }, { range: '45+', pct: 6 },
    ],
    genderSplit: { male: 34, female: 66 },
    activeHours: ['12 - 3pm', '9 - 11pm'],
  },

  ella: {
    stats: {
      followers: 56700, following: 2100, posts: 612, engagementRate: 6.4,
      avgLikes: 3630, avgComments: 198, avgSaves: 542, avgReach: 22400,
    },
    followerGrowth: [
      { label: 'Jan', value: 38000 }, { label: 'Feb', value: 40500 }, { label: 'Mar', value: 43000 },
      { label: 'Apr', value: 45200 }, { label: 'May', value: 47400 }, { label: 'Jun', value: 49100 },
      { label: 'Jul', value: 51000 }, { label: 'Aug', value: 52800 }, { label: 'Sep', value: 54100 },
      { label: 'Oct', value: 55200 }, { label: 'Nov', value: 56000 }, { label: 'Dec', value: 56700 },
    ],
    engagementData: [
      { week: 'W1', rate: 5.8 }, { week: 'W2', rate: 6.2 }, { week: 'W3', rate: 6.0 },
      { week: 'W4', rate: 6.5 }, { week: 'W5', rate: 6.3 }, { week: 'W6', rate: 6.8 },
      { week: 'W7', rate: 6.4 }, { week: 'W8', rate: 6.9 },
    ],
    topPosts: [
      { id: 1, gradientFrom: '#78c257', gradientTo: '#00f4e2', handle: '@ella.mira', handleColor: '#78c257', caption: 'OOTD but make it intentional. Every detail matters.', likes: 5200, comments: 312, saves: 810, reach: 31400, posted: 'Apr 5, 2026', likesChange: 28 },
      { id: 2, gradientFrom: '#00f4e2', gradientTo: '#78c257', handle: '@ella.mira', handleColor: '#78c257', caption: 'Golden hour at the rooftop. No plan, just vibes.', likes: 4800, comments: 278, saves: 720, reach: 28900, posted: 'Apr 3, 2026', likesChange: 19 },
      { id: 3, gradientFrom: '#78c257', gradientTo: '#fcaf45', handle: '@ella.mira', handleColor: '#78c257', caption: 'Minimal but make it fashion. Less is always more.', likes: 4100, comments: 190, saves: 640, reach: 24800, posted: 'Mar 31, 2026' },
      { id: 4, gradientFrom: '#fcaf45', gradientTo: '#78c257', handle: '@ella.mira', handleColor: '#78c257', caption: 'Sunday soft life era. I earned this.', likes: 3700, comments: 156, saves: 580, reach: 22100, posted: 'Mar 29, 2026' },
      { id: 5, gradientFrom: '#78c257', gradientTo: '#833ab4', handle: '@ella.mira', handleColor: '#78c257', caption: 'The fit that broke the algorithm.', likes: 3400, comments: 134, saves: 510, reach: 20400, posted: 'Mar 27, 2026' },
    ],
    audienceLocations: [
      { city: 'Cebu', flag: '🇵🇭', pct: 34 }, { city: 'Manila', flag: '🇵🇭', pct: 24 },
      { city: 'New York', flag: '🇺🇸', pct: 14 }, { city: 'London', flag: '🇬🇧', pct: 8 },
      { city: 'Other', flag: '🌐', pct: 20 },
    ],
    ageRanges: [
      { range: '18-24', pct: 52 }, { range: '25-34', pct: 32 },
      { range: '35-44', pct: 10 }, { range: '45+', pct: 6 },
    ],
    genderSplit: { male: 28, female: 72 },
    activeHours: ['11am - 2pm', '8 - 11pm'],
  },

  sam: {
    stats: {
      followers: 84200, following: 1560, posts: 423, engagementRate: 7.1,
      avgLikes: 5980, avgComments: 621, avgSaves: 380, avgReach: 38900,
    },
    followerGrowth: [
      { label: 'Jan', value: 51000 }, { label: 'Feb', value: 55000 }, { label: 'Mar', value: 59500 },
      { label: 'Apr', value: 63000 }, { label: 'May', value: 66800 }, { label: 'Jun', value: 70000 },
      { label: 'Jul', value: 73200 }, { label: 'Aug', value: 76400 }, { label: 'Sep', value: 79100 },
      { label: 'Oct', value: 81200 }, { label: 'Nov', value: 82900 }, { label: 'Dec', value: 84200 },
    ],
    engagementData: [
      { week: 'W1', rate: 6.4 }, { week: 'W2', rate: 6.9 }, { week: 'W3', rate: 6.7 },
      { week: 'W4', rate: 7.2 }, { week: 'W5', rate: 7.0 }, { week: 'W6', rate: 7.5 },
      { week: 'W7', rate: 7.1 }, { week: 'W8', rate: 7.6 },
    ],
    topPosts: [
      { id: 1, gradientFrom: '#fcaf45', gradientTo: '#ff0069', handle: '@sam.chase', handleColor: '#fcaf45', caption: 'The one that broke 100K views overnight.', likes: 8900, comments: 780, saves: 490, reach: 58200, posted: 'Apr 5, 2026', likesChange: 34 },
      { id: 2, gradientFrom: '#ff0069', gradientTo: '#fcaf45', handle: '@sam.chase', handleColor: '#fcaf45', caption: 'POV: you finally found your angle.', likes: 7600, comments: 640, saves: 420, reach: 49800, posted: 'Apr 3, 2026', likesChange: 21 },
      { id: 3, gradientFrom: '#fcaf45', gradientTo: '#833ab4', handle: '@sam.chase', handleColor: '#fcaf45', caption: 'For the algorithm. You know what this is.', likes: 6800, comments: 590, saves: 380, reach: 44100, posted: 'Apr 1, 2026' },
      { id: 4, gradientFrom: '#833ab4', gradientTo: '#fcaf45', handle: '@sam.chase', handleColor: '#fcaf45', caption: 'Morning energy. Unfiltered.', likes: 6100, comments: 510, saves: 340, reach: 39800, posted: 'Mar 30, 2026' },
      { id: 5, gradientFrom: '#fcaf45', gradientTo: '#fd1d1d', handle: '@sam.chase', handleColor: '#fcaf45', caption: 'The weekly ritual that keeps me consistent.', likes: 5400, comments: 440, saves: 298, reach: 35100, posted: 'Mar 28, 2026' },
    ],
    audienceLocations: [
      { city: 'Manila', flag: '🇵🇭', pct: 48 }, { city: 'Davao', flag: '🇵🇭', pct: 16 },
      { city: 'Quezon City', flag: '🇵🇭', pct: 12 }, { city: 'Dubai', flag: '🇦🇪', pct: 7 },
      { city: 'Other', flag: '🌐', pct: 17 },
    ],
    ageRanges: [
      { range: '18-24', pct: 38 }, { range: '25-34', pct: 42 },
      { range: '35-44', pct: 14 }, { range: '45+', pct: 6 },
    ],
    genderSplit: { male: 62, female: 38 },
    activeHours: ['9am - 12pm', '10pm - 1am'],
  },
};
