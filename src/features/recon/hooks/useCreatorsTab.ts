import { useState } from 'react';
import type { Competitor } from '../types';
import type { StatusView, ColVisibility } from '../components/table/tableUtils';
import { DEFAULT_COL_VISIBILITY } from '../components/table/tableUtils';

export function useCreatorsTab() {
  const [showFavorites, setShowFavorites]               = useState(false);
  const [creatorsStatusView, setCreatorsStatusView]     = useState<StatusView>('all');
  const [creatorsStatusCounts, setCreatorsStatusCounts] = useState<Record<StatusView, number>>({ all: 0, raw: 0, enriched: 0, scraped: 0, failed: 0 });
  const [selectedCreator, setSelectedCreator]           = useState<Competitor | null>(null);
  const [viewMode, setViewMode]                         = useState<'list' | 'grid'>('list');
  const [colVis, setColVis]                             = useState<ColVisibility>(() => {
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

  return {
    showFavorites,        setShowFavorites,
    creatorsStatusView,   setCreatorsStatusView,
    creatorsStatusCounts, setCreatorsStatusCounts,
    selectedCreator,      setSelectedCreator,
    viewMode,             setViewMode,
    colVis,               handleColVisChange,
  };
}
