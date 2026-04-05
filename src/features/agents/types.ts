export type Tab = 'activity' | 'reports' | 'requests';
export type AgentStatus = 'running' | 'completed' | 'failed';
export type AgentType = 'Scraper' | 'Scheduler' | 'Analyst';
export type RequestStatus = 'Queued' | 'In Progress' | 'Delivered';
export type ReportCategory = 'Intelligence' | 'Recon' | 'Performance';

export interface AgentTask {
  id: number;
  agentName: string;
  type: AgentType;
  description: string;
  status: AgentStatus;
  startedAt: string;
  duration: string;
  progress: number;
  outputPreview: string;
}

export interface Report {
  id: number;
  title: string;
  insights: string[];
  generatedBy: string;
  date: string;
  category: ReportCategory;
}

export interface FeatureRequest {
  id: number;
  title: string;
  description: string;
  requestedBy: string;
  date: string;
  status: RequestStatus;
  eta: string;
}
