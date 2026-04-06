'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, TrendingUp, Film, Hash, Bookmark, Zap } from 'lucide-react';
import { fadeUp } from '../../constants';
import type { TrendsData } from '../../types';
import type { InsightsData } from '../../types';

interface Insight {
  icon:    React.ReactNode;
  label:   string;
  finding: string;
  color:   string;
  brief?:  { niche: string; format: string; hook: string };
}

function deriveInsights(trends: TrendsData | undefined, insights: InsightsData | undefined): Insight[] {
  const cards: Insight[] = [];

  if (!trends) return cards;

  // 1 - Top niche
  const topNiche = trends.nicheStats[0];
  if (topNiche) {
    cards.push({
      icon:    <TrendingUp size={13} />,
      label:   'Top niche this window',
      finding: `${topNiche.niche} leads with ${(topNiche.avgER * 100).toFixed(1)}% avg ER across ${topNiche.count} posts`,
      color:   '#833ab4',
      brief:   { niche: topNiche.niche, format: trends.formatStats[0]?.format ?? 'reel', hook: trends.topHooks[0]?.hook ?? '' },
    });
  }

  // 2 - Top format
  const topFormat = trends.formatStats[0];
  if (topFormat && trends.formatStats[1]) {
    const lift = topFormat.avgER / (trends.formatStats[1].avgER || 1);
    cards.push({
      icon:    <Film size={13} />,
      label:   'Winning format',
      finding: `${topFormat.format.charAt(0).toUpperCase() + topFormat.format.slice(1)}s outperform by ${((lift - 1) * 100).toFixed(0)}% vs next best format`,
      color:   '#ff0069',
      brief:   { niche: topNiche?.niche ?? '', format: topFormat.format, hook: trends.topHooks[0]?.hook ?? '' },
    });
  }

  // 3 - Top outlier signal
  const topOutlier = trends.outlierPosts[0];
  if (topOutlier) {
    cards.push({
      icon:    <Zap size={13} />,
      label:   'Strongest outlier',
      finding: `${topOutlier.handle} hit ${topOutlier.outlierRatio.toFixed(1)}× baseline ER - "${topOutlier.hook.slice(0, 60)}${topOutlier.hook.length > 60 ? '...' : ''}"`,
      color:   '#f59e0b',
      brief:   { niche: topOutlier.niche, format: topOutlier.contentType, hook: topOutlier.hook.slice(0, 80) },
    });
  }

  // 4 - Team curation signal
  if (insights) {
    const { saveCount, totalRatings } = insights.summary;
    if (totalRatings > 0) {
      const saveRate = Math.round((saveCount / totalRatings) * 100);
      cards.push({
        icon:    <Bookmark size={13} />,
        label:   'Team curation',
        finding: `${saveRate}% save rate across ${totalRatings} ratings - ${saveRate >= 50 ? 'strong signal, high-quality feed' : 'tighten the feed for better signal'}`,
        color:   saveRate >= 50 ? '#22c55e' : '#f97316',
      });
    }
  }

  // 5 - Top hook
  const topHook = trends.topHooks[0];
  if (topHook) {
    cards.push({
      icon:    <Hash size={13} />,
      label:   'Hook to replicate',
      finding: `"${topHook.hook.slice(0, 80)}${topHook.hook.length > 80 ? '...' : ''}" - ${(topHook.engagementRate * 100).toFixed(1)}% ER by @${topHook.handle}`,
      color:   '#4a9eff',
      brief:   { niche: topHook.niche, format: topHook.contentType, hook: topHook.hook.slice(0, 80) },
    });
  }

  return cards.slice(0, 5);
}

interface Props {
  trends:   TrendsData   | undefined;
  insights: InsightsData | undefined;
}

export function InsightCards({ trends, insights }: Props) {
  const router = useRouter();
  const cards  = deriveInsights(trends, insights);

  if (cards.length === 0) {
    return (
      <div className="grid grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-xl h-28 animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} className="grid grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="rounded-xl p-3.5 flex flex-col gap-2 justify-between"
          style={{ border: `1px solid ${card.color}22`, backgroundColor: `${card.color}06` }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5" style={{ color: card.color }}>
              {card.icon}
              <p className="text-[9px] font-bold uppercase tracking-wide">{card.label}</p>
            </div>
            <p className="text-[11px] text-neutral-700 leading-snug">{card.finding}</p>
          </div>
          {card.brief && (
            <button
              onClick={() => router.push(`/isso/ideas?${new URLSearchParams(card.brief!).toString()}`)}
              className="flex items-center gap-1 text-[9px] font-semibold self-start px-2 py-1 rounded-lg text-white transition-opacity hover:opacity-85"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              Brief <ArrowRight size={8} />
            </button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
