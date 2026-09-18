import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireMembership } from "./lib/auth";
import { addOnDoc, productDoc, productTier, productType } from "./lib/validators";

export const listPublic = query({
  args: { tenantId: v.id("tenants") },
  returns: v.array(productDoc),
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
    return products.filter((p) => p.active);
  },
});

export const listMine = query({
  args: { tenantId: v.id("tenants") },
  returns: v.array(productDoc),
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.tenantId);
    return await ctx.db
      .query("products")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  },
});

export const getPublic = query({
  args: { productId: v.id("products") },
  returns: v.union(productDoc, v.null()),
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product || !product.active) return null;
    return product;
  },
});

export const create = mutation({
  args: {
    tenantId: v.id("tenants"),
    sku: v.string(),
    name: v.string(),
    description: v.string(),
    priceCents: v.number(),
    imageUrls: v.array(v.string()),
    active: v.boolean(),
    type: v.optional(productType),
    tier: v.optional(productTier),
    forSubscription: v.boolean(),
    forOccasion: v.boolean(),
  },
  returns: v.id("products"),
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.tenantId);
    if (args.priceCents < 0) {
      throw new Error("El precio no puede ser negativo");
    }
    const sku = args.sku.trim().toLowerCase();
    const duplicate = await ctx.db
      .query("products")
      .withIndex("by_tenant_and_sku", (q) =>
        q.eq("tenantId", args.tenantId).eq("sku", sku),
      )
      .unique();
    if (duplicate) {
      throw new Error("Ya existe un producto con ese SKU");
    }
    return await ctx.db.insert("products", {
      tenantId: args.tenantId,
      sku,
      name: args.name.trim(),
      description: args.description,
      priceCents: args.priceCents,
      currency: "USD",
      imageUrls: args.imageUrls,
      active: args.active,
      type: args.type,
      tier: args.tier,
      forSubscription: args.forSubscription,
      forOccasion: args.forOccasion,
    });
  },
});

export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    priceCents: v.optional(v.number()),
    imageUrls: v.optional(v.array(v.string())),
    active: v.optional(v.boolean()),
    type: v.optional(productType),
    tier: v.optional(productTier),
    forSubscription: v.optional(v.boolean()),
    forOccasion: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Producto no encontrado");
    await requireMembership(ctx, product.tenantId);
    if (args.priceCents !== undefined && args.priceCents < 0) {
      throw new Error("El precio no puede ser negativo");
    }
    await ctx.db.patch(args.productId, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.priceCents !== undefined ? { priceCents: args.priceCents } : {}),
      ...(args.imageUrls !== undefined ? { imageUrls: args.imageUrls } : {}),
      ...(args.active !== undefined ? { active: args.active } : {}),
      ...(args.type !== undefined ? { type: args.type } : {}),
      ...(args.tier !== undefined ? { tier: args.tier } : {}),
      ...(args.forSubscription !== undefined
        ? { forSubscription: args.forSubscription }
        : {}),
      ...(args.forOccasion !== undefined ? { forOccasion: args.forOccasion } : {}),
    });
    return null;
  },
});

export const listAddOnsPublic = query({
  args: { tenantId: v.id("tenants") },
  returns: v.array(addOnDoc),
  handler: async (ctx, args) => {
    const addOns = await ctx.db
      .query("addOns")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
    return addOns.filter((a) => a.active);
  },
});
