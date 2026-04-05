'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Bot, Activity, FileText, MessageSquare, Plus } from 'lucide-react';
import type { Tab } from '../types';
import { ActivityView } from './activity';
import { ReportsView } from './reports';
import { RequestsView } from './requests';

export default function AgentsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('activity');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <ContentPageShell
      icon={<ProductIcon product="agents" size={32} />}
      title="Agents"
      stat={{ label: 'Active workers', value: 4 }}
      searchPlaceholder="Search agents, tasks..."
      actionLabel="New Agent"
      actionIcon={<Plus size={14} />}
      actionDropdownItems={[
        { id: 'scraper',   label: 'Scraper Agent',  icon: <Activity size={13} /> },
        { id: 'scheduler', label: 'Post Scheduler', icon: <Bot size={13} /> },
        { id: 'reporter',  label: 'Report Agent',   icon: <FileText size={13} /> },
      ]}
      tabs={[
        { id: 'activity',  label: 'Activity',  icon: <Activity size={13} /> },
        { id: 'reports',   label: 'Reports',   icon: <FileText size={13} /> },
        { id: 'requests',  label: 'Requests',  icon: <MessageSquare size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as Tab)}
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
            {activeTab === 'activity'  && <ActivityView filter={activeFilter} />}
            {activeTab === 'reports'   && <ReportsView />}
            {activeTab === 'requests'  && <RequestsView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
