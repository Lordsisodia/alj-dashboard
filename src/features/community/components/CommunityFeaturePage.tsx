'use client';

import { useState } from 'react';
import { LayoutDashboard, BarChart2, ChevronDown } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { LiveActivityButton } from '@/components/ui/live-activity-button';
import SuggestiveSearch from '@/components/ui/suggestive-search';
import type { Tab } from '../types';
import { POSTS } from '../constants';
import { HubDashboardTab } from './dashboard/HubDashboardTab';
import { VaultTabContent } from './vault/VaultTabContent';
import { ApproveTabContent } from './approve/ApproveTabContent';
import { SavedTabContent } from './saved/SavedTabContent';

// Re-export for Recon's existing import path
export { LeaderboardSidebar } from './sidebar/LeaderboardSidebar';

function StepNum({ n }: { n: number }) {
  return <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">{n}</span>;
}

export default function CommunityFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const savedCount    = POSTS.filter(p => p.saved).length;
  const approvedCount = POSTS.filter(p => p.approved).length;

  function switchTo(tab: Tab) {
    setActiveTab(tab);
  }

  const searchBar = <SuggestiveSearch onChange={() => {}} />;

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Hub"
      accentGradient="linear-gradient(135deg, #2563eb, #7c3aed)"
      stat={{ label: 'Approved', value: approvedCount }}
      searchBarComponent={searchBar}
      searchPlaceholder="Search vault, creators, niches..."
      actionLabel="New Post"
      tabs={[
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard size={12} />,
        },
        {
          id: 'approve',
          label: 'Approve',
          icon: <StepNum n={1} />,
        },
        {
          id: 'vault',
          label: 'Vault',
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
      nextProduct={{ label: 'Content Gen', icon: <ProductIcon product="content-gen" size={13} />, href: '/content-gen/ideas' }}
      filterRightSlot={activeTab !== 'dashboard' ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnalytics(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.09)' }}
          >
            <BarChart2 size={12} style={{ color: '#2563eb' }} />
            {showAnalytics ? 'Hide' : 'Show'} analytics
            <ChevronDown size={10} className={`transition-transform duration-150 ${showAnalytics ? 'rotate-180' : ''}`} />
          </button>
          <LiveActivityButton accentColor="#2563eb" />
        </div>
      ) : undefined}
    >
      {activeTab === 'dashboard' && (
        <HubDashboardTab
          onStartSession={() => switchTo('approve')}
          onBrowseVault={() => switchTo('vault')}
          onViewSaved={() => switchTo('saved')}
          onSendToClient={() => {}}
        />
      )}

      {activeTab === 'approve' && <ApproveTabContent />}

      {activeTab === 'vault' && (
        <VaultTabContent onStartSession={() => switchTo('approve')} />
      )}

      {activeTab === 'saved' && (
        <SavedTabContent onBrowseVault={() => switchTo('vault')} />
      )}
    </ContentPageShell>
  );
}
