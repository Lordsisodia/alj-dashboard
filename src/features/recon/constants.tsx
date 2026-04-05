'use client';

import { Tag, Globe, Zap } from 'lucide-react';
import type { FilterCategory } from '@/isso/layout/ContentPageShell';
import type { Competitor, DailyVolume } from './types';

export const COMPETITORS: Competitor[] = [
  { id: 1, handle: '@fitness_king',   displayName: 'Fitness King',   niche: 'Fitness',   nicheColor: '#78c257', avatarColor: '#78c257', initials: 'FK', followers: '284K', engagementRate: '5.2%', postsPerWeek: 9,  lastScraped: '12 min ago', status: 'active', trend: [40,55,48,70,62,75,68], postsToday: 47, jobStatus: 'idle',    score: 72, favorited: false },
  { id: 2, handle: '@gfe_luxe',       displayName: 'GFE Luxe',       niche: 'GFE',       nicheColor: '#ff0069', avatarColor: '#ff0069', initials: 'GL', followers: '197K', engagementRate: '7.8%', postsPerWeek: 12, lastScraped: '1 hour ago',  status: 'active', trend: [60,58,72,68,80,77,85], postsToday: 31, jobStatus: 'running', score: 81, favorited: true  },
  { id: 3, handle: '@lifestyle.nova', displayName: 'Nova Lifestyle', niche: 'Lifestyle', nicheColor: '#4a9eff', avatarColor: '#4a9eff', initials: 'NL', followers: '431K', engagementRate: '3.4%', postsPerWeek: 6,  lastScraped: '3 hours ago', status: 'active', trend: [35,40,38,42,39,45,41], postsToday: 19, jobStatus: 'idle',    score: 58, favorited: false },
  { id: 4, handle: '@abg.empress',    displayName: 'ABG Empress',    niche: 'ABG',       nicheColor: '#833ab4', avatarColor: '#833ab4', initials: 'AE', followers: '156K', engagementRate: '6.1%', postsPerWeek: 8,  lastScraped: '5 hours ago', status: 'active', trend: [50,45,62,58,70,65,72], postsToday: 62, jobStatus: 'idle',    score: 63, favorited: true  },
  { id: 5, handle: '@fitgirl.pro',    displayName: 'FitGirl Pro',    niche: 'Fitness',   nicheColor: '#78c257', avatarColor: '#fcaf45', initials: 'FP', followers: '92K',  engagementRate: '4.7%', postsPerWeek: 7,  lastScraped: '1 day ago',   status: 'paused', trend: [30,42,38,50,45,40,35], postsToday: 0,  jobStatus: 'failed',  score: 42, favorited: false },
  { id: 6, handle: '@glam.gfe',       displayName: 'Glam GFE',       niche: 'GFE',       nicheColor: '#ff0069', avatarColor: '#fcaf45', initials: 'GG', followers: '73K',  engagementRate: '9.1%', postsPerWeek: 14, lastScraped: '2 days ago',  status: 'paused', trend: [80,75,88,82,90,85,78], postsToday: 0,  jobStatus: 'idle',    score: 74, favorited: false },
  { id: 7, handle: '@daily.luxe',     displayName: 'Daily Luxe',     niche: 'Lifestyle', nicheColor: '#4a9eff', avatarColor: '#4a9eff', initials: 'DL', followers: '318K', engagementRate: '2.9%', postsPerWeek: 5,  lastScraped: '6 hours ago', status: 'active', trend: [25,30,28,35,32,38,36], postsToday: 28, jobStatus: 'idle',    score: 47, favorited: false },
  { id: 8, handle: '@abg.babyy',      displayName: 'ABG Baby',       niche: 'ABG',       nicheColor: '#833ab4', avatarColor: '#833ab4', initials: 'AB', followers: '211K', engagementRate: '5.8%', postsPerWeek: 10, lastScraped: '30 min ago',  status: 'active', trend: [45,52,60,55,68,72,70], postsToday: 44, jobStatus: 'idle',    score: 68, favorited: false },
];

export const DAILY_VOLUME: DailyVolume[] = [
  { label: 'Mar 24', total: 142 }, { label: 'Mar 25', total: 198 },
  { label: 'Mar 26', total: 167 }, { label: 'Mar 27', total: 214 },
  { label: 'Mar 28', total: 189 }, { label: 'Mar 29', total: 203 },
  { label: 'Mar 30', total: 231 }, { label: 'Mar 31', total: 178 },
  { label: 'Apr 1',  total: 256 }, { label: 'Apr 2',  total: 221 },
  { label: 'Apr 3',  total: 244 }, { label: 'Apr 4',  total: 198 },
  { label: 'Apr 5',  total: 267 }, { label: 'Apr 6',  total: 284 },
];

export const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

export const fadeUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export const TABLE_COLS = '1fr 110px 96px 88px 88px 72px 130px 36px 176px';

export type LogStatus = 'success' | 'running' | 'failed';
export interface LogEntry { id: number; timestamp: string; action: string; handle: string; status: LogStatus; }

export const LOG_ENTRIES: LogEntry[] = [
  { id: 1,  timestamp: 'Today, 3:42 PM',     action: 'Scraped 47 new posts from',  handle: '@fitness_king',    status: 'success' },
  { id: 2,  timestamp: 'Today, 3:40 PM',     action: 'Scraped 44 new posts from',  handle: '@abg.babyy',      status: 'success' },
  { id: 3,  timestamp: 'Today, 3:12 PM',     action: 'Scraping in progress for',   handle: '@gfe_luxe',       status: 'running' },
  { id: 4,  timestamp: 'Today, 2:58 PM',     action: 'Scraped 19 new posts from',  handle: '@lifestyle.nova', status: 'success' },
  { id: 5,  timestamp: 'Today, 1:30 PM',     action: 'Failed to connect to',       handle: '@fitgirl.pro',    status: 'failed'  },
  { id: 6,  timestamp: 'Today, 11:14 AM',    action: 'Scraped 62 new posts from',  handle: '@abg.empress',    status: 'success' },
  { id: 7,  timestamp: 'Today, 9:05 AM',     action: 'Scraped 28 new posts from',  handle: '@daily.luxe',     status: 'success' },
  { id: 8,  timestamp: 'Yesterday, 6:22 PM', action: 'Rate limit hit scraping',    handle: '@glam.gfe',       status: 'failed'  },
  { id: 9,  timestamp: 'Yesterday, 4:10 PM', action: 'Scraped 88 new posts from',  handle: '@gfe_luxe',       status: 'success' },
  { id: 10, timestamp: 'Yesterday, 2:00 PM', action: 'Scraped 44 new posts from',  handle: '@fitness_king',   status: 'success' },
];

export const RECON_FILTER_CATEGORIES: FilterCategory[] = [
  { id: 'niche',    label: 'Niche',          icon: <Tag size={13} />,   options: [{ value: 'GFE' }, { value: 'ABG' }, { value: 'Fitness' }, { value: 'Lifestyle' }, { value: 'Cosplay' }, { value: 'Alt' }] },
  { id: 'platform', label: 'Platform',        icon: <Globe size={13} />, options: [{ value: 'Instagram' }, { value: 'TikTok' }, { value: 'Twitter / X' }] },
  { id: 'status',   label: 'Scraping Status', icon: <Zap size={13} />,   options: [{ value: 'Active' }, { value: 'Paused' }] },
];
