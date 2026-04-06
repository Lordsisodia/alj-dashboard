import { query } from "./_generated/server";

export const getApprovals = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("approvals").collect();
    return rows.sort((a, b) => {
      const order = { pending: 0, revision: 1, approved: 2, published: 3 };
      return (order[a.status as keyof typeof order] ?? 0) - (order[b.status as keyof typeof order] ?? 0);
    });
  },
});
