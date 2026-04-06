'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { Heart, Eye, Bookmark } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { fadeUp, NICHE_COLORS } from '../../constants';
import { fmtNum, timeAgo, avatarColor, igThumb } from '../../utils';
import type { Post, VisibilityState } from '../../types';

interface Props {
  post:         Post;
  visibility:   VisibilityState;
  onPostClick?: () => void;
}

export function PostListItem({ post, visibility, onPostClick }: Props) {
  const toggleSave  = useMutation(api.intelligence.toggleSave);
  const nicheColor  = NICHE_COLORS[post.niche] ?? '#833ab4';
  const avColor     = avatarColor(post.handle);
  const isRealImage = post.thumbnailUrl.startsWith('http');

  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02] cursor-pointer"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      onClick={onPostClick}
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
        {isRealImage
          ? <Image src={igThumb(post.thumbnailUrl)} alt="" fill className="object-cover" />
          : <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
        }
        {(post.contentType === 'reel' || post.contentType === 'story') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        )}
      </div>

      {/* Account */}
      {visibility.brandDetails && (
        <div className="flex items-center gap-2 w-44 flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: avColor }}>
            {post.handle.replace('@','').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-800 truncate">{post.handle}</p>
            <p className="text-[10px] text-neutral-400">{timeAgo(post.postedAt)}</p>
          </div>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md text-white flex-shrink-0" style={{ backgroundColor: nicheColor }}>
            {post.niche}
          </span>
        </div>
      )}

      {/* Metrics */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {visibility.likeCount  && <div className="flex items-center gap-1"><Heart    size={11} className="text-neutral-400 flex-shrink-0" /><span className="text-xs font-semibold text-neutral-700">{fmtNum(post.likes)}</span></div>}
        {visibility.viewCount  && <div className="flex items-center gap-1"><Eye      size={11} className="text-neutral-400 flex-shrink-0" /><span className="text-xs font-semibold text-neutral-700">{fmtNum(post.views)}</span></div>}
        {visibility.saveCount  && <div className="flex items-center gap-1"><Bookmark size={11} className="text-neutral-400 flex-shrink-0" /><span className="text-xs font-semibold text-neutral-700">{fmtNum(post.saves)}</span></div>}
        {post.engagementRate !== undefined && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(131,58,180,0.08)', color: '#833ab4' }}>
            {post.engagementRate.toFixed(1)}%
          </span>
        )}
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide text-neutral-500" style={{ backgroundColor: '#f3f4f6' }}>
          {post.contentType}
        </span>
      </div>

      {/* Save */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleSave({ postId: post._id }); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
        style={{ border: '1px solid rgba(0,0,0,0.09)', color: post.saved ? '#ff0069' : '#555', backgroundColor: post.saved ? 'rgba(255,0,105,0.05)' : 'transparent' }}
      >
        <Bookmark size={11} fill={post.saved ? '#ff0069' : 'none'} strokeWidth={2} />
        {post.saved ? 'Saved' : 'Save to Hub'}
      </button>
    </motion.div>
  );
}
