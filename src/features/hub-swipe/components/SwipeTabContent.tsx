'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Layers, History, Heart, X, Send, Play, Eye } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SwipeStack } from './SwipeStack';
import { AiAnalysisPanel } from './AiAnalysisPanel';
import { QuickAnnotate } from './QuickAnnotate';
import { MotionCriteria, ViralityCriteria } from './CriteriaChecklist';
import { SwipeSessionSummary } from './SwipeSessionSummary';
import { SwipeAuditLog } from './SwipeAuditLog';
import { SendToModelModal } from './SendToModelModal';
import { SEED_REELS, MODELS } from '../constants';
import type { TagSelection, RatingRecord, SwipeSession } from '../types';

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export type ViewMode = 'swipe' | 'grid' | 'log';

function newSession(): SwipeSession {
  return { rated: 0, passed: 0, sent: 0, startedAt: new Date(), log: [] };
}

// Pre-computed fallback — stable reference, never recreated
const SEED_ADAPTED = SEED_REELS.map((r) => ({ ...r, postId: r.id }));

// Adapter: scrapedPosts → SwipeReel (adds postId field for Convex mutation)
function adaptPostToReel(post: any) {
  const account = post.account;
  return {
    id:          post._id,
    postId:      post._id,
    gradient:    post.thumbnailUrl?.startsWith('http') ? undefined : post.thumbnailUrl,
    thumbnailUrl: post.thumbnailUrl,
    isVideo:     post.contentType === 'reel' || post.contentType === 'story',
    creator: {
      handle:      post.handle ?? '',
      displayName: account?.displayName,
      avatarUrl:   account?.avatarUrl,
      initials:    post.handle?.replace('@', '').slice(0, 2).toUpperCase() ?? '?',
      color:       account?.avatarColor ?? '#833ab4',
    },
    views:          post.views          ?? 0,
    caption:        post.caption        ?? '',
    type:           post.contentType    ?? 'post',
    aiAnalysis:     post.aiAnalysis     ?? null,
    engagementRate: post.engagementRate ?? null,
    likes:          post.likes          ?? null,
    comments:       post.comments       ?? null,
    saves:          post.saves          ?? null,
  };
}

// Convex history → RatingRecord shape for SwipeAuditLog
function adaptHistoryToRecord(h: any): RatingRecord {
  return {
    id: h._id,
    reel: h.post
      ? adaptPostToReel(h.post)
      : ({ id: h.postId, gradient: '#833ab4', isVideo: false, creator: { handle: '', initials: '?', color: '#833ab4' }, views: 0, caption: '', type: 'post' } as any),
    decision: (h.rating === 'up' ? 'like' : h.rating === 'down' ? 'pass' : 'sent') as RatingRecord['decision'],
    tags: {},
    timestamp: new Date(h.ratedAt),
    rater: h.ratedBy,
  };
}

const DECISION_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  like: { icon: <Heart size={11} className="fill-current" />, color: '#f43f5e', label: 'Rated' },
  pass: { icon: <X size={11} />, color: '#a3a3a3', label: 'Passed' },
  sent: { icon: <Send size={11} />, color: '#833ab4', label: 'Sent' },
};

interface SwipeTabContentProps {
  mode?:            ViewMode;
  onModeChange?:    (m: ViewMode) => void;
  onSessionChange?: (s: SwipeSession, log: RatingRecord[]) => void;
}

