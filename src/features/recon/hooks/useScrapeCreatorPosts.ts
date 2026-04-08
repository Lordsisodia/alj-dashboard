'use client';
import { useState, useCallback } from 'react';

interface ScrapeBatch {
  id:        string;
  handles:   string[];
  startedAt: number;
}

export function useScrapeCreatorPosts() {
  const [scrapingSet, setScrapingSet]     = useState<Set<string>>(new Set());
  const [activeBatches, setActiveBatches] = useState<ScrapeBatch[]>([]);

  const scrape = useCallback(async (handle: string) => {
    if (scrapingSet.has(handle)) return;
    setScrapingSet(s => new Set(s).add(handle));
    try {
      const res = await fetch('/api/recon/scrape-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      });
      if (!res.ok) {
        console.error('[scrape-posts] failed', await res.text());
      }
    } catch (err) {
      console.error('[scrape-posts]', err);
    } finally {
      setScrapingSet(s => { const n = new Set(s); n.delete(handle); return n; });
    }
  }, [scrapingSet]);

  const scrapeMany = useCallback(async (handles: string[]) => {
    if (handles.length === 0) return;
    const batch: ScrapeBatch = {
      id:        `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      handles,
      startedAt: Date.now(),
    };
    setActiveBatches(prev => [...prev, batch]);
    // Note: do NOT auto-remove the batch when promises settle.
    // The user dismisses via the panel after seeing the results.
    await Promise.allSettled(handles.map(h => scrape(h)));
  }, [scrape]);

  const dismissBatch = useCallback((id: string) => {
    setActiveBatches(prev => prev.filter(b => b.id !== id));
  }, []);

  return {
    scrape,
    scrapeMany,
    isScraping: (handle: string) => scrapingSet.has(handle),
    activeBatches,
    dismissBatch,
  };
}
