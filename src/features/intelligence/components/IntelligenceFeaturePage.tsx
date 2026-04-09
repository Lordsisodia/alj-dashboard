'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useQuery, useMutation } from 'convex/react';
import { Sparkles, UserPlus, LayoutDashboard, FileDown, Zap, SlidersHorizontal, Video, Play, BarChart2, ChevronDown } from 'lucide-react';

import { api } from '../../../../convex/_generated/api';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon }      from '@/isso/layout/ProductIcon';
import { AnalysisPageView } from './analysis';
import { AnalyserTab } from '@/features/tools/components/AnalyserTab';
import { InsightsView }  from './insights';
import { ViewToggle } from '@/components/ui/view-toggle';
import { LiveActivityButton } from '@/components/ui/live-activity-button';
import dynamic from 'next/dynamic';

const DashboardView = dynamic(
  () => import('./dashboard/DashboardView').then(m => ({ default: m.DashboardView })),
  { ssr: false }
);

const CommunityFeedTab = dynamic(
  () => import('./feed/CommunityFeedTab').then(m => ({ default: m.CommunityFeedTab })),
  { ssr: false }
);

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
  const addAccount = useMutation(api.trackedAccounts.approveCandidate as any);

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
            <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-lg leading-none">x</button>
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
                Adding...
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
  const initialTab = (searchParams.get('tab') as Tab) || 'dashboard';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [analysisViewMode, setAnalysisViewMode] = useState<'auto' | 'manual'>('auto');
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const stats = useQuery(api.intelligence.getStats, {});
  const indexedCount = stats?.totalIndexed ?? 0;

  type DropdownItem = { id: string; label: string; icon: React.ReactNode; onClick: () => void };

  const dropdownItems: Record<Tab, DropdownItem[]> = {
    dashboard: [
      { id: 'gen-digest',    label: 'Generate Weekly Digest',     icon: <Sparkles size={13} />, onClick: () => {} },
      { id: 'gen-viral',     label: 'Generate Viral Alert',       icon: <Sparkles size={13} />, onClick: () => {} },
      { id: 'gen-spotlight', label: 'Generate Creator Spotlight', icon: <Sparkles size={13} />, onClick: () => {} },
    ],
    analysis: analysisViewMode === 'auto' ? [
      { id: 'run-pipeline',    label: 'Run Full Pipeline',  icon: <Play     size={13} />, onClick: () => {} },
      { id: 'export-analysis', label: 'Export Analysis',    icon: <FileDown size={13} />, onClick: () => {} },
    ] : [
      { id: 'new-session',      label: 'New Session',       icon: <Video    size={13} />, onClick: () => {} },
      { id: 'export-sessions',  label: 'Export Sessions',   icon: <FileDown size={13} />, onClick: () => {} },
    ],
    feed: [
      { id: 'add-lead', label: 'Add creator handle', icon: <UserPlus size={13} />, onClick: () => setAddLeadOpen(true) },
    ],
    insights: [
      { id: 'export-insights',  label: 'Export Insights Report', icon: <FileDown size={13} />, onClick: () => {} },
      { id: 'export-top-posts', label: 'Export Top Posts',       icon: <FileDown size={13} />, onClick: () => {} },
    ],
  };

  const actionLabel: Record<Tab, string> = {
    dashboard: 'Generate',
    analysis:  analysisViewMode === 'auto' ? 'Analyse' : 'New Session',
    feed:      'Add Lead',
    insights:  'Export',
  };

  const actionIcon: Record<Tab, React.ReactNode> = {
    dashboard: <Sparkles size={14} />,
    analysis:  analysisViewMode === 'auto' ? <Sparkles size={14} /> : <Video size={14} />,
    feed:      <UserPlus size={14} />,
    insights:  <FileDown size={14} />,
  };

  const onAction: Record<Tab, () => void> = {
    dashboard: () => {},
    analysis:  () => {},
    feed:      () => setAddLeadOpen(true),
    insights:  () => {},
  };

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="intelligence" size={32} />}
        accentGradient="linear-gradient(135deg, #6d28d9, #4c1d95)"
        title="Intelligence"
        stat={{ label: 'Posts indexed', value: indexedCount }}
        searchPlaceholder="Search hooks, niches, accounts..."
        actionLabel={actionLabel[activeTab]}
        actionIcon={actionIcon[activeTab]}
        onAction={onAction[activeTab]}
        actionDropdownItems={dropdownItems[activeTab]}
        tabs={[
          { id: 'dashboard', label: 'Dashboard',      icon: <LayoutDashboard size={13} /> },
          { id: 'analysis',  label: 'Analysis',       icon: <StepNum n={1} /> },
          { id: 'feed',      label: 'Community Feed', icon: <StepNum n={2} /> },
          { id: 'insights',  label: 'Insights',       icon: <StepNum n={3} /> },
        ]}
        activeTab={activeTab}
        onTabChange={id => setActiveTab(id as Tab)}
        nextProduct={{ label: 'Hub', icon: <ProductIcon product="hub" size={16} />, href: '/isso/community' }}
        filterRightSlot={activeTab !== 'dashboard' ? (
          <div className="flex items-center gap-2">
            {activeTab === 'analysis' && (
              <ViewToggle
                value={analysisViewMode}
                onChange={v => setAnalysisViewMode(v as 'auto' | 'manual')}
                options={[
                  { value: 'auto',   icon: <Zap              size={11} />, label: 'Auto'   },
                  { value: 'manual', icon: <SlidersHorizontal size={11} />, label: 'Manual' },
                ]}
                size="md"
              />
            )}
            {activeTab === 'feed' && (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
                style={{ border: '1px solid rgba(0,0,0,0.09)' }}
              >
                <BarChart2 size={12} style={{ color: '#7c3aed' }} />
                Analytics
                <ChevronDown size={11} />
              </button>
            )}
            <LiveActivityButton accentColor="#7c3aed" />
          </div>
        ) : undefined}
      >
        <div className={`w-full flex-1 min-h-0 flex flex-col ${activeTab === 'analysis' ? 'overflow-hidden px-6 pt-6' : 'overflow-y-auto px-6 py-6'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className={activeTab === 'analysis' ? 'flex-1 min-h-0 flex flex-col pb-6' : ''}
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'feed'      && <CommunityFeedTab />}
              {activeTab === 'analysis' && analysisViewMode === 'auto'   && <AnalysisPageView />}
              {activeTab === 'analysis' && analysisViewMode === 'manual' && <AnalyserTab className="flex-1 min-h-0" />}
              {activeTab === 'insights'  && (
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <InsightsView />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ContentPageShell>

      {addLeadOpen && <AddLeadModal onClose={() => setAddLeadOpen(false)} />}
    </>
  );
}
