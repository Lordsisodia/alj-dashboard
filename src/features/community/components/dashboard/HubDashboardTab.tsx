'use client';

import { TrendingUp, Clock, CheckCircle2, Bookmark, Radio, Inbox, Send, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '@/features/analytics/components/stats';
import { StatusStrip } from '@/components/ui/status-strip';
import { LastSessionCard } from './LastSessionCard';
import { VaultHealthBar } from './VaultHealthBar';
import { HubSwipeActivityFeed } from './HubSwipeActivityFeed';
import { HubQuickActions } from './HubQuickActions';
import { POSTS, MOCK_SENT_THIS_WEEK, MOCK_PACE } from '../../constants';

interface HubDashboardTabProps {
  onStartSession: () => void;
  onBrowseVault: () => void;
  onViewSaved: () => void;
  onSendToClient?: () => void;
}

export function HubDashboardTab({ onStartSession, onBrowseVault, onViewSaved, onSendToClient }: HubDashboardTabProps) {
  const approved     = POSTS.filter(p => p.approved).length;
  const saved        = POSTS.filter(p => p.saved).length;
  const vaultSize    = POSTS.length;
  const approvalRate = vaultSize > 0 ? Math.round((approved / vaultSize) * 100) : 0;
  const inQueue      = POSTS.filter(p => !p.approved && !p.saved).length;

  const kpis = [
    {
      label: 'In Queue',
      value: inQueue,
      icon: <Inbox size={15} />,
      iconColor: '#2563eb',
      delay: 0,
    },
    {
      label: 'Sent This Week',
      value: MOCK_SENT_THIS_WEEK,
      icon: <Send size={15} />,
      iconColor: '#22c55e',
      delay: 0.07,
    },
    {
      label: 'Approval Rate',
      value: approvalRate,
      suffix: '%',
      icon: <TrendingUp size={15} />,
      iconColor: '#2563eb',
      delay: 0.14,
    },
    {
      label: 'Swipe Pace',
      value: MOCK_PACE,
      suffix: '/s',
      icon: <Zap size={15} />,
      iconColor: '#f59e0b',
      delay: 0.21,
    },
  ];

  return (
    <div className="flex gap-5 h-full">

      {/* ── Main content column ─────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5 overflow-y-auto pt-4 pb-4 px-4">

        {/* ① Status strip */}
        <StatusStrip
          status={{ label: 'Hub active', active: true }}
          stats={[
            { icon: <Radio size={11} />,       value: vaultSize,    label: 'vaulted',      accent: '#2563eb' },
            { icon: <CheckCircle2 size={11} />, value: approved,     label: 'approved',     accent: '#2563eb' },
            { icon: <TrendingUp size={11} />,   value: `${approvalRate}%`, label: 'approval rate', accent: '#22c55e' },
            { icon: <Bookmark size={11} />,     value: saved,        label: 'saved',        accent: '#2563eb' },
          ]}
          iconColor="text-blue-600"
          rightSlot={<><Clock size={10} className="text-blue-600" /> Last scrape: just now</>}
        />

        {/* ② KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map(k => (
            <StatCard key={k.label} {...k} />
          ))}
        </div>

        {/* ③ Session + vault health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LastSessionCard />
          <VaultHealthBar />
        </div>

        {/* ④ Quick actions */}
        <HubQuickActions
          onStartSession={onStartSession}
          onBrowseVault={onBrowseVault}
          onSendToClient={onSendToClient ?? (() => {})}
        />
      </div>

      {/* ── Right sidebar ──────────────────────────────────── */}
      <div
        className="w-[280px] flex-shrink-0 rounded-xl overflow-hidden mt-4 mr-4"
        style={{
          backgroundColor: '#fff',
          border: '1px solid rgba(0,0,0,0.07)',
          height: 'calc(100vh - 196px)',
          position: 'sticky',
          top: 0,
        }}
      >
        <HubSwipeActivityFeed />
      </div>

    </div>
  );
}
