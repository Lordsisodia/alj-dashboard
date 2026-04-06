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

// ── Main panel ────────────────────────────────────────────────────────────────
export function DrawerMediaPanel({ post, hasPrev, hasNext, onPrev, onNext }: Props) {
  const isVideo   = post.contentType === 'reel' || post.contentType === 'story';
  const useEmbed  = isVideo && !!post.externalId && !post.externalId.startsWith('ig_');
  const isRealImg = !useEmbed && post.thumbnailUrl.startsWith('http');

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-neutral-950 relative overflow-hidden">
      <button
        onClick={onPrev} disabled={!hasPrev}
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all z-10',
          hasPrev ? 'bg-white shadow-md hover:shadow-lg text-neutral-700' : 'bg-white/10 text-white/20 cursor-default'
        )}
      >
        <ChevronLeft size={16} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={post._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full flex items-center justify-center"
          style={{ maxWidth: 540 }}
        >
          {useEmbed ? (
            <iframe
              src={`https://www.instagram.com/p/${post.externalId}/embed/`}
              width={340}
              height={600}
              frameBorder={0}
              scrolling="no"
              allowTransparency
              className="rounded-2xl shadow-xl"
              style={{ display: 'block' }}
            />
          ) : isRealImg ? (
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: isVideo ? '9/16' : '4/5', maxHeight: '100%' }}>
              <img
                src={igThumb(post.thumbnailUrl)}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="rounded-2xl shadow-xl"
              style={{ aspectRatio: '9/16', maxHeight: '100%', minWidth: 240, minHeight: 320, background: post.thumbnailUrl }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={onNext} disabled={!hasNext}
        className={cn(
          'absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all z-10',
          hasNext ? 'bg-white shadow-md hover:shadow-lg text-neutral-700' : 'bg-white/10 text-white/20 cursor-default'
        )}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
