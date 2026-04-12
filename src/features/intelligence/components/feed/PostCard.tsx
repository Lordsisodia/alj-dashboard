'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { Heart, Eye, Bookmark, Maximize2, Play, Sparkles } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { fadeUp, NICHE_COLORS } from '../../constants';
import { fmtNum, timeAgo, avatarColor, igThumb, creatorVelocity, nicheERDelta, type CreatorStats, type NicheERMap } from '../../utils';
import { BoardPickerDropdown } from './BoardPickerDropdown';
import { VideoLightbox } from '../shared/VideoLightbox';
import { ScoreRing } from '../shared/ScoreRing';
import type { Post, VisibilityState } from '../../types';

interface Props {
  post:             Post;
  visibility:       VisibilityState;
  columns?:         number;
  onPostClick?:    () => void;
  onAnalyzeClick?: () => void;
  creatorStatsMap?: Record<string, CreatorStats>;
  nicheERMap?:      NicheERMap;
}

function CardHeader({ post, visibility, onAnalyzeClick, velocity, erDelta }: { post: Post; visibility: VisibilityState; onAnalyzeClick?: () => void; velocity?: { direction: 'up' | 'down' | 'same'; pct: number }; erDelta?: string }) {
  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';
  const avColor    = post.avatarColor ?? avatarColor(post.handle);
  const initials   = post.handle.replace('@', '').charAt(0).toUpperCase();
  const [avatarErr, setAvatarErr] = useState(false);

  // Only use avatarUrl if it's an R2 URL (stable)  - Instagram CDN URLs expire in 24h
  const isR2 = post.avatarUrl?.includes('r2.dev') || post.avatarUrl?.includes('cloudflare');
  const showAvatar = isR2 && !avatarErr;

  return (
    <div className="flex items-center justify-between px-3 pt-3 pb-2">
      <div className="flex items-center gap-2 min-w-0">
        {/* Avatar with niche colour ring */}
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
          style={{
            backgroundColor: avColor,
            boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${nicheColor}`,
          }}
        >
          {showAvatar
            ? <Image src={post.avatarUrl!} alt={post.handle} width={28} height={28} className="object-cover w-full h-full" onError={() => setAvatarErr(true)} />
            : initials
          }
        </div>

        {visibility.brandDetails && (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-semibold text-neutral-800 truncate">
              {post.displayName ?? post.handle}
            </span>
            {velocity && velocity.direction !== 'same' && (
              <span className={`text-[10px] font-bold flex-shrink-0 ${velocity.direction === 'up' ? 'text-green-600' : 'text-red-400'}`}>
                {velocity.direction === 'up' ? '▲' : '▼'}{velocity.pct}%
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {erDelta && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${erDelta.startsWith('+') ? 'text-green-600 bg-green-50' : erDelta.startsWith('-') ? 'text-red-400 bg-red-50' : 'text-neutral-500 bg-neutral-100'}`}>
            {erDelta}
          </span>
        )}
        <span className="text-[10px] text-neutral-400 font-medium">{timeAgo(post.postedAt)}</span>
        {onAnalyzeClick && (
          <button
            onClick={e => { e.stopPropagation(); onAnalyzeClick(); }}
            className="w-6 h-6 rounded-md flex items-center justify-center hover:scale-110 transition-transform"
            style={{ backgroundColor: 'rgba(131,58,180,0.1)' }}
            title="AI Analysis"
          >
            <Sparkles size={11} style={{ color: '#833ab4' }} />
          </button>
        )}
      </div>
    </div>
  );
}

