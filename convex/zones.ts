import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireMembership } from "./lib/auth";
import { zoneDoc } from "./lib/validators";

export const listPublic = query({
  args: { tenantId: v.id("tenants") },
  returns: v.array(zoneDoc),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("zones")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    tenantId: v.id("tenants"),
    zoneId: v.optional(v.id("zones")),
    name: v.string(),
    slug: v.string(),
    included: v.boolean(),
    surchargeCents: v.number(),
    exampleCities: v.array(v.string()),
  },
  returns: v.id("zones"),
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.tenantId);
    if (args.surchargeCents < 0) {
      throw new Error("El recargo no puede ser negativo");
    }
    if (args.zoneId) {
      const existing = await ctx.db.get(args.zoneId);
      if (!existing || existing.tenantId !== args.tenantId) {
        throw new Error("Zona no encontrada");
      }
      await ctx.db.patch(args.zoneId, {
        name: args.name,
        slug: args.slug,
        included: args.included,
        surchargeCents: args.surchargeCents,
        exampleCities: args.exampleCities,
      });
      return args.zoneId;
    }
    return await ctx.db.insert("zones", {
      tenantId: args.tenantId,
      name: args.name,
      slug: args.slug,
      included: args.included,
      surchargeCents: args.surchargeCents,
      exampleCities: args.exampleCities,
    });
  },
});
