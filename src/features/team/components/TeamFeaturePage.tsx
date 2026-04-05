'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  CheckSquare,
  Edit2,
  MessageSquare,
  Mail,
  Check,
  Minus,
  Clock,
  X,
  UserPlus,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'Admin' | 'VA' | 'Editor' | 'Model';
type Status = 'Online' | 'Away' | 'Offline';

interface Member {
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

interface Contact {
  name: string;
  handle: string;
  initials: string;
}

interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timeAgo: string;
  avatarColor: string;
  initials: string;
}

interface PermissionRow {
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MEMBERS: Member[] = [
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

const CONTACTS: Contact[] = [
  { name: 'Tyler Rex',  handle: '@abg.ricebunny', initials: 'TR' },
  { name: 'Ren Rhinx',  handle: '@rhinxrenx',     initials: 'RR' },
  { name: 'Ella Mira',  handle: '@ellamira',       initials: 'EM' },
  { name: 'Sam Chase',  handle: '@samchase',        initials: 'SC' },
];

const ACTIVITY: ActivityItem[] = [
  { id: 'a1', actor: 'Mikee Santos',  initials: 'MS', action: 'approved content for',    target: '@abg.ricebunny',   timeAgo: '2h ago',  avatarColor: '#fcaf45' },
  { id: 'a2', actor: 'Yssa Reyes',    initials: 'YR', action: 'uploaded 3 clips to',     target: 'Content Pipeline', timeAgo: '4h ago',  avatarColor: '#833ab4' },
  { id: 'a3', actor: 'Raphael Cruz',  initials: 'RC', action: 'completed 2 edits for',   target: '@rhinxrenx',       timeAgo: '6h ago',  avatarColor: '#78c257' },
  { id: 'a4', actor: 'Alex / ALJ',    initials: 'AX', action: 'scheduled 3 posts for',   target: '@samchase',        timeAgo: '1d ago',  avatarColor: '#ff0069' },
  { id: 'a5', actor: 'Mikee Santos',  initials: 'MS', action: 'sent brief to',           target: 'Tyler Rex',        timeAgo: '2d ago',  avatarColor: '#fcaf45' },
  { id: 'a6', actor: 'Raphael Cruz',  initials: 'RC', action: 'exported edited reel for', target: '@ellamira',        timeAgo: '2d ago',  avatarColor: '#78c257' },
];

const PERMISSIONS: PermissionRow[] = [
  { member: 'Alex / ALJ',   initials: 'AX', avatarColor: '#ff0069', schedule: true,  upload: true,  approve: true,  analytics: true,  manageTeam: true,  settings: true  },
  { member: 'Mikee Santos', initials: 'MS', avatarColor: '#fcaf45', schedule: true,  upload: true,  approve: true,  analytics: false, manageTeam: false, settings: false },
  { member: 'Yssa Reyes',   initials: 'YR', avatarColor: '#833ab4', schedule: true,  upload: true,  approve: false, analytics: false, manageTeam: false, settings: false },
  { member: 'Raphael Cruz', initials: 'RC', avatarColor: '#78c257', schedule: false, upload: false, approve: false, analytics: true,  manageTeam: false, settings: false },
];

const ALL_ACCOUNTS = ['@abg.ricebunny', '@rhinxrenx', '@ellamira', '@samchase'];

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  const styles: Record<Role, { bg: string; color: string; border: string }> = {
    Admin:  { bg: 'rgba(255,0,105,0.08)',    color: '#ff0069',  border: 'rgba(255,0,105,0.2)'    },
    VA:     { bg: 'rgba(252,175,69,0.1)',    color: '#d97706',  border: 'rgba(252,175,69,0.25)'  },
    Editor: { bg: 'rgba(120,194,87,0.1)',    color: '#4d7c0f',  border: 'rgba(120,194,87,0.25)'  },
    Model:  { bg: 'rgba(131,58,180,0.08)',   color: '#833ab4',  border: 'rgba(131,58,180,0.2)'   },
  };
  const s = styles[role];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {role}
    </span>
  );
}

