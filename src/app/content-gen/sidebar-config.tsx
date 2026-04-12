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
          { label: 'Creators',     href: '/content-gen/recon',     icon: <Radar size={16} /> },
          { label: 'Scraping Log', href: '/content-gen/recon',     icon: <Activity size={16} /> },
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
          { label: 'Trends',   href: '/content-gen/intelligence', icon: <TrendingUp size={16} /> },
          { label: 'Analysis', href: '/content-gen/intelligence', icon: <ScanSearch size={16} /> },
          { label: 'Insights', href: '/content-gen/intelligence', icon: <Lightbulb  size={16} /> },
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
          { label: 'Dashboard',    href: '/content-gen',           icon: <LayoutDashboard size={16} /> },
          { label: 'Approvals',    href: '/content-gen/approvals', icon: <CheckSquare size={16} /> },
          { label: 'Content Feed', href: '/content-gen/community', icon: <Rss size={16} /> },
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
          { label: 'Dashboard',  href: '/content-gen/content-gen',         icon: <LayoutDashboard size={16} /> },
          { label: 'Scenes',    href: '/content-gen/scenes',  icon: <Layers size={16} /> },
          { label: 'Generate',   href: '/content-gen/generate', icon: <Sparkles size={16} /> },
          { label: 'Gallery',    href: '/content-gen/gallery', icon: <Upload size={16} /> },
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
          { label: 'Activity',  href: '/content-gen/agents', icon: <Activity size={16} /> },
          { label: 'Reports',   href: '/content-gen/agents', icon: <FileText size={16} /> },
          { label: 'Requests',  href: '/content-gen/agents', icon: <MessageSquare size={16} /> },
        ],
      },
    ],
  },
];

export const AGENCY_PERSISTENT_NAV: NavItem[] = [
  { label: 'Schedule',       href: '/content-gen/schedule',       icon: <Calendar size={16} /> },
  { label: 'Analytics',      href: '/content-gen/analytics',      icon: <BarChart2 size={16} /> },
  { label: 'Models',         href: '/content-gen/models',         icon: <Users2 size={16} /> },
  { label: 'Team',           href: '/content-gen/team',           icon: <UserPlus size={16} /> },
  { label: 'Notifications', href: '/content-gen/notifications',  icon: <Bell size={16} />, badge: 'dot' as const },
  { label: 'Settings',       href: '/content-gen/settings',       icon: <Settings size={16} /> },
  { label: 'Tools',          href: '/content-gen/tools',          icon: <Wrench size={16} /> },
];

export const AGENCY_PLATFORMS_NAV: PlatformItem[] = [
  { id: 'instagram', label: 'Instagram', href: '/content-gen/instagram', icon: InstagramIcon },
  { id: 'tiktok',    label: 'TikTok',    href: '/content-gen/tiktok',    icon: TikTokIcon,    comingSoon: true },
  { id: 'youtube',   label: 'YouTube',   href: '/content-gen/youtube',   icon: YouTubeIcon,   comingSoon: true },
  { id: 'x',         label: 'X',          href: '/content-gen/x',         icon: XIcon,         comingSoon: true },
  { id: 'pinterest', label: 'Pinterest',  href: '/content-gen/pinterest', icon: PinterestIcon, comingSoon: true },
];
