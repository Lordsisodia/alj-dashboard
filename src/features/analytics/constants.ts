import type { GrowthPoint, EngagementPoint, TopPost } from './types';

export const FOLLOWER_GROWTH: GrowthPoint[] = [
  { label: 'Jan', value: 185000 },
  { label: 'Feb', value: 194000 },
  { label: 'Mar', value: 203000 },
  { label: 'Apr', value: 211000 },
  { label: 'May', value: 218000 },
  { label: 'Jun', value: 224000 },
  { label: 'Jul', value: 229000 },
  { label: 'Aug', value: 234000 },
  { label: 'Sep', value: 238000 },
  { label: 'Oct', value: 241000 },
  { label: 'Nov', value: 243500 },
  { label: 'Dec', value: 245000 },
];

export const ENGAGEMENT_DATA: EngagementPoint[] = [
  { week: 'W1', rate: 3.8 },
  { week: 'W2', rate: 4.1 },
  { week: 'W3', rate: 3.9 },
  { week: 'W4', rate: 4.4 },
  { week: 'W5', rate: 4.2 },
  { week: 'W6', rate: 4.7 },
  { week: 'W7', rate: 4.5 },
  { week: 'W8', rate: 4.7 },
];

export const TOP_POSTS: TopPost[] = [
  {
    id: 1,
    gradientFrom: '#ff0069',
    gradientTo: '#fd1d1d',
    handle: '@abg.ricebunny',
    handleColor: '#ff0069',
    caption: 'Monday grind. 5am club is real.',
    likes: 8412,
    comments: 234,
    saves: 180,
    reach: 89400,
    posted: 'Apr 5, 2026',
    likesChange: 18,
  },
  {
    id: 2,
    gradientFrom: '#fcaf45',
    gradientTo: '#833ab4',
    handle: '@onlytylerrex',
    handleColor: '#fcaf45',
    caption: 'Post-workout glow. Consistency is everything.',
    likes: 6200,
    comments: 178,
    saves: 141,
    reach: 67200,
    posted: 'Apr 4, 2026',
  },
  {
    id: 3,
    gradientFrom: '#833ab4',
    gradientTo: '#78c257',
    handle: '@rhinxrenx',
    handleColor: '#833ab4',
    caption: '5 ways to stay consistent with your fitness goals.',
    likes: 4120,
    comments: 89,
    saves: 312,
    reach: 34100,
    posted: 'Apr 4, 2026',
  },
  {
    id: 4,
    gradientFrom: '#78c257',
    gradientTo: '#00f4e2',
    handle: '@ellamira',
    handleColor: '#78c257',
    caption: 'Golden hour at the rooftop. No plan, just vibes.',
    likes: 3870,
    comments: 56,
    saves: 98,
    reach: 28900,
    posted: 'Apr 3, 2026',
  },
  {
    id: 5,
    gradientFrom: '#ff0069',
    gradientTo: '#833ab4',
    handle: '@abg.ricebunny',
    handleColor: '#ff0069',
    caption: 'Transformation Tuesday. 12 weeks in. Same mirror, different energy.',
    likes: 7100,
    comments: 198,
    saves: 214,
    reach: 76300,
    posted: 'Apr 3, 2026',
    likesChange: 12,
  },
];

export const AUDIENCE_LOCATIONS = [
  { city: 'Manila',      flag: '🇵🇭', pct: 42 },
  { city: 'Quezon City', flag: '🇵🇭', pct: 18 },
  { city: 'Cebu',        flag: '🇵🇭', pct: 8  },
  { city: 'Davao',       flag: '🇵🇭', pct: 5  },
  { city: 'Other',       flag: '🌐', pct: 27 },
];

export const AGE_RANGES = [
  { range: '18-24', pct: 28 },
  { range: '25-34', pct: 47 },
  { range: '35-44', pct: 18 },
  { range: '45+',   pct: 7  },
];

export const ACTIVE_HOURS = ['8–11am', '7–10pm'];
