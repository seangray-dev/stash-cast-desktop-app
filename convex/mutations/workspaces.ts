import { v } from "convex/values";

import { mutation } from "../_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const createWorkspace = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("personal"), v.literal("public")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      type: args.type,
      modifiedAt: Date.now(),
      userId: user._id,
    });

    return workspaceId;
  },
});

export const deleteWorkspace = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.workspaceId);
  },
});
