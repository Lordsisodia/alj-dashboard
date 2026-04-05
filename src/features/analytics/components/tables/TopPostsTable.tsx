'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TopPost, PostSortKey } from '../../types';
import { fmtK } from '../../utils';
import { SectionCard } from '../stats/SectionCard';

const FILTERS: { id: PostSortKey; label: string }[] = [
  { id: 'likes',    label: 'Likes' },
  { id: 'comments', label: 'Comments' },
  { id: 'saves',    label: 'Saves' },
  { id: 'reach',    label: 'Reach' },
];

interface TopPostsTableProps {
  posts: TopPost[];
}

export function TopPostsTable({ posts }: TopPostsTableProps) {
  const [sortKey, setSortKey] = useState<PostSortKey>('likes');
  const sorted = [...posts].sort((a, b) => b[sortKey] - a[sortKey]);

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
            <span className="text-xs font-bold text-neutral-300">{i + 1}</span>
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${post.gradientFrom}, ${post.gradientTo})` }}
              />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold" style={{ color: post.handleColor }}>
                  {post.handle}
                </div>
                <p className="text-[11px] text-neutral-500 truncate">{post.caption}</p>
              </div>
            </div>
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
