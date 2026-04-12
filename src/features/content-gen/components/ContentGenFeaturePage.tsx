'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { LiveActivityButton } from '@/components/ui/live-activity-button';
import { ProductIcon } from '@/isso/layout/ProductIcon';

// All sub-pages are lazy — only the active tab's code ships to the client
const DashboardFeaturePage = dynamic(() => import('./dashboard/DashboardFeaturePage'), { ssr: false });
const ScenesFeaturePage = dynamic(() => import('./scenes/ScenesFeaturePage'), { ssr: false });
const LivePipelinePage = dynamic(() => import('./generate/LivePipelinePage'), { ssr: false });
const GalleryFeaturePage = dynamic(() => import('./gallery/GalleryFeaturePage'), { ssr: false });

type Tab = 'dashboard' | 'scenes' | 'generate' | 'gallery';

function StepNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">
      {n}
    </span>
  );
}

export default function ContentGenFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const router = useRouter();

  return (
    <ContentPageShell
      icon={<ProductIcon product="content-gen" size={32} />}
      title="Content Gen"
      searchPlaceholder="Search..."
      actionLabel="New Scene"
      actionIcon={<Sparkles size={14} />}
      onAction={() => router.push('/content-gen/community?tab=saved')}
      accentGradient="linear-gradient(135deg, #10b981, #059669)"
      filterRightSlot={<LiveActivityButton accentColor="#10b981" />}
      tabs={[
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={12} /> },
        { id: 'scenes',    label: 'Scenes',    icon: <StepNum n={1} /> },
        { id: 'generate',  label: 'Generate',  icon: <StepNum n={2} /> },
        { id: 'gallery',   label: 'Gallery',   icon: <StepNum n={3} /> },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as Tab)}
      nextProduct={{ label: 'Agents', icon: <ProductIcon product="agents" size={16} />, href: '/content-gen/agents' }}
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
        </motion.div>
      </AnimatePresence>
    </ContentPageShell>
  );
}
