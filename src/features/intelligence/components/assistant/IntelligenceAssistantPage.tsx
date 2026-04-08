'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Send, Sparkles, X, Bot, ArrowLeft } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { TrendsData }   from '../../types';
import type { InsightsData } from '../../types';

interface Message { id: string; role: 'user' | 'assistant'; text: string; }

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

function ChatMessage({ msg }: { msg: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {msg.role === 'assistant' && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: GRAD }}
        >
          <Bot size={13} className="text-white" />
        </div>
      )}
      <div
        className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
        style={
          msg.role === 'user'
            ? { background: GRAD, color: '#fff' }
            : { backgroundColor: '#f5f5f4', color: '#374151' }
        }
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: GRAD }}
      >
        <Bot size={13} className="text-white" />
      </div>
      <div className="flex items-center gap-1 px-4 py-3 rounded-2xl" style={{ backgroundColor: '#f5f5f4' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-neutral-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function buildSystemPrompt(
  trends: TrendsData | null,
  insights: InsightsData | null,
  patterns: any[],
  hashtags: any[],
  hooks: any,
): string {
  let prompt = `You are the Intelligence Assistant for an AI-powered content intelligence platform. You have access to all scraped data, team curation signals, and AI analysis.`;

  if (trends) {
    prompt += `\n\n## Trends (last 30 days)\nTotal posts: ${trends.totalPosts}, Avg ER: ${(trends.avgER * 100).toFixed(2)}%`;
    if (trends.nicheStats.length) {
      prompt += `\nNiche performance: ${trends.nicheStats.map(n => `${n.niche} (${n.count} posts, ${(n.avgER * 100).toFixed(1)}% ER)`).join(' | ')}`;
    }
    if (trends.formatStats.length) {
      prompt += `\nFormat performance: ${trends.formatStats.map(f => `${f.format} (${(f.avgER * 100).toFixed(1)}% ER)`).join(' | ')}`;
    }
    if (trends.outlierPosts.length) {
      prompt += `\nTop outlier posts: ${trends.outlierPosts.slice(0, 5).map(p => `@${p.handle} (${p.outlierRatio.toFixed(1)}x ER)`).join(', ')}`;
    }
  }

  if (insights) {
    const { summary } = insights;
    const saveRate = Math.round((summary.saveCount / Math.max(summary.totalRatings, 1)) * 100);
    prompt += `\n\n## Team Curation\n${summary.totalRatings} total ratings | ${saveRate}% save rate`;
    if (insights.nichePreferences.length) {
      prompt += `\nTop niches by team signal: ${insights.nichePreferences.slice(0, 3).map(n => `${n.niche} (up: ${(n.upRate * 100).toFixed(0)}%, save: ${(n.saveRate * 100).toFixed(0)}%)`).join(' | ')}`;
    }
  }

  if (hooks && hooks.hookLines?.length) {
    prompt += `\n\n## Top Hooks by AI Score\n${hooks.hookLines.slice(0, 5).map((h: any) => `"${h.hookLine.slice(0, 80)}" — @${h.handle} (${h.hookScore.toFixed(1)})`).join('\n')}`;
  }

  if (hashtags && hashtags.length) {
    prompt += `\n\n## Top Hashtag Correlations\n${hashtags.slice(0, 5).map((h: any) => `#${h.hashtag} (${h.correlationPct}% in top posts, avg ER ${(h.avgER * 100).toFixed(1)}%)`).join(' | ')}`;
  }

  if (patterns && patterns.length) {
    prompt += `\n\n## Content Patterns\n${patterns.slice(0, 4).map((p: any) => `${p.theme}: ${p.postCount} posts, ${(p.multiplier * 100 - 100).toFixed(0)}% above baseline`).join('\n')}`;
  }

  prompt += `\n\nAnswer questions concisely and with specific data. Suggest actionable next steps when relevant.`;
  return prompt;
}

export default function IntelligenceAssistantPage({ onClose }: { onClose?: () => void } = {}) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const trends   = useQuery(api.intelligence.getTrends,              { days: 30 }) as TrendsData | undefined;
  const insights = useQuery(api.insights.getInsights,               {})               as InsightsData | undefined;
  const patterns = useQuery(api.intelligence.getPatterns,           { days: 30 });
  const hashtags = useQuery(api.intelligence.getHashtagCorrelation, { days: 30 });
  const hooks    = useQuery(api.intelligence.getHookStats,         { days: 30 });

  const allLoaded = trends !== undefined && insights !== undefined;

  const initText = allLoaded
    ? `Loaded ${trends.totalPosts} posts. Top niche: **${trends.nicheStats[0]?.niche ?? 'N/A'}** (${((trends.nicheStats[0]?.avgER ?? 0) * 100).toFixed(1)}% ER). Team save rate: ${Math.round((insights.summary.saveCount / Math.max(insights.summary.totalRatings, 1)) * 100)}%. What do you want to explore?`
    : 'Loading all intelligence data...';

  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'assistant', text: initText },
  ]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    const assistantId = Date.now().toString() + '_a';
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', text: '' }]);

    try {
      const res = await fetch('/api/intelligence/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data:         (trends ?? null) as TrendsData | null,
          insightsData: (insights ?? null) as InsightsData | null,
          patterns:     patterns       ?? null,
          hashtags:     hashtags       ?? null,
          hooks:        hooks          ?? null,
          systemPrompt: buildSystemPrompt(trends ?? null, insights ?? null, patterns ?? [], hashtags ?? [], hooks ?? null),
          messages:     history.map(m  => ({ role: m.role, content: m.text })),
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
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, text: 'Something went wrong. Try again.' } : m)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        {!onClose && (
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.04] transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">Ask Intelligence</p>
          <p className="text-[11px] text-neutral-400">
            {allLoaded
              ? `${trends?.totalPosts ?? 0} posts · full context loaded`
              : 'Loading context...'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
          {loading && messages[messages.length - 1]?.text === '' && <TypingIndicator />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length === 1 && !loading && allLoaded && (
        <div className="px-6 pb-3 shrink-0">
          <div className="flex flex-wrap gap-2">
            {[
              'What should we brief this week?',
              'Which niche has the most signal?',
              'What hook style is working best?',
              'Summarise top content patterns',
            ].map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-[11px] px-3 py-1.5 rounded-xl border transition-colors hover:border-[#ff006950] hover:text-[#ff0069] hover:bg-[#ff006908]"
                style={{ borderColor: 'rgba(0,0,0,0.1)', color: '#6b7280' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-center gap-3 px-6 py-4 shrink-0"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) send(input);
          }}
          placeholder="Ask about trends, niches, hooks, team curation..."
          className="flex-1 text-sm text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none"
          disabled={!allLoaded}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading || !allLoaded}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
          style={{ background: GRAD }}
        >
          <Send size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
}
