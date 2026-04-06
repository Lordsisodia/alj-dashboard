'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Plus, Calendar, BarChart2, Film, Image, BookOpen, LayoutGrid, Video } from 'lucide-react';
import type { Tab, FilterType } from '../types';
// CalendarView is the default tab - keep eager
import { CalendarView } from './calendar/CalendarView';
// AnalyticsView is non-default - lazy load
const AnalyticsView = dynamic(() => import('./analytics/AnalyticsView').then(m => ({ default: m.AnalyticsView })), { ssr: false });

export default function ScheduleFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Schedule"
      stat={{ label: 'Posts scheduled', value: 20 }}
      searchPlaceholder="Search posts, models..."
      actionLabel="Schedule Post"
      actionIcon={<Plus size={14} />}
      actionDropdownItems={[
        { id: 'reel',     label: 'New Reel',     icon: <Film size={13} /> },
        { id: 'post',     label: 'New Post',     icon: <Image size={13} /> },
        { id: 'story',    label: 'New Story',    icon: <BookOpen size={13} /> },
        { id: 'carousel', label: 'New Carousel', icon: <LayoutGrid size={13} /> },
        { id: 'video',    label: 'New Video',    icon: <Video size={13} /> },
      ]}
      tabs={[
        { id: 'calendar',  label: 'Calendar',  icon: <Calendar size={13} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'All',       label: 'All' },
        { id: 'Reels',     label: 'Reels' },
        { id: 'Stories',   label: 'Stories' },
        { id: 'Posts',     label: 'Posts' },
        { id: 'Carousels', label: 'Carousels' },
        { id: 'Videos',    label: 'Videos' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={(id) => setActiveFilter(id as FilterType)}
    >
      <div className="px-6 py-6 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'analytics' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'analytics' ? -20 : 20 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeTab === 'calendar'
              ? <CalendarView filter={activeFilter} />
              : <AnalyticsView />
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
