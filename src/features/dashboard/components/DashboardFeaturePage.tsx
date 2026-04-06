'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { LayoutDashboard, CheckSquare, Layers, Sparkles, Plus } from 'lucide-react';
import type { Tab } from '../types';
import { KpiCards } from './overview/KpiCards';
import { QuickActions } from './overview/QuickActions';
import { ActivityFeed } from './overview/ActivityFeed';
import { UpcomingPosts } from './overview/UpcomingPosts';
import { ModelsOverview } from './overview/ModelsOverview';
import { ModelPnLCard } from './overview/ModelPnLCard';
import { ExpiringSubscriberQueue } from './overview/ExpiringSubscriberQueue';
import { ApprovalsTabContent } from '@/features/approvals/components';
import { PlaceholderContent } from './placeholders/PlaceholderContent';
import { SwipeTabContent } from '@/features/hub-swipe/components/SwipeTabContent';

function OverviewContent() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-xl font-bold text-neutral-900">Good morning, Alex 👋</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Here&apos;s what&apos;s happening today — {today}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
        <KpiCards />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
        <ModelPnLCard />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <QuickActions />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="grid grid-cols-3 gap-4"
      >
        <ActivityFeed />
        <div className="flex flex-col gap-4">
          <UpcomingPosts />
          <ExpiringSubscriberQueue />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <ModelsOverview />
      </motion.div>
    </div>
  );
}

export default function DashboardFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeFilter, setActiveFilter] = useState('all');

  const tabContent: Record<Tab, React.ReactNode> = {
    overview:    <OverviewContent />,
    approvals:   <ApprovalsTabContent />,
    'swipe-rate': <SwipeTabContent />,
  };

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Hub"
      stat={{ label: 'Active models', value: 4 }}
      searchPlaceholder="Search content, models, approvals..."
      actionLabel="New"
      actionIcon={<Plus size={14} />}
      tabs={[
        { id: 'overview',    label: '1. Overview',    icon: <LayoutDashboard size={13} /> },
        { id: 'approvals',   label: '2. Approvals',   icon: <CheckSquare size={13} /> },
        { id: 'swipe-rate',  label: '3. Swipe & Rate', icon: <Layers size={13} /> },
      ]}
      nextProduct={{ label: 'Content Gen', icon: <Sparkles size={13} />, href: '/isso/ideas' }}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',   label: 'All' },
        { id: 'today', label: 'Today' },
        { id: 'week',  label: 'This Week' },
        { id: 'month', label: 'This Month' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <div className="p-4">
        {tabContent[activeTab]}
      </div>
    </ContentPageShell>
  );
}
