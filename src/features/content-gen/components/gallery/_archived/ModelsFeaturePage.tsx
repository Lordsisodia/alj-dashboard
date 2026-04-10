// ARCHIVED 2026-04-10 — absorbed into Gallery page. Kept for reference; do not delete.
// Original location: src/features/content-gen/components/ModelsFeaturePage.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { Plus } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from './EmptyState';
import { ModelGrid } from './ModelGrid';
import { ModelPanel } from './ModelPanel';
import { FILTER_CHIPS } from '../../constants';
import type { ModelDoc, PanelState } from '../../types';

export default function ContentGenModelsFeaturePage() {
  const models     = useQuery(api.models.list, {}) as ModelDoc[] | undefined;
  const ideaCounts = useQuery(api.models.ideaCountByModel, {}) as Record<string, number> | undefined;
  const clipCounts = useQuery(api.models.clipCountByModel, {}) as Record<string, number> | undefined;

  const createModel = useMutation(api.models.create);
  const updateModel = useMutation(api.models.update);
  const removeModel = useMutation(api.models.remove);
  const seedModels  = useMutation(api.models.seedModels);

  const [activeFilter, setActiveFilter] = useState('all');
  const [panelOpen, setPanelOpen]       = useState(false);
  const [editingModel, setEditingModel] = useState<ModelDoc | undefined>();

  function openAdd()          { setEditingModel(undefined); setPanelOpen(true); }
  function openEdit(m: ModelDoc) { setEditingModel(m); setPanelOpen(true); }
  function closePanel()       { setPanelOpen(false); setEditingModel(undefined); }

  async function handleSave(data: PanelState) {
    if (editingModel) {
      await updateModel({ id: editingModel._id, ...data });
    } else {
      await createModel(data);
    }
    closePanel();
  }

  async function handleDelete() {
    if (editingModel) {
      await removeModel({ id: editingModel._id });
      closePanel();
    }
  }

  const isLoading   = models === undefined;
  const activeCount = models?.filter(m => m.active).length ?? 0;

  const filtered = (() => {
    if (!models) return [];
    if (activeFilter === 'active') return models.filter(m => m.active);
    if (activeFilter === 'draft')  return models.filter(m => !m.active);
    return models;
  })();

  return (
    <>
      <div className="p-5">
        <div className="flex items-center gap-1 mb-4">
          {FILTER_CHIPS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                activeFilter === f.id
                  ? 'text-neutral-900 bg-black/[0.07]'
                  : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]'
              )}
            >
              {f.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            <Plus size={12} /> Add Model
          </button>
        </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : models!.length === 0 ? (
            <EmptyState onAdd={openAdd} onSeed={() => seedModels({})} />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
              <p className="text-sm font-medium text-neutral-400">No {activeFilter} models</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-700"
              >
                Show all
              </button>
            </div>
          ) : (
            <ModelGrid
              models={filtered}
              ideaCounts={ideaCounts ?? {}}
              clipCounts={clipCounts ?? {}}
              onEdit={openEdit}
              onAdd={openAdd}
            />
          )}
        </div>

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/25 z-40"
              onClick={closePanel}
            />
            <ModelPanel
              key="panel"
              initial={editingModel}
              onClose={closePanel}
              onSave={handleSave}
              onDelete={editingModel ? handleDelete : undefined}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
