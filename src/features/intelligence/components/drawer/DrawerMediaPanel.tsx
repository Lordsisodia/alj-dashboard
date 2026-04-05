'use client';

import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { igThumb } from '../../utils';
import type { DrawerPost } from '../../types';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

interface Props {
  post:    DrawerPost;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev:  () => void;
  onNext:  () => void;
}

// ── Instagram embed ───────────────────────────────────────────────────────────
function InstagramEmbed({ shortcode }: { shortcode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const permalink = `https://www.instagram.com/p/${shortcode}/`;

  useEffect(() => {
    // If embed.js is already loaded, just re-process
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    // Otherwise inject it once
    const existing = document.getElementById('ig-embed-js');
    if (existing) return; // already injecting
    const script = document.createElement('script');
    script.id = 'ig-embed-js';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => window.instgrm?.Embeds?.process();
    document.body.appendChild(script);
  }, [shortcode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto flex items-start justify-center"
      style={{ background: '#000' }}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        data-instgrm-captioned
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: 0,
          width: '100%',
        }}
      >
        <a href={permalink} target="_blank" rel="noreferrer">
          View on Instagram
        </a>
      </blockquote>
    </div>
  );
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
            <InstagramEmbed shortcode={post.externalId} />
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
