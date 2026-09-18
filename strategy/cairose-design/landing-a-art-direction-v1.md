# Landing A `/` — Dirección de arte v1
**cairose - Design · 18 sep 2026 · America/El_Salvador**  
**Status:** listo para firma visual Daniela · Builder STOP  
**Canon:** FIRMA copy · palette warm v1.1 · hero photo anatomy · skill landing craft  
**Base UX:** `mocks/landing-a-warm-v2.html` (foto-first) — elevamos craft, no reiniciamos wire

---

## Tesis (una línea)

**Una mesa de taller vende el oficio; una carta de papel prueba tu marca. Cairose nunca es la vitrina.**

---

## Qué matamos (rechazos acumulados)

| Rechazo | Por qué |
|---------|---------|
| Lilac `#7E5FCF` + soft-pop | Tech / IA — no vende floristería |
| Browser / Safari frame en hero | Chrome SaaS aunque el paper sea warm |
| 3 feature cards + iconos | Template |
| Sora como H1 de marketing | Se lee producto, no taller |
| Ramo como SKU Cairose | Anti product lock |
| Unsplash “sonrisa florist stock” genérico | Huele a Midjourney-landing |

---

## Qué firmamos

| Pieza | Lock |
|-------|------|
| Paleta | marfil `#F4EFE6` · tinta `#1A1714` · oliva `#2F4A3C` · teja `#B85C38` · blush `#C98F86` |
| Tipo | **Fraunces** H1 · **Sora** wordmark only · **Inter** body/UI |
| Emphasis H1 | `tu` en **teja** (italic Fraunces), nunca lilac |
| CTA filled | Oliva · copy exacto FIRMA |
| Hero | Foto editorial full-bleed · cero UI |
| Prueba white-label | Debajo del fold · **carta/menú de papel** Casa Limón |
| Copy | `LANDINGS-AB-FIRMA.md` intacta |
| Motion P0 | Sticky header shrink · `prefers-reduced-motion` |

---

## Mapa de ritmo (≤3 scrolls a la oferta)

```
[header sticky papel]
SCROLL 1  Hero foto-bleed + FIRMA + 1 CTA
          ↓
BANDA     1 mancha oliva full-bleed (única fuerte del scroll)
SCROLL 2  Tres escenas dueña — strip editorial irregular (NO cards)
SCROLL 3  Cómo funciona (01–03) + demo carta “Así se vería tu marca”
FAQ       colapsado
FOOTER    El detalle bajo tu marca · CTA
```

---

## Sección por sección

### 0) Header
- Fondo marfil/papel @ ~92% + blur 8px; shrink 72→56.
- Wordmark Sora `cairose` tinta · links muted · CTA header oliva siempre visible (móvil incluido).
- **No** isotipo. **No** hover lilac.

### 1) Hero — “Mesa del taller”
**Composición (Farmgirl + Pétalos):**
- Desktop: foto full-bleed; sujeto (manos / mesa / materiales) a la **derecha ~55–62%**; aire negativo a la **izquierda** para copy.
- Mobile: crop centro-alto del gesto; gradiente vertical marfil abajo; copy abajo.
- Veil: ~7% tinta o marfil paper — nunca glass / orbs / gradient lilac.

**Foto direction (brief de shot, no stock genérico):**
- Sujeto: manos adultas trabajando — tallo, tijera, papel craft, nota a mano, luz de ventana.
- Materiales visibles: madera, lino, papel manchado de verde, tinta.
- **Prohibido en frame:** laptop, browser, dashboard, smile stock, ramo precio-tag, logo Cairose.
- Crop: preservar manos + mesa; no cortar dedos en el gesto.
- Color de la foto alimenta el feel; chrome casi invisible.

**Tipo / placement:**
- Eyebrow Inter 12–13 uppercase tracking 0.1em · oliva
- H1 Fraunces 700 · clamp ~2.4–3.65rem · LH 1.06 · `tu` teja italic
- Sub Inter 16–18 · muted · máx 2–3 líneas FIRMA
- CTA filled oliva + ghost “Cómo funciona” (underline hairline, no pill outline SaaS)
- Micro FIRMA bajo CTAs

**Una escena · una promesa · una CTA primaria.**

### 2) Banda oliva
- Full-bleed `#2F4A3C` · texto marfil · Fraunces semibold una línea FIRMA.
- Chips: WhatsApp · Tu sitio · Tu marca — borde marfil 35%, no pills soft-pop.
- **Única** mancha de color fuerte de este scroll. Teja no compite aquí.

### 3) Escenas dueña
Títulos FIRMA: **Para hoy ya** · **Chat eterno** · **Tu nombre** — 1 línea c/u.  
Layout: grid irregular 1.2 / 0.9 / 1 · offsets verticales distintos · hairline teja o border solo donde hace falta.  
**No** iconos círculo · **no** 3 cards iguales · **no** numeración SaaS 01/02/03 con glass.

### 4) Cómo funciona
Fondo elevated `#FFFBF5`. Tres pasos FIRMA con número Fraunces en **teja**.  
Columna estrecha (~40rem), no triada de cards.

### 5) Demo teaser — carta de papel
- Título FIRMA: Así se vería **tu** marca (`tu` teja).
- Artifact: **carta/menú** Casa Limón — doble filete papel, sombra offset oliva suave, tipografía tenant, 1 plan, “Le pagás a Casa Limón”.
- **Nunca** URL bar · traffic lights · phone chrome · iframe dashboard.
- CTA FIRMA + link cruzado → `/para-ti`.

### 6) FAQ + Footer
FAQ colapsado FIRMA. Footer: claim Fraunces + CTA · sin partículas · hover oliva en links.

---

## Do / Don’t

**Do**
- Foto primero; plataforma debajo.
- Asimetría editorial; ritmo de revista.
- Grain papel ≤4%.
- Named craft (taller, tu marca, WhatsApp) — no “plataforma”.

**Don’t**
- Lilac · browser hero · 3 cards · Inter-as-personality · Inter H1 · glass · orbs.
- Iterar el mismo HTML mock sin pasar por esta dirección.
- Builder implementa antes de OK visual Daniela.

---

## Handoff Builder (cuando haya GO)

1. Tokens: `cairose-brand-kit/tokens.css` + Fraunces display landing.
2. Assets: hero art-directed (no Unsplash placeholder en prod) · carta Casa Limón como componente estático.
3. Motion: header shrink Loop3-adapt skinned papel; reduced-motion = compact fijo.
4. A11y: CTA HTML (nunca baked in image) · alt del hero describe el oficio, no “UI”.
5. STOP hasta Product/Daniela visual OK.

---

## Criterio de aceptación (10s)

1. Se siente **taller**, no SaaS con flores.
2. Se entiende: planes bajo **tu** marca; ella te paga a vos; 0% del pedido.
3. Daniela no dice “hecho por IA / no vende”.

*cairose - Design · landing-a-art-direction-v1*


---
**Update 18 sep 2026 pm:** Daniela parked Superdesign v2 (“así dejémoslo”); will change with another model. Repo snapshot for handoff.
