'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Radar, UserPlus, Upload, Play, Globe, LayoutDashboard, Zap, FileDown, XCircle, RefreshCw, CalendarClock, ChevronDown, BarChart2, Sparkles, Star, Target, Heart, List, LayoutGrid, Download, TrendingUp, ScanSearch, Users, Eye, Tag, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColumnVisibilityPill } from './table/filters/ColumnVisibilityPill';
import { ViewToggle } from '@/components/ui/view-toggle';
import type { Tab, Competitor, Candidate } from '../types';
import { COMPETITORS } from '../constants';
import { ReconModals, type ModalId, type DrawerState } from './ReconModals';
import { StatusDropdown } from './table/TableToolbar';
import { STATUS_VIEWS, type StatusView } from './table/tableUtils';
import SuggestiveSearch from '@/components/ui/suggestive-search';
import { useDiscoveryTab } from '../hooks/useDiscoveryTab';
import { useLogDashboard } from '../hooks/useLogDashboard';
import { useCreatorsTab } from '../hooks/useCreatorsTab';
import { TabSkeleton } from './shared/TabSkeleton';
import { TrendsLoadingSkeleton } from '@/features/intelligence/components/trends/TrendsLoadingSkeleton';
import { LiveActivityButton } from '@/components/ui/live-activity-button';
import { StatusStrip, timeAgo } from '@/components/ui/status-strip';

const DiscoveryTab      = dynamic(() => import('./discovery/DiscoveryTab').then(m => ({ default: m.DiscoveryTab })),          { ssr: false, loading: () => <TabSkeleton /> });
const LogDashboard      = dynamic(() => import('./pipeline/LogDashboard').then(m => ({ default: m.LogDashboard })),           { ssr: false, loading: () => <TabSkeleton /> });
const CreatorsTable     = dynamic(() => import('./table/CreatorsTable').then(m => ({ default: m.CreatorsTable })),             { ssr: false, loading: () => <TabSkeleton /> });
const CreatorDetailView = dynamic(() => import('./detail/CreatorDetailView').then(m => ({ default: m.CreatorDetailView })),    { ssr: false, loading: () => <TabSkeleton /> });
const QualifyView       = dynamic(() => import('@/features/intelligence/components/trends').then(m => ({ default: m.QualifyView })), { ssr: false, loading: () => <TrendsLoadingSkeleton /> });

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

