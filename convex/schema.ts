import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const PRESET = v.union(v.literal("HD"), v.literal("SD"));
const TYPE = v.union(v.literal("personal"), v.literal("public"));
const SUBSCRIPTION_PLAN = v.union(v.literal("free"), v.literal("pro"));

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    image: v.string(),
    trial: v.optional(v.boolean()),
    studioId: v.optional(v.id("studio")),
    workspaces: v.optional(v.array(v.id("workspaces"))),
    videos: v.optional(v.array(v.id("videos"))),
    subscriptionId: v.optional(v.id("subscription")),
    members: v.optional(v.array(v.id("members"))),
    notifications: v.optional(v.array(v.id("notifications"))),
    senders: v.optional(v.array(v.id("senders"))),
    receivers: v.optional(v.array(v.id("receivers"))),
    modifiedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  studio: defineTable({
    userId: v.id("users"),
    screen: v.string(),
    mic: v.string(),
    camera: v.string(),
    preset: PRESET,
    modifiedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  workspaces: defineTable({
    userId: v.id("users"),
    folders: v.optional(v.array(v.id("folders"))),
    videos: v.optional(v.array(v.id("videos"))),
    members: v.optional(v.array(v.id("members"))),
    invites: v.optional(v.array(v.id("invites"))),
    name: v.string(),
    type: TYPE,
    modifiedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  videos: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    folderId: v.id("folders"),
    title: v.string(),
    description: v.string(),
    source: v.string(),
    processing: v.boolean(),
    views: v.number(),
    modifiedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_folder", ["folderId"]),

  folders: defineTable({
    workspaceId: v.id("workspaces"),
    videos: v.optional(v.array(v.id("videos"))),
    name: v.string(),
    modifiedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  subscription: defineTable({
    userId: v.id("users"),
    customerId: v.string(),
    plan: SUBSCRIPTION_PLAN,
    modifiedAt: v.number(),
  }).index("by_user", ["userId"]),

  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    modifiedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    content: v.string(),
    modifiedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  invites: defineTable({
    userId: v.id("users"),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    workspaceId: v.id("workspaces"),
    content: v.string(),
    accepted: v.boolean(),
    modifiedAt: v.number(),
  })
    .index("by_receiver", ["receiverId"])
    .index("by_sender", ["senderId"])
    .index("by_workspace", ["workspaceId"]),
});
