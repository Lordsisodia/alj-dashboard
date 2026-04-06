import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const NICHE_VALIDATOR = v.union(
  v.literal("GFE"),
  v.literal("Fitness"),
  v.literal("Meme"),
  v.literal("Thirst Trap"),
  v.literal("Lifestyle")
);

// ── List all talent models (active + draft) ───────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("models").collect();
  },
});

// ── List only active talent models ────────────────────────────────────────────

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("models")
      .filter(q => q.eq(q.field("active"), true))
      .collect();
  },
});

// ── Idea count per model - drives stat pills on cards ─────────────────────────

export const ideaCountByModel = query({
  args: {},
  handler: async (ctx) => {
    const ideas = await ctx.db.query("ideas").collect();
    const counts: Record<string, number> = {};
    for (const idea of ideas) {
      const key = idea.modelId as string;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  },
});

// ── Clip count per model - drives stat pills on cards ─────────────────────────

export const clipCountByModel = query({
  args: {},
  handler: async (ctx) => {
    const contents = await ctx.db.query("content").collect();
    const counts: Record<string, number> = {};
    for (const c of contents) {
      const key = c.modelId as string;
      counts[key] = (counts[key] ?? 0) + c.clips.length;
    }
    return counts;
  },
});

// ── Create ─────────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    name:        v.string(),
    niche:       NICHE_VALIDATOR,
    ofHandle:    v.optional(v.string()),
    igHandle:    v.optional(v.string()),
    avatarColor: v.string(),
    active:      v.boolean(),
    bio:         v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("models", args);
  },
});

// ── Update (partial patch) ─────────────────────────────────────────────────────

export const update = mutation({
  args: {
    id:          v.id("models"),
    name:        v.optional(v.string()),
    niche:       v.optional(NICHE_VALIDATOR),
    ofHandle:    v.optional(v.string()),
    igHandle:    v.optional(v.string()),
    avatarColor: v.optional(v.string()),
    active:      v.optional(v.boolean()),
    bio:         v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    const clean = Object.fromEntries(
      Object.entries(patch).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(id, clean);
  },
});

// ── Delete ─────────────────────────────────────────────────────────────────────

export const remove = mutation({
  args: { id: v.id("models") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ── Seed default OFM talent roster (run once) ─────────────────────────────────

export const seedModels = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("models").collect();
    if (existing.length > 0) return { seeded: false, reason: "already seeded" };

    const roster = [
      { name: "Ren",   niche: "GFE"      as const, igHandle: "@rhinxrenx",    avatarColor: "#833ab4", active: true, bio: "Lifestyle & GFE creator. Known for golden hour content." },
      { name: "Tyler", niche: "Fitness"  as const, igHandle: "@onlytylerrex", avatarColor: "#fcaf45", active: true, bio: "Fitness creator. Morning routines, transformation content." },
      { name: "Ella",  niche: "Lifestyle"as const, igHandle: "@ellamira",     avatarColor: "#78c257", active: true, bio: "Soft lifestyle. Apartment tours, aesthetic reels." },
      { name: "Amam",  niche: "GFE"      as const, igHandle: "@abg.ricebunny",avatarColor: "#ff0069", active: true, bio: "GFE creator. Daily grind + premium content." },
    ];

    for (const model of roster) {
      await ctx.db.insert("models", model);
    }

    return { seeded: true, count: roster.length };
  },
});
