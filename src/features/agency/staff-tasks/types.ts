// ─── Types for the agency staff tasks feature ────────────────────────────────────

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'done';
export type TaskType = 'daily' | 'weekly' | 'custom';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskFrequency = 'once' | 'daily' | 'weekly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  employeeId: string;           // who this task is assigned to
  assignedById: string;          // manager/owner who created it
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  frequency: TaskFrequency;
  dueDate?: string;             // ISO date string
  dueTime?: string;             // HH:MM
  completedAt?: string;          // ISO timestamp when marked done
  createdAt: string;            // ISO timestamp
  labels?: string[];            // e.g. ['content', 'admin', 'urgent']
  effortMinutes?: number;        // estimated time
  mentions?: string[];           // employee IDs to notify/ping
  reminder?: string;             // '1-hour-before' | '1-day-before' | 'when-assigned' | 'none'
}

export interface TaskEvent {
  id: string;
  taskId: string;
  employeeId: string;
  type: 'task_created' | 'task_completed' | 'task_assigned' | 'task_updated';
  timestamp: string;
  details?: string;
}

// ─── View modes ────────────────────────────────────────────────────────────────

export type TaskView = 'board' | 'list' | 'table';

// ─── Board column config ───────────────────────────────────────────────────────

export const BOARD_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog',     label: 'Backlog',      color: '#6b7280' },
  { id: 'todo',        label: 'To Do',        color: '#3b82f6' },
  { id: 'in-progress', label: 'In Progress',  color: '#f59e0b' },
  { id: 'done',        label: 'Done',          color: '#10b981' },
];

export const TYPE_CONFIG: Record<TaskType, { label: string; color: string; bg: string }> = {
  daily:   { label: 'Daily',   color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  weekly:  { label: 'Weekly',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  custom:  { label: 'Custom',  color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  high:   { label: 'High',   color: '#ef4444' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low:    { label: 'Low',    color: '#10b981' },
};
