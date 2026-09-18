/**
 * Cairose B2B landing copy — Branding v2 (landing-redo-v2).
 * Root speaks to the florist owner. Demo teaser shows her clientas’ B2C beats.
 * Cairose never sells flowers. SaaS-only to the florist; no take rate.
 */
export const marketingCopy = {
  nav: {
    how: "Cómo funciona",
    demo: "Demo",
    signup: "Crear cuenta",
    cta: "¿cómo se vería mi marca?",
    panel: "Panel",
  },
  hero: {
    eyebrow: "Para floristerías",
    titleBefore: "Que no se les olvide el día — y que el detalle llegue con ",
    titleEm: "tu",
    titleAfter: " nombre.",
    titleMobile: "Que no se les olvide — y que el detalle diga tu nombre.",
    subBefore:
      "Cairose se suma a tu WhatsApp y a tu sitio: planes que vuelven. Tu clienta puede regalarse a sí misma o mandarle el detalle a otra persona — ",
    subEm: "ella te paga a vos",
    subAfter:
      " (las flores). Cairose es la herramienta del taller (cuota SaaS). Nosotras no vendemos flores ni le cobramos a tu clienta.",
    ctaPrimary: "¿cómo se vería mi marca?",
    ctaHow: "Cómo funciona",
    micro: "Sin precio acá. Primero mirá cómo se siente con tu marca.",
  },
  coexist: {
    title: "Tu taller se queda. Nosotras sumamos el plan.",
    line: "Seguí por WhatsApp y tu web de siempre. No te pedimos mudarte.",
    chips: ["WhatsApp", "Tu sitio", "Tu marca"],
  },
  scenes: {
    items: [
      {
        title: "El “para hoy ya”",
        body: "Se les pasó el aniversario y te escriben a las tres pidiendo un detalle urgente.",
      },
      {
        title: "El chat que no termina",
        body: "Foto, precio, colonia, “¿llega sábado?” — y vos en el hilo todo el día.",
      },
      {
        title: "Que no parezca de otra",
        body: "Si el link no lleva tu nombre, no te vuelven a buscar a vos.",
      },
    ],
    closerBefore: "Armás el plan una vez. El gesto vuelve — ",
    closerEm1: "para ella",
    closerMid: " o ",
    closerEm2: "para alguien más",
    closerAfter:
      ". Ella te paga el ramo. Vos ponés el cariño. Cairose no se queda con un % del pedido (v1).",
  },
  how: {
    id: "como-funciona",
    title: "Cómo va",
    steps: [
      {
        title: "Tu marca se queda",
        body: "Logo, colores, tu catálogo. Tu WhatsApp no se va.",
      },
      {
        title: "Planes que vuelven",
        bodyBefore: "Cada semana, quincena o mes. ",
        bodyEm1: "Para mí",
        bodyMid: " o ",
        bodyEm2: "para alguien más",
        bodyAfter: ". Quien arma el plan te paga a vos.",
      },
      {
        title: "Pedidos sin novela",
        body: "Ves qué entregar. Hoy cobrás el ramo como siempre. Cairose no se queda con tu venta; el SaaS a la floristería es otro tema (y el precio no está acá).",
      },
    ],
  },
  demo: {
    id: "demo",
    titleBefore: "Así se vería ",
    titleEm: "tu",
    titleAfter: " marca",
    bodyBefore:
      "Casa Limón es inventada. Mirá un plan que vuelve: ",
    bodyEm1: "Para mí",
    bodyMid: " o ",
    bodyEm2: "Para alguien más",
    bodyCadence: ", cadencia clara — y ",
    bodyPay: "le pagás a la floristería",
    bodyAfter: ". No es el catálogo de Cairose.",
    cta: "¿cómo se vería mi marca?",
    beatSelf: "Para mí",
    beatGift: "Para alguien más",
    beatCadence: "Cada 2 semanas",
    beatPay: "Le pagás a Casa Limón — llega a quien digas (o a vos).",
    frameBrand: "Tu marca",
    frameAddress: "tu marca",
  },
  workshop: {
    title: "Esto es el taller.",
    body: "Catálogo, planes, pedidos. La vitrina — y el esmero — son de la floristería.",
    rows: ["Catálogo", "Planes", "Pedidos"],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Cairose vende flores?",
        a: "No. Vendés vos. Nosotras armamos los planes bajo tu marca.",
      },
      {
        q: "¿Cobro en la app?",
        a: "El cobro del ramo lo seguís haciendo vos (transferencia / WhatsApp). Cairose, cuando cobre, será solo el SaaS a la floristería — no nos quedamos con un porcentaje de tus flores. Los cobros a tu clienta dentro de la app: próximamente.",
      },
      {
        q: "¿Cuánto cuesta?",
        a: "La cuota Cairose es para la floristería (SaaS). Te lo contamos en la demo.",
      },
      {
        q: "¿Cairose le cobra a mi clienta?",
        a: "No. Ella te paga las flores a vos. Sin take rate en v1.",
      },
      {
        q: "¿Hay ejemplo?",
        a: "Casa Limón (ficticia) — mirá cómo se vería tu marca, con Para mí y Para alguien más.",
      },
    ],
  },
  footer: {
    claim: "El detalle bajo tu marca. Cairose no vende flores.",
    signup: "Crear cuenta",
    how: "Cómo funciona",
    demo: "Demo",
    panel: "Panel",
  },
} as const;

export const DEMO_STOREFRONT_HREF = "/t/casa-limon";
export const SIGN_UP_HREF = "/sign-up";
export const PANEL_HREF = "/panel";
