export type Tab = 'activity' | 'reports' | 'requests';
export type AgentStatus = 'running' | 'completed' | 'failed';
export type AgentType = 'Scraper' | 'Scheduler' | 'Analyst';
export type RequestStatus = 'Queued' | 'In Progress' | 'Delivered';
export type ReportCategory = 'Intelligence' | 'Recon' | 'Performance';
export type Priority = 'Low' | 'Medium' | 'High';

export interface AgentTask {
  id: string;
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
  id: string;
  title: string;
  insights: string[];
  generatedBy: string;
  generatedAt: number;
  category: ReportCategory;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  date: string;
  status: RequestStatus;
  eta: string;
  priority: Priority;
}
