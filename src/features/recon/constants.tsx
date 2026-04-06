'use client';

import { Tag, Globe, Zap } from 'lucide-react';
import type { FilterCategory } from '@/isso/layout/ContentPageShell';

// Re-export data so existing imports keep working
export { computeProfileHealth, COMPETITORS, DAILY_VOLUME, LOG_ENTRIES } from './creatorData';
export type { LogStatus, LogEntry } from './creatorData';

// ── Animation variants ─────────────────────────────────────────────────────────

export const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export const fadeUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ── Feed filter categories (used by ContentPageShell) ──────────────────────────

export const RECON_FILTER_CATEGORIES: FilterCategory[] = [
  { id: 'niche',    label: 'Niche',          icon: <Tag size={13} />,   options: [{ value: 'GFE' }, { value: 'ABG' }, { value: 'Fitness' }, { value: 'Lifestyle' }, { value: 'Cosplay' }, { value: 'Alt' }] },
  { id: 'platform', label: 'Platform',        icon: <Globe size={13} />, options: [{ value: 'Instagram' }, { value: 'TikTok' }, { value: 'Twitter / X' }] },
  { id: 'status',   label: 'Scraping Status', icon: <Zap size={13} />,   options: [{ value: 'Active' }, { value: 'Paused' }] },
];
