import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { intervalDaysForCadence, requireMembership } from "./lib/auth";
import {
  cadence,
  paymentStatus,
  subscriptionEventType,
  subscriptionStatus,
} from "./lib/validators";

const DAY_MS = 24 * 60 * 60 * 1000;

const subscriptionDoc = v.object({
  _id: v.id("subscriptions"),
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
});

const eventDoc = v.object({
  _id: v.id("subscriptionEvents"),
  tenantId: v.id("tenants"),
  subscriptionId: v.id("subscriptions"),
  type: subscriptionEventType,
  note: v.optional(v.string()),
  createdAt: v.number(),
  payload: v.optional(v.string()),
});

export const createGuest = mutation({
  args: {
    tenantSlug: v.string(),
    productId: v.id("products"),
    cadence,
    isGift: v.boolean(),
    payerName: v.string(),
    payerEmail: v.optional(v.string()),
    payerPhone: v.optional(v.string()),
    recipientName: v.string(),
    recipientPhone: v.optional(v.string()),
    addressLine1: v.string(),
    colonia: v.optional(v.string()),
    deliveryNotes: v.optional(v.string()),
    zoneId: v.optional(v.id("zones")),
    cardMessage: v.optional(v.string()),
    addOnIds: v.array(v.id("addOns")),
    now: v.number(),
  },
  returns: v.id("subscriptions"),
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.tenantSlug))
      .unique();
    if (!tenant) throw new Error("Floristería no encontrada");

    const product = await ctx.db.get(args.productId);
    if (!product || product.tenantId !== tenant._id || !product.active) {
      throw new Error("Producto no disponible");
    }
    if (!product.forSubscription) {
      throw new Error("Este producto no es un plan recurrente");
    }

    const payerName = args.payerName.trim();
    const recipientName = args.recipientName.trim();
    if (!payerName || !recipientName) {
      throw new Error("Nombre de quien paga y de quien recibe son obligatorios");
    }
    if (args.cardMessage && args.cardMessage.length > 200) {
      throw new Error("La nota de la tarjeta no puede pasar de 200 caracteres");
    }

    if (args.zoneId) {
      const zone = await ctx.db.get(args.zoneId);
      if (!zone || zone.tenantId !== tenant._id) {
        throw new Error("Zona no válida");
      }
    }

    const isGift =
      args.isGift ||
      payerName.toLowerCase() !== recipientName.toLowerCase();

    const payerCustomerId = await ctx.db.insert("customers", {
      tenantId: tenant._id,
      name: payerName,
      email: args.payerEmail,
      phone: args.payerPhone,
    });

    const recipientId = await ctx.db.insert("recipients", {
      tenantId: tenant._id,
      name: recipientName,
      phone: args.recipientPhone,
    });

    const addressId = await ctx.db.insert("addresses", {
      tenantId: tenant._id,
      recipientId,
      line1: args.addressLine1.trim(),
      colonia: args.colonia,
      notes: args.deliveryNotes,
      zoneId: args.zoneId,
    });

    const intervalDays = intervalDaysForCadence(args.cadence);
    const nextDeliveryAt = args.now + intervalDays * DAY_MS;

    const subscriptionId = await ctx.db.insert("subscriptions", {
      tenantId: tenant._id,
      payerCustomerId,
      recipientId,
      productId: product._id,
      addressId,
      cadence: args.cadence,
      intervalDays,
      status: "active",
      nextDeliveryAt,
      paymentStatus: "awaiting_florist_payment",
      isGift,
      cardMessage: args.cardMessage,
    });

    for (const addOnId of args.addOnIds) {
      const addOn = await ctx.db.get(addOnId);
      if (!addOn || addOn.tenantId !== tenant._id || !addOn.active) {
        throw new Error("Add-on no válido");
      }
      await ctx.db.insert("subscriptionAddOns", {
        subscriptionId,
        addOnId,
      });
    }

    await ctx.db.insert("deliveries", {
      tenantId: tenant._id,
      subscriptionId,
      scheduledFor: nextDeliveryAt,
      status: "scheduled",
      notes: args.deliveryNotes,
    });

    return subscriptionId;
  },
});

