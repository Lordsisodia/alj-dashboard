'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useQuery, useMutation } from 'convex/react';
import { Sparkles, UserPlus, Table2, LayoutGrid, X } from 'lucide-react';
import { ViewToggle } from '@/components/ui/view-toggle';

import { api } from '../../../../convex/_generated/api';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon }      from '@/isso/layout/ProductIcon';
import { AnalysisView, AnalysisKanbanView }  from './analysis';
import { InsightsView }  from './insights';
import dynamic from 'next/dynamic';
import { ANALYSIS_FILTERS } from './IntelligenceControls';

const IntelligenceAssistantPage = dynamic(() =>
  import('./assistant/IntelligenceAssistantPage')
);

const ReconFeedTab = dynamic(
  () => import('@/features/recon/components/feed/ReconFeedTab').then(m => ({ default: m.ReconFeedTab })),
  { ssr: false }
);
import type { Days } from './IntelligenceControls';
import type { Tab } from '../types';

function StepNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">
      {n}
    </span>
  );
}

// ── Add Lead Modal ─────────────────────────────────────────────────────────────
function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [handle, setHandle] = useState('');
  const [niche,  setNiche]  = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addAccount = useMutation(api.recon.addTrackedAccount);

  const NICHE_OPTIONS = [
    { value: 'all', label: 'All niches' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'finance', label: 'Finance' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
  ];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = handle.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    try {
      await addAccount({
        handle: trimmed.startsWith('@') ? trimmed : `@${trimmed}`,
        platform: 'instagram',
        niche: niche === 'all' ? undefined : niche,
      } as any);
      onClose();
    } catch {
      toast.error('Failed to add lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog open className="fixed inset-0 z-50 flex items-center justify-center" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-80 overflow-hidden"
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900">Add creator handle</h3>
            <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-lg leading-none">×</button>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-500 mb-1.5 block">Handle</label>
            <input
              autoFocus
              value={handle}
              onChange={e => setHandle(e.target.value.trim())}
              placeholder="@username"
              className="w-full px-3 py-2 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-500 mb-1.5 block">Niche</label>
            <select
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:border-pink-400"
            >
              {NICHE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                Adding…
              </>
            ) : 'Add Lead'}
          </button>
        </form>
      </motion.div>
    </dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function IntelligenceFeaturePage() {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'analysis';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [days,      setDays]      = useState<Days>(30);
  const [niche,     setNiche]     = useState('all');
  const [platform,  setPlatform]  = useState('all');
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [analysisView, setAnalysisView] = useState<'default' | 'kanban'>('default');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const stats = useQuery(api.intelligence.getStats, {});
  const indexedCount = stats?.totalIndexed ?? 0;

  function handleFilterSelect(categoryId: string, value: string) {
    if (categoryId === 'niche')    setNiche(value);
    if (categoryId === 'platform') setPlatform(value.toLowerCase());
  }

  const filterCategories =
    activeTab === 'analysis' ? ANALYSIS_FILTERS  :
    undefined;

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="intelligence" size={32} />}
        title="Intelligence"
        stat={{ label: 'Posts indexed', value: indexedCount }}
        searchPlaceholder="Search hooks, niches, accounts..."
        actionLabel="Add Lead"
        actionIcon={<UserPlus size={14} />}
        actionDropdownItems={[
          {
            id: 'add-lead',
            label: 'Add creator handle',
            icon: <UserPlus size={13} />,
            onClick: () => setAddLeadOpen(true),
          },
        ]}
        tabs={[
          { id: 'analysis',  label: 'Analysis',       icon: <StepNum n={1} /> },
          { id: 'feed',      label: 'Community Feed', icon: <StepNum n={2} /> },
          { id: 'insights',  label: 'Insights',       icon: <StepNum n={3} /> },
          { id: 'assistant', label: 'Assistant',      icon: <Sparkles size={12} /> },
        ]}
        activeTab={activeTab}
        onTabChange={id => { setActiveTab(id as Tab); setNiche('all'); setPlatform('all'); }}
        nextProduct={{ label: 'Hub', icon: <ProductIcon product="hub" size={16} />, href: '/isso/community' }}
        filterCategories={filterCategories}
        onFilterSelect={handleFilterSelect}
        filterRightSlot={activeTab === 'analysis' ? (
          <ViewToggle
            value={analysisView}
            onChange={setAnalysisView}
            options={[
              { value: 'default', icon: <Table2    size={11} />, label: 'Default' },
              { value: 'kanban',  icon: <LayoutGrid size={11} />, label: 'Kanban' },
            ]}
            size="md"
          />
        ) : undefined}
      >
        <div className="px-6 py-6 w-full flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}>
              {activeTab === 'feed'      && <ReconFeedTab onPostClick={() => {}} onAnalyzeClick={() => {}} sortBy="newest" visibility={{ brandDetails: true, likeCount: true, viewCount: true, saveCount: true }} viewMode="grid" columns={3} creatorStatsMap={{}} nicheERMap={{}} />}
              {activeTab === 'analysis'  && (analysisView === 'kanban'
                ? <AnalysisKanbanView days={days} niche={niche} />
                : <AnalysisView days={days} niche={niche} />)}
              {activeTab === 'insights'  && <InsightsView />}
              {activeTab === 'assistant' && <IntelligenceAssistantPage onClose={() => setActiveTab('analysis')} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </ContentPageShell>

      {addLeadOpen && <AddLeadModal onClose={() => setAddLeadOpen(false)} />}

      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setAssistantOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-[min(720px,95vw)] h-[min(680px,90vh)] bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setAssistantOpen(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.04] transition-colors"
              >
                <X size={16} />
              </button>
              <IntelligenceAssistantPage onClose={() => setAssistantOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
