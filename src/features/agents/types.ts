export type Tab = 'activity' | 'reports' | 'requests' | 'overview' | 'orgchart' | 'log' | 'routines' | 'issues' | 'inbox' | 'costs';
export type AgentStatus = 'running' | 'completed' | 'failed';
export type AgentType = 'Scraper' | 'Scheduler' | 'Analyst';
export type RequestStatus = 'Queued' | 'In Progress' | 'Delivered';
export type ReportCategory = 'Intelligence' | 'Recon' | 'Performance';
export type Priority = 'Low' | 'Medium' | 'High';
export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'blocked' | 'done';
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';
export type RoutineStatus = 'active' | 'paused' | 'archived';

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

export interface Routine {
  id: string;
  title: string;
  description?: string;
  assigneeAgent?: string;
  status: RoutineStatus;
  concurrencyPolicy: string;
  catchUpPolicy: string;
  lastRunAt?: number;
  lastRunStatus?: string;
  createdAt: number;
}

export interface Issue {
  id: string;
  identifier?: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeAgent?: string;
  updatedAt: number;
  createdAt: number;
}

export interface CostRow {
  id: string;
  agentName: string;
  provider: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costCents: number;
  recordedAt: number;
}

export interface ActivityEvent {
  id: string;
  actorName: string;
  action: string;
  target: string;
  targetId?: string;
  timestamp: number;
}

export interface OverviewStats {
  activeAgents: number;
  tasksInProgress: number;
  pendingApprovals: number;
  monthSpend: number;
  failedRuns: number;
  completedRuns: number;
  totalRuns: number;
}
