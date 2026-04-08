import type { Creator, ContentType } from './types';

export const CREATORS: Creator[] = [
  { handle: '@abg.ricebunny', initials: 'AB', color: '#ff0069',  followers: 245000, engagementRate: 4.2 },
  { handle: '@onlytylerrex',  initials: 'OT', color: '#fcaf45',  followers: 189000, engagementRate: 3.8 },
  { handle: '@rhinxrenx',     initials: 'RR', color: '#833ab4',  followers: 312000, engagementRate: 5.1 },
  { handle: '@ellamira',      initials: 'EM', color: '#78c257',  followers: 97000,  engagementRate: 6.3 },
];

export const LEADERBOARD_ENTRIES = [
  { rank: 1, ...CREATORS[2] },
  { rank: 2, ...CREATORS[0] },
  { rank: 3, ...CREATORS[1] },
  { rank: 4, ...CREATORS[3] },
];

export const GRADIENTS: Record<string, string> = {
  pink:   'linear-gradient(135deg, #ff0069 0%, #fd1d1d 50%, #fcaf45 100%)',
  purple: 'linear-gradient(135deg, #833ab4 0%, #ff0069 100%)',
  amber:  'linear-gradient(135deg, #fcaf45 0%, #ff0069 100%)',
  green:  'linear-gradient(135deg, #78c257 0%, #00f4e2 100%)',
  indigo: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%)',
  teal:   'linear-gradient(135deg, #00f4e2 0%, #833ab4 100%)',
};

export const TYPE_COLORS: Record<ContentType, { color: string; bg: string }> = {
  Reel:     { color: '#ff0069', bg: 'rgba(255,0,105,0.12)' },
  Post:     { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
  Carousel: { color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
};

export const NICHE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  fitness:   { label: 'Fitness',   color: '#ff0069', bg: 'rgba(255,0,105,0.08)' },
  lifestyle: { label: 'Lifestyle', color: '#833ab4', bg: 'rgba(131,58,180,0.08)' },
  fashion:   { label: 'Fashion',   color: '#d97706', bg: 'rgba(217,119,6,0.08)'  },
  wellness:  { label: 'Wellness',  color: '#16a34a', bg: 'rgba(22,163,74,0.08)'  },
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
};

// Re-export POSTS from posts-data to keep constants.ts re-export path stable
export { POSTS } from './posts-data';
