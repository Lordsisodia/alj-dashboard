'use client';

import { useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion } from 'framer-motion';
import { Play, Check } from 'lucide-react';
import { NICHE_COLORS } from '../../constants';
import { fmtNum } from '../../utils';
import { toast } from 'sonner';

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
  view:         'table' | 'kanban';
  onViewChange: (v: 'table' | 'kanban') => void;
  days:         number;
  onDaysChange?: (d: number) => void;
  niche?:       string;
  platform?:    string;
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

// ── Reel card ─────────────────────────────────────────────────────────────────

function ReelCard({ post }: { post: QualifyPost }) {
  const band = getBandForScore(post.baselineScore);
  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';

  return (
    <motion.div
      className="rounded-xl overflow-hidden cursor-default"
      style={{ border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#fff' }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full aspect-[9/16] flex items-center justify-center"
        style={{ background: post.thumbnailUrl.startsWith('http') ? undefined : post.thumbnailUrl }}
      >
        <Play size={14} className="text-white/60" />
        {/* Platform badge */}
        <div className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff' }}>
          {post.platform === 'tiktok' ? 'TT' : 'IG'}
        </div>
        {/* Saved badge */}
        {post.savedForPipeline && (
          <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
            <Check size={9} className="text-white" />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="px-2.5 py-2 space-y-1">
        <p className="text-[10px] font-semibold text-neutral-700 truncate">{post.handle}</p>
        <p className="text-[9px] text-neutral-400 truncate capitalize">{post.niche}</p>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-neutral-400">{fmtNum(post.views)} views</span>
          <span className="text-[10px] font-bold" style={{ color: band.color }}>
            {post.baselineScore.toFixed(1)}×
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────

function KanbanColumn({ band, posts }: { band: typeof BANDS[0]; posts: QualifyPost[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="flex-shrink-0 w-48 rounded-2xl overflow-hidden" style={{ border: `1px solid ${band.color}30` }}>
      {/* Column header */}
      <div className="px-3 py-2 flex items-center justify-between" style={{ backgroundColor: `${band.color}15` }}>
        <span className="text-[11px] font-bold" style={{ color: band.color }}>{band.label}</span>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${band.color}25`, color: band.color }}>
          {posts.length}
        </span>
      </div>

      {/* Cards */}
      <div className="p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
        {posts.map(post => (
          <ReelCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function QualifyKanbanView({ view, onViewChange, days, onDaysChange, niche = 'all', platform = 'all' }: Props) {
  const raw = useQuery(api.intelligence.getQualifyPosts, {}) as QualifyPost[] | undefined;

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

  return (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
      {byBand.map(band => (
        <KanbanColumn key={band.label} band={band} posts={band.posts} />
      ))}
    </div>
  );
}
