'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { CheckCircle, Clock, Send } from 'lucide-react';
import type { Tab } from '../types';
import { ApprovalsTabContent } from './ApprovalsTabContent';

export default function ApprovalsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Approvals"
      stat={{ label: 'Pending', value: 2 }}
      searchPlaceholder="Search clips, models..."
      actionLabel="Review All"
      actionIcon={<CheckCircle size={14} />}
      tabs={[
        { id: 'pending',  label: 'Pending',   icon: <Clock size={13} /> },
        { id: 'approved', label: 'Approved',  icon: <CheckCircle size={13} /> },
        { id: 'rejected', label: 'Published', icon: <Send size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',      label: 'All' },
        { id: 'reel',     label: 'Reels' },
        { id: 'post',     label: 'Posts' },
        { id: 'story',    label: 'Stories' },
        { id: 'carousel', label: 'Carousels' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <div className="p-4">
        <ApprovalsTabContent />
      </div>
    </ContentPageShell>
  );
}
