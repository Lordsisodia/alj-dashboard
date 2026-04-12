// Types for the agency staff shift management system
// Light-themed adaptation from AD source for ISSO dashboard

export type ShiftStatus = 'not-started' | 'on-shift' | 'on-break' | 'finished';
export type EmployeeRole = 'partner' | 'owner' | 'manager' | 'va' | 'chatter' | 'editor';

export interface Employee {
  id: string;
  name: string;
  dept: string;
  role: EmployeeRole;
  telegramId?: string;
  connected: boolean;
  shiftStart: string; // "HH:MM" or "Always"
  shiftEnd: string;
  restDay: string;
  birthday?: string;
  lateCount: number;
  earlyCount: number;
  isOwnerPartner?: boolean;
  fanslyHandled?: string[];
  onlyfansHandled?: string[];
  allModels?: string[];
  secondaryRole?: string | null;
}

export interface ActiveShift {
  employeeId: string;
  clockInTime: Date;
  breakStartTime?: Date;
  breakEndTime?: Date;
  clockOutTime?: Date;
  status: ShiftStatus;
  lateMinutes?: number;
}

export interface ShiftEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'start' | 'break-start' | 'break-end' | 'finish' | 'late' | 'absent' | 'leave-request' | 'leave-approved' | 'leave-denied' | 'swap-request';
  timestamp: Date;
  details?: string;
  color: 'green' | 'yellow' | 'red' | 'teal';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  submittedAt: Date;
}

export interface LateEscalation {
  employeeId: string;
  lateMinutes: number;
  level: 'grace' | 'warning' | 'alert' | 'critical' | 'recurring';
  message: string;
  alexNotified: boolean;
}

export interface DayStatus {
  date: Date;
  status: 'complete' | 'on-shift' | 'scheduled' | 'rest' | 'absent' | 'late';
  clockIn?: Date;
  clockOut?: Date;
  breakDuration?: number;
  totalHours?: number;
  lateMinutes?: number;
}

export interface EmployeeSchedule {
  employeeId: string;
  days: (DayStatus | null)[];
}
