import type { PipelineStep, ModelData } from './types';

export const PIPELINE_STEPS: PipelineStep[] = [
  'Draft', 'Sent', 'Filming', 'Clips Received', 'Editing', 'Complete',
];

export const MODELS: ModelData[] = [
  {
    id: 'm1',
    name: 'Tyler',
    niche: 'Gay Bear Fitness',
    handle: '@onlytylerrex',
    color: '#ff0069',
    initials: 'TY',
    status: 'Active',
    pipelineStep: 'Editing',
    reelsInPipeline: 3,
  },
  {
    id: 'm2',
    name: 'Ren',
    niche: 'ABG Fitness',
    handle: '@rhinxrenx',
    color: '#833ab4',
    initials: 'RN',
    status: 'Active',
    pipelineStep: 'Filming',
    reelsInPipeline: 2,
  },
  {
    id: 'm3',
    name: 'Ella',
    niche: 'Lifestyle GFE',
    handle: '@ellamira',
    color: '#22c55e',
    initials: 'EL',
    status: 'Active',
    pipelineStep: 'Complete',
    reelsInPipeline: 5,
  },
  {
    id: 'm4',
    name: 'Amam',
    niche: 'GFE',
    handle: '@abg.ricebunny',
    color: '#f59e0b',
    initials: 'AM',
    status: 'Paused',
    pipelineStep: 'Clips Received',
    reelsInPipeline: 1,
  },
];

export const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #ff0069 0%, #833ab4 100%)',
  'linear-gradient(135deg, #833ab4 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ff0069 100%)',
  'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
];
