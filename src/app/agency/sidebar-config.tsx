'use client';

import {
  LayoutDashboard, TrendingUp, BarChart2, Users2,
  Calendar, UserPlus, DollarSign, Shield, Lightbulb,
  CreditCard,
} from 'lucide-react';
import type { SectionConfig, NavItem } from '@/shared/layout/isso-sidebar/sidebar-config';

// Owners domain - P&L, KPIs, and oversight focused
export const OWNERS_NAV_CONFIG: SectionConfig[] = [
  {
    id: 'dashboard',
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
          { label: 'P&L Report', href: '/agency/reports',      icon: <DollarSign size={16} /> },
          { label: 'Billings',  href: '/agency/billings',     icon: <CreditCard size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Revenue and performance metrics.',
    hotkey: '⌘2',
    icon: <TrendingUp size={20} />,
    sections: [
      {
        title: 'Analytics',
        hideTitle: true,
        items: [
          { label: 'Overview', href: '/agency/analytics', icon: <TrendingUp size={16} /> },
          { label: 'Revenue',  href: '/agency/analytics', icon: <DollarSign size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Team performance and management.',
    hotkey: '⌘3',
    icon: <Users2 size={20} />,
    sections: [
      {
        title: 'Team',
        hideTitle: true,
        items: [
          { label: 'Overview', href: '/agency/team',  icon: <Users2 size={16} /> },
          { label: 'Members',  href: '/agency/team',  icon: <UserPlus size={16} /> },
          { label: 'Roles',    href: '/agency/team',  icon: <Shield size={16} /> },
        ],
      },
    ],
  },
  {
    id: 'ideas',
    label: 'Ideas',
    description: 'Content pipeline and briefs.',
    hotkey: '⌘4',
    icon: <Lightbulb size={20} />,
    sections: [
      {
        title: 'Ideas',
        hideTitle: true,
        items: [
          { label: 'Briefs', href: '/agency/ideas', icon: <Lightbulb size={16} /> },
        ],
      },
    ],
  },
];

export const OWNERS_PERSISTENT_NAV: NavItem[] = [
  { label: 'Schedule', href: '/agency/schedule', icon: <Calendar size={16} /> },
  { label: 'Models',  href: '/agency/models',  icon: <Users2 size={16} /> },
  { label: 'Settings', href: '/agency/settings', icon: <Shield size={16} /> },
];
