import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    roles: v.string(),
    name: v.string(),
    title: v.optional(v.string()),
    email: v.string(),
    company: v.optional(v.string()),
    website: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    twitter: v.optional(v.string()),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("registrations", args);
  },
});
