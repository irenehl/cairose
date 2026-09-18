"use client";

import { useMutation, useQuery } from "convex/react";
import { useMemo, useSyncExternalStore } from "react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { isConvexConfigured } from "./env";
import { localStore } from "./local-store";
import { CADENCES, type CadenceCode } from "./seed-data";
import type {
  AddOn,
  Delivery,
  DeliveryStatus,
  Product,
  Subscription,
  SubscriptionEvent,
  SubscriptionEventType,
  Tenant,
  Zone,
} from "./types";

const emptySubscribe = () => () => undefined;

function useLocalState() {
  return useSyncExternalStore(
    localStore.subscribe,
    localStore.getSnapshot,
    localStore.getSnapshot,
  );
}

export type SubscriptionDetail = {
  subscription: Subscription;
  productName: string;
  shopName: string;
  shopSlug: string;
  whatsappOps?: string;
  payerName: string;
  recipientName: string;
  addressLine1: string;
  colonia?: string;
  events: SubscriptionEvent[];
};

export type PanelSubscriptionRow = {
  subscription: Subscription;
  productName: string;
  payerName: string;
  recipientName: string;
};

export type PanelDeliveryRow = Delivery & {
  productName: string;
  recipientName: string;
  payerName: string;
  addressLine1: string;
};

export type CreateSubscriptionInput = {
  tenantSlug: string;
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
};

function useLocalTenant(slug: string): Tenant | null | undefined {
  const state = useLocalState();
  if (state.tenant.slug === slug) return state.tenant;
  return null;
}

function useConvexTenant(slug: string): Tenant | null | undefined {
  return useQuery(api.tenants.getPublicBySlug, { slug }) as
    | Tenant
    | null
    | undefined;
}

export const usePublicTenant = isConvexConfigured()
  ? useConvexTenant
  : useLocalTenant;

function useLocalProducts(tenantId: string | undefined): Product[] | undefined {
  const state = useLocalState();
  if (!tenantId) return undefined;
  return state.products.filter((p) => p.tenantId === tenantId);
}

function useConvexProducts(tenantId: string | undefined): Product[] | undefined {
  return useQuery(
    api.products.listPublic,
    tenantId ? { tenantId: tenantId as Id<"tenants"> } : "skip",
  ) as Product[] | undefined;
}

function useLocalProductsAll(tenantId: string | undefined): Product[] | undefined {
  return useLocalProducts(tenantId);
}

function useConvexProductsAll(tenantId: string | undefined): Product[] | undefined {
  return useQuery(
    api.products.listMine,
    tenantId ? { tenantId: tenantId as Id<"tenants"> } : "skip",
  ) as Product[] | undefined;
}

export const usePublicProducts = isConvexConfigured()
  ? useConvexProducts
  : useLocalProducts;

export const usePanelProducts = isConvexConfigured()
  ? useConvexProductsAll
  : useLocalProductsAll;

function useLocalAddOns(tenantId: string | undefined): AddOn[] | undefined {
  const state = useLocalState();
  if (!tenantId) return undefined;
  return state.addOns.filter((a) => a.active);
}

function useConvexAddOns(tenantId: string | undefined): AddOn[] | undefined {
  return useQuery(
    api.products.listAddOnsPublic,
    tenantId ? { tenantId: tenantId as Id<"tenants"> } : "skip",
  ) as AddOn[] | undefined;
}

export const usePublicAddOns = isConvexConfigured()
  ? useConvexAddOns
  : useLocalAddOns;

function useLocalZones(tenantId: string | undefined): Zone[] | undefined {
  const state = useLocalState();
  if (!tenantId) return undefined;
  return state.zones;
}

function useConvexZones(tenantId: string | undefined): Zone[] | undefined {
  return useQuery(
    api.zones.listPublic,
    tenantId ? { tenantId: tenantId as Id<"tenants"> } : "skip",
  ) as Zone[] | undefined;
}

export const usePublicZones = isConvexConfigured()
  ? useConvexZones
  : useLocalZones;

function useLocalPanelTenant(): Tenant | null | undefined {
  const state = useLocalState();
  return state.tenant;
}

function useConvexPanelTenant(): Tenant | null | undefined {
  return useQuery(api.tenants.getMine, {}) as Tenant | null | undefined;
}

export const usePanelTenant = isConvexConfigured()
  ? useConvexPanelTenant
  : useLocalPanelTenant;

function useLocalCreateSubscription() {
  return async (input: CreateSubscriptionInput) => {
    return localStore.createGuestSubscription({ ...input, now: Date.now() });
  };
}

function useConvexCreateSubscription() {
  const convexCreate = useMutation(api.subscriptions.createGuest);
  return async (input: CreateSubscriptionInput) => {
    return (await convexCreate({
      ...input,
      productId: input.productId as Id<"products">,
      zoneId: input.zoneId as Id<"zones"> | undefined,
      addOnIds: input.addOnIds as Id<"addOns">[],
      now: Date.now(),
    })) as string;
  };
}

