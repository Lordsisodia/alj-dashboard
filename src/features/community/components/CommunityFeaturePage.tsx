'use client';

import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import type { Tab } from '../types';
import { POSTS } from '../constants';
import { HubDashboardTab } from './dashboard/HubDashboardTab';
import { VaultTabContent } from './vault/VaultTabContent';
import { SwipeTabContent } from '@/features/hub-swipe/components/SwipeTabContent';
import { SavedTabContent } from './saved/SavedTabContent';

// Re-export for Recon's existing import path
export { LeaderboardSidebar } from './sidebar/LeaderboardSidebar';

function StepNum({ n }: { n: number }) {
  return <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">{n}</span>;
}

export default function CommunityFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const savedCount   = POSTS.filter(p => p.saved).length;
  const approvedCount = POSTS.filter(p => p.approved).length;

  function switchTo(tab: Tab) {
    setActiveTab(tab);
  }

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Hub"
      stat={{ label: 'Approved', value: approvedCount }}
      searchPlaceholder="Search vault, creators, niches..."
      actionLabel="New Post"
      tabs={[
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard size={12} />,
        },
        {
          id: 'vault',
          label: 'Vault',
          icon: <StepNum n={1} />,
        },
        {
          id: 'approve',
          label: 'Approve',
          icon: <StepNum n={2} />,
        },
        {
          id: 'saved',
          label: `Saved${savedCount > 0 ? ` (${savedCount})` : ''}`,
          icon: <StepNum n={3} />,
        },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      nextProduct={{ label: 'Content Gen', icon: <ProductIcon product="content-gen" size={13} />, href: '/isso/ideas' }}
    >
      {activeTab === 'dashboard' && (
        <HubDashboardTab
          onStartSession={() => switchTo('approve')}
          onBrowseVault={() => switchTo('vault')}
          onViewSaved={() => switchTo('saved')}
        />
      )}

      {activeTab === 'vault' && (
        <VaultTabContent onStartSession={() => switchTo('approve')} />
      )}

      {activeTab === 'approve' && (
        <div className="p-4" style={{ backgroundColor: '#fafafa' }}>
          <SwipeTabContent />
        </div>
      )}

      {activeTab === 'saved' && (
        <SavedTabContent onBrowseVault={() => switchTo('vault')} />
      )}
    </ContentPageShell>
  );
}
