'use client';

import {
  LayoutDashboard, Layers, Sparkles,
  CheckSquare, Calendar, BarChart2, Upload, Users2,
  Activity, FileText, MessageSquare, Lightbulb, Bell,
} from 'lucide-react';
import type { SectionConfig, NavItem } from '@/shared/layout/isso-sidebar/sidebar-config';

// Content Gen domain - Hub-centric focus
export const CONTENT_GEN_NAV_CONFIG: SectionConfig[] = [
  {
    id: 'hub',
    label: 'Hub',
    description: 'Swipe & rate content to train the system.',
    hotkey: '⌘1',
    icon: <Layers size={20} />,
    sections: [
      {
        title: 'Hub',
        hideTitle: true,
        items: [
          { label: 'Dashboard',    href: '/isso/contentgen',             icon: <LayoutDashboard size={16} /> },
          { label: 'Approvals',   href: '/isso/contentgen/approvals', icon: <CheckSquare size={16} /> },
          { label: 'Content Feed', href: '/isso/contentgen/community', icon: <Layers size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'content-gen',
    label: 'Content Gen',
    description: 'Generate, review & approve AI reels.',
    hotkey: '⌘2',
    icon: <Sparkles size={20} />,
    sections: [
      {
        title: 'Content Gen',
        hideTitle: true,
        items: [
          { label: 'Dashboard', href: '/isso/contentgen/content-gen',         icon: <LayoutDashboard size={16} /> },
          { label: 'Ideas',     href: '/isso/contentgen/ideas',               icon: <Lightbulb size={16} /> },
          { label: 'Scenes',   href: '/isso/contentgen/content-gen/scenes', icon: <Layers size={16} /> },
          { label: 'Generate',  href: '/isso/contentgen/content-gen/generate', icon: <Sparkles size={16} /> },
          { label: 'Gallery',  href: '/isso/contentgen/content-gen/gallery', icon: <Upload size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'agents',
    label: 'Agents',
    description: 'Monitor automation running in the background.',
    hotkey: '⌘3',
    icon: <Sparkles size={20} />,
    sections: [
      {
        title: 'Agents',
        hideTitle: true,
        items: [
          { label: 'Activity',  href: '/isso/contentgen/agents', icon: <Activity size={16} /> },
          { label: 'Reports',   href: '/isso/contentgen/agents', icon: <FileText size={16} /> },
          { label: 'Requests',  href: '/isso/contentgen/agents', icon: <MessageSquare size={16} /> },
        ],
      },
    ],
  },
];

export const CONTENT_GEN_PERSISTENT_NAV: NavItem[] = [
  { label: 'Schedule',      href: '/isso/contentgen/schedule',      icon: <Calendar size={16} /> },
  { label: 'Analytics',     href: '/isso/contentgen/analytics',    icon: <BarChart2 size={16} /> },
  { label: 'Models',        href: '/isso/contentgen/models',       icon: <Users2 size={16} /> },
  { label: 'Notifications', href: '/isso/contentgen/notifications', icon: <Bell size={16} />, badge: 'dot' as const },
];
