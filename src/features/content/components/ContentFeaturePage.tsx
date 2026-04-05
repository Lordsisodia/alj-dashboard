'use client';

import { useState } from 'react';
import { Upload, HardDrive, CheckCircle } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import type { Tab } from '../types';
import { UploadDropzone } from './upload';
import { LibraryView } from './library';
import { DeliveredView } from './delivered';

export default function ContentFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <ContentPageShell
      icon={<ProductIcon product="content-gen" size={32} />}
      title="Content"
      stat={{ label: 'Clips in library', value: 47 }}
      searchPlaceholder="Search clips, models..."
      actionLabel="Upload"
      actionIcon={<Upload size={14} />}
      tabs={[
        { id: 'upload',    label: 'Upload',    icon: <Upload size={13} /> },
        { id: 'library',   label: 'Library',   icon: <HardDrive size={13} /> },
        { id: 'delivered', label: 'Delivered', icon: <CheckCircle size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',       label: 'All' },
        { id: 'reels',     label: 'Reels' },
        { id: 'posts',     label: 'Posts' },
        { id: 'carousels', label: 'Carousels' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      showViewToggle
    >
      {activeTab === 'upload'    && <UploadDropzone />}
      {activeTab === 'library'   && <LibraryView activeFilter={activeFilter} />}
      {activeTab === 'delivered' && <DeliveredView />}
    </ContentPageShell>
  );
}
