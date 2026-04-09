'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { SceneCard } from './SceneCard';
import { ScenePipelineStrip } from './ScenePipelineStrip';
import { SceneDetailPanel } from './SceneDetailPanel';

// ── Helpers ───────────────────────────────────────────────────────────────────

function needsWork(s: Doc<'scenes'>): boolean {
  return s.status !== 'Queued' && s.status !== 'Generating' && s.status !== 'Done';
}

function blockageOrder(s: Doc<'scenes'>): number {
  if (s.startingImageStatus === 'ready' && s.approvalState !== 'approved') return 0;
  if (s.startingImageStatus === 'missing')  return 1;
  if (s.startingImageStatus === 'failed')   return 2;
  return 3;
}

// ── Collapsible section ───────────────────────────────────────────────────────

interface SectionProps {
  title:        string;
  count:        number;
  scenes:       Doc<'scenes'>[];
  selectedId:   Id<'scenes'> | null;
  defaultOpen?: boolean;
  accent?:      string;
  onSelect:     (scene: Doc<'scenes'>) => void;
}

function Section({ title, count, scenes, selectedId, defaultOpen = false, accent = '#6b7280', onSelect }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  if (count === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full mb-2"
      >
        {open
          ? <ChevronDown  size={12} className="text-neutral-400 flex-shrink-0" />
          : <ChevronRight size={12} className="text-neutral-400 flex-shrink-0" />
        }
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.12em] flex-shrink-0"
          style={{ color: accent }}
        >
          {title}
        </span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background: `${accent}18`, color: accent }}
        >
          {count}
        </span>
        <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
      </button>

      {open && (
        <div className="flex flex-col gap-2 mb-1">
          {scenes.map(scene => (
            <div
              key={scene._id}
              className="rounded-2xl transition-all"
              style={scene._id === selectedId ? { outline: '2px solid #7c3aed', outlineOffset: 1 } : undefined}
            >
              <SceneCard scene={scene} onOpenDrawer={onSelect} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="animate-pulse rounded-2xl p-3 flex gap-3"
          style={{ backgroundColor: '#f9fafb', border: '1px solid rgba(0,0,0,0.05)', height: 72 }}
        >
          <div className="w-10 rounded-xl flex-shrink-0" style={{ background: '#e5e7eb', aspectRatio: '9/16' }} />
          <div className="w-10 rounded-xl flex-shrink-0" style={{ background: '#e5e7eb', aspectRatio: '9/16' }} />
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <div className="h-3 rounded bg-neutral-200 w-3/4" />
            <div className="h-3 rounded bg-neutral-100 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ScenesFeaturePage() {
  const [modelFilter,    setModelFilter]    = useState<string>('all');
  const [selectedSceneId, setSelectedSceneId] = useState<Id<'scenes'> | null>(null);

  const allScenes = useQuery(api.scenes.list, {});
  const allModels = useQuery(api.models.getAll, {});

  // Always resolve selected scene from live query so it stays reactive
  const selectedScene = useMemo(
    () => selectedSceneId ? (allScenes?.find(s => s._id === selectedSceneId) ?? null) : null,
    [selectedSceneId, allScenes],
  );

  // Model-filtered slice
  const scenes = useMemo(() => {
    if (!allScenes) return [];
    if (modelFilter === 'all') return allScenes;
    return allScenes.filter(s => s.modelId === modelFilter);
  }, [allScenes, modelFilter]);

  // Section buckets
  const needsYou = useMemo(() =>
    scenes.filter(needsWork).sort((a, b) => {
      const diff = blockageOrder(a) - blockageOrder(b);
      return diff !== 0 ? diff : b.priorityScore - a.priorityScore;
    }),
    [scenes],
  );
  const readyToShip = useMemo(() => scenes.filter(s => s.status === 'Queued'),     [scenes]);
  const inFlight    = useMemo(() => scenes.filter(s => s.status === 'Generating'), [scenes]);
  const done        = useMemo(() =>
    scenes.filter(s => s.status === 'Done' || s.approvalState === 'rejected'),
    [scenes],
  );

  // Pipeline strip stats — unfiltered
  const strip = useMemo(() => {
    if (!allScenes) return null;
    const doneScenes = allScenes.filter(s => s.status === 'Done');
    return {
      blocked:         allScenes.filter(needsWork).length,
      ready:           allScenes.filter(s => s.status === 'Queued').length,
      live:            allScenes.filter(s => s.status === 'Generating').length,
      awaitingImage:   allScenes.filter(s =>
        s.startingImageStatus === 'missing' || s.startingImageStatus === 'failed'
      ).length,
      lastGeneratedAt: doneScenes.length > 0 ? Math.max(...doneScenes.map(s => s.createdAt)) : 0,
    };
  }, [allScenes]);

  const isLoading = allScenes === undefined;
  const isEmpty   = !isLoading && allScenes!.length === 0;

  const sectionProps = { selectedId: selectedSceneId, onSelect: (s: Doc<'scenes'>) => setSelectedSceneId(s._id) };

  return (
    <div className="p-5 flex flex-col gap-4">

      {/* Pipeline strip — full width */}
      {strip && (
        <ScenePipelineStrip
          {...strip}
          models={allModels ?? []}
          modelFilter={modelFilter}
          onModelFilterChange={setModelFilter}
        />
      )}

      {/* Loading */}
      {isLoading && <LoadingSkeleton />}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <Sparkles size={28} className="text-neutral-200" />
          <p className="text-sm font-semibold text-neutral-400">No scenes yet</p>
          <p className="text-xs text-neutral-300 text-center max-w-[220px]">
            Save a post from Intelligence to create your first scene
          </p>
        </div>
      )}

      {/* Two-column layout */}
      {!isLoading && !isEmpty && (
        <div className="flex gap-4 items-start">

          {/* Left — scene list (fixed width, scrollable) */}
          <div className="w-[380px] flex-shrink-0 flex flex-col gap-3">
            <Section title="Needs You"     count={needsYou.length}    scenes={needsYou}    defaultOpen accent="#7c3aed" {...sectionProps} />
            <Section title="Ready to Ship" count={readyToShip.length} scenes={readyToShip}             accent="#059669" {...sectionProps} />
            <Section title="In Flight"     count={inFlight.length}    scenes={inFlight}                accent="#2563eb" {...sectionProps} />
            <Section title="Done / Rejected" count={done.length}      scenes={done}                    accent="#9ca3af" {...sectionProps} />
          </div>

          {/* Right — detail panel (sticky so it stays in view while scrolling the list) */}
          <div className="flex-1 min-w-0 sticky top-5" style={{ minHeight: 480 }}>
            <SceneDetailPanel
              scene={selectedScene}
              allScenes={allScenes ?? []}
              allModels={allModels ?? []}
              onDeselect={() => setSelectedSceneId(null)}
            />
          </div>

        </div>
      )}
    </div>
  );
}
