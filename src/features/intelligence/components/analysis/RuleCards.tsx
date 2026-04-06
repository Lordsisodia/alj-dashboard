'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { fadeUp } from '../../constants';

interface AnalysedPost {
  hookLine: string; hookScore: number; engagementRate: number; emotions: string[];
}

interface Rule { label: string; finding: string; sampleSize: number; color: string; }

function deriveRules(posts: AnalysedPost[]): Rule[] {
  if (posts.length < 3) return [];
  const rules: Rule[] = [];

  // Rule 1: question hooks
  const questions = posts.filter(p => p.hookLine.includes('?'));
  const nonQ      = posts.filter(p => !p.hookLine.includes('?'));
  if (questions.length >= 2 && nonQ.length >= 2) {
    const qER  = questions.reduce((s, p) => s + p.engagementRate, 0) / questions.length;
    const nqER = nonQ.reduce((s, p) => s + p.engagementRate, 0) / nonQ.length;
    if (qER > nqER * 1.1) {
      rules.push({ label: 'Questions outperform', finding: `Hooks ending in "?" average ${(qER * 100).toFixed(1)}% ER vs ${(nqER * 100).toFixed(1)}% for statements - ${((qER / nqER - 1) * 100).toFixed(0)}% lift`, sampleSize: questions.length, color: '#4a9eff' });
    }
  }

  // Rule 2: high hook score → higher ER
  const highScore = posts.filter(p => p.hookScore >= 7);
  const lowScore  = posts.filter(p => p.hookScore < 5);
  if (highScore.length >= 2 && lowScore.length >= 2) {
    const hER = highScore.reduce((s, p) => s + p.engagementRate, 0) / highScore.length;
    const lER = lowScore.reduce((s, p) => s + p.engagementRate, 0) / lowScore.length;
    rules.push({ label: 'Hook score predicts ER', finding: `Posts scoring 7+ average ${(hER * 100).toFixed(1)}% ER vs ${(lER * 100).toFixed(1)}% for sub-5 hooks - validate hook quality before filming`, sampleSize: highScore.length, color: '#22c55e' });
  }

  // Rule 3: top emotion
  const emoMap: Record<string, { posts: AnalysedPost[] }> = {};
  for (const p of posts) {
    for (const e of p.emotions) {
      const k = e.toLowerCase();
      if (!emoMap[k]) emoMap[k] = { posts: [] };
      emoMap[k].posts.push(p);
    }
  }
  const topEmoEntry = Object.entries(emoMap).sort((a, b) => b[1].posts.length - a[1].posts.length)[0];
  if (topEmoEntry && topEmoEntry[1].posts.length >= 2) {
    const [emotion, data] = topEmoEntry;
    const avgER = data.posts.reduce((s, p) => s + p.engagementRate, 0) / data.posts.length;
    rules.push({ label: `"${emotion}" drives engagement`, finding: `${data.posts.length} top posts trigger ${emotion} - lean into this emotion when writing hooks and captions`, sampleSize: data.posts.length, color: '#833ab4' });
  }

  return rules;
}

interface Props { posts: AnalysedPost[]; }

export function RuleCards({ posts }: Props) {
  const rules = deriveRules(posts);
  if (rules.length === 0) return null;

  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
          <Lightbulb size={12} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-900">Emerging Rules</p>
          <p className="text-[10px] text-neutral-400">Patterns derived from AI-analysed posts in this window</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {rules.map((rule, i) => (
          <motion.div key={rule.label}
            className="rounded-xl p-3.5 space-y-2"
            style={{ border: `1px solid ${rule.color}22`, backgroundColor: `${rule.color}08` }}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: rule.color }}>{rule.label}</p>
            <p className="text-[11px] text-neutral-700 leading-relaxed">{rule.finding}</p>
            <p className="text-[9px] text-neutral-400">{rule.sampleSize} posts</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
