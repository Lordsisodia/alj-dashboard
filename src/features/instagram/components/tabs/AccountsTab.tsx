'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Plus, RefreshCw, Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentPost {
  likes: number;
  comments: number;
  saves: number;
  gradient: [string, string];
}

interface Account {
  id: string;
  displayName: string;
  handle: string;
  niche: string;
  color: string;
  initials: string;
  connected: boolean;
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  recentPosts: RecentPost[];
}

const ACCOUNTS: Account[] = [
  {
    id: 'tyler', displayName: 'Tyler', handle: '@tyler.isso', niche: 'Fitness',
    color: '#ff0069', initials: 'TY', connected: true,
    followers: 284_300, following: 412, posts: 847, engagementRate: 4.8,
    recentPosts: [
      { likes: 4200, comments: 89,  saves: 312, gradient: ['#ff0069', '#ff6b9d'] },
      { likes: 3800, comments: 72,  saves: 287, gradient: ['#ff6b9d', '#ffb3cc'] },
      { likes: 5100, comments: 143, saves: 401, gradient: ['#dc2743', '#ff0069'] },
      { likes: 3200, comments: 61,  saves: 198, gradient: ['#ff0069', '#e0004d'] },
      { likes: 6700, comments: 201, saves: 512, gradient: ['#c9005a', '#ff0069'] },
      { likes: 2900, comments: 48,  saves: 156, gradient: ['#ff3377', '#ff0069'] },
    ],
  },
  {
    id: 'ren', displayName: 'Ren', handle: '@ren.official', niche: 'Lifestyle',
    color: '#833ab4', initials: 'RN', connected: true,
    followers: 192_100, following: 289, posts: 623, engagementRate: 5.2,
    recentPosts: [
      { likes: 2900, comments: 54,  saves: 223, gradient: ['#833ab4', '#b06fdc'] },
      { likes: 3400, comments: 61,  saves: 289, gradient: ['#6a2d9a', '#833ab4'] },
      { likes: 2100, comments: 38,  saves: 145, gradient: ['#9b4dc8', '#b06fdc'] },
      { likes: 4100, comments: 87,  saves: 312, gradient: ['#7030a0', '#833ab4'] },
      { likes: 1800, comments: 29,  saves: 98,  gradient: ['#833ab4', '#a855f7'] },
      { likes: 3700, comments: 74,  saves: 267, gradient: ['#5b21b6', '#833ab4'] },
    ],
  },
  {
    id: 'ella', displayName: 'Ella', handle: '@ella.creates', niche: 'Beauty',
    color: '#f77737', initials: 'EL', connected: true,
    followers: 318_700, following: 534, posts: 1104, engagementRate: 6.1,
    recentPosts: [
      { likes: 7200, comments: 201, saves: 843, gradient: ['#f77737', '#fa9a5e'] },
      { likes: 6800, comments: 178, saves: 712, gradient: ['#e86020', '#f77737'] },
      { likes: 8100, comments: 243, saves: 934, gradient: ['#f77737', '#fbbf7a'] },
      { likes: 5400, comments: 134, saves: 601, gradient: ['#d45f1a', '#f77737'] },
      { likes: 9200, comments: 289, saves: 1102, gradient: ['#f77737', '#fb923c'] },
      { likes: 6100, comments: 156, saves: 678, gradient: ['#ea6c28', '#f77737'] },
    ],
  },
  {
    id: 'amam', displayName: 'Amam', handle: '@amam.world', niche: 'Travel',
    color: '#0ea5e9', initials: 'AM', connected: false,
    followers: 97_400, following: 761, posts: 312, engagementRate: 3.9,
    recentPosts: [],
  },
];

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function ProfileCard({ account, selected, onSelect }: {
  account: Account;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all w-full',
        selected ? '' : 'hover:shadow-md'
      )}
      style={{
        backgroundColor: '#ffffff',
        border: selected ? `2px solid ${account.color}` : '1px solid rgba(0,0,0,0.07)',
        boxShadow: selected ? `0 0 0 3px ${account.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Profile row */}
      <div className="flex items-center gap-3">
        {/* Avatar with Instagram-style ring */}
        <div
          className="p-0.5 rounded-full flex-shrink-0"
          style={account.connected
            ? { background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }
            : { background: 'rgba(0,0,0,0.1)' }
          }
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black text-white"
            style={{ background: `linear-gradient(135deg, ${account.color}, ${account.color}99)` }}
          >
            {account.initials}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-neutral-900">{account.displayName}</p>
            {account.connected
              ? <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
              : <AlertCircle size={12} className="text-amber-500 flex-shrink-0" />
            }
          </div>
          <p className="text-xs text-neutral-400">{account.handle}</p>
          <span
            className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5"
            style={{ backgroundColor: `${account.color}14`, color: account.color }}
          >
            {account.niche}
          </span>
        </div>

        <div
          className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-300 hover:text-neutral-500 hover:bg-black/[0.05] transition-all flex-shrink-0 cursor-pointer"
          onClick={e => e.stopPropagation()}
        >
          <MoreHorizontal size={14} />
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-1 text-center">
        {[
          { label: 'Followers', value: fmt(account.followers) },
          { label: 'Posts',     value: fmt(account.posts) },
          { label: 'Eng.',      value: `${account.engagementRate}%` },
        ].map(s => (
          <div key={s.label} className="py-1.5 rounded-lg" style={{ backgroundColor: '#f9f9f9' }}>
            <p className="text-sm font-bold text-neutral-900">{s.value}</p>
            <p className="text-[10px] text-neutral-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mini post grid (3 posts) */}
      {account.connected && account.recentPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {account.recentPosts.slice(0, 3).map((post, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg flex items-end p-1.5"
              style={{ background: `linear-gradient(135deg, ${post.gradient[0]}, ${post.gradient[1]})` }}
            >
              <span className="text-[9px] font-semibold text-white/80">♥ {fmt(post.likes)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="h-16 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#f5f5f5' }}
        >
          {account.connected ? (
            <p className="text-[11px] text-neutral-400">No posts synced</p>
          ) : (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:brightness-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              onClick={e => e.stopPropagation()}
            >
              <Plus size={11} /> Reconnect
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, color }: { post: RecentPost; color: string }) {
  return (
    <div
      className="flex-shrink-0 rounded-2xl overflow-hidden"
      style={{ width: 160, border: '1px solid rgba(0,0,0,0.05)' }}
    >
      {/* Square image placeholder */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          height: 160,
          background: `linear-gradient(135deg, ${post.gradient[0]}, ${post.gradient[1]})`,
        }}
      >
        <div
          className="w-10 h-10 rounded-xl opacity-30"
          style={{ backgroundColor: 'white' }}
        />
      </div>

      {/* Stats */}
      <div className="p-2.5 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[11px] text-neutral-500">
          <span className="flex items-center gap-0.5">
            <Heart size={10} style={{ color }} /> {fmt(post.likes)}
          </span>
          <span className="flex items-center gap-0.5">
            <MessageCircle size={10} className="text-neutral-400" /> {fmt(post.comments)}
          </span>
        </div>
        <span className="flex items-center gap-0.5 text-[11px] text-neutral-400">
          <Bookmark size={10} /> {fmt(post.saves)}
        </span>
      </div>
    </div>
  );
}

export function AccountsTab() {
  const [selected, setSelected] = useState<string | null>('tyler');
  const connectedAccounts = ACCOUNTS.filter(a => a.connected);

  return (
    <div className="p-4 space-y-5" style={{ backgroundColor: '#fafafa' }}>
      {/* Profile cards grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {ACCOUNTS.map(account => (
          <ProfileCard
            key={account.id}
            account={account}
            selected={selected === account.id}
            onSelect={() => setSelected(selected === account.id ? null : account.id)}
          />
        ))}
      </div>

      {/* Post feeds per account */}
      <div className="space-y-4">
        {connectedAccounts.map(account => (
          <div key={account.id}>
            {/* Section header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${account.color}, ${account.color}99)` }}
                >
                  {account.initials}
                </div>
                <span className="text-sm font-semibold text-neutral-800">{account.displayName}</span>
                <span className="text-xs text-neutral-400">· {account.handle}</span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${account.color}14`, color: account.color }}
                >
                  {fmt(account.posts)} posts
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
                <RefreshCw size={11} /> Sync
              </div>
            </div>

            {/* Horizontal scroll strip */}
            <div className="flex gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {account.recentPosts.map((post, i) => (
                <PostCard key={i} post={post} color={account.color} />
              ))}
              {/* Add more placeholder */}
              <div
                className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/[0.04] transition-colors"
                style={{ width: 160, height: 196, border: '1.5px dashed rgba(0,0,0,0.12)' }}
              >
                <Plus size={18} className="text-neutral-300" />
                <span className="text-xs text-neutral-300 font-medium">Add Content</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
