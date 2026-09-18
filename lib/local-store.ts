"use client";

import {
  CADENCES,
  DEMO_ADDONS,
  DEMO_PRODUCTS,
  DEMO_TENANT,
  DEMO_ZONES,
  cadenceByCode,
  usdToCents,
  type CadenceCode,
} from "./seed-data";
import type {
  AddOn,
  Address,
  Customer,
  Delivery,
  DeliveryStatus,
  Product,
  Recipient,
  Subscription,
  SubscriptionAddOn,
  SubscriptionEvent,
  SubscriptionEventType,
  Tenant,
  Zone,
} from "./types";
import { newId } from "./utils";

const STORAGE_KEY = "cairose-local-v3";
const DAY_MS = 24 * 60 * 60 * 1000;

export type LocalState = {
  tenant: Tenant;
  products: Product[];
  addOns: AddOn[];
  zones: Zone[];
  customers: Customer[];
  recipients: Recipient[];
  addresses: Address[];
  subscriptions: Subscription[];
  subscriptionAddOns: SubscriptionAddOn[];
  subscriptionEvents: SubscriptionEvent[];
  deliveries: Delivery[];
};

function seedState(): LocalState {
  const tenantId = "tenants_casa-limon";
  const tenant: Tenant = {
    _id: tenantId,
    name: DEMO_TENANT.name,
    slug: DEMO_TENANT.slug,
    logoUrl: DEMO_TENANT.logoUrl,
    primaryColor: DEMO_TENANT.primaryColor,
    accentColor: DEMO_TENANT.accentColor,
    saasStatus: DEMO_TENANT.saasStatus,
    currency: "USD",
    whatsappOps: DEMO_TENANT.whatsappOps,
    outsideZoneSurchargeCents: DEMO_TENANT.outsideZoneSurchargeCents,
    tagline: DEMO_TENANT.tagline,
  };

  const products: Product[] = DEMO_PRODUCTS.map((p) => ({
    _id: `products_${p.sku}`,
    tenantId,
    sku: p.sku,
    name: p.name,
    description: p.description,
    priceCents: usdToCents(p.priceUsd),
    currency: "USD",
    imageUrls: p.imageUrls,
    active: true,
    type: p.type,
    tier: p.tier,
    forSubscription: p.forSubscription,
    forOccasion: p.forOccasion,
  }));

  const addOns: AddOn[] = DEMO_ADDONS.map((a) => ({
    _id: `addons_${a.sku}`,
    tenantId,
    sku: a.sku,
    name: a.name,
    priceCents: usdToCents(a.priceUsd),
    active: true,
  }));

  const zones: Zone[] = DEMO_ZONES.map((z) => ({
    _id: `zones_${z.slug}`,
    tenantId,
    name: z.name,
    slug: z.slug,
    included: z.included,
    surchargeCents: z.surchargeCents,
    exampleCities: z.exampleCities,
  }));

  return {
    tenant,
    products,
    addOns,
    zones,
    customers: [],
    recipients: [],
    addresses: [],
    subscriptions: [],
    subscriptionAddOns: [],
    subscriptionEvents: [],
    deliveries: [],
  };
}

function loadState(): LocalState {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as LocalState;
  } catch {
    return seedState();
  }
}

