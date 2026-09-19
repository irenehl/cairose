# Propuesta navegable de Cairose

Prototipo independiente de la aplicación: HTML, CSS y JavaScript, sin dependencias. No utiliza Convex, Clerk ni datos reales. El estado vive en memoria y se reinicia al recargar.

## Abrir localmente

Desde la raíz del repositorio:

```sh
python3 -m http.server 43147 --bind 127.0.0.1 --directory public
```

Abrir http://127.0.0.1:43147/propuesta/index.html

Al servirlo con Next.js, la ruta del archivo estático es `/propuesta/index.html`. La página principal `/` sirve este archivo mediante una reescritura en `next.config.ts`. El panel operativo `/panel` permanece separado de la demo con datos simulados.

## Recorrido

- `#inicio`: landing para floristerías.
- `#demo`: tienda de Casa Limón.
- `#armar/clasico`: elección, entrega y revisión.
- `#confirmacion`: confirmación y conexión al panel.
- `#mi-plan`: saltar entrega, pausar/reanudar, dirección y cancelación.
- `#panel`: agenda, filtros y estados de entrega.
- `#planes`: búsqueda y pausa/reanudación de planes.
- `#catalogo`: edición de nombre, descripción y precio de los ramos.
- `#marca`: personalización de nombre y color.
- `#contacto`: mensaje y contratación asistida.

## WhatsApp

`CONTACT_PHONE` en `app.js` espera el número aprobado por la dueña, en formato internacional sin signos ni espacios. Mientras esté vacío, el contacto se presenta como vista previa y no abre una conversación. No insertar un número ficticio.

## Comprobaciones realizadas

- Sintaxis JavaScript y revisión de whitespace.
- Recorrido completo para regalo en escritorio y para uso personal en móvil.
- Persistencia de elecciones entre confirmación, plan y panel durante la sesión.
- Búsqueda, pausa/reanudación, salto semanal y cancelación con confirmación.
- Cambio de dirección y estados de entrega; filtro que excluye entregas completadas.
- Edición de catálogo visible en la tienda y cambio de marca aplicado.
- Revisión visual de landing, tienda, formulario y agenda a 390 px; sin desbordamiento horizontal en las vistas comprobadas.
- Sin errores ni advertencias de JavaScript observados en el navegador.

## Límites

No es un checkout real, ni un panel conectado al backend. Las fotos existentes son provisionales. El precio del catálogo se conserva en cada plan creado: editarlo afecta solo los planes nuevos. No se envían mensajes automáticamente. Falta validar el modelo y el recorrido con floristerías reales antes de trasladar el diseño a producción.

## Opciones de entrega

Una sola ocasión, múltiples fechas explícitas sin renovación o frecuencia recurrente. Fechas elegidas usan el mismo destinatario y ramo, generan entregas independientes y muestran el total. Se validan fechas futuras, días reales y duplicados.

Comprobaciones de programación: `node --test public/propuesta/schedule.test.cjs`.
