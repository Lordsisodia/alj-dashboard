'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, Bot } from 'lucide-react';
import type { TrendsData }   from '../../types';
import type { InsightsData } from '../../types';

interface Message { id: string; role: 'user' | 'assistant'; text: string; }

const SUGGESTED = [
  "What should we brief this week?",
  "Which niche should we push?",
  "What hook style is working?",
  "Summarise the top patterns",
];

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

function ChatMessage({ msg }: { msg: Message }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
      {msg.role === 'assistant' && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: GRAD }}>
          <Bot size={11} className="text-white" />
        </div>
      )}
      <div className="max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap"
        style={msg.role === 'user' ? { background: GRAD, color: '#fff' } : { backgroundColor: '#f5f5f4', color: '#374151' }}>
        {msg.text}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GRAD }}>
        <Bot size={11} className="text-white" />
      </div>
      <div className="flex items-center gap-1 px-3 py-2 rounded-xl" style={{ backgroundColor: '#f5f5f4' }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-400"
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>
    </motion.div>
  );
}

interface Props {
  data:         TrendsData   | undefined;
  insightsData: InsightsData | undefined;
  onClose:      () => void;
  embedded?:    boolean;
}

export function AIChatPanel({ data, insightsData, onClose, embedded }: Props) {
  const topNiche  = data?.nicheStats[0];
  const topFormat = data?.formatStats[0];
  const saveRate  = insightsData
    ? Math.round((insightsData.summary.saveCount / Math.max(insightsData.summary.totalRatings, 1)) * 100)
    : null;

  const initText = data
    ? `Loaded ${data.totalPosts} posts. Top: **${topNiche?.niche ?? 'N/A'}** niche, **${topFormat?.format ?? 'N/A'}** format${saveRate !== null ? `, ${saveRate}% team save rate` : ''}. What do you want to know?`
    : "Loading intelligence data... Ask me anything about what's working.";

  const [messages, setMessages] = useState<Message[]>([{ id: 'init', role: 'assistant', text: initText }]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    const assistantId = Date.now() + '_a';
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', text: '' }]);

    try {
      const res = await fetch('/api/intelligence/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data:         data         ?? null,
          insightsData: insightsData ?? null,
          messages:     history.map(m => ({ role: m.role, content: m.text })),
        }),
      });
      if (!res.ok || !res.body) throw new Error('Stream failed');
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: full } : m));
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: 'Something went wrong. Try again.' } : m));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-xl overflow-hidden" style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', minHeight: embedded ? undefined : 480 }}>
      {!embedded && (
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
              <Sparkles size={13} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900">Ask Intelligence</p>
              <p className="text-[10px] text-neutral-400">Powered by Minimax · full trends + ratings context</p>
            </div>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.05] transition-colors">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: 400 }}>
        <AnimatePresence initial={false}>
          {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
          {loading && messages[messages.length - 1]?.text === '' && <TypingIndicator />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-2 flex-shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED.map(s => (
            <button key={s} onClick={() => send(s)} disabled={loading}
              className="text-[10px] px-2 py-1 rounded-lg border transition-colors hover:border-[#ff006940] hover:text-[#ff0069] hover:bg-[#ff006908] disabled:opacity-50"
              style={{ borderColor: 'rgba(0,0,0,0.1)', color: '#6b7280' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) send(input); }}
          placeholder="Ask about trends, niches, hooks..."
          className="flex-1 text-xs text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none" />
        <button onClick={() => send(input)} disabled={!input.trim() || loading}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-40" style={{ background: GRAD }}>
          <Send size={12} className="text-white" />
        </button>
      </div>
    </div>
  );
}
