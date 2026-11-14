# Resultados e interpretación del experimento NATS con JetStream

Este archivo reúne las observaciones de las pruebas realizadas el 13 de noviembre de 2026, sus evidencias y sus límites. El procedimiento ejecutado está en [comandos.md](comandos.md); las salidas originales se conservan en los archivos .txt enlazados en cada etapa.

## 1. Inicio del primer servidor

La configuración inicial permitió ejecutar NATS 2.15.3 con JetStream. El contenedor nats-nixon-1 apareció con estado `Up`. Los registros mostraron `Starting JetStream`, el directorio `/data/jetstream`, la escucha de clientes en el puerto 4222 y `Server is ready`.

Estas observaciones respaldan que el proceso y JetStream iniciaron correctamente. En este momento había un único servidor; las pruebas distribuidas se realizaron después.

Evidencias: [resultado-inicio.txt](resultado-inicio.txt) y [captura 01](../evidencias/ejecucion/01-inicio-nats-jetstream.png).

Durante la preparación del registro se había añadido la misma salida más de una vez. Se regeneró el archivo con una tabla de estado y un solo bloque de inicio. También se utilizó `--no-trunc` para conservar completo el comando del contenedor y se guardó el texto con codificación UTF-8.

## 2. Conexiones del clúster

Los tres contenedores quedaron activos. Las consultas al monitoreo mostraron que cada nodo reconocía a los otros dos:

| Nodo consultado | Puerto de monitoreo | Vecinos observados |
|---|---|---|
| nats-nixon-1 | 8222 | nats-nixon-2 y nats-nixon-3 |
| nats-nixon-2 | 8223 | nats-nixon-1 y nats-nixon-3 |
| nats-nixon-3 | 8224 | nats-nixon-1 y nats-nixon-2 |

Se mostraron los nombres únicos porque pueden existir varias conexiones de ruta entre los mismos servidores. Esto permite comprobar la comunicación entre los tres nodos en el momento de la consulta.

Evidencias: [resultado-cluster.txt](resultado-cluster.txt) y [captura 02](../evidencias/ejecucion/02-conexiones-cluster-nats.png). El archivo de texto corresponde a una consulta posterior a la captura; sus tiempos de actividad reflejan ese momento.

## 3. Configuración del flujo replicado

Se creó el flujo MENSAJES_NIXON, asociado al asunto nixon.mensajes, con almacenamiento `File` y `Replicas: 3`. La consulta identificó a nats-nixon-1 como líder y a nats-nixon-2 y nats-nixon-3 como seguidores en estado `current`.

Las tres copias incluyen la del líder. La selección del líder fue un resultado observado; no es una función asignada permanentemente a nats1.

Evidencias: [resultado-flujo.txt](resultado-flujo.txt) y [captura 03](../evidencias/ejecucion/03-flujo-tres-replicas.png). En este archivo se observan cero mensajes y cero consumidores porque se guardó antes de la primera publicación. Tener las réplicas configuradas y comprobar operaciones con mensajes son etapas distintas.

## 4. Publicación y recuperación del primer mensaje

Se publicó el texto `Mensaje de prueba de Nixon Piguave - TA-IND-01` a través de nats1. JetStream devolvió `Stored in Stream: MENSAJES_NIXON Sequence: 1`. Después se recuperó MENSAJES_NIXON#1 conectando el cliente a nats3 y se obtuvo el mismo texto. La recuperación terminó con código de salida 0.

Evidencias: [resultado-mensajeria.txt](resultado-mensajeria.txt) y [captura 04](../evidencias/ejecucion/04-recuperacion-mensaje.png). La captura muestra la recuperación y el código de salida; la confirmación de publicación está conservada en el archivo de texto.

### Incidencia de redirección

PowerShell presentó un diagnóstico `NativeCommandError` al procesar una salida informativa de la herramienta NATS. La misma salida confirmó que el mensaje se había almacenado. Se conservó el diagnóstico original y no se repitió la publicación. Para recuperar el mensaje, se combinaron las salidas dentro del contenedor con `sh -c` antes de guardarlas en PowerShell.

### Fechas de los registros

El equipo mostró el 13 de noviembre de 2026 a las 19:59:31 con zona -05:00. El contenedor mostró el 14 de noviembre a las 00:59:32 UTC. La diferencia de cinco horas explica que el flujo y los mensajes aparezcan con fecha 14 en la herramienta, mientras la actividad local se registró el día 13. Se conservaron las marcas de tiempo originales.

## 5. Caída del líder y operaciones con dos nodos

Antes de provocar el fallo, el flujo tenía a nats-nixon-1 como líder, los otros dos nodos figuraban `current` y había un mensaje con secuencia 1. Ese estado se conserva en [resultado-antes-fallo.txt](resultado-antes-fallo.txt).

