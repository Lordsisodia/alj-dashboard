import type { Enhancement, ClipData, ClipStatus } from './types';

export const ENHANCEMENTS: Enhancement[] = [
  { id: 'stabilize', label: 'Stabilize', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { id: 'color',     label: 'Color',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { id: 'denoise',   label: 'Denoise',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
  { id: 'sharpen',   label: 'Sharpen',   color: '#833ab4', bg: 'rgba(131,58,180,0.1)' },
  { id: 'upscale',   label: 'Upscale',   color: '#ff0069', bg: 'rgba(255,0,105,0.1)'  },
];

export const ENHANCEMENT_MAP: Record<string, Enhancement> = Object.fromEntries(
  ENHANCEMENTS.map((e) => [e.id, e])
);

export const SEED_CLIPS: ClipData[] = [
  {
    id: 'c1',
    filename: 'tyler_gym_easter_01.mp4',
    size: '124 MB',
    duration: '0:32',
    status: 'In Pipeline',
    gradient: 'linear-gradient(135deg, #ff0069 0%, #833ab4 100%)',
    enhancements: ['stabilize', 'color', 'sharpen'],
  },
  {
    id: 'c2',
    filename: 'ren_mirror_flex.mp4',
    size: '87 MB',
    duration: '0:18',
    status: 'Enhanced',
    gradient: 'linear-gradient(135deg, #833ab4 0%, #06b6d4 100%)',
    enhancements: ['color', 'denoise', 'upscale'],
  },
  {
    id: 'c3',
    filename: 'ella_bunny_ears.mp4',
    size: '210 MB',
    duration: '0:45',
    status: 'In Pipeline',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
    enhancements: ['stabilize', 'color', 'denoise', 'sharpen'],
  },
  {
    id: 'c4',
    filename: 'amam_songkran_raw.mp4',
    size: '356 MB',
    duration: '1:02',
    status: 'Raw',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ff0069 100%)',
    enhancements: [],
  },
  {
    id: 'c5',
    filename: 'tyler_easter_gym_02.mp4',
    size: '98 MB',
    duration: '0:28',
    status: 'Enhanced',
    gradient: 'linear-gradient(135deg, #ff0069 0%, #f59e0b 100%)',
    enhancements: ['stabilize', 'sharpen'],
  },
  {
    id: 'c6',
    filename: 'ren_diet_before_after.mp4',
    size: '143 MB',
    duration: '0:39',
    status: 'Raw',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #833ab4 100%)',
    enhancements: [],
  },
];

export const STATUS_STYLE: Record<ClipStatus, { color: string; bg: string }> = {
  Raw:           { color: '#737373', bg: 'rgba(0,0,0,0.06)'      },
  Enhanced:      { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
  'In Pipeline': { color: '#ff0069', bg: 'rgba(255,0,105,0.1)'   },
};

export const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #ff0069 0%, #833ab4 100%)',
  'linear-gradient(135deg, #833ab4 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ff0069 100%)',
  'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
];
