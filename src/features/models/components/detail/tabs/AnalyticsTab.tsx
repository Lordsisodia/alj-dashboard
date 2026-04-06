'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Heart, MessageCircle, Bookmark } from 'lucide-react';
import type { ModelData } from '../../../types';

const GROWTH_DATA: Record<string, number[]> = {
  m1: [820, 940, 1100, 1050, 1300, 1520, 1700, 1840],
  m2: [400, 550, 680, 720, 900, 1050, 1200, 1320],
  m3: [1200, 1500, 1800, 2100, 2400, 2750, 2980, 3150],
  m4: [200, 280, 350, 420, 480, 500, 520, 540],
};

const MODEL_STATS: Record<string, { followers: string; engagement: string; avgLikes: string }> = {
  m1: { followers: '1,840', engagement: '4.2%', avgLikes: '312' },
  m2: { followers: '1,320', engagement: '5.1%', avgLikes: '228' },
  m3: { followers: '3,150', engagement: '6.8%', avgLikes: '520' },
  m4: { followers: '540',   engagement: '3.9%', avgLikes: '87' },
};

const TOP_POSTS = [
  { gradient: 'linear-gradient(135deg, #ff0069 0%, #833ab4 100%)', likes: 842, comments: 64, saves: 211 },
  { gradient: 'linear-gradient(135deg, #833ab4 0%, #06b6d4 100%)', likes: 710, comments: 48, saves: 183 },
  { gradient: 'linear-gradient(135deg, #f59e0b 0%, #ff0069 100%)', likes: 631, comments: 39, saves: 142 },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 240;
  const h = 48;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const fill = `${pts.join(' ')} ${w},${h} 0,${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AnalyticsTab({ model }: { model: ModelData }) {
  const growth = GROWTH_DATA[model.id] ?? GROWTH_DATA.m1;
  const stats = MODEL_STATS[model.id] ?? MODEL_STATS.m1;

  return (
    <div className="p-4 space-y-4">
      {/* Stat pills */}
      <div className="flex gap-2">
        {[
          { label: 'Followers', value: stats.followers },
          { label: 'Engagement', value: stats.engagement },
          { label: 'Avg Likes', value: stats.avgLikes },
        ].map(s => (
          <div
            key={s.label}
            className="flex-1 rounded-xl p-3"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <p className="text-[11px] text-neutral-400">{s.label}</p>
            <p className="text-base font-bold text-neutral-900 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Follower growth chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-neutral-800">Follower Growth</p>
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#22c55e' }}>
            <TrendingUp size={12} />
            +{Math.round(((growth[growth.length - 1] - growth[0]) / growth[0]) * 100)}%
          </div>
        </div>
        <Sparkline data={growth} color={model.color} />
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-neutral-400">8 weeks ago</span>
          <span className="text-[10px] text-neutral-400">Now</span>
        </div>
      </motion.div>

      {/* Top posts */}
      <div>
        <p className="text-sm font-semibold text-neutral-800 mb-3">Top 3 Posts</p>
        <div className="grid grid-cols-3 gap-2">
          {TOP_POSTS.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <div className="aspect-[9/16] w-full" style={{ background: post.gradient }} />
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                  <Heart size={9} fill="currentColor" className="text-red-400" />
                  {post.likes.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                  <MessageCircle size={9} />
                  {post.comments}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                  <Bookmark size={9} />
                  {post.saves}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <a href="/isso/analytics" className="block text-xs font-medium text-center" style={{ color: '#ff0069' }}>
        View full analytics →
      </a>
    </div>
  );
}
