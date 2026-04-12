// Seed data for agency staff shift management
import type { Employee } from './types';

export const EMPLOYEES: Employee[] = [
  {
    id: 'alex',
    name: 'Alex',
    dept: 'Management',
    role: 'partner',
    telegramId: '6121960560',
    connected: true,
    shiftStart: 'Always',
    shiftEnd: '',
    restDay: 'Always',
    birthday: '26/04/2004',
    lateCount: 0,
    earlyCount: 0,
    isOwnerPartner: true,
  },
  {
    id: 'scott',
    name: 'Scott',
    dept: 'Management',
    role: 'partner',
    telegramId: '5119523752',
    connected: true,
    shiftStart: 'Always',
    shiftEnd: '',
    restDay: 'Always',
    lateCount: 0,
    earlyCount: 0,
    isOwnerPartner: true,
  },
  {
    id: 'yss_a',
    name: 'Yssa',
    dept: 'Social Media / VAs',
    role: 'va',
    telegramId: '5096063807',
    connected: true,
    shiftStart: '10:00',
    shiftEnd: '18:00',
    restDay: 'Wednesday',
    lateCount: 1,
    earlyCount: 0,
  },
  {
    id: 'mikeee',
    name: 'Mikeee',
    dept: 'Social Media / VAs',
    role: 'va',
    telegramId: '6791511649',
    connected: true,
    shiftStart: '10:00',
    shiftEnd: '18:00',
    restDay: 'Thursday',
    lateCount: 0,
    earlyCount: 0,
  },
  {
    id: 'sofia',
    name: 'Sofia',
    dept: 'Chatters',
    role: 'chatter',
    connected: false,
    shiftStart: '14:00',
    shiftEnd: '22:00',
    restDay: 'Wednesday',
    lateCount: 2,
    earlyCount: 0,
    fanslyHandled: ['Amam', "Ming's Fansly", "Kitten's Fansly"],
    onlyfansHandled: ['Lalita', 'Ollie', 'Tyler'],
    allModels: [
      'Amam (Fansly+OF)',
      "Ming's Fansly",
      "Kitten's Fansly",
      'Lalita (Fansly+OF)',
      'Ollie',
      'Tyler',
    ],
  },
  {
    id: 'dhene',
    name: 'Dhene',
    dept: 'Editing',
    role: 'editor',
    connected: false,
    shiftStart: '18:00',
    shiftEnd: '00:00',
    restDay: 'Monday',
    lateCount: 0,
    earlyCount: 0,
  },
  {
    id: 'kristine',
    name: 'Kristine',
    dept: 'Chatters',
    role: 'chatter',
    connected: false,
    shiftStart: '14:00',
    shiftEnd: '22:00',
    restDay: 'Thursday',
    lateCount: 3,
    earlyCount: 0,
    fanslyHandled: ['Amam', 'Kiroko Fansly', "Ming's Fansly", "Lia's Fansly"],
    onlyfansHandled: ['Ren', 'Ollie', 'Tyler'],
    allModels: [
      'Amam (Fansly+OF)',
      'Ren (Fansly+OF)',
      'Kiroko Fansly',
      "Ming's Fansly",
      "Lia's Fansly",
      'Ollie',
      'Tyler',
    ],
  },
  {
    id: 'macy',
    name: 'Macy',
    dept: 'Chatters',
    role: 'chatter',
    connected: false,
    shiftStart: '14:00',
    shiftEnd: '22:00',
    restDay: 'Thursday',
    lateCount: 0,
    earlyCount: 0,
    fanslyHandled: ['Lalita', 'Ella Mira', "Kitten's Fansly"],
    onlyfansHandled: ['Kiyomi', 'Ruby Chan', 'Cam'],
    allModels: [
      'Lalita (Fansly+OF)',
      'Ella Mira (Fansly+OF)',
      "Kitten's Fansly",
      'Kiyomi (Fansly+OF)',
      'Ruby Chan',
      'Cam',
    ],
  },
  {
    id: 'jack',
    name: 'Jack',
    dept: 'Management',
    role: 'manager',
    connected: false,
    shiftStart: '06:00',
    shiftEnd: '14:00',
    restDay: 'Tuesday',
    lateCount: 1,
    earlyCount: 0,
  },
  {
    id: 'aria',
    name: 'Aria',
    dept: 'Management',
    role: 'manager',
    connected: false,
    shiftStart: '22:00',
    shiftEnd: '06:00',
    restDay: 'Thursday',
    lateCount: 0,
    earlyCount: 0,
  },
];

export const DEPT_ORDER = [
  'Ownership',
  'Management',
  'Social Media / VAs',
  'Editing',
  'Chatters',
];

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  'bg-pink-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-teal-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-indigo-500',
];

export function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getDeptEmployees(dept: string): Employee[] {
  return EMPLOYEES.filter(e => e.dept === dept);
}
