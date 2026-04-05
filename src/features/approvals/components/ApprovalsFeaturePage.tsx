'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { CheckCircle, Clock, Send, ChevronDown } from 'lucide-react';
import type { Tab, ApprovalItem, ApprovalStatus } from '../types';
import { ITEMS, ACCOUNTS } from '../constants';
import { ApprovalCard, MiniStat } from './cards';
import { DetailModal } from './modals';
import { EmptyState } from './states';

export default function ApprovalsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [items, setItems] = useState(ITEMS);

  const counts = {
    pending:           items.filter(i => i.status === 'pending').length,
    awaitingClient:    items.filter(i => i.status === 'revision').length,
    approvedToday:     items.filter(i => i.status === 'approved').length,
    publishedThisWeek: items.filter(i => i.status === 'published').length,
  };

  const filtered = items.filter(item => {
    const tabMatch =
      activeTab === 'pending'  ? item.status === 'pending' || item.status === 'revision' :
      activeTab === 'approved' ? item.status === 'approved' :
      item.status === 'published';
    const typeMatch = activeFilter === 'all' || item.contentType.toLowerCase() === activeFilter;
    const accountMatch = selectedAccount === 'All Accounts' || item.account === selectedAccount;
    return tabMatch && typeMatch && accountMatch;
  });

  const handleStatusChange = (id: string, status: ApprovalStatus) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="hub" size={32} />}
        title="Approvals"
        stat={{ label: 'Pending', value: counts.pending }}
        searchPlaceholder="Search clips, models..."
        actionLabel="Review All"
        actionIcon={<CheckCircle size={14} />}
        tabs={[
          { id: 'pending',  label: 'Pending',  icon: <Clock size={13} /> },
          { id: 'approved', label: 'Approved', icon: <CheckCircle size={13} /> },
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
        <div className="p-4 space-y-4">
          <div className="flex gap-3">
            <MiniStat label="Pending Review"      value={counts.pending}           color="#d97706" />
            <MiniStat label="Awaiting Client"     value={counts.awaitingClient}    color="#ff0069" />
            <MiniStat label="Approved Today"      value={counts.approvedToday}     color="#16a34a" />
            <MiniStat label="Published This Week" value={counts.publishedThisWeek} color="#7c3aed" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="relative">
              <select
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-medium text-neutral-700 outline-none cursor-pointer"
                style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
            <span className="text-xs text-neutral-400">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map(item => (
                  <ApprovalCard key={item.id} item={item} onOpen={setSelectedItem} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </ContentPageShell>

      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </>
  );
}
