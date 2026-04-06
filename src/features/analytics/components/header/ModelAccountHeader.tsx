'use client';

import { motion } from 'framer-motion';
import { Users, LayoutGrid, TrendingUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ModelId, ModelProfile, ModelStats } from '../../types';
import { fmtK } from '../../utils';

interface ModelAccountHeaderProps {
  profiles: ModelProfile[];
  selectedId: ModelId;
  onSelect: (id: ModelId) => void;
  stats: ModelStats;
}

export function ModelAccountHeader({
  profiles,
  selectedId,
  onSelect,
  stats,
}: ModelAccountHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selected = profiles.find(p => p.id === selectedId)!;

  return (
    <div
      className="rounded-2xl p-5 mb-4 flex items-center justify-between gap-6 flex-wrap"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Left - avatar + identity */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <motion.div
          key={selectedId}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style={{ backgroundColor: selected.color }}
        >
          {selected.initials}
        </motion.div>

        {/* Text */}
        <motion.div
          key={`text-${selectedId}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-neutral-900">{selected.handle}</h2>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                backgroundColor: `${selected.color}12`,
                color: selected.color,
                border: `1px solid ${selected.color}25`,
              }}
            >
              {selected.niche}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#737373' }}
            >
              Connected
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">{selected.location}</p>
        </motion.div>
      </div>

      {/* Centre - quick stats strip */}
      <div className="flex items-center gap-6">
        {[
          { label: 'Followers', value: fmtK(stats.followers), icon: <Users size={12} /> },
          { label: 'Following', value: fmtK(stats.following), icon: <Users size={12} /> },
          { label: 'Posts',     value: fmtK(stats.posts),     icon: <LayoutGrid size={12} /> },
          { label: 'Eng. Rate', value: `${stats.engagementRate}%`, icon: <TrendingUp size={12} /> },
        ].map(item => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <span className="text-base font-bold text-neutral-900">{item.value}</span>
            <div className="flex items-center gap-1 text-neutral-400">
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right - model switcher */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.07)',
            color: '#404040',
          }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ backgroundColor: selected.color }}
          >
            {selected.initials[0]}
          </div>
          <span>{selected.displayName}</span>
          <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-20"
              style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(0,0,0,0.09)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              }}
            >
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => { onSelect(profile.id); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-black/[0.03]"
                  style={{
                    backgroundColor: profile.id === selectedId ? `${profile.color}08` : undefined,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ backgroundColor: profile.color }}
                  >
                    {profile.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 truncate">{profile.handle}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{profile.niche}</p>
                  </div>
                  {profile.id === selectedId && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: profile.color }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