export const getPublic = query({
  args: { subscriptionId: v.id("subscriptions") },
  returns: v.union(
    v.object({
      subscription: subscriptionDoc,
      productName: v.string(),
      shopName: v.string(),
      shopSlug: v.string(),
      whatsappOps: v.optional(v.string()),
      payerName: v.string(),
      recipientName: v.string(),
      addressLine1: v.string(),
      colonia: v.optional(v.string()),
      events: v.array(eventDoc),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription) return null;
    const [product, tenant, payer, recipient, address, events] =
      await Promise.all([
        ctx.db.get(subscription.productId),
        ctx.db.get(subscription.tenantId),
        ctx.db.get(subscription.payerCustomerId),
        ctx.db.get(subscription.recipientId),
        ctx.db.get(subscription.addressId),
        ctx.db
          .query("subscriptionEvents")
          .withIndex("by_subscription", (q) =>
            q.eq("subscriptionId", subscription._id),
          )
          .collect(),
      ]);
    if (!product || !tenant || !payer || !recipient || !address) return null;
    return {
      subscription,
      productName: product.name,
      shopName: tenant.name,
      shopSlug: tenant.slug,
      whatsappOps: tenant.whatsappOps,
      payerName: payer.name,
      recipientName: recipient.name,
      addressLine1: address.line1,
      colonia: address.colonia,
      events,
    };
  },
});

export const listMine = query({
  args: { tenantId: v.id("tenants") },
  returns: v.array(
    v.object({
      subscription: subscriptionDoc,
      productName: v.string(),
      payerName: v.string(),
      recipientName: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.tenantId);
    const rows = await ctx.db
      .query("subscriptions")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
    const out = [];
    for (const subscription of rows) {
      const product = await ctx.db.get(subscription.productId);
      const payer = await ctx.db.get(subscription.payerCustomerId);
      const recipient = await ctx.db.get(subscription.recipientId);
      if (!product || !payer || !recipient) continue;
      out.push({
        subscription,
        productName: product.name,
        payerName: payer.name,
        recipientName: recipient.name,
      });
    }
    return out;
  },
});

export const recordEvent = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    type: subscriptionEventType,
    note: v.optional(v.string()),
    cadence: v.optional(cadence),
    addressLine1: v.optional(v.string()),
    colonia: v.optional(v.string()),
    now: v.number(),
  },
  returns: v.id("subscriptionEvents"),
  handler: async (ctx, args) => {
    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription) throw new Error("Plan no encontrado");

    if (subscription.status === "canceled" && args.type !== "cancel") {
      throw new Error("Este plan ya está cancelado");
    }

    if (args.type === "pause") {
      if (subscription.status !== "active") {
        throw new Error("Solo se puede pausar un plan activo");
      }
      await ctx.db.patch(subscription._id, { status: "paused" });
    }

    if (args.type === "resume") {
      if (subscription.status !== "paused") {
        throw new Error("Solo se puede reanudar un plan en pausa");
      }
      await ctx.db.patch(subscription._id, { status: "active" });
    }

    if (args.type === "cancel") {
      await ctx.db.patch(subscription._id, { status: "canceled" });
    }

    if (args.type === "skip_next") {
      if (subscription.status !== "active") {
        throw new Error("Solo se puede saltar un plan activo");
      }
      const nextDeliveryAt =
        subscription.nextDeliveryAt + subscription.intervalDays * DAY_MS;
      await ctx.db.patch(subscription._id, { nextDeliveryAt });
      const deliveries = await ctx.db
        .query("deliveries")
        .withIndex("by_subscription", (q) =>
          q.eq("subscriptionId", subscription._id),
        )
        .collect();
      const upcoming = deliveries
        .filter((d) => d.status === "scheduled")
        .sort((a, b) => a.scheduledFor - b.scheduledFor)[0];
      if (upcoming) {
        await ctx.db.patch(upcoming._id, { scheduledFor: nextDeliveryAt });
      }
    }

    if (args.type === "change_cadence") {
      if (!args.cadence) throw new Error("Falta la nueva cadencia");
      const intervalDays = intervalDaysForCadence(args.cadence);
      await ctx.db.patch(subscription._id, {
        cadence: args.cadence,
        intervalDays,
      });
    }

    if (args.type === "change_address") {
      if (!args.addressLine1) throw new Error("Falta la nueva dirección");
      await ctx.db.patch(subscription.addressId, {
        line1: args.addressLine1,
        colonia: args.colonia,
      });
    }

    return await ctx.db.insert("subscriptionEvents", {
      tenantId: subscription.tenantId,
      subscriptionId: subscription._id,
      type: args.type,
      note: args.note,
      createdAt: args.now,
      payload: JSON.stringify({
        cadence: args.cadence,
        addressLine1: args.addressLine1,
        colonia: args.colonia,
      }),
    });
  },
});
