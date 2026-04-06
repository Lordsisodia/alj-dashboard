import type { SwipeReel, TagCategory } from './types';

const GRADIENTS = {
  pink:   'linear-gradient(135deg, #ff0069 0%, #fd1d1d 50%, #fcaf45 100%)',
  purple: 'linear-gradient(135deg, #833ab4 0%, #ff0069 100%)',
  amber:  'linear-gradient(135deg, #fcaf45 0%, #ff0069 100%)',
  green:  'linear-gradient(135deg, #78c257 0%, #00f4e2 100%)',
  indigo: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%)',
  teal:   'linear-gradient(135deg, #00f4e2 0%, #833ab4 100%)',
  rose:   'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
  sky:    'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
};

export const SEED_REELS: SwipeReel[] = [
  {
    id: 'r1',
    type: 'Reel',
    gradient: GRADIENTS.pink,
    isVideo: true,
    creator: { handle: '@abg.ricebunny', initials: 'AB', color: '#ff0069' },
    views: 89400,
    caption: 'Monday grind starts early. No excuses, just results. 5am club is real.',
  },
  {
    id: 'r2',
    type: 'Reel',
    gradient: GRADIENTS.purple,
    isVideo: true,
    creator: { handle: '@rhinxrenx', initials: 'RR', color: '#833ab4' },
    views: 145000,
    caption: 'Vibes only. That aesthetic everyone keeps trying to copy.',
  },
  {
    id: 'r3',
    type: 'Reel',
    gradient: GRADIENTS.green,
    isVideo: true,
    creator: { handle: '@ellamira', initials: 'EM', color: '#78c257' },
    views: 76300,
    caption: 'Transformation Tuesday. 12 weeks in. Same mirror, different energy.',
  },
  {
    id: 'r4',
    type: 'Reel',
    gradient: GRADIENTS.amber,
    isVideo: true,
    creator: { handle: '@onlytylerrex', initials: 'OT', color: '#fcaf45' },
    views: 55000,
    caption: 'Post-workout glow. Consistency is the only hack you need.',
  },
  {
    id: 'r5',
    type: 'Reel',
    gradient: GRADIENTS.teal,
    isVideo: true,
    creator: { handle: '@rhinxrenx', initials: 'RR', color: '#833ab4' },
    views: 145000,
    caption: 'Pull-up progression: Week 1 to Week 12. No shortcuts.',
  },
  {
    id: 'r6',
    type: 'Reel',
    gradient: GRADIENTS.rose,
    isVideo: true,
    creator: { handle: '@ellamira', initials: 'EM', color: '#78c257' },
    views: 91200,
    caption: 'Golden hour at the rooftop. When the city lights up.',
  },
  {
    id: 'r7',
    type: 'Reel',
    gradient: GRADIENTS.sky,
    isVideo: true,
    creator: { handle: '@abg.ricebunny', initials: 'AB', color: '#ff0069' },
    views: 72000,
    caption: 'What I eat in a day. Full transparency, no shortcuts.',
  },
  {
    id: 'r8',
    type: 'Reel',
    gradient: GRADIENTS.indigo,
    isVideo: true,
    creator: { handle: '@onlytylerrex', initials: 'OT', color: '#fcaf45' },
    views: 38500,
    caption: 'Rest day = recovery day. This is where the growth actually happens.',
  },
];

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'hook',
    label: 'Hook',
    options: ['Strong hook', 'Weak hook', 'No hook'],
  },
  {
    id: 'pacing',
    label: 'Pacing',
    options: ['Fast', 'Medium', 'Slow'],
  },
  {
    id: 'visual',
    label: 'Visual',
    options: ['Clean', 'Busy', 'Dark', 'Bright'],
  },
  {
    id: 'audio',
    label: 'Audio',
    options: ['Trending sound', 'Original', 'Silent'],
  },
  {
    id: 'format',
    label: 'Format',
    options: ['Talking head', 'B-roll', 'POV', 'Outfit', 'Mirror'],
  },
  {
    id: 'tone',
    label: 'Tone',
    options: ['Playful', 'Sensual', 'Aspirational', 'Educational'],
  },
];

export const MODELS = [
  { id: 'tyler', name: 'Tyler',  handle: '@abg.ricebunny', color: '#ff0069', initials: 'T' },
  { id: 'ren',   name: 'Ren',    handle: '@rhinxrenx',     color: '#833ab4', initials: 'R' },
  { id: 'ella',  name: 'Ella',   handle: '@ellamira',      color: '#78c257', initials: 'E' },
  { id: 'amam',  name: 'Amam',   handle: '@amam.ofm',      color: '#fcaf45', initials: 'A' },
];
