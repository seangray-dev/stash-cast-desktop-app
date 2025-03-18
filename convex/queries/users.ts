import { query } from "../_generated/server";
import { getUserId } from "../util";

export const getMyUser = query({
  args: {},
  async handler(ctx) {
    const userId = await getUserId(ctx);

    if (!userId) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    return user;
  },
});
