import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const saasStatus = v.union(
  v.literal("trialing"),
  v.literal("active"),
  v.literal("past_due"),
  v.literal("canceled"),
);

const membershipRole = v.union(v.literal("owner"), v.literal("staff"));

const productType = v.union(v.literal("bouquet"), v.literal("box"));

const productTier = v.union(
  v.literal("lite"),
  v.literal("classic"),
  v.literal("luxe"),
);

const cadence = v.union(
  v.literal("weekly"),
  v.literal("biweekly"),
  v.literal("monthly"),
);

const subscriptionStatus = v.union(
  v.literal("active"),
  v.literal("paused"),
  v.literal("canceled"),
);

const paymentStatus = v.union(
  v.literal("awaiting_florist_payment"),
  v.literal("paid_outside"),
  v.literal("coming_soon"),
);

const subscriptionEventType = v.union(
  v.literal("skip_next"),
  v.literal("pause"),
  v.literal("resume"),
  v.literal("cancel"),
  v.literal("change_address"),
  v.literal("change_cadence"),
);

const deliveryStatus = v.union(
  v.literal("scheduled"),
  v.literal("out_for_delivery"),
  v.literal("delivered"),
  v.literal("failed_nobody_home"),
  v.literal("failed_other"),
);

export default defineSchema({
  tenants: defineTable({
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
  }).index("by_slug", ["slug"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    clerkUserId: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    name: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk", ["clerkUserId"]),

  memberships: defineTable({
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    role: membershipRole,
  })
    .index("by_user", ["userId"])
    .index("by_tenant", ["tenantId"])
    .index("by_user_and_tenant", ["userId", "tenantId"]),

  products: defineTable({
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
  })
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_and_sku", ["tenantId", "sku"]),

  addOns: defineTable({
    tenantId: v.id("tenants"),
    sku: v.string(),
    name: v.string(),
    priceCents: v.number(),
    active: v.boolean(),
  }).index("by_tenant", ["tenantId"]),

  zones: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    slug: v.string(),
    included: v.boolean(),
    surchargeCents: v.number(),
    exampleCities: v.array(v.string()),
  }).index("by_tenant", ["tenantId"]),

  customers: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  }).index("by_tenant", ["tenantId"]),

  recipients: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    phone: v.optional(v.string()),
  }).index("by_tenant", ["tenantId"]),

  addresses: defineTable({
    tenantId: v.id("tenants"),
    recipientId: v.optional(v.id("recipients")),
    line1: v.string(),
    colonia: v.optional(v.string()),
    notes: v.optional(v.string()),
    zoneId: v.optional(v.id("zones")),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_recipient", ["recipientId"]),

  subscriptions: defineTable({
    tenantId: v.id("tenants"),
    payerCustomerId: v.id("customers"),
    recipientId: v.id("recipients"),
    productId: v.id("products"),
    addressId: v.id("addresses"),
    cadence,
    intervalDays: v.number(),
    status: subscriptionStatus,
    nextDeliveryAt: v.number(),
    paymentStatus,
    isGift: v.boolean(),
    cardMessage: v.optional(v.string()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_and_status", ["tenantId", "status"])
    .index("by_payer", ["payerCustomerId"]),

  subscriptionAddOns: defineTable({
    subscriptionId: v.id("subscriptions"),
    addOnId: v.id("addOns"),
  }).index("by_subscription", ["subscriptionId"]),

  subscriptionEvents: defineTable({
    tenantId: v.id("tenants"),
    subscriptionId: v.id("subscriptions"),
    type: subscriptionEventType,
    note: v.optional(v.string()),
    createdAt: v.number(),
    payload: v.optional(v.string()),
  }).index("by_subscription", ["subscriptionId"]),

  deliveries: defineTable({
    tenantId: v.id("tenants"),
    subscriptionId: v.id("subscriptions"),
    scheduledFor: v.number(),
    status: deliveryStatus,
    notes: v.optional(v.string()),
    floristNotes: v.optional(v.string()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_subscription", ["subscriptionId"])
    .index("by_tenant_and_status", ["tenantId", "status"]),
});
