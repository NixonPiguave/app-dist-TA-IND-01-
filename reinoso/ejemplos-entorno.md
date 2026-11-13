# Ejemplos de mi entorno

Observaciones propias de sistemas que uso.

## Ejemplo 1: WhatsApp sin conexión

**Contexto.** Uso WhatsApp en el celular a diario. Cuando me quedo sin internet o activo el modo avión, no puedo enviar mensajes.

**Qué observo.** Con la conexión caída mis mensajes no salen. Al reconectar, el envío ocurre entre 1 y 3 segundos después, según cuántos mensajes tenga pendientes. En la conversación el orden resulta distinto del real: si escribí un mensaje a las 8:30, reconecté a las 9:00 y mientras tanto me llegaron mensajes a las 8:40, mi mensaje aparece antes de los recibidos a las 8:40, con la hora 8:30, aunque en realidad no salió hasta las 9:00.

**Concepto.** Entrega diferida con tolerancia a fallos del cliente, y orden de los eventos.

**Interpretación.** El sistema oculta parte de la falla: no pierdo el mensaje, pero tampoco se entrega hasta que reconecto, así que la transparencia de fallos es parcial. El orden que veo sigue la hora en que escribí el mensaje, no la hora en que se entregó. Después de reconectar, mi pantalla y la de la otra persona muestran órdenes distintos de la misma conversación. En mi experimento con Redis tampoco todos los nodos vieron el mismo estado al mismo tiempo: redis2 tardó unos 8 s en ver a redis1 como maestro después de detener redis5.

**Límites.** Es una observación de uso, no una medición: no anoté la fecha ni la hora de un caso concreto, es algo que me ocurre de forma repetida. No sé cómo WhatsApp ordena los mensajes por dentro; describo lo que veo en mi celular. La otra persona sí ve el orden real de envío; en mi pantalla mi mensaje aparece "antes" aunque salió después, así que dos clientes muestran órdenes distintos de la misma conversación.

## Ejemplo 2: SGA de la UTEQ en época de matrícula

**Contexto.** Uso el SGA de la UTEQ cada periodo para matricularme: elijo materias y paralelos desde el navegador.

**Qué observo.** En época de matrícula el sistema va más lento que de costumbre. Al seleccionar materias y paralelos tarda más de lo normal, y la pantalla de carga a veces pasa de 10 segundos, y en ocasiones más.

**Concepto.** Escalabilidad y comportamiento bajo carga concurrente.

**Interpretación.** En esa época muchos estudiantes hacen las mismas operaciones a la vez, y el tiempo de respuesta sube. Eso sugiere que el sistema se degrada con el pico de demanda, aunque no tengo mediciones. Mi hipótesis es que influyen las consultas repetidas sobre los mismos datos, como los paralelos y sus cupos. Una capa de caché es una de las formas de absorber ese tipo de lecturas, y es el tipo de sistema que analizo con Redis y Memcached. No sé si el SGA usa una caché; es una hipótesis mía, no un dato.

**Límites.** Los más de 10 segundos son una estimación, no los medí con cronómetro. No anoté la fecha de un caso concreto: es algo que observo en cada matrícula. La época de matrícula ya pasó, así que no puedo reproducirlo ahora. No conozco la arquitectura interna del SGA.
