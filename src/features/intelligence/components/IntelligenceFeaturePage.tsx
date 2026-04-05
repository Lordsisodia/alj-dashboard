'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { Plus, LayoutGrid, Sparkles, Users } from 'lucide-react';
import { api } from '../../../../convex/_generated/api';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon }      from '@/isso/layout/ProductIcon';
import { DateRangePill }    from '@/isso/ui/DateRangePill';
import { SortPill }         from './controls/SortPill';
import { VisibilityPill }   from './controls/VisibilityPill';
import { FeedView }         from './feed/FeedView';
import { BoardsView }       from './boards/BoardsView';
import { ExpertsView }      from './experts/ExpertsView';
import { PostDetailDrawer } from './drawer/PostDetailDrawer';
import { FILTER_CATEGORIES } from '../filterConfig';
import { useDrawer }          from '../hooks/useDrawer';
import { DEFAULT_VISIBILITY, type Tab, type SortId, type VisibilityState } from '../types';

function useIndexedCount() {
  const stats = useQuery(api.intelligence.getStats, {});
  return stats?.totalIndexed ?? 0;
}

export default function IntelligenceFeaturePage() {
  const [activeTab, setActiveTab]   = useState<Tab>('feed');
  const [sortBy, setSortBy]         = useState<SortId>('newest');
  const [visibility, setVisibility] = useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid');
  const { drawer, open, close }     = useDrawer();
  const indexedCount                = useIndexedCount();

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="intelligence" size={32} />}
        title="Intelligence"
        stat={{ label: 'Posts indexed', value: indexedCount }}
        searchPlaceholder="Search keywords, brands, categories..."
        actionLabel="New"
        actionIcon={<Plus size={14} />}
        actionDropdownItems={[
          { id: 'board',  label: 'New Board',    icon: <LayoutGrid size={13} /> },
          { id: 'search', label: 'Saved Search', icon: <Sparkles size={13} /> },
        ]}
        tabs={[
          { id: 'feed',    label: 'Community Feed', icon: <LayoutGrid size={13} /> },
          { id: 'brands',  label: 'Brands',          icon: <Sparkles size={13} /> },
          { id: 'experts', label: 'Experts',          icon: <Users size={13} /> },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as Tab)}
        filterCategories={FILTER_CATEGORIES}
        filterRightSlot={
          <div className="flex items-center gap-1.5">
            <SortPill value={sortBy} onChange={setSortBy} />
            <DateRangePill />
            <VisibilityPill value={visibility} onChange={setVisibility} />
          </div>
        }
        showViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      >
        <div className="px-6 py-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {activeTab === 'feed'    && <FeedView sortBy={sortBy} visibility={visibility} viewMode={viewMode} onPostClick={open} />}
              {activeTab === 'brands'  && <BoardsView />}
              {activeTab === 'experts' && <ExpertsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </ContentPageShell>

      <AnimatePresence>
        {drawer && <PostDetailDrawer posts={drawer.posts} initialIndex={drawer.index} onClose={close} />}
      </AnimatePresence>
    </>
  );
}
