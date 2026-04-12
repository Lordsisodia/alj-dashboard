'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hash, Send, Users, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Channel, Message } from '../types';

interface MessageThreadProps {
  channel: Channel;
  messages: Message[];
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function MessageBubble({ msg }: { msg: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn('flex items-end gap-2', msg.isMe ? 'flex-row-reverse' : '')}
    >
      {!msg.isMe && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${msg.senderColor}, ${msg.senderColor}99)` }}
        >
          {msg.senderInitials}
        </div>
      )}

      <div className={cn('max-w-[68%] flex flex-col', msg.isMe ? 'items-end' : 'items-start')}>
        {!msg.isMe && (
          <div className="flex items-center gap-1.5 mb-1 px-0.5">
            <span className="text-[11px] font-semibold text-neutral-800">{msg.sender}</span>
            <span className="text-[10px] text-neutral-400">{msg.senderRole}</span>
          </div>
        )}
        <div
          className={cn(
            'px-3 py-2 rounded-2xl text-xs leading-relaxed',
            msg.isMe
              ? 'text-white rounded-br-sm'
              : 'text-neutral-700 rounded-bl-sm',
          )}
          style={
            msg.isMe
              ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' }
              : { backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.07)' }
          }
        >
          {msg.content}
        </div>
        <span className="text-[9px] text-neutral-300 mt-0.5 px-0.5">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

export default function MessageThread({ channel, messages }: MessageThreadProps) {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `local-${Date.now()}`,
      channelId: channel.id,
      sender: 'Alex',
      senderRole: 'Owner',
      senderInitials: 'A',
      senderColor: '#4ade80',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      isMe: true,
    };
    setLocalMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Thread header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <Hash size={14} className="text-neutral-400" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">{channel.name}</p>
          <p className="text-[10px] text-neutral-400">{channel.members} members</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04] transition-all">
            <Users size={14} />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04] transition-all">
            <Info size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <Hash size={24} className="text-neutral-200" />
            <p className="text-xs text-neutral-400">
              No messages yet in <span className="text-neutral-600 font-medium">#{channel.name}</span>
            </p>
            <p className="text-[11px] text-neutral-300">Be the first to say something!</p>
          </div>
        ) : (
          localMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
          style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="flex-1 text-xs text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none"
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white transition-all hover:brightness-110 disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            disabled={!input.trim()}
          >
            <Send size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
