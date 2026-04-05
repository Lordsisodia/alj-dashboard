'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  Radar,
  Activity,
  Plus,
  UserPlus,
  Pause,
  Play,
  ExternalLink,
  CheckCircle2,
  Loader2,
  XCircle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'competitors' | 'log';
type CompetitorStatus = 'active' | 'paused';
type LogStatus = 'success' | 'running' | 'failed';

interface Competitor {
  id: number;
  handle: string;
  displayName: string;
  niche: string;
  nicheColor: string;
  avatarColor: string;
  initials: string;
  followers: string;
  engagementRate: string;
  postsPerWeek: number;
  lastScraped: string;
  status: CompetitorStatus;
  trend: number[];
}

interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  handle: string;
  status: LogStatus;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const COMPETITORS: Competitor[] = [
  {
    id: 1,
    handle: '@fitness_king',
    displayName: 'Fitness King',
    niche: 'Fitness',
    nicheColor: '#78c257',
    avatarColor: '#78c257',
    initials: 'FK',
    followers: '284K',
    engagementRate: '5.2%',
    postsPerWeek: 9,
    lastScraped: '12 min ago',
    status: 'active',
    trend: [40, 55, 48, 70, 62, 75, 68],
  },
  {
    id: 2,
    handle: '@gfe_luxe',
    displayName: 'GFE Luxe',
    niche: 'GFE',
    nicheColor: '#ff0069',
    avatarColor: '#ff0069',
    initials: 'GL',
    followers: '197K',
    engagementRate: '7.8%',
    postsPerWeek: 12,
    lastScraped: '1 hour ago',
    status: 'active',
    trend: [60, 58, 72, 68, 80, 77, 85],
  },
  {
    id: 3,
    handle: '@lifestyle.nova',
    displayName: 'Nova Lifestyle',
    niche: 'Lifestyle',
    nicheColor: '#4a9eff',
    avatarColor: '#4a9eff',
    initials: 'NL',
    followers: '431K',
    engagementRate: '3.4%',
    postsPerWeek: 6,
    lastScraped: '3 hours ago',
    status: 'active',
    trend: [35, 40, 38, 42, 39, 45, 41],
  },
  {
    id: 4,
    handle: '@abg.empress',
    displayName: 'ABG Empress',
    niche: 'ABG',
    nicheColor: '#833ab4',
    avatarColor: '#833ab4',
    initials: 'AE',
    followers: '156K',
    engagementRate: '6.1%',
    postsPerWeek: 8,
    lastScraped: '5 hours ago',
    status: 'active',
    trend: [50, 45, 62, 58, 70, 65, 72],
  },
  {
    id: 5,
    handle: '@fitgirl.pro',
    displayName: 'FitGirl Pro',
    niche: 'Fitness',
    nicheColor: '#78c257',
    avatarColor: '#fcaf45',
    initials: 'FP',
    followers: '92K',
    engagementRate: '4.7%',
    postsPerWeek: 7,
    lastScraped: '1 day ago',
    status: 'paused',
    trend: [30, 42, 38, 50, 45, 40, 35],
  },
  {
    id: 6,
    handle: '@glam.gfe',
    displayName: 'Glam GFE',
    niche: 'GFE',
    nicheColor: '#ff0069',
    avatarColor: '#fcaf45',
    initials: 'GG',
    followers: '73K',
    engagementRate: '9.1%',
    postsPerWeek: 14,
    lastScraped: '2 days ago',
    status: 'paused',
    trend: [80, 75, 88, 82, 90, 85, 78],
  },
  {
    id: 7,
    handle: '@daily.luxe',
    displayName: 'Daily Luxe',
    niche: 'Lifestyle',
    nicheColor: '#4a9eff',
    avatarColor: '#4a9eff',
    initials: 'DL',
    followers: '318K',
    engagementRate: '2.9%',
    postsPerWeek: 5,
    lastScraped: '6 hours ago',
    status: 'active',
    trend: [25, 30, 28, 35, 32, 38, 36],
  },
  {
    id: 8,
    handle: '@abg.babyy',
    displayName: 'ABG Baby',
    niche: 'ABG',
    nicheColor: '#833ab4',
    avatarColor: '#833ab4',
    initials: 'AB',
    followers: '211K',
    engagementRate: '5.8%',
    postsPerWeek: 10,
    lastScraped: '30 min ago',
    status: 'active',
    trend: [45, 52, 60, 55, 68, 72, 70],
  },
];

