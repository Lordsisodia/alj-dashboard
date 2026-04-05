import { Award, Check } from 'lucide-react';
import { LEADERBOARD_ENTRIES, CREATORS } from '../../constants';
import { fmtK } from '../../utils';

export function LeaderboardSidebar() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Award size={14} style={{ color: '#d97706' }} />
          <span className="text-xs font-semibold text-neutral-900">Top Creators</span>
        </div>
        <div>
          {LEADERBOARD_ENTRIES.map((entry, i) => (
            <div
              key={entry.handle}
              className="px-4 py-3 flex items-center gap-3 hover:bg-black/[0.025] transition-colors"
              style={{ borderBottom: i < LEADERBOARD_ENTRIES.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
            >
              <span
                className="text-sm font-black w-4 flex-shrink-0 text-center"
                style={{ color: entry.rank === 1 ? '#d97706' : entry.rank === 2 ? '#a3a3a3' : entry.rank === 3 ? '#cd7f32' : '#d4d4d4' }}
              >
                {entry.rank}
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ backgroundColor: entry.color }}>
                {entry.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 truncate">{entry.handle}</p>
                <p className="text-[10px] text-neutral-400">{fmtK(entry.followers)} followers</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: '#ff0069' }}>{entry.engagementRate}%</p>
                <p className="text-[9px] text-neutral-400">eng.</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <a href="#" className="text-[11px] font-semibold hover:underline" style={{ color: '#ff0069' }}>
            View full leaderboard →
          </a>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.06), rgba(131,58,180,0.06))', border: '1px solid rgba(255,0,105,0.15)' }}>
        <p className="text-xs font-semibold text-neutral-800 mb-1.5">Grow your reach</p>
        <p className="text-[11px] text-neutral-500 mb-3 leading-relaxed">
          Every post through ISSO gets featured here. Drive views to your real profile.
        </p>
        <button className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
          Connect Account
        </button>
      </div>

      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <span className="text-xs font-semibold text-neutral-900">Discover</span>
          <button className="text-[11px] font-medium" style={{ color: '#ff0069' }}>See all</button>
        </div>
        <div className="p-3 space-y-2.5">
          {CREATORS.map(c => (
            <div key={c.handle} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: c.color }}>
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold truncate" style={{ color: c.color }}>{c.handle}</span>
                  <Check size={9} style={{ color: c.color }} className="flex-shrink-0" />
                </div>
                <p className="text-[10px] text-neutral-400">{fmtK(c.followers)} followers</p>
              </div>
              <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0 transition-all hover:opacity-80" style={{ backgroundColor: 'rgba(255,0,105,0.07)', color: '#ff0069', border: '1px solid rgba(255,0,105,0.15)' }}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
