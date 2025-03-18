import { UserJSON } from "@clerk/backend";
import { Validator, v } from "convex/values";

import { Doc, Id } from "../_generated/dataModel";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  query,
} from "../_generated/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      clerkId: data.id,
      email: data.email_addresses[0].email_address,
      firstName: data.first_name ?? "",
      lastName: data.last_name ?? "",
      image: data.image_url ?? "",
      modifiedAt: Date.now(),
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      const userId = await ctx.db.insert("users", userAttributes);
      // Create initial user environment
      await initializeUserEnvironment(ctx, userId, userAttributes.firstName);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkId(ctx, identity.subject);
}

async function userByClerkId(ctx: QueryCtx | MutationCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}

async function initializeUserEnvironment(
  ctx: MutationCtx,
  userId: Id<"users">,
  userFirstName: string
) {
  // Create studio with default settings
  const studioId = await ctx.db.insert("studio", {
    userId,
    screen: "screen_1",
    mic: "default",
    camera: "default",
    preset: "SD",
    modifiedAt: Date.now(),
  });

  // Create free subscription
  const subscriptionId = await ctx.db.insert("subscription", {
    userId,
    customerId: "", // Will be populated when user upgrades
    plan: "free",
    modifiedAt: Date.now(),
  });

  // Create personal workspace
  const workspaceId = await ctx.db.insert("workspaces", {
    userId,
    name: `${userFirstName}'s Personal Workspace`,
    type: "personal",
    modifiedAt: Date.now(),
  });

  // Update user with references
  await ctx.db.patch(userId, {
    studioId,
    subscriptionId,
    workspaces: [workspaceId],
    trial: true, // Start with trial enabled
  });
}
