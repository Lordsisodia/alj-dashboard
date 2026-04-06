'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Layers, History, Heart, X, Send, Play, Eye } from 'lucide-react';
import { SwipeStack } from './SwipeStack';
import { WhyTagPanel } from './WhyTagPanel';
import { SwipeSessionSummary } from './SwipeSessionSummary';
import { SwipeAuditLog } from './SwipeAuditLog';
import { SendToModelModal } from './SendToModelModal';
import { SEED_REELS, MODELS } from '../constants';
import type { TagSelection, RatingRecord, SwipeSession } from '../types';

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

type ViewMode = 'swipe' | 'grid' | 'log';

function newSession(): SwipeSession {
  return { rated: 0, passed: 0, sent: 0, startedAt: new Date(), log: [] };
}

export function SwipeTabContent() {
  const [mode, setMode] = useState<ViewMode>('swipe');
  const [queue]          = useState(SEED_REELS);
  const [tags, setTags]  = useState<TagSelection>({});
  const [session, setSession] = useState<SwipeSession>(newSession);
  const [allLog, setAllLog]   = useState<RatingRecord[]>([]);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const pendingAction = useRef<'like' | 'sent' | null>(null);

  function currentReel() {
    const idx = session.rated + session.passed + session.sent;
    return queue[idx];
  }

  function appendRecord(decision: RatingRecord['decision'], sentToModel?: string, note?: string) {
    const reel = currentReel();
    if (!reel) return;

    const record: RatingRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      reel,
      decision,
      tags: { ...tags },
      sentToModel,
      note,
      timestamp: new Date(),
      rater: 'Alex / ALJ',
    };

    setSession((s) => ({
      ...s,
      rated:  decision === 'like' ? s.rated + 1 : s.rated,
      passed: decision === 'pass' ? s.passed + 1 : s.passed,
      sent:   decision === 'sent' ? s.sent + 1 : s.sent,
      log: [...s.log, record],
    }));
    setAllLog((prev) => [...prev, record]);
    setTags({});
  }

  function handleLike() {
    appendRecord('like');
  }

  function handlePass() {
    appendRecord('pass');
  }

  function handleSendOpen() {
    pendingAction.current = 'sent';
    setSendModalOpen(true);
  }

  function handleSendConfirm(modelId: string, note: string) {
    const model = MODELS.find((m) => m.id === modelId);
    appendRecord('sent', model?.name, note);
    setSendModalOpen(false);
  }

  function handleEndSession() {
    setSession(newSession());
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500">
            Queue: {queue.length} reels
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ModeButton active={mode === 'swipe'} onClick={() => setMode('swipe')} title="Swipe mode">
            <Layers size={13} />
            Swipe
          </ModeButton>
          <ModeButton active={mode === 'grid'} onClick={() => setMode('grid')} title="Grid mode">
            <LayoutGrid size={13} />
            Grid
          </ModeButton>
          <ModeButton active={mode === 'log'} onClick={() => setMode('log')} title="History">
            <History size={13} />
            History
            {allLog.length > 0 && (
              <span
                className="ml-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }}
              >
                {allLog.length}
              </span>
            )}
          </ModeButton>
        </div>
      </div>

      {/* Session summary (always visible in swipe/grid) */}
      {mode !== 'log' && (
        <SwipeSessionSummary
          rated={session.rated}
          passed={session.passed}
          sent={session.sent}
          startedAt={session.startedAt}
          onEndSession={handleEndSession}
        />
      )}

      {/* Content area */}
      <AnimatePresence mode="wait">
        {mode === 'log' ? (
          <motion.div
            key="log"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.07)', minHeight: 480, background: '#fff' }}
          >
            <SwipeAuditLog log={allLog} onBack={() => setMode('swipe')} />
          </motion.div>
        ) : mode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <GridMode
              reels={queue}
              onLike={() => appendRecord('like')}
              onPass={() => appendRecord('pass')}
              onSend={() => { pendingAction.current = 'sent'; setSendModalOpen(true); }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="swipe"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-5"
          >
            {/* Left: SwipeStack */}
            <div className="flex-shrink-0 flex flex-col items-center justify-start pt-2">
              <SwipeStack
                queue={queue}
                tags={tags}
                onLike={handleLike}
                onPass={handlePass}
                onSendToModel={handleSendOpen}
                onEmpty={() => {}}
              />
            </div>

            {/* Right: WhyTagPanel */}
            <div className="flex-1 min-w-0 pt-2">
              <WhyTagPanel tags={tags} onChange={setTags} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send to model modal */}
      <SendToModelModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        onConfirm={handleSendConfirm}
      />
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
      style={
        active
          ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
          : { background: '#f5f5f4', color: '#737373' }
      }
    >
      {children}
    </button>
  );
}

function GridMode({
  reels,
  onLike,
  onPass,
  onSend,
}: {
  reels: typeof SEED_REELS;
  onLike: () => void;
  onPass: () => void;
  onSend: () => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {reels.map((reel, i) => (
        <motion.div
          key={reel.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl overflow-hidden group relative"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          {/* Thumbnail */}
          <div
            className="relative aspect-[3/4] overflow-hidden"
            style={{ background: reel.gradient }}
          >
            {reel.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                >
                  <Play size={14} className="text-white fill-white ml-0.5" />
                </div>
              </div>
            )}
            <div
              className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-white"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <Eye size={8} />
              {fmtK(reel.views)}
            </div>

            {/* Hover overlay with actions */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 gap-2"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <ActionBtn onClick={onPass} color="#ef4444">
                <X size={12} />
              </ActionBtn>
              <ActionBtn onClick={onLike} color="#ff0069" gradient>
                <Heart size={12} className="fill-white" />
              </ActionBtn>
              <ActionBtn onClick={onSend} color="#833ab4">
                <Send size={12} />
              </ActionBtn>
            </div>
          </div>

          {/* Footer */}
          <div className="px-2 py-2 bg-white">
            <p className="text-[10px] font-semibold truncate" style={{ color: reel.creator.color }}>
              {reel.creator.handle}
            </p>
            <p className="text-[9px] text-neutral-400 truncate mt-0.5 line-clamp-1">
              {reel.caption}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ActionBtn({
  onClick,
  color,
  gradient,
  children,
}: {
  onClick: () => void;
  color: string;
  gradient?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
      style={
        gradient
          ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' }
          : { background: color }
      }
    >
      {children}
    </button>
  );
}
