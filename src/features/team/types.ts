export type Role = 'Admin' | 'VA' | 'Editor' | 'Model';
export type Status = 'Online' | 'Away' | 'Offline';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  accounts: string[];
  tasks: number;
  initials: string;
  avatarColor: string;
}

export interface Contact {
  name: string;
  handle: string;
  initials: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timeAgo: string;
  avatarColor: string;
  initials: string;
}

export interface PermissionRow {
  member: string;
  initials: string;
  avatarColor: string;
  schedule: boolean;
  upload: boolean;
  approve: boolean;
  analytics: boolean;
  manageTeam: boolean;
  settings: boolean;
}
