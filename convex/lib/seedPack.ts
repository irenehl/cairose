/** Casa Limón showcase tenant. Prices/SKUs/cadences are exact Research seed-pack comps. */
export const CADENCES = [
  { code: "weekly" as const, labelEs: "Cada semana", intervalDays: 7 },
  { code: "biweekly" as const, labelEs: "Cada 2 semanas", intervalDays: 14 },
  { code: "monthly" as const, labelEs: "Cada mes", intervalDays: 28 },
];

export const DEMO_TENANT = {
  name: "Casa Limón",
  slug: "casa-limon",
  logoUrl: "/tenants/casa-limon/mark.svg",
  primaryColor: "#3A5F3A",
  accentColor: "#E8B84A",
  saasStatus: "trialing" as const,
  currency: "USD" as const,
  whatsappOps: "+503 0000-0000",
  outsideZoneSurchargeCents: 600,
  tagline: "Flores con gusto a casa",
};

export const DEMO_ZONES = [
  {
    name: "Gran San Salvador (AMSS)",
    slug: "amss",
    included: true,
    surchargeCents: 0,
    exampleCities: [
      "San Salvador",
      "Santa Tecla",
      "Antiguo Cuscatlán",
      "Soyapango",
    ],
  },
  {
    name: "Exterior AMSS",
    slug: "fuera-amss",
    included: false,
    surchargeCents: 600,
    exampleCities: [] as string[],
  },
];

export const DEMO_PRODUCTS = [
  {
    sku: "ramo-esencial",
    name: "Ramo esencial",
    description:
      "Ramo de estación, tamaño esencial. Demo / ejemplo AMSS (banda local de entrada).",
    type: "bouquet" as const,
    tier: "lite" as const,
    priceUsd: 28,
    forSubscription: true,
    forOccasion: true,
    imageUrls: ["/demo/ramo-esencial.jpg"],
  },
  {
    sku: "ramo-clasico",
    name: "Ramo clásico de estación",
    description:
      "Ramo clásico de estación. Demo / ejemplo AMSS (banda media local).",
    type: "bouquet" as const,
    tier: "classic" as const,
    priceUsd: 48,
    forSubscription: true,
    forOccasion: true,
    imageUrls: ["/demo/ramo-clasico.jpg"],
  },
  {
    sku: "ramo-especial",
    name: "Ramo especial",
    description:
      "Ramo especial para un momento grande. Demo / ejemplo AMSS (alto local, sin techo diáspora).",
    type: "bouquet" as const,
    tier: "luxe" as const,
    priceUsd: 72,
    forSubscription: true,
    forOccasion: true,
    imageUrls: ["/demo/ramo-especial.jpg"],
  },
  {
    sku: "girasoles-entry",
    name: "Girasoles + detalle",
    description: "Girasoles con un detalle. Demo / ejemplo — solo ocasión.",
    type: "bouquet" as const,
    tier: "lite" as const,
    priceUsd: 35,
    forSubscription: false,
    forOccasion: true,
    imageUrls: ["/demo/girasoles.svg"],
  },
  {
    sku: "rosas-doce",
    name: "Docena de rosas",
    description: "Docena de rosas. Demo / ejemplo — solo ocasión.",
    type: "bouquet" as const,
    tier: "classic" as const,
    priceUsd: 55,
    forSubscription: false,
    forOccasion: true,
    imageUrls: ["/demo/rosas.svg"],
  },
  {
    sku: "caja-premium",
    name: "Caja premium",
    description: "Caja premium. Demo / ejemplo — solo ocasión.",
    type: "box" as const,
    tier: "luxe" as const,
    priceUsd: 75,
    forSubscription: false,
    forOccasion: true,
    imageUrls: ["/demo/caja-premium.jpg"],
  },
];

export const DEMO_ADDONS = [
  { sku: "addon-globo", name: "Globo", priceUsd: 8 },
  { sku: "addon-chocolate", name: "Chocolate", priceUsd: 12 },
  { sku: "addon-vino", name: "Vino", priceUsd: 18 },
];

export function usdToCents(usd: number): number {
  return Math.round(usd * 100);
}
