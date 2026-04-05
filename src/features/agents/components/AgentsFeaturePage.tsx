'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  Bot,
  Activity,
  FileText,
  MessageSquare,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'activity' | 'reports' | 'requests';
type AgentStatus = 'running' | 'completed' | 'failed';
type AgentType = 'Scraper' | 'Scheduler' | 'Analyst';
type RequestStatus = 'Queued' | 'In Progress' | 'Delivered';
type ReportCategory = 'Intelligence' | 'Recon' | 'Performance';

interface AgentTask {
  id: number;
  agentName: string;
  type: AgentType;
  description: string;
  status: AgentStatus;
  startedAt: string;
  duration: string;
  progress: number;
  outputPreview: string;
}

interface Report {
  id: number;
  title: string;
  insights: string[];
  generatedBy: string;
  date: string;
  category: ReportCategory;
}

interface FeatureRequest {
  id: number;
  title: string;
  description: string;
  requestedBy: string;
  date: string;
  status: RequestStatus;
  eta: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const AGENT_TASKS: AgentTask[] = [
  {
    id: 1,
    agentName: 'Recon Scraper #1',
    type: 'Scraper',
    description: 'Scraping competitor @fitness_king — found 23 new posts',
    status: 'running',
    startedAt: 'Today, 3:40 PM',
    duration: '2m 14s',
    progress: 68,
    outputPreview: '23 posts found, 18 processed, 5 queued…',
  },
  {
    id: 2,
    agentName: 'Intelligence Indexer',
    type: 'Analyst',
    description: 'Indexing 412 new reels from community feed — niche tagging in progress',
    status: 'running',
    startedAt: 'Today, 3:35 PM',
    duration: '7m 02s',
    progress: 41,
    outputPreview: 'Tagged 169/412 reels. Dominant niches: Fitness (34%), GFE (28%)…',
  },
  {
    id: 3,
    agentName: 'Post Scheduler Bot',
    type: 'Scheduler',
    description: 'Scheduled 8 posts for @abg.ricebunny across the next 7 days',
    status: 'completed',
    startedAt: 'Today, 2:15 PM',
    duration: '0m 48s',
    progress: 100,
    outputPreview: '8 posts queued. Next: Apr 7 at 6:00 PM.',
  },
  {
    id: 4,
    agentName: 'Recon Scraper #2',
    type: 'Scraper',
    description: 'Attempted scrape of @glam.gfe — rate limit reached, retrying in 30 min',
    status: 'failed',
    startedAt: 'Today, 1:30 PM',
    duration: '0m 12s',
    progress: 0,
    outputPreview: 'Error: 429 Too Many Requests. Retry scheduled 2:00 PM.',
  },
  {
    id: 5,
    agentName: 'Weekly Report Agent',
    type: 'Analyst',
    description: 'Generated weekly intelligence report — 14 insights extracted',
    status: 'completed',
    startedAt: 'Today, 9:00 AM',
    duration: '3m 21s',
    progress: 100,
    outputPreview: 'Report saved. Top insight: GFE engagement up 12% WoW.',
  },
];

const REPORTS: Report[] = [
  {
    id: 1,
    title: 'Weekly Intelligence Report — Apr 5, 2026',
    insights: [
      'GFE content engagement up 12% week-over-week across tracked accounts',
      'Short-form reels under 30s outperforming 60s+ clips by 2.4x in saves',
      '@fitness_king posted 9 reels this week — highest cadence of tracked competitors',
      'Trending hook pattern: "Day in my life" style intros driving 3.1x saves vs. direct promo',
    ],
    generatedBy: 'Intelligence Indexer',
    date: 'Apr 5, 2026',
    category: 'Intelligence',
  },
  {
    id: 2,
    title: 'Competitor Recon Digest — Apr 3, 2026',
    insights: [
      '@gfe_luxe has the highest average engagement rate at 7.8% — up from 6.2% last month',
      'Competitors averaging 8.4 posts/week; our models currently at 6.2 — gap to close',
      '@lifestyle.nova gained 22K followers this week, likely driven by a viral reel',
      'Paused competitors show 31% lower follower growth vs. active scraped accounts',
    ],
    generatedBy: 'Recon Scraper #1',
    date: 'Apr 3, 2026',
    category: 'Recon',
  },
  {
    id: 3,
    title: 'Performance Snapshot — Mar 31, 2026',
    insights: [
      'Top performing creator this week: @ellamira — 19.8K likes on single post',
      'Schedule adherence at 94% — 1 post missed due to approval delay',
      'Average time-to-post after approval: 4.2 hours (target: under 2 hours)',
    ],
    generatedBy: 'Weekly Report Agent',
    date: 'Mar 31, 2026',
    category: 'Performance',
  },
];

const FEATURE_REQUESTS: FeatureRequest[] = [
  {
    id: 1,
    title: 'Auto-caption generation for Reels',
    description: 'Automatically generate captions with relevant hashtags when scheduling a new reel, based on niche and content tags.',
    requestedBy: 'Shaan S.',
    date: 'Apr 4, 2026',
    status: 'In Progress',
    eta: 'Apr 10, 2026',
  },
  {
    id: 2,
    title: 'Competitor content alerts',
    description: 'Push notification when a tracked competitor posts content that exceeds a set engagement threshold.',
    requestedBy: 'Shaan S.',
    date: 'Apr 2, 2026',
    status: 'Queued',
    eta: 'Apr 18, 2026',
  },
  {
    id: 3,
    title: 'Board sharing via link',
    description: 'Allow boards in Intelligence to be shared externally via a read-only link for client presentations.',
    requestedBy: 'Shaan S.',
    date: 'Mar 30, 2026',
    status: 'Delivered',
    eta: 'Shipped',
  },
  {
    id: 4,
    title: 'CSV export for recon data',
    description: 'Export competitor stats (followers, engagement rate, posts/week) as a downloadable CSV for reporting.',
    requestedBy: 'Shaan S.',
    date: 'Mar 28, 2026',
    status: 'Queued',
    eta: 'Apr 22, 2026',
  },
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

const TYPE_COLOR: Record<AgentType, string> = {
  Scraper: '#4a9eff',
  Scheduler: '#833ab4',
  Analyst: '#ff0069',
};

const REPORT_CAT_COLOR: Record<ReportCategory, string> = {
  Intelligence: '#ff0069',
  Recon: '#4a9eff',
  Performance: '#78c257',
};

const REQUEST_STATUS_CONFIG: Record<RequestStatus, { bg: string; color: string }> = {
  Queued:      { bg: 'rgba(251,191,36,0.12)', color: '#92640a' },
  'In Progress': { bg: 'rgba(74,158,255,0.12)', color: '#1d6eb5' },
  Delivered:   { bg: 'rgba(120,194,87,0.12)',  color: '#4a8a2d' },
};

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({ task }: { task: AgentTask }) {
  const isRunning   = task.status === 'running';
  const isCompleted = task.status === 'completed';

  const statusConfig = {
    running: {
      label: 'Running',
      icon: <Loader2 size={12} className="animate-spin" />,
      bg: 'rgba(74,158,255,0.12)',
      color: '#1d6eb5',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle2 size={12} />,
      bg: 'rgba(120,194,87,0.12)',
      color: '#4a8a2d',
    },
    failed: {
      label: 'Failed',
      icon: <XCircle size={12} />,
      bg: 'rgba(220,38,38,0.1)',
      color: '#dc2626',
    },
  }[task.status];

  return (
    <motion.div
      variants={fadeUp}
      className="p-4 rounded-xl space-y-3"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${TYPE_COLOR[task.type]}18` }}
          >
            <Bot size={14} style={{ color: TYPE_COLOR[task.type] }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-900 truncate">{task.agentName}</p>
            <div
              className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
              style={{ backgroundColor: `${TYPE_COLOR[task.type]}18`, color: TYPE_COLOR[task.type] }}
            >
              {task.type}
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold flex-shrink-0"
          style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
        >
          {isRunning && (
            <span className="relative flex h-1.5 w-1.5 mr-0.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: statusConfig.color }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ backgroundColor: statusConfig.color }}
              />
            </span>
          )}
          {statusConfig.icon}
          {statusConfig.label}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-neutral-600">{task.description}</p>

      {/* Progress bar for running */}
      {isRunning && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">Progress</span>
            <span className="text-[10px] font-semibold text-neutral-700">{task.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </div>
      )}

      {/* Output preview */}
      <div
        className="px-3 py-2 rounded-lg text-[11px] text-neutral-500 font-mono leading-relaxed"
        style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.05)' }}
      >
        {task.outputPreview}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-neutral-400">
        <span>Started {task.startedAt}</span>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{task.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Activity View ────────────────────────────────────────────────────────────

function ActivityView({ filter }: { filter: string }) {
  const filtered = AGENT_TASKS.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {filtered.map((task) => (
        <ActivityCard key={task.id} task={task} />
      ))}
    </motion.div>
  );
}

// ─── Reports View ─────────────────────────────────────────────────────────────

function ReportCard({ report }: { report: Report }) {
  const catColor = REPORT_CAT_COLOR[report.category];

  return (
    <motion.div
      variants={fadeUp}
      className="p-5 rounded-xl space-y-4"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className="inline-block mb-2 px-2 py-0.5 rounded-lg text-[10px] font-semibold"
            style={{ backgroundColor: `${catColor}15`, color: catColor }}
          >
            {report.category}
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug">{report.title}</h3>
        </div>
        <FileText size={16} className="text-neutral-300 flex-shrink-0 mt-1" />
      </div>

      {/* Insights */}
      <ul className="space-y-2">
        {report.insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-neutral-600">
            <div
              className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: catColor }}
            />
            {insight}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-neutral-400">
          {report.generatedBy} · {report.date}
        </span>
        <button
          className="flex items-center gap-1 text-[11px] font-semibold"
          style={{ color: '#ff0069' }}
        >
          Read Full Report <ChevronRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}

function ReportsView() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {REPORTS.map((r) => (
        <ReportCard key={r.id} report={r} />
      ))}
    </motion.div>
  );
}

// ─── Requests View ────────────────────────────────────────────────────────────

function RequestCard({ request }: { request: FeatureRequest }) {
  const cfg = REQUEST_STATUS_CONFIG[request.status];

  return (
    <motion.div
      variants={fadeUp}
      className="p-4 rounded-xl space-y-3"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900">{request.title}</p>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{request.description}</p>
        </div>
        <div
          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold flex-shrink-0"
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
          {request.status}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>By {request.requestedBy} · {request.date}</span>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
          style={{ backgroundColor: '#f3f4f6' }}
        >
          <Clock size={10} />
          <span className="text-neutral-600 font-medium">{request.eta}</span>
        </div>
      </div>
    </motion.div>
  );
}

function RequestsView() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTitle('');
    setDesc('');
    setShowForm(false);
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Inline new request form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div
              className="p-4 rounded-xl space-y-3"
              style={{ backgroundColor: 'rgba(255,0,105,0.03)', border: '1px solid rgba(255,0,105,0.15)' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-900">New Feature Request</p>
                <button type="button" onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={14} />
                </button>
              </div>
              <input
                className="w-full px-3 py-2 rounded-lg text-xs text-neutral-900 outline-none focus:ring-2 transition-shadow"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  // @ts-expect-error focus ring style via CSS variable not typed
                  '--tw-ring-color': 'rgba(255,0,105,0.3)',
                }}
                placeholder="Feature title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full px-3 py-2 rounded-lg text-xs text-neutral-900 outline-none focus:ring-2 transition-shadow resize-none"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  // @ts-expect-error focus ring style via CSS variable not typed
                  '--tw-ring-color': 'rgba(255,0,105,0.3)',
                }}
                placeholder="Describe what you need…"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              >
                <Send size={11} /> Submit Request
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!showForm && (
        <motion.button
          variants={fadeUp}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          onClick={() => setShowForm(true)}
        >
          <Plus size={12} /> New Request
        </motion.button>
      )}

      {FEATURE_REQUESTS.map((r) => (
        <RequestCard key={r.id} request={r} />
      ))}
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AgentsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('activity');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <ContentPageShell
      icon={<ProductIcon product="agents" size={32} />}
      title="Agents"
      stat={{ label: 'Active workers', value: 4 }}
      searchPlaceholder="Search agents, tasks..."
      actionLabel="New Agent"
      actionIcon={<Plus size={14} />}
      actionDropdownItems={[
        { id: 'scraper',   label: 'Scraper Agent',  icon: <Activity size={13} /> },
        { id: 'scheduler', label: 'Post Scheduler', icon: <Bot size={13} /> },
        { id: 'reporter',  label: 'Report Agent',   icon: <FileText size={13} /> },
      ]}
      tabs={[
        { id: 'activity',  label: 'Activity',  icon: <Activity size={13} /> },
        { id: 'reports',   label: 'Reports',   icon: <FileText size={13} /> },
        { id: 'requests',  label: 'Requests',  icon: <MessageSquare size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',       label: 'All' },
        { id: 'running',   label: 'Running' },
        { id: 'completed', label: 'Completed' },
        { id: 'failed',    label: 'Failed' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <div className="px-6 py-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeTab === 'activity'  && <ActivityView filter={activeFilter} />}
            {activeTab === 'reports'   && <ReportsView />}
            {activeTab === 'requests'  && <RequestsView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
