import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireMembership, isValidSlug } from "./lib/auth";
import { saasStatus, tenantPublic } from "./lib/validators";

export const getPublicBySlug = query({
  args: { slug: v.string() },
  returns: v.union(tenantPublic, v.null()),
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!tenant) return null;
    return {
      _id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      logoUrl: tenant.logoUrl,
      primaryColor: tenant.primaryColor,
      accentColor: tenant.accentColor,
      customDomain: tenant.customDomain,
      saasStatus: tenant.saasStatus,
      saasPlanPriceCents: tenant.saasPlanPriceCents,
      currency: tenant.currency,
      whatsappOps: tenant.whatsappOps,
      outsideZoneSurchargeCents: tenant.outsideZoneSurchargeCents,
      tagline: tenant.tagline,
    };
  },
});

export const getMine = query({
  args: {},
  returns: v.union(tenantPublic, v.null()),
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

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!membership) return null;

    const tenant = await ctx.db.get(membership.tenantId);
    if (!tenant) return null;

    return {
      _id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      logoUrl: tenant.logoUrl,
      primaryColor: tenant.primaryColor,
      accentColor: tenant.accentColor,
      customDomain: tenant.customDomain,
      saasStatus: tenant.saasStatus,
      saasPlanPriceCents: tenant.saasPlanPriceCents,
      currency: tenant.currency,
      whatsappOps: tenant.whatsappOps,
      outsideZoneSurchargeCents: tenant.outsideZoneSurchargeCents,
      tagline: tenant.tagline,
    };
  },
});

export const updateBranding = mutation({
  args: {
    tenantId: v.id("tenants"),
    name: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    whatsappOps: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.tenantId);
    const patch: {
      name?: string;
      logoUrl?: string;
      primaryColor?: string;
      accentColor?: string;
      whatsappOps?: string;
    } = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.logoUrl !== undefined) patch.logoUrl = args.logoUrl;
    if (args.primaryColor !== undefined) patch.primaryColor = args.primaryColor;
    if (args.accentColor !== undefined) patch.accentColor = args.accentColor;
    if (args.whatsappOps !== undefined) patch.whatsappOps = args.whatsappOps;
    await ctx.db.patch(args.tenantId, patch);
    return null;
  },
});

export const updateSlug = mutation({
  args: {
    tenantId: v.id("tenants"),
    slug: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.tenantId);
    const slug = args.slug.trim().toLowerCase();
    if (!isValidSlug(slug)) {
      throw new Error("Slug inválido: usá minúsculas, números y guiones");
    }
    const existing = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing && existing._id !== args.tenantId) {
      throw new Error("Ese slug ya está en uso");
    }
    await ctx.db.patch(args.tenantId, { slug });
    return null;
  },
});

export const updateSaasStatus = mutation({
  args: {
    tenantId: v.id("tenants"),
    saasStatus,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.tenantId);
    await ctx.db.patch(args.tenantId, { saasStatus: args.saasStatus });
    return null;
  },
});
