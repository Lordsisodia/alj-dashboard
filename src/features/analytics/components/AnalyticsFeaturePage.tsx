'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  BarChart2, TrendingUp, DollarSign,
  Users, Heart, MessageCircle, Bookmark, Eye,
  MapPin, Clock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'growth' | 'revenue';

interface GrowthPoint { label: string; value: number; }
interface EngagementPoint { week: string; rate: number; }
interface TopPost {
  id: number;
  gradientFrom: string;
  gradientTo: string;
  handle: string;
  handleColor: string;
  caption: string;
  likes: number;
  comments: number;
  saves: number;
  reach: number;
  posted: string;
  likesChange?: number;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const FOLLOWER_GROWTH: GrowthPoint[] = [
  { label: 'Jan', value: 185000 },
  { label: 'Feb', value: 194000 },
  { label: 'Mar', value: 203000 },
  { label: 'Apr', value: 211000 },
  { label: 'May', value: 218000 },
  { label: 'Jun', value: 224000 },
  { label: 'Jul', value: 229000 },
  { label: 'Aug', value: 234000 },
  { label: 'Sep', value: 238000 },
  { label: 'Oct', value: 241000 },
  { label: 'Nov', value: 243500 },
  { label: 'Dec', value: 245000 },
];

const ENGAGEMENT_DATA: EngagementPoint[] = [
  { week: 'W1', rate: 3.8 },
  { week: 'W2', rate: 4.1 },
  { week: 'W3', rate: 3.9 },
  { week: 'W4', rate: 4.4 },
  { week: 'W5', rate: 4.2 },
  { week: 'W6', rate: 4.7 },
  { week: 'W7', rate: 4.5 },
  { week: 'W8', rate: 4.7 },
];

const TOP_POSTS: TopPost[] = [
  {
    id: 1,
    gradientFrom: '#ff0069',
    gradientTo: '#fd1d1d',
    handle: '@abg.ricebunny',
    handleColor: '#ff0069',
    caption: 'Monday grind. 5am club is real.',
    likes: 8412,
    comments: 234,
    saves: 180,
    reach: 89400,
    posted: 'Apr 5, 2026',
    likesChange: 18,
  },
  {
    id: 2,
    gradientFrom: '#fcaf45',
    gradientTo: '#833ab4',
    handle: '@onlytylerrex',
    handleColor: '#fcaf45',
    caption: 'Post-workout glow. Consistency is everything.',
    likes: 6200,
    comments: 178,
    saves: 141,
    reach: 67200,
    posted: 'Apr 4, 2026',
  },
  {
    id: 3,
    gradientFrom: '#833ab4',
    gradientTo: '#78c257',
    handle: '@rhinxrenx',
    handleColor: '#833ab4',
    caption: '5 ways to stay consistent with your fitness goals.',
    likes: 4120,
    comments: 89,
    saves: 312,
    reach: 34100,
    posted: 'Apr 4, 2026',
  },
  {
    id: 4,
    gradientFrom: '#78c257',
    gradientTo: '#00f4e2',
    handle: '@ellamira',
    handleColor: '#78c257',
    caption: 'Golden hour at the rooftop. No plan, just vibes.',
    likes: 3870,
    comments: 56,
    saves: 98,
    reach: 28900,
    posted: 'Apr 3, 2026',
  },
  {
    id: 5,
    gradientFrom: '#ff0069',
    gradientTo: '#833ab4',
    handle: '@abg.ricebunny',
    handleColor: '#ff0069',
    caption: 'Transformation Tuesday. 12 weeks in. Same mirror, different energy.',
    likes: 7100,
    comments: 198,
    saves: 214,
    reach: 76300,
    posted: 'Apr 3, 2026',
    likesChange: 12,
  },
];

const AUDIENCE_LOCATIONS = [
  { city: 'Manila', flag: '🇵🇭', pct: 42 },
  { city: 'Quezon City', flag: '🇵🇭', pct: 18 },
  { city: 'Cebu', flag: '🇵🇭', pct: 8 },
  { city: 'Davao', flag: '🇵🇭', pct: 5 },
  { city: 'Other', flag: '🌐', pct: 27 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtK(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

// ─── AnimatedNumber ───────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  suffix = '',
  duration = 1.4,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {display >= 1000 ? fmtK(display) : display}
      {suffix}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  suffix = '',
  icon,
  iconColor,
  change,
  changeLabel,
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  iconColor: string;
  change?: number;
  changeLabel?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="rounded-xl p-4 bg-white flex flex-col gap-3"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-neutral-900 tracking-tight">
        <AnimatedNumber value={value} suffix={suffix} duration={1.2 + delay} />
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <TrendingUp size={11} style={{ color: change >= 0 ? '#16a34a' : '#dc2626' }} />
          <span className="text-[11px] font-semibold" style={{ color: change >= 0 ? '#16a34a' : '#dc2626' }}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-[11px] text-neutral-400">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`rounded-xl bg-white p-5 ${className}`}
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {children}
    </motion.div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function FollowerChart({ data }: { data: GrowthPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));

  return (
    <div className="relative h-44">
      {/* Y-axis */}
      <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between items-end pr-2 text-[10px] text-neutral-400">
        <span>{fmtK(max)}</span>
        <span>{fmtK(Math.round((max + min) / 2))}</span>
        <span>{fmtK(min)}</span>
      </div>

      {/* Bars */}
      <div className="absolute left-12 right-0 top-0 bottom-8 flex items-end gap-1.5">
        {data.map((point, i) => {
          const pct = ((point.value - min) / (max - min)) * 100;
          return (
            <div
              key={point.label}
              className="relative flex-1 flex flex-col items-center"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <AnimatePresence>
                {hovered === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.12 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[10px] font-semibold text-neutral-700 whitespace-nowrap z-10 shadow-sm"
                    style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)' }}
                  >
                    {fmtK(point.value)}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(pct, 4)}%` }}
                transition={{ delay: i * 0.04, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full rounded-t-md cursor-pointer"
                style={{
                  background: hovered === i
                    ? 'linear-gradient(180deg, #ff0069, #833ab4)'
                    : 'linear-gradient(180deg, rgba(255,0,105,0.55), rgba(131,58,180,0.35))',
                  minHeight: 4,
                  transition: 'background 0.2s',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis */}
      <div className="absolute left-12 right-0 bottom-0 h-8 flex items-end gap-1.5">
        {data.map(point => (
          <div key={point.label} className="flex-1 text-center text-[10px] text-neutral-400">
            {point.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Engagement bars ──────────────────────────────────────────────────────────

function EngagementBars({ data }: { data: EngagementPoint[] }) {
  return (
    <div className="space-y-2.5">
      {data.map((point, i) => {
        const pct = (point.rate / 6) * 100;
        return (
          <div key={point.week} className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-400 w-5 flex-shrink-0">{point.week}</span>
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
              />
            </div>
            <span className="text-[11px] font-semibold w-8 text-right" style={{ color: '#ff0069' }}>
              {point.rate}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Top posts table ──────────────────────────────────────────────────────────

type PostSortKey = 'likes' | 'comments' | 'saves' | 'reach';

function TopPostsTable({ posts }: { posts: TopPost[] }) {
  const [sortKey, setSortKey] = useState<PostSortKey>('likes');

  const sorted = [...posts].sort((a, b) => b[sortKey] - a[sortKey]);

  const FILTERS: { id: PostSortKey; label: string }[] = [
    { id: 'likes',    label: 'Likes' },
    { id: 'comments', label: 'Comments' },
    { id: 'saves',    label: 'Saves' },
    { id: 'reach',    label: 'Reach' },
  ];

  return (
    <SectionCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-900">Top Posts</h3>
        <div className="flex gap-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setSortKey(f.id)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
              style={
                sortKey === f.id
                  ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
                  : { color: '#737373', backgroundColor: 'transparent' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div
        className="grid text-[10px] font-semibold uppercase tracking-wide text-neutral-400 px-2 pb-2 mb-1"
        style={{ gridTemplateColumns: '2.5rem 1fr 3rem 3rem 3rem 3.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <span>#</span>
        <span>Account / Caption</span>
        <span className="text-right">Likes</span>
        <span className="text-right">Cmts</span>
        <span className="text-right">Saves</span>
        <span className="text-right">Reach</span>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {sorted.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid items-center px-2 py-2.5 rounded-lg hover:bg-black/[0.025] transition-colors"
            style={{ gridTemplateColumns: '2.5rem 1fr 3rem 3rem 3rem 3.5rem' }}
          >
            {/* Rank */}
            <span className="text-xs font-bold text-neutral-300">{i + 1}</span>

            {/* Thumbnail + info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${post.gradientFrom}, ${post.gradientTo})` }}
              />
              <div className="min-w-0">
                <div
                  className="text-[11px] font-semibold"
                  style={{ color: post.handleColor }}
                >
                  {post.handle}
                </div>
                <p className="text-[11px] text-neutral-500 truncate">{post.caption}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <span className="text-xs font-semibold text-neutral-800">{fmtK(post.likes)}</span>
              {post.likesChange && (
                <span className="block text-[9px] font-medium" style={{ color: '#16a34a' }}>
                  +{post.likesChange}%
                </span>
              )}
            </div>
            <span className="text-xs text-neutral-700 text-right font-medium">{fmtK(post.comments)}</span>
            <span className="text-xs text-neutral-700 text-right font-medium">{fmtK(post.saves)}</span>
            <span className="text-xs text-neutral-700 text-right font-medium">{fmtK(post.reach)}</span>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Audience insights ────────────────────────────────────────────────────────

function AudienceInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Top Locations */}
      <SectionCard>
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={13} style={{ color: '#ff0069' }} />
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Top Locations</span>
        </div>
        <div className="space-y-2.5">
          {AUDIENCE_LOCATIONS.map(loc => (
            <div key={loc.city} className="flex items-center gap-2.5">
              <span className="text-sm flex-shrink-0">{loc.flag}</span>
              <span className="text-xs text-neutral-700 w-24 flex-shrink-0">{loc.city}</span>
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(loc.pct / 42) * 100}%` }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.65, type: 'spring', stiffness: 120, damping: 14 }}
                />
              </div>
              <span
                className="text-[11px] font-bold w-7 text-right flex-shrink-0"
                style={{ color: '#ff0069' }}
              >
                {loc.pct}%
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Age Range */}
      <SectionCard>
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Age Range</span>
        </div>
        <div className="space-y-2.5">
          {[
            { range: '18-24', pct: 28 },
            { range: '25-34', pct: 47 },
            { range: '35-44', pct: 18 },
            { range: '45+',   pct: 7  },
          ].map((age, i) => (
            <div key={age.range} className="flex items-center gap-2.5">
              <span className="text-xs text-neutral-600 w-12 flex-shrink-0">{age.range}</span>
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: age.range === '25-34' ? 'linear-gradient(90deg, #ff0069, #833ab4)' : 'rgba(0,0,0,0.15)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${age.pct}%` }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: i * 0.07, duration: 0.55 }}
                />
              </div>
              <span
                className="text-[11px] font-bold w-7 text-right flex-shrink-0"
                style={{ color: age.range === '25-34' ? '#ff0069' : '#a3a3a3' }}
              >
                {age.pct}%
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Gender + Active Hours */}
      <SectionCard>
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Gender Split</span>
        </div>
        <div
          className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-2"
        >
          <motion.div
            style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
            className="rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: '78%' }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.65, type: 'spring', stiffness: 120, damping: 14 }}
          />
          <motion.div
            style={{ backgroundColor: '#f9a8d4' }}
            className="rounded-full flex-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          />
        </div>
        <div className="flex gap-4 mb-5">
          <span className="text-xs text-neutral-500">
            Male <span className="font-bold" style={{ color: '#ff0069' }}>78%</span>
          </span>
          <span className="text-xs text-neutral-500">
            Female <span className="font-bold text-pink-400">22%</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Clock size={12} style={{ color: '#ff0069' }} />
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Active Hours</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['8–11am', '7–10pm'].map(hour => (
            <span
              key={hour}
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'rgba(255,0,105,0.07)',
                color: '#ff0069',
                border: '1px solid rgba(255,0,105,0.15)',
              }}
            >
              {hour}
            </span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Revenue tab placeholder ──────────────────────────────────────────────────

function RevenuePlaceholder() {
  const ITEMS = [
    { label: 'Total Revenue',     value: '$48,200', color: '#16a34a', sub: '+12% vs last month' },
    { label: 'Avg per Creator',   value: '$12,050', color: '#7c3aed', sub: '4 active accounts' },
    { label: 'Top Earner',        value: '@abg.ricebunny', color: '#ff0069', sub: '$19,400 this period' },
    { label: 'Pending Payouts',   value: '$3,800',  color: '#d97706', sub: 'Due Apr 15, 2026' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-xl p-4 bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <span className="text-xs text-neutral-500 font-medium block mb-2">{item.label}</span>
          <span className="text-xl font-bold" style={{ color: item.color }}>{item.value}</span>
          <span className="text-[11px] text-neutral-400 block mt-1">{item.sub}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeFilter, setActiveFilter] = useState('30d');

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Analytics"
      stat={{ label: 'Posts this week', value: 23 }}
      searchPlaceholder="Search models, metrics..."
      actionLabel="Export"
      actionIcon={<BarChart2 size={14} />}
      tabs={[
        { id: 'overview', label: 'Overview', icon: <BarChart2 size={13} /> },
        { id: 'growth',   label: 'Growth',   icon: <TrendingUp size={13} /> },
        { id: 'revenue',  label: 'Revenue',  icon: <DollarSign size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: '7d',  label: '7 days' },
        { id: '30d', label: '30 days' },
        { id: '90d', label: '90 days' },
        { id: '1y',  label: '1 year' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <div className="p-4 space-y-4" style={{ backgroundColor: '#fafafa' }}>

        {/* ── Revenue tab ── */}
        {activeTab === 'revenue' && <RevenuePlaceholder />}

        {/* ── Overview + Growth tabs ── */}
        {(activeTab === 'overview' || activeTab === 'growth') && (
          <>
            {/* Primary stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Followers"
                value={245000}
                icon={<Users size={15} />}
                iconColor="#ff0069"
                change={2.4}
                changeLabel="vs last period"
                delay={0}
              />
              <StatCard
                label="Following"
                value={892}
                icon={<Users size={15} />}
                iconColor="#833ab4"
                delay={0.07}
              />
              <StatCard
                label="Posts"
                value={1847}
                icon={<BarChart2 size={15} />}
                iconColor="#7c3aed"
                delay={0.14}
              />
              <StatCard
                label="Engagement Rate"
                value={4.2}
                suffix="%"
                icon={<TrendingUp size={15} />}
                iconColor="#16a34a"
                change={0.3}
                changeLabel="vs last period"
                delay={0.21}
              />
            </div>

            {/* Secondary stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Avg Likes',    value: 10300, icon: <Heart size={14} />,          color: '#ff0069' },
                { label: 'Avg Comments', value: 389,   icon: <MessageCircle size={14} />,  color: '#833ab4' },
                { label: 'Avg Saves',    value: 236,   icon: <Bookmark size={14} />,        color: '#7c3aed' },
                { label: 'Avg Reach',    value: 74200, icon: <Eye size={14} />,             color: '#0ea5e9' },
              ].map((s, i) => (
                <StatCard
                  key={s.label}
                  label={s.label}
                  value={s.value}
                  icon={s.icon}
                  iconColor={s.color}
                  delay={0.28 + i * 0.07}
                />
              ))}
            </div>

            {/* Follower growth chart */}
            <SectionCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900">Follower Growth</h3>
                <span className="text-[11px] text-neutral-400">Jan – Dec 2026</span>
              </div>
              <FollowerChart data={FOLLOWER_GROWTH} />
            </SectionCard>

            {/* Engagement + Top Posts side by side */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Top Posts — 3 cols */}
              <div className="md:col-span-3">
                <TopPostsTable posts={TOP_POSTS} />
              </div>

              {/* Engagement over time — 2 cols */}
              <div className="md:col-span-2">
                <SectionCard>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">Engagement Over Time</h3>
                  <EngagementBars data={ENGAGEMENT_DATA} />
                </SectionCard>
              </div>
            </div>

            {/* Audience insights */}
            <AudienceInsights />
          </>
        )}
      </div>
    </ContentPageShell>
  );
}
