'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowLeft, LayoutDashboard, GitBranch, Film, BarChart2, Image, Settings, Users, PoundSterling, Clock } from 'lucide-react';
import type { Reel } from '../../types';
import { MODELS } from '../../constants';
import type { DetailTab, ModelData } from '../../types';
import { OverviewTab } from './tabs/OverviewTab';

const PipelineTab   = dynamic(() => import('./tabs/PipelineTab').then(m => ({ default: m.PipelineTab })),   { ssr: false });
const ContentTab    = dynamic(() => import('./tabs/ContentTab').then(m => ({ default: m.ContentTab })),     { ssr: false });
const AnalyticsTab  = dynamic(() => import('./tabs/AnalyticsTab').then(m => ({ default: m.AnalyticsTab })), { ssr: false });
const ReferencesTab = dynamic(() => import('./tabs/ReferencesTab').then(m => ({ default: m.ReferencesTab })), { ssr: false });
const SettingsTab   = dynamic(() => import('./tabs/SettingsTab').then(m => ({ default: m.SettingsTab })),   { ssr: false });

function formatSubs(n?: number) {
  if (!n) return '-';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function lastContentDate(reels?: Reel[]) {
  if (!reels?.length) return '-';
  const latest = reels.reduce((a, b) => a.createdAt > b.createdAt ? a : b);
  const days = Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 86400000);
  return days === 0 ? 'today' : `${days}d ago`;
}

const DETAIL_TABS: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',    label: 'Overview',    icon: <LayoutDashboard size={13} /> },
  { id: 'pipeline',    label: 'Pipeline',    icon: <GitBranch size={13} /> },
  { id: 'content',     label: 'Content',     icon: <Film size={13} /> },
  { id: 'analytics',   label: 'Analytics',   icon: <BarChart2 size={13} /> },
  { id: 'references',  label: 'References',  icon: <Image size={13} /> },
  { id: 'settings',    label: 'Settings',    icon: <Settings size={13} /> },
];

export function ModelDetailPage({ modelId }: { modelId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const model: ModelData | undefined = MODELS.find(m => m.id === modelId);

  if (!model) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-neutral-400">
        <p className="text-lg font-semibold text-neutral-700">Model not found</p>
        <button
          onClick={() => router.push('/content-gen/models')}
          className="text-sm text-neutral-500 hover:text-neutral-700 underline"
        >
          Back to Models
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-4 h-14 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <button
          onClick={() => router.push('/content-gen/models')}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={13} />
          Models
        </button>

        <div className="w-px h-4 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
          >
            {model.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900">{model.name}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                style={{
                  backgroundColor: model.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.06)',
                  color: model.status === 'Active' ? '#16a34a' : '#737373',
                }}
              >
                {model.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 truncate">{model.niche}</p>
          </div>
        </div>
      </div>

      {/* Inline stats strip */}
      {(() => {
        const stats = [
          { icon: <Users size={12} className="text-neutral-400" />, value: formatSubs(model.subscribers), label: 'subscribers' },
          { icon: <PoundSterling size={12} className="text-neutral-400" />, value: `£${(model.mrr ?? 0).toLocaleString()}/mo`, label: 'MRR' },
          { icon: <Film size={12} className="text-neutral-400" />, value: `${model.reels?.length ?? 0} reels`, label: 'in pipeline' },
          { icon: <Clock size={12} className="text-neutral-400" />, value: lastContentDate(model.reels), label: 'last content' },
        ];
        return (
          <div
            className="px-4 py-2 flex items-center gap-3 flex-wrap flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
          >
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-neutral-300 select-none">·</span>}
                <div className="flex items-center gap-1">
                  {s.icon}
                  <span className="text-sm font-semibold text-neutral-800">{s.value}</span>
                  <span className="text-xs text-neutral-400">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Tabs */}
      <div
        className="px-4 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="inline-flex items-center gap-1">
          {DETAIL_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              style={
                activeTab === tab.id
                  ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
                  : { color: '#a3a3a3' }
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview'   && <OverviewTab   model={model} onTabChange={setActiveTab} />}
          {activeTab === 'pipeline'   && <PipelineTab   model={model} />}
          {activeTab === 'content'    && <ContentTab    model={model} />}
          {activeTab === 'analytics'  && <AnalyticsTab  model={model} />}
          {activeTab === 'references' && <ReferencesTab model={model} />}
          {activeTab === 'settings'   && <SettingsTab   model={model} />}
        </motion.div>
      </div>
    </div>
  );
}
