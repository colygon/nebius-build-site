import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    company: v.string(),
    previousSponsor: v.boolean(),
    telegram: v.optional(v.string()),
    donationAmount: v.optional(v.string()),
    plans: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sponsorInquiries", args);
  },
});
