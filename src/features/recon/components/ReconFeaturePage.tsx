'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { FILTER_CATEGORIES } from '@/features/intelligence/filterConfig';
import { SortPill, VisibilityPill, DEFAULT_VISIBILITY, type SortId, type VisibilityState } from '@/isso/ui/FeedControls';
import { DateRangePill } from '@/isso/ui/DateRangePill';
import { cn } from '@/lib/utils';
import { Radar, UserPlus, Heart, Upload, Play, Clock, Globe } from 'lucide-react';
import type { Tab, Competitor, Candidate } from '../types';
import { COMPETITORS } from '../constants';
// DiscoveryTab is the default tab — keep it eager so it renders immediately
import { DiscoveryTab } from './creators';
import { ReconModals, type ModalId, type DrawerState } from './ReconModals';

// Non-default tabs: lazy-load to keep initial JS parse budget low
const LogDashboard      = dynamic(() => import('./creators/LogDashboard').then(m => ({ default: m.LogDashboard })),         { ssr: false });
const CreatorsTable     = dynamic(() => import('./creators/CreatorsTable').then(m => ({ default: m.CreatorsTable })),       { ssr: false });
const CreatorDetailView = dynamic(() => import('./creators/CreatorDetailView').then(m => ({ default: m.CreatorDetailView })), { ssr: false });
const ReconFeedTab      = dynamic(() => import('./ReconFeedTab').then(m => ({ default: m.ReconFeedTab })),                  { ssr: false });

function StepNum({ n }: { n: number }) {
  return <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">{n}</span>;
}

export default function ReconFeaturePage() {
  const [activeTab, setActiveTab]             = useState<Tab>('discovery');
  const [showFavorites, setShowFavorites]     = useState(false);
  const [sortBy, setSortBy]                   = useState<SortId>('newest');
  const [visibility, setVisibility]           = useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [viewMode, setViewMode]               = useState<'grid' | 'list'>('grid');
  const [drawer, setDrawer]                   = useState<DrawerState | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Competitor | null>(null);
  const [modal, setModal]                     = useState<ModalId>(null);
  const [extraCandidates, setExtraCandidates] = useState<Candidate[]>([]);
  const [extraCreators, setExtraCreators]     = useState<Competitor[]>([]);
  const [runAllTrigger, setRunAllTrigger]     = useState(0);

  function fireOnce<T>(set: (v: T[]) => void, value: T[]) { set(value); setTimeout(() => set([]), 0); }

  const dropdownItems = {
    discovery: [
      { id: 'add-handle',    label: 'Add Handle',       icon: <UserPlus size={13} />, onClick: () => setModal('add-handle') },
      { id: 'bulk-import',   label: 'Bulk Import',       icon: <Upload size={13} />,   onClick: () => setModal('bulk-import') },
    ],
    creators: [
      { id: 'track-profile', label: 'Track Profile',    icon: <Radar size={13} />,    onClick: () => setModal('track-profile') },
      { id: 'track-niche',   label: 'Track Niche',      icon: <Globe size={13} />,    onClick: () => setModal('track-niche') },
    ],
    log:  [
      { id: 'run-all',       label: 'Run All Scrapers', icon: <Play size={13} />,     onClick: () => setRunAllTrigger(n => n + 1) },
      { id: 'schedule',      label: 'Schedule Scrape',  icon: <Clock size={13} />,    onClick: () => {} },
    ],
    feed: [] as { id: string; label: string; icon: React.ReactNode; onClick: () => void }[],
  };

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="recon" size={32} />}
        title="Recon"
        stat={{ label: 'Creators tracked', value: COMPETITORS.length }}
        searchPlaceholder="Search creators, niches..."
        actionLabel={activeTab === 'log' ? 'Run' : 'Add'}
        actionIcon={activeTab === 'log' ? <Play size={14} /> : <UserPlus size={14} />}
        onAction={activeTab === 'log' ? () => setRunAllTrigger(n => n + 1) : undefined}
        actionDropdownItems={dropdownItems[activeTab]}
        tabs={[
          { id: 'discovery', label: 'Discovery',      icon: <StepNum n={1} /> },
          { id: 'creators',  label: 'Creators',       icon: <StepNum n={2} /> },
          { id: 'log',       label: 'Pipeline',       icon: <StepNum n={3} /> },
          { id: 'feed',      label: 'Community Feed', icon: <StepNum n={4} /> },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => { setActiveTab(id as Tab); setShowFavorites(false); setSelectedCreator(null); }}
        nextProduct={{ label: 'Intelligence', icon: <ProductIcon product="intelligence" size={16} />, href: '/isso/intelligence' }}
        filterCategories={activeTab === 'feed' ? FILTER_CATEGORIES : undefined}
        filterRightSlot={
          activeTab === 'creators' && !selectedCreator ? (
            <button onClick={() => setShowFavorites(v => !v)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border', showFavorites ? 'text-[#ff0069] border-[#ff006930] bg-[#ff006908]' : 'text-neutral-500 border-transparent hover:border-neutral-200 hover:bg-neutral-50')}>
              <Heart size={12} fill={showFavorites ? '#ff0069' : 'none'} /> Favorites
            </button>
          ) : activeTab === 'feed' ? (
            <div className="flex items-center gap-1.5">
              <SortPill value={sortBy} onChange={setSortBy} />
              <DateRangePill />
              <VisibilityPill value={visibility} onChange={setVisibility} />
            </div>
          ) : undefined
        }
        showViewToggle={activeTab === 'feed'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      >
        <div className={activeTab === 'feed' ? 'px-4 py-4 w-full' : 'w-full'}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}>
              {activeTab === 'discovery' && <DiscoveryTab extraCandidates={extraCandidates} />}
              {activeTab === 'log'       && <LogDashboard extraCreators={extraCreators} runAllTrigger={runAllTrigger} />}
              {activeTab === 'creators'  && (
                selectedCreator
                  ? <CreatorDetailView creator={selectedCreator} onBack={() => setSelectedCreator(null)} />
                  : <CreatorsTable showFavoritesOnly={showFavorites} onOpen={setSelectedCreator} extraCreators={extraCreators} />
              )}
              {activeTab === 'feed' && (
                <ReconFeedTab sortBy={sortBy} visibility={visibility} viewMode={viewMode} onPostClick={(index, posts) => setDrawer({ index, posts })} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ContentPageShell>

      <ReconModals
        modal={modal}
        drawer={drawer}
        onCloseModal={() => setModal(null)}
        onCloseDrawer={() => setDrawer(null)}
        onAddCandidate={c => fireOnce(setExtraCandidates, [c])}
        onBulkImport={cs => fireOnce(setExtraCandidates, cs)}
        onAddCreator={c => fireOnce(setExtraCreators, [c])}
      />
    </>
  );
}
