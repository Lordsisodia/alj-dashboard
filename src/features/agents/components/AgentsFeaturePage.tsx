'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Bot, Activity, FileText, Plus, LayoutDashboard, Network, History, Repeat, CircleDot, Inbox, DollarSign } from 'lucide-react';
import type { Tab } from '../types';
import { useAgentTasks } from '../hooks';
import ComingSoon from '@/components/ui/coming-soon';

// All sub-views are lazy — only the active tab's code ships to the client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OverviewView = dynamic(() => import('./overview/OverviewView').then(m => m.OverviewView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OrgChartView = dynamic(() => import('./orgchart/OrgChartView').then(m => m.OrgChartView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActivityView = dynamic(() => import('./activity').then(m => m.ActivityView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActivityLogView = dynamic(() => import('./log/ActivityLogView').then(m => m.ActivityLogView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RoutinesView = dynamic(() => import('./routines/RoutinesView').then(m => m.RoutinesView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IssuesView = dynamic(() => import('./issues/IssuesView').then(m => m.IssuesView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InboxView = dynamic(() => import('./inbox/InboxView').then(m => m.InboxView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CostsView = dynamic(() => import('./costs/CostsView').then(m => m.CostsView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReportsView = dynamic(() => import('./reports').then(m => m.ReportsView as any), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RequestsView = dynamic(() => import('./requests').then(m => m.RequestsView as any), { ssr: false });

function StepNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">
      {n}
    </span>
  );
}

export default function AgentsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeFilter, setActiveFilter] = useState('all');
  const { tasks, retryTask, addAgent } = useAgentTasks();

  return (
    <ContentPageShell
      icon={<ProductIcon product="agents" size={32} />}
      title="Agents"
      stat={{ label: 'Coming Soon', value: '-' }}
      searchPlaceholder="Search agents, tasks..."
      actionLabel="New Agent"
      actionIcon={<Plus size={14} />}
      accentGradient="linear-gradient(135deg, #374151, #111827)"
      actionDropdownItems={[
        { id: 'scraper',   label: 'Scraper Agent',  icon: <Activity size={13} />, onClick: () => { addAgent('scraper');   setActiveTab('activity'); } },
        { id: 'scheduler', label: 'Post Scheduler', icon: <Bot size={13} />,      onClick: () => { addAgent('scheduler'); setActiveTab('activity'); } },
        { id: 'reporter',  label: 'Report Agent',   icon: <FileText size={13} />, onClick: () => { addAgent('reporter');  setActiveTab('activity'); } },
      ]}
      tabs={[
        { id: 'overview',  label: 'Overview',  icon: <LayoutDashboard size={12} /> },
        { id: 'orgchart',  label: 'Org Chart', icon: <Network size={12} /> },
        { id: 'activity',  label: 'Runs',      icon: <StepNum n={1} /> },
        { id: 'log',       label: 'Activity',  icon: <History size={12} /> },
        { id: 'routines',  label: 'Routines',  icon: <Repeat size={12} /> },
        { id: 'issues',    label: 'Issues',    icon: <CircleDot size={12} /> },
        { id: 'inbox',     label: 'Inbox',     icon: <Inbox size={12} /> },
        { id: 'costs',     label: 'Costs',     icon: <DollarSign size={12} /> },
        { id: 'reports',   label: 'Reports',   icon: <StepNum n={2} /> },
        { id: 'requests',  label: 'Requests',  icon: <StepNum n={3} /> },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as Tab)}
      nextProduct={{ label: 'Recon', icon: <ProductIcon product="recon" size={16} />, href: '/isso/recon' }}
      filterChips={activeTab === 'activity' ? [
        { id: 'all', label: 'All' }, { id: 'running', label: 'Running' },
        { id: 'completed', label: 'Completed' }, { id: 'failed', label: 'Failed' },
      ] : []}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <div className="relative flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 px-6 py-6">
            {activeTab === 'overview'  && <OverviewView />}
            {activeTab === 'orgchart'  && <OrgChartView />}
            {activeTab === 'activity'  && <ActivityView {...{ tasks, filter: activeFilter, onRetry: retryTask } as any} />}
            {activeTab === 'log'       && <ActivityLogView />}
            {activeTab === 'routines'  && <RoutinesView />}
            {activeTab === 'issues'    && <IssuesView />}
            {activeTab === 'inbox'     && <InboxView />}
            {activeTab === 'costs'     && <CostsView />}
            {activeTab === 'reports'   && <ReportsView />}
            {activeTab === 'requests'  && <RequestsView />}
          </motion.div>
        </AnimatePresence>
        <ComingSoon />
      </div>
    </ContentPageShell>
  );
}
