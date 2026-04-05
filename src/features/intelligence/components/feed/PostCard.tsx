'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { Heart, Eye, Bookmark, Maximize2, Play, X } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { fadeUp, NICHE_COLORS } from '../../constants';
import { fmtNum, timeAgo, avatarColor, igThumb } from '../../utils';
import { BoardPickerDropdown } from './BoardPickerDropdown';
import type { Post, VisibilityState } from '../../types';

declare global {
  interface Window { instgrm?: { Embeds: { process: () => void } }; }
}

interface Props {
  post:         Post;
  visibility:   VisibilityState;
  onPostClick?: () => void;   // opens full drawer
}

// ── Inject embed.js once per page ────────────────────────────────────────────
function loadInstagramEmbed() {
  if (window.instgrm) { window.instgrm.Embeds.process(); return; }
  if (document.getElementById('ig-embed-js')) return;
  const s = document.createElement('script');
  s.id = 'ig-embed-js';
  s.src = 'https://www.instagram.com/embed.js';
  s.async = true;
  s.onload = () => window.instgrm?.Embeds?.process();
  document.body.appendChild(s);
}

// ── Inline Instagram embed ────────────────────────────────────────────────────
function InlineEmbed({ shortcode, onClose }: { shortcode: string; onClose: () => void }) {
  useEffect(() => { loadInstagramEmbed(); }, [shortcode]);

  return (
    <div className="absolute inset-0 z-10 bg-black overflow-y-auto">
      {/* Close */}
      <button
        className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X size={13} />
      </button>

      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`https://www.instagram.com/p/${shortcode}/`}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: 0,
          margin: 0,
          maxWidth: '100%',
          minWidth: 0,
          padding: 0,
          width: '100%',
        }}
      >
        <a
          href={`https://www.instagram.com/p/${shortcode}/`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-center block p-4 text-neutral-400"
        >
          Loading reel…
        </a>
      </blockquote>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function PostCard({ post, visibility, onPostClick }: Props) {
  const [playing, setPlaying]   = useState(false);
  const toggleSave              = useMutation(api.intelligence.toggleSave);
  const nicheColor              = NICHE_COLORS[post.niche] ?? '#833ab4';
  const avColor                 = avatarColor(post.handle);
  const isVideo                 = post.contentType === 'reel' || post.contentType === 'story';
  const isRealImage             = post.thumbnailUrl.startsWith('http');
  const canEmbed                = isVideo && !!post.externalId && !post.externalId.startsWith('ig_');

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl overflow-hidden flex flex-col group"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.10)', transition: { duration: 0.18 } }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: avColor }}
          >
            {post.handle.replace('@','').charAt(0).toUpperCase()}
          </div>
          {visibility.brandDetails && (
            <span className="text-xs font-semibold text-neutral-800 truncate">{post.handle}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {visibility.brandDetails && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: nicheColor }}>
              {post.niche}
            </span>
          )}
          <span className="text-[10px] text-neutral-400 font-medium">{timeAgo(post.postedAt)}</span>
        </div>
      </div>

      {/* Thumbnail / inline embed */}
      <div
        className="relative mx-3 rounded-xl overflow-hidden cursor-pointer"
        style={{ aspectRatio: isVideo ? '9/16' : '4/5' }}
        onClick={() => canEmbed ? setPlaying(true) : onPostClick?.()}
      >
        {/* Thumbnail background */}
        {isRealImage
          ? <img src={igThumb(post.thumbnailUrl)} alt={post.handle} className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0" style={{ background: post.thumbnailUrl }} />
        }

        {/* Inline embed overlay */}
        {playing && canEmbed && (
          <InlineEmbed shortcode={post.externalId} onClose={() => setPlaying(false)} />
        )}

        {/* Play button — only when not playing */}
        {!playing && isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            >
              <Play size={16} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Expand button — top right — opens full drawer */}
        {!playing && (
          <button
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { e.stopPropagation(); onPostClick?.(); }}
            title="Open full view"
          >
            <Maximize2 size={11} className="text-white" />
          </button>
        )}

        {/* Content type badge */}
        {!playing && (
          <div
            className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-semibold text-white uppercase tracking-wide"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          >
            {post.contentType}
          </div>
        )}
      </div>

      {/* Metrics */}
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

      {/* Save to Hub */}
      <div
        className="flex items-center justify-between mx-3 mt-2.5 mb-3 rounded-xl overflow-visible"
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
        onClick={(e) => e.stopPropagation()}
      >
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
  );
}
