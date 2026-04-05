export type Tab = 'roster' | 'onboarding' | 'performance';
export type PipelineStep = 'Draft' | 'Sent' | 'Filming' | 'Clips Received' | 'Editing' | 'Complete';

export interface ModelData {
  id: string;
  name: string;
  niche: string;
  handle: string;
  color: string;
  initials: string;
  status: 'Active' | 'Paused';
  pipelineStep: PipelineStep;
  reelsInPipeline: number;
}
