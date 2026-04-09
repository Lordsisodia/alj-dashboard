'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Play, Eye } from 'lucide-react';
import type { Post } from '../../types';
import { TYPE_COLORS } from '../../constants';
import { fmtK } from '../../utils';

export function PostCard({ post }: { post: Post }) {
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
        <div
          className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold"
          style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
        >
          {post.type}
        </div>
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
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: post.creator.color }}
          >
            {post.creator.initials}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold" style={{ color: post.creator.color }}>
              {post.creator.handle}
            </span>
            <span className="text-[10px] text-neutral-400 ml-1.5">{post.postedAt}</span>
          </div>
        </div>

        <p className="text-xs text-neutral-700 leading-relaxed line-clamp-2 mb-1.5">{post.caption}</p>
        <p className="text-[10px] mb-3" style={{ color: '#2563eb' }}>
          {post.hashtags.slice(0, 2).join(' ')}
        </p>

        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => { if (!liked) { setLiked(true); setLikeCount(c => c + 1); } }}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{ color: liked ? '#2563eb' : '#a3a3a3' }}
            >
              <Heart size={13} className={liked ? 'fill-current' : ''} />
            </button>
            <span className="text-[11px] text-neutral-500 mr-2">{fmtK(likeCount)}</span>
            <button className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400">
              <MessageCircle size={13} />
            </button>
            <span className="text-[11px] text-neutral-500">{fmtK(post.comments)}</span>
          </div>
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
