import { useState } from 'react';
import type { Competitor } from '../types';
import type { StatusView } from '../components/creators/tableUtils';

export function useCreatorsTab() {
  const [showFavorites, setShowFavorites]         = useState(false);
  const [creatorsStatusView, setCreatorsStatusView] = useState<StatusView>('all');
  const [creatorsStatusCounts, setCreatorsStatusCounts] = useState<Record<StatusView, number>>({ all: 0, raw: 0, enriched: 0, scraped: 0, failed: 0 });
  const [selectedCreator, setSelectedCreator]       = useState<Competitor | null>(null);

  return {
    showFavorites,
    setShowFavorites,
    creatorsStatusView,
    setCreatorsStatusView,
    creatorsStatusCounts,
    setCreatorsStatusCounts,
    selectedCreator,
    setSelectedCreator,
  };
}
