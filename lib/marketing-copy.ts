/**
 * Cairose B2B landing copy — locked to home-b2b-proposal-v0 + brand-home-brief.
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
      "Cairose es la plataforma white-label entre tu clienta y tu floristería: planes recurrentes con ",
    subEm: "tu",
    subAfter:
      " marca. Nosotras no vendemos el ramo — tu clienta ve tu nombre.",
    ctaPrimary: "¿cómo se vería mi marca?",
    ctaHow: "Cómo funciona",
    micro: "Sin precio en esta página. Te lo mostramos en la demo.",
  },
  problem: {
    pains: [
      "Olvidos: fechas que se pasan y el pedido se arma a última hora.",
      "Chat eterno: fotos, precios y direcciones en un hilo que no termina.",
      "Marca propia: tu clienta debería ver tu nombre, no el de otra plataforma.",
    ],
    promise:
      "El medio entre clienta y floristería: white-label. Vos cobrás; ella ve tu nombre.",
  },
  how: {
    id: "como-funciona",
    title: "Cómo funciona",
    steps: [
      {
        title: "Tu marca, tu tienda",
        body: "Logo, colores, catálogo — de la floristería, no de Cairose.",
      },
      {
        title: "Planes que vuelven",
        body: "Cada semana, 2 semanas o mes; para ella o para regalar.",
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
        body: "Tu logo, tus colores, tu tienda. El catálogo es de la floristería.",
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
    body: "Showcase ficticio — así se vería tu marca. No es una floristería real.",
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
        a: "No. Cairose es el medio entre tu clienta y tu floristería. Nosotras no vendemos el ramo — ella ve tu nombre.",
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
    exampleA: "Sí. Mirá un showcase ficticio de cómo se vería tu marca.",
    exampleCta: "¿cómo se vería mi marca?",
  },
  footer: {
    claim:
      "Cairose es el medio entre tu clienta y tu floristería. White-label: nosotras no vendemos el ramo.",
    signup: "Crear cuenta",
    how: "Cómo funciona",
    demo: "Demo",
  },
} as const;

export const DEMO_STOREFRONT_HREF = "/t/casa-limon";
export const SIGN_UP_HREF = "/sign-up";
