import {
  LayoutDashboard, Layers, Sparkles, TrendingUp, Radar, Bot,
  CheckSquare, Calendar, Rss, BarChart2, Lightbulb, Upload, Users2,
  Search, Activity, FileText, MessageSquare, UserPlus, Bell,
} from 'lucide-react';
import type { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number | 'dot';
  description?: string;
}

export interface NavSection {
  title: string;
  hideTitle?: boolean;
  items: NavItem[];
}

export interface SectionConfig {
  id: string;
  label: string;
  description: string;
  hotkey: string;
  icon: ReactNode;
  sections: NavSection[];
}

// The 5 ISSO products — ordered by pipeline flow: collect → analyze → curate → generate → monitor
export const ISSO_NAV_CONFIG: SectionConfig[] = [
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
          { label: 'Creators',     href: '/isso/recon',      icon: <Radar size={16} /> },
          { label: 'Feed',         href: '/isso/community',  icon: <Rss size={16} /> },
          { label: 'Scraping Log', href: '/isso/recon',      icon: <Activity size={16} /> },
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
          { label: 'Trends',       href: '/isso/intelligence', icon: <TrendingUp size={16} /> },
          { label: 'Analysis',     href: '/isso/intelligence', icon: <Search size={16} /> },
          { label: 'Pulse Report', href: '/isso/intelligence', icon: <FileText size={16} /> },
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
          { label: 'Swipe & Rate',  href: '/isso/community', icon: <Rss size={16} /> },
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
          { label: 'Generate',  href: '/isso/ideas',    icon: <Lightbulb size={16} /> },
          { label: 'Queue',     href: '/isso/content',  icon: <Upload size={16} /> },
          { label: 'Scenes',    href: '/isso/content',  icon: <Layers size={16} /> },
          { label: 'Approvals', href: '/isso/approvals', icon: <CheckSquare size={16} />, badge: 3 },
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

// Persistent sidebar pages — always visible, not inside any product
export const PERSISTENT_NAV = [
  { label: 'Schedule',      href: '/isso/schedule',       icon: <Calendar size={16} /> },
  { label: 'Analytics',     href: '/isso/analytics',      icon: <BarChart2 size={16} /> },
  { label: 'Models',        href: '/isso/models',         icon: <Users2 size={16} /> },
  { label: 'Team',          href: '/isso/team',           icon: <UserPlus size={16} /> },
  { label: 'Notifications', href: '/isso/notifications',  icon: <Bell size={16} />, badge: 'dot' as const },
];

export function getSectionConfig(id: string): SectionConfig | undefined {
  return ISSO_NAV_CONFIG.find(s => s.id === id);
}
