import { mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  DEMO_ADDONS,
  DEMO_PRODUCTS,
  DEMO_TENANT,
  DEMO_ZONES,
  usdToCents,
} from "./lib/seedPack";

/**
 * Idempotent demo seed. Run with: `npx convex run seed:seedDemo`
 * Re-run with `{ force: true }` to replace casa-limon catalog/zones (keeps live orders).
 */
export const seedDemo = mutation({
  args: { force: v.optional(v.boolean()) },
  returns: v.object({
    tenantId: v.id("tenants"),
    slug: v.string(),
    already: v.boolean(),
    products: v.number(),
    zones: v.number(),
    addOns: v.number(),
  }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", DEMO_TENANT.slug))
      .unique();

    if (existing && !args.force) {
      const products = await ctx.db
        .query("products")
        .withIndex("by_tenant", (q) => q.eq("tenantId", existing._id))
        .collect();
      const zones = await ctx.db
        .query("zones")
        .withIndex("by_tenant", (q) => q.eq("tenantId", existing._id))
        .collect();
      const addOns = await ctx.db
        .query("addOns")
        .withIndex("by_tenant", (q) => q.eq("tenantId", existing._id))
        .collect();
      return {
        tenantId: existing._id,
        slug: existing.slug,
        already: true,
        products: products.length,
        zones: zones.length,
        addOns: addOns.length,
      };
    }

    const tenantId = existing
      ? existing._id
      : await ctx.db.insert("tenants", {
          name: DEMO_TENANT.name,
          slug: DEMO_TENANT.slug,
          logoUrl: DEMO_TENANT.logoUrl,
          primaryColor: DEMO_TENANT.primaryColor,
          accentColor: DEMO_TENANT.accentColor,
          saasStatus: DEMO_TENANT.saasStatus,
          currency: DEMO_TENANT.currency,
          whatsappOps: DEMO_TENANT.whatsappOps,
          outsideZoneSurchargeCents: DEMO_TENANT.outsideZoneSurchargeCents,
          tagline: DEMO_TENANT.tagline,
        });

    if (existing) {
      await ctx.db.patch(tenantId, {
        name: DEMO_TENANT.name,
        logoUrl: DEMO_TENANT.logoUrl,
        primaryColor: DEMO_TENANT.primaryColor,
        accentColor: DEMO_TENANT.accentColor,
        saasStatus: DEMO_TENANT.saasStatus,
        currency: DEMO_TENANT.currency,
        whatsappOps: DEMO_TENANT.whatsappOps,
        outsideZoneSurchargeCents: DEMO_TENANT.outsideZoneSurchargeCents,
        tagline: DEMO_TENANT.tagline,
      });
    }

    const existingProducts = await ctx.db
      .query("products")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
    for (const product of existingProducts) {
      await ctx.db.delete(product._id);
    }

    const existingZones = await ctx.db
      .query("zones")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
    for (const zone of existingZones) {
      await ctx.db.delete(zone._id);
    }

    const existingAddOns = await ctx.db
      .query("addOns")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
    for (const addOn of existingAddOns) {
      await ctx.db.delete(addOn._id);
    }

    for (const product of DEMO_PRODUCTS) {
      await ctx.db.insert("products", {
        tenantId,
        sku: product.sku,
        name: product.name,
        description: product.description,
        priceCents: usdToCents(product.priceUsd),
        currency: "USD",
        imageUrls: product.imageUrls,
        active: true,
        type: product.type,
        tier: product.tier,
        forSubscription: product.forSubscription,
        forOccasion: product.forOccasion,
      });
    }

    for (const zone of DEMO_ZONES) {
      await ctx.db.insert("zones", {
        tenantId,
        name: zone.name,
        slug: zone.slug,
        included: zone.included,
        surchargeCents: zone.surchargeCents,
        exampleCities: zone.exampleCities,
      });
    }

    for (const addOn of DEMO_ADDONS) {
      await ctx.db.insert("addOns", {
        tenantId,
        sku: addOn.sku,
        name: addOn.name,
        priceCents: usdToCents(addOn.priceUsd),
        active: true,
      });
    }

    return {
      tenantId,
      slug: DEMO_TENANT.slug,
      already: false,
      products: DEMO_PRODUCTS.length,
      zones: DEMO_ZONES.length,
      addOns: DEMO_ADDONS.length,
    };
  },
});
