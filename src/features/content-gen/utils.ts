import type { ModelDoc, PanelState } from './types';

/**
 * Counts filled optional profile fields: niche, ofHandle, igHandle, bio.
 * Returns 0-4. Used to drive the completion bar and checklist.
 */
export function completionScore(m: Partial<ModelDoc | PanelState>): number {
  return [
    (m as PanelState).niche || (m as ModelDoc).niche,
    (m as PanelState).ofHandle?.trim() || (m as ModelDoc).ofHandle?.trim(),
    (m as PanelState).igHandle?.trim() || (m as ModelDoc).igHandle?.trim(),
    (m as PanelState).bio?.trim()      || (m as ModelDoc).bio?.trim(),
  ].filter(Boolean).length;
}

/** Returns 0-100 as a rounded integer */
export function completionPct(m: Partial<ModelDoc | PanelState>): number {
  return Math.round((completionScore(m) / 4) * 100);
}

/** Strips a leading @ from a handle string */
export function stripAt(handle: string): string {
  return handle.replace(/^@/, '');
}
