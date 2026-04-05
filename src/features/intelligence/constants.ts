import type { Board } from './types';

// ─── Animation presets ────────────────────────────────────────────────────────

export const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export const fadeUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ─── Niche → colour map ───────────────────────────────────────────────────────

export const NICHE_COLORS: Record<string, string> = {
  GFE:           '#ff0069',
  Fitness:       '#78c257',
  Lifestyle:     '#4a9eff',
  ABG:           '#833ab4',
  'Thirst Trap': '#ff6b35',
  Meme:          '#fcaf45',
};

// ─── Static boards (replace when Convex boards table is ready) ───────────────

export const BOARDS: Board[] = [
  { id: 1, name: 'Hooks That Convert', count: 34, lastUpdated: '2 hours ago', colors: ['#ff0069','#833ab4','#fcaf45','#4a9eff'] },
  { id: 2, name: 'GFE Vibes',          count: 21, lastUpdated: 'Yesterday',   colors: ['#833ab4','#ff0069','#4a9eff','#78c257'] },
  { id: 3, name: 'Fitness Content',    count: 18, lastUpdated: '3 days ago',  colors: ['#78c257','#4a9eff','#fcaf45','#ff0069'] },
  { id: 4, name: 'Lifestyle Inspo',    count: 27, lastUpdated: '5 days ago',  colors: ['#fcaf45','#ff0069','#833ab4','#78c257'] },
];
