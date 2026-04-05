'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  Rss, TrendingUp, Bookmark, Plus,
  Heart, MessageCircle, Award, Check, Play,
  Eye,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'feed' | 'trending' | 'saved';
type ContentType = 'Reel' | 'Post' | 'Carousel';

interface Creator {
  handle: string;
  initials: string;
  color: string;
  followers: number;
  engagementRate: number;
}

interface Post {
  id: string;
  type: ContentType;
  creator: Creator;
  gradient: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  saves: number;
  views: number;
  postedAt: string;
  isVideo: boolean;
  saved?: boolean;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const CREATORS: Creator[] = [
  { handle: '@abg.ricebunny', initials: 'AB', color: '#ff0069',  followers: 245000, engagementRate: 4.2 },
  { handle: '@onlytylerrex',  initials: 'OT', color: '#fcaf45',  followers: 189000, engagementRate: 3.8 },
  { handle: '@rhinxrenx',     initials: 'RR', color: '#833ab4',  followers: 312000, engagementRate: 5.1 },
  { handle: '@ellamira',      initials: 'EM', color: '#78c257',  followers: 97000,  engagementRate: 6.3 },
];

const LEADERBOARD_ENTRIES = [
  { rank: 1, ...CREATORS[2] },
  { rank: 2, ...CREATORS[0] },
  { rank: 3, ...CREATORS[1] },
  { rank: 4, ...CREATORS[3] },
];

const GRADIENTS: Record<string, string> = {
  pink:    'linear-gradient(135deg, #ff0069 0%, #fd1d1d 50%, #fcaf45 100%)',
  purple:  'linear-gradient(135deg, #833ab4 0%, #ff0069 100%)',
  amber:   'linear-gradient(135deg, #fcaf45 0%, #ff0069 100%)',
  green:   'linear-gradient(135deg, #78c257 0%, #00f4e2 100%)',
  indigo:  'linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%)',
  teal:    'linear-gradient(135deg, #00f4e2 0%, #833ab4 100%)',
};

const POSTS: Post[] = [
  {
    id: '1',
    type: 'Reel',
    creator: CREATORS[0],
    gradient: GRADIENTS.pink,
    caption: 'Monday grind starts early. No excuses, just results. 5am club is real.',
    hashtags: ['#gymmotivation', '#gaybear', '#fitness'],
    likes: 8412, comments: 234, saves: 180, views: 89400,
    postedAt: '2h ago',
    isVideo: true,
  },
  {
    id: '2',
    type: 'Post',
    creator: CREATORS[2],
    gradient: GRADIENTS.purple,
    caption: 'Vibes only. That aesthetic everyone keeps trying to copy.',
    hashtags: ['#lifestyle', '#aesthetic'],
    likes: 6200, comments: 89, saves: 214, views: 67200,
    postedAt: '4h ago',
    isVideo: false,
  },
  {
    id: '3',
    type: 'Carousel',
    creator: CREATORS[1],
    gradient: GRADIENTS.amber,
    caption: 'OOTD but make it intentional. Every detail matters.',
    hashtags: ['#ootd', '#fashion', '#style'],
    likes: 4120, comments: 56, saves: 98, views: 34100,
    postedAt: '6h ago',
    isVideo: false,
  },
  {
    id: '4',
    type: 'Reel',
    creator: CREATORS[3],
    gradient: GRADIENTS.green,
    caption: 'Transformation Tuesday. 12 weeks in. Same mirror, different energy.',
    hashtags: ['#transformation', '#fitness', '#progress'],
    likes: 7100, comments: 198, saves: 241, views: 76300,
    postedAt: '8h ago',
    isVideo: true,
  },
  {
    id: '5',
    type: 'Post',
    creator: CREATORS[0],
    gradient: GRADIENTS.indigo,
    caption: 'Post-workout glow. Consistency is the only hack you need.',
    hashtags: ['#postworkout', '#gymlife'],
    likes: 5500, comments: 112, saves: 132, views: 55000,
    postedAt: '12h ago',
    isVideo: false,
  },
  {
    id: '6',
    type: 'Reel',
    creator: CREATORS[2],
    gradient: GRADIENTS.teal,
    caption: 'Pull-up progression: Week 1 to Week 12. No shortcuts.',
    hashtags: ['#calisthenics', '#progress', '#pullup'],
    likes: 12300, comments: 312, saves: 480, views: 145000,
    postedAt: '1d ago',
    isVideo: true,
  },
  {
    id: '7',
    type: 'Carousel',
    creator: CREATORS[1],
    gradient: GRADIENTS.amber,
    caption: '5 ways to stay consistent with your fitness goals.',
    hashtags: ['#fitnessgoals', '#tips', '#consistency'],
    likes: 3870, comments: 67, saves: 312, views: 28900,
    postedAt: '1d ago',
    isVideo: false,
    saved: true,
  },
  {
    id: '8',
    type: 'Reel',
    creator: CREATORS[3],
    gradient: GRADIENTS.green,
    caption: 'Golden hour at the rooftop. When the city lights up.',
    hashtags: ['#goldenhour', '#lifestyle', '#rooftop'],
    likes: 9800, comments: 145, saves: 203, views: 91200,
    postedAt: '2d ago',
    isVideo: true,
  },
  {
    id: '9',
    type: 'Post',
    creator: CREATORS[2],
    gradient: GRADIENTS.purple,
    caption: 'Rest day = recovery day. This is where the growth actually happens.',
    hashtags: ['#restday', '#recovery', '#mobility'],
    likes: 4200, comments: 78, saves: 156, views: 38500,
    postedAt: '2d ago',
    isVideo: false,
  },
  {
    id: '10',
    type: 'Carousel',
    creator: CREATORS[0],
    gradient: GRADIENTS.pink,
    caption: 'What I eat in a day. Full transparency, no shortcuts.',
    hashtags: ['#nutrition', '#mealprep', '#bodybuilding'],
    likes: 6800, comments: 189, saves: 427, views: 72000,
    postedAt: '3d ago',
    isVideo: false,
    saved: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtK(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

const TYPE_COLORS: Record<ContentType, { color: string; bg: string }> = {
  Reel:     { color: '#ff0069', bg: 'rgba(255,0,105,0.12)' },
  Post:     { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
  Carousel: { color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
};

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(post.saved ?? false);

  const cfg = TYPE_COLORS[post.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl overflow-hidden bg-white"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: post.gradient }}>
        {/* Video play overlay */}
        {post.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            >
              <Play size={18} className="text-white fill-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Content type badge */}
        <div
          className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold"
          style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
        >
          {post.type}
        </div>

        {/* Views badge */}
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-white"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <Eye size={9} />
          {fmtK(post.views)}
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        {/* Creator row */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: post.creator.color }}
          >
            {post.creator.initials}
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="text-[11px] font-semibold"
              style={{ color: post.creator.color }}
            >
              {post.creator.handle}
            </span>
            <span className="text-[10px] text-neutral-400 ml-1.5">{post.postedAt}</span>
          </div>
        </div>

        {/* Caption */}
        <p className="text-xs text-neutral-700 leading-relaxed line-clamp-2 mb-1.5">{post.caption}</p>

        {/* Hashtags */}
        <p className="text-[10px] mb-3" style={{ color: '#833ab4' }}>
          {post.hashtags.slice(0, 2).join(' ')}
        </p>

        {/* Actions */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-0.5">
            {/* Like */}
            <button
              onClick={() => {
                if (!liked) { setLiked(true); setLikeCount(c => c + 1); }
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{ color: liked ? '#ff0069' : '#a3a3a3' }}
            >
              <Heart size={13} className={liked ? 'fill-current' : ''} />
            </button>
            <span className="text-[11px] text-neutral-500 mr-2">{fmtK(likeCount)}</span>

            {/* Comment */}
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400"
            >
              <MessageCircle size={13} />
            </button>
            <span className="text-[11px] text-neutral-500">{fmtK(post.comments)}</span>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => setBookmarked(b => !b)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ color: bookmarked ? '#d97706' : '#a3a3a3' }}
          >
            <Bookmark size={13} className={bookmarked ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Leaderboard Sidebar ──────────────────────────────────────────────────────

function LeaderboardSidebar() {
  return (
    <div className="space-y-3">
      {/* Leaderboard */}
      <div
        className="rounded-xl overflow-hidden bg-white"
        style={{ border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <Award size={14} style={{ color: '#d97706' }} />
          <span className="text-xs font-semibold text-neutral-900">Top Creators</span>
        </div>
        <div>
          {LEADERBOARD_ENTRIES.map((entry, i) => (
            <div
              key={entry.handle}
              className="px-4 py-3 flex items-center gap-3 hover:bg-black/[0.025] transition-colors"
              style={{ borderBottom: i < LEADERBOARD_ENTRIES.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
            >
              {/* Rank */}
              <span
                className="text-sm font-black w-4 flex-shrink-0 text-center"
                style={{
                  color: entry.rank === 1 ? '#d97706'
                       : entry.rank === 2 ? '#a3a3a3'
                       : entry.rank === 3 ? '#cd7f32'
                       : '#d4d4d4',
                }}
              >
                {entry.rank}
              </span>

              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              >
                {entry.initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 truncate">{entry.handle}</p>
                <p className="text-[10px] text-neutral-400">{fmtK(entry.followers)} followers</p>
              </div>

              {/* Engagement */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: '#ff0069' }}>{entry.engagementRate}%</p>
                <p className="text-[9px] text-neutral-400">eng.</p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="px-4 py-2.5 text-center"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <a
            href="#"
            className="text-[11px] font-semibold hover:underline"
            style={{ color: '#ff0069' }}
          >
            View full leaderboard →
          </a>
        </div>
      </div>

      {/* Promote CTA */}
      <div
        className="rounded-xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255,0,105,0.06), rgba(131,58,180,0.06))',
          border: '1px solid rgba(255,0,105,0.15)',
        }}
      >
        <p className="text-xs font-semibold text-neutral-800 mb-1.5">Grow your reach</p>
        <p className="text-[11px] text-neutral-500 mb-3 leading-relaxed">
          Every post through ISSO gets featured here. Drive views to your real profile.
        </p>
        <button
          className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          Connect Account
        </button>
      </div>

      {/* Discover creators */}
      <div
        className="rounded-xl overflow-hidden bg-white"
        style={{ border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <span className="text-xs font-semibold text-neutral-900">Discover</span>
          <button className="text-[11px] font-medium" style={{ color: '#ff0069' }}>See all</button>
        </div>
        <div className="p-3 space-y-2.5">
          {CREATORS.map(c => (
            <div key={c.handle} className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: c.color }}
              >
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span
                    className="text-[11px] font-semibold truncate"
                    style={{ color: c.color }}
                  >
                    {c.handle}
                  </span>
                  <Check size={9} style={{ color: c.color }} className="flex-shrink-0" />
                </div>
                <p className="text-[10px] text-neutral-400">{fmtK(c.followers)} followers</p>
              </div>
              <button
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0 transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'rgba(255,0,105,0.07)',
                  color: '#ff0069',
                  border: '1px solid rgba(255,0,105,0.15)',
                }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter posts by content type
  const filteredPosts = POSTS.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reels')     return post.type === 'Reel';
    if (activeFilter === 'posts')     return post.type === 'Post';
    if (activeFilter === 'carousels') return post.type === 'Carousel';
    return true;
  }).filter(post => {
    if (activeTab === 'saved') return post.saved;
    if (activeTab === 'trending') return post.likes > 6000;
    return true;
  });

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Content Feed"
      stat={{ label: 'New posts', value: 12 }}
      searchPlaceholder="Search posts, creators..."
      actionLabel="New Post"
      actionIcon={<Plus size={14} />}
      tabs={[
        { id: 'feed',     label: 'Feed',     icon: <Rss size={13} /> },
        { id: 'trending', label: 'Trending', icon: <TrendingUp size={13} /> },
        { id: 'saved',    label: 'Saved',    icon: <Bookmark size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',       label: 'All' },
        { id: 'reels',     label: 'Reels' },
        { id: 'posts',     label: 'Posts' },
        { id: 'carousels', label: 'Carousels' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      showViewToggle
    >
      <div className="flex h-full" style={{ backgroundColor: '#fafafa' }}>

        {/* ── Main feed (3/4) ── */}
        <div className="flex-1 min-w-0 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeFilter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <Rss size={24} className="text-neutral-300" />
                  </div>
                  <p className="text-sm font-medium text-neutral-500">Nothing here</p>
                  <p className="text-xs text-neutral-400 mt-0.5">No posts match the current filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Leaderboard sidebar (1/4) ── */}
        <div
          className="hidden xl:block w-72 flex-shrink-0 overflow-y-auto p-4"
          style={{ borderLeft: '1px solid rgba(0,0,0,0.06)' }}
        >
          <LeaderboardSidebar />
        </div>
      </div>
    </ContentPageShell>
  );
}
