'use client';

import { useState } from 'react';
import { Crown, Briefcase, User2, Layers, LayoutGrid, History, CheckCircle2 } from 'lucide-react';
import { SwipeTabContent, type ViewMode } from '@/features/hub-swipe/components/SwipeTabContent';
import type { SwipeSession, RatingRecord } from '@/features/hub-swipe/types';

type Role = 'manager' | 'model' | 'va';

const ROLE_CONFIG: Record<Role, {
  label:    string;
  icon:     React.ReactNode;
  gradient: string;
  pending:  number;
  approved: number;
}> = {
  manager: { label: 'Manager', icon: <Crown    size={11} />, gradient: 'linear-gradient(135deg, #ff0069, #833ab4)', pending: 8,  approved: 24 },
  model:   { label: 'Model',   icon: <User2    size={11} />, gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)', pending: 12, approved: 31 },
  va:      { label: 'VA',      icon: <Briefcase size={11} />, gradient: 'linear-gradient(135deg, #0891b2, #0e7490)', pending: 15, approved: 42 },
};

const ROLES = Object.keys(ROLE_CONFIG) as Role[];

const MODE_CONFIG: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
  { id: 'swipe', icon: <Layers     size={11} />, label: 'Swipe'   },
  { id: 'grid',  icon: <LayoutGrid size={11} />, label: 'Grid'    },
  { id: 'log',   icon: <History    size={11} />, label: 'History' },
];

function newSession(): SwipeSession {
  return { rated: 0, passed: 0, sent: 0, startedAt: new Date(), log: [] };
}

export function ApproveTabContent() {
  const [activeRole, setActiveRole] = useState<Role>('manager');
  const [mode,       setMode]       = useState<ViewMode>('swipe');
  const [session,    setSession]    = useState<SwipeSession>(newSession);
  const [logCount,   setLogCount]   = useState(0);
  const [lastRated,  setLastRated]  = useState<Date | null>(null);

  const role = ROLE_CONFIG[activeRole];

  function handleRoleChange(r: Role) {
    setActiveRole(r);
    setSession(newSession());
    setLogCount(0);
    setLastRated(null);
  }

  function handleSessionChange(s: SwipeSession, log: RatingRecord[]) {
    setSession(s);
    setLogCount(log.length);
    setLastRated(new Date());
  }

  function fmtLastRated() {
    if (!lastRated) return 'never';
    const diff = Math.floor((Date.now() - lastRated.getTime()) / 60_000);
    if (diff < 1)  return 'just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  }

  return (
    <div className="flex flex-col gap-0" style={{ backgroundColor: '#fafafa' }}>

      {/* ── Unified strip ───────────────────────────────────────────────────── */}
      <div className="px-4 pt-4">
        <div
          className="flex items-center gap-0 px-4 py-2.5 rounded-xl bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >

          {/* Session stats */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-neutral-700">Session</span>
            </div>
            <span className="w-px h-3 bg-neutral-200" />
            <span className="text-[11px] text-neutral-500">
              <span className="font-semibold text-neutral-800">{session.rated}</span> rated
            </span>
            <span className="text-[11px] text-neutral-500">
              <span className="font-semibold text-neutral-800">{session.passed}</span> passed
            </span>
            <span className="text-[11px] text-neutral-500">
              <span className="font-semibold text-neutral-800">{session.sent}</span> sent
            </span>
          </div>

          <span className="w-px h-4 bg-neutral-200 mx-4 flex-shrink-0" />

          {/* Role pills */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {ROLES.map(id => {
              const cfg      = ROLE_CONFIG[id];
              const isActive = activeRole === id;
              return (
                <button
                  key={id}
                  onClick={() => handleRoleChange(id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                  style={
                    isActive
                      ? { background: cfg.gradient, color: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.18)' }
                      : { background: 'transparent', color: '#737373', border: '1px solid rgba(0,0,0,0.09)' }
                  }
                >
                  {cfg.icon}
                  {cfg.label}
                  <span
                    className="px-1 py-0.5 rounded-full text-[9px] font-bold leading-none"
                    style={
                      isActive
                        ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                        : { background: 'rgba(0,0,0,0.07)', color: '#525252' }
                    }
                  >
                    {cfg.pending}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="w-px h-4 bg-neutral-200 mx-4 flex-shrink-0" />

          {/* Mode pills */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {MODE_CONFIG.map(({ id, icon, label }) => {
              const isActive = mode === id;
              return (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                  style={
                    isActive
                      ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
                      : { background: 'transparent', color: '#a3a3a3' }
                  }
                >
                  {icon}
                  {label}
                  {id === 'log' && logCount > 0 && (
                    <span
                      className="px-1 py-0.5 rounded-full text-[9px] font-bold leading-none"
                      style={
                        isActive
                          ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                          : { background: 'rgba(0,0,0,0.07)', color: '#525252' }
                      }
                    >
                      {logCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: approved count + last rated */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <CheckCircle2 size={11} className="text-emerald-500" />
              <span>
                <span className="font-semibold text-neutral-700">{role.approved}</span> approved
              </span>
            </div>
            <span className="w-px h-3 bg-neutral-200" />
            <span className="text-[11px] text-neutral-400">
              Last rated: <span className="font-semibold text-neutral-700">{fmtLastRated()}</span>
            </span>
          </div>

        </div>
      </div>

      {/* ── Swipe session ─────────────────────────────────────────────────────── */}
      <div className="p-4">
        <SwipeTabContent
          key={activeRole}
          mode={mode}
          onModeChange={setMode}
          onSessionChange={handleSessionChange}
        />
      </div>

    </div>
  );
}
