import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

type DbCtx = QueryCtx | MutationCtx;

export async function getCurrentUser(
  ctx: DbCtx,
): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function requireMembership(
  ctx: DbCtx,
  tenantId: Id<"tenants">,
): Promise<{ user: Doc<"users">; membership: Doc<"memberships"> }> {
  const user = await getCurrentUser(ctx);
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_user_and_tenant", (q) =>
      q.eq("userId", user._id).eq("tenantId", tenantId),
    )
    .unique();

  if (!membership) {
    throw new Error("Unauthorized: not a member of this florist");
  }

  return { user, membership };
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function intervalDaysForCadence(
  cadence: "weekly" | "biweekly" | "monthly",
): number {
  if (cadence === "weekly") return 7;
  if (cadence === "biweekly") return 14;
  return 28;
}
