import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  registrations: defineTable({
    roles: v.string(),
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    website: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    twitter: v.optional(v.string()),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
  }),
});
