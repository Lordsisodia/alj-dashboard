'use client';

import { useState } from 'react';
import { COMPETITORS } from '../../../constants';
import type { Competitor } from '../../../types';
import { DEFAULT_FILTERS, type CreatorFilters } from '../filters/CreatorsFilterBar';
import { DEFAULT_COL_VISIBILITY, type ColVisibility } from '../tableUtils';

export interface TableState {
  creators:    Competitor[];
  setCreators:  React.Dispatch<React.SetStateAction<Competitor[]>>;
  filters:     CreatorFilters;
  setFilters:   React.Dispatch<React.SetStateAction<CreatorFilters>>;
  selected:     Set<number>;
  setSelected:  React.Dispatch<React.SetStateAction<Set<number>>>;
  viewMode:     'list' | 'grid';
  setViewMode:  React.Dispatch<React.SetStateAction<'list' | 'grid'>>;
  colVis:       ColVisibility;
  setColVis:    React.Dispatch<React.SetStateAction<ColVisibility>>;
  handleColVisChange: (v: ColVisibility) => void;
}

export function useTableState(extraCreators: Competitor[]): TableState {
  const [creators, setCreators] = useState<Competitor[]>([...extraCreators, ...COMPETITORS]);
  const [filters,   setFilters]  = useState<CreatorFilters>(DEFAULT_FILTERS);
  const [selected,  setSelected]  = useState<Set<number>>(new Set());
  const [viewMode,  setViewMode] = useState<'list' | 'grid'>('list');
  const [colVis,    setColVis]   = useState<ColVisibility>(() => {
    if (typeof window === 'undefined') return DEFAULT_COL_VISIBILITY;
    try {
      const saved = localStorage.getItem('recon-col-vis');
      return saved ? { ...DEFAULT_COL_VISIBILITY, ...JSON.parse(saved) } : DEFAULT_COL_VISIBILITY;
    } catch { return DEFAULT_COL_VISIBILITY; }
  });

  function handleColVisChange(v: ColVisibility) {
    setColVis(v);
    try { localStorage.setItem('recon-col-vis', JSON.stringify(v)); } catch {}
  }

  return { creators, setCreators, filters, setFilters, selected, setSelected, viewMode, setViewMode, colVis, setColVis, handleColVisChange };
}
