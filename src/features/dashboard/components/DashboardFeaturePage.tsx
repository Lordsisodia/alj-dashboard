'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  BarChart2,
  Plus,
  Calendar,
  Sparkles,
  Check,
  Video,
  Image,
  FileText,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'approvals' | 'pipeline' | 'analytics';

// ─── Data ─────────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: 'Total Posts',
    value: '1,847',
    sub: '+12 this week',
    subPositive: true,
    icon: <FileText size={18} />,
    iconColor: '#833ab4',
    iconBg: 'rgba(131,58,180,0.1)',
  },
  {
    label: 'Active Models',
    value: '4',
    sub: 'All active',
    subPositive: true,
    icon: <Users size={18} />,
    iconColor: '#22c55e',
    iconBg: 'rgba(34,197,94,0.1)',
  },
  {
    label: 'Pending Approvals',
    value: '3',
    sub: 'Needs review',
    subPositive: false,
    badge: 3,
    icon: <AlertCircle size={18} />,
    iconColor: '#ff0069',
    iconBg: 'rgba(255,0,105,0.1)',
  },
  {
    label: 'Engagement Rate',
    value: '4.2%',
    sub: '+0.4% vs last week',
    subPositive: true,
    icon: <TrendingUp size={18} />,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.1)',
  },
];

const QUICK_ACTIONS = [
  {
    id: 'schedule',
    label: 'Schedule Post',
    desc: 'Add to publishing queue',
    icon: <Calendar size={20} />,
    iconColor: '#833ab4',
    iconBg: 'rgba(131,58,180,0.1)',
  },
  {
    id: 'brief',
    label: 'New Brief',
    desc: 'Generate AI content brief',
    icon: <Sparkles size={20} />,
    iconColor: '#ff0069',
    iconBg: 'rgba(255,0,105,0.1)',
  },
  {
    id: 'approvals',
    label: 'Review Approvals',
    desc: '3 items waiting',
    badge: 3,
    icon: <Check size={20} />,
    iconColor: '#22c55e',
    iconBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'analytics',
    label: 'View Analytics',
    desc: 'Performance overview',
    icon: <BarChart2 size={20} />,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.1)',
  },
];

const ACTIVITY_FEED = [
  { id: 'f1', color: '#22c55e', icon: <Check size={12} />,    text: 'Mikee approved content for',   target: '@abg.ricebunny',   time: '2m ago'  },
  { id: 'f2', color: '#833ab4', icon: <Calendar size={12} />, text: '3 posts scheduled for',        target: '@rhinxrenx',       time: '18m ago' },
  { id: 'f3', color: '#ff0069', icon: <Sparkles size={12} />, text: 'Brief generated for',          target: 'Ella Mira',        time: '1h ago'  },
  { id: 'f4', color: '#f59e0b', icon: <Video size={12} />,    text: 'Reel exported by Raphael for', target: '@ellamira',        time: '2h ago'  },
  { id: 'f5', color: '#833ab4', icon: <Check size={12} />,    text: 'Yssa approved content for',   target: '@samchase',        time: '3h ago'  },
  { id: 'f6', color: '#22c55e', icon: <Image size={12} />,    text: '5 clips uploaded to',         target: 'Content Pipeline', time: '5h ago'  },
  { id: 'f7', color: '#ff0069', icon: <Sparkles size={12} />, text: 'Brief generated for',          target: 'Tyler Rex',        time: '1d ago'  },
  { id: 'f8', color: '#f59e0b', icon: <Calendar size={12} />, text: '7 posts scheduled for',        target: '@abg.ricebunny',   time: '1d ago'  },
];

const UPCOMING_POSTS = [
  { id: 'p1', account: '@abg.ricebunny', type: 'Reel',    time: 'Today, 7:00 PM',   icon: <Video size={13} />,   typeColor: '#833ab4' },
  { id: 'p2', account: '@rhinxrenx',     type: 'Photo',   time: 'Today, 9:00 PM',   icon: <Image size={13} />,   typeColor: '#f59e0b' },
  { id: 'p3', account: '@ellamira',      type: 'Reel',    time: 'Tomorrow, 6:00 PM',icon: <Video size={13} />,   typeColor: '#833ab4' },
  { id: 'p4', account: '@samchase',      type: 'Story',   time: 'Tomorrow, 8:00 PM',icon: <FileText size={13} />,typeColor: '#22c55e' },
  { id: 'p5', account: '@abg.ricebunny', type: 'PPV',     time: 'Apr 8, 7:00 PM',   icon: <Sparkles size={13} />,typeColor: '#ff0069' },
];

const MODELS = [
  { id: 'm1', name: 'Tyler Rex',  handle: '@abg.ricebunny', initials: 'TR', color: '#ff0069', step: 'Approved', reels: 3 },
  { id: 'm2', name: 'Ren Rhinx',  handle: '@rhinxrenx',     initials: 'RR', color: '#833ab4', step: 'Editing',  reels: 2 },
  { id: 'm3', name: 'Ella Mira',  handle: '@ellamira',      initials: 'EM', color: '#f59e0b', step: 'Briefed',  reels: 1 },
  { id: 'm4', name: 'Sam Chase',  handle: '@samchase',      initials: 'SC', color: '#22c55e', step: 'Scheduled',reels: 4 },
];

