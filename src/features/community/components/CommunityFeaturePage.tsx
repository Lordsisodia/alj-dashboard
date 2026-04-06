'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
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

/** Small numbered circle for pills ①②③ */
function NumBadge({ n }: { n: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-[9px] font-black leading-none flex-shrink-0"
      style={{
        width: 15,
        height: 15,
        background: 'currentColor',
        color: 'inherit',
      }}
    >
      <span style={{ color: '#fff', fontSize: 9 }}>{n}</span>
    </span>
  );
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
          icon: <span style={{ fontSize: 13 }}>📊</span>,
        },
        {
          id: 'vault',
          label: '① Vault',
          icon: <NumBadge n={1} />,
        },
        {
          id: 'approve',
          label: '② Approve',
          icon: <NumBadge n={2} />,
        },
        {
          id: 'saved',
          label: `③ Saved${savedCount > 0 ? ` (${savedCount})` : ''}`,
          icon: <NumBadge n={3} />,
        },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      nextProduct={{ label: 'Content Gen', icon: <Sparkles size={13} />, href: '/isso/ideas' }}
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