export const useCreateSubscription = isConvexConfigured()
  ? useConvexCreateSubscription
  : useLocalCreateSubscription;

function useLocalSubscription(
  id: string | undefined,
): SubscriptionDetail | null | undefined {
  const state = useLocalState();
  return useMemo(() => {
    if (!id) return undefined;
    const subscription = state.subscriptions.find((s) => s._id === id);
    if (!subscription) return null;
    const product = state.products.find((p) => p._id === subscription.productId);
    const payer = state.customers.find((c) => c._id === subscription.payerCustomerId);
    const recipient = state.recipients.find((r) => r._id === subscription.recipientId);
    const address = state.addresses.find((a) => a._id === subscription.addressId);
    if (!product || !payer || !recipient || !address) return null;
    return {
      subscription,
      productName: product.name,
      shopName: state.tenant.name,
      shopSlug: state.tenant.slug,
      whatsappOps: state.tenant.whatsappOps,
      payerName: payer.name,
      recipientName: recipient.name,
      addressLine1: address.line1,
      colonia: address.colonia,
      events: state.subscriptionEvents.filter((e) => e.subscriptionId === id),
    };
  }, [id, state]);
}

function useConvexSubscription(
  id: string | undefined,
): SubscriptionDetail | null | undefined {
  return useQuery(
    api.subscriptions.getPublic,
    id ? { subscriptionId: id as Id<"subscriptions"> } : "skip",
  ) as SubscriptionDetail | null | undefined;
}

export const usePublicSubscription = isConvexConfigured()
  ? useConvexSubscription
  : useLocalSubscription;

type RecordEventInput = {
  subscriptionId: string;
  type: SubscriptionEventType;
  note?: string;
  cadence?: CadenceCode;
  addressLine1?: string;
  colonia?: string;
};

function useLocalRecordEvent() {
  return async (input: RecordEventInput) => {
    localStore.recordEvent({ ...input, now: Date.now() });
  };
}

function useConvexRecordEvent() {
  const convexRecord = useMutation(api.subscriptions.recordEvent);
  return async (input: RecordEventInput) => {
    await convexRecord({
      subscriptionId: input.subscriptionId as Id<"subscriptions">,
      type: input.type,
      note: input.note,
      cadence: input.cadence,
      addressLine1: input.addressLine1,
      colonia: input.colonia,
      now: Date.now(),
    });
  };
}

export const useRecordEvent = isConvexConfigured()
  ? useConvexRecordEvent
  : useLocalRecordEvent;

function useLocalPanelSubscriptions(
  tenantId: string | undefined,
): PanelSubscriptionRow[] | undefined {
  const state = useLocalState();
  if (!tenantId) return undefined;
  return state.subscriptions.map((subscription) => {
    const product = state.products.find((p) => p._id === subscription.productId);
    const payer = state.customers.find((c) => c._id === subscription.payerCustomerId);
    const recipient = state.recipients.find((r) => r._id === subscription.recipientId);
    return {
      subscription,
      productName: product?.name ?? "Producto",
      payerName: payer?.name ?? "—",
      recipientName: recipient?.name ?? "—",
    };
  });
}

function useConvexPanelSubscriptions(
  tenantId: string | undefined,
): PanelSubscriptionRow[] | undefined {
  return useQuery(
    api.subscriptions.listMine,
    tenantId ? { tenantId: tenantId as Id<"tenants"> } : "skip",
  ) as PanelSubscriptionRow[] | undefined;
}

export const usePanelSubscriptions = isConvexConfigured()
  ? useConvexPanelSubscriptions
  : useLocalPanelSubscriptions;

function useLocalPanelDeliveries(
  tenantId: string | undefined,
): PanelDeliveryRow[] | undefined {
  const state = useLocalState();
  if (!tenantId) return undefined;
  return state.deliveries
    .map((delivery) => {
      const subscription = state.subscriptions.find(
        (s) => s._id === delivery.subscriptionId,
      );
      const product = state.products.find((p) => p._id === subscription?.productId);
      const recipient = state.recipients.find(
        (r) => r._id === subscription?.recipientId,
      );
      const payer = state.customers.find((c) => c._id === subscription?.payerCustomerId);
      const address = state.addresses.find((a) => a._id === subscription?.addressId);
      return {
        ...delivery,
        productName: product?.name ?? "Producto",
        recipientName: recipient?.name ?? "—",
        payerName: payer?.name ?? "—",
        addressLine1: address?.line1 ?? "—",
      };
    })
    .sort((a, b) => a.scheduledFor - b.scheduledFor);
}

function useConvexPanelDeliveries(
  tenantId: string | undefined,
): PanelDeliveryRow[] | undefined {
  return useQuery(
    api.deliveries.listMine,
    tenantId ? { tenantId: tenantId as Id<"tenants"> } : "skip",
  ) as PanelDeliveryRow[] | undefined;
}

