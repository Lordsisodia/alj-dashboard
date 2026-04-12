'use client';

import {
  MessageSquare, Users2, CheckSquare, Bell,
  BarChart2, Activity, Settings,
} from 'lucide-react';
import type { SectionConfig, NavItem } from '@/shared/layout/isso-sidebar/sidebar-config';

// Chatter domain - inbox and messaging focused
export const CHATTER_NAV_CONFIG: SectionConfig[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    description: 'Fan messages and conversations.',
    hotkey: '⌘1',
    icon: <MessageSquare size={20} />,
    sections: [
      {
        title: 'Inbox',
        hideTitle: true,
        items: [
          { label: 'Inbox',     href: '/isso/chatter',           icon: <MessageSquare size={16} /> },
          { label: 'Chatter',   href: '/isso/chatter/chatter',   icon: <MessageSquare size={16} /> },
          { label: 'Templates', href: '/isso/chatter/chatter',   icon: <CheckSquare size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'models',
    label: 'Models',
    description: 'Assigned model assignments.',
    hotkey: '⌘2',
    icon: <Users2 size={20} />,
    sections: [
      {
        title: 'Models',
        hideTitle: true,
        items: [
          { label: 'Models', href: '/isso/chatter/models', icon: <Users2 size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'activity',
    label: 'Activity',
    description: 'Performance and activity.',
    hotkey: '⌘3',
    icon: <Activity size={20} />,
    sections: [
      {
        title: 'Activity',
        hideTitle: true,
        items: [
          { label: 'Activity', href: '/isso/chatter/agents', icon: <Activity size={16} /> },
          { label: 'Reports',  href: '/isso/chatter/agents', icon: <BarChart2 size={16} /> },
        ],
      },
    ],
  },
];

export const CHATTER_PERSISTENT_NAV: NavItem[] = [
  { label: 'Notifications', href: '/isso/chatter/notifications', icon: <Bell size={16} />, badge: 'dot' as const },
  { label: 'Settings',      href: '/isso/chatter/settings',      icon: <Settings size={16} /> },
];
