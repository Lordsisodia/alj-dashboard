'use client';

import type { Competitor } from '../../types';

interface TableActionsOptions {
  selected:    Set<number>;
  setSelected: React.Dispatch<React.SetStateAction<Set<number>>>;
  creators:    Competitor[];
  setCreators: React.Dispatch<React.SetStateAction<Competitor[]>>;
  filtered:    Competitor[];
  enrich:      (handle: string) => void;
  isEnriching: (handle: string) => boolean;
}

export function useTableActions({ selected, setSelected, creators, setCreators, filtered, enrich, isEnriching }: TableActionsOptions) {
  function toggleSelect(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  function toggleFavorite(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setCreators(prev => prev.map(c => c.id === id ? { ...c, favorited: !c.favorited } : c));
  }

  function toggleStatus(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setCreators(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
  }

  const allFilteredIds = filtered.map(c => c.id);
  const allSelected    = allFilteredIds.length > 0 && allFilteredIds.every(id => selected.has(id));
  const someSelected   = allFilteredIds.some(id => selected.has(id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(prev => { const s = new Set(prev); allFilteredIds.forEach(id => s.delete(id)); return s; });
    } else {
      setSelected(prev => { const s = new Set(prev); allFilteredIds.forEach(id => s.add(id)); return s; });
    }
  }

  function bulkEnrich() {
    filtered.filter(c => selected.has(c.id)).forEach(c => enrich(c.handle));
  }

  function bulkFavorite() {
    setCreators(prev => prev.map(c => selected.has(c.id) ? { ...c, favorited: true } : c));
  }

  function bulkUnfavorite() {
    setCreators(prev => prev.map(c => selected.has(c.id) ? { ...c, favorited: false } : c));
  }

  const enrichingCount = filtered.filter(c => selected.has(c.id) && isEnriching(c.handle)).length;

  return {
    toggleSelect,
    toggleFavorite,
    toggleStatus,
    toggleSelectAll,
    bulkEnrich,
    bulkFavorite,
    bulkUnfavorite,
    enrichingCount,
    allSelected,
    someSelected,
  };
}
