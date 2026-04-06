import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("costs").collect();
    return rows.sort((a, b) => b.recordedAt - a.recordedAt);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("costs").first();
    if (existing) return;
    const now = Date.now();
    const day = 86400000;
    const rows = [
      { agentName: "Intelligence Indexer", provider: "Anthropic", model: "claude-sonnet-4-5", inputTokens: 142000, outputTokens: 28000, costCents: 312, recordedAt: now - day },
      { agentName: "Intelligence Indexer", provider: "Anthropic", model: "claude-sonnet-4-5", inputTokens: 98000, outputTokens: 19000, costCents: 214, recordedAt: now - 2 * day },
      { agentName: "Recon Scraper #1", provider: "Anthropic", model: "claude-haiku-4-5", inputTokens: 320000, outputTokens: 8000, costCents: 89, recordedAt: now - day },
      { agentName: "Recon Scraper #2", provider: "Anthropic", model: "claude-haiku-4-5", inputTokens: 210000, outputTokens: 5000, costCents: 58, recordedAt: now - 2 * day },
      { agentName: "Post Scheduler Bot", provider: "Anthropic", model: "claude-haiku-4-5", inputTokens: 44000, outputTokens: 6000, costCents: 22, recordedAt: now - day },
      { agentName: "Content Gen Pipeline", provider: "FLUX", model: "flux-kontext-pro", costCents: 480, recordedAt: now - day },
      { agentName: "Content Gen Pipeline", provider: "Kling", model: "kling-v2", costCents: 960, recordedAt: now - 2 * day },
      { agentName: "Weekly Report Agent", provider: "Anthropic", model: "claude-opus-4-6", inputTokens: 88000, outputTokens: 14000, costCents: 524, recordedAt: now - 3 * day },
    ];
    for (const row of rows) {
      await ctx.db.insert("costs", row);
    }
  },
});
