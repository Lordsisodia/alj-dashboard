'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import DashboardFeaturePage from './dashboard/DashboardFeaturePage';
import ScenesFeaturePage from './scenes/ScenesFeaturePage';
import LivePipelinePage from './generate/LivePipelinePage';
import GalleryFeaturePage from './gallery/GalleryFeaturePage';
import ContentGenModelsFeaturePage from './ModelsFeaturePage';

type Tab = 'dashboard' | 'scenes' | 'generate' | 'gallery' | 'models';

function StepNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">
      {n}
    </span>
  );
}

export default function ContentGenFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <ContentPageShell
      icon={<ProductIcon product="content-gen" size={32} />}
      title="Content Gen"
      searchPlaceholder="Search..."
      actionLabel="New Scene"
      actionIcon={<Sparkles size={14} />}
      tabs={[
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={12} /> },
        { id: 'scenes',    label: 'Scenes',    icon: <StepNum n={1} /> },
        { id: 'generate',  label: 'Generate',  icon: <StepNum n={2} /> },
        { id: 'gallery',   label: 'Gallery',   icon: <StepNum n={3} /> },
        { id: 'models',    label: 'Models',    icon: <StepNum n={4} /> },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as Tab)}
      nextProduct={{ label: 'Agents', icon: <ProductIcon product="agents" size={16} />, href: '/isso/agents' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {activeTab === 'dashboard' && <DashboardFeaturePage />}
          {activeTab === 'scenes'    && <ScenesFeaturePage />}
          {activeTab === 'generate'  && <LivePipelinePage />}
          {activeTab === 'gallery'   && <GalleryFeaturePage />}
          {activeTab === 'models'    && <ContentGenModelsFeaturePage />}
        </motion.div>
      </AnimatePresence>
    </ContentPageShell>
  );
}
