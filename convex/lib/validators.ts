import { v } from "convex/values";

export const saasStatus = v.union(
  v.literal("trialing"),
  v.literal("active"),
  v.literal("past_due"),
  v.literal("canceled"),
);

export const membershipRole = v.union(v.literal("owner"), v.literal("staff"));

export const productType = v.union(v.literal("bouquet"), v.literal("box"));

export const productTier = v.union(
  v.literal("lite"),
  v.literal("classic"),
  v.literal("luxe"),
);

export const cadence = v.union(
  v.literal("weekly"),
  v.literal("biweekly"),
  v.literal("monthly"),
);

export const subscriptionStatus = v.union(
  v.literal("active"),
  v.literal("paused"),
  v.literal("canceled"),
);

export const paymentStatus = v.union(
  v.literal("awaiting_florist_payment"),
  v.literal("paid_outside"),
  v.literal("coming_soon"),
);

export const subscriptionEventType = v.union(
  v.literal("skip_next"),
  v.literal("pause"),
  v.literal("resume"),
  v.literal("cancel"),
  v.literal("change_address"),
  v.literal("change_cadence"),
);

export const deliveryStatus = v.union(
  v.literal("scheduled"),
  v.literal("out_for_delivery"),
  v.literal("delivered"),
  v.literal("failed_nobody_home"),
  v.literal("failed_other"),
);

export const tenantPublic = v.object({
  _id: v.id("tenants"),
  _creationTime: v.number(),
  name: v.string(),
  slug: v.string(),
  logoUrl: v.optional(v.string()),
  primaryColor: v.optional(v.string()),
  accentColor: v.optional(v.string()),
  customDomain: v.optional(v.string()),
  saasStatus,
  saasPlanPriceCents: v.optional(v.number()),
  currency: v.literal("USD"),
  whatsappOps: v.optional(v.string()),
  outsideZoneSurchargeCents: v.optional(v.number()),
  tagline: v.optional(v.string()),
});

export const productDoc = v.object({
  _id: v.id("products"),
  _creationTime: v.number(),
  tenantId: v.id("tenants"),
  sku: v.string(),
  name: v.string(),
  description: v.string(),
  priceCents: v.number(),
  currency: v.literal("USD"),
  imageUrls: v.array(v.string()),
  active: v.boolean(),
  type: v.optional(productType),
  tier: v.optional(productTier),
  forSubscription: v.boolean(),
  forOccasion: v.boolean(),
});

export const addOnDoc = v.object({
  _id: v.id("addOns"),
  _creationTime: v.number(),
  tenantId: v.id("tenants"),
  sku: v.string(),
  name: v.string(),
  priceCents: v.number(),
  active: v.boolean(),
});

export const zoneDoc = v.object({
  _id: v.id("zones"),
  _creationTime: v.number(),
  tenantId: v.id("tenants"),
  name: v.string(),
  slug: v.string(),
  included: v.boolean(),
  surchargeCents: v.number(),
  exampleCities: v.array(v.string()),
});
