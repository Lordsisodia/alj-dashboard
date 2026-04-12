// ─── Seed data for agency staff tasks ─────────────────────────────────────────

import type { Task } from './types';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextWeekStr = nextWeek.toISOString().split('T')[0];
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

// ── Employee roster ─────────────────────────────────────────────────────────────
export const STAFF_ROSTER = [
  { id: 'yss_a',    name: 'Yssa',    dept: 'Social Media' },
  { id: 'mikeee',  name: 'Mikeee',  dept: 'Social Media' },
  { id: 'sofia',   name: 'Sofia',   dept: 'Chatters' },
  { id: 'kristine',name: 'Kristine', dept: 'Chatters' },
  { id: 'macy',    name: 'Macy',    dept: 'Chatters' },
  { id: 'dhene',   name: 'Dhene',   dept: 'Editing' },
  { id: 'jack',    name: 'Jack',    dept: 'Management' },
  { id: 'aria',    name: 'Aria',    dept: 'Management' },
  { id: 'alex',    name: 'Alex',    dept: 'Management' },
  { id: 'scott',   name: 'Scott',   dept: 'Management' },
] as const;

// ── Department mapping ─────────────────────────────────────────────────────────
export const DEPT_MAP: Record<string, string> = {
  yss_a: 'Social Media', mikeee: 'Social Media',
  sofia: 'Chatters', kristine: 'Chatters', macy: 'Chatters',
  dhene: 'Editing',
  jack: 'Management', aria: 'Management', alex: 'Management', scott: 'Management',
};

export function getDept(employeeId: string): string {
  return DEPT_MAP[employeeId] ?? 'Unknown';
}

// ── Avatar colours ──────────────────────────────────────────────────────────────
export const AVATAR_COLORS: Record<string, string> = {
  alex: '#ff0069', scott: '#833ab4',
  yss_a: '#10b981', mikeee: '#3b82f6',
  sofia: '#ff0069', kristine: '#ff0069', macy: '#ff0069',
  dhene: '#f59e0b',
  jack: '#3b82f6', aria: '#8b5cf6',
};

