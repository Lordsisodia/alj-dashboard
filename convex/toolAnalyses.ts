import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Save an analysis result ───────────────────────────────────────────────────

export const save = mutation({
  args: {
    label:        v.optional(v.string()),
    videoUrl:     v.string(),
    systemPrompt: v.string(),
    model:        v.string(),
    transcript:   v.optional(v.string()),
    hookScore:    v.number(),
    hookLine:     v.string(),
    emotions:     v.array(v.string()),
    breakdown:    v.string(),
    suggestions:  v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("toolAnalyses", {
      ...args,
      analyzedAt:     now,
      lastActivityAt: now,
      chatHistory:    [],
    });
  },
});

// ── Append a follow-up chat message ──────────────────────────────────────────

export const appendChatMessage = mutation({
  args: {
    id:      v.id("toolAnalyses"),
    role:    v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, { id, role, content }) => {
    const doc = await ctx.db.get(id);
    if (!doc) throw new Error("Session not found");
    const msg = { role, content, ts: Date.now() };
    await ctx.db.patch(id, {
      chatHistory:    [...(doc.chatHistory ?? []), msg],
      lastActivityAt: Date.now(),
    });
  },
});

// ── Update session label ──────────────────────────────────────────────────────

export const setLabel = mutation({
  args: {
    id:    v.id("toolAnalyses"),
    label: v.string(),
  },
  handler: async (ctx, { id, label }) => {
    await ctx.db.patch(id, { label });
  },
});

// ── Delete a session ──────────────────────────────────────────────────────────

export const remove = mutation({
  args: { id: v.id("toolAnalyses") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ── List sessions, most recently active first ─────────────────────────────────

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    return ctx.db
      .query("toolAnalyses")
      .withIndex("by_analyzed_at")
      .order("desc")
      .take(limit);
  },
});
