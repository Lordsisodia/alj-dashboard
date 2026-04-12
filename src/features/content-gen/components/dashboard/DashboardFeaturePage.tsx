'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Brain, Image, BookOpen } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Doc } from '@/convex/_generated/dataModel';
import { StatusStrip, timeAgo } from '@/components/ui/status-strip';
import { ActivityFeed } from '@/components/ui/activity-feed';
import { ModelSummaryCard } from './ModelSummaryCard';

// ── Helper: needsWork (from ScenesFeaturePage) ────────────────────────────

function needsWork(s: Doc<'scenes'>): boolean {
  return s.status !== 'Queued' && s.status !== 'Generating' && s.status !== 'Done';
}

// ── Quick Links Row ──────────────────────────────────────────────────────

function QuickLinksRow() {
  const router = useRouter();

  const links = [
    { icon: Brain, label: 'Scenes', href: '/content-gen/content-gen?tab=scenes' },
    { icon: Sparkles, label: 'Generate', href: '/content-gen/content-gen?tab=generate' },
    { icon: Image, label: 'Gallery', href: '/content-gen/content-gen?tab=gallery' },
    { icon: BookOpen, label: 'Hub', href: '/content-gen/community' },
  ];

  return (
    <div className="flex gap-3">
      {links.map(({ icon: Icon, label, href }) => (
        <button
          key={label}
          onClick={() => router.push(href)}
          className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all hover:bg-black/[0.05]"
          style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <Icon size={20} className="text-neutral-600" />
          <span className="text-xs font-semibold text-neutral-600">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function DashboardFeaturePage() {
  const router = useRouter();
  const scenes = useQuery(api.scenes.list, {}) ?? [];
  const active = useQuery(api.contentGen.getActiveJobs) ?? [];
  const history = useQuery(api.contentGen.getHistory, { limit: 100 }) ?? [];
  const models = useQuery(api.models.getAll, {}) ?? [];

  // ── Compute StatusStrip stats ──────────────────────────────────────

  const startOfDay = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }, []);

  const blocked = useMemo(() => scenes.filter(s => needsWork(s)).length, [scenes]);
  const ready = useMemo(() => scenes.filter(s => s.status === 'Queued').length, [scenes]);
  const live = useMemo(() => active.filter(j => j.status === 'Generating').length, [active]);
  const doneToday = useMemo(
    () => history.filter(j => j.status === 'Done' && (j.completedAt ?? 0) > startOfDay).length,
    [history, startOfDay],
  );
  const lastGeneratedAt = useMemo(() => (history.length > 0 ? history[0]?.completedAt ?? 0 : 0), [history]);

  // ── Determine pipeline status label ────────────────────────────────

  const statusLabel = useMemo(() => {
    if (live > 0) return 'Generating';
    if (blocked === 0 && ready === 0) return 'Pipeline idle';
    return 'Pipeline building';
  }, [live, blocked, ready]);

  const statusActive = live > 0;

  // ── Compute per-model derivations ──────────────────────────────────

  function modelDerivations(modelId: string) {
    const modelScenes = scenes.filter(s => s.modelId === modelId);
    const modelHistory = history.filter(h => h.modelId === modelId);
    const clipsToday = modelHistory.filter(h => (h.completedAt ?? 0) > Date.now() - 86_400_000).length;
    const approved = modelHistory.filter(h => h.outcome === 'Approved').length;
    const blocked = modelScenes.filter(s => needsWork(s)).length;

    return { clipsToday, approved, blocked };
  }

  return (
    <div className="p-5 flex flex-col gap-5">

      {/* ── StatusStrip ─────────────────────────────────────────────── */}
      <StatusStrip
        status={{ label: statusLabel, active: statusActive }}
        stats={[
          { value: blocked, label: 'blocked' },
          { value: ready, label: 'ready' },
          { value: live, label: 'live' },
          { value: doneToday, label: 'done today' },
        ]}
        rightSlot={
          <span className="text-neutral-500">
            Last generated {timeAgo(lastGeneratedAt)}
          </span>
        }
        iconColor="text-emerald-600"
      />

      {/* ── Main two-column layout ─────────────────────────────────── */}
      <div className="flex gap-5 min-h-0">

        {/* Left: models grid + button */}
        <div className="flex-1 min-w-0 space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Models - Today</p>
          <div className="grid grid-cols-2 gap-3">
            {models.map(m => {
              const { clipsToday, approved, blocked } = modelDerivations(m._id);
              return (
                <ModelSummaryCard
                  key={m._id}
                  model={m}
                  stats={{ clipsToday, approved, blocked }}
                />
              );
            })}
          </div>

          {/* Run Today's Queue button */}
          <div style={{ width: 240 }}>
            <button
              onClick={() => router.push('/content-gen/content-gen?tab=generate')}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-105"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <Sparkles size={14} /> Run Today's Queue
            </button>
          </div>
        </div>

        {/* Right: sticky ActivityFeed (280px) */}
        <div
          className="w-[280px] flex-shrink-0 rounded-xl overflow-hidden"
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.07)',
            height: 'calc(100vh - 180px)',
            position: 'sticky',
            top: 0,
          }}
        >
          <ActivityFeed />
        </div>

      </div>

      {/* ── Quick Links Row ─────────────────────────────────────────── */}
      <QuickLinksRow />

    </div>
  );
}
