'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  ChevronLeft,
  Calendar,
  ChevronRight,
  Plus,
  Film,
  Image,
  BookOpen,
  LayoutGrid,
  Video,
  Heart,
  MessageSquare,
  Bookmark,
  BarChart2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'calendar' | 'analytics';
type ContentType = 'reel' | 'post' | 'story' | 'carousel' | 'video';
type FilterType = 'All' | 'Reels' | 'Stories' | 'Posts' | 'Carousels' | 'Videos';

interface ScheduledPost {
  day: number;
  type: ContentType;
  handle: string;
}

interface TopPost {
  rank: number;
  gradientFrom: string;
  gradientTo: string;
  likes: number;
  comments: number;
  saves: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const SCHEDULED_POSTS: ScheduledPost[] = [
  { day: 3, type: 'reel', handle: '@abg.ricebunny' },
  { day: 3, type: 'post', handle: '@rhinxrenx' },
  { day: 5, type: 'reel', handle: '@ellamira' },
  { day: 5, type: 'story', handle: '@abg.ricebunny' },
  { day: 7, type: 'post', handle: '@rhinxrenx' },
  { day: 7, type: 'carousel', handle: '@ellamira' },
  { day: 10, type: 'reel', handle: '@abg.ricebunny' },
  { day: 12, type: 'video', handle: '@rhinxrenx' },
  { day: 12, type: 'post', handle: '@ellamira' },
  { day: 14, type: 'reel', handle: '@abg.ricebunny' },
  { day: 14, type: 'story', handle: '@rhinxrenx' },
  { day: 17, type: 'post', handle: '@ellamira' },
  { day: 19, type: 'reel', handle: '@rhinxrenx' },
  { day: 19, type: 'carousel', handle: '@abg.ricebunny' },
  { day: 21, type: 'post', handle: '@ellamira' },
  { day: 24, type: 'reel', handle: '@abg.ricebunny' },
  { day: 24, type: 'video', handle: '@rhinxrenx' },
  { day: 26, type: 'story', handle: '@ellamira' },
  { day: 28, type: 'reel', handle: '@abg.ricebunny' },
  { day: 28, type: 'post', handle: '@rhinxrenx' },
];

const ENGAGEMENT_DATA = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 38 },
  { label: 'Wed', value: 65 },
  { label: 'Thu', value: 71 },
  { label: 'Fri', value: 58 },
  { label: 'Sat', value: 83 },
  { label: 'Sun', value: 76 },
];

const TOP_POSTS: TopPost[] = [
  { rank: 1, gradientFrom: '#ff0069', gradientTo: '#833ab4', likes: 892, comments: 124, saves: 67 },
  { rank: 2, gradientFrom: '#833ab4', gradientTo: '#fcaf45', likes: 743, comments: 89, saves: 41 },
  { rank: 3, gradientFrom: '#fcaf45', gradientTo: '#ff0069', likes: 612, comments: 67, saves: 38 },
];

const APRIL_START_OFFSET = 3;
const APRIL_DAYS = 30;
const TODAY = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<ContentType, string> = {
  reel: '#ff0069',
  post: '#833ab4',
  story: '#fcaf45',
  carousel: '#78c257',
  video: '#4a9eff',
};

const TYPE_ICON: Record<ContentType, React.ReactNode> = {
  reel: <Film className="w-2.5 h-2.5 text-white/80" />,
  post: <Image className="w-2.5 h-2.5 text-white/80" />,
  story: <BookOpen className="w-2.5 h-2.5 text-white/80" />,
  carousel: <LayoutGrid className="w-2.5 h-2.5 text-white/80" />,
  video: <Video className="w-2.5 h-2.5 text-white/80" />,
};

