'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import { AIAnalysisTab } from '../drawer/AIAnalysisTab';
import { GRAD } from '../../constants';

interface Post {
  _id: string;
  handle: string;
  niche: string;
  contentType: string;
  thumbnailUrl: string;
  videoUrl?: string;
  caption?: string;
  engagementRate: number;
  outlierRatio: number;
  likes: number;
  views: number;
  saves: number;
  comments: number;
  aiAnalysis?: {
    hookScore: number;
    hookLine: string;
    emotions: string[];
    breakdown: string;
    suggestions: string[];
    transcript?: string;
    analyzedAt: number;
  };
}

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

export function AnalysisDetailPanel({ post, onClose }: { post: Post; onClose: () => void }) {
  const [chatInput,  setChatInput]  = useState('');
  const [messages,  setMessages]  = useState<ChatMsg[]>([]);
  const [loading,   setLoading]   = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function sendMessage() {
    const text = chatInput.trim();
    if (!text || loading) return;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/intelligence/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            handle: post.handle,
            niche: post.niche,
            hookScore: post.aiAnalysis?.hookScore,
            hookLine: post.aiAnalysis?.hookLine,
            emotions: post.aiAnalysis?.emotions ?? [],
            breakdown: post.aiAnalysis?.breakdown,
            caption: post.caption,
          },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text ?? data.reply ?? '' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  const panel = (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[190]"
        style={{ backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Side panel */}
      <motion.div
        className="fixed top-0 right-0 bottom-0 z-[200] w-[420px] bg-white flex flex-col overflow-hidden"
        style={{ boxShadow: '-4px 0 32px rgba(0,0,0,0.12)' }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              style={{ background: GRAD }}
            >
              {post.handle.slice(1, 3).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 leading-tight">{post.handle}</p>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,0,105,0.08)', color: '#ff0069' }}>
                {post.niche}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {/* AI Analysis */}
          <div className="px-4 py-4">
            <AIAnalysisTab post={post as any} />
          </div>

          {/* Divider */}
          <div className="px-4" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center gap-2 py-3">
              <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
                <Sparkles size={10} className="text-white" />
              </div>
              <p className="text-[11px] font-semibold text-neutral-700">Ask about this reel</p>
            </div>

            {/* Chat history */}
            <div className="space-y-3 pb-2">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={msg.role === 'user'
                      ? 'flex justify-end'
                      : 'flex gap-2'
                    }
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: GRAD }}>
                        <Sparkles size={8} className="text-white" />
                      </div>
                    )}
                    <div className={msg.role === 'user'
                      ? 'max-w-[80%] px-3 py-2 rounded-2xl rounded-tr-sm text-sm text-white'
                      : 'max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm text-sm text-neutral-700'
                    }
                      style={msg.role === 'user'
                        ? { background: GRAD }
                        : { backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }
                      }
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: GRAD }}>
                    <Sparkles size={8} className="text-white" />
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm" style={{ backgroundColor: 'rgba(0,0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <Loader2 size={12} className="animate-spin text-neutral-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat input */}
        <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask Grok about this hook..."
              className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400"
              style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(0,0,0,0.02)' }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim() || loading}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:brightness-110 disabled:opacity-40 flex-shrink-0"
              style={{ background: GRAD }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );

  return createPortal(panel, document.body);
}
