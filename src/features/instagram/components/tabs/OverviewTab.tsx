'use client';

import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Plus, Users, Image, Heart } from 'lucide-react';

const IG_ACCOUNTS = [
  {
    id: 'tyler', handle: '@tyler.isso', displayName: 'Tyler', niche: 'Fitness',
    color: '#ff0069', initials: 'TY',
    followers: 284_300, following: 412, posts: 847, engagementRate: 4.8,
    connected: true, lastSynced: '2 min ago',
  },
  {
    id: 'ren', handle: '@ren.official', displayName: 'Ren', niche: 'Lifestyle',
    color: '#833ab4', initials: 'RN',
    followers: 192_100, following: 289, posts: 623, engagementRate: 5.2,
    connected: true, lastSynced: '5 min ago',
  },
  {
    id: 'ella', handle: '@ella.creates', displayName: 'Ella', niche: 'Beauty',
    color: '#f77737', initials: 'EL',
    followers: 318_700, following: 534, posts: 1104, engagementRate: 6.1,
    connected: true, lastSynced: '12 min ago',
  },
  {
    id: 'amam', handle: '@amam.world', displayName: 'Amam', niche: 'Travel',
    color: '#0ea5e9', initials: 'AM',
    followers: 97_400, following: 761, posts: 312, engagementRate: 3.9,
    connected: false, lastSynced: 'Never',
  },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function OverviewTab() {
  return (
    <div className="p-4 space-y-4" style={{ backgroundColor: '#fafafa' }}>
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Followers', value: fmt(IG_ACCOUNTS.reduce((s, a) => s + a.followers, 0)), icon: <Users size={16} />, color: '#ff0069' },
          { label: 'Total Posts',     value: fmt(IG_ACCOUNTS.reduce((s, a) => s + a.posts, 0)),     icon: <Image size={16} />, color: '#833ab4' },
          { label: 'Avg Eng. Rate',   value: `${(IG_ACCOUNTS.reduce((s, a) => s + a.engagementRate, 0) / IG_ACCOUNTS.length).toFixed(1)}%`, icon: <Heart size={16} />, color: '#f77737' },
        ].map(item => (
          <div
            key={item.label}
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}14` }}>
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-900">{item.value}</p>
              <p className="text-xs text-neutral-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accounts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {IG_ACCOUNTS.map(account => (
          <div
            key={account.id}
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${account.color}, ${account.color}99)` }}
                >
                  {account.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{account.displayName}</p>
                  <p className="text-xs text-neutral-400">{account.handle}</p>
                </div>
              </div>
              {account.connected ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-600">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100">
                  <AlertCircle size={11} className="text-amber-500" />
                  <span className="text-[11px] font-semibold text-amber-600">Disconnected</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${account.color}14`, color: account.color }}>
                {account.niche}
              </span>
              <span className="text-[11px] text-neutral-400">Synced {account.lastSynced}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Followers', value: fmt(account.followers) },
                { label: 'Following', value: fmt(account.following) },
                { label: 'Posts',     value: fmt(account.posts) },
                { label: 'Eng. Rate', value: `${account.engagementRate}%` },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center justify-center rounded-xl py-2.5 gap-1" style={{ backgroundColor: '#f9f9f9', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <span className="text-sm font-bold text-neutral-900">{stat.value}</span>
                  <span className="text-[10px] text-neutral-400">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {account.connected ? (
                <>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-black/[0.04] transition-colors" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
                    <RefreshCw size={12} /> Sync Now
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-black/[0.04] transition-colors" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
                    <ExternalLink size={12} /> View Profile
                  </button>
                </>
              ) : (
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-105" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
                  <Plus size={12} /> Reconnect Account
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
