export type SceneStatus = 'Pending' | 'Queued' | 'Generating' | 'Done' | 'Rejected';
export type SceneProvider = 'FLUX' | 'Kling' | 'Higgsfield';

export interface Scene {
  _id: string;
  modelName: string;
  modelColor: string;
  referenceThumbColor: string; // video ref placeholder colour
  referenceImageColor: string; // model ref image placeholder colour
  sceneDescription: string;
  priorityScore: number;       // 0-100, higher = first in queue
  status: SceneStatus;
  provider: SceneProvider;
  date: number;                // unix ms - which day this scene belongs to
}

// ── Seed ──────────────────────────────────────────────────────────────────────

const DAY = (offset = 0) => Date.now() - offset * 86_400_000;

export const SEED_SCENES: Scene[] = [
  { _id: 's1', modelName: 'Tyler', modelColor: '#f97316', referenceThumbColor: '#fed7aa', referenceImageColor: '#fb923c', sceneDescription: 'Gym mirror selfie, golden hour, slow zoom, upbeat audio',       priorityScore: 94, status: 'Pending',    provider: 'Kling',      date: DAY(0) },
  { _id: 's2', modelName: 'Ren',   modelColor: '#14b8a6', referenceThumbColor: '#99f6e4', referenceImageColor: '#2dd4bf', sceneDescription: 'Beach sunset walk, handheld, cinematic grade, soft synth',    priorityScore: 87, status: 'Generating', provider: 'Higgsfield', date: DAY(0) },
  { _id: 's3', modelName: 'Ella',  modelColor: '#3b82f6', referenceThumbColor: '#bfdbfe', referenceImageColor: '#60a5fa', sceneDescription: 'Hotel balcony vlog, overcast, aesthetic tones, ASMR audio',    priorityScore: 76, status: 'Pending',    provider: 'FLUX',       date: DAY(0) },
  { _id: 's4', modelName: 'Amam',  modelColor: '#f59e0b', referenceThumbColor: '#fde68a', referenceImageColor: '#fbbf24', sceneDescription: 'Kitchen morning routine, natural light, trending sound',       priorityScore: 71, status: 'Queued',     provider: 'Kling',      date: DAY(0) },
  { _id: 's5', modelName: 'Tyler', modelColor: '#f97316', referenceThumbColor: '#fed7aa', referenceImageColor: '#fb923c', sceneDescription: 'Rooftop night shoot, neon, stabilised, bass-heavy mix',        priorityScore: 65, status: 'Pending',    provider: 'Higgsfield', date: DAY(0) },
  { _id: 's6', modelName: 'Ren',   modelColor: '#14b8a6', referenceThumbColor: '#99f6e4', referenceImageColor: '#2dd4bf', sceneDescription: 'Poolside unboxing, bright, product-focused, viral hook',       priorityScore: 52, status: 'Done',       provider: 'FLUX',       date: DAY(0) },
  { _id: 's7', modelName: 'Ella',  modelColor: '#3b82f6', referenceThumbColor: '#bfdbfe', referenceImageColor: '#60a5fa', sceneDescription: 'Pilates studio, clean whites, motivational VO, reel format',  priorityScore: 88, status: 'Done',       provider: 'Kling',      date: DAY(1) },
  { _id: 's8', modelName: 'Amam',  modelColor: '#f59e0b', referenceThumbColor: '#fde68a', referenceImageColor: '#fbbf24', sceneDescription: 'Airport transit fit check, candid style, lo-fi beat',         priorityScore: 73, status: 'Done',       provider: 'Higgsfield', date: DAY(1) },
  { _id: 's9', modelName: 'Tyler', modelColor: '#f97316', referenceThumbColor: '#fed7aa', referenceImageColor: '#fb923c', sceneDescription: 'Cosy café morning, steam, journaling aesthetic, trending audio',priorityScore: 61, status: 'Rejected',   provider: 'FLUX',       date: DAY(1) },
];

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
  Rejected:   { bg: '#fee2e2', text: '#dc2626' },
};
