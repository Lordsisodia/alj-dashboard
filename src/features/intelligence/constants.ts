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

// ─── Static board names (used by BoardPickerDropdown) ────────────────────────

export const BOARD_NAMES = ['Hooks That Convert', 'GFE Vibes', 'Fitness Content', 'Lifestyle Inspo'];
