import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import type { Id } from '@/convex/_generated/dataModel';
import type { MappedCandidate } from '../data';

type ColumnId = 'unapproved' | 'approved' | 'scraped';

export interface DndHandlersDeps {
  allMapped: MappedCandidate[];
  setActiveId: (id: string | null) => void;
  setOverColumn: (col: ColumnId | null) => void;
  updateStatus: (args: { id: Id<'creatorCandidates'>; status: string }) => Promise<unknown>;
  setEnrichStatus: (args: { id: Id<'creatorCandidates'>; status: string }) => Promise<unknown>;
  handleApprove: (c: MappedCandidate) => Promise<void>;
  triggerScrape: (c: MappedCandidate) => Promise<void>;
}

export function useDndHandlers(deps: DndHandlersDeps) {
  const { allMapped, setActiveId, setOverColumn, updateStatus, setEnrichStatus, handleApprove, triggerScrape } = deps;

  function onDragStart(e: DragStartEvent) { setActiveId(e.active.id as string); }
  function onDragOver(e: DragOverEvent)   { setOverColumn((e.over?.id as ColumnId) ?? null); }

  async function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    setOverColumn(null);
    const { active, over } = e;
    if (!over) return;
    const from = active.data.current?.column as ColumnId;
    const to   = over.id as ColumnId;
    if (from === to) return;
    const c = allMapped.find(c => c._convexId === active.id);
    if (!c) return;
    if (from === 'unapproved' && to === 'approved')                await handleApprove(c);
    else if (from === 'unapproved' && to === 'scraped')             { await handleApprove(c); triggerScrape(c); }
    else if (from === 'approved'   && to === 'unapproved')         await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'pending' }).catch(console.error);
    else if (from === 'approved'   && to === 'scraped')             triggerScrape(c);
    else if (from === 'scraped'    && to === 'unapproved')          {
      await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'pending' }).catch(console.error);
      await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error);
    } else if (from === 'scraped'  && to === 'approved')            await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error);
    else if (from === 'scraped'    && to === 'scraped')             triggerScrape(c);
  }

  return { onDragStart, onDragOver, onDragEnd };
}