function persist(state: LocalState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

type Listener = () => void;

class LocalStore {
  state: LocalState;
  listeners = new Set<Listener>();

  constructor() {
    this.state = loadState();
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): LocalState => this.state;

  private commit(next: LocalState): void {
    this.state = next;
    persist(next);
    for (const listener of this.listeners) listener();
  }

  resetDemo(): void {
    this.commit(seedState());
  }

  updateBranding(patch: {
    name?: string;
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
    whatsappOps?: string;
  }): void {
    this.commit({
      ...this.state,
      tenant: { ...this.state.tenant, ...patch },
    });
  }

  updateSlug(slug: string): void {
    this.commit({
      ...this.state,
      tenant: { ...this.state.tenant, slug },
    });
  }

  createProduct(input: Omit<Product, "_id" | "tenantId" | "currency">): string {
    const id = newId("products");
    const product: Product = {
      ...input,
      _id: id,
      tenantId: this.state.tenant._id,
      currency: "USD",
    };
    this.commit({ ...this.state, products: [...this.state.products, product] });
    return id;
  }

  updateProduct(productId: string, patch: Partial<Product>): void {
    this.commit({
      ...this.state,
      products: this.state.products.map((p) =>
        p._id === productId ? { ...p, ...patch, _id: p._id, tenantId: p.tenantId } : p,
      ),
    });
  }

  upsertZone(input: Omit<Zone, "_id" | "tenantId"> & { zoneId?: string }): string {
    if (input.zoneId) {
      this.commit({
        ...this.state,
        zones: this.state.zones.map((z) =>
          z._id === input.zoneId
            ? {
                ...z,
                name: input.name,
                slug: input.slug,
                included: input.included,
                surchargeCents: input.surchargeCents,
                exampleCities: input.exampleCities,
              }
            : z,
        ),
      });
      return input.zoneId;
    }
    const id = newId("zones");
    const zone: Zone = {
      _id: id,
      tenantId: this.state.tenant._id,
      name: input.name,
      slug: input.slug,
      included: input.included,
      surchargeCents: input.surchargeCents,
      exampleCities: input.exampleCities,
    };
    this.commit({ ...this.state, zones: [...this.state.zones, zone] });
    return id;
  }

  createGuestSubscription(input: {
    productId: string;
    cadence: CadenceCode;
    isGift: boolean;
    payerName: string;
    payerEmail?: string;
    payerPhone?: string;
    recipientName: string;
    recipientPhone?: string;
    addressLine1: string;
    colonia?: string;
    deliveryNotes?: string;
    zoneId?: string;
    cardMessage?: string;
    addOnIds: string[];
    now: number;
  }): string {
    const product = this.state.products.find((p) => p._id === input.productId);
    if (!product || !product.active) throw new Error("Producto no disponible");
    if (!product.forSubscription) {
      throw new Error("Este producto no es un plan recurrente");
    }
    if (input.cardMessage && input.cardMessage.length > 200) {
      throw new Error("La nota de la tarjeta no puede pasar de 200 caracteres");
    }

    const payerName = input.payerName.trim();
    const recipientName = input.recipientName.trim();
    const isGift =
      input.isGift || payerName.toLowerCase() !== recipientName.toLowerCase();

    const payer: Customer = {
      _id: newId("customers"),
      tenantId: this.state.tenant._id,
      name: payerName,
      email: input.payerEmail,
      phone: input.payerPhone,
    };
    const recipient: Recipient = {
      _id: newId("recipients"),
      tenantId: this.state.tenant._id,
      name: recipientName,
      phone: input.recipientPhone,
    };
    const address: Address = {
      _id: newId("addresses"),
      tenantId: this.state.tenant._id,
      recipientId: recipient._id,
      line1: input.addressLine1.trim(),
      colonia: input.colonia,
      notes: input.deliveryNotes,
      zoneId: input.zoneId,
    };

    const cadence = cadenceByCode(input.cadence);
    const nextDeliveryAt = input.now + cadence.intervalDays * DAY_MS;
    const subscription: Subscription = {
      _id: newId("subscriptions"),
      tenantId: this.state.tenant._id,
      payerCustomerId: payer._id,
      recipientId: recipient._id,
      productId: product._id,
      addressId: address._id,
      cadence: input.cadence,
      intervalDays: cadence.intervalDays,
      status: "active",
      nextDeliveryAt,
      paymentStatus: "awaiting_florist_payment",
      isGift,
      cardMessage: input.cardMessage,
    };

    const addOnRows: SubscriptionAddOn[] = input.addOnIds.map((addOnId) => ({
      _id: newId("subaddons"),
      subscriptionId: subscription._id,
      addOnId,
    }));

    const delivery: Delivery = {
      _id: newId("deliveries"),
      tenantId: this.state.tenant._id,
      subscriptionId: subscription._id,
      scheduledFor: nextDeliveryAt,
      status: "scheduled",
      notes: input.deliveryNotes,
    };

    this.commit({
      ...this.state,
      customers: [...this.state.customers, payer],
      recipients: [...this.state.recipients, recipient],
      addresses: [...this.state.addresses, address],
      subscriptions: [...this.state.subscriptions, subscription],
      subscriptionAddOns: [...this.state.subscriptionAddOns, ...addOnRows],
      deliveries: [...this.state.deliveries, delivery],
    });

    return subscription._id;
  }

  recordEvent(input: {
    subscriptionId: string;
    type: SubscriptionEventType;
    note?: string;
    cadence?: CadenceCode;
    addressLine1?: string;
    colonia?: string;
    now: number;
  }): string {
    const subscription = this.state.subscriptions.find(
      (s) => s._id === input.subscriptionId,
    );
    if (!subscription) throw new Error("Plan no encontrado");
    if (subscription.status === "canceled" && input.type !== "cancel") {
      throw new Error("Este plan ya está cancelado");
    }

    const nextSub = { ...subscription };
    let addresses = this.state.addresses;

    if (input.type === "pause") {
      if (subscription.status !== "active") {
        throw new Error("Solo se puede pausar un plan activo");
      }
      nextSub.status = "paused";
    }
    if (input.type === "resume") {
      if (subscription.status !== "paused") {
        throw new Error("Solo se puede reanudar un plan en pausa");
      }
      nextSub.status = "active";
    }
    if (input.type === "cancel") {
      nextSub.status = "canceled";
    }
    if (input.type === "skip_next") {
      if (subscription.status !== "active") {
        throw new Error("Solo se puede saltar un plan activo");
      }
      nextSub.nextDeliveryAt =
        subscription.nextDeliveryAt + subscription.intervalDays * DAY_MS;
    }
    if (input.type === "change_cadence") {
      if (!input.cadence) throw new Error("Falta la nueva cadencia");
      const cadence = cadenceByCode(input.cadence);
      nextSub.cadence = input.cadence;
      nextSub.intervalDays = cadence.intervalDays;
    }
    if (input.type === "change_address") {
      if (!input.addressLine1) throw new Error("Falta la nueva dirección");
      addresses = addresses.map((a) =>
        a._id === subscription.addressId
          ? { ...a, line1: input.addressLine1 ?? a.line1, colonia: input.colonia }
          : a,
      );
    }

    const event: SubscriptionEvent = {
      _id: newId("events"),
      tenantId: subscription.tenantId,
      subscriptionId: subscription._id,
      type: input.type,
      note: input.note,
      createdAt: input.now,
      payload: JSON.stringify({
        cadence: input.cadence,
        addressLine1: input.addressLine1,
        colonia: input.colonia,
      }),
    };

    this.commit({
      ...this.state,
      addresses,
      subscriptions: this.state.subscriptions.map((s) =>
        s._id === nextSub._id ? nextSub : s,
      ),
      subscriptionEvents: [...this.state.subscriptionEvents, event],
    });

    return event._id;
  }

  updateDelivery(
    deliveryId: string,
    status: DeliveryStatus,
    floristNotes?: string,
  ): void {
    this.commit({
      ...this.state,
      deliveries: this.state.deliveries.map((d) =>
        d._id === deliveryId ? { ...d, status, floristNotes } : d,
      ),
    });
  }
}

export const localStore = new LocalStore();
export { CADENCES };
