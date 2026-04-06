'use client';
import { useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useEnrich() {
  const [enrichingSet, setEnrichingSet] = useState<Set<string>>(new Set());
  const upsertEnriched  = useMutation(api.trackedAccounts.upsertEnriched);
  const setEnrichStatus = useMutation(api.trackedAccounts.setEnrichStatus);

  const enrich = useCallback(async (handle: string) => {
    if (enrichingSet.has(handle)) return;
    setEnrichingSet(s => new Set(s).add(handle));

    try {
      await setEnrichStatus({ handle, status: 'enriching' });

      const res = await fetch('/api/enrich-profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ handle }),
      });

      if (!res.ok) {
        await setEnrichStatus({ handle, status: 'error' });
        return;
      }

      const data = await res.json();
      if (data.error) {
        await setEnrichStatus({ handle, status: 'error' });
        return;
      }

      await upsertEnriched({
        handle:                data.handle,
        followerCount:         data.followerCount,
        postsCount:            data.postsCount            ?? undefined,
        bio:                   data.bio                   ?? undefined,
        avatarUrl:             data.avatarUrl             ?? undefined,
        displayName:           data.displayName,
        verified:              data.verified,
        followsCount:          data.followsCount          ?? undefined,
        externalUrl:           data.externalUrl           ?? undefined,
        isBusinessAccount:     data.isBusinessAccount     ?? undefined,
        isProfessionalAccount: data.isProfessionalAccount ?? undefined,
        businessCategoryName:  data.businessCategoryName  ?? undefined,
        businessEmail:         data.businessEmail         ?? undefined,
        isPrivate:             data.isPrivate             ?? undefined,
        igtvVideoCount:        data.igtvVideoCount        ?? undefined,
        instagramId:           data.instagramId           ?? undefined,
      });
    } catch {
      await setEnrichStatus({ handle, status: 'error' });
    } finally {
      setEnrichingSet(s => { const n = new Set(s); n.delete(handle); return n; });
    }
  }, [enrichingSet, upsertEnriched, setEnrichStatus]);

  return { enrich, isEnriching: (handle: string) => enrichingSet.has(handle) };
}
