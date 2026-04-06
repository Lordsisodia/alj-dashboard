export interface DashboardStat {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export interface ModelSummary {
  name: string;
  color: string;
  clipsToday: number;
  pending: number;
  approved: number;
}

export type ActivityType = 'generated' | 'approved' | 'rejected' | 'queued' | 'failed';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  modelName: string;
  modelColor: string;
  scene: string;
  provider: string;
  timestamp: number;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const ago = (minutes: number) => Date.now() - minutes * 60_000;

export const SEED_MODEL_SUMMARIES: ModelSummary[] = [
  { name: 'Tyler', color: '#f97316', clipsToday: 4, pending: 1, approved: 3 },
  { name: 'Ren',   color: '#14b8a6', clipsToday: 3, pending: 0, approved: 3 },
  { name: 'Ella',  color: '#3b82f6', clipsToday: 2, pending: 2, approved: 0 },
  { name: 'Amam',  color: '#f59e0b', clipsToday: 3, pending: 1, approved: 2 },
];

export const SEED_ACTIVITY: ActivityEvent[] = [
  { id: 'a1', type: 'approved',   modelName: 'Ren',   modelColor: '#14b8a6', scene: 'Beach sunset walk',        provider: 'Higgsfield', timestamp: ago(4)  },
  { id: 'a2', type: 'generated',  modelName: 'Tyler', modelColor: '#f97316', scene: 'Gym mirror selfie',        provider: 'Kling',      timestamp: ago(12) },
  { id: 'a3', type: 'queued',     modelName: 'Amam',  modelColor: '#f59e0b', scene: 'Kitchen morning routine',  provider: 'Kling',      timestamp: ago(18) },
  { id: 'a4', type: 'approved',   modelName: 'Tyler', modelColor: '#f97316', scene: 'Rooftop night shoot',      provider: 'Higgsfield', timestamp: ago(35) },
  { id: 'a5', type: 'generated',  modelName: 'Ella',  modelColor: '#3b82f6', scene: 'Hotel balcony vlog',       provider: 'FLUX',       timestamp: ago(52) },
  { id: 'a6', type: 'rejected',   modelName: 'Tyler', modelColor: '#f97316', scene: 'Cosy café morning',        provider: 'FLUX',       timestamp: ago(90) },
  { id: 'a7', type: 'generated',  modelName: 'Amam',  modelColor: '#f59e0b', scene: 'Airport transit fit check',provider: 'Higgsfield', timestamp: ago(110)},
  { id: 'a8', type: 'approved',   modelName: 'Ren',   modelColor: '#14b8a6', scene: 'Poolside unboxing',        provider: 'FLUX',       timestamp: ago(140)},
];
