'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  Users2, UserPlus, BarChart2, Play, ChevronRight, ExternalLink,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'roster' | 'onboarding' | 'performance';

type PipelineStep = 'Draft' | 'Sent' | 'Filming' | 'Clips Received' | 'Editing' | 'Complete';

interface ModelData {
  id: string;
  name: string;
  niche: string;
  handle: string;
  color: string;
  initials: string;
  status: 'Active' | 'Paused';
  pipelineStep: PipelineStep;
  reelsInPipeline: number;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const PIPELINE_STEPS: PipelineStep[] = [
  'Draft', 'Sent', 'Filming', 'Clips Received', 'Editing', 'Complete',
];

const MODELS: ModelData[] = [
  {
    id: 'm1',
    name: 'Tyler',
    niche: 'Gay Bear Fitness',
    handle: '@onlytylerrex',
    color: '#ff0069',
    initials: 'TY',
    status: 'Active',
    pipelineStep: 'Editing',
    reelsInPipeline: 3,
  },
  {
    id: 'm2',
    name: 'Ren',
    niche: 'ABG Fitness',
    handle: '@rhinxrenx',
    color: '#833ab4',
    initials: 'RN',
    status: 'Active',
    pipelineStep: 'Filming',
    reelsInPipeline: 2,
  },
  {
    id: 'm3',
    name: 'Ella',
    niche: 'Lifestyle GFE',
    handle: '@ellamira',
    color: '#22c55e',
    initials: 'EL',
    status: 'Active',
    pipelineStep: 'Complete',
    reelsInPipeline: 5,
  },
  {
    id: 'm4',
    name: 'Amam',
    niche: 'GFE',
    handle: '@abg.ricebunny',
    color: '#f59e0b',
    initials: 'AM',
    status: 'Paused',
    pipelineStep: 'Clips Received',
    reelsInPipeline: 1,
  },
];

// Thumbnail gradient pairs for reel placeholders
const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #ff0069 0%, #833ab4 100%)',
  'linear-gradient(135deg, #833ab4 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ff0069 100%)',
  'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PipelineTracker({ currentStep, color }: { currentStep: PipelineStep; color: string }) {
  const currentIndex = PIPELINE_STEPS.indexOf(currentStep);