export function SwipeTabContent({ mode: controlledMode, onModeChange, onSessionChange }: SwipeTabContentProps = {}) {
  const [internalMode, setInternalMode] = useState<ViewMode>('swipe');
  const mode    = controlledMode ?? internalMode;
  const setMode = (m: ViewMode) => { setInternalMode(m); onModeChange?.(m); };
  const [tags, setTags]  = useState<TagSelection>({});
  const [session, setSession] = useState<SwipeSession>(newSession);
  const [sendModalOpen, setSendModalOpen] = useState(false);

  // Convex data
  const convexQueue = useQuery(api.hub.getSwipeQueue);
  const history     = useQuery(api.hub.getSwipeHistory, { limit: 100 });
  const recordSwipe = useMutation(api.hub.recordSwipe);

  const isLoading = convexQueue === undefined;

  // Fall back to SEED_REELS if Convex is empty (dev convenience)
  const queue = convexQueue !== undefined
    ? convexQueue.length > 0
      ? convexQueue.map(adaptPostToReel)
      : SEED_ADAPTED
    : SEED_ADAPTED;

  const historyRecords = useMemo(
    () => (history ?? []).map(adaptHistoryToRecord),
    [history]
  );

  function currentReel() {
    const idx = session.rated + session.passed + session.sent;
    return queue[idx];
  }

  function appendRecord(decision: RatingRecord['decision'], sentToModel?: string, note?: string) {
    const reel = currentReel();
    if (!reel) return;

    // Write to Convex (only real posts have postId)
    if ('postId' in reel && (reel as any).postId) {
      const ratingMap = { like: 'up', pass: 'down', sent: 'save' } as const;
      recordSwipe({ postId: (reel as any).postId, ratedBy: 'Alex / ALJ', rating: ratingMap[decision] });
    }

    const record: RatingRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      reel: reel as any,
      decision,
      tags: { ...tags },
      sentToModel,
      note,
      timestamp: new Date(),
      rater: 'Alex / ALJ',
    };

    setSession((s) => {
      const next = {
        ...s,
        rated:  decision === 'like' ? s.rated + 1 : s.rated,
        passed: decision === 'pass' ? s.passed + 1 : s.passed,
        sent:   decision === 'sent' ? s.sent + 1 : s.sent,
        log: [...s.log, record],
      };
      onSessionChange?.(next, next.log);
      return next;
    });
    setTags({});
  }

  function handleLike() {
    appendRecord('like');
  }

  function handlePass() {
    appendRecord('pass');
  }

  function handleSendOpen() {
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

  const isControlled = controlledMode !== undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar — hidden when mode is controlled by parent */}
      {!isControlled && (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isLoading && (
            <span className="text-xs font-semibold text-neutral-500">
              {queue.length} queued
            </span>
          )}
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
            {historyRecords.length > 0 && (
              <span
                className="ml-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }}
              >
                {historyRecords.length}
              </span>
            )}
          </ModeButton>
        </div>
      </div>
      )}

      {/* Session summary — only when not controlled by parent (which has its own strip) */}
      {mode !== 'log' && !isControlled && (
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
            className="rounded-xl overflow-y-auto"
            style={{ border: '1px solid rgba(0,0,0,0.07)', minHeight: 480, maxHeight: 'calc(100vh - 280px)', background: '#fff' }}
          >
            <SwipeAuditLog log={historyRecords} onBack={() => setMode('swipe')} />
          </motion.div>
        ) : mode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
            <GridMode
              reels={queue}
              onLike={() => appendRecord('like')}
              onPass={() => appendRecord('pass')}
              onSend={() => setSendModalOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="swipe"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-4"
          >
            {/* Top 3-col row */}
            <div className="grid gap-5" style={{ gridTemplateColumns: '240px 1fr 340px' }}>
              {/* Col A: SwipeStack */}
              <div className="flex flex-col items-center justify-start pt-2">
                <SwipeStack
                  queue={queue}
                  tags={tags}
                  onLike={handleLike}
                  onPass={handlePass}
                  onSendToModel={handleSendOpen}
                  onEmpty={() => {}}
                />
              </div>

              {/* Col B: AI Analysis */}
              <div className="pt-2 min-w-0">
                <AiAnalysisPanel
                  analysis={currentReel()?.aiAnalysis}
                  views={currentReel()?.views}
                  likes={currentReel()?.likes ?? undefined}
                  comments={currentReel()?.comments ?? undefined}
                  saves={currentReel()?.saves ?? undefined}
                  engagementRate={currentReel()?.engagementRate ?? undefined}
                />
              </div>

              {/* Col C: Annotations only */}
              <div className="pt-2">
                <QuickAnnotate tags={tags} onChange={setTags} />
              </div>
            </div>

            {/* Bottom full-width criteria row */}
            <div className="grid grid-cols-2 gap-4">
              <MotionCriteria />
              <ViralityCriteria />
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