export default function ReconFeaturePage() {
  const [activeTab, setActiveTab]             = useState<Tab>(() => {
    try { const raw = localStorage.getItem('recon-active-tab'); return (raw === 'feed' ? 'log' : (raw as Tab)) ?? 'log'; } catch { return 'log'; }
  });
  const [modal, setModal]                     = useState<ModalId>(null);
  const [extraCandidates, setExtraCandidates] = useState<Candidate[]>([]);
  const [extraCreators, setExtraCreators]     = useState<Competitor[]>([]);
  const [drawer, setDrawer]                   = useState<DrawerState | null>(null);
  function fireOnce<T>(set: (v: T[]) => void, value: T[]) { set(value); setTimeout(() => set([]), 0); }

  const { searchQuery, setSearchQuery, runDiscoveryTrigger, setRunDiscoveryTrigger, scheduleHours, setScheduleHours, showAnalytics, setShowAnalytics } = useDiscoveryTab();
  const { runAllTrigger, setRunAllTrigger } = useLogDashboard();
  const [scrapeAllTrigger, setScrapeAllTrigger] = useState<number>(0);
  const { showFavorites, setShowFavorites, creatorsStatusView, setCreatorsStatusView, viewMode: creatorsViewMode, setViewMode: setCreatorsViewMode, colVis, handleColVisChange } = useCreatorsTab();
  const [creatorsStatusCounts, setCreatorsStatusCounts] = useState<Record<StatusView, number>>({ all: 0, raw: 0, enriched: 0, scraped: 0, failed: 0 });
  const [showCreatorsAnalytics, setShowCreatorsAnalytics] = useState(false);
  const [showQualifyAnalytics,  setShowQualifyAnalytics]  = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Competitor | null>(null);
  const [qualifyDays, setQualifyDays] = useState(30);

  const dashboardStats   = useQuery(api.intelligence.getReconDashboardStats);
  const candidatesQuery  = useQuery(api.candidates.list, {});
  const trackedAccounts = useQuery(api.trackedAccounts.list);

  // Compute stats from trackedAccounts
  const accounts = trackedAccounts ?? [];
  const totalTrackedRaw  = dashboardStats?.totalCreators ?? accounts.length;
  const avgViewsRaw       = accounts.filter(a => a.avgViews != null).reduce((s, a) => s + (a.avgViews ?? 0), 0) / Math.max(accounts.filter(a => a.avgViews != null).length, 1);
  const avgEngagementRaw = accounts.filter(a => a.avgEngagementRate != null).reduce((s, a) => s + (a.avgEngagementRate ?? 0), 0) / Math.max(accounts.filter(a => a.avgEngagementRate != null).length, 1);
  const avgFollowersRaw  = accounts.filter(a => a.followerCount != null).reduce((s, a) => s + a.followerCount, 0) / Math.max(accounts.filter(a => a.followerCount != null).length, 1);

  // top niche
  const nicheCounts: Record<string, number> = {};
  accounts.forEach((a: { niche?: string }) => { if (a.niche) nicheCounts[a.niche] = (nicheCounts[a.niche] ?? 0) + 1; });
  const topNiche = Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  const searchBar = <SuggestiveSearch onChange={v => setSearchQuery(v)} />;

  type DropdownItem = { id: string; label: string; icon: React.ReactNode; onClick: () => void };

  const dropdownItems: Record<Tab, DropdownItem[]> = {
    log: [
      { id: 'generate-digest',    label: 'Generate Weekly Digest',     icon: <Sparkles size={13} />,  onClick: () => {} },
      { id: 'generate-viral',     label: 'Generate Viral Alert',        icon: <Zap size={13} />,       onClick: () => {} },
      { id: 'generate-spotlight',  label: 'Generate Creator Spotlight', icon: <Star size={13} />,       onClick: () => {} },
      { id: 'generate-benchmark', label: 'Generate Benchmark',          icon: <Target size={13} />,     onClick: () => {} },
    ],
    discovery: [
      { id: 'add-handle',     label: 'Add Handle Manually', icon: <UserPlus size={13} />,   onClick: () => setModal('add-handle') },
      { id: 'bulk-import',    label: 'Bulk Import CSV',     icon: <Upload size={13} />,     onClick: () => setModal('bulk-import') },
      { id: 'export-cands',   label: 'Export Candidates',   icon: <FileDown size={13} />,   onClick: () => {} },
      { id: 'clear-rejected', label: 'Clear Rejected',      icon: <XCircle size={13} />,    onClick: () => console.log('TODO: clear rejected') },
    ],
    creators: [
      { id: 'track-profile',     label: 'Track Profile',       icon: <Radar size={13} />,    onClick: () => setModal('track-profile') },
      { id: 'track-niche',       label: 'Track Niche',         icon: <Globe size={13} />,    onClick: () => setModal('track-niche') },
      { id: 'bulk-import',       label: 'Bulk Import',         icon: <Upload size={13} />,   onClick: () => setModal('bulk-import') },
      { id: 'run-all',           label: 'Run All Scrapers',    icon: <Play size={13} />,     onClick: () => setRunAllTrigger(n => n + 1) },
      { id: 'scrape-all-posts',  label: 'Scrape All Posts',    icon: <Download size={13} />, onClick: () => setScrapeAllTrigger(n => n + 1) },
      { id: 'export-csv',        label: 'Export CSV',          icon: <FileDown size={13} />, onClick: () => {} },
    ],
    qualify: [
      { id: 'scrape-all', label: 'Scrape All Posts', icon: <Download size={13} />, onClick: () => setScrapeAllTrigger(n => n + 1) },
      { id: 'export-qualify', label: 'Export to CSV', icon: <FileDown size={13} />, onClick: () => {} },
    ],
  };

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="recon" size={32} />}
        title="Recon"
        stat={{ label: 'Creators tracked', value: COMPETITORS.length }}
        searchPlaceholder="Search creators, niches..."
        searchBarComponent={searchBar}
        actionLabel={
          activeTab === 'log'       ? 'Generate'          :
          activeTab === 'discovery' ? 'Run Discovery' :
          activeTab === 'creators'  ? 'Add Creator'   :
          'Scrape Posts'
        }
        actionIcon={
          activeTab === 'log'       ? <Sparkles size={14} />  :
          activeTab === 'discovery' ? <Zap size={14} />       :
          activeTab === 'creators'  ? <UserPlus size={14} />  :
          <ScanSearch size={14} />
        }
        onAction={
          activeTab === 'log'       ? () => setRunAllTrigger(n => n + 1) :
          activeTab === 'discovery' ? () => setRunDiscoveryTrigger(n => n + 1) :
          activeTab === 'creators'  ? () => setModal('track-profile')    :
          () => setScrapeAllTrigger(n => n + 1)
        }
        actionDropdownItems={dropdownItems[activeTab]}
        tabs={[
          { id: 'log',       label: 'Dashboard',                                          icon: <LayoutDashboard size={13} /> },
          { id: 'discovery', label: <span className="flex items-center gap-1.5">Discovery <span className="inline-flex items-center justify-center w-4 h-4 rounded-[4px] text-[9px] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>1</span></span>, icon: null },
          { id: 'creators',  label: <span className="flex items-center gap-1.5">Creators <span className="inline-flex items-center justify-center w-4 h-4 rounded-[4px] text-[9px] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>2</span></span>, icon: null },
          { id: 'qualify',   label: <span className="flex items-center gap-1.5">Qualify <span className="inline-flex items-center justify-center w-4 h-4 rounded-[4px] text-[9px] font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>3</span></span>, icon: null },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => { const t = id as Tab; setActiveTab(t); try { localStorage.setItem('recon-active-tab', t); } catch {} setShowFavorites(false); setSelectedCreator(null); setSearchQuery(''); }}
        nextProduct={{ label: 'Intelligence', icon: <ProductIcon product="intelligence" size={16} />, href: '/isso/intelligence' }}
        filterRightSlot={activeTab === 'qualify' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQualifyAnalytics(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.09)' }}
            >
              <BarChart2 size={12} className="text-red-600" />
              {showQualifyAnalytics ? 'Hide' : 'Show'} analytics
              <ChevronDown size={10} className={cn('transition-transform duration-150', showQualifyAnalytics && 'rotate-180')} />
            </button>
            <LiveActivityButton />
          </div>
        ) : activeTab === 'discovery' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnalytics(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.09)' }}
            >
              <BarChart2 size={12} className="text-red-600" />
              {showAnalytics ? 'Hide' : 'Show'} analytics
              <ChevronDown size={10} className={cn('transition-transform duration-150', showAnalytics && 'rotate-180')} />
            </button>
            <SchedulePicker value={scheduleHours} onChange={setScheduleHours} />
            <LiveActivityButton />
          </div>
        ) : activeTab === 'creators' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreatorsAnalytics(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.09)' }}
            >
              <BarChart2 size={12} className="text-red-600" />
              {showCreatorsAnalytics ? 'Hide' : 'Show'} analytics
              <ChevronDown size={10} className={cn('transition-transform duration-150', showCreatorsAnalytics && 'rotate-180')} />
            </button>
            <LiveActivityButton />
          </div>
        ) : undefined}
        showViewToggle={false}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <AnimatePresence>
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }} className="flex flex-col flex-1 min-h-0">
              {activeTab === 'discovery' && <div className="flex-1 overflow-y-auto"><DiscoveryTab extraCandidates={extraCandidates} showAnalytics={showAnalytics} /></div>}
              {activeTab === 'log' && <div className="flex-1 overflow-y-auto"><LogDashboard extraCreators={extraCreators} onStartDiscovery={() => setRunDiscoveryTrigger(n => n + 1)} onAddCreator={() => setModal('track-profile')} onRunAll={() => setRunAllTrigger(n => n + 1)} /></div>}
              {activeTab === 'creators' && (
                selectedCreator
                  ? <div className="flex-1 overflow-y-auto"><CreatorDetailView creator={selectedCreator} onBack={() => setSelectedCreator(null)} /></div>
                  : <div className="flex-1 overflow-y-auto">
                      <div className="px-4 pt-4">
                        <StatusStrip
                          status={(() => { const active = (dashboardStats?.lastRunAt ?? 0) > Date.now() - 3_600_000; return { label: active ? 'Scraping active' : 'Scraping idle', active }; })()}
                          stats={[
                            { icon: <Users      size={10} />, value: totalTrackedRaw,                               label: 'tracked'       },
                            { icon: <Heart      size={10} />, value: Math.round(avgFollowersRaw).toLocaleString(),  label: 'avg followers' },
                            { icon: <Eye        size={10} />, value: Math.round(avgViewsRaw).toLocaleString(),      label: 'avg views'     },
                            { icon: <TrendingUp size={10} />, value: avgEngagementRaw.toFixed(1) + '%',             label: 'avg ER'        },
                            ...(topNiche ? [{ icon: <Tag size={10} />, value: topNiche, label: 'top niche' }] : []),
                          ]}
                          rightSlot={
                            <>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1.5">
                                <StatusDropdown value={creatorsStatusView} onChange={setCreatorsStatusView} counts={creatorsStatusCounts} />
                                <button
                                  onClick={() => setShowFavorites(v => !v)}
                                  className={cn(
                                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border',
                                    showFavorites
                                      ? 'text-[#ff0069] border-[#ff006930] bg-[#ff006908]'
                                      : 'text-neutral-500 border-transparent hover:border-neutral-200 hover:bg-white',
                                  )}
                                >
                                  <Heart size={11} fill={showFavorites ? '#ff0069' : 'none'} /> Favorites
                                </button>
                                {creatorsViewMode === 'list' && <ColumnVisibilityPill value={colVis} onChange={handleColVisChange} />}
                              </div>
                              <ViewToggle
                                value={creatorsViewMode}
                                onChange={setCreatorsViewMode}
                                options={[
                                  { value: 'list', icon: <List size={11} />, label: 'List' },
                                  { value: 'grid', icon: <LayoutGrid size={11} />, label: 'Grid' },
                                ]}
                                size="md"
                              />
                              <span className="w-px h-3 bg-neutral-200" />
                              <Clock size={10} className="text-red-600" />
                              <span>Last scrape: <span className="font-medium text-neutral-700">{timeAgo(dashboardStats?.lastRunAt ?? 0)}</span></span>
                            </>
                          }
                        />
                      </div>
                      <div className="px-4 py-4">
                        {/* TODO: pass showAnalytics={showCreatorsAnalytics} once CreatorsTable accepts the prop */}
                        <CreatorsTable
                          onOpen={setSelectedCreator}
                          extraCreators={extraCreators}
                          searchQuery={searchQuery}
                          statusCounts={creatorsStatusCounts}
                          onStatusCountsChange={setCreatorsStatusCounts}
                          viewMode={creatorsViewMode}
                          colVis={colVis}
                          onColVisChange={handleColVisChange}
                          scrapeAllTrigger={scrapeAllTrigger}
                        />
                      </div>
                    </div>
              )}
              {activeTab === 'qualify' && (
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="px-6 pt-4">
                    <StatusStrip
                      stats={[
                        { icon: <Users      size={10} />, value: totalTrackedRaw,                              label: 'creators tracked' },
                        { icon: <Eye        size={10} />, value: Math.round(avgViewsRaw).toLocaleString(),     label: 'avg views'        },
                        { icon: <TrendingUp size={10} />, value: avgEngagementRaw.toFixed(1) + '%',            label: 'avg ER'           },
                        ...(topNiche ? [{ icon: <Tag size={10} />, value: topNiche, label: 'top niche' }] : []),
                      ]}
                      rightSlot={
                        <>
                          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                            {[{ label: '7d', value: 7 }, { label: '30d', value: 30 }, { label: '90d', value: 90 }].map(d => (
                              <button
                                key={d.value}
                                onClick={() => setQualifyDays(d.value)}
                                className="px-2.5 py-1 text-[10px] font-semibold transition-all"
                                style={qualifyDays === d.value ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' } : { color: '#9ca3af' }}
                              >
                                {d.label}
                              </button>
                            ))}
                          </div>
                          <Clock size={10} className="text-red-600" />
                          <span>Last scrape: <span className="font-medium text-neutral-700">{timeAgo(dashboardStats?.lastRunAt ?? 0)}</span></span>
                        </>
                      }
                    />
                  </div>
                  {/* TODO: pass showAnalytics={showQualifyAnalytics} once QualifyView accepts the prop */}
                  <QualifyView days={qualifyDays} metric="er" niche="all" platform="all" view="table" onViewChange={() => {}} />
                </div>
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
