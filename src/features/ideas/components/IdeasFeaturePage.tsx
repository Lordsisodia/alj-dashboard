'use client';

import { useState } from 'react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Lightbulb, Send, Archive, Plus, Sparkles } from 'lucide-react';

type Tab = 'ideas' | 'sent' | 'archived';

export default function IdeasFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('ideas');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <ContentPageShell
      icon={<ProductIcon product="content-gen" size={32} />}
      title="Briefs"
      stat={{ label: 'Ready to send', value: 2 }}
      searchPlaceholder="Search ideas, briefs..."
      actionLabel="New Idea"
      actionIcon={<Plus size={14} />}
      actionDropdownItems={[
        { id: 'manual', label: 'Write manually',    icon: <Lightbulb size={13} /> },
        { id: 'ai',     label: 'Generate with AI',  icon: <Sparkles size={13} /> },
      ]}
      tabs={[
        { id: 'ideas',    label: 'Ideas',    icon: <Lightbulb size={13} /> },
        { id: 'sent',     label: 'Sent',     icon: <Send size={13} /> },
        { id: 'archived', label: 'Archived', icon: <Archive size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',      label: 'All' },
        { id: 'draft',    label: 'Draft' },
        { id: 'ready',    label: 'Ready' },
        { id: 'assigned', label: 'Assigned' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      showViewToggle
    >
      <div className="flex items-center justify-center h-full text-neutral-300 text-sm select-none">
        Briefs content coming soon
      </div>
    </ContentPageShell>
  );
}
