import type React from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import type { MappedCandidate } from '../data';

export interface DiscoveryActionsDeps {
  updateStatus: (args: { id: Id<'creatorCandidates'>; status: string }) => Promise<unknown>;
  deleteAndBlock: (args: { id: Id<'creatorCandidates'> }) => Promise<unknown>;
  upsertCandidate: (args: { handle: string; displayName: string; status: string; source: string; suggestedBy?: string }) => Promise<unknown>;
  setEnrichStatus: (args: { id: Id<'creatorCandidates'>; status: string }) => Promise<unknown>;
  blockedSet: Set<string>;
  idMap: Map<number, string>;
  setApprovedGlow: (fn: (n: number) => number) => void;
  setScrapingGlow: (fn: (n: number) => number) => void;
  setScrapedGlow: (fn: (n: number) => number) => void;
  setScrapingItems: React.Dispatch<React.SetStateAction<{
    handle: string;
    displayName: string;
    initials: string;
    startedAt: number;
  }[]>>;
}

export function useDiscoveryActions(deps: DiscoveryActionsDeps) {
  const { updateStatus, deleteAndBlock, upsertCandidate, setEnrichStatus,
    blockedSet, idMap, setApprovedGlow, setScrapingGlow, setScrapedGlow, setScrapingItems } = deps;

  async function handleApprove(c: MappedCandidate) {
    await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'approved' }).catch(console.error);
    setApprovedGlow(n => n + 1);
    if (!c.avatarUrl && !c.followersRaw) {
      await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error);
    }
  }

  async function handleReject(c: MappedCandidate) {
    await deleteAndBlock({ id: c._convexId as Id<'creatorCandidates'> }).catch(console.error);
  }

  function addScraping(c: MappedCandidate) {
    setScrapingGlow(n => n + 1);
    setScrapingItems(prev =>
      prev.some(i => i.handle === c.handle) ? prev : [
        ...prev,
        { handle: c.handle, displayName: c.displayName, initials: c.initials, startedAt: Date.now() },
      ],
    );
  }

  function removeScraping(handle: string) {
    setScrapingItems(prev => prev.filter(i => i.handle !== handle));
  }

  async function triggerScrape(c: MappedCandidate) {
    addScraping(c);
    try {
      const res = await fetch('/api/recon/enrich-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: c.handle }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.relatedHandles?.length) {
          const filtered = data.relatedHandles.filter((h: string) =>
            !blockedSet.has(`@${h.replace('@', '')}`.toLowerCase()),
          );
          await Promise.allSettled(
            filtered.slice(0, 10).map((h: string) =>
              upsertCandidate({
                handle: `@${h.replace('@', '')}`,
                displayName: h.replace('@', ''),
                status: 'pending',
                source: 'scraper',
                suggestedBy: c.handle,
              }).catch(() => {}),
            ),
          );
          setScrapedGlow(n => n + 1);
        }
      }
    } catch (err) {
      console.error('[triggerScrape]', err);
    } finally {
      removeScraping(c.handle);
    }
  }

  async function runDiscovery(setDiscovering: (v: boolean) => void) {
    setDiscovering(true);
    await new Promise<void>(r => setTimeout(r, 3000));
    setDiscovering(false);
  }

  return { handleApprove, handleReject, triggerScrape, addScraping, removeScraping, runDiscovery };
}
