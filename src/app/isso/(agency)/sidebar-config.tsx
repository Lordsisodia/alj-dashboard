'use client';

import {
  LayoutDashboard, Layers, Sparkles, TrendingUp, Radar, Bot,
  CheckSquare, Calendar, Rss, BarChart2, Lightbulb, Upload, Users2,
  Activity, FileText, MessageSquare, UserPlus, Bell, ScanSearch, Wrench,
  Settings,
} from 'lucide-react';
import type { SectionConfig, NavItem, PlatformItem } from '@/shared/layout/isso-sidebar/sidebar-config';
import { InstagramIcon, TikTokIcon, YouTubeIcon, XIcon, PinterestIcon } from '@/shared/layout/isso-sidebar/sidebar-config';

// Agency domain - full 5-product view
export const AGENCY_NAV_CONFIG: SectionConfig[] = [
  {
    id: 'recon',
    label: 'Recon',
    description: 'Scrape competitors & track niches.',
    hotkey: '⌘1',
    icon: <Radar size={20} />,
    sections: [
      {
        title: 'Recon',
        hideTitle: true,
        items: [
          { label: 'Creators',     href: '/isso/recon',     icon: <Radar size={16} /> },
          { label: 'Scraping Log', href: '/isso/recon',     icon: <Activity size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    description: 'Discover trends & winning content.',
    hotkey: '⌘2',
    icon: <TrendingUp size={20} />,
    sections: [
      {
        title: 'Intelligence',
        hideTitle: true,
        items: [
          { label: 'Trends',   href: '/isso/intelligence', icon: <TrendingUp size={16} /> },
          { label: 'Analysis', href: '/isso/intelligence', icon: <ScanSearch size={16} /> },
          { label: 'Insights', href: '/isso/intelligence', icon: <Lightbulb  size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'hub',
    label: 'Hub',
    description: 'Swipe & rate content to train the system.',
    hotkey: '⌘3',
    icon: <Layers size={20} />,
    sections: [
      {
        title: 'Hub',
        hideTitle: true,
        items: [
          { label: 'Dashboard',    href: '/isso',           icon: <LayoutDashboard size={16} /> },
          { label: 'Approvals',    href: '/isso/approvals', icon: <CheckSquare size={16} /> },
          { label: 'Content Feed', href: '/isso/community', icon: <Rss size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'content-gen',
    label: 'Content Gen',
    description: 'Generate, review & approve AI reels.',
    hotkey: '⌘4',
    icon: <Sparkles size={20} />,
    sections: [
      {
        title: 'Content Gen',
        hideTitle: true,
        items: [
          { label: 'Dashboard',  href: '/isso/content-gen',         icon: <LayoutDashboard size={16} /> },
          { label: 'Scenes',    href: '/isso/content-gen/scenes',  icon: <Layers size={16} /> },
          { label: 'Generate',   href: '/isso/content-gen/generate', icon: <Sparkles size={16} /> },
          { label: 'Gallery',    href: '/isso/content-gen/gallery', icon: <Upload size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'agents',
    label: 'Agents',
    description: 'Monitor automation running in the background.',
    hotkey: '⌘5',
    icon: <Bot size={20} />,
    sections: [
      {
        title: 'Agents',
        hideTitle: true,
        items: [
          { label: 'Activity',  href: '/isso/agents', icon: <Activity size={16} /> },
          { label: 'Reports',   href: '/isso/agents', icon: <FileText size={16} /> },
          { label: 'Requests',  href: '/isso/agents', icon: <MessageSquare size={16} /> },
        ],
      },
    ],
  },
];

export const AGENCY_PERSISTENT_NAV: NavItem[] = [
  { label: 'Schedule',       href: '/isso/schedule',       icon: <Calendar size={16} /> },
  { label: 'Analytics',      href: '/isso/analytics',      icon: <BarChart2 size={16} /> },
  { label: 'Models',         href: '/isso/models',         icon: <Users2 size={16} /> },
  { label: 'Team',           href: '/isso/team',           icon: <UserPlus size={16} /> },
  { label: 'Notifications', href: '/isso/notifications',  icon: <Bell size={16} />, badge: 'dot' as const },
  { label: 'Settings',       href: '/isso/settings',       icon: <Settings size={16} /> },
  { label: 'Tools',          href: '/isso/tools',          icon: <Wrench size={16} /> },
];

export const AGENCY_PLATFORMS_NAV: PlatformItem[] = [
  { id: 'instagram', label: 'Instagram', href: '/isso/instagram', icon: InstagramIcon },
  { id: 'tiktok',    label: 'TikTok',    href: '/isso/tiktok',    icon: TikTokIcon,    comingSoon: true },
  { id: 'youtube',   label: 'YouTube',   href: '/isso/youtube',   icon: YouTubeIcon,   comingSoon: true },
  { id: 'x',         label: 'X',          href: '/isso/x',         icon: XIcon,         comingSoon: true },
  { id: 'pinterest', label: 'Pinterest',  href: '/isso/pinterest', icon: PinterestIcon, comingSoon: true },
];