export const usePanelDeliveries = isConvexConfigured()
  ? useConvexPanelDeliveries
  : useLocalPanelDeliveries;

function useLocalPanelActions() {
  return {
    ensureMe: async () => undefined,
    seedDemo: async () => {
      localStore.resetDemo();
      return { slug: "casa-limon" };
    },
    updateBranding: async (input: {
      tenantId: string;
      name?: string;
      logoUrl?: string;
      primaryColor?: string;
      accentColor?: string;
      whatsappOps?: string;
    }) => {
      localStore.updateBranding(input);
    },
    updateSlug: async (_tenantId: string, slug: string) => {
      localStore.updateSlug(slug);
    },
    createProduct: async (input: {
      tenantId: string;
      sku: string;
      name: string;
      description: string;
      priceCents: number;
      imageUrls: string[];
      active: boolean;
      type?: Product["type"];
      tier?: Product["tier"];
      forSubscription: boolean;
      forOccasion: boolean;
    }) =>
      localStore.createProduct({
        sku: input.sku,
        name: input.name,
        description: input.description,
        priceCents: input.priceCents,
        imageUrls: input.imageUrls,
        active: input.active,
        type: input.type,
        tier: input.tier,
        forSubscription: input.forSubscription,
        forOccasion: input.forOccasion,
      }),
    updateProduct: async (productId: string, patch: Partial<Product>) => {
      localStore.updateProduct(productId, patch);
    },
    upsertZone: async (input: {
      tenantId: string;
      zoneId?: string;
      name: string;
      slug: string;
      included: boolean;
      surchargeCents: number;
      exampleCities: string[];
    }) =>
      localStore.upsertZone({
        zoneId: input.zoneId,
        name: input.name,
        slug: input.slug,
        included: input.included,
        surchargeCents: input.surchargeCents,
        exampleCities: input.exampleCities,
      }),
    updateDelivery: async (
      deliveryId: string,
      status: DeliveryStatus,
      floristNotes?: string,
    ) => {
      localStore.updateDelivery(deliveryId, status, floristNotes);
    },
  };
}

function useConvexPanelActions() {
  const convexUpdateBrand = useMutation(api.tenants.updateBranding);
  const convexUpdateSlug = useMutation(api.tenants.updateSlug);
  const convexCreateProduct = useMutation(api.products.create);
  const convexUpdateProduct = useMutation(api.products.update);
  const convexUpsertZone = useMutation(api.zones.upsert);
  const convexUpdateDelivery = useMutation(api.deliveries.updateStatus);
  const convexEnsureMe = useMutation(api.users.ensureMe);
  const convexSeed = useMutation(api.seed.seedDemo);

  return {
    ensureMe: () => convexEnsureMe({}),
    seedDemo: (force?: boolean) => convexSeed({ force }),
    updateBranding: (input: {
      tenantId: string;
      name?: string;
      logoUrl?: string;
      primaryColor?: string;
      accentColor?: string;
      whatsappOps?: string;
    }) =>
      convexUpdateBrand({
        ...input,
        tenantId: input.tenantId as Id<"tenants">,
      }),
    updateSlug: (tenantId: string, slug: string) =>
      convexUpdateSlug({ tenantId: tenantId as Id<"tenants">, slug }),
    createProduct: (input: {
      tenantId: string;
      sku: string;
      name: string;
      description: string;
      priceCents: number;
      imageUrls: string[];
      active: boolean;
      type?: Product["type"];
      tier?: Product["tier"];
      forSubscription: boolean;
      forOccasion: boolean;
    }) =>
      convexCreateProduct({
        ...input,
        tenantId: input.tenantId as Id<"tenants">,
      }),
    updateProduct: (
      productId: string,
      patch: Partial<
        Pick<
          Product,
          | "name"
          | "description"
          | "priceCents"
          | "imageUrls"
          | "active"
          | "type"
          | "tier"
          | "forSubscription"
          | "forOccasion"
        >
      >,
    ) =>
      convexUpdateProduct({
        productId: productId as Id<"products">,
        ...patch,
      }),
    upsertZone: (input: {
      tenantId: string;
      zoneId?: string;
      name: string;
      slug: string;
      included: boolean;
      surchargeCents: number;
      exampleCities: string[];
    }) =>
      convexUpsertZone({
        ...input,
        tenantId: input.tenantId as Id<"tenants">,
        zoneId: input.zoneId as Id<"zones"> | undefined,
      }),
    updateDelivery: (
      deliveryId: string,
      status: DeliveryStatus,
      floristNotes?: string,
    ) =>
      convexUpdateDelivery({
        deliveryId: deliveryId as Id<"deliveries">,
        status,
        floristNotes,
      }),
  };
}

export const usePanelActions = isConvexConfigured()
  ? useConvexPanelActions
  : useLocalPanelActions;

export function useCadences() {
  return CADENCES;
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
