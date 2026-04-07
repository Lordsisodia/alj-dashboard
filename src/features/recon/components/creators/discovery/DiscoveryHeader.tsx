'use client';

import { TrendingUp, ScanSearch, FileStack, Users, XCircle } from 'lucide-react';

interface Props {
  pending: number;
  scraped: number;
  rejected: number;
  totalTracked: number;
  avgViews: number;
  avgEngagement: number;
  avgFollowers: number;
  topNiche: string;
}

export function DiscoveryHeader({
  pending, scraped, rejected, totalTracked,
  avgViews, avgEngagement, avgFollowers, topNiche,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StatPill icon={<Users      size={10} />} value={pending}        label="pending"        color="#7f1d1d" />
      <StatPill icon={<ScanSearch  size={10} />} value={scraped}        label="scraped"        color="#991b1b" />
      <StatPill icon={<XCircle     size={10} />} value={rejected}       label="rejected"       color="#7f1d1d" />
      <StatPill icon={<TrendingUp  size={10} />} value={totalTracked}    label="total tracked"  color="#991b1b" />
      <StatPill icon={<FileStack   size={10} />} value={Math.round(avgViews).toLocaleString()} label="avg views"     color="#7f1d1d" />
      <StatPill icon={<TrendingUp  size={10} />} value={avgEngagement.toFixed(1) + '%'} label="avg eng."  color="#7f1d1d" />
      <StatPill icon={<Users       size={10} />} value={Math.round(avgFollowers).toLocaleString()} label="avg followers" color="#7f1d1d" />
      {topNiche && (
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <span className="text-[10px] font-semibold text-neutral-500">Top niche</span>
          <span className="w-px h-3 bg-neutral-300" />
          <span className="text-[11px] font-bold text-neutral-700">{topNiche}</span>
        </div>
      )}
    </div>
  );
}

function StatPill({ icon, value, label, color }: { icon: React.ReactNode; value: number | string; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <span style={{ color }}>{icon}</span>
      <span className="text-[12px] font-bold tabular-nums" style={{ color }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <span className="text-[10px] text-neutral-400">{label}</span>
    </div>
  );
}
