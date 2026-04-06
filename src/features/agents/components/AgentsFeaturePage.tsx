'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Bot, Activity, FileText, Plus } from 'lucide-react';
import type { Tab } from '../types';
import { useAgentTasks } from '../hooks';

function StepNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">
      {n}
    </span>
  );
}
import { ActivityView } from './activity';
import { ReportsView } from './reports';
import { RequestsView } from './requests';

export default function AgentsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('activity');
  const [activeFilter, setActiveFilter] = useState('all');
  const { tasks, retryTask, addAgent } = useAgentTasks();

  return (
    <ContentPageShell
      icon={<ProductIcon product="agents" size={32} />}
      title="Agents"
      stat={{ label: 'Active workers', value: tasks.filter(t => t.status === 'running').length }}
      searchPlaceholder="Search agents, tasks..."
      actionLabel="New Agent"
      actionIcon={<Plus size={14} />}
      actionDropdownItems={[
        {
          id: 'scraper',
          label: 'Scraper Agent',
          icon: <Activity size={13} />,
          onClick: () => { addAgent('scraper'); setActiveTab('activity'); },
        },
        {
          id: 'scheduler',
          label: 'Post Scheduler',
          icon: <Bot size={13} />,
          onClick: () => { addAgent('scheduler'); setActiveTab('activity'); },
        },
        {
          id: 'reporter',
          label: 'Report Agent',
          icon: <FileText size={13} />,
          onClick: () => { addAgent('reporter'); setActiveTab('activity'); },
        },
      ]}
      tabs={[
        { id: 'activity',  label: 'Activity',  icon: <StepNum n={1} /> },
        { id: 'reports',   label: 'Reports',   icon: <StepNum n={2} /> },
        { id: 'requests',  label: 'Requests',  icon: <StepNum n={3} /> },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as Tab)}
      nextProduct={{ label: 'Recon', icon: <ProductIcon product="recon" size={16} />, href: '/isso/recon' }}
      filterChips={[
        { id: 'all',       label: 'All' },
        { id: 'running',   label: 'Running' },
        { id: 'completed', label: 'Completed' },
        { id: 'failed',    label: 'Failed' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <div className="px-6 py-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeTab === 'activity' && (
              <ActivityView tasks={tasks} filter={activeFilter} onRetry={retryTask} />
            )}
            {activeTab === 'reports'  && <ReportsView />}
            {activeTab === 'requests' && <RequestsView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
