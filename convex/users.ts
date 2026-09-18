import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const userPublic = v.object({
  _id: v.id("users"),
  tokenIdentifier: v.string(),
  clerkUserId: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  name: v.optional(v.string()),
});

export const ensureMe = mutation({
  args: {},
  returns: userPublic,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    const email =
      typeof identity.email === "string" ? identity.email : undefined;
    const name =
      typeof identity.name === "string"
        ? identity.name
        : typeof identity.givenName === "string"
          ? identity.givenName
          : undefined;
    const phone =
      typeof identity.phoneNumber === "string"
        ? identity.phoneNumber
        : undefined;
    const clerkUserId = identity.subject;

    if (existing) {
      await ctx.db.patch(existing._id, {
        email,
        name,
        phone,
        clerkUserId,
      });
      const updated = await ctx.db.get(existing._id);
      if (!updated) throw new Error("User not found after patch");
      return {
        _id: updated._id,
        tokenIdentifier: updated.tokenIdentifier,
        clerkUserId: updated.clerkUserId,
        email: updated.email,
        phone: updated.phone,
        name: updated.name,
      };
    }

    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      clerkUserId,
      email,
      phone,
      name,
    });

    // First signed-in florist without a shop is attached to the demo tenant.
    await claimDemoIfNeeded(ctx, userId);

    const created = await ctx.db.get(userId);
    if (!created) throw new Error("User not found after insert");
    return {
      _id: created._id,
      tokenIdentifier: created.tokenIdentifier,
      clerkUserId: created.clerkUserId,
      email: created.email,
      phone: created.phone,
      name: created.name,
    };
  },
});

export const me = query({
  args: {},
  returns: v.union(userPublic, v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return null;
    return {
      _id: user._id,
      tokenIdentifier: user.tokenIdentifier,
      clerkUserId: user.clerkUserId,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };
  },
});

async function claimDemoIfNeeded(
  ctx: { db: MutationDb },
  userId: Id<"users">,
): Promise<void> {
  const existingMembership = await ctx.db
    .query("memberships")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  if (existingMembership) return;

  const demo = await ctx.db
    .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", "casa-limon"))
    .unique();
  if (!demo) return;

  await ctx.db.insert("memberships", {
    userId,
    tenantId: demo._id,
    role: "owner",
  });
}

type MutationDb = {
  query: import("./_generated/server").MutationCtx["db"]["query"];
  insert: import("./_generated/server").MutationCtx["db"]["insert"];
};
