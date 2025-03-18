import { query } from "../_generated/server";
import { getCurrentUserOrThrow } from "../mutations/users";

export const getUserNotifications = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return notifications;
  },
});
