import type { Niche } from './types';

export const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

/** Per-niche color tokens - background + foreground text */
export const NICHES: Record<Niche, { bg: string; text: string }> = {
  'GFE':         { bg: '#fce7f3', text: '#9d174d' },
  'Fitness':     { bg: '#d1fae5', text: '#065f46' },
  'Meme':        { bg: '#fef3c7', text: '#92400e' },
  'Thirst Trap': { bg: '#ede9fe', text: '#5b21b6' },
  'Lifestyle':   { bg: '#e0f2fe', text: '#075985' },
};

/** Avatar background color swatches (pastel + brand) */
export const AVATAR_COLORS = [
  '#e8d5c4', '#c4d5e8', '#d5c4e8',
  '#c4e8d5', '#e8c4d5', '#f5d0a9',
  '#833ab4', '#ff0069', '#fcaf45',
];

/** Filter chip options for the page header */
export const FILTER_CHIPS = [
  { id: 'all',    label: 'All'    },
  { id: 'active', label: 'Active' },
  { id: 'draft',  label: 'Draft'  },
];