const LOG_ENTRIES: LogEntry[] = [
  { id: 1,  timestamp: 'Today, 3:42 PM',    action: 'Scraped 47 new posts from',       handle: '@fitness_king',   status: 'success' },
  { id: 2,  timestamp: 'Today, 3:40 PM',    action: 'Scraped 31 new posts from',       handle: '@abg.babyy',     status: 'success' },
  { id: 3,  timestamp: 'Today, 3:12 PM',    action: 'Scraping in progress for',        handle: '@gfe_luxe',      status: 'running' },
  { id: 4,  timestamp: 'Today, 2:58 PM',    action: 'Scraped 19 new posts from',       handle: '@lifestyle.nova', status: 'success' },
  { id: 5,  timestamp: 'Today, 1:30 PM',    action: 'Failed to connect to',            handle: '@fitgirl.pro',   status: 'failed' },
  { id: 6,  timestamp: 'Today, 11:14 AM',   action: 'Scraped 62 new posts from',       handle: '@abg.empress',   status: 'success' },
  { id: 7,  timestamp: 'Today, 9:05 AM',    action: 'Scraped 28 new posts from',       handle: '@daily.luxe',    status: 'success' },
  { id: 8,  timestamp: 'Yesterday, 6:22 PM','action': 'Rate limit hit scraping',       handle: '@glam.gfe',      status: 'failed' },
  { id: 9,  timestamp: 'Yesterday, 4:10 PM','action': 'Scraped 88 new posts from',    handle: '@gfe_luxe',      status: 'success' },
  { id: 10, timestamp: 'Yesterday, 2:00 PM','action': 'Scraped 44 new posts from',    handle: '@fitness_king',  status: 'success' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.5 + (i / values.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// ─── Competitor Card ──────────────────────────────────────────────────────────

function CompetitorCard({ competitor, onToggle }: { competitor: Competitor; onToggle: (id: number) => void }) {
  const isActive = competitor.status === 'active';

  return (
    <motion.div
      variants={fadeUp}
      className="p-4 rounded-xl"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ backgroundColor: competitor.avatarColor }}
          >
            {competitor.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{competitor.handle}</p>
            <div
              className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-white"
              style={{ backgroundColor: competitor.nicheColor }}
            >
              {competitor.niche}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div
          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold"
          style={
            isActive
              ? { backgroundColor: 'rgba(120,194,87,0.12)', color: '#4a8a2d' }
              : { backgroundColor: 'rgba(251,191,36,0.12)', color: '#92640a' }
          }
        >
          {isActive ? 'Active' : 'Paused'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Followers',  value: competitor.followers },
          { label: 'Eng. Rate',  value: competitor.engagementRate },
          { label: 'Posts/Wk',  value: String(competitor.postsPerWeek) },
        ].map(({ label, value }) => (
          <div key={label} className="text-center p-2 rounded-lg" style={{ backgroundColor: '#fafafa' }}>
            <p className="text-xs font-bold text-neutral-900">{value}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Sparkline + last scraped */}
      <div className="mb-3">
        <Sparkline values={competitor.trend} color={competitor.nicheColor} />
        <p className="text-[10px] text-neutral-400 mt-1">Scraped {competitor.lastScraped}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{
            background: 'linear-gradient(135deg, #ff0069, #833ab4)',
            color: '#fff',
          }}
        >
          <ExternalLink size={11} />
          View Content
        </button>
        <button
          className="p-1.5 rounded-lg transition-colors hover:bg-neutral-100"
          style={{ border: '1px solid rgba(0,0,0,0.08)', color: '#6b7280' }}
          onClick={() => onToggle(competitor.id)}
          title={isActive ? 'Pause' : 'Resume'}
        >
          {isActive ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Competitors View ─────────────────────────────────────────────────────────

function CompetitorsView({ filter }: { filter: string }) {
  const [competitors, setCompetitors] = useState(COMPETITORS);

  const filtered = competitors.filter((c) => {
    if (filter === 'active') return c.status === 'active';
    if (filter === 'paused') return c.status === 'paused';
    return true;
  });

  function toggleStatus(id: number) {
    setCompetitors((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
      )
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {filtered.map((c) => (
        <CompetitorCard key={c.id} competitor={c} onToggle={toggleStatus} />
      ))}
    </motion.div>
  );
}

// ─── Log View ─────────────────────────────────────────────────────────────────

const LOG_STATUS_CONFIG: Record<LogStatus, { icon: React.ReactNode; color: string }> = {
  success: {
    icon: <CheckCircle2 size={14} />,
    color: '#4a8a2d',
  },
  running: {
    icon: <Loader2 size={14} className="animate-spin" />,
    color: '#4a9eff',
  },
  failed: {
    icon: <XCircle size={14} />,
    color: '#dc2626',
  },
};

function LogView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
      {LOG_ENTRIES.map((entry) => {
        const cfg = LOG_STATUS_CONFIG[entry.status];
        return (
          <motion.div
            key={entry.id}
            variants={fadeUp}
            className="flex items-center gap-4 px-4 py-3 rounded-xl"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            {/* Status dot */}
            <div style={{ color: cfg.color }} className="flex-shrink-0">
              {cfg.icon}
            </div>

            {/* Action text */}
            <p className="flex-1 text-xs text-neutral-700">
              {entry.action}{' '}
              <span
                className="font-semibold cursor-pointer hover:underline"
                style={{ color: '#ff0069' }}
              >
                {entry.handle}
              </span>
            </p>

            {/* Timestamp */}
            <span className="text-[11px] text-neutral-400 flex-shrink-0">{entry.timestamp}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ReconFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('competitors');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <ContentPageShell
      icon={<ProductIcon product="recon" size={32} />}
      title="Recon"
      stat={{ label: 'Competitors tracked', value: 12 }}
      searchPlaceholder="Search competitors, niches..."
      actionLabel="Add Competitor"
      actionIcon={<UserPlus size={14} />}
      actionDropdownItems={[
        { id: 'profile', label: 'Track Profile', icon: <UserPlus size={13} /> },
        { id: 'niche',   label: 'Track Niche',   icon: <Radar size={13} /> },
      ]}
      tabs={[
        { id: 'competitors', label: 'Competitors',  icon: <Radar size={13} /> },
        { id: 'log',         label: 'Scraping Log', icon: <Activity size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',    label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'paused', label: 'Paused' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      showViewToggle
    >
      <div className="px-6 py-6 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeTab === 'competitors' && <CompetitorsView filter={activeFilter} />}
            {activeTab === 'log' && <LogView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
