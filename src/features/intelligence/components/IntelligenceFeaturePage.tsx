'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { Plus, LayoutDashboard } from 'lucide-react';

import { api } from '../../../../convex/_generated/api';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon }      from '@/isso/layout/ProductIcon';
import { QualifyView }   from './trends';
import { AnalysisView }  from './analysis';
import { InsightsView }  from './insights';
import { DashboardView } from './dashboard';
import { TimePill, MetricPill, QUALIFY_FILTERS, ANALYSIS_FILTERS } from './IntelligenceControls';
import type { Days, Metric } from './IntelligenceControls';
import type { Tab } from '../types';

function StepNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">
      {n}
    </span>
  );
}

export default function IntelligenceFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [days,      setDays]      = useState<Days>(30);
  const [metric,    setMetric]    = useState<Metric>('er');
  const [niche,     setNiche]     = useState('all');
  const [platform,  setPlatform]  = useState('all');
  const stats = useQuery(api.intelligence.getStats, {});
  const indexedCount = stats?.totalIndexed ?? 0;

  function handleFilterSelect(categoryId: string, value: string) {
    if (categoryId === 'niche')    setNiche(value);
    if (categoryId === 'platform') setPlatform(value.toLowerCase());
  }

  const filterCategories =
    activeTab === 'qualify'  ? QUALIFY_FILTERS   :
    activeTab === 'analysis' ? ANALYSIS_FILTERS  :
    undefined;

  const filterRightSlot = activeTab === 'qualify' ? (
    <div className="flex items-center gap-2">
      <MetricPill value={metric} onChange={setMetric} />
      <TimePill   value={days}   onChange={setDays}   />
    </div>
  ) : undefined;

  return (
    <ContentPageShell
      icon={<ProductIcon product="intelligence" size={32} />}
      title="Intelligence"
      stat={{ label: 'Posts indexed', value: indexedCount }}
      searchPlaceholder="Search hooks, niches, accounts..."
      actionLabel="New Board"
      actionIcon={<Plus size={14} />}
      tabs={[
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={12} /> },
        { id: 'qualify',   label: 'Qualify',   icon: <StepNum n={1} /> },
        { id: 'analysis',  label: 'Analysis',  icon: <StepNum n={2} /> },
        { id: 'insights',  label: 'Insights',  icon: <StepNum n={3} /> },
      ]}
      activeTab={activeTab}
      onTabChange={id => { setActiveTab(id as Tab); setNiche('all'); setPlatform('all'); }}
      nextProduct={{ label: 'Hub', icon: <ProductIcon product="hub" size={16} />, href: '/isso/community' }}
      filterCategories={filterCategories}
      onFilterSelect={handleFilterSelect}
      filterRightSlot={filterRightSlot}
    >
      <div className="px-6 py-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'qualify'   && <QualifyView  days={days} metric={metric} niche={niche} platform={platform} />}
            {activeTab === 'analysis'  && <AnalysisView days={days} niche={niche} />}
            {activeTab === 'insights'  && <InsightsView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
