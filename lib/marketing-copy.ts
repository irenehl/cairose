/**
 * Cairose B2B landing copy — locked to home-b2b-proposal-v0 + brand-home-brief.
 * Narrative: we do not replace the florist’s site — we add subscriptions/gift under their brand.
 * Do not invent CTA labels. Cairose never sells flowers.
 */
export const marketingCopy = {
  nav: {
    how: "Cómo funciona",
    demo: "Demo",
    signup: "Crear cuenta",
  },
  hero: {
    eyebrow: "Para floristerías",
    title: "Capturá el momento justo — bajo tu marca.",
    subBefore:
      "No reemplazamos tu web. Añadimos suscripciones y gift bajo ",
    subEm: "tu",
    subAfter:
      " marca, a tu sitio o WhatsApp. Nosotras no vendemos el ramo.",
    ctaPrimary: "¿cómo se vería mi marca?",
    ctaHow: "Cómo funciona",
    connect: "Conectá con tu sitio / WhatsApp",
    micro: "Sin precio en esta página. Te lo mostramos en la demo.",
  },
  problem: {
    pains: [
      "Olvidos: fechas que se pasan y el pedido se arma a última hora.",
      "Chat eterno: fotos, precios y direcciones en un hilo que no termina.",
      "Marca propia: tu clienta debería ver tu nombre, no el de otra plataforma.",
    ],
    promise:
      "No reemplazamos tu web: añadimos suscripciones y gift (planes) bajo tu marca, a tu sitio o WhatsApp. Vos cobrás; ella ve tu nombre.",
  },
  how: {
    id: "como-funciona",
    title: "Cómo funciona",
    steps: [
      {
        title: "Tu marca, tu tienda",
        body: "Tu web y tu WhatsApp se quedan. Cairose suma logo, colores y catálogo — de la floristería, no nuestro.",
      },
      {
        title: "Planes que vuelven",
        body: "Suscripciones y gift: cada semana, 2 semanas o mes; para ella o para regalar.",
      },
      {
        title: "Pedidos claros",
        body: "Vos cobrás hoy fuera de Cairose; pagos en plataforma, próximamente.",
      },
    ],
  },
  includes: {
    title: "Qué incluye",
    cards: [
      {
        title: "White-label",
        body: "Tu logo, tus colores, tu vitrina. Convive con tu sitio y WhatsApp; no los reemplaza.",
      },
      {
        title: "Planes recurrentes",
        body: "Cada semana, 2 semanas o mes.",
      },
      {
        title: "Gift",
        body: "Quien paga no tiene que ser quien recibe.",
      },
      {
        title: "Panel",
        body: "Pedidos y catálogo en un solo lugar.",
      },
    ],
    note: "Skip y pausa listos para tu operación.",
  },
  demo: {
    id: "demo",
    kicker: "Demo",
    body: "Una vitrina de tenant — showcase ficticio. Así se vería tu marca. No es el catálogo de Cairose ni una floristería real.",
    cta: "¿cómo se vería mi marca?",
    frameBrand: "Tu marca",
    frameAddress: "tu marca",
  },
  audience: {
    title: "Para quién",
    items: [
      "Dueñas de floristería local (AMSS / LATAM).",
      "Diáspora: paga desde fuera, entrega local.",
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Cairose vende flores?",
        a: "No. No reemplazamos tu web: añadimos suscripciones y gift bajo tu marca. Nosotras no vendemos el ramo — ella ve tu nombre.",
      },
      {
        q: "¿Cobro en la app?",
        a: "Próximamente; hoy cobrás vos.",
      },
      {
        q: "¿Cuánto cuesta?",
        a: "Te lo mostramos en la demo / conversación.",
      },
    ],
    exampleQ: "¿Hay un ejemplo?",
    exampleA: "Sí. Mirá una vitrina de tenant (showcase ficticio) — no es el catálogo de Cairose.",
    exampleCta: "¿cómo se vería mi marca?",
  },
  footer: {
    claim:
      "No reemplazamos tu web. Añadimos suscripciones y gift bajo tu marca.",
    signup: "Crear cuenta",
    how: "Cómo funciona",
    demo: "Demo",
  },
} as const;

export const DEMO_STOREFRONT_HREF = "/t/casa-limon";
export const SIGN_UP_HREF = "/sign-up";