function CardThumbnail({ post, onPlay, onExpand }: { post: Post; onPlay: () => void; onExpand: () => void }) {
  const isVideo    = post.contentType === 'reel' || post.contentType === 'story';
  const isRealImg  = post.thumbnailUrl.startsWith('http');
  const [imgError, setImgError] = useState(false);

  const fallbackBg = post.thumbnailUrl.startsWith('http')
    ? `linear-gradient(135deg, ${avatarColor(post.handle)}30, ${avatarColor(post.handle)}60)`
    : post.thumbnailUrl;

  return (
    <div className="relative mx-3 rounded-xl overflow-hidden cursor-pointer" style={{ aspectRatio: isVideo ? '9/16' : '4/5' }} onClick={onPlay}>
      {isRealImg && !imgError
        ? <Image src={igThumb(post.thumbnailUrl)} alt={post.handle} fill className="object-cover" onError={() => setImgError(true)} />
        : <div className="absolute inset-0" style={{ background: fallbackBg }} />
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
      {post.aiAnalysis?.hookScore != null && (
        <div className="absolute bottom-2 right-2">
          <ScoreRing score={post.aiAnalysis.hookScore} size={30} />
        </div>
      )}
      {post.aiAnalysis?.emotions?.[0] && (
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-semibold text-white capitalize" style={{ backgroundColor: 'rgba(109,40,217,0.7)', backdropFilter: 'blur(4px)' }}>
          {post.aiAnalysis.emotions[0]}
        </div>
      )}
    </div>
  );
}

export function PostCard({ post, visibility, columns = 4, onPostClick, onAnalyzeClick, creatorStatsMap, nicheERMap }: Props) {
  const [playing, setPlaying] = useState(false);
  const toggleSave = useMutation(api.intelligence.toggleSave);
  const isVideo    = post.contentType === 'reel' || post.contentType === 'story';
  const canPlay    = isVideo && (!!post.videoUrl || (!post.externalId?.startsWith('ig_') && !!post.externalId));

  const velocity = creatorStatsMap ? creatorVelocity(post.handle, Object.values(creatorStatsMap)) : undefined;
  const erDelta = nicheERMap && post.engagementRate != null ? nicheERDelta(post.engagementRate, post.niche, nicheERMap) : undefined;

  // Save rate
  const saveRate = post.views && post.views > 0 ? (post.saves / post.views) * 100 : null;

  return (
    <>
      <motion.div
        variants={fadeUp}
        className="rounded-2xl overflow-hidden flex flex-col group"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.10)', transition: { duration: 0.18 } }}
      >
        <CardHeader post={post} visibility={visibility} onAnalyzeClick={onAnalyzeClick} velocity={velocity} erDelta={erDelta} />
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
            {saveRate !== null && columns < 6 && (
              <span className="text-[10px] font-medium text-neutral-400" title="Save rate">
                {saveRate.toFixed(2)}% sv
              </span>
            )}
          </div>
        )}

        {post.aiAnalysis?.hookLine && (
          <p className="px-3 pt-2 text-[9px] text-neutral-400 italic line-clamp-2">
            &ldquo;{post.aiAnalysis.hookLine}&rdquo;
          </p>
        )}

        {post.v2Analysis && (post.v2Analysis.vibeKeyword !== 'unknown' || post.v2Analysis.hookStructure !== 'unknown') && (
          <div className="flex items-center gap-1.5 px-3 pt-1.5 flex-wrap">
            {post.v2Analysis.vibeKeyword && post.v2Analysis.vibeKeyword !== 'unknown' && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md text-white capitalize" style={{ backgroundColor: 'rgba(124,58,237,0.75)' }}>
                {post.v2Analysis.vibeKeyword.replace(/_/g, ' ')}
              </span>
            )}
            {post.v2Analysis.hookStructure && post.v2Analysis.hookStructure !== 'unknown' && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md capitalize" style={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                {post.v2Analysis.hookStructure.replace(/_/g, ' ')}
              </span>
            )}
            {post.v2Analysis.curiosityGapPresent && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(234,179,8,0.1)', color: '#a16207' }}>
                curiosity gap
              </span>
            )}
            {post.v2Analysis.patternInterruptPresent && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#1d4ed8' }}>
                pattern interrupt
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
