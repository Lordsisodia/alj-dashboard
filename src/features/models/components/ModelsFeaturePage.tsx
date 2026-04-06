'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Users2, UserPlus, BarChart2 } from 'lucide-react';
import type { Tab } from '../types';
import { RosterView } from './roster/RosterView';
import { AddModelDrawer } from './AddModelDrawer';

const OnboardingView  = dynamic(() => import('./onboarding/OnboardingView').then(m => ({ default: m.OnboardingView })),   { ssr: false });
const PerformanceView = dynamic(() => import('./performance/PerformanceView').then(m => ({ default: m.PerformanceView })), { ssr: false });

export default function ModelsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('onboarding');
  const [activeFilter, setActiveFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="content-gen" size={32} />}
        title="Models"
        stat={{ label: 'Active models', value: 4 }}
        searchPlaceholder="Search models..."
        actionLabel="Add Model"
        actionIcon={<UserPlus size={14} />}
        onAction={() => setDrawerOpen(true)}
        tabs={[
          { id: 'onboarding',  label: 'Onboarding',  icon: <UserPlus size={13} /> },
          { id: 'roster',      label: 'Roster',      icon: <Users2 size={13} /> },
          { id: 'performance', label: 'Performance', icon: <BarChart2 size={13} /> },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as Tab)}
        filterChips={activeTab === 'roster' ? [
          { id: 'all',        label: 'All' },
          { id: 'active',     label: 'Active' },
          { id: 'onboarding', label: 'Onboarding' },
          { id: 'paused',     label: 'Paused' },
          { id: 'no-brief',   label: 'No Brief' },
        ] : undefined}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      >
        {activeTab === 'roster' && <RosterView activeFilter={activeFilter} />}
        {activeTab === 'onboarding' && <OnboardingView />}
        {activeTab === 'performance' && <PerformanceView />}
      </ContentPageShell>

      <AddModelDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
