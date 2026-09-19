# Propuesta de experiencia Cairose

## Objetivo

Que una dueña pueda entender el modelo de suscripción, experimentar un ejemplo y decidir conversar sobre llevarlo a su floristería. El éxito inicial se mide por conversaciones relevantes y primeros planes puestos en marcha, no solo por clics o cuentas creadas.

## Recorrido propuesto

1. **Landing.** Mensaje explícito: vender pedidos y planes de flores, bajo la propia marca. Una sola ocasión, fechas específicas o entregas recurrentes. Ejemplo visible de un ramo cada dos semanas. CTA principal hacia una demo abierta. Explicación breve del modelo y del acompañamiento.
2. **Tienda de ejemplo.** Casa Limón ofrece tres tamaños de ramo. Precio expresado por entrega. La modalidad, las fechas y el destinatario se eligen al configurar el pedido.
3. **Configurador.** Tres pasos: elegir la modalidad, completar fechas y entrega, y revisar. Datos ficticios precargados para explorar sin fricción. Total, frecuencia y ausencia de cobro real siempre explícitos.
4. **Confirmación.** Resumen del plan. Dos puertas: cómo lo ve la clienta y cómo lo recibe la floristería.
5. **Panel.** Agenda con entregas y estados, lista de planes, catálogo editable y vista de marca. El pedido simulado aparece con las mismas elecciones del configurador.
6. **Contratación.** Después de demostrar el resultado, invitar a conversar por WhatsApp. Acompañamiento real de la fundadora para configurar marca, precios y entregas. No prometer pago automático ni ventas garantizadas.

## Jerarquía visual

Landing expresiva con verde profundo, amarillo cálido, titulares directos y fotografía floral. Tienda de Casa Limón con identidad propia. Panel claro y funcional. La capa de demo acompaña el recorrido sin hacerse pasar por parte de la tienda de una clienta real.

## Cambios respecto de la versión actual

- El beneficio se explica antes de las restricciones del modelo comercial.
- La demo conecta comprador y floristería.
- El formulario se divide en decisiones manejables.
- Los importes siempre tienen unidad: por entrega.
- El inicio del panel responde qué hay que preparar y qué necesita atención.
- Desaparecen textos internos como `trialing`, `TBD`, `seed`, `cadencia` y descripciones de prueba.
- Se omiten botones de pago deshabilitados que distraen del flujo disponible.
- La contratación tiene una salida concreta, acompañada por una persona.

## Alcance y límites

Prototipo navegable independiente, con estado en memoria y sin conexión al backend. Recargar reinicia el ejemplo. Las fotografías existentes son provisionales. El número de contacto real sigue pendiente; no sustituirlo por un número ficticio. Las futuras pantallas reales deben conservar controles de autorización, estados de carga/error y validaciones del backend.

## Validación inicial sugerida

Mostrar el recorrido a cinco dueñas. Pedirles explicar qué vende Cairose, a quién podrían ofrecerle un plan y qué esperan que ocurra después de confirmar. Observar obstáculos sin guiarlas. Registrar si desean conversar y qué duda aparece antes de hacerlo. No asumir que cinco entrevistas prueban demanda de todo el mercado.

## Ampliación: ocasiones y fechas elegidas

- Solo esta ocasión: una fecha, una entrega y un total, sin suscripción.
- Elegir mis fechas: calendario nativo para agregar fechas explícitas con año; lista ordenada, opción de quitar, validación de duplicados y fechas pasadas. Total calculado por cantidad de entregas.
- Recibir con frecuencia: fecha inicial y frecuencia de 7, 14 o 28 días.
- Cada fecha elegida tiene su fila y estado independiente en la agenda. Pausa y salto de entregas se reservan a los planes recurrentes.
- La demo conserva el mismo ramo, destinatario, dirección y mensaje en las fechas de una selección. No repite aniversarios automáticamente cada año.
