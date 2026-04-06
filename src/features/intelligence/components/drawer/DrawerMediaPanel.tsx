'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { igThumb } from '../../utils';
import type { DrawerPost } from '../../types';

interface Props {
  post:    DrawerPost;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev:  () => void;
  onNext:  () => void;
}

export function DrawerMediaPanel({ post, hasPrev, hasNext, onPrev, onNext }: Props) {
  const isVideo   = post.contentType === 'reel' || post.contentType === 'story';
  const hasR2     = !!post.videoUrl;
  const hasEmbed  = isVideo && !!post.externalId && !post.externalId.startsWith('ig_');
  const isRealImg = !hasR2 && !hasEmbed && post.thumbnailUrl?.startsWith('http');

  const navBtn = (enabled: boolean) =>
    cn('absolute top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all z-10',
      enabled ? 'bg-white shadow-md hover:shadow-lg text-neutral-700' : 'bg-white/10 text-white/20 cursor-default');

  return (
    <div className="flex-1 flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      <button onClick={onPrev} disabled={!hasPrev} className={`${navBtn(hasPrev)} left-3`}>
        <ChevronLeft size={16} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={post._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full flex items-center justify-center py-6 px-14"
        >
          {hasR2 ? (
            <video
              src={post.videoUrl}
              autoPlay
              controls
              playsInline
              loop
              className="rounded-2xl shadow-2xl"
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          ) : hasEmbed ? (
            <iframe
              src={`https://www.instagram.com/p/${post.externalId}/embed/`}
              width={400}
              height={700}
              frameBorder={0}
              scrolling="no"
              allowTransparency
              className="rounded-2xl shadow-2xl"
              style={{ display: 'block', maxHeight: '100%' }}
            />
          ) : isRealImg ? (
            <img
              src={igThumb(post.thumbnailUrl)}
              alt=""
              className="rounded-2xl shadow-2xl"
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div
              className="rounded-2xl shadow-2xl"
              style={{ aspectRatio: '9/16', maxHeight: '100%', minWidth: 240, background: post.thumbnailUrl }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <button onClick={onNext} disabled={!hasNext} className={`${navBtn(hasNext)} right-3`}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
