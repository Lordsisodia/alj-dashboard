'use client';

import { BarChart2, Heart, X, TrendingUp } from 'lucide-react';
import { StatCard } from '@/features/analytics/components/stats';
import { LastSessionCard } from './LastSessionCard';
import { VaultHealthBar } from './VaultHealthBar';
import { HubSwipeActivityFeed } from './HubSwipeActivityFeed';
import { HubQuickActions } from './HubQuickActions';
import { POSTS } from '../../constants';

interface HubDashboardTabProps {
  onStartSession: () => void;
  onBrowseVault: () => void;
  onViewSaved: () => void;
}

export function HubDashboardTab({ onStartSession, onBrowseVault, onViewSaved }: HubDashboardTabProps) {
  const vaultSize    = POSTS.length;
  const approved     = POSTS.filter(p => p.approved).length;
  const passed       = vaultSize - approved;
  const approvalRate = vaultSize > 0 ? Math.round((approved / vaultSize) * 100) : 0;

  const kpis = [
    {
      label: 'Vault Size',
      value: vaultSize,
      icon: <BarChart2 size={15} />,
      iconColor: '#833ab4',
      delay: 0,
      suffix: '',
    },
    {
      label: 'Approved',
      value: approved,
      icon: <Heart size={15} />,
      iconColor: '#ff0069',
      change: 2,
      changeLabel: 'vs last week',
      delay: 0.07,
      suffix: '',
    },
    {
      label: 'Passed',
      value: passed,
      icon: <X size={15} />,
      iconColor: '#a3a3a3',
      delay: 0.14,
      suffix: '',
    },
    {
      label: 'Approval Rate',
      value: approvalRate,
      icon: <TrendingUp size={15} />,
      iconColor: '#16a34a',
      change: 4,
      changeLabel: 'vs last week',
      delay: 0.21,
      suffix: '%',
    },
  ];

  return (
    <div className="p-4 space-y-4" style={{ backgroundColor: '#fafafa' }}>
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      {/* Session + vault health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <LastSessionCard onStartSession={onStartSession} />
        <VaultHealthBar />
      </div>

      {/* Activity feed */}
      <HubSwipeActivityFeed />

      {/* Quick actions */}
      <HubQuickActions
        onStartSession={onStartSession}
        onBrowseVault={onBrowseVault}
        onViewSaved={onViewSaved}
      />
    </div>
  );
}
