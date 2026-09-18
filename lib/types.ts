import type { CadenceCode, TierCode } from "./seed-data";

export type SaasStatus = "trialing" | "active" | "past_due" | "canceled";
export type MembershipRole = "owner" | "staff";
export type ProductType = "bouquet" | "box";
export type SubscriptionStatus = "active" | "paused" | "canceled";
export type PaymentStatus =
  | "awaiting_florist_payment"
  | "paid_outside"
  | "coming_soon";
export type SubscriptionEventType =
  | "skip_next"
  | "pause"
  | "resume"
  | "cancel"
  | "change_address"
  | "change_cadence";
export type DeliveryStatus =
  | "scheduled"
  | "out_for_delivery"
  | "delivered"
  | "failed_nobody_home"
  | "failed_other";

export type Tenant = {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  customDomain?: string;
  saasStatus: SaasStatus;
  saasPlanPriceCents?: number;
  currency: "USD";
  whatsappOps?: string;
  outsideZoneSurchargeCents?: number;
  tagline?: string;
};

export type Product = {
  _id: string;
  tenantId: string;
  sku: string;
  name: string;
  description: string;
  priceCents: number;
  currency: "USD";
  imageUrls: string[];
  active: boolean;
  type?: ProductType;
  tier?: TierCode;
  forSubscription: boolean;
  forOccasion: boolean;
};

export type AddOn = {
  _id: string;
  tenantId: string;
  sku: string;
  name: string;
  priceCents: number;
  active: boolean;
};

export type Zone = {
  _id: string;
  tenantId: string;
  name: string;
  slug: string;
  included: boolean;
  surchargeCents: number;
  exampleCities: string[];
};

export type Customer = {
  _id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
};

export type Recipient = {
  _id: string;
  tenantId: string;
  name: string;
  phone?: string;
};

export type Address = {
  _id: string;
  tenantId: string;
  recipientId?: string;
  line1: string;
  colonia?: string;
  notes?: string;
  zoneId?: string;
};

export type Subscription = {
  _id: string;
  tenantId: string;
  payerCustomerId: string;
  recipientId: string;
  productId: string;
  addressId: string;
  cadence: CadenceCode;
  intervalDays: number;
  status: SubscriptionStatus;
  nextDeliveryAt: number;
  paymentStatus: PaymentStatus;
  isGift: boolean;
  cardMessage?: string;
};

export type SubscriptionAddOn = {
  _id: string;
  subscriptionId: string;
  addOnId: string;
};

export type SubscriptionEvent = {
  _id: string;
  tenantId: string;
  subscriptionId: string;
  type: SubscriptionEventType;
  note?: string;
  createdAt: number;
  payload?: string;
};

export type Delivery = {
  _id: string;
  tenantId: string;
  subscriptionId: string;
  scheduledFor: number;
  status: DeliveryStatus;
  notes?: string;
  floristNotes?: string;
};

export type Membership = {
  _id: string;
  userId: string;
  tenantId: string;
  role: MembershipRole;
};

export type AppUser = {
  _id: string;
  tokenIdentifier: string;
  clerkUserId?: string;
  email?: string;
  phone?: string;
  name?: string;
};

export type { CadenceCode, TierCode };
