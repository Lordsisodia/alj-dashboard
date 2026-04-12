import type { SidebarConfig } from '@/shared/layout/isso-sidebar/IssoSidebarShell';
import {
  LayoutDashboard, Users2, TrendingUp, FileText, Settings,
  MessageSquare, Calendar, BarChart2, Bell, Briefcase,
} from 'lucide-react';

export const AGENCY_SIDEBAR_CONFIG: SidebarConfig = {
  appName: 'agency',
  planLabel: 'Upgrade Agency Plan',
  navConfig: [
    {
      id: 'overview',
      label: 'Overview',
      description: 'Agency performance at a glance.',
      hotkey: '⌘1',
      icon: <LayoutDashboard size={20} />,
      sections: [
        {
          title: 'Overview',
          hideTitle: true,
          items: [
            { label: 'Dashboard', href: '/agency',           icon: <LayoutDashboard size={16} /> },
            { label: 'Reports',   href: '/agency/reports',   icon: <FileText size={16} /> },
            { label: 'Analytics', href: '/agency/analytics', icon: <BarChart2 size={16} /> },
          ],
        },
      ],
    },
    {
      id: 'clients',
      label: 'Clients',
      description: 'Manage your client roster.',
      hotkey: '⌘2',
      icon: <Briefcase size={20} />,
      sections: [
        {
          title: 'Clients',
          hideTitle: true,
          items: [
            { label: 'All Clients', href: '/agency/clients',             icon: <Users2 size={16} /> },
            { label: 'Pipeline',    href: '/agency/clients/pipeline',    icon: <TrendingUp size={16} /> },
            { label: 'Onboarding',  href: '/agency/clients/onboarding',  icon: <FileText size={16} /> },
          ],
        },
      ],
    },
    {
      id: 'models',
      label: 'Models',
      description: 'Track talent and model accounts.',
      hotkey: '⌘3',
      icon: <Users2 size={20} />,
      sections: [
        {
          title: 'Models',
          hideTitle: true,
          items: [
            { label: 'All Models', href: '/agency/models',         icon: <Users2 size={16} /> },
            { label: 'Revenue',    href: '/agency/models/revenue', icon: <TrendingUp size={16} /> },
          ],
        },
      ],
    },
    {
      id: 'comms',
      label: 'Comms',
      description: 'Internal messaging and briefings.',
      hotkey: '⌘4',
      icon: <MessageSquare size={20} />,
      sections: [
        {
          title: 'Comms',
          hideTitle: true,
          items: [
            { label: 'Messages', href: '/agency/comms',        icon: <MessageSquare size={16} /> },
            { label: 'Briefs',   href: '/agency/comms/briefs', icon: <FileText size={16} /> },
          ],
        },
      ],
    },
  ],
  persistentNav: [
    { label: 'Schedule',      href: '/agency/schedule',      icon: <Calendar size={16} /> },
    { label: 'Team',          href: '/agency/team',          icon: <Users2 size={16} /> },
    { label: 'Notifications', href: '/agency/notifications', icon: <Bell size={16} /> },
    { label: 'Settings',      href: '/agency/settings',      icon: <Settings size={16} /> },
  ],
  changelog: [
    { date: 'Apr 2026', tag: 'new',    title: 'Agency dashboard launched' },
    { date: 'Apr 2026', tag: 'update', title: 'Client pipeline view added' },
  ],
};