// ── Seed tasks ─────────────────────────────────────────────────────────────────
export const SEED_TASKS: Task[] = [
  // ── Yssa (Social Media) ──────────────────────────────────────────────────────
  {
    id: 't-001',
    title: 'Check PTP queue and approve/reject content',
    description: 'Review all pending submissions in the PTP queue and approve or reject each one.',
    employeeId: 'yss_a', assignedById: 'alex', status: 'done', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: yesterdayStr, dueTime: '10:30', completedAt: `${yesterdayStr}T10:28:00Z`, createdAt: `${yesterdayStr}T09:00:00Z`,
    mentions: ['alex', 'scott'], reminder: '1-hour-before',
  },
  {
    id: 't-002',
    title: 'Post scheduled content to IG',
    description: 'Post approved content to Instagram at optimal times.',
    employeeId: 'yss_a', assignedById: 'alex', status: 'todo', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: todayStr, dueTime: '18:00', createdAt: `${todayStr}T09:00:00Z`,
    mentions: ['mikeee'], reminder: 'when-assigned',
  },
  {
    id: 't-003',
    title: 'Compile weekly analytics report',
    description: 'Pull stats from all IG accounts and compile into weekly report.',
    employeeId: 'yss_a', assignedById: 'scott', status: 'in-progress', type: 'weekly', priority: 'medium', frequency: 'weekly',
    dueDate: nextWeekStr, createdAt: `${todayStr}T09:00:00Z`,
    mentions: ['alex', 'scott', 'jack'], reminder: '1-day-before',
  },
  {
    id: 't-004',
    title: 'Review Ella Mira engagement metrics',
    description: "Deep dive into Ella's latest reel performance.",
    employeeId: 'yss_a', assignedById: 'alex', status: 'backlog', type: 'custom', priority: 'low', frequency: 'once',
    dueDate: tomorrowStr, createdAt: `${todayStr}T10:00:00Z`,
  },

  // ── Mikeee (Social Media) ────────────────────────────────────────────────────
  {
    id: 't-005',
    title: "Schedule Ren's content for the week",
    description: "Use Buffer to queue up Ren's posts for the week.",
    employeeId: 'mikeee', assignedById: 'alex', status: 'done', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: yesterdayStr, dueTime: '11:00', completedAt: `${yesterdayStr}T10:55:00Z`, createdAt: `${yesterdayStr}T09:00:00Z`,
    mentions: ['yss_a', 'alex'], reminder: '1-hour-before',
  },
  {
    id: 't-006',
    title: "Draft captions for Kiroko",
    description: "Write 5 caption options for Kiroko's upcoming reel.",
    employeeId: 'mikeee', assignedById: 'scott', status: 'in-progress', type: 'custom', priority: 'medium', frequency: 'once',
    dueDate: todayStr, dueTime: '14:00', createdAt: `${todayStr}T09:00:00Z`,
    mentions: ['alex'], reminder: 'when-assigned',
  },
  {
    id: 't-007',
    title: "Audit Amam's Twitter engagement",
    description: 'Check mentions, DMs, and follower growth.',
    employeeId: 'mikeee', assignedById: 'alex', status: 'todo', type: 'weekly', priority: 'low', frequency: 'weekly',
    dueDate: nextWeekStr, createdAt: `${todayStr}T09:00:00Z`,
  },

  // ── Sofia (Chatters) ─────────────────────────────────────────────────────────
  {
    id: 't-008',
    title: 'Reply to all OF DMs before shift end',
    description: 'Priority DMs from fans — respond to all.',
    employeeId: 'sofia', assignedById: 'jack', status: 'in-progress', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: todayStr, dueTime: '22:00', createdAt: `${todayStr}T14:00:00Z`,
    mentions: ['jack', 'scott'], reminder: '1-hour-before',
  },
  {
    id: 't-009',
    title: 'Send "miss you" message to top fans',
    description: 'Personalized check-in to top 10 spenders on Fansly.',
    employeeId: 'sofia', assignedById: 'jack', status: 'todo', type: 'weekly', priority: 'medium', frequency: 'weekly',
    dueDate: nextWeekStr, createdAt: `${todayStr}T14:00:00Z`,
    mentions: ['kristine', 'macy'], reminder: '1-day-before',
  },
  {
    id: 't-010',
    title: 'Log chatter stats for Macy',
    description: "Fill in the shared sheet with today's DM count and revenue.",
    employeeId: 'sofia', assignedById: 'scott', status: 'todo', type: 'daily', priority: 'low', frequency: 'daily',
    dueDate: todayStr, dueTime: '21:30', createdAt: `${todayStr}T14:00:00Z`,
    mentions: ['macy', 'jack'], reminder: 'when-assigned',
  },

  // ── Kristine (Chatters) ────────────────────────────────────────────────────────
  {
    id: 't-011',
    title: "Process Ren's OF inbox",
    description: "Work through Ren's 47 unread OF messages.",
    employeeId: 'kristine', assignedById: 'jack', status: 'done', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: yesterdayStr, dueTime: '22:00', completedAt: `${yesterdayStr}T21:45:00Z`, createdAt: `${yesterdayStr}T14:00:00Z`,
    mentions: ['jack'], reminder: '1-hour-before',
  },
  {
    id: 't-012',
    title: "Post Yssa's approved reel",
    description: "Upload Yssa's reel to IG Stories.",
    employeeId: 'kristine', assignedById: 'alex', status: 'todo', type: 'daily', priority: 'medium', frequency: 'daily',
    dueDate: todayStr, dueTime: '17:00', createdAt: `${todayStr}T14:00:00Z`,
    mentions: ['yss_a', 'alex'], reminder: 'when-assigned',
  },

  // ── Macy (Chatters) ───────────────────────────────────────────────────────────
  {
    id: 't-013',
    title: 'Check OF DMs for Kiyomi',
    description: "Work through Kiyomi's OF inbox.",
    employeeId: 'macy', assignedById: 'jack', status: 'in-progress', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: todayStr, dueTime: '22:00', createdAt: `${todayStr}T14:00:00Z`,
    mentions: ['jack', 'scott'], reminder: '1-hour-before',
  },
  {
    id: 't-014',
    title: 'Write weekly fan engagement summary',
    description: 'Pull together a summary of fan activity for the week.',
    employeeId: 'macy', assignedById: 'scott', status: 'backlog', type: 'weekly', priority: 'low', frequency: 'weekly',
    dueDate: nextWeekStr, createdAt: `${todayStr}T14:00:00Z`,
    mentions: ['scott', 'alex'], reminder: '1-day-before',
  },

  // ── Dhene (Editing) ─────────────────────────────────────────────────────────────
  {
    id: 't-015',
    title: "Edit Ella Mira's Songkran reel",
    description: 'Cut and color-grade the Phuket clip. 12s max.',
    employeeId: 'dhene', assignedById: 'alex', status: 'in-progress', type: 'custom', priority: 'high', frequency: 'once',
    dueDate: todayStr, dueTime: '23:00', createdAt: `${yesterdayStr}T18:00:00Z`, effortMinutes: 90,
    mentions: ['alex', 'scott'], reminder: '1-hour-before',
  },
  {
    id: 't-016',
    title: "Export Ren's Instagram reel",
    description: 'Render and export at 1080x1920 for IG Reels.',
    employeeId: 'dhene', assignedById: 'alex', status: 'todo', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: todayStr, dueTime: '23:30', createdAt: `${todayStr}T18:00:00Z`, effortMinutes: 20,
    mentions: ['yss_a', 'mikeee'], reminder: 'when-assigned',
  },
  {
    id: 't-017',
    title: "Thumbnail for Amam's next post",
    description: 'Create a click-worthy thumbnail.',
    employeeId: 'dhene', assignedById: 'scott', status: 'backlog', type: 'custom', priority: 'medium', frequency: 'once',
    dueDate: tomorrowStr, createdAt: `${todayStr}T18:00:00Z`, effortMinutes: 15,
  },

  // ── Jack (Management) ─────────────────────────────────────────────────────────
  {
    id: 't-018',
    title: "Review chatters' daily stats",
    description: 'Check that all chatters have logged their shift stats.',
    employeeId: 'jack', assignedById: 'alex', status: 'todo', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: todayStr, dueTime: '14:30', createdAt: `${todayStr}T06:00:00Z`,
    mentions: ['sofia', 'kristine', 'macy'], reminder: '1-hour-before',
  },
  {
    id: 't-019',
    title: 'Onboard new chatter — schedule intro call',
    description: 'New chatter starting next week — set up intro call.',
    employeeId: 'jack', assignedById: 'alex', status: 'todo', type: 'custom', priority: 'medium', frequency: 'once',
    dueDate: tomorrowStr, createdAt: `${todayStr}T06:00:00Z`,
    mentions: ['alex', 'aria', 'scott'], reminder: '1-day-before',
  },

  // ── Aria (Management) ─────────────────────────────────────────────────────────
  {
    id: 't-020',
    title: 'Run weekly performance review',
    description: 'Compile chatter metrics and flag anyone below target.',
    employeeId: 'aria', assignedById: 'scott', status: 'in-progress', type: 'weekly', priority: 'high', frequency: 'weekly',
    dueDate: nextWeekStr, createdAt: `${todayStr}T22:00:00Z`,
    mentions: ['scott', 'jack', 'alex'], reminder: '1-day-before',
  },

  // ── Alex (Management) ─────────────────────────────────────────────────────────
  {
    id: 't-021',
    title: 'Approve all pending PTPs',
    description: 'Go through the PTP queue and approve/reject remaining items.',
    employeeId: 'alex', assignedById: 'scott', status: 'todo', type: 'daily', priority: 'high', frequency: 'daily',
    dueDate: todayStr, dueTime: '12:00', createdAt: `${todayStr}T06:00:00Z`,
    mentions: ['scott', 'jack'], reminder: '1-hour-before',
  },
  {
    id: 't-022',
    title: "Set next week's content schedule",
    description: 'Assign content briefs for all models next week.',
    employeeId: 'alex', assignedById: 'alex', status: 'todo', type: 'weekly', priority: 'high', frequency: 'weekly',
    dueDate: nextWeekStr, createdAt: `${todayStr}T06:00:00Z`,
    mentions: ['scott', 'yss_a', 'mikeee', 'dhene'], reminder: '1-day-before',
  },

  // ── Scott (Management) ─────────────────────────────────────────────────────────
  {
    id: 't-023',
    title: 'Review agency payroll for the week',
    description: 'Check hours logged and calculate payout.',
    employeeId: 'scott', assignedById: 'alex', status: 'in-progress', type: 'weekly', priority: 'high', frequency: 'weekly',
    dueDate: nextWeekStr, createdAt: `${todayStr}T06:00:00Z`,
    mentions: ['alex', 'jack', 'aria'], reminder: '1-day-before',
  },
  {
    id: 't-024',
    title: 'Update campaign briefs in Drive',
    description: 'Sync latest briefs to the shared Google Drive folder.',
    employeeId: 'scott', assignedById: 'scott', status: 'backlog', type: 'custom', priority: 'medium', frequency: 'once',
    dueDate: tomorrowStr, createdAt: `${todayStr}T06:00:00Z`,
    mentions: ['alex', 'yss_a', 'mikeee'], reminder: 'when-assigned',
  },
];