const PIPELINE_STEPS = ['Briefed', 'Filming', 'Editing', 'Approved', 'Scheduled'];

// ─── Overview Content ─────────────────────────────────────────────────────────

function OverviewContent() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold text-neutral-900">Good morning, Alex 👋</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Here&apos;s what&apos;s happening today — {today}</p>
      </motion.div>

      {/* KPI Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-4 gap-3"
      >
        {KPI_CARDS.map((kpi, i) => (
          <div
            key={kpi.label}
            className="rounded-xl p-4 bg-white relative overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: kpi.iconBg, color: kpi.iconColor }}
              >
                {kpi.icon}
              </div>
              {kpi.badge && (
                <span
                  className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  {kpi.badge}
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-neutral-900">{kpi.value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{kpi.label}</p>
            <p
              className="text-[10px] font-medium mt-1"
              style={{ color: kpi.subPositive ? '#22c55e' : '#f59e0b' }}
            >
              {kpi.sub}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <p className="text-sm font-semibold text-neutral-900 mb-3">Quick Actions</p>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.id}
              className="rounded-xl p-4 bg-white text-left transition-all hover:shadow-sm group"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: action.iconBg, color: action.iconColor }}
                >
                  {action.icon}
                </div>
                {action.badge && (
                  <span
                    className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                  >
                    {action.badge}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700">{action.label}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{action.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Two-column lower */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="grid grid-cols-3 gap-4"
      >
        {/* Activity Feed (2/3) */}
        <div className="col-span-2">
          <p className="text-sm font-semibold text-neutral-900 mb-3">Recent Activity</p>
          <div className="rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            {ACTIVITY_FEED.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                style={{ borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <p className="flex-1 text-[12px] text-neutral-700 min-w-0">
                  {item.text}{' '}
                  <span style={{ color: '#ff0069' }} className="font-medium">{item.target}</span>
                </p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock size={10} className="text-neutral-300" />
                  <span className="text-[10px] text-neutral-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Posts (1/3) */}
        <div>
          <p className="text-sm font-semibold text-neutral-900 mb-3">Upcoming Posts</p>
          <div className="rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            {UPCOMING_POSTS.map((post, i) => (
              <div
                key={post.id}
                className="flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 transition-colors"
                style={{ borderBottom: i < UPCOMING_POSTS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${post.typeColor}18`, color: post.typeColor }}
                >
                  {post.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-neutral-900 truncate">{post.account}</p>
                  <p className="text-[10px] text-neutral-400">{post.time}</p>
                </div>
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
                  style={{ backgroundColor: `${post.typeColor}12`, color: post.typeColor }}
                >
                  {post.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Models Overview Strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <p className="text-sm font-semibold text-neutral-900 mb-3">Models Overview</p>
        <div className="grid grid-cols-4 gap-3">
          {MODELS.map(model => (
            <div
              key={model.id}
              className="rounded-xl p-4 bg-white"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: model.color }}
                >
                  {model.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{model.name}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{model.handle}</p>
                </div>
              </div>
              {/* Pipeline steps */}
              <div className="flex items-center gap-1 mb-2">
                {PIPELINE_STEPS.map(step => {
                  const active = step === model.step;
                  const done = PIPELINE_STEPS.indexOf(step) < PIPELINE_STEPS.indexOf(model.step);
                  return (
                    <div
                      key={step}
                      className="h-1 flex-1 rounded-full"
                      style={{
                        backgroundColor: active
                          ? model.color
                          : done
                            ? `${model.color}50`
                            : 'rgba(0,0,0,0.07)',
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold" style={{ color: model.color }}>{model.step}</span>
                <span className="text-[10px] text-neutral-400">{model.reels} reels/wk</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Placeholder tabs ─────────────────────────────────────────────────────────

function PlaceholderContent({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-64 text-neutral-400 text-sm">
      {label} content coming soon
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeFilter, setActiveFilter] = useState('all');

  const tabContent: Record<Tab, React.ReactNode> = {
    overview:  <OverviewContent />,
    approvals: <PlaceholderContent label="Approvals" />,
    pipeline:  <PlaceholderContent label="Pipeline" />,
    analytics: <PlaceholderContent label="Analytics" />,
  };

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Hub"
      stat={{ label: 'Active models', value: 4 }}
      searchPlaceholder="Search content, models, approvals..."
      actionLabel="New"
      actionIcon={<Plus size={14} />}
      tabs={[
        { id: 'overview',  label: 'Overview',  icon: <LayoutDashboard size={13} /> },
        { id: 'approvals', label: 'Approvals', icon: <CheckSquare size={13} /> },
        { id: 'pipeline',  label: 'Pipeline',  icon: <Activity size={13} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',   label: 'All' },
        { id: 'today', label: 'Today' },
        { id: 'week',  label: 'This Week' },
        { id: 'month', label: 'This Month' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <div className="p-4">
        {tabContent[activeTab]}
      </div>
    </ContentPageShell>
  );
}
