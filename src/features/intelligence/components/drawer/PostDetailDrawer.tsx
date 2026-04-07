'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fmtNum, truncateId } from '../../utils';
import { DrawerMediaPanel } from './DrawerMediaPanel';
import { DrawerRightPanel } from './DrawerRightPanel';
import type { DrawerPost } from '../../types';

interface Props {
  posts:        DrawerPost[];
  initialIndex: number;
  initialTab?:  'details' | 'ai' | 'transcript';
  onClose:      () => void;
}

export function PostDetailDrawer({ posts, initialIndex, initialTab, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const post    = posts[index];
  const hasPrev = index > 0;
  const hasNext = index < posts.length - 1;

  const goPrev = useCallback(() => { if (hasPrev) setIndex(i => i - 1); }, [hasPrev]);
  const goNext = useCallback(() => { if (hasNext) setIndex(i => i + 1); }, [hasNext]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape')     onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, onClose]);

  if (!post) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col justify-end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="flex flex-col bg-white"
        style={{ height: '92vh', borderRadius: '20px 20px 0 0' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <button onClick={goPrev} disabled={!hasPrev} className={cn('flex items-center gap-1 text-xs font-medium transition-colors', hasPrev ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-300 cursor-default')}>
            <ChevronLeft size={14} />Previous
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-neutral-400">ID: {truncateId(post._id)}</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-neutral-600" style={{ backgroundColor: '#f3f4f6' }}>
              <Bookmark size={10} />{fmtNum(post.saves)}
            </div>
            <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
              <Share2 size={12} />Share
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={goNext} disabled={!hasNext} className={cn('flex items-center gap-1 text-xs font-medium transition-colors', hasNext ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-300 cursor-default')}>
              Next<ChevronRight size={14} />
            </button>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/[0.06] transition-colors">
              <X size={14} className="text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Body - key on post._id resets tab state when navigating */}
        <div className="flex flex-1 overflow-hidden">
          <DrawerMediaPanel post={post} hasPrev={hasPrev} hasNext={hasNext} onPrev={goPrev} onNext={goNext} />
          <DrawerRightPanel key={post._id} post={post} initialTab={initialTab} />
        </div>
      </motion.div>
    </motion.div>
  );
}
