'use client';

import {
  LayoutDashboard, Layers, Sparkles, CheckSquare,
  Calendar, BarChart2, Users2, Upload, Activity,
  FileText, MessageSquare, Lightbulb, Bell,
} from 'lucide-react';
import type { SectionConfig, NavItem } from '@/shared/layout/isso-sidebar/sidebar-config';

// Editors domain - content creation focused
export const EDITORS_NAV_CONFIG: SectionConfig[] = [
  {
    id: 'hub',
    label: 'Hub',
    description: 'Content approvals and management.',
    hotkey: '⌘1',
    icon: <Layers size={20} />,
    sections: [
      {
        title: 'Hub',
        hideTitle: true,
        items: [
          { label: 'Dashboard',  href: '/models',              icon: <LayoutDashboard size={16} /> },
          { label: 'Approvals', href: '/models/approvals',   icon: <CheckSquare size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'content-gen',
    label: 'Content Gen',
    description: 'Generate and manage content.',
    hotkey: '⌘2',
    icon: <Sparkles size={20} />,
    sections: [
      {
        title: 'Content Gen',
        hideTitle: true,
        items: [
          { label: 'Ideas',    href: '/models/ideas',               icon: <Lightbulb size={16} /> },
          { label: 'Generate', href: '/models/content-gen/generate', icon: <Sparkles size={16} /> },
          { label: 'Gallery',  href: '/models/content-gen/gallery', icon: <Upload size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    description: 'Content calendar and planning.',
    hotkey: '⌘3',
    icon: <Calendar size={20} />,
    sections: [
      {
        title: 'Schedule',
        hideTitle: true,
        items: [
          { label: 'Calendar',  href: '/models/schedule', icon: <Calendar size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'models',
    label: 'Models',
    description: 'Model content and references.',
    hotkey: '⌘4',
    icon: <Users2 size={20} />,
    sections: [
      {
        title: 'Models',
        hideTitle: true,
        items: [
          { label: 'Models',  href: '/models/models', icon: <Users2 size={16} /> },
        ],
      },
    ],
  },
];

export const EDITORS_PERSISTENT_NAV: NavItem[] = [
  { label: 'Analytics',     href: '/models/analytics',     icon: <BarChart2 size={16} /> },
  { label: 'Models',        href: '/models/models',        icon: <Users2 size={16} /> },
  { label: 'Notifications', href: '/models/notifications', icon: <Bell size={16} />, badge: 'dot' as const },
];
