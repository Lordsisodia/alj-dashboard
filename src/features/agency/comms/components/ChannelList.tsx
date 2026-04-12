'use client';

import { motion } from 'framer-motion';
import { Hash, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Channel } from '../types';

interface ChannelListProps {
  channels: Channel[];
  activeChannelId: string;
  onChannelSelect: (id: string) => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
}

const GROUP_COLORS: Record<string, string> = {
  Chatters: '#ff0069',
  Managers: '#833ab4',
  Departments: '#f77737',
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
  return `${Math.floor(diffMins / 1440)}d`;
}

function ChannelItem({ channel, active, onClick }: {
  channel: Channel; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-2 px-2.5 py-2.5 rounded-xl text-left transition-all',
        active
          ? 'bg-black/[0.06]'
          : 'hover:bg-black/[0.04]',
      )}
    >
      <Hash
        size={13}
        className={cn('flex-shrink-0 mt-0.5', active ? 'text-neutral-700' : 'text-neutral-400')}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={cn(
            'text-xs font-semibold truncate',
            active ? 'text-neutral-900' : 'text-neutral-700',
          )}>
            {channel.name}
          </span>
          {channel.unread > 0 && !active && (
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
              style={{ background: '#ff0069' }}
            >
              {channel.unread}
            </span>
          )}
        </div>
        {channel.lastMessage && (
          <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
            <span className="font-medium text-neutral-500">{channel.lastMessage.sender}:</span>{' '}
            {channel.lastMessage.preview}
          </p>
        )}
        {channel.lastMessage && (
          <p className="text-[10px] text-neutral-300 mt-0.5">
            {formatTime(channel.lastMessage.timestamp)}
          </p>
        )}
      </div>
    </button>
  );
}

export default function ChannelList({
  channels,
  activeChannelId,
  onChannelSelect,
}: ChannelListProps) {
  const groups = ['Chatters', 'Managers', 'Departments'];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="px-3 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <MessageSquare size={11} className="text-neutral-400 flex-shrink-0" />
          <span className="text-xs text-neutral-400 font-medium">Channels</span>
        </div>
      </div>

      {/* Channel groups */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {groups.map(group => {
          const groupChannels = channels.filter(c => c.group === group);
          if (groupChannels.length === 0) return null;
          return (
            <div key={group} className="mb-4">
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: GROUP_COLORS[group] ?? '#6b7280' }}
                >
                  {group}
                </span>
              </div>
              <div className="space-y-0.5">
                {groupChannels.map(channel => (
                  <ChannelItem
                    key={channel.id}
                    channel={channel}
                    active={channel.id === activeChannelId}
                    onClick={() => onChannelSelect(channel.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current user */}
      <div
        className="px-3 py-3 flex-shrink-0 flex items-center gap-2.5"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-neutral-900 truncate">Alex</p>
          <p className="text-[10px] text-neutral-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online
          </p>
        </div>
      </div>
    </div>
  );
}
