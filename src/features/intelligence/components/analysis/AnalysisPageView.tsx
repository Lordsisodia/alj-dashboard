'use client';

import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Sparkles, Video, Loader2, AlertTriangle, Wrench, ChevronDown, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { PipelineStatusStrip } from '../dashboard/PipelineStatusStrip';
import { ScoreRing } from '../shared/ScoreRing';
import { PostDetailDrawer } from '../drawer/PostDetailDrawer';
import { SystemPromptPanel } from './SystemPromptPanel';
import { GRAD } from '../../constants';
import type { DrawerPost } from '../../types';

type Phase    = 'downloading' | 'analysing';
type ViewMode = 'kanban' | 'list';

type QueuePost = {
  _id: string; handle: string; niche: string; contentType: string;
  thumbnailUrl?: string | null; caption: string; engagementRate: number;
  outlierRatio: number; videoUrl?: string; postedAt: number;
};

const PURPLE_GRAD = 'linear-gradient(135deg, #6d28d9, #4c1d95)';
const RUN_OPTIONS = [1, 5, 10, 25] as const;

// ── Instagram icon SVG ────────────────────────────────────────────────────────

function IgIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

// ── Queue post card ───────────────────────────────────────────────────────────

function QueuePostCard({ post, isExpired, onAnalyse }: { post: QueuePost; isExpired: boolean; onAnalyse: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const thumb    = post.thumbnailUrl ?? '';
  const showGrad = !thumb || thumb.startsWith('linear-gradient') || imgFailed;
  const igHandle = post.handle.replace(/^@/, '');
  const initial  = igHandle.charAt(0).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8, transition: { duration: 0.15 } }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.13)' }}
      className="relative rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Portrait thumbnail */}
      <div className="relative w-full" style={{ height: 200 }}>
        {showGrad ? (
          <div className="w-full h-full flex items-center justify-center" style={{ background: thumb && !imgFailed ? thumb : PURPLE_GRAD }}>
            <span className="text-5xl font-black text-white/20 select-none">{initial}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="w-full h-full object-cover"
            onError={() => setImgFailed(true)} />
        )}

        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Platform icon  -  top right */}
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
          <IgIcon size={13} />
        </div>
      </div>

      {/* White info card  -  overlaps bottom of thumbnail */}
      <div className="relative -mt-4 mx-2 mb-2 rounded-xl bg-white px-2.5 py-2" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.13)' }}>
        {/* Handle + open link */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <p className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</p>
          <a
            href={`https://instagram.com/${igHandle}`}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="shrink-0 w-5 h-5 rounded-md bg-neutral-100 hover:bg-purple-50 flex items-center justify-center text-neutral-400 hover:text-purple-500 transition-colors"
          >
            <ExternalLink size={8} />
          </a>
        </div>
        {/* Caption */}
        <p className="text-[9px] text-neutral-500 truncate leading-snug mb-1.5">
          {post.caption?.slice(0, 34) || post.niche}
        </p>
        {/* Pills + Analyse button */}
        <div className="flex items-center gap-1">
          <span className="inline-flex text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500 capitalize whitespace-nowrap">{post.contentType}</span>
          <span className="inline-flex text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white whitespace-nowrap" style={{ background: PURPLE_GRAD }}>{post.outlierRatio.toFixed(1)}×</span>
          {isExpired && <span title="Posted over 24h ago"><AlertTriangle size={8} className="text-amber-400" /></span>}
          <button
            onClick={onAnalyse}
            className="ml-auto flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded-full text-white whitespace-nowrap hover:brightness-110 transition-all"
            style={{ background: PURPLE_GRAD }}
          >
            <Sparkles size={7} /> Analyse
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Analyzing pill (horizontal compact) ──────────────────────────────────────

function AnalyzingCard({ post, phase }: { post: QueuePost; phase: Phase }) {
  const progress = phase === 'downloading' ? '35%' : '72%';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.15 } }}
      className="flex-shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
      style={{ width: 168, backgroundColor: '#fff', border: '1px solid rgba(109,40,217,0.18)' }}
    >
      {/* Pulsing orb */}
      <div className="relative flex items-center justify-center shrink-0 w-8 h-8">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: PURPLE_GRAD }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="w-8 h-8 rounded-full flex items-center justify-center relative z-10" style={{ background: PURPLE_GRAD }}>
          <Loader2 size={13} className="animate-spin text-white" />
        </div>
      </div>

      {/* Text + progress */}
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-semibold text-neutral-700 truncate">{post.handle}</p>
        <p className="text-[8px] text-purple-500 mb-1.5">{phase === 'downloading' ? 'Downloading...' : 'Analysing...'}</p>
        <div className="w-full h-1 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: PURPLE_GRAD }}
            initial={{ width: '10%' }}
            animate={{ width: progress }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Analyzed portrait card (horizontal scroll gallery) ────────────────────────

function AnalyzedPortraitCard({ post, isSelected, onClick }: { post: any; isSelected: boolean; onClick: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const thumb   = post.thumbnailUrl ?? '';
  const showGrad = !thumb || thumb.startsWith('linear-gradient') || imgFailed;
  const initial = (post.handle ?? '?').replace('@', '').charAt(0).toUpperCase();

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative flex-shrink-0 h-full rounded-xl overflow-hidden cursor-pointer"
      style={{
        width: 98,
        border: isSelected ? '2px solid #6d28d9' : '1px solid rgba(0,0,0,0.08)',
        boxShadow: isSelected ? '0 0 0 2px rgba(109,40,217,0.2)' : undefined,
      }}
    >
      {/* Thumbnail */}
      <div className="absolute inset-0">
        {showGrad ? (
          <div className="w-full h-full flex items-center justify-center" style={{ background: PURPLE_GRAD }}>
            <span className="text-3xl font-black text-white/20 select-none">{initial}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="w-full h-full object-cover" onError={() => setImgFailed(true)} />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

      {/* Selected check */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: PURPLE_GRAD }}>
          <Check size={8} className="text-white" />
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 inset-x-0 px-1.5 pb-2">
        <ScoreRing score={post.aiAnalysis?.hookScore ?? 0} size={24} />
        <p className="text-[8px] font-semibold text-white truncate mt-1 leading-tight">{post.handle}</p>
        {post.aiAnalysis?.emotions?.[0] && (
          <span className="inline-block text-[7px] font-semibold px-1 py-0.5 rounded-full capitalize mt-0.5 text-white"
            style={{ background: 'rgba(109,40,217,0.7)' }}>
            {post.aiAnalysis.emotions[0]}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Right detail panel ────────────────────────────────────────────────────────

function PostDetailPanel({ post, onOpenDrawer }: { post: any; onOpenDrawer: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const thumb    = post.thumbnailUrl ?? '';
  const showGrad = !thumb || thumb.startsWith('linear-gradient') || imgFailed;

  return (
    <motion.div
      key={post._id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex h-full"
    >
      {/* Left: thumbnail column  -  9:16 portrait width */}
      <div className="relative shrink-0 bg-neutral-100" style={{ width: 290 }}>
        {showGrad
          ? <div className="w-full h-full" style={{ background: PURPLE_GRAD }} />
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={thumb} alt={post.handle} className="w-full h-full object-cover" onError={() => setImgFailed(true)} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <ScoreRing score={post.aiAnalysis.hookScore} size={44} />
          <p className="text-[12px] font-bold text-white leading-tight mt-1.5">{post.handle}</p>
          <p className="text-[9px] text-white/70 capitalize">{post.niche} · {post.contentType}</p>
        </div>
      </div>

      {/* Right: details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">

          {/* Hook line */}
          <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(109,40,217,0.05)', border: '1px solid rgba(109,40,217,0.12)' }}>
            <p className="text-[9px] font-semibold text-purple-600 uppercase tracking-wider mb-1.5">Hook Line</p>
            <p className="text-[13px] text-neutral-700 italic leading-relaxed">"{post.aiAnalysis.hookLine}"</p>
          </div>

          {/* Emotions */}
          {post.aiAnalysis.emotions?.length > 0 && (
            <div>
              <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Emotions</p>
              <div className="flex flex-wrap gap-1.5">
                {post.aiAnalysis.emotions.map((e: string) => (
                  <span key={e} className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white capitalize"
                    style={{ background: PURPLE_GRAD }}>{e}</span>
                ))}
              </div>
            </div>
          )}

          {/* Breakdown */}
          {post.aiAnalysis.breakdown && (
            <div>
              <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Breakdown</p>
              <p className="text-[11px] text-neutral-600 leading-relaxed">{post.aiAnalysis.breakdown}</p>
            </div>
          )}

          {/* Suggestions */}
          {post.aiAnalysis.suggestions?.length > 0 && (
            <div>
              <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Suggestions</p>
              <div className="space-y-2">
                {post.aiAnalysis.suggestions.map((s: string, i: number) => (
                  <div key={i} className="flex gap-2.5 text-[11px] text-neutral-600 leading-relaxed">
                    <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#6d28d9' }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 pb-4 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <button onClick={onOpenDrawer}
            className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: PURPLE_GRAD }}>
            Open full detail →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyDetailState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: 'rgba(109,40,217,0.06)', border: '1px solid rgba(109,40,217,0.1)' }}>
        <Sparkles size={22} className="text-purple-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-400">Select an analyzed post</p>
        <p className="text-[11px] text-neutral-300 mt-1">Click a reel card on the left to view its full analysis here</p>
      </div>
    </div>
  );
}

// ── Run All button with count picker ─────────────────────────────────────────

function RunAllButton({ total, busy, onRun }: { total: number; busy: boolean; onRun: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex items-center rounded-lg overflow-hidden" style={{ background: PURPLE_GRAD }}>
        <button
          onClick={() => onRun(total)} disabled={busy}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-white hover:brightness-110 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {busy ? <><Loader2 size={10} className="animate-spin" /> Running...</> : <><Zap size={10} /> Run all {total} posts</>}
        </button>
        <div className="w-px h-4 bg-white/25 shrink-0" />
        <button onClick={() => setOpen(v => !v)} disabled={busy}
          className="shrink-0 flex items-center justify-center px-1.5 py-2 text-white hover:brightness-110 transition-all disabled:opacity-50">
          <ChevronDown size={11} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 right-0 rounded-xl py-1 z-50"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
          {RUN_OPTIONS.filter(n => n < total).map(n => (
            <button key={n} onClick={() => { onRun(n); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-neutral-700 hover:bg-black/[0.04] transition-colors text-left">
              <Zap size={10} className="text-purple-600" /> Run {n} post{n > 1 ? 's' : ''}
            </button>
          ))}
          <button onClick={() => { onRun(total); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-purple-700 hover:bg-purple-50 transition-colors text-left">
            <Zap size={10} className="text-purple-600" /> Run all {total} posts
          </button>
        </div>
      )}
    </div>
  );
}

// ── Column header ─────────────────────────────────────────────────────────────

function ColHeader({ title, count, accentColor }: { title: string; count: number; accentColor: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 shrink-0" style={{ borderBottom: `1px solid ${accentColor}18` }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>{title}</p>
      <span className="ml-auto px-1.5 py-0.5 rounded-md text-[10px] font-semibold tabular-nums"
        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>{count}</span>
    </div>
  );
}

// ── Left column wrapper ───────────────────────────────────────────────────────

function LeftSection({ title, count, accentColor, children, sizeClass, footerSlot }: {
  title: string; count: number; accentColor: string;
  children: React.ReactNode; sizeClass?: string; footerSlot?: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-xl overflow-hidden ${sizeClass ?? 'flex-1 min-h-0'}`}
      style={{ border: '1px solid rgba(0,0,0,0.07)', borderLeft: `2px solid ${accentColor}`, backgroundColor: `${accentColor}08` }}>
      <ColHeader title={title} count={count} accentColor={accentColor} />
      <div className="flex-1 min-h-0 overflow-y-auto px-1.5 py-2 space-y-1.5 scrollbar-thin">
        {children}
      </div>
      {footerSlot && (
        <div className="shrink-0 px-2 pb-2 pt-1" style={{ borderTop: `1px solid ${accentColor}18` }}>
          {footerSlot}
        </div>
      )}
    </div>
  );
}

// ── List view rows (list mode only) ──────────────────────────────────────────

function QueueListRow({ post, isExpired, onAnalyse }: { post: QueuePost; isExpired: boolean; onAnalyse: () => void }) {
  const thumb  = post.thumbnailUrl ?? '';
  const isGrad = !thumb || thumb.startsWith('linear-gradient');
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="w-8 h-[46px] rounded-md overflow-hidden shrink-0 bg-neutral-100">
        {isGrad ? <div className="w-full h-full" style={{ background: thumb || PURPLE_GRAD }} />
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={thumb} alt={post.handle} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-neutral-800 truncate">{post.handle}</p>
        <p className="text-[10px] text-neutral-400">{post.niche} · {post.contentType} · {(post.engagementRate * 100).toFixed(1)}% ER</p>
      </div>
      <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded shrink-0" style={{ background: GRAD }}>{post.outlierRatio.toFixed(1)}x</span>
      {isExpired && <span className="text-[9px] font-bold text-amber-500 shrink-0">24h</span>}
      <button onClick={onAnalyse} className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg text-white shrink-0 hover:opacity-90" style={{ background: GRAD }}>
        Analyse
      </button>
    </div>
  );
}

function AnalyzedListRow({ post, onClick }: { post: any; onClick: () => void }) {
  const isGrad = post.thumbnailUrl?.startsWith('linear-gradient');
  return (
    <div onClick={onClick} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white cursor-pointer hover:border-purple-200 transition-colors" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="w-8 h-[46px] rounded-md overflow-hidden shrink-0 bg-neutral-100">
        {isGrad ? <div className="w-full h-full" style={{ background: post.thumbnailUrl }} />
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={post.thumbnailUrl} alt={post.handle} className="w-full h-full object-cover" />}
      </div>
      <ScoreRing score={post.aiAnalysis.hookScore} size={30} />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-neutral-800 truncate">{post.handle}</p>
        <p className="text-[9px] text-neutral-500 italic line-clamp-1">"{post.aiAnalysis.hookLine}"</p>
      </div>
      {post.aiAnalysis.emotions[0] && (
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full capitalize shrink-0" style={{ backgroundColor: 'rgba(109,40,217,0.1)', color: '#6d28d9' }}>
          {post.aiAnalysis.emotions[0]}
        </span>
      )}
      <span className="text-[10px] text-neutral-400 shrink-0">{((post.engagementRate ?? 0) * 100).toFixed(1)}% ER</span>
    </div>
  );
}

function EmptyState({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-neutral-300">
      <Icon size={20} />
      <p className="text-[11px] font-medium">{label}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AnalysisPageView({ viewMode }: { viewMode: ViewMode }) {
  const queue         = useQuery(api.intelligence.getAnalysisQueue, { days: 90, limit: 50 });
  const analysed      = useQuery(api.intelligence.getAnalysedPosts, { days: 90, limit: 40 });
  const stats         = useQuery(api.intelligence.getStats, {});
  const patchAnalysis = useMutation(api.intelligence.patchAnalysis);

  const [inFlight,  setInFlight]  = useState<Map<string, Phase>>(new Map());
  const [drawerOpen,       setDrawerOpen]       = useState(false);
  const [drawerIndex,      setDrawerIndex]       = useState(0);
  const [justAnalysedPost, setJustAnalysedPost] = useState<DrawerPost | null>(null);
  const [drawerFromResult, setDrawerFromResult] = useState(false);
  const [selectedPost,     setSelectedPost]     = useState<any | null>(null);
  const [selectedTypeKey,  setSelectedTypeKey]  = useState('ofm_comprehensive');

  const activePrompt = useQuery(api.analysisPrompts.getActivePromptForType, { typeKey: selectedTypeKey });

  const runAllBusyRef = useRef(false);
  const [runAllBusy,  setRunAllBusy] = useState(false);

  useEffect(() => () => { runAllBusyRef.current = false; }, []);

  const inFlightIds   = new Set(inFlight.keys());
  const queuePosts    = (queue ?? []).filter(p => !inFlightIds.has(p._id));
  const inFlightPosts = (queue ?? []).filter(p =>  inFlightIds.has(p._id));

  function isExpired(p: { postedAt?: number }) {
    return typeof p.postedAt === 'number' && p.postedAt < Date.now() - 86_400_000;
  }

  const drawerPosts: DrawerPost[] =
    drawerFromResult && justAnalysedPost
      ? [justAnalysedPost]
      : ((analysed ?? []) as unknown as DrawerPost[]);

  function openDrawerFromAnalysed(index: number) {
    setDrawerFromResult(false);
    setDrawerIndex(index);
    setDrawerOpen(true);
  }

  const handleAnalyse = useCallback(async (
    post: QueuePost,
    opts: { openDrawer?: boolean } = { openDrawer: true },
  ) => {
    setInFlight(prev => new Map(prev).set(post._id, 'downloading'));
    try {
      await new Promise(r => setTimeout(r, 500));
      setInFlight(prev => new Map(prev).set(post._id, 'analysing'));

      const res = await fetch('/api/intelligence/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post, systemPrompt: activePrompt?.prompt ?? null }),
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      const data = await res.json();

      await patchAnalysis({
        postId:      post._id as any,
        transcript:  data.transcript ?? undefined,
        hookScore:   data.hookScore  ?? 5,
        hookLine:    data.hookLine   ?? '',
        emotions:    data.emotions   ?? [],
        breakdown:   data.breakdown  ?? '',
        suggestions: data.suggestions ?? [],
      });

      if (opts.openDrawer) {
        const snapshot: DrawerPost = {
          ...(post as any),
          platform: 'instagram', externalId: '',
          saved: false, likes: 0, views: 0, saves: 0, comments: 0,
          aiAnalysis: {
            hookScore: data.hookScore ?? 5, hookLine: data.hookLine ?? '',
            emotions: data.emotions ?? [], breakdown: data.breakdown ?? '',
            suggestions: data.suggestions ?? [], transcript: data.transcript,
            analyzedAt: Date.now(),
          },
        };
        setJustAnalysedPost(snapshot);
        setDrawerFromResult(true);
        setDrawerIndex(0);
        setDrawerOpen(true);
      } else {
        const score = (data.hookScore ?? 5).toFixed(1);
        const when  = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        toast.success(`@${post.handle} analyzed  -  Hook score: ${score} *`, { description: when });
      }
    } catch (err) {
      console.error('[analyse]', err);
      toast.error(`Analysis failed for @${post.handle}`);
    } finally {
      setInFlight(prev => { const m = new Map(prev); m.delete(post._id); return m; });
    }
  }, [patchAnalysis, activePrompt]);

  async function handleRunAll() {
    if (runAllBusyRef.current) return;
    runAllBusyRef.current = true;
    setRunAllBusy(true);
    try {
      const batch = [...queuePosts];
      for (const post of batch) {
        if (!runAllBusyRef.current) break;
        await handleAnalyse(post, { openDrawer: false });
        await new Promise(r => setTimeout(r, 750));
      }
    } finally {
      runAllBusyRef.current = false;
      setRunAllBusy(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col gap-3 flex-1 min-h-0">

        <PipelineStatusStrip
          totalIndexed={stats?.totalIndexed ?? 0}
          postsThisWeek={stats?.postsThisWeek ?? 0}
          latestScrapeAt={stats?.latestScrapeAt ?? 0}
        />

        {/* ── Kanban view ── */}
        {viewMode === 'kanban' && (
          <div className="flex gap-3 flex-1 min-h-0">

            {/* Queue column */}
            <LeftSection
              title="Queue"
              count={queuePosts.length}
              accentColor="#6d28d9"
              sizeClass="shrink-0 w-56 min-h-0 flex flex-col"
              footerSlot={
                queuePosts.length > 0 ? (
                  <RunAllButton
                    total={queuePosts.length}
                    busy={runAllBusy}
                    onRun={(n) => {
                      if (n >= queuePosts.length) {
                        handleRunAll();
                      } else {
                        const batch = queuePosts.slice(0, n);
                        (async () => {
                          for (const post of batch) {
                            await handleAnalyse(post, { openDrawer: false });
                            await new Promise(r => setTimeout(r, 750));
                          }
                        })();
                      }
                    }}
                  />
                ) : null
              }
            >
              {queue === undefined
                ? <div className="space-y-1.5">{[0,1,2,3].map(i => <div key={i} className="h-[96px] rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />)}</div>
                : queuePosts.length === 0
                  ? <EmptyState icon={Video} label="Queue is empty" />
                  : (
                    <AnimatePresence>
                      {queuePosts.map(post => (
                        <QueuePostCard
                          key={post._id}
                          post={post}
                          isExpired={isExpired(post)}
                          onAnalyse={() => handleAnalyse(post)}
                        />
                      ))}
                    </AnimatePresence>
                  )}
            </LeftSection>

            {/* Middle: 3-row stack (Analyzing | Prompts | Analyzed) */}
            <div className="flex-1 min-h-0 flex flex-col gap-3">

              {/* Row 1: Analyzing pills strip */}
              <div
                className="shrink-0 rounded-xl overflow-hidden flex flex-col"
                style={{
                  height: 120,
                  border: '1px solid rgba(0,0,0,0.07)',
                  borderLeft: '2px solid #7c3aed',
                  backgroundColor: 'rgba(124,58,237,0.04)',
                }}
              >
                <ColHeader title="Analyzing" count={inFlightPosts.length} accentColor="#7c3aed" />
                <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center gap-2 px-2 py-1.5">
                  <AnalyzingCard
                    post={{ _id: '__mock__', handle: '@test.creator', niche: 'lifestyle', contentType: 'reel', thumbnailUrl: 'linear-gradient(135deg, #6d28d9, #4c1d95)', caption: '', engagementRate: 0.08, outlierRatio: 3.2, postedAt: Date.now() }}
                    phase="analysing"
                  />
                  <AnimatePresence>
                    {inFlightPosts.map(post => (
                      <AnalyzingCard key={post._id} post={post} phase={inFlight.get(post._id) ?? 'analysing'} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Row 2: Analysis Prompts panel */}
              <div className="flex-1 min-h-0">
                <SystemPromptPanel
                  selectedTypeKey={selectedTypeKey}
                  onTypeChange={setSelectedTypeKey}
                />
              </div>

              {/* Row 3: Analyzed portrait gallery */}
              <div
                className="shrink-0 rounded-xl overflow-hidden flex flex-col"
                style={{
                  height: 220,
                  border: '1px solid rgba(0,0,0,0.07)',
                  borderLeft: '2px solid #059669',
                  backgroundColor: 'rgba(5,150,105,0.03)',
                }}
              >
                <ColHeader title="Analyzed" count={analysed?.length ?? 0} accentColor="#059669" />
                <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-stretch gap-2 px-2 py-2">
                  {analysed === undefined
                    ? [0,1,2].map(i => <div key={i} className="flex-shrink-0 h-full rounded-xl animate-pulse" style={{ width: 98, backgroundColor: 'rgba(0,0,0,0.05)' }} />)
                    : analysed.length === 0
                      ? <div className="flex flex-1 items-center justify-center gap-2 text-neutral-300"><Sparkles size={16} /><p className="text-[11px] font-medium">No analyses yet</p></div>
                      : (
                        <AnimatePresence>
                          {(analysed as any[]).map((post) => (
                            <AnalyzedPortraitCard
                              key={post._id}
                              post={post}
                              isSelected={selectedPost?._id === post._id}
                              onClick={() => setSelectedPost(post)}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                </div>
              </div>
            </div>

            {/* Right detail panel  -  fixed width */}
            <div
              className="shrink-0 rounded-xl overflow-hidden flex flex-col"
              style={{ width: 600, border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
            >
              <AnimatePresence mode="wait">
                {selectedPost ? (
                  <PostDetailPanel
                    key={selectedPost._id}
                    post={selectedPost}
                    onOpenDrawer={() => {
                      const idx = (analysed ?? []).findIndex((p: any) => p._id === selectedPost._id);
                      if (idx !== -1) openDrawerFromAnalysed(idx);
                    }}
                  />
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
                    <EmptyDetailState />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

        {/* ── List view ── */}
        {viewMode === 'list' && (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pb-4">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Queue ({queuePosts.length})</p>
                {queue === undefined
                  ? <div className="h-10 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
                  : queuePosts.length === 0
                    ? <p className="text-[11px] text-neutral-400 px-1">Queue is empty</p>
                    : queuePosts.map(post => (
                      <QueueListRow key={post._id} post={post} isExpired={isExpired(post)} onAnalyse={() => handleAnalyse(post)} />
                    ))}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Analyzed ({analysed?.length ?? 0})</p>
                {analysed === undefined
                  ? <div className="h-10 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
                  : analysed.length === 0
                    ? <p className="text-[11px] text-neutral-400 px-1">No analyses yet</p>
                    : (analysed as any[]).map((post, i) => (
                      <AnalyzedListRow key={post._id} post={post} onClick={() => openDrawerFromAnalysed(i)} />
                    ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <AnimatePresence>
        {drawerOpen && drawerPosts.length > 0 && (
          <PostDetailDrawer
            posts={drawerPosts}
            initialIndex={drawerIndex}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