  return (
    <div className="flex items-center gap-0 w-full my-4">
      {PIPELINE_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all"
                style={{
                  backgroundColor: isDone || isCurrent ? color : 'rgba(0,0,0,0.12)',
                  boxShadow: isCurrent ? `0 0 0 3px ${color}25` : undefined,
                }}
              />
              <span
                className="text-[9px] font-medium mt-1 whitespace-nowrap"
                style={{ color: isCurrent ? color : isDone ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.25)' }}
              >
                {step}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div
                className="h-px flex-1 mx-1 mb-4"
                style={{ backgroundColor: i < currentIndex ? color : 'rgba(0,0,0,0.1)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReelGrid({ color }: { color: string }) {
  return (
    <div className="grid grid-cols-4 gap-2 mt-3">
      {THUMB_GRADIENTS.map((grad, i) => (
        <div
          key={i}
          className="aspect-[9/16] rounded-lg relative overflow-hidden flex items-center justify-center"
          style={{ background: grad }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            <Play size={10} className="text-white" fill="white" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ModelCard({ model, index }: { model: ModelData; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
            style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
          >
            {model.initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900">{model.name}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: model.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.06)',
                  color: model.status === 'Active' ? '#16a34a' : '#737373',
                }}
              >
                {model.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{model.niche}</p>
            <a
              href={`https://onlyfans.com/${model.handle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 hover:underline"
              style={{ color: model.color }}
            >
              <ExternalLink size={9} />
              {model.handle}
            </a>
          </div>

          {/* Pipeline summary */}
          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-semibold text-neutral-700">
              {model.reelsInPipeline} reel{model.reelsInPipeline !== 1 ? 's' : ''}
            </p>
            <p className="text-[10px] text-neutral-400">in pipeline</p>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-black/[0.04]"
          >
            <ChevronRight
              size={13}
              className={`text-neutral-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
        </div>

        {/* Pipeline tracker */}
        <PipelineTracker currentStep={model.pipelineStep} color={model.color} />
      </div>

      {/* Reel thumbnails — collapsible */}
      {expanded && (
        <div
          className="px-4 pb-4"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mt-3 mb-1">
            Recent Reels
          </p>
          <ReelGrid color={model.color} />
        </div>
      )}
    </motion.div>
  );
}

// ── Roster tab ────────────────────────────────────────────────────────────────

function RosterView({ activeFilter }: { activeFilter: string }) {
  const filtered = MODELS.filter(m => {
    if (activeFilter === 'active') return m.status === 'Active';
    if (activeFilter === 'paused') return m.status === 'Paused';
    if (activeFilter === 'no-brief') return m.reelsInPipeline === 0;
    return true;
  });

  return (
    <div className="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {filtered.map((model, i) => (
        <ModelCard key={model.id} model={model} index={i} />
      ))}
    </div>
  );
}

// ── Onboarding tab ────────────────────────────────────────────────────────────

function OnboardingView() {
  const steps = [
    { label: 'Contract signed', done: true },
    { label: 'Profile brief submitted', done: true },
    { label: 'Face reference photos uploaded', done: true },
    { label: 'First reel idea sent', done: false },
    { label: 'Test clip reviewed', done: false },
  ];

  return (
    <div className="p-4">
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <p className="text-sm font-semibold text-neutral-900 mb-3">New Model Checklist</p>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: step.done ? '#22c55e' : 'rgba(0,0,0,0.08)',
                }}
              >
                {step.done && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className="text-sm"
                style={{ color: step.done ? '#171717' : '#a3a3a3' }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Performance tab ───────────────────────────────────────────────────────────

function PerformanceView() {
  const stats = [
    { model: 'Tyler', color: '#ff0069', reels: 12, complete: 9, avgEngagement: '4.2%' },
    { model: 'Ren', color: '#833ab4', reels: 9, complete: 7, avgEngagement: '5.1%' },
    { model: 'Ella', color: '#22c55e', reels: 15, complete: 14, avgEngagement: '6.8%' },
    { model: 'Amam', color: '#f59e0b', reels: 6, complete: 4, avgEngagement: '3.9%' },
  ];

  return (
    <div className="p-4 space-y-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.model}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}
          >
            {s.model.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900">{s.model}</p>
            <div className="flex items-center gap-3 mt-1">
              <div
                className="h-1.5 rounded-full flex-1"
                style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(s.complete / s.reels) * 100}%`,
                    backgroundColor: s.color,
                  }}
                />
              </div>
              <span className="text-[11px] text-neutral-500 whitespace-nowrap">
                {s.complete}/{s.reels} reels
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold" style={{ color: s.color }}>{s.avgEngagement}</p>
            <p className="text-[10px] text-neutral-400">avg engagement</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ModelsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('roster');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <ContentPageShell
      icon={<ProductIcon product="content-gen" size={32} />}
      title="Models"
      stat={{ label: 'Active models', value: 4 }}
      searchPlaceholder="Search models..."
      actionLabel="Add Model"
      actionIcon={<UserPlus size={14} />}
      tabs={[
        { id: 'roster',      label: 'Roster',      icon: <Users2 size={13} /> },
        { id: 'onboarding',  label: 'Onboarding',  icon: <UserPlus size={13} /> },
        { id: 'performance', label: 'Performance', icon: <BarChart2 size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',      label: 'All' },
        { id: 'active',   label: 'Active' },
        { id: 'paused',   label: 'Paused' },
        { id: 'no-brief', label: 'No Brief' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      {activeTab === 'roster' && <RosterView activeFilter={activeFilter} />}
      {activeTab === 'onboarding' && <OnboardingView />}
      {activeTab === 'performance' && <PerformanceView />}
    </ContentPageShell>
  );
}
