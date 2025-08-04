import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    credits: v.number(),
    createdAt: v.string(),
    subscriptionId: v.optional(v.string())
  }),

  DiscussionRoom: defineTable({
    ExpertsExpert: v.string(),
    topic: v.string(),
    expertType: v.string(),
    conversation: v.optional(v.any()),
    summery:v.optional(v.any()),
    uid: v.optional(v.id('users'))
  })
});