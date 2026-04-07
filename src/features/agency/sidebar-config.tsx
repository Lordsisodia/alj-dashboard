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
            { label: 'Dashboard', href: '/isso/agency',           icon: <LayoutDashboard size={16} /> },
            { label: 'Reports',   href: '/isso/agency/reports',   icon: <FileText size={16} /> },
            { label: 'Analytics', href: '/isso/agency/analytics', icon: <BarChart2 size={16} /> },
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
            { label: 'All Clients', href: '/isso/agency/clients',             icon: <Users2 size={16} /> },
            { label: 'Pipeline',    href: '/isso/agency/clients/pipeline',    icon: <TrendingUp size={16} /> },
            { label: 'Onboarding',  href: '/isso/agency/clients/onboarding',  icon: <FileText size={16} /> },
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
            { label: 'All Models', href: '/isso/agency/models',         icon: <Users2 size={16} /> },
            { label: 'Revenue',    href: '/isso/agency/models/revenue', icon: <TrendingUp size={16} /> },
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
            { label: 'Messages', href: '/isso/agency/comms',        icon: <MessageSquare size={16} /> },
            { label: 'Briefs',   href: '/isso/agency/comms/briefs', icon: <FileText size={16} /> },
          ],
        },
      ],
    },
  ],
  persistentNav: [
    { label: 'Schedule',      href: '/isso/agency/schedule',      icon: <Calendar size={16} /> },
    { label: 'Team',          href: '/isso/agency/team',          icon: <Users2 size={16} /> },
    { label: 'Notifications', href: '/isso/agency/notifications', icon: <Bell size={16} /> },
    { label: 'Settings',      href: '/isso/agency/settings',      icon: <Settings size={16} /> },
  ],
  changelog: [
    { date: 'Apr 2026', tag: 'new',    title: 'Agency dashboard launched' },
    { date: 'Apr 2026', tag: 'update', title: 'Client pipeline view added' },
  ],
};
