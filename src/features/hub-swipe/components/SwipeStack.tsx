'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart, X, Send, Play, Eye } from 'lucide-react';
import type { SwipeReel, TagSelection } from '../types';

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

interface SwipeStackProps {
  queue: SwipeReel[];
  tags: TagSelection;
  onLike: () => void;
  onPass: () => void;
  onSendToModel: () => void;
  onEmpty: () => void;
}

const DRAG_THRESHOLD = 110;

export function SwipeStack({
  queue,
  tags,
  onLike,
  onPass,
  onSendToModel,
  onEmpty,
}: SwipeStackProps) {
  const [topIdx, setTopIdx] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -20], [1, 0]);

  const isDragging = useRef(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (topIdx >= queue.length) return;
      if (e.key === 'ArrowLeft')  triggerPass();
      if (e.key === 'ArrowRight') triggerLike();
      if (e.key === 'ArrowUp')    onSendToModel();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topIdx, queue.length]);

  function advance() {
    animate(x, 0, { duration: 0 });
    setTopIdx((i) => {
      const next = i + 1;
      if (next >= queue.length) onEmpty();
      return next;
    });
  }

  function triggerLike() {
    animate(x, 600, { duration: 0.3 }).then(() => {
      onLike();
      advance();
    });
  }

  function triggerPass() {
    animate(x, -600, { duration: 0.3 }).then(() => {
      onPass();
      advance();
    });
  }

  if (topIdx >= queue.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-neutral-400">
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-sm font-semibold text-neutral-700">Queue cleared</p>
        <p className="text-xs mt-1">All reels have been rated</p>
      </div>
    );
  }

  const visibleCards = queue.slice(topIdx, topIdx + 3);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Stack */}
      <div className="relative flex items-center justify-center" style={{ height: 380, width: 240 }}>
        {/* Background cards */}
        {visibleCards.slice(1).reverse().map((reel, revIdx) => {
          const stackPos = visibleCards.slice(1).length - revIdx; // 2 = furthest back
          const scale = 1 - stackPos * 0.04;
          const translateY = stackPos * 10;
          return (
            <div
              key={reel.id}
              className="absolute rounded-2xl overflow-hidden"
              style={{
                width: 220,
                height: 360,
                transform: `scale(${scale}) translateY(${translateY}px)`,
                background: reel.gradient,
                border: '1px solid rgba(0,0,0,0.08)',
                zIndex: 10 - stackPos,
              }}
            />
          );
        })}

        {/* Top card */}
        {(() => {
          const reel = visibleCards[0];
          return (
            <motion.div
              key={reel.id}
              drag="x"
              dragConstraints={{ left: -300, right: 300 }}
              dragElastic={0.18}
              onDragStart={() => { isDragging.current = true; }}
              onDragEnd={(_, info) => {
                isDragging.current = false;
                if (info.offset.x > DRAG_THRESHOLD) {
                  triggerLike();
                } else if (info.offset.x < -DRAG_THRESHOLD) {
                  triggerPass();
                } else {
                  animate(x, 0, { type: 'spring', stiffness: 300, damping: 24 });
                }
              }}
              className="absolute rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
              style={{
                width: 220,
                height: 360,
                background: reel.gradient ?? '#18181b',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                x,
                rotate,
                zIndex: 20,
              }}
            >
              {/* Real thumbnail image */}
              {reel.thumbnailUrl?.startsWith('http') && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={reel.thumbnailUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
              )}

              {/* Like overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none"
                style={{ background: 'rgba(34,197,94,0.25)', opacity: likeOpacity }}
              >
                <div
                  className="border-4 border-green-400 rounded-xl px-4 py-2 rotate-[-20deg]"
                >
                  <Heart size={36} className="text-green-400 fill-green-400" />
                </div>
              </motion.div>

              {/* Pass overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none"
                style={{ background: 'rgba(239,68,68,0.25)', opacity: passOpacity }}
              >
                <div
                  className="border-4 border-red-400 rounded-xl px-4 py-2 rotate-[20deg]"
                >
                  <X size={36} className="text-red-400" />
                </div>
              </motion.div>

              {/* Play icon */}
              {reel.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.35)' }}
                  >
                    <Play size={22} className="text-white fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* View count */}
              <div
                className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white"
                style={{ background: 'rgba(0,0,0,0.4)' }}
              >
                <Eye size={9} />
                {fmtK(reel.views)}
              </div>

              {/* Bottom info */}
              <div
                className="absolute bottom-0 left-0 right-0 px-3 py-3"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {reel.creator.avatarUrl ? (
                    <img
                      src={reel.creator.avatarUrl}
                      alt={reel.creator.handle}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                      style={{ background: reel.creator.color }}
                    >
                      {reel.creator.initials}
                    </div>
                  )}
                  <span className="text-white text-[11px] font-semibold truncate max-w-[140px]">
                    {reel.creator.displayName ?? reel.creator.handle}
                  </span>
                </div>
                <p className="text-white text-[10px] opacity-80 line-clamp-2">{reel.caption}</p>
              </div>
            </motion.div>
          );
        })()}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={triggerPass}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            background: '#fff',
            border: '2px solid rgba(239,68,68,0.3)',
            boxShadow: '0 4px 14px rgba(239,68,68,0.12)',
          }}
          title="Pass (←)"
        >
          <X size={18} className="text-red-400" />
        </button>

        <button
          onClick={onSendToModel}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            background: '#fff',
            border: '2px solid rgba(131,58,180,0.25)',
            boxShadow: '0 4px 14px rgba(131,58,180,0.1)',
          }}
          title="Send to model (↑)"
        >
          <Send size={14} className="text-violet-500" />
        </button>

        <button
          onClick={triggerLike}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #ff0069, #833ab4)',
            border: '2px solid transparent',
            boxShadow: '0 4px 18px rgba(255,0,105,0.3)',
          }}
          title="Rate (→)"
        >
          <Heart size={18} className="text-white fill-white" />
        </button>
      </div>

      {/* Queue counter */}
      <p className="text-[11px] text-neutral-400">
        {topIdx + 1} of {queue.length} · {queue.length - topIdx - 1} remaining
      </p>
    </div>
  );
}
