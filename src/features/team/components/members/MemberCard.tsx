import { Edit2, MessageSquare, Mail } from 'lucide-react';
import type { Member } from '../../types';
import { RoleBadge, StatusDot } from '../badges';
import { AccountPill } from '../pills';

export function MemberCard({ member }: { member: Member }) {
  return (
    <div
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
  );
}
