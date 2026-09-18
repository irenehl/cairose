import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireMembership } from "./lib/auth";
import { deliveryStatus } from "./lib/validators";

const deliveryRow = v.object({
  _id: v.id("deliveries"),
  _creationTime: v.number(),
  tenantId: v.id("tenants"),
  subscriptionId: v.id("subscriptions"),
  scheduledFor: v.number(),
  status: deliveryStatus,
  notes: v.optional(v.string()),
  floristNotes: v.optional(v.string()),
  productName: v.string(),
  recipientName: v.string(),
  payerName: v.string(),
  addressLine1: v.string(),
});

export const listMine = query({
  args: { tenantId: v.id("tenants") },
  returns: v.array(deliveryRow),
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.tenantId);
    const deliveries = await ctx.db
      .query("deliveries")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
    const out = [];
    for (const delivery of deliveries) {
      const subscription = await ctx.db.get(delivery.subscriptionId);
      if (!subscription) continue;
      const product = await ctx.db.get(subscription.productId);
      const recipient = await ctx.db.get(subscription.recipientId);
      const payer = await ctx.db.get(subscription.payerCustomerId);
      const address = await ctx.db.get(subscription.addressId);
      if (!product || !recipient || !payer || !address) continue;
      out.push({
        _id: delivery._id,
        _creationTime: delivery._creationTime,
        tenantId: delivery.tenantId,
        subscriptionId: delivery.subscriptionId,
        scheduledFor: delivery.scheduledFor,
        status: delivery.status,
        notes: delivery.notes,
        floristNotes: delivery.floristNotes,
        productName: product.name,
        recipientName: recipient.name,
        payerName: payer.name,
        addressLine1: address.line1,
      });
    }
    out.sort((a, b) => a.scheduledFor - b.scheduledFor);
    return out;
  },
});

export const updateStatus = mutation({
  args: {
    deliveryId: v.id("deliveries"),
    status: deliveryStatus,
    floristNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const delivery = await ctx.db.get(args.deliveryId);
    if (!delivery) throw new Error("Entrega no encontrada");
    await requireMembership(ctx, delivery.tenantId);
    await ctx.db.patch(args.deliveryId, {
      status: args.status,
      floristNotes: args.floristNotes,
    });
    return null;
  },
});