Se terminó abruptamente el servicio nats1 mediante SIGKILL, conservando su volumen. La consulta posterior mostró ese contenedor detenido con `Exited (137)` y a los otros dos activos. nats-nixon-3 aparecía como nuevo líder; nats-nixon-2 seguía `current` y nats-nixon-1 figuraba `outdated, not seen, 3 operations behind`. Esta última cantidad describe operaciones pendientes y no se interpreta como tres mensajes perdidos. El flujo aún registraba el mensaje de secuencia 1.

Evidencias de la caída y elección: [resultado-caida.txt](resultado-caida.txt) y [captura 05](../evidencias/ejecucion/05-cambio-lider-tras-caida.png).

Con nats1 todavía detenido, se recuperó el mensaje 1, se publicó `Mensaje_de_Nixon_con_nats1_detenido` y JetStream confirmó su almacenamiento con secuencia 2. También se recuperó ese nuevo mensaje. Se usó nats2 como punto de conexión del cliente para estas operaciones.

Evidencias de las operaciones: [resultado-durante-caida.txt](resultado-durante-caida.txt) y [captura 06](../evidencias/ejecucion/06-mensajeria-durante-caida.png).

Los resultados muestran que, después del cambio de líder, los dos nodos disponibles permitieron recuperar un mensaje anterior y aceptar y recuperar uno nuevo.

## 6. Reincorporación y sincronización

Se inició nuevamente el contenedor existente de nats1. La consulta posterior mostró los tres contenedores activos, a nats-nixon-3 como líder y a nats-nixon-1 y nats-nixon-2 como seguidores en estado `current`.

El flujo conservó dos mensajes, con primera secuencia 1 y última secuencia 2. Una solicitud entrando por nats1 recuperó el mensaje que se había publicado mientras ese nodo estaba detenido. El nodo reincorporado continuó como seguidor; no necesitó recuperar el liderazgo para volver a figurar sincronizado.

Evidencias: [resultado-recuperacion.txt](resultado-recuperacion.txt) y [captura 07](../evidencias/ejecucion/07-recuperacion-nodo-sincronizado.png).

| Momento observado | Líder del flujo | Estado de los demás nodos | Mensajes |
|---|---|---|---|
| Antes del fallo | nats-nixon-1 | nats2 y nats3 current | 1 |
| Primera consulta tras la caída | nats-nixon-3 | nats2 current; nats1 detenido y desactualizado | 1 |
| Operaciones con nats1 detenido | nats-nixon-3 en la consulta de referencia | Se utilizó nats2 como punto de conexión | Mensaje 1 recuperado y mensaje 2 confirmado y recuperado |
| Después de la reincorporación | nats-nixon-3 | nats1 y nats2 current | 2 |

## 7. Interpretación y límites

Esta configuración permitió realizar las operaciones probadas con un nodo detenido, después de elegir otro líder, y el nodo reincorporado volvió a figurar sincronizado. Los dos mensajes utilizados quedaron conservados en el flujo. Esto permite discutir tolerancia a fallos, replicación, cambio de líder y recuperación, relacionando lo observado con la mayoría del grupo de tres réplicas. El mecanismo de consenso y sus garantías deberán respaldarse además con fuentes técnicas y académicas en el informe.

- Se provocó una caída de proceso, no una partición de red, un fallo de disco ni la caída de toda la computadora. Los tres contenedores comparten el equipo.
- Las operaciones se comprobaron después del cambio de líder. No se ejecutó una carga continua durante la elección; no se afirma ausencia total de interrupciones.
- No se midió la duración exacta de detección, elección o sincronización. Las marcas de tiempo identifican consultas. Los tiempos entre paréntesis del líder no miden cuánto tardó la elección.
- Conectarse a un nodo no identifica por sí solo qué réplica atendió internamente la solicitud. `current` es el estado informado por el servidor.
- Se recuperaron mensajes por secuencia o asunto. No se creó un consumidor persistente ni se comprobó un ciclo de confirmación de consumo.
- Se probaron dos mensajes. La prueba no constituye un benchmark ni demuestra todas las garantías de CAP/PACELC.

## Bosquejo inicial de arquitectura

La fotografía del [bosquejo a mano](../evidencias/anexo-a/bosquejo-inicial-nats.png), con nombre y fecha visibles, se conserva para el Anexo A. Representa un cliente, tres nodos con copias del mismo flujo y conexiones entre ellos. El nodo 1 se dibujó como líder ilustrativo y posteriormente se contrastó ese papel con la consulta del flujo. El informe mostrará su evolución hacia el diagrama final.
