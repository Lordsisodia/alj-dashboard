import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const MAX_LEN = 8000; // truncate huge payloads before storing
function trunc(s: string) { return s.length > MAX_LEN ? s.slice(0, MAX_LEN) + '...[truncated]' : s; }

// ── Save a debug log entry ────────────────────────────────────────────────────

export const save = mutation({
  args: {
    agentId:   v.string(),
    stage:     v.string(),
    input:     v.string(),
    output:    v.string(),
    model:     v.string(),
    provider:  v.string(),
    tokens:    v.optional(v.object({
      input:  v.number(),
      output: v.number(),
      total:  v.number(),
    })),
    latencyMs: v.number(),
    status:    v.union(v.literal("ok"), v.literal("error")),
    error:     v.optional(v.string()),
    jobId:     v.optional(v.string()),
    runId:     v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("agentDebugLogs", {
      ...args,
      input:  trunc(args.input),
      output: trunc(args.output),
      timestamp: Date.now(),
    });
  },
});

// ── List logs, newest first ───────────────────────────────────────────────────

export const list = query({
  args: {
    limit:   v.optional(v.number()),
    agentId: v.optional(v.string()),
    status:  v.optional(v.union(v.literal("ok"), v.literal("error"))),
  },
  handler: async (ctx, { limit = 200, agentId, status }) => {
    if (agentId) {
      return ctx.db
        .query("agentDebugLogs")
        .withIndex("by_agent", q => q.eq("agentId", agentId))
        .order("desc")
        .take(limit);
    }
    if (status) {
      return ctx.db
        .query("agentDebugLogs")
        .withIndex("by_status", q => q.eq("status", status))
        .order("desc")
        .take(limit);
    }
    return ctx.db
      .query("agentDebugLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);
  },
});
