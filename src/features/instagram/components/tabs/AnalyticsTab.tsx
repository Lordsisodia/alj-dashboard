'use client';

import { useState } from 'react';
import { TrendingUp, Users, Heart, Eye, MessageCircle, Bookmark } from 'lucide-react';

const MODELS = [
  {
    id: 'tyler', displayName: 'Tyler', handle: '@tyler.isso', color: '#ff0069', initials: 'TY',
    followers: 284_300, following: 412, posts: 847, engagementRate: 4.8,
    avgLikes: 3_900, avgComments: 87, avgSaves: 412, avgReach: 14_200,
    weeklyGrowth: [12200, 12800, 13100, 13600, 14000, 14200, 14800],
  },
  {
    id: 'ren', displayName: 'Ren', handle: '@ren.official', color: '#833ab4', initials: 'RN',
    followers: 192_100, following: 289, posts: 623, engagementRate: 5.2,
    avgLikes: 2_800, avgComments: 54, avgSaves: 298, avgReach: 9_400,
    weeklyGrowth: [8800, 9000, 9100, 9300, 9200, 9400, 9600],
  },
  {
    id: 'ella', displayName: 'Ella', handle: '@ella.creates', color: '#f77737', initials: 'EL',
    followers: 318_700, following: 534, posts: 1104, engagementRate: 6.1,
    avgLikes: 7_100, avgComments: 201, avgSaves: 843, avgReach: 21_300,
    weeklyGrowth: [19200, 19600, 20100, 20400, 20800, 21000, 21300],
  },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// Tiny sparkline bar chart
function MiniBar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${Math.round((v / max) * 100)}%`,
            backgroundColor: i === data.length - 1 ? color : `${color}55`,
          }}
        />
      ))}
    </div>
  );
}

export function AnalyticsTab() {
  const [selected, setSelected] = useState('ella');
  const model = MODELS.find(m => m.id === selected)!;

  return (
    <div className="p-4 space-y-4" style={{ backgroundColor: '#fafafa' }}>
      {/* Model switcher */}
      <div className="flex items-center gap-2">
        {MODELS.map(m => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: selected === m.id ? m.color : '#ffffff',
              color: selected === m.id ? '#ffffff' : '#737373',
              border: selected === m.id ? 'none' : '1px solid rgba(0,0,0,0.09)',
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
              style={{
                backgroundColor: selected === m.id ? 'rgba(255,255,255,0.25)' : m.color,
                color: '#ffffff',
              }}
            >
              {m.initials}
            </div>
            {m.displayName}
          </button>
        ))}
      </div>

      {/* Account header */}
      <div
        className="rounded-2xl p-4 flex items-center gap-4"
        style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}99)` }}
        >
          {model.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-neutral-900">{model.displayName}</p>
          <p className="text-sm text-neutral-400">{model.handle}</p>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#22c55e' }}>
          <TrendingUp size={14} />
          {model.engagementRate}% Eng.
        </div>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Followers',   value: fmt(model.followers),      icon: <Users size={14} />,       color: model.color },
          { label: 'Following',   value: fmt(model.following),      icon: <Users size={14} />,       color: '#737373' },
          { label: 'Posts',       value: fmt(model.posts),          icon: <Eye size={14} />,         color: '#7c3aed' },
          { label: 'Avg Reach',   value: fmt(model.avgReach),       icon: <TrendingUp size={14} />,  color: '#0ea5e9' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-400">{s.label}</span>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <p className="text-xl font-black text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg Likes',    value: fmt(model.avgLikes),    icon: <Heart size={13} />,         color: '#ff0069' },
          { label: 'Avg Comments', value: fmt(model.avgComments), icon: <MessageCircle size={13} />, color: '#833ab4' },
          { label: 'Avg Saves',    value: fmt(model.avgSaves),    icon: <Bookmark size={13} />,      color: '#7c3aed' },
          { label: 'Eng. Rate',    value: `${model.engagementRate}%`, icon: <TrendingUp size={13} />, color: '#22c55e' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-2xl p-3.5"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-xs text-neutral-400">{s.label}</span>
            </div>
            <p className="text-lg font-black text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly reach chart */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-neutral-900">Weekly Reach</p>
          <span className="text-xs text-neutral-400">Last 7 days</span>
        </div>
        <MiniBar data={model.weeklyGrowth} color={model.color} />
        <div className="flex justify-between mt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <span key={d} className="text-[10px] text-neutral-400 flex-1 text-center">{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
