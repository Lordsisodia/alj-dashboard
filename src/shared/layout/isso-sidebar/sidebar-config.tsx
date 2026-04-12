import {
  LayoutDashboard, Layers, Sparkles, TrendingUp, Radar, Bot,
  CheckSquare, Calendar, Rss, BarChart2, Lightbulb, Upload, Users2,
  Search, Activity, FileText, MessageSquare, UserPlus, Bell, ScanSearch, Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';

// ── Platform SVG icons ────────────────────────────────────────────────────────
export function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
    </svg>
  );
}

export function YouTubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function PinterestIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

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

// The 5 ISSO products - ordered by pipeline flow: collect → analyze → curate → generate → monitor
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
          { label: 'Creators',     href: '/content-gen/recon',      icon: <Radar size={16} /> },
          { label: 'Feed',         href: '/content-gen/community',  icon: <Rss size={16} /> },
          { label: 'Scraping Log', href: '/content-gen/recon',      icon: <Activity size={16} /> },
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
          { label: 'Swipe & Rate',  href: '/content-gen/community', icon: <Rss size={16} /> },
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
          { label: 'Dashboard', href: '/content-gen/content-gen',          icon: <LayoutDashboard size={16} /> },
          { label: 'Scenes',    href: '/content-gen/content-gen/scenes',   icon: <Layers size={16} /> },
          { label: 'Generate',  href: '/content-gen/content-gen/generate', icon: <Sparkles size={16} /> },
          { label: 'Gallery',   href: '/content-gen/content-gen/gallery',  icon: <Upload size={16} /> },
          { label: 'Models',    href: '/content-gen/content-gen/models',   icon: <Users2 size={16} /> },
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

// Persistent sidebar pages - always visible, not inside any product
export const PERSISTENT_NAV = [
  { label: 'Schedule',      href: '/content-gen/schedule',       icon: <Calendar size={16} /> },
  { label: 'Analytics',     href: '/content-gen/analytics',      icon: <BarChart2 size={16} /> },
  { label: 'Models',        href: '/content-gen/models',         icon: <Users2 size={16} /> },
  { label: 'Team',          href: '/content-gen/team',           icon: <UserPlus size={16} /> },
  { label: 'Notifications', href: '/content-gen/notifications',  icon: <Bell size={16} />, badge: 'dot' as const },
  { label: 'Tools',         href: '/content-gen/tools',           icon: <Wrench size={16} /> },
];

export function getSectionConfig(id: string): SectionConfig | undefined {
  return ISSO_NAV_CONFIG.find(s => s.id === id);
}

// ── Platforms section ─────────────────────────────────────────────────────────
export interface PlatformItem {
  id: string;
  label: string;
  href: string;
  icon: (props: { size?: number }) => ReactNode;
  comingSoon?: boolean;
}

export const PLATFORMS_NAV: PlatformItem[] = [
  { id: 'instagram', label: 'Instagram', href: '/content-gen/instagram', icon: InstagramIcon },
  { id: 'tiktok',    label: 'TikTok',    href: '/content-gen/tiktok',    icon: TikTokIcon,   comingSoon: true },
  { id: 'youtube',   label: 'YouTube',   href: '/content-gen/youtube',   icon: YouTubeIcon,  comingSoon: true },
  { id: 'x',         label: 'X',         href: '/content-gen/x',         icon: XIcon,        comingSoon: true },
  { id: 'pinterest', label: 'Pinterest', href: '/content-gen/pinterest', icon: PinterestIcon, comingSoon: true },
];
