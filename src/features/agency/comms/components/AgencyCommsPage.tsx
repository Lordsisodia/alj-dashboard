'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Megaphone, Crown } from 'lucide-react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import ChannelList from './ChannelList';
import MessageThread from './MessageThread';
import AnnouncementBanner from './AnnouncementBanner';
import { CHANNELS, MESSAGES, ANNOUNCEMENTS, ONLINE_COUNT } from '../constants';
import type { Channel } from '../types';

export default function AgencyCommsPage() {
  const [activeTab, setActiveTab] = useState<string>('channels');
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-general');

  const activeChannel: Channel = CHANNELS.find(c => c.id === activeChannelId) ?? CHANNELS[0];
  const channelMessages = MESSAGES[activeChannelId] ?? [];

  const totalUnread = CHANNELS.reduce((sum, c) => sum + c.unread, 0);
  const pinnedAnnouncements = ANNOUNCEMENTS.filter(a => a.pinned);
  const unpinnedAnnouncements = ANNOUNCEMENTS.filter(a => !a.pinned);

  const tabs = [
    { id: 'channels', label: 'Channels', icon: <MessageSquare size={12} /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone size={12} /> },
  ];

  return (
    <ContentPageShell
      icon={<MessageSquare size={16} />}
      title="Comms"
      stat={{ label: 'channels', value: CHANNELS.length }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      accentGradient="linear-gradient(135deg, #ff0069, #833ab4)"
      searchPlaceholder="Search messages..."
    >
      <AnimatePresence mode="wait">
        {activeTab === 'channels' ? (
          <motion.div
            key="channels"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 overflow-hidden min-h-0"
          >
            {/* Left: channel list */}
            <div
              className="w-56 flex-shrink-0 flex flex-col overflow-hidden"
              style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}
            >
              {/* Status bar */}
              <div
                className="px-3 py-2.5 flex items-center gap-2 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fafafa' }}
              >
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#16a34a' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {ONLINE_COUNT} Online
                </div>
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', color: '#71717a' }}
                >
                  <Crown size={9} className="text-yellow-500" />
                  {CHANNELS.filter(c => c.group === 'Managers').length} Manager channels
                </div>
              </div>

              <ChannelList
                channels={CHANNELS}
                activeChannelId={activeChannelId}
                onChannelSelect={setActiveChannelId}
                searchValue=""
                onSearchChange={() => {}}
              />
            </div>

            {/* Right: message thread */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {totalUnread > 0 && (
                <div
                  className="px-4 py-2 flex items-center gap-2 flex-shrink-0"
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff9f0' }}
                >
                  <MessageSquare size={12} className="text-pink-500" />
                  <span className="text-[11px] text-neutral-600 font-medium">
                    {totalUnread} unread message{totalUnread !== 1 ? 's' : ''} across {CHANNELS.filter(c => c.unread > 0).length} channels
                  </span>
                </div>
              )}
              <MessageThread channel={activeChannel} messages={channelMessages} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="announcements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {pinnedAnnouncements.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-3 px-1">
                  Pinned
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {pinnedAnnouncements.map(a => (
                    <AnnouncementBanner key={a.id} announcement={a} />
                  ))}
                </div>
              </div>
            )}

            {unpinnedAnnouncements.length > 0 && (
              <div className={pinnedAnnouncements.length > 0 ? 'mt-6' : ''}>
                {pinnedAnnouncements.length > 0 && (
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-3 px-1">
                    Recent
                  </p>
                )}
                <div className="grid grid-cols-1 gap-3">
                  {unpinnedAnnouncements.map(a => (
                    <AnnouncementBanner key={a.id} announcement={a} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ContentPageShell>
  );
}
