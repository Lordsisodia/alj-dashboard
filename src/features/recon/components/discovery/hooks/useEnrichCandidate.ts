'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useEnrichCandidate(handle: string) {
  const [enriching, setEnriching] = useState(false);
  const [enriched, setEnriched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upsertCandidate = useMutation(api.candidates.upsert);

  async function handleEnrich() {
    setEnriching(true);
    setError(null);
    try {
      const res = await fetch('/api/recon/enrich-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const nn = <T,>(v: T | null | undefined): T | undefined => v ?? undefined;
      await upsertCandidate({
        handle: data.handle,
        displayName: data.displayName,
        niche: data.niche,
        status: data.status,
        source: 'pre_approved',
        ...(nn(data.followerCount) !== undefined && { followerCount: data.followerCount }),
        ...(nn(data.followsCount) !== undefined && { followsCount: data.followsCount }),
        ...(nn(data.postsCount) !== undefined && { postsCount: data.postsCount }),
        ...(nn(data.bio) !== undefined && { bio: data.bio }),
        ...(nn(data.avatarUrl) !== undefined && { avatarUrl: data.avatarUrl }),
        ...(nn(data.avgViews) !== undefined && { avgViews: data.avgViews }),
        ...(nn(data.outlierRatio) !== undefined && { outlierRatio: data.outlierRatio }),
        ...(nn(data.verified) !== undefined && { verified: data.verified }),
        ...(nn(data.instagramId) !== undefined && { instagramId: data.instagramId }),
      });

      if (data.relatedHandles?.length) {
        for (const h of data.relatedHandles.slice(0, 10)) {
          await upsertCandidate({
            handle: `@${h}`,
            displayName: h,
            status: 'pending',
            source: 'scraper',
            suggestedBy: data.handle,
          }).catch(() => {/* dedup - ignore */});
        }
      }

      setEnriched(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Enrich failed');
    } finally {
      setEnriching(false);
    }
  }

  return { enriching, enriched, error, handleEnrich };
}
