export type SceneStatus   = 'Pending' | 'Queued' | 'Generating' | 'Done';
export type SceneProvider = 'FLUX' | 'Kling' | 'Higgsfield';

// NOTE: SEED_SCENES removed — data now lives in Convex `scenes` table.
// Scene interface removed — use Doc<"scenes"> from @/convex/_generated/dataModel directly.

export const PROVIDER_COLORS: Record<SceneProvider, { bg: string; text: string }> = {
  FLUX:       { bg: '#fef3c7', text: '#b45309' },
  Kling:      { bg: '#ede9fe', text: '#7c3aed' },
  Higgsfield: { bg: '#d1fae5', text: '#047857' },
};

export const STATUS_COLORS: Record<SceneStatus, { bg: string; text: string }> = {
  Pending:    { bg: '#f3f4f6', text: '#6b7280' },
  Queued:     { bg: '#fef3c7', text: '#b45309' },
  Generating: { bg: '#dbeafe', text: '#1d4ed8' },
  Done:       { bg: '#d1fae5', text: '#047857' },
};
