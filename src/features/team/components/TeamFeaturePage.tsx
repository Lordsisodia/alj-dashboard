'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, CheckSquare, UserPlus } from 'lucide-react';
import { MEMBERS, CONTACTS, ALL_ACCOUNTS } from '../constants';
import { RoleBadge } from './badges';
import { InviteModal } from './modals';
import { MemberCard, PermissionsMatrix } from './members';
import { ActivityLog } from './activity';

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
            <p className="text-sm mt-0.5 text-neutral-500">Manage members, permissions, and team activity.</p>
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
            <div key={stat.label} className="rounded-xl p-4 bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
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
          <div className="col-span-2 space-y-3">
            <p className="text-sm font-semibold text-neutral-900">Members</p>
            {MEMBERS.map(member => <MemberCard key={member.id} member={member} />)}
          </div>

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

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <ActivityLog />
        </motion.div>

        {/* Permissions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <PermissionsMatrix />
        </motion.div>
      </div>

      <AnimatePresence>
        {inviteOpen && <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
