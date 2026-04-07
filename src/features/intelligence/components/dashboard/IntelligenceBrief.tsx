'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '../../constants';
import type { TrendsData } from '../../types';

interface Props {
  trends: TrendsData;
}

interface Signal {
  label: string;
  value: string;
  accent: string;
}

export function IntelligenceBrief({ trends }: Props) {
  const signals: Signal[] = [];

  // 1. Top format leading with avg ER
  const topFormat = trends.formatStats[0];
  const topNiche  = trends.nicheStats[0];
  if (topFormat && topNiche) {
    signals.push({
      label: 'Format',
      value: `${topFormat.format.charAt(0).toUpperCase() + topFormat.format.slice(1)}s leading - ${(topNiche.avgER * 100).toFixed(1)}% avg ER`,
      accent: '#ff0069',
    });
  }

  // 2. Top account in top niche (highest ER outlier in top niche)
  if (topNiche) {
    const nicheOutliers = trends.outlierPosts.filter(p => p.niche === topNiche.niche);
    const topPost = nicheOutliers.length > 0
      ? nicheOutliers.reduce((a, b) => a.engagementRate > b.engagementRate ? a : b)
      : null;
    if (topPost) {
      signals.push({
        label: 'Top account',
        value: `@${topPost.handle} in ${topNiche.niche} at ${(topPost.engagementRate * 100).toFixed(1)}% ER`,
        accent: '#833ab4',
      });
    }
  }

  // 3. Outlier count
  if (trends.outlierPosts.length > 0) {
    signals.push({
      label: 'Outliers',
      value: `${trends.outlierPosts.length} posts flagged this week`,
      accent: '#4a9eff',
    });
  }

  // 4. Avg engagement trend
  if (trends.avgER > 0) {
    signals.push({
      label: 'Engagement',
      value: `${(trends.avgER * 100).toFixed(2)}% avg ER across all posts`,
      accent: '#f97316',
    });
  }

  // 5. Best posting pattern (top format + niche combo from highest-ER outlier)
  const bestPost = trends.outlierPosts.length > 0
    ? trends.outlierPosts.reduce((a, b) => a.engagementRate > b.engagementRate ? a : b)
    : null;
  if (bestPost) {
    const time    = new Date(bestPost.postedAt);
    const days    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day     = days[time.getDay()];
    const h24     = time.getHours();
    const hour12  = h24 % 12 || 12;
    const ampm    = h24 < 12 ? 'am' : 'pm';
    signals.push({
      label: 'Best window',
      value: `${bestPost.contentType} on ${day} ${hour12}${ampm} - ${(bestPost.engagementRate * 100).toFixed(1)}% ER`,
      accent: '#22c55e',
    });
  }

  if (signals.length === 0) return null;

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl px-4 py-3 space-y-2.5"
      style={{
        background: 'linear-gradient(135deg, rgba(131,58,180,0.04), rgba(255,0,105,0.03))',
        border: '1px solid rgba(131,58,180,0.10)',
      }}
    >
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">This week</p>

      <div className="space-y-0">
        {signals.map((s, i) => (
          <div key={s.label} className="flex items-start gap-2.5">
            {/* Left accent bar */}
            <div
              className="w-0.5 rounded-full self-stretch shrink-0 mt-0.5"
              style={{ backgroundColor: s.accent, minHeight: 16 }}
            />
            <div className="flex items-baseline gap-1.5 py-0.5">
              <span
                className="text-[9px] font-bold uppercase tracking-wide shrink-0"
                style={{ color: s.accent }}
              >
                {s.label}
              </span>
              <span className="text-[11px] text-neutral-700 leading-relaxed">{s.value}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
