'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { Heart, Eye, Bookmark, ExternalLink, ChevronRight } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { fadeUp, NICHE_COLORS } from '../../constants';
import { fmtNum, timeAgo, avatarColor, igThumb } from '../../utils';
import type { Post, VisibilityState } from '../../types';

const COL_BORDER = '1px solid rgba(0,0,0,0.06)';
export const POST_TABLE_COLS = '56px 28px 1fr 100px 74px 80px 80px 72px 90px 96px';

const HDR = 'flex items-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300';

export function PostListHeader() {
  const cell = { borderRight: COL_BORDER };
  return (
    <div className="grid" style={{ gridTemplateColumns: POST_TABLE_COLS, height: 36, backgroundColor: '#f9f9f9', borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
      <div style={cell} />
      <div className={HDR} style={{ ...cell, justifyContent: 'center' }}>#</div>
      <div className={`${HDR} px-3`} style={cell}>Post</div>
      <div className={`${HDR} px-3`} style={cell}>Account</div>
      <div className={`${HDR} px-3`} style={cell}>Niche</div>
      <div className={`${HDR} px-3`} style={cell}>Format</div>
      <div className={`${HDR} px-3`} style={{ ...cell, justifyContent: 'flex-end' }}>
        <Heart size={10} className="mr-1" />Likes
      </div>
      <div className={`${HDR} px-3`} style={{ ...cell, justifyContent: 'flex-end' }}>
        <Eye size={10} className="mr-1" />Views
      </div>
      <div className={`${HDR} px-3`} style={{ ...cell, justifyContent: 'flex-end' }}>ER</div>
      <div className={`${HDR} px-3`} style={cell}>Posted</div>
    </div>
  );
}

interface Props {
  post:        Post;
  rowIdx:      number;
  visibility:  VisibilityState;
  onPostClick?: () => void;
}

export function PostListItem({ post, rowIdx, visibility, onPostClick }: Props) {
  const toggleSave = useMutation(api.intelligence.toggleSave);
  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';
  const avColor    = avatarColor(post.handle);
  const isRealImg  = post.thumbnailUrl?.startsWith('http');
  const cell       = { borderRight: COL_BORDER };
  const shortcode  = post.externalId?.startsWith('ig_') ? null : post.externalId;

  return (
    <motion.div
      variants={fadeUp}
      onClick={onPostClick}
      className="grid items-stretch border-b transition-colors group cursor-pointer relative hover:bg-[#f9faff]"
      style={{ gridTemplateColumns: POST_TABLE_COLS, minHeight: 52, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      {/* Hover accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-r" style={{ backgroundColor: nicheColor }} />

      {/* Thumbnail */}
      <div className="flex items-center justify-center p-1.5" style={cell}>
        <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
          {isRealImg
            ? <Image src={igThumb(post.thumbnailUrl)} alt="" fill className="object-cover" />
            : <div className="w-full h-full" style={{ background: post.thumbnailUrl ?? '#f3f4f6' }} />
          }
        </div>
      </div>

      {/* Row # */}
      <div className="flex items-center justify-center text-[11px] text-neutral-300 group-hover:text-neutral-400 tabular-nums" style={cell}>
        {rowIdx + 1}
      </div>

      {/* Hook / caption */}
      <div className="flex items-center px-3 min-w-0" style={cell}>
        <p className="text-xs text-neutral-700 leading-snug line-clamp-2">
          {post.caption?.split('\n')[0] || '-'}
        </p>
      </div>

      {/* Account */}
      {visibility.brandDetails ? (
        <div className="flex items-center gap-2 px-3 min-w-0" style={cell}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0" style={{ backgroundColor: avColor }}>
            {post.handle.replace('@', '').charAt(0).toUpperCase()}
          </div>
          <span className="text-[11px] font-medium text-neutral-700 truncate">{post.handle}</span>
        </div>
      ) : (
        <div style={cell} />
      )}

      {/* Niche */}
      <div className="flex items-center px-3" style={cell}>
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white" style={{ backgroundColor: nicheColor }}>
          {post.niche}
        </span>
      </div>

      {/* Format */}
      <div className="flex items-center px-3" style={cell}>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-neutral-500" style={{ backgroundColor: '#f3f4f6' }}>
          {post.contentType}
        </span>
      </div>

      {/* Likes */}
      <div className="flex items-center justify-end px-3 tabular-nums" style={cell}>
        <span className="text-[12px] font-medium text-neutral-700">{fmtNum(post.likes)}</span>
      </div>

      {/* Views */}
      <div className="flex items-center justify-end px-3 tabular-nums" style={cell}>
        <span className="text-[12px] font-medium text-neutral-700">{fmtNum(post.views)}</span>
      </div>

      {/* ER */}
      <div className="flex items-center justify-end px-3" style={cell}>
        {post.engagementRate != null
          ? <span className="text-[12px] font-semibold" style={{ color: nicheColor }}>{post.engagementRate.toFixed(1)}%</span>
          : <span className="text-[11px] text-neutral-300">-</span>
        }
      </div>

      {/* Posted + actions */}
      <div className="flex items-center justify-between px-3 gap-1">
        <span className="text-[11px] text-neutral-400">{timeAgo(post.postedAt)}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); toggleSave({ postId: post._id }); }}
            className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100"
            style={{ borderColor: 'rgba(0,0,0,0.08)', color: post.saved ? '#ff0069' : '#9ca3af' }}
          >
            <Bookmark size={11} fill={post.saved ? '#ff0069' : 'none'} />
          </button>
          {shortcode && (
            <a href={`https://instagram.com/p/${shortcode}/`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
              <ExternalLink size={11} />
            </a>
          )}
          <ChevronRight size={13} className="text-neutral-200 group-hover:text-neutral-400 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}
