import type { Id } from '@/convex/_generated/dataModel';
import type { ActiveJob, HistoryJob } from './types';

// Static seed data rendered while Convex is loading or the table is empty.
// Call api.contentGen.seedJobs() once to replace these with persisted records.

const NOW = Date.now();

export const SEED_ACTIVE: ActiveJob[] = [
  {
    _id:       'seed-001' as Id<'contentGenJobs'>,
    name:      'FLUX-KL-ref01-gym-mirror-v1',
    modelName: 'Tyler',
    scene:     'Model in gym, mirror selfie angle, natural lighting, motivational energy',
    provider:  'Kling',
    status:    'Generating',
    etaSeconds: 142,
    progress:   63,
    createdAt:  NOW - 180_000,
  },
  {
    _id:       'seed-002' as Id<'contentGenJobs'>,
    name:      'FLUX-HF-ref02-beach-sunset-v1',
    modelName: 'Ren',
    scene:     'Beach at golden hour, candid walk along shoreline, soft bokeh background',
    provider:  'Higgsfield',
    status:    'Queued',
    etaSeconds: 310,
    createdAt:  NOW - 60_000,
  },
];

export const SEED_HISTORY: HistoryJob[] = [
  { _id: 'sh1' as Id<'contentGenJobs'>, name: 'FLUX-KL-ref01-gym-mirror-v0',     modelName: 'Tyler', provider: 'Kling',      outcome: 'Approved',       completedAt: NOW - 5_400_000,               durationSec: 187, thumbnailColor: '#d4a574' },
  { _id: 'sh2' as Id<'contentGenJobs'>, name: 'FLUX-HF-ref03-pool-day-v1',       modelName: 'Ella',  provider: 'Higgsfield', outcome: 'Pending Review', completedAt: NOW - 11_700_000,              durationSec: 224, thumbnailColor: '#7fb3d3' },
  { _id: 'sh3' as Id<'contentGenJobs'>, name: 'FLUX-KL-ref02-rooftop-night-v1',  modelName: 'Amam',  provider: 'Kling',      outcome: 'Rejected',       completedAt: NOW - 86_400_000 - 3_000_000, durationSec: 198, thumbnailColor: '#2c3e50' },
  { _id: 'sh4' as Id<'contentGenJobs'>, name: 'FLUX-HF-ref01-studio-closeup-v2', modelName: 'Tyler', provider: 'Higgsfield', outcome: 'Approved',       completedAt: NOW - 86_400_000 - 6_000_000, durationSec: 211, thumbnailColor: '#c0392b' },
];
