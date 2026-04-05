'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { ContentPageShell, type FilterCategory } from '@/isso/layout/ContentPageShell';
import { DateRangePill } from '@/isso/ui/DateRangePill';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  LayoutGrid,
  Users,
  Plus,
  Sparkles,
  Heart,
  Eye,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Loader2,
  Tag,
  Globe,
  Languages,
  Paintbrush2,
  Clock,
  Film,
  Image,
  GalleryHorizontal,
  Layers,
  Dumbbell,
  Sun,
  Flame,
  Laugh,
  Star,
  Clapperboard,
  BookOpen,
  Video,
  Music2,
} from 'lucide-react';

// ─── Platform brand icons (inline SVG since lucide has no brand icons) ────────

function IgIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig-g" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f09433"/>
          <stop offset="25%" stopColor="#e6683c"/>
          <stop offset="50%" stopColor="#dc2743"/>
          <stop offset="75%" stopColor="#cc2366"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-g)"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="17.2" cy="6.8" r="1.2" fill="white"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.89a8.18 8.18 0 004.78 1.52V7.0a4.85 4.85 0 01-1.01-.31z"/>
    </svg>
  );
}

// ─── Filter categories (Foreplay-style) ──────────────────────────────────────

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'saved',
    label: 'Saved Filters',
    icon: <BookmarkCheck size={13} />,
  },
  {
    id: 'format',
    label: 'Format',
    icon: <Film size={13} />,
    options: [
      { value: 'Reel',     icon: <Video size={12} className="text-neutral-400" /> },
      { value: 'Post',     icon: <Image size={12} className="text-neutral-400" /> },
      { value: 'Carousel', icon: <GalleryHorizontal size={12} className="text-neutral-400" /> },
      { value: 'Story',    icon: <Layers size={12} className="text-neutral-400" /> },
    ],
  },
  {
    id: 'niche',
    label: 'Niche',
    icon: <Tag size={13} />,
    options: [
      { value: 'GFE',          icon: <Heart size={12} className="text-neutral-400" /> },
      { value: 'Fitness',      icon: <Dumbbell size={12} className="text-neutral-400" /> },
      { value: 'Lifestyle',    icon: <Sun size={12} className="text-neutral-400" /> },
      { value: 'ABG',          icon: <Star size={12} className="text-neutral-400" /> },
      { value: 'Thirst Trap',  icon: <Flame size={12} className="text-neutral-400" /> },
      { value: 'Meme',         icon: <Laugh size={12} className="text-neutral-400" /> },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    icon: <Globe size={13} />,
    options: [
      { value: 'Instagram',     icon: <IgIcon /> },
      { value: 'TikTok',        icon: <TikTokIcon /> },
    ],
  },
  {
    id: 'language',
    label: 'Language',
    icon: <Languages size={13} />,
    options: [
      { value: 'English' },
      { value: 'Spanish' },
      { value: 'Filipino' },
      { value: 'Portuguese' },
      { value: 'French' },
    ],
  },
  {
    id: 'content-style',
    label: 'Content Style',
    icon: <Paintbrush2 size={13} />,
    options: [
      { value: 'Raw',        icon: <Clapperboard size={12} className="text-neutral-400" /> },
      { value: 'Cinematic',  icon: <Film size={12} className="text-neutral-400" /> },
      { value: 'Tutorial',   icon: <BookOpen size={12} className="text-neutral-400" /> },
      { value: 'Vlog',       icon: <Video size={12} className="text-neutral-400" /> },
      { value: 'Music',      icon: <Music2 size={12} className="text-neutral-400" /> },
    ],
  },
  {
    id: 'video-length',
    label: 'Video Length',
    icon: <Clock size={13} />,
    options: [
      { value: 'Under 15s' },
      { value: '15 – 30s' },
      { value: '30 – 60s' },
      { value: '1 – 3 min' },
      { value: '3+ min' },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'feed' | 'brands' | 'experts';

interface Board {
  id: number;
  name: string;
  count: number;
  lastUpdated: string;
  colors: string[];
}

// ─── Static boards (UI only for now) ─────────────────────────────────────────

const BOARDS: Board[] = [
  {
    id: 1,
    name: 'Hooks That Convert',
    count: 34,
    lastUpdated: '2 hours ago',
    colors: ['#ff0069', '#833ab4', '#fcaf45', '#4a9eff'],
  },
  {
    id: 2,
    name: 'GFE Vibes',
    count: 21,
    lastUpdated: 'Yesterday',
    colors: ['#833ab4', '#ff0069', '#4a9eff', '#78c257'],
  },
  {
    id: 3,
    name: 'Fitness Content',
    count: 18,
    lastUpdated: '3 days ago',
    colors: ['#78c257', '#4a9eff', '#fcaf45', '#ff0069'],
  },
  {
    id: 4,
    name: 'Lifestyle Inspo',
    count: 27,
    lastUpdated: '5 days ago',
    colors: ['#fcaf45', '#ff0069', '#833ab4', '#78c257'],
  },
];

// ─── Niche colour map ─────────────────────────────────────────────────────────

const NICHE_COLORS: Record<string, string> = {
  GFE:       '#ff0069',
  Fitness:   '#78c257',
  Lifestyle: '#4a9eff',
  ABG:       '#833ab4',
  Meme:      '#fcaf45',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function fmtDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ─── Post Card (Convex data) ──────────────────────────────────────────────────

type Post = {
  _id: Id<'scrapedPosts'>;
  handle: string;
  niche: string;
  thumbnailUrl: string;
  likes: number;
  views: number;
  saves: number;
  postedAt: number;
  saved: boolean;
  contentType: string;
};

function PostCardItem({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const toggleSave = useMutation(api.intelligence.toggleSave);

  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';
  const isVideo = post.contentType === 'reel';
  const aspectClass = isVideo ? 'aspect-video' : 'aspect-[4/5]';

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl overflow-hidden cursor-pointer relative group"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setBoardOpen(false); }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {/* Thumbnail */}
      <div className={`relative ${aspectClass} overflow-hidden`}>
        <div
          className="absolute inset-0"
          style={{ background: post.thumbnailUrl.startsWith('linear-gradient') ? post.thumbnailUrl : `url(${post.thumbnailUrl}) center/cover` }}
        />

        {/* Creator handle — top left */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-semibold text-white backdrop-blur-sm z-10"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          {post.handle}
        </div>

        {/* Niche tag — top right */}
        <div
          className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-semibold text-white z-10"
          style={{ backgroundColor: nicheColor }}
        >
          {post.niche}
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center gap-2 z-20"
              style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
            >
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white shadow-lg"
                style={{ background: post.saved ? 'rgba(255,0,105,0.6)' : 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                onClick={(e) => { e.stopPropagation(); toggleSave({ postId: post._id }); }}
              >
                <Bookmark size={12} fill={post.saved ? 'white' : 'none'} />
                {post.saved ? 'Saved' : 'Save'}
              </button>

              {/* Board dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white backdrop-blur-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                  onClick={(e) => { e.stopPropagation(); setBoardOpen(!boardOpen); }}
                >
                  Board <ChevronDown size={11} />
                </button>
                <AnimatePresence>
                  {boardOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-1 left-0 rounded-xl shadow-xl z-30 overflow-hidden min-w-[140px]"
                      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}
                    >
                      {BOARDS.map((b) => (
                        <button
                          key={b.id}
                          className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{b.name}</span>
                          <span className="text-neutral-400">{b.count}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom metrics */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Heart size={11} className="text-neutral-400" />
            <span className="text-[11px] font-semibold text-neutral-700">{fmtNum(post.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={11} className="text-neutral-400" />
            <span className="text-[11px] font-semibold text-neutral-700">{fmtNum(post.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark size={11} className="text-neutral-400" />
            <span className="text-[11px] font-semibold text-neutral-700">{fmtNum(post.saves)}</span>
          </div>
        </div>
        <span className="text-[10px] text-neutral-400">{fmtDate(post.postedAt)}</span>
      </div>
    </motion.div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ tall }: { tall?: boolean }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <div
        className={`w-full ${tall ? 'aspect-[4/5]' : 'aspect-video'} animate-pulse`}
        style={{ backgroundColor: '#f3f4f6' }}
      />
      <div className="px-3 py-2.5 flex items-center gap-3">
        <div className="h-2.5 w-10 rounded animate-pulse" style={{ backgroundColor: '#f3f4f6' }} />
        <div className="h-2.5 w-10 rounded animate-pulse" style={{ backgroundColor: '#f3f4f6' }} />
        <div className="h-2.5 w-10 rounded animate-pulse" style={{ backgroundColor: '#f3f4f6' }} />
      </div>
    </div>
  );
}

// ─── Feed View (Convex-powered) ───────────────────────────────────────────────

function FeedView({ sortBy, niche, contentType }: { sortBy: string; niche?: string; contentType?: string }) {
  const seed = useMutation(api.intelligence.seedIntelligenceFeed);

  const convexSortBy = sortBy === 'all-time' ? 'top' : (sortBy as 'newest' | 'trending' | 'top');
  const posts = useQuery(api.intelligence.getFeed, {
    sortBy: convexSortBy,
    niche:        niche        && niche !== 'all'        ? niche        : undefined,
    contentType:  contentType  && contentType !== 'all'  ? contentType  : undefined,
    limit: 40,
  });

  // Auto-seed if empty on first load
  if (posts !== undefined && posts.length === 0) {
    seed().catch(() => {});
  }

  if (posts === undefined) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} tall={i % 2 === 0} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={28} className="animate-spin text-neutral-300" />
        <p className="text-sm text-neutral-400">Seeding feed…</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {posts.map((post) => (
        <PostCardItem key={post._id} post={post as Post} />
      ))}
    </motion.div>
  );
}

// ─── Boards View ─────────────────────────────────────────────────────────────

function BoardsView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Saved Boards</h3>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Plus size={12} /> New Board
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BOARDS.map((board) => (
          <motion.div
            key={board.id}
            variants={fadeUp}
            className="p-4 rounded-xl cursor-pointer hover:shadow-sm transition-shadow"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
            whileHover={{ y: -2, transition: { duration: 0.18 } }}
          >
            {/* 4-thumbnail grid */}
            <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden mb-3" style={{ aspectRatio: '2/1' }}>
              {board.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-full h-full"
                  style={{ background: `linear-gradient(135deg, ${color}, ${board.colors[(i + 1) % 4]})` }}
                />
              ))}
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{board.name}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Updated {board.lastUpdated}</p>
              </div>
              <div
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold text-neutral-600"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                {board.count}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Saved Empty State ────────────────────────────────────────────────────────

function ExpertsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,0,105,0.07)', border: '1px solid rgba(255,0,105,0.12)' }}
      >
        <Bookmark size={28} style={{ color: '#ff0069' }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-neutral-900">No saved content yet</p>
        <p className="text-xs text-neutral-400 mt-1">Start saving from the Feed.</p>
      </div>
      <button
        className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        Browse Feed
      </button>
    </motion.div>
  );
}

// ─── Stat pill (live count) ───────────────────────────────────────────────────

function useIndexedCount(): number {
  const stats = useQuery(api.intelligence.getStats, {});
  return stats?.totalIndexed ?? 0;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function IntelligenceFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [activeFilter, setActiveFilter] = useState('all-time');
  const indexedCount = useIndexedCount();

  return (
    <ContentPageShell
      icon={<ProductIcon product="intelligence" size={32} />}
      title="Intelligence"
      stat={{ label: 'Posts indexed', value: indexedCount }}
      searchPlaceholder="Search keywords, brands, categories..."
      actionLabel="New"
      actionIcon={<Plus size={14} />}
      actionDropdownItems={[
        { id: 'board',  label: 'New Board',    icon: <LayoutGrid size={13} /> },
        { id: 'search', label: 'Saved Search', icon: <Sparkles size={13} /> },
      ]}
      tabs={[
        { id: 'feed',    label: 'Community Feed', icon: <LayoutGrid size={13} /> },
        { id: 'brands',  label: 'Brands',          icon: <Sparkles size={13} /> },
        { id: 'experts', label: 'Experts',          icon: <Users size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterCategories={FILTER_CATEGORIES}
      filterChips={[
        { id: 'newest',   label: 'Newest' },
        { id: 'trending', label: 'Trending' },
        { id: 'top',      label: 'Top' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      filterRightSlot={<DateRangePill />}
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
            {activeTab === 'feed' && <FeedView sortBy={activeFilter} />}
            {activeTab === 'brands' && <BoardsView />}
            {activeTab === 'experts' && <ExpertsView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