// ─── Status Dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: Status }) {
  const colors: Record<Status, string> = {
    Online:  '#22c55e',
    Away:    '#f59e0b',
    Offline: '#d1d5db',
  };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: colors[status] }}
    />
  );
}

// ─── Account Pill ─────────────────────────────────────────────────────────────

function AccountPill({ handle }: { handle: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{
        backgroundColor: '#f5f5f4',
        color: '#78716c',
        border: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {handle}
    </span>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'VA' | 'Editor'>('VA');
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (acc: string) =>
    setSelected(p => (p.includes(acc) ? p.filter(a => a !== acc) : [...p, acc]));

  const handleSend = () => {
    setName(''); setEmail(''); setRole('VA'); setSelected([]);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl overflow-hidden bg-white"
          style={{
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div>
              <h2 className="text-neutral-900 font-semibold">Invite Member</h2>
              <p className="text-xs mt-0.5 text-neutral-500">
                They&apos;ll receive an email invitation
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors hover:bg-neutral-100 text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-600">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jamie Chen"
                className="w-full px-3 py-2.5 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-50"
                style={{ border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#ff0069')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-600">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. jamie@isso.co"
                className="w-full px-3 py-2.5 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-50"
                style={{ border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#ff0069')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
              />
            </div>

            {/* Role Toggle */}
            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-600">
                Role
              </label>
              <div className="flex gap-2">
                {(['VA', 'Editor'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: role === r ? 'rgba(255,0,105,0.08)' : '#fafafa',
                      color: role === r ? '#ff0069' : '#6b7280',
                      border: role === r
                        ? '1px solid rgba(255,0,105,0.3)'
                        : '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Access */}
            <div>
              <label className="block text-xs font-medium mb-2 text-neutral-600">
                Account Access
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_ACCOUNTS.map(acc => {
                  const checked = selected.includes(acc);
                  return (
                    <button
                      key={acc}
                      onClick={() => toggle(acc)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-left transition-all"
                      style={{
                        backgroundColor: checked ? 'rgba(255,0,105,0.06)' : '#fafafa',
                        border: checked
                          ? '1px solid rgba(255,0,105,0.25)'
                          : '1px solid rgba(0,0,0,0.07)',
                        color: checked ? '#ff0069' : '#6b7280',
                      }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: checked ? '#ff0069' : 'transparent',
                          border: checked ? '1px solid #ff0069' : '1px solid #d1d5db',
                        }}
                      >
                        {checked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      {acc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-neutral-100 text-neutral-600"
              style={{ border: '1px solid rgba(0,0,0,0.1)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!name || !email}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #ff0069, #833ab4)',
              }}
            >
              Send Invite
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TeamFeaturePage() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const onlineCount = MEMBERS.filter(m => m.status === 'Online').length;
  const totalTasks = MEMBERS.reduce((a, m) => a + m.tasks, 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      <div className="max-w-5xl mx-auto w-full px-6 py-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between mb-5"
        >
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Team</h1>
            <p className="text-sm mt-0.5 text-neutral-500">
              Manage members, permissions, and team activity.
            </p>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="grid grid-cols-4 gap-3 mb-5"
        >
          {[
            { label: 'Total Members',    value: MEMBERS.length,      icon: Users,       color: '#833ab4' },
            { label: 'Online Now',       value: onlineCount,         icon: null,        color: '#22c55e' },
            { label: 'Accounts Managed', value: ALL_ACCOUNTS.length, icon: Shield,      color: '#ff0069' },
            { label: 'Tasks This Week',  value: totalTasks,          icon: CheckSquare, color: '#f59e0b' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-4 bg-white"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-500">{stat.label}</span>
                {stat.icon ? (
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                )}
              </div>
              <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* 2:1 Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="grid grid-cols-3 gap-5 mb-5"
        >
          {/* Team Members (2/3) */}
          <div className="col-span-2 space-y-3">
            <p className="text-sm font-semibold text-neutral-900">Members</p>
            {MEMBERS.map(member => (
              <div
                key={member.id}
                className="rounded-xl p-4 bg-white transition-shadow hover:shadow-sm"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold text-neutral-900">{member.name}</span>
                      <RoleBadge role={member.role} />
                      <div className="flex items-center gap-1">
                        <StatusDot status={member.status} />
                        <span className="text-[10px] text-neutral-400">{member.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Mail className="w-3 h-3 text-neutral-300" />
                      <span className="text-[11px] text-neutral-400">{member.email}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {member.accounts.slice(0, 3).map(acc => (
                        <AccountPill key={acc} handle={acc} />
                      ))}
                      {member.accounts.length > 3 && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] text-neutral-400"
                          style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}
                        >
                          +{member.accounts.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">
                        <span className="text-neutral-700 font-semibold">{member.tasks}</span> tasks this week
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all hover:bg-neutral-100 text-neutral-500"
                          style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all hover:bg-neutral-100 text-neutral-500"
                          style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                        >
                          <MessageSquare className="w-3 h-3" /> Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contacts (1/3) */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-900">Models</p>
            {CONTACTS.map(contact => (
              <div
                key={contact.handle}
                className="flex items-center gap-3 rounded-xl p-3 bg-white"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  {contact.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{contact.name}</p>
                  <p className="text-[11px] truncate text-neutral-400">{contact.handle}</p>
                </div>
                <RoleBadge role="Model" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mb-5"
        >
          <p className="text-sm font-semibold text-neutral-900 mb-3">Activity</p>
          <div
            className="rounded-xl overflow-hidden bg-white"
            style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          >
            {ACTIVITY.map((item, i) => (
              <div
                key={item.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
                style={{
                  borderBottom: i < ACTIVITY.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: item.avatarColor }}
                >
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] leading-relaxed">
                    <span className="font-semibold text-neutral-900">{item.actor}</span>{' '}
                    <span className="text-neutral-500">{item.action}</span>{' '}
                    <span style={{ color: '#ff0069' }}>{item.target}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-neutral-300" />
                    <span className="text-[10px] text-neutral-400">{item.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Permissions Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <p className="text-sm font-semibold text-neutral-900 mb-3">Permissions Matrix</p>
          <div
            className="rounded-xl overflow-hidden bg-white"
            style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          >
            {/* Header Row */}
            <div
              className="grid px-4 py-3"
              style={{
                gridTemplateColumns: '2fr repeat(6, 1fr)',
                borderBottom: '1px solid rgba(0,0,0,0.07)',
                backgroundColor: '#fafafa',
              }}
            >
              {['', 'Schedule', 'Upload', 'Approve', 'Analytics', 'Manage Team', 'Settings'].map(col => (
                <div
                  key={col}
                  className="text-[11px] font-semibold text-center text-neutral-400"
                >
                  {col}
                </div>
              ))}
            </div>

            {PERMISSIONS.map((row, i) => (
              <div
                key={row.member}
                className="grid px-4 py-3 items-center hover:bg-neutral-50 transition-colors"
                style={{
                  gridTemplateColumns: '2fr repeat(6, 1fr)',
                  borderBottom: i < PERMISSIONS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: row.avatarColor }}
                  >
                    {row.initials}
                  </div>
                  <span className="text-sm font-medium text-neutral-900 truncate">{row.member}</span>
                </div>
                {[row.schedule, row.upload, row.approve, row.analytics, row.manageTeam, row.settings].map((val, j) => (
                  <div key={j} className="flex justify-center">
                    {val ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Minus className="w-4 h-4 text-neutral-200" />
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Legend */}
            <div
              className="flex items-center gap-5 px-4 py-3"
              style={{ borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa' }}
            >
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] text-neutral-400">Allowed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Minus className="w-3.5 h-3.5 text-neutral-200" />
                <span className="text-[10px] text-neutral-400">No access</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {inviteOpen && <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
