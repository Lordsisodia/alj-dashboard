'use client';

import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { NICHE_COLORS } from '../../constants';
import { fmtNum } from '../../utils';

type QualifyPost = {
  _id: string;
  handle: string;
  platform: string;
  contentType: string;
  niche: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  views: number;
  outlierRatio?: number;
  baselineScore: number;
  savedForPipeline?: boolean;
};

interface Props {
  niche?:    string;
  platform?: string;
}


// ── Band config ────────────────────────────────────────────────────────────────

const BANDS: { label: string; min: number; color: string }[] = [
  { label: 'Below Baseline', min: 0,  color: '#9ca3af' },
  { label: '2×',            min: 1,  color: '#60a5fa' },
  { label: '5×',            min: 5,  color: '#34d399' },
  { label: '10×',           min: 10, color: '#fbbf24' },
  { label: '20×',           min: 20, color: '#fb923c' },
  { label: '🔥 50×+',       min: 50, color: '#f472b6' },
];

function getBandForScore(score: number) {
  for (let i = BANDS.length - 1; i >= 0; i--) {
    if (score >= BANDS[i].min) return BANDS[i];
  }
  return BANDS[0];
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function KanbanSkeleton() {
  return (
    <div className="flex gap-4">
      {BANDS.map(band => (
        <div key={band.label} className="flex-shrink-0 w-48 rounded-2xl overflow-hidden" style={{ border: `1px solid ${band.color}20` }}>
          <div className="px-3 py-2" style={{ backgroundColor: `${band.color}10` }}>
            <div className="h-3 w-16 rounded bg-neutral-100 animate-pulse" />
          </div>
          <div className="p-2 space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl px-2.5 py-2 space-y-1.5 animate-pulse" style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}>
                <div className="h-2.5 w-20 rounded bg-neutral-100" />
                <div className="h-2 w-12 rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── List row ──────────────────────────────────────────────────────────────────

function ReelListRow({ post }: { post: QualifyPost }) {
  const [open, setOpen] = useState(false);
  const band = getBandForScore(post.baselineScore);
  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
      onClick={() => setOpen(v => !v)}
    >
      {/* Row */}
      <div className="flex items-center gap-2 px-2.5 py-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-neutral-700 truncate">{post.handle}</p>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: nicheColor }}>{post.niche}</span>
        </div>
        <span className="text-[11px] font-bold shrink-0" style={{ color: band.color }}>{post.baselineScore.toFixed(1)}×</span>
        {open ? <ChevronUp size={11} className="text-neutral-300 shrink-0" /> : <ChevronDown size={11} className="text-neutral-300 shrink-0" />}
      </div>

      {/* Expanded stats */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center gap-3 px-2.5 py-2"
              style={{ borderTop: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}
            >
              <div className="flex items-center gap-1">
                <Eye size={10} className="text-neutral-300" />
                <span className="text-[10px] text-neutral-500">{fmtNum(post.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={10} className="text-neutral-300" />
                <span className="text-[10px] text-neutral-500">{fmtNum(post.likes)}</span>
              </div>
              <span className="text-[9px] text-neutral-400 capitalize ml-auto">{post.platform}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────

function KanbanColumn({ band, posts }: { band: typeof BANDS[0]; posts: QualifyPost[] }) {
  const isEmpty = posts.length === 0;

  return (
    <div className="flex-shrink-0 w-48 rounded-2xl overflow-hidden" style={{ border: `1px solid ${band.color}30` }}>
      {/* Column header */}
      <div className="px-3 py-2 flex items-center justify-between" style={{ backgroundColor: `${band.color}15` }}>
        <span className="text-[11px] font-bold" style={{ color: isEmpty ? '#9ca3af' : band.color }}>{band.label}</span>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${band.color}25`, color: isEmpty ? '#9ca3af' : band.color }}>
          {posts.length}
        </span>
      </div>

      {/* Cards or empty state */}
      <div className="p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 rounded-xl" style={{ border: `1px dashed ${band.color}25`, backgroundColor: `${band.color}05` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={band.color} strokeWidth="1.5" opacity="0.4">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
              <path d="M7 10l3 3 7-7"/>
            </svg>
            <span className="text-[10px]" style={{ color: '#d1d5db' }}>Nothing here yet</span>
          </div>
        ) : (
          posts.map(post => (
            <ReelListRow key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function QualifyKanbanView({ niche = 'all', platform = 'all' }: Props) {
  const raw = useQuery(api.intelligence.getQualifyPosts, {}) as QualifyPost[] | undefined;

  const isLoading = raw === undefined;

  const byBand = useMemo(() => {
    if (!raw) return BANDS.map(b => ({ ...b, posts: [] as QualifyPost[] }));
    const buckets: Record<number, QualifyPost[]> = {};
    for (const b of BANDS) buckets[b.min] = [];

    const filtered = raw.filter(p =>
      (niche === 'all' || p.niche === niche) &&
      (platform === 'all' || p.platform === platform)
    );

    for (const post of filtered) {
      const band = getBandForScore(post.baselineScore);
      buckets[band.min].push(post);
    }

    return BANDS.map(b => ({ ...b, posts: buckets[b.min] }));
  }, [raw, niche, platform]);

  if (isLoading) return <KanbanSkeleton />;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
      {byBand.map(band => (
        <KanbanColumn key={band.label} band={band} posts={band.posts} />
      ))}
    </div>
  );
}
