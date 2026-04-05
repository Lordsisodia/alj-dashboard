'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { FeedView } from '@/features/intelligence/components/feed/FeedView';
import { FILTER_CATEGORIES } from '@/features/intelligence/filterConfig';
import { LeaderboardSidebar } from '@/features/community/components/CommunityFeaturePage';
import { PostDetailDrawer } from '@/features/intelligence/components/drawer/PostDetailDrawer';
import type { DrawerPost } from '@/features/intelligence/types';
import { SortPill, VisibilityPill, DEFAULT_VISIBILITY, type SortId, type VisibilityState } from '@/isso/ui/FeedControls';
import { DateRangePill } from '@/isso/ui/DateRangePill';
import { cn } from '@/lib/utils';
import { Radar, Activity, Rss, UserPlus, Heart } from 'lucide-react';
import type { Tab, DrawerState, Competitor } from '../types';
import { COMPETITORS, RECON_FILTER_CATEGORIES } from '../constants';
import { LogDashboard, CreatorsTable, CreatorDetailView } from './creators';

export default function ReconFeaturePage() {
  const [activeTab, setActiveTab]           = useState<Tab>('creators');
  const [showFavorites, setShowFavorites]   = useState(false);
  const [sortBy, setSortBy]                 = useState<SortId>('newest');
  const [visibility, setVisibility]         = useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [viewMode, setViewMode]             = useState<'grid' | 'list'>('grid');
  const [drawer, setDrawer]                 = useState<DrawerState | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Competitor | null>(null);

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="recon" size={32} />}
        title="Recon"
        stat={{ label: 'Creators tracked', value: COMPETITORS.length }}
        searchPlaceholder="Search creators, niches..."
        actionLabel="Add Creator"
        actionIcon={<UserPlus size={14} />}
        actionDropdownItems={[
          { id: 'profile', label: 'Track Profile', icon: <UserPlus size={13} /> },
          { id: 'niche',   label: 'Track Niche',   icon: <Radar size={13} /> },
        ]}
        tabs={[
          { id: 'log',      label: 'Scraping Log',  icon: <Activity size={13} /> },
          { id: 'creators', label: 'Creators',       icon: <Radar size={13} /> },
          { id: 'feed',     label: 'Community Feed', icon: <Rss size={13} /> },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id as Tab);
          setShowFavorites(false);
          setSelectedCreator(null);
        }}
        nextProduct={{ label: 'Intelligence', icon: <ProductIcon product="intelligence" size={16} />, href: '/isso/intelligence' }}
        filterCategories={
          activeTab === 'creators' && !selectedCreator ? RECON_FILTER_CATEGORIES :
          activeTab === 'feed'                         ? FILTER_CATEGORIES :
          undefined
        }
        filterRightSlot={
          activeTab === 'creators' && !selectedCreator ? (
            <button
              onClick={() => setShowFavorites(v => !v)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                showFavorites
                  ? 'text-[#ff0069] border-[#ff006930] bg-[#ff006908]'
                  : 'text-neutral-500 border-transparent hover:border-neutral-200 hover:bg-neutral-50'
              )}
            >
              <Heart size={12} fill={showFavorites ? '#ff0069' : 'none'} />
              Favorites
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
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {activeTab === 'log'      && <LogDashboard />}
              {activeTab === 'creators' && (
                selectedCreator
                  ? <CreatorDetailView creator={selectedCreator} onBack={() => setSelectedCreator(null)} />
                  : <CreatorsTable showFavoritesOnly={showFavorites} onOpen={setSelectedCreator} />
              )}
              {activeTab === 'feed'     && (
                <div className="flex gap-6 items-start">
                  <div className="flex-1 min-w-0">
                    <FeedView
                      sortBy={sortBy}
                      visibility={visibility}
                      viewMode={viewMode}
                      onPostClick={(index: number, posts: DrawerPost[]) => setDrawer({ index, posts })}
                    />
                  </div>
                  <div className="w-64 flex-shrink-0 sticky top-6"><LeaderboardSidebar /></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ContentPageShell>

      <AnimatePresence>
        {drawer && (
          <PostDetailDrawer
            posts={drawer.posts}
            initialIndex={drawer.index}
            onClose={() => setDrawer(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
