import type { Member, Contact, ActivityItem, PermissionRow } from './types';

export const MEMBERS: Member[] = [
  {
    id: 'alex',
    name: 'Alex / ALJ',
    email: 'alex@isso.co',
    role: 'Admin',
    status: 'Online',
    accounts: ['@abg.ricebunny', '@rhinxrenx', '@ellamira', '@samchase'],
    tasks: 8,
    initials: 'AX',
    avatarColor: '#ff0069',
  },
  {
    id: 'mikee',
    name: 'Mikee Santos',
    email: 'mikee@isso.co',
    role: 'VA',
    status: 'Online',
    accounts: ['@abg.ricebunny', '@rhinxrenx'],
    tasks: 5,
    initials: 'MS',
    avatarColor: '#fcaf45',
  },
  {
    id: 'yssa',
    name: 'Yssa Reyes',
    email: 'yssa@isso.co',
    role: 'VA',
    status: 'Away',
    accounts: ['@ellamira', '@samchase'],
    tasks: 3,
    initials: 'YR',
    avatarColor: '#833ab4',
  },
  {
    id: 'raphael',
    name: 'Raphael Cruz',
    email: 'raphael@isso.co',
    role: 'Editor',
    status: 'Offline',
    accounts: ['@rhinxrenx'],
    tasks: 2,
    initials: 'RC',
    avatarColor: '#78c257',
  },
];

export const CONTACTS: Contact[] = [
  { name: 'Tyler Rex',  handle: '@abg.ricebunny', initials: 'TR' },
  { name: 'Ren Rhinx',  handle: '@rhinxrenx',     initials: 'RR' },
  { name: 'Ella Mira',  handle: '@ellamira',       initials: 'EM' },
  { name: 'Sam Chase',  handle: '@samchase',        initials: 'SC' },
];

export const ACTIVITY: ActivityItem[] = [
  { id: 'a1', actor: 'Mikee Santos',  initials: 'MS', action: 'approved content for',    target: '@abg.ricebunny',   timeAgo: '2h ago',  avatarColor: '#fcaf45' },
  { id: 'a2', actor: 'Yssa Reyes',    initials: 'YR', action: 'uploaded 3 clips to',     target: 'Content Pipeline', timeAgo: '4h ago',  avatarColor: '#833ab4' },
  { id: 'a3', actor: 'Raphael Cruz',  initials: 'RC', action: 'completed 2 edits for',   target: '@rhinxrenx',       timeAgo: '6h ago',  avatarColor: '#78c257' },
  { id: 'a4', actor: 'Alex / ALJ',    initials: 'AX', action: 'scheduled 3 posts for',   target: '@samchase',        timeAgo: '1d ago',  avatarColor: '#ff0069' },
  { id: 'a5', actor: 'Mikee Santos',  initials: 'MS', action: 'sent brief to',           target: 'Tyler Rex',        timeAgo: '2d ago',  avatarColor: '#fcaf45' },
  { id: 'a6', actor: 'Raphael Cruz',  initials: 'RC', action: 'exported edited reel for', target: '@ellamira',        timeAgo: '2d ago',  avatarColor: '#78c257' },
];

export const PERMISSIONS: PermissionRow[] = [
  { member: 'Alex / ALJ',   initials: 'AX', avatarColor: '#ff0069', schedule: true,  upload: true,  approve: true,  analytics: true,  manageTeam: true,  settings: true  },
  { member: 'Mikee Santos', initials: 'MS', avatarColor: '#fcaf45', schedule: true,  upload: true,  approve: true,  analytics: false, manageTeam: false, settings: false },
  { member: 'Yssa Reyes',   initials: 'YR', avatarColor: '#833ab4', schedule: true,  upload: true,  approve: false, analytics: false, manageTeam: false, settings: false },
  { member: 'Raphael Cruz', initials: 'RC', avatarColor: '#78c257', schedule: false, upload: false, approve: false, analytics: true,  manageTeam: false, settings: false },
];

export const ALL_ACCOUNTS = ['@abg.ricebunny', '@rhinxrenx', '@ellamira', '@samchase'];

export const headerVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export const rowVariants = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, delay } },
});
