/**
 * Portfolio Domain - Portfolio Data Hook
 */

import { useMemo } from 'react';
import { allClients } from '../data';
import { calculatePortfolioStats } from '../lib';
import { getVisibleClients, getFeaturedClients } from '../selectors';

export function usePortfolioData() {
  const clients = useMemo(() => getVisibleClients(allClients), []);

  const stats = useMemo(() => calculatePortfolioStats(), []);

  const featured = useMemo(() => getFeaturedClients(clients), [clients]);

  return {
    clients,
    stats,
    featured,
  };
}
