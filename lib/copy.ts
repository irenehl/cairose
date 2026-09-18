/**
 * Spanish UI copy defaults from the Cairose brand kit.
 * Panel = Cairose talking to the florist. Storefront = the florist talking to customers.
 */
export const panel = {
  "app.name": "Cairose",
  "nav.dashboard": "Inicio",
  "nav.catalog": "Catálogo",
  "nav.subscriptions": "Planes",
  "nav.orders": "Pedidos",
  "nav.settings": "Tu marca",
  "dash.hello": "Hola, {name}",
  "dash.subtitle": "Capturá el momento justo — bajo tu marca.",
  "dash.cta.catalog": "Subir catálogo",
  "dash.cta.brand": "Editar logo y colores",
  "dash.empty.catalog": "Todavía no hay productos. Subí el primero para armar planes.",
  "brand.title": "Tu marca",
  "brand.logo": "Logo",
  "brand.colors": "Colores",
  "brand.slug": "Dirección de tu tienda",
  "brand.slug.help": "{slug}.cairose… — así te encuentran tus clientas.",
  "brand.save": "Guardar cambios",
  "catalog.title": "Catálogo",
  "catalog.add": "Agregar producto",
  "catalog.price": "Precio",
  "catalog.empty": "Tu catálogo está vacío.",
  "plans.title": "Planes recurrentes",
  "plans.create": "Crear plan",
  "plans.cadence": "Cada cuánto",
  "plans.cadence.1w": "Cada semana",
  "plans.cadence.2w": "Cada 2 semanas",
  "plans.cadence.4w": "Cada mes",
  "plans.gift": "Permite enviar a otra persona",
  "plans.skip": "Clientas pueden saltar una entrega",
  "plans.pause": "Clientas pueden pausar",
  "plans.empty": "Creá un plan para que el gesto vuelva solo.",
  "orders.title": "Pedidos",
  "orders.empty": "Cuando alguien active un plan, aparece acá.",
  "payments.banner":
    "Cobros en la plataforma: próximamente. Por ahora cobrás fuera de Cairose.",
  "auth.login.title": "Entrá a Cairose",
  "auth.login.google": "Continuar con Google",
  "auth.login.otp": "Código por SMS / email",
  "common.save": "Guardar",
  "common.cancel": "Cancelar",
  "common.coming_soon": "Próximamente",
} as const;

export const store = {
  "store.home.eyebrow": "Flores de {shopName}",
  "store.home.headline": "El momento justo, a quien vos digas",
  "store.home.sub": "Armá un plan: fechas cubiertas y días porque sí.",
  "store.home.cta": "Ver planes",
  "store.plans.title": "Planes",
  "store.plan.gift": "Enviar a otra persona",
  "store.plan.self": "Para mí",
  "store.plan.cadence": "Entrega {cadence}",
  "store.plan.skip": "Podés saltar una entrega",
  "store.plan.cta": "Elegir este plan",
  "store.gift.recipient": "¿A quién llegan?",
  "store.gift.address": "Dirección de entrega",
  "store.gift.note": "Nota (opcional)",
  "store.checkout.pay_soon":
    "El pago en línea llega pronto. {shopName} te confirma cómo completar el pedido.",
  "store.footer.powered": "—",
  "store.error.generic": "Algo falló. Probá de nuevo o escribile a {shopName}.",
} as const;

export function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}