const FILTER_TO_TYPE: Record<Exclude<FilterType, 'All'>, ContentType> = {
  Reels: 'reel',
  Stories: 'story',
  Posts: 'post',
  Carousels: 'carousel',
  Videos: 'video',
};

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const RANK_LABELS = ['Gold', 'Silver', 'Bronze'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function EngagementChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...ENGAGEMENT_DATA.map((d) => d.value));

  return (
    <div ref={ref} className="flex items-end gap-3 h-36">
      {ENGAGEMENT_DATA.map((d, i) => (
        <div
          key={d.label}
          className="flex-1 flex flex-col items-center gap-2 relative group"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === i && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-10 shadow-lg"
                style={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {d.value}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-full flex items-end" style={{ height: '100px' }}>
            <motion.div
              className="w-full rounded-t-lg cursor-pointer transition-all"
              style={{
                background: hovered === i
                  ? 'linear-gradient(to top, #ff0069, #ff4d8d)'
                  : 'linear-gradient(to top, rgba(255,0,105,0.5), rgba(255,0,105,0.25))',
              }}
              initial={{ height: 0 }}
              animate={isInView ? { height: `${(d.value / max) * 100}px` } : { height: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
          <span className="text-[11px] text-neutral-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Calendar View ─────────────────────────────────────────────────────────────

function CalendarView({ filter }: { filter: FilterType }) {
  const postsByDay: Record<number, ScheduledPost[]> = {};
  for (const p of SCHEDULED_POSTS) {
    if (filter !== 'All' && p.type !== FILTER_TO_TYPE[filter as Exclude<FilterType, 'All'>]) continue;
    if (!postsByDay[p.day]) postsByDay[p.day] = [];
    postsByDay[p.day].push(p);
  }

  const cells: Array<{ day: number | null; isToday: boolean }> = [];
  for (let i = 0; i < APRIL_START_OFFSET; i++) cells.push({ day: null, isToday: false });
  for (let d = 1; d <= APRIL_DAYS; d++) cells.push({ day: d, isToday: d === TODAY });
  while (cells.length % 7 !== 0) cells.push({ day: null, isToday: false });

  const weeks: Array<typeof cells> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      {/* Month nav */}
      <motion.div variants={fadeUp} className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          style={{ color: '#6b7280', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-base font-semibold text-neutral-900 px-2">April 2026</span>
        <button
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          style={{ color: '#6b7280', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Calendar grid */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff' }}
      >
        <div
          className="grid grid-cols-7"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#f5f5f4' }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-3 text-center text-xs font-medium text-neutral-400">
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="grid grid-cols-7"
            style={{ borderBottom: wi < weeks.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
          >
            {week.map((cell, di) => {
              const posts = cell.day ? (postsByDay[cell.day] ?? []) : [];
              return (
                <div
                  key={di}
                  className="relative p-2 min-h-[80px] cursor-pointer hover:bg-black/[0.02] transition-colors"
                  style={{
                    borderRight: di < 6 ? '1px solid rgba(0,0,0,0.04)' : undefined,
                    opacity: cell.day === null ? 0.2 : 1,
                  }}
                >
                  {cell.day !== null && (
                    <div className="mb-1.5 flex">
                      {cell.isToday ? (
                        <div className="relative flex items-center justify-center w-6 h-6">
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: 'rgba(255,0,105,0.3)' }}
                            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <div
                            className="relative w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white z-10"
                            style={{ backgroundColor: '#ff0069' }}
                          >
                            {cell.day}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400">{cell.day}</span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {posts.slice(0, 3).map((p, pi) => (
                      <div
                        key={pi}
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: TYPE_COLOR[p.type] }}
                        title={`${p.type} — ${p.handle}`}
                      />
                    ))}
                    {posts.length > 3 && (
                      <span className="text-[9px] text-white/30">+{posts.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>

      {/* Legend */}
      <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
        {(Object.entries(TYPE_COLOR) as [ContentType, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-neutral-400 capitalize">{type}s</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Analytics View ────────────────────────────────────────────────────────────

function AnalyticsView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ backgroundColor: '#f3f4f6', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <span className="text-neutral-900 font-semibold">28</span>
          <span className="text-neutral-500">posts this month</span>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ backgroundColor: 'rgba(255,0,105,0.06)', border: '1px solid rgba(255,0,105,0.15)' }}
        >
          <span className="text-neutral-900 font-semibold">4.2%</span>
          <span className="text-neutral-500">avg engagement rate</span>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="p-5 rounded-2xl"
        style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Engagement This Week</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Average interactions per day</p>
          </div>
          <span className="text-sm font-semibold text-neutral-500">
            {Math.round(ENGAGEMENT_DATA.reduce((s, d) => s + d.value, 0) / ENGAGEMENT_DATA.length)} avg
          </span>
        </div>
        <EngagementChart />
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="p-5 rounded-2xl"
        style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-neutral-900">Top Posts This Month</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Best performing content</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {TOP_POSTS.map((post, i) => (
            <motion.div
              key={post.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{ border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff' }}
            >
              <div className="relative aspect-square">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${post.gradientFrom}, ${post.gradientTo})`,
                    opacity: 0.7,
                  }}
                />
                <div
                  className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-lg"
                  style={{
                    backgroundColor: RANK_COLORS[i],
                    color: '#000',
                    boxShadow: `0 0 12px ${RANK_COLORS[i]}66`,
                  }}
                  title={RANK_LABELS[i]}
                >
                  {post.rank}
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-800">{post.likes.toLocaleString()}</span>
                  <span className="text-[10px] text-neutral-400">likes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-800">{post.comments}</span>
                  <span className="text-[10px] text-neutral-400">comments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-3 h-3 text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-800">{post.saves}</span>
                  <span className="text-[10px] text-neutral-400">saves</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ScheduleFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Schedule"
      stat={{ label: 'Posts scheduled', value: 20 }}
      searchPlaceholder="Search posts, models..."
      actionLabel="Schedule Post"
      actionIcon={<Plus size={14} />}
      actionDropdownItems={[
        { id: 'reel',     label: 'New Reel',      icon: <Film size={13} /> },
        { id: 'post',     label: 'New Post',      icon: <Image size={13} /> },
        { id: 'story',    label: 'New Story',     icon: <BookOpen size={13} /> },
        { id: 'carousel', label: 'New Carousel',  icon: <LayoutGrid size={13} /> },
        { id: 'video',    label: 'New Video',     icon: <Video size={13} /> },
      ]}
      tabs={[
        { id: 'calendar',  label: 'Calendar',  icon: <Calendar size={13} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'All',       label: 'All' },
        { id: 'Reels',     label: 'Reels' },
        { id: 'Stories',   label: 'Stories' },
        { id: 'Posts',     label: 'Posts' },
        { id: 'Carousels', label: 'Carousels' },
        { id: 'Videos',    label: 'Videos' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={(id) => setActiveFilter(id as FilterType)}
    >
      <div className="px-6 py-6 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'analytics' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'analytics' ? -20 : 20 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeTab === 'calendar'
              ? <CalendarView filter={activeFilter} />
              : <AnalyticsView />
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
