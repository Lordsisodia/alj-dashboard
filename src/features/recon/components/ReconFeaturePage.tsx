'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { FILTER_CATEGORIES } from '@/features/intelligence/filterConfig';
import { SortPill, VisibilityPill, DEFAULT_VISIBILITY, type SortId, type VisibilityState } from '@/isso/ui/FeedControls';
import { DateRangePill } from '@/isso/ui/DateRangePill';
import { Radar, UserPlus, Upload, Play, Clock, Globe, LayoutDashboard, Zap, FileDown, XCircle, Pause, RefreshCw, Filter, Save, CalendarClock, ChevronDown } from 'lucide-react';
import type { Tab, Competitor, Candidate } from '../types';
import { COMPETITORS } from '../constants';
import { ALERT_THRESHOLDS } from './creators/discovery/discoveryData';
import { DiscoveryTab } from './creators';
import { ReconModals, type ModalId, type DrawerState } from './ReconModals';

const LogDashboard      = dynamic(() => import('./creators/LogDashboard').then(m => ({ default: m.LogDashboard })),           { ssr: false });
const CreatorsTable     = dynamic(() => import('./creators/CreatorsTable').then(m => ({ default: m.CreatorsTable })),         { ssr: false });
const CreatorDetailView = dynamic(() => import('./creators/CreatorDetailView').then(m => ({ default: m.CreatorDetailView })), { ssr: false });
const ReconFeedTab      = dynamic(() => import('./ReconFeedTab').then(m => ({ default: m.ReconFeedTab })),                    { ssr: false });

const SCHEDULE_OPTIONS = [
  { value: 3,  label: 'Every 3h'  },
  { value: 6,  label: 'Every 6h'  },
  { value: 12, label: 'Every 12h' },
  { value: 24, label: 'Every 24h' },
];

function SchedulePicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = SCHEDULE_OPTIONS.find(o => o.value === value)?.label ?? `Every ${value}h`;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
      >
        <CalendarClock size={12} className="text-red-600" />
        {label}
        <ChevronDown size={11} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 z-50 rounded-xl bg-white py-1 min-w-[120px]"
          style={{ border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
        >
          {SCHEDULE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${opt.value === value ? 'font-semibold text-neutral-900 bg-neutral-50' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ALERT_OPTIONS = [
  { value: 5,  label: '5x'  },
  { value: 10, label: '10x' },
  { value: 20, label: '20x' },
];

function AlertPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = ALERT_OPTIONS.find(o => o.value === value)?.label ?? `${value}x`;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
      >
        <Zap size={12} className="text-amber-500" />
        {label}
        <ChevronDown size={11} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 z-50 rounded-xl bg-white py-1 min-w-[100px]"
          style={{ border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
        >
          {ALERT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${opt.value === value ? 'font-semibold text-neutral-900 bg-neutral-50' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              {opt.label} outlier spike
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReconFeaturePage() {
  const [activeTab, setActiveTab]             = useState<Tab>('log');
  const [searchQuery, setSearchQuery]         = useState('');
  const [showFavorites, setShowFavorites]     = useState(false);
  const [sortBy, setSortBy]                   = useState<SortId>('newest');
  const [visibility, setVisibility]           = useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [viewMode, setViewMode]               = useState<'grid' | 'list'>('grid');
  const [drawer, setDrawer]                   = useState<DrawerState | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Competitor | null>(null);
  const [modal, setModal]                     = useState<ModalId>(null);
  const [extraCandidates, setExtraCandidates] = useState<Candidate[]>([]);
  const [extraCreators, setExtraCreators]     = useState<Competitor[]>([]);
  const [runAllTrigger, setRunAllTrigger]         = useState(0);
  const [runDiscoveryTrigger, setRunDiscoveryTrigger] = useState(0);
  const [scheduleHours, setScheduleHours]         = useState(6);
  const [alertThreshold, setAlertThreshold]         = useState(10);
  function fireOnce<T>(set: (v: T[]) => void, value: T[]) { set(value); setTimeout(() => set([]), 0); }

  type DropdownItem = { id: string; label: string; icon: React.ReactNode; onClick: () => void };

  const dropdownItems: Record<Tab, DropdownItem[]> = {
    log: [
      { id: 'run-all',        label: 'Run All Scrapers',    icon: <Play size={13} />,       onClick: () => setRunAllTrigger(n => n + 1) },
      { id: 'schedule',       label: 'Schedule Scrape',     icon: <Clock size={13} />,      onClick: () => {} },
      { id: 'pause-all',      label: 'Pause All Scrapers',  icon: <Pause size={13} />,      onClick: () => {} },
      { id: 'export-report',  label: 'Export Report',       icon: <FileDown size={13} />,   onClick: () => {} },
    ],
    discovery: [
      { id: 'add-handle',     label: 'Add Handle Manually', icon: <UserPlus size={13} />,   onClick: () => setModal('add-handle') },
      { id: 'bulk-import',    label: 'Bulk Import CSV',     icon: <Upload size={13} />,     onClick: () => setModal('bulk-import') },
      { id: 'export-cands',   label: 'Export Candidates',   icon: <FileDown size={13} />,   onClick: () => {} },
      { id: 'clear-rejected', label: 'Clear Rejected',      icon: <XCircle size={13} />,    onClick: () => {} },
    ],
    creators: [
      { id: 'track-profile',  label: 'Track Profile',       icon: <Radar size={13} />,      onClick: () => setModal('track-profile') },
      { id: 'track-niche',    label: 'Track Niche',         icon: <Globe size={13} />,      onClick: () => setModal('track-niche') },
      { id: 'bulk-import',    label: 'Bulk Import',         icon: <Upload size={13} />,     onClick: () => setModal('bulk-import') },
      { id: 'run-all',        label: 'Run All Scrapers',    icon: <Play size={13} />,       onClick: () => setRunAllTrigger(n => n + 1) },
      { id: 'export-csv',     label: 'Export CSV',          icon: <FileDown size={13} />,   onClick: () => {} },
    ],
    feed: [
      { id: 'refresh-feed',   label: 'Refresh Feed',        icon: <RefreshCw size={13} />,  onClick: () => {} },
      { id: 'export-feed',    label: 'Export Feed',         icon: <FileDown size={13} />,   onClick: () => {} },
      { id: 'filter-creator', label: 'Filter by Creator',   icon: <Filter size={13} />,     onClick: () => {} },
      { id: 'save-hub',       label: 'Save All to Hub',     icon: <Save size={13} />,       onClick: () => {} },
    ],
  };

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="recon" size={32} />}
        title="Recon"
        stat={{ label: 'Creators tracked', value: COMPETITORS.length }}
        searchPlaceholder="Search creators, niches..."
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        actionLabel={
          activeTab === 'log'       ? 'Run'           :
          activeTab === 'discovery' ? 'Run Discovery' :
          activeTab === 'creators'  ? 'Add Creator'   :
          'Refresh'
        }
        actionIcon={
          activeTab === 'log'       ? <Play size={14} />      :
          activeTab === 'discovery' ? <Zap size={14} />       :
          activeTab === 'creators'  ? <UserPlus size={14} />  :
          <RefreshCw size={14} />
        }
        onAction={
          activeTab === 'log'       ? () => setRunAllTrigger(n => n + 1) :
          activeTab === 'discovery' ? () => setRunDiscoveryTrigger(n => n + 1) :
          activeTab === 'creators'  ? () => setModal('track-profile')    :
          () => {}
        }
        actionDropdownItems={dropdownItems[activeTab]}
        tabs={[
          { id: 'log',       label: 'Dashboard',                                          icon: <LayoutDashboard size={13} /> },
          { id: 'discovery', label: <span className="flex items-center gap-1.5">Discovery <span className="inline-flex items-center justify-center w-4 h-4 rounded-[4px] text-[9px] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>1</span></span>, icon: null },
          { id: 'creators',  label: <span className="flex items-center gap-1.5">Creators <span className="inline-flex items-center justify-center w-4 h-4 rounded-[4px] text-[9px] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>2</span></span>, icon: null },
          { id: 'feed',      label: <span className="flex items-center gap-1.5">Community Feed <span className="inline-flex items-center justify-center w-4 h-4 rounded-[4px] text-[9px] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>3</span></span>, icon: null },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => { setActiveTab(id as Tab); setShowFavorites(false); setSelectedCreator(null); setSearchQuery(''); }}
        nextProduct={{ label: 'Intelligence', icon: <ProductIcon product="intelligence" size={16} />, href: '/isso/intelligence' }}
        filterCategories={activeTab === 'feed' ? FILTER_CATEGORIES : undefined}
        filterRightSlot={activeTab === 'discovery' ? (
          <div className="flex items-center gap-2">
            <SchedulePicker value={scheduleHours} onChange={setScheduleHours} />
            <AlertPicker value={alertThreshold} onChange={setAlertThreshold} />
          </div>
        ) : activeTab === 'feed' ? (
          <div className="flex items-center gap-1.5">
            <SortPill value={sortBy} onChange={setSortBy} />
            <DateRangePill />
            <VisibilityPill value={visibility} onChange={setVisibility} />
          </div>
        ) : undefined}
        showViewToggle={activeTab === 'feed'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      >
        <div className={activeTab === 'feed' ? 'px-4 py-4 w-full' : 'w-full'}>
          <AnimatePresence>
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}>
              {activeTab === 'discovery' && <DiscoveryTab extraCandidates={extraCandidates} searchQuery={searchQuery} runDiscoveryTrigger={runDiscoveryTrigger} alertThreshold={alertThreshold} onAlertChange={setAlertThreshold} />}
              {activeTab === 'log'       && <LogDashboard extraCreators={extraCreators} runAllTrigger={runAllTrigger} />}
              {activeTab === 'creators'  && (
                selectedCreator
                  ? <CreatorDetailView creator={selectedCreator} onBack={() => setSelectedCreator(null)} />
                  : <CreatorsTable showFavoritesOnly={showFavorites} onToggleFavorites={() => setShowFavorites(v => !v)} onOpen={setSelectedCreator} extraCreators={extraCreators} searchQuery={searchQuery} />
              )}
              {activeTab === 'feed' && (
                <ReconFeedTab sortBy={sortBy} visibility={visibility} viewMode={viewMode} onPostClick={(index, posts) => setDrawer({ index, posts })} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ContentPageShell>

      <ReconModals
        modal={modal}
        drawer={drawer}
        onCloseModal={() => setModal(null)}
        onCloseDrawer={() => setDrawer(null)}
        onAddCandidate={c => fireOnce(setExtraCandidates, [c])}
        onBulkImport={cs => fireOnce(setExtraCandidates, cs)}
        onAddCreator={c => fireOnce(setExtraCreators, [c])}
      />
    </>
  );
}
