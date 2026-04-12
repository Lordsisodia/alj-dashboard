'use client';

import {
  LayoutDashboard, TrendingUp, Briefcase, Users2,
  Calendar, Settings, CreditCard, UserPlus, UserCheck,
  CheckSquare, MessageSquare,
} from 'lucide-react';
import type { SectionConfig, NavItem } from '@/shared/layout/isso-sidebar/sidebar-config';

export const OWNERS_NAV_CONFIG: SectionConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'P&L summary, KPIs, and team health.',
    hotkey: '⌘1',
    icon: <LayoutDashboard size={20} />,
    sections: [
      {
        title: 'Overview',
        hideTitle: true,
        items: [
          { label: 'Dashboard',  href: '/agency',             icon: <LayoutDashboard size={16} /> },
          { label: 'Analytics',  href: '/agency/analytics',   icon: <TrendingUp size={16} /> },
          { label: 'Billings',   href: '/agency/billings',    icon: <CreditCard size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    description: 'Models, staff, and recruitment.',
    hotkey: '⌘2',
    icon: <Briefcase size={20} />,
    sections: [
      {
        title: 'Operations',
        hideTitle: true,
        items: [
          { label: 'Models',      href: '/agency/models',          icon: <Users2 size={16} /> },
          { label: 'Staff',       href: '/agency/staff',           icon: <UserCheck size={16} /> },
          { label: 'Tasks',       href: '/agency/staff/tasks',     icon: <CheckSquare size={16} /> },
          { label: 'Recruitment', href: '/agency/recruitment',     icon: <UserPlus size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Team management and communications.',
    hotkey: '⌘3',
    icon: <Users2 size={20} />,
    sections: [
      {
        title: 'Team',
        hideTitle: true,
        items: [
          { label: 'Team',  href: '/agency/team',  icon: <Users2 size={16} /> },
          { label: 'Comms', href: '/agency/comms', icon: <MessageSquare size={16} /> },
        ],
      },
    ],
  },
];

export const OWNERS_PERSISTENT_NAV: NavItem[] = [
  { label: 'Schedule', href: '/agency/schedule', icon: <Calendar size={16} /> },
  { label: 'Settings', href: '/agency/settings', icon: <Settings size={16} /> },
];
