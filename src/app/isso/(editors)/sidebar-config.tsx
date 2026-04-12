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
          { label: 'Dashboard',  href: '/isso/editors',              icon: <LayoutDashboard size={16} /> },
          { label: 'Approvals', href: '/isso/editors/approvals',   icon: <CheckSquare size={16} /> },
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
          { label: 'Ideas',    href: '/isso/editors/ideas',               icon: <Lightbulb size={16} /> },
          { label: 'Generate', href: '/isso/editors/content-gen/generate', icon: <Sparkles size={16} /> },
          { label: 'Gallery',  href: '/isso/editors/content-gen/gallery', icon: <Upload size={16} /> },
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
          { label: 'Calendar',  href: '/isso/editors/schedule', icon: <Calendar size={16} /> },
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
          { label: 'Models',  href: '/isso/editors/models', icon: <Users2 size={16} /> },
        ],
      },
    ],
  },
];

export const EDITORS_PERSISTENT_NAV: NavItem[] = [
  { label: 'Analytics',     href: '/isso/editors/analytics',     icon: <BarChart2 size={16} /> },
  { label: 'Models',        href: '/isso/editors/models',        icon: <Users2 size={16} /> },
  { label: 'Notifications', href: '/isso/editors/notifications', icon: <Bell size={16} />, badge: 'dot' as const },
];
