export type Tab = 'roster' | 'onboarding' | 'performance';
export type DetailTab = 'overview' | 'pipeline' | 'content' | 'analytics' | 'references' | 'settings';
export type PipelineStep = 'Draft' | 'Sent' | 'Filming' | 'Clips Received' | 'Editing' | 'Complete';
export type OnboardingStep = { label: string; done: boolean };

export interface Reel {
  id: string;
  title: string;
  step: PipelineStep;
  gradient: string;
  createdAt: string;
  provider?: 'FLUX' | 'Kling' | 'Higgsfield';
  jobStatus?: 'Queued' | 'Generating' | 'Done' | 'Failed';
}

export interface ModelData {
  id: string;
  name: string;
  niche: string;
  handle: string;       // OF handle
  igHandle?: string;    // IG handle
  color: string;
  initials: string;
  status: 'Active' | 'Paused';
  pipelineStep: PipelineStep;
  reelsInPipeline: number;
  mrr?: number;         // monthly recurring revenue
  subscribers?: number;
  manager?: string;
  onboardingSteps?: OnboardingStep[];
  reels?: Reel[];
  bio?: string;
  onboardingPhase: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  contentReceived: number;
  contractSignedAt?: string;
}

export interface OnboardingPhaseStep {
  label: string;
  done: boolean;
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export const ONBOARDING_PHASES: Record<number, { label: string; steps: string[] }> = {
  1: { label: 'Screening', steps: ['Application reviewed', 'Video call completed', 'Content verified'] },
  2: { label: 'Contract', steps: ['Contract signed', 'ID verified', 'Age verification processed'] },
  3: { label: 'Account Setup', steps: ['OF profile optimised', 'Sub price set', 'Free trial link created', 'Social profiles linked'] },
  4: { label: 'AI Content', steps: ['Face references uploaded (5+)', 'Soul ID trained (Higgsfield)', 'First AI batch generated', 'Batch reviewed & approved', 'Vault loaded (10+ PPV pieces)'] },
  5: { label: 'Pre-Launch', steps: ['First 2 weeks scheduled', 'Welcome sequence set up', 'Chatter briefed'] },
  6: { label: 'Live', steps: ['Account launched', 'First PPV blast sent', 'Traffic campaigns running'] },
  7: { label: 'Active', steps: ['Week 1 performance reviewed', 'Strategy call complete'] },
};
