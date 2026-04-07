'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { Heart, Eye, Bookmark, Maximize2, Play } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { fadeUp, NICHE_COLORS } from '../../constants';
import { fmtNum, timeAgo, avatarColor, igThumb } from '../../utils';
import { BoardPickerDropdown } from './BoardPickerDropdown';
import { VideoLightbox } from '../shared/VideoLightbox';
import type { Post, VisibilityState } from '../../types';

interface Props {
  post:         Post;
  visibility:   VisibilityState;
  onPostClick?: () => void;
}

function CardHeader({ post, visibility }: { post: Post; visibility: VisibilityState }) {
  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';
  const avColor    = avatarColor(post.handle);
  return (
    <div className="flex items-center justify-between px-3 pt-3 pb-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: avColor }}>
          {post.handle.replace('@', '').charAt(0).toUpperCase()}
        </div>
        {visibility.brandDetails && <span className="text-xs font-semibold text-neutral-800 truncate">{post.handle}</span>}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {visibility.brandDetails && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: nicheColor }}>{post.niche}</span>
        )}
        <span className="text-[10px] text-neutral-400 font-medium">{timeAgo(post.postedAt)}</span>
      </div>
    </div>
  );
}

function CardThumbnail({ post, onPlay, onExpand }: { post: Post; onPlay: () => void; onExpand: () => void }) {
  const isVideo    = post.contentType === 'reel' || post.contentType === 'story';
  const isRealImg  = post.thumbnailUrl.startsWith('http');
  return (
    <div className="relative mx-3 rounded-xl overflow-hidden cursor-pointer" style={{ aspectRatio: isVideo ? '9/16' : '4/5' }} onClick={onPlay}>
      {isRealImg
        ? <Image src={igThumb(post.thumbnailUrl)} alt={post.handle} fill className="object-cover" />
        : <div className="absolute inset-0" style={{ background: post.thumbnailUrl }} />
      }
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <Play size={16} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
      )}
      <button
        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        onClick={e => { e.stopPropagation(); onExpand(); }}
      >
        <Maximize2 size={11} className="text-white" />
      </button>
      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-semibold text-white uppercase tracking-wide" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
        {post.contentType}
      </div>
    </div>
  );
}

export function PostCard({ post, visibility, onPostClick }: Props) {
  const [playing, setPlaying] = useState(false);
  const toggleSave = useMutation(api.intelligence.toggleSave);
  const isVideo    = post.contentType === 'reel' || post.contentType === 'story';
  const canPlay    = isVideo && (!!post.videoUrl || (!post.externalId?.startsWith('ig_') && !!post.externalId));

  return (
    <>
      <motion.div
        variants={fadeUp}
        className="rounded-2xl overflow-hidden flex flex-col group"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.10)', transition: { duration: 0.18 } }}
      >
        <CardHeader post={post} visibility={visibility} />
        <CardThumbnail post={post} onPlay={() => canPlay ? setPlaying(true) : onPostClick?.()} onExpand={() => onPostClick?.()} />

        {(visibility.likeCount || visibility.viewCount || visibility.saveCount) && (
          <div className="flex items-center gap-3 px-3 pt-2.5">
            {visibility.likeCount && <div className="flex items-center gap-1"><Heart    size={10} className="text-neutral-400" /><span className="text-[11px] font-semibold text-neutral-700">{fmtNum(post.likes)}</span></div>}
            {visibility.viewCount && <div className="flex items-center gap-1"><Eye      size={10} className="text-neutral-400" /><span className="text-[11px] font-semibold text-neutral-700">{fmtNum(post.views)}</span></div>}
            {visibility.saveCount && <div className="flex items-center gap-1"><Bookmark size={10} className="text-neutral-400" /><span className="text-[11px] font-semibold text-neutral-700">{fmtNum(post.saves)}</span></div>}
            {post.engagementRate !== undefined && (
              <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(131,58,180,0.08)', color: '#833ab4' }}>
                {post.engagementRate.toFixed(1)}%
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mx-3 mt-2.5 mb-3 rounded-xl overflow-visible" style={{ border: '1px solid rgba(0,0,0,0.09)' }} onClick={e => e.stopPropagation()}>
          <button
            className="flex items-center gap-1.5 flex-1 px-3 py-2 text-xs font-semibold transition-colors hover:bg-black/[0.03]"
            style={{ color: post.saved ? '#ff0069' : '#555' }}
            onClick={() => toggleSave({ postId: post._id })}
          >
            <Bookmark size={12} fill={post.saved ? '#ff0069' : 'none'} strokeWidth={2} />
            {post.saved ? 'Saved to Hub' : 'Save to Hub'}
          </button>
          <div className="w-px h-5" style={{ backgroundColor: 'rgba(0,0,0,0.09)' }} />
          <BoardPickerDropdown />
        </div>
      </motion.div>

      {playing && canPlay && <VideoLightbox post={post} onClose={() => setPlaying(false)} />}
    </>
  );
}
