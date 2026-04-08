'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Candidate, CandidateStatus } from '../../../types';

export function useDetailActions(candidate: Candidate, onDecision: (id: number, status: CandidateStatus) => void) {
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveCandidate = useMutation(api.trackedAccounts.approveCandidate);

  async function handleApprove() {
    setApproving(true);
    try {
      await approveCandidate({
        handle: candidate.handle,
        displayName: candidate.displayName,
        niche: candidate.niche,
        avatarColor: candidate.avatarColor,
        followerCount: candidate.followersRaw,
        avgEngagementRate: parseFloat(candidate.engagementRate) / 100 || 0,
      });
      onDecision(candidate.id, 'approved');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Approve failed');
    } finally {
      setApproving(false);
    }
  }

  return { approving, error, handleApprove };
}
