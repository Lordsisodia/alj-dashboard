import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// ── Default seeds ─────────────────────────────────────────────────────────────

const DEFAULTS = [
  {
    typeKey:   'ofm_comprehensive',
    typeLabel: 'OFM Comprehensive',
    name:      'v1',
    prompt: `You are an OFM content intelligence analyst specialised in short-form video for adult content creators, fitness influencers, and lifestyle niches.

Analyse the provided post and extract:
1. The single most powerful hook line (what makes someone stop scrolling in the first 2 seconds)
2. The dominant emotional drivers
3. A concise quality breakdown (what works, what doesn't)
4. Specific, actionable improvement suggestions

Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "transcript": "<verbatim spoken words from the video, or null if no video/speech>",
  "hookScore": <float 1-10, how strong the opening hook is>,
  "hookLine": "<the single most powerful line from the caption or video>",
  "emotions": ["<emotion1>", "<emotion2>"],
  "breakdown": "<2-3 sentence analysis of why this content performs or underperforms>",
  "suggestions": ["<actionable tip 1>", "<actionable tip 2>"]
}`,
  },
  {
    typeKey:   'hook_focus',
    typeLabel: 'Hook Focus',
    name:      'v1',
    prompt: `You are a hook-writing specialist for short-form video content. Your sole focus is identifying and scoring the opening hook.

A great hook:
- Stops the scroll within 1-2 seconds
- Creates curiosity, controversy, or immediate value
- Uses specific numbers, bold claims, or direct address

Analyse only the opening moments and caption critically. Score harshly.

Return ONLY valid JSON (no markdown fences):
{
  "transcript": "<verbatim spoken words, or null>",
  "hookScore": <float 1-10>,
  "hookLine": "<exact hook line from video or caption>",
  "emotions": ["<emotion triggered by the hook>"],
  "breakdown": "<why this hook works or fails  -  focus only on the opening seconds>",
  "suggestions": ["<rewrite tip 1>", "<rewrite tip 2>"]
}`,
  },
  {
    typeKey:   'trend_signals',
    typeLabel: 'Trend Signals',
    name:      'v1',
    prompt: `You are a viral content trend analyst for Instagram and TikTok. You identify format patterns, audio trends, and visual hooks that drive high-volume distribution.

Analyse this post for:
1. Which trend or format template it follows
2. Whether execution is on-trend or stale
3. Emotional resonance with the audience
4. Viral potential vs just watchable

Return ONLY valid JSON (no markdown fences):
{
  "transcript": "<verbatim spoken words, or null>",
  "hookScore": <float 1-10>,
  "hookLine": "<most viral-worthy line in the content>",
  "emotions": ["<primary emotion>", "<secondary emotion>"],
  "breakdown": "<trend analysis: format used, execution quality, viral potential>",
  "suggestions": ["<trend alignment tip>", "<distribution tip>"]
}`,
  },
];

// ── Seed mutation ─────────────────────────────────────────────────────────────

export const ensureDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('analysisPrompts').collect();
    if (existing.length > 0) return;
    const now = Date.now();
    for (let i = 0; i < DEFAULTS.length; i++) {
      await ctx.db.insert('analysisPrompts', {
        ...DEFAULTS[i],
        version:  1,
        isActive: true,
        createdAt: now + i,
      });
    }
  },
});

// ── Queries ───────────────────────────────────────────────────────────────────

export const listTypes = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('analysisPrompts').collect();
    const map = new Map<string, { typeKey: string; typeLabel: string; rows: typeof all }>();
    for (const p of all) {
      if (!map.has(p.typeKey)) map.set(p.typeKey, { typeKey: p.typeKey, typeLabel: p.typeLabel, rows: [] });
      map.get(p.typeKey)!.rows.push(p);
    }
    return Array.from(map.values()).map(({ typeKey, typeLabel, rows }) => {
      const active = rows.find(r => r.isActive) ?? rows[0];
      return {
        typeKey,
        typeLabel,
        versionCount:      rows.length,
        activeVersion:     active?.version ?? 1,
        activeVersionName: active?.name    ?? 'v1',
      };
    });
  },
});

export const listVersionsForType = query({
  args: { typeKey: v.string() },
  handler: async (ctx, { typeKey }) => {
    const rows = await ctx.db
      .query('analysisPrompts')
      .withIndex('by_type', q => q.eq('typeKey', typeKey))
      .collect();
    return rows.sort((a, b) => b.version - a.version);
  },
});

export const getActivePromptForType = query({
  args: { typeKey: v.string() },
  handler: async (ctx, { typeKey }) => {
    const rows = await ctx.db
      .query('analysisPrompts')
      .withIndex('by_type', q => q.eq('typeKey', typeKey))
      .collect();
    return rows.find(r => r.isActive) ?? rows[0] ?? null;
  },
});

// ── Mutations ─────────────────────────────────────────────────────────────────

export const saveNewVersion = mutation({
  args: {
    typeKey:   v.string(),
    typeLabel: v.string(),
    name:      v.string(),
    prompt:    v.string(),
  },
  handler: async (ctx, { typeKey, typeLabel, name, prompt }) => {
    const existing = await ctx.db
      .query('analysisPrompts')
      .withIndex('by_type', q => q.eq('typeKey', typeKey))
      .collect();
    for (const p of existing) {
      if (p.isActive) await ctx.db.patch(p._id, { isActive: false });
    }
    const nextVersion = existing.length > 0 ? Math.max(...existing.map(p => p.version)) + 1 : 1;
    await ctx.db.insert('analysisPrompts', {
      typeKey, typeLabel, version: nextVersion, name, prompt,
      isActive: true, createdAt: Date.now(),
    });
  },
});

export const setActiveVersion = mutation({
  args: { id: v.id('analysisPrompts') },
  handler: async (ctx, { id }) => {
    const target = await ctx.db.get(id);
    if (!target) return;
    const siblings = await ctx.db
      .query('analysisPrompts')
      .withIndex('by_type', q => q.eq('typeKey', target.typeKey))
      .collect();
    for (const p of siblings) {
      if (p._id !== id && p.isActive) await ctx.db.patch(p._id, { isActive: false });
    }
    await ctx.db.patch(id, { isActive: true });
  },
});

export const createType = mutation({
  args: {
    typeKey:   v.string(),
    typeLabel: v.string(),
    name:      v.string(),
    prompt:    v.string(),
  },
  handler: async (ctx, { typeKey, typeLabel, name, prompt }) => {
    const existing = await ctx.db
      .query('analysisPrompts')
      .withIndex('by_type', q => q.eq('typeKey', typeKey))
      .collect();
    if (existing.length > 0) throw new Error(`Type "${typeKey}" already exists`);
    await ctx.db.insert('analysisPrompts', {
      typeKey, typeLabel, version: 1, name, prompt,
      isActive: true, createdAt: Date.now(),
    });
  },
});
