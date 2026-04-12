'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Mic, ArrowUp, Plus, FileText, Code, BookOpen, PenTool, BrainCircuit, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { TrendsData, InsightsData } from '@/features/intelligence/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message { id: string; role: 'user' | 'assistant'; text: string; }

// ── Constants ─────────────────────────────────────────────────────────────────

const GRAD = 'linear-gradient(135deg, #6d28d9, #4c1d95)';

const SUGGESTED_PROMPTS = [
  'What should we brief this week?',
  'Which niche has the most signal?',
  'What hook style is working best?',
  'Summarise top content patterns',
];

const COMMAND_SUGGESTIONS = {
  learn: [
    'What niches are trending this week?',
    'Which hooks get the most saves?',
    'Explain outlier ratio scoring',
    'What makes a reel go viral?',
    'Top performing content types?',
  ],
  code: [
    'Analyse top hooks by emotion',
    'Show me patterns in top-rated posts',
    'Break down engagement by niche',
    'Which creators have the best ER?',
    'Find outlier posts from last 7 days',
  ],
  write: [
    'Draft a hook for a fitness reel',
    'Write 3 viral caption ideas',
    'Create a content brief for lifestyle',
    'Suggest hooks based on top patterns',
    'Write a video script for a trending topic',
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function ChatMessage({ msg }: { msg: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {msg.role === 'assistant' && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: GRAD }}>
          <Bot size={11} className="text-white" />
        </div>
      )}
      <div
        className="max-w-[78%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed whitespace-pre-wrap"
        style={msg.role === 'user'
          ? { background: GRAD, color: '#fff' }
          : { backgroundColor: '#f5f5f4', color: '#374151' }
        }
      >
        {msg.text || <span className="opacity-40 italic">Thinking...</span>}
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
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl" style={{ backgroundColor: '#f5f5f4' }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface CommandButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CommandButton({ icon, label, isActive, onClick }: CommandButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all ${
        isActive ? 'bg-violet-50 border-violet-200' : 'bg-white border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className={isActive ? 'text-violet-600' : 'text-neutral-400'}>{icon}</div>
      <span className={`text-[10px] font-semibold ${isActive ? 'text-violet-700' : 'text-neutral-600'}`}>{label}</span>
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AIAssistantInterface() {
  // Convex data — only the two the API route actually consumes
  const trends   = useQuery(api.intelligence.getTrends,  { days: 30 }) as TrendsData | undefined;
  const insights = useQuery(api.insights.getInsights,    {})           as InsightsData | undefined;
  const allLoaded = trends !== undefined && insights !== undefined;

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'assistant', text: 'Loading all intelligence data...' },
  ]);
  const [loading, setLoading] = useState(false);

  // UI state
  const [inputValue,           setInputValue]           = useState('');
  const [searchEnabled,        setSearchEnabled]        = useState(false);
  const [deepResearchEnabled,  setDeepResearchEnabled]  = useState(false);
  const [reasonEnabled,        setReasonEnabled]        = useState(false);
  const [uploadedFiles,        setUploadedFiles]        = useState<string[]>([]);
  const [showUploadAnimation,  setShowUploadAnimation]  = useState(false);
  const [activeCategory,       setActiveCategory]       = useState<string | null>(null);

  const inputRef        = useRef<HTMLInputElement>(null);
  const bottomRef       = useRef<HTMLDivElement>(null);
  const initHydratedRef = useRef(false);

  // Hydrate init message once Convex loads
  useEffect(() => {
    if (initHydratedRef.current || !allLoaded || !trends || !insights) return;
    const hydrated = `Loaded ${trends.totalPosts} posts. Top niche: **${trends.nicheStats[0]?.niche ?? 'N/A'}** (${((trends.nicheStats[0]?.avgER ?? 0) * 100).toFixed(1)}% ER). Team save rate: ${Math.round((insights.summary.saveCount / Math.max(insights.summary.totalRatings, 1)) * 100)}%. What do you want to explore?`;
    setMessages(prev => prev.map(m => m.id === 'init' ? { ...m, text: hydrated } : m));
    initHydratedRef.current = true;
  }, [allLoaded, trends, insights]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  // Streaming send
  async function send(text: string) {
    if (!text.trim() || loading || !allLoaded) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInputValue('');
    setLoading(true);
    setActiveCategory(null);
    const assistantId = crypto.randomUUID();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', text: '' }]);

    try {
      const res = await fetch('/api/intelligence/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages:     history.map(m => ({ role: m.role, content: m.text })),
          data:         trends   ?? null,
          insightsData: insights ?? null,
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
      // Flush any trailing multi-byte chars
      full += decoder.decode();
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: full } : m));
    } catch {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: 'Something went wrong. Try again.' } : m));
    } finally {
      setLoading(false);
    }
  }

  function handleCommandSelect(cmd: string) {
    send(cmd);
    setActiveCategory(null);
  }

  function handleUploadFile() {
    setShowUploadAnimation(true);
    setTimeout(() => {
      setUploadedFiles(prev => [...prev, 'Document.pdf']);
      setShowUploadAnimation(false);
    }, 1500);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">

      {/* ── Messages scroll area ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-4 pb-2 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
          {loading && messages[messages.length - 1]?.text === '' && <TypingIndicator />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* ── Suggested prompts + command categories (only on fresh chat) ── */}
      {messages.length === 1 && (
        <div className="shrink-0 px-4 pb-2 flex flex-col gap-3">

          {/* Suggested prompts — only when data is loaded */}
          {allLoaded && !loading && (
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_PROMPTS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[10px] px-2.5 py-1.5 rounded-xl border border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Command category suggestion lists */}
          <AnimatePresence>
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-neutral-100 bg-neutral-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">
                      {activeCategory === 'learn' ? 'Explore' : activeCategory === 'code' ? 'Analyse' : 'Create'}
                    </p>
                  </div>
                  {COMMAND_SUGGESTIONS[activeCategory as keyof typeof COMMAND_SUGGESTIONS].map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleCommandSelect(s)}
                      className="w-full text-left px-3 py-2.5 text-[11px] text-neutral-700 hover:bg-white transition-colors border-b border-neutral-100 last:border-0"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick-action command categories */}
          <div className="grid grid-cols-3 gap-2">
            <CommandButton icon={<BookOpen size={14} />} label="Explore"  isActive={activeCategory === 'learn'} onClick={() => setActiveCategory(activeCategory === 'learn' ? null : 'learn')} />
            <CommandButton icon={<Code      size={14} />} label="Analyse"  isActive={activeCategory === 'code'}  onClick={() => setActiveCategory(activeCategory === 'code'  ? null : 'code')}  />
            <CommandButton icon={<PenTool   size={14} />} label="Create"   isActive={activeCategory === 'write'} onClick={() => setActiveCategory(activeCategory === 'write' ? null : 'write')} />
          </div>
        </div>
      )}

      {/* ── Input panel ───────────────────────────────────────────────── */}
      <div className="flex-shrink-0 mx-4 mb-4 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">

        {/* Text input */}
        <div className="px-3 pt-3 pb-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={allLoaded ? 'Ask about trends, niches, hooks, team curation...' : 'Loading intelligence context...'}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(inputValue);
              }
            }}
            disabled={!allLoaded || loading}
            className="w-full text-[12px] text-neutral-700 placeholder:text-neutral-400 outline-none bg-transparent disabled:opacity-50"
          />
        </div>

        {/* Uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-200">
                <FileText size={10} className="text-violet-600" />
                <span className="text-[10px] text-neutral-600">{file}</span>
                <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} className="text-neutral-300 hover:text-neutral-500">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Toggle pills + send button */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* TODO: Search/Research/Reason are UI-only toggles — not yet plumbed to the API */}
            <button
              onClick={() => setSearchEnabled(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${searchEnabled ? 'bg-violet-50 text-violet-600' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
            >
              <Search size={10} /> Search
            </button>
            <button
              onClick={() => setDeepResearchEnabled(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${deepResearchEnabled ? 'bg-violet-50 text-violet-600' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={deepResearchEnabled ? 'text-violet-600' : 'text-neutral-400'}>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                <circle cx="8" cy="8" r="3" fill="currentColor" />
              </svg>
              Research
            </button>
            <button
              onClick={() => setReasonEnabled(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${reasonEnabled ? 'bg-violet-50 text-violet-600' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
            >
              <BrainCircuit size={10} className={reasonEnabled ? 'text-violet-600' : 'text-neutral-400'} />
              Reason
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="p-1.5 text-neutral-300 hover:text-neutral-500 transition-colors">
              <Mic size={13} />
            </button>
            <button
              onClick={() => send(inputValue)}
              disabled={!inputValue.trim() || loading || !allLoaded}
              className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                inputValue.trim() && allLoaded && !loading
                  ? 'text-white hover:opacity-90'
                  : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
              }`}
              style={inputValue.trim() && allLoaded && !loading ? { background: GRAD } : undefined}
            >
              <ArrowUp size={11} />
            </button>
          </div>
        </div>

        {/* Upload files row */}
        <div className="px-3 py-2 border-t border-neutral-100">
          <button onClick={handleUploadFile} className="flex items-center gap-1.5 text-neutral-500 text-[10px] hover:text-neutral-700 transition-colors">
            {showUploadAnimation ? (
              <motion.div className="flex space-x-0.5" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1 h-1 bg-violet-600 rounded-full"
                    variants={{ hidden: { opacity: 0, y: 3 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, repeat: Infinity, repeatType: 'mirror', delay: i * 0.1 } } }}
                  />
                ))}
              </motion.div>
            ) : <Plus size={11} />}
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
}
