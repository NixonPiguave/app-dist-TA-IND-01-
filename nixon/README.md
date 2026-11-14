# TA-IND-01 — Análisis crítico comparativo de sistemas distribuidos

- **Estudiante:** Nixon Antonio Piguave Montaño.
- **Universidad:** Universidad Técnica Estatal de Quevedo.
- **Facultad:** Facultad de Ciencias de la Computación.
- **Carrera:** Software.
- **Curso y paralelo:** 7mo nivel, paralelo A.
- **Asignatura:** Sistemas Distribuidos.
- **Actividad:** TA-IND-01 — Informe académico individual.
- **Repositorio:** [NixonPiguave/app-dist-TA-IND-01-](https://github.com/NixonPiguave/app-dist-TA-IND-01-).
- **Carpeta de esta entrega:** [nixon/](https://github.com/NixonPiguave/app-dist-TA-IND-01-/tree/main/nixon).
- **Sistema principal:** NATS con JetStream.
- **Sistema de comparación:** Apache Pulsar.

## Objetivo

Analizar las transparencias de distribución, CAP/PACELC, los modelos de comunicación y la tolerancia a fallos de NATS con JetStream, y compararlos con Apache Pulsar.

## Estado del trabajo

Se ejecutó NATS 2.15.3 con JetStream en un clúster local de tres nodos. Se comprobaron sus conexiones y se creó el flujo MENSAJES_NIXON con tres réplicas y almacenamiento en disco. JetStream confirmó un mensaje propio con secuencia 1, que después se recuperó conectando el cliente a otro nodo.

Se realizó además una prueba de caída abrupta del líder mediante SIGKILL: nats3 asumió el liderazgo, se recuperó el mensaje anterior y se publicó y recuperó un segundo mensaje con nats1 detenido. Al reiniciar nats1, los tres nodos volvieron a figurar sincronizados y el flujo conservó los dos mensajes.

Se conservan el bosquejo inicial a mano, siete capturas de ejecución, las configuraciones y las salidas de las comprobaciones. La bibliografía inicial reúne tres artículos de revista en inglés sobre NATS JetStream y Apache Pulsar, acompañados de cuatro capturas de lectura con fragmentos resaltados. Quedan pendientes ampliar las fuentes, desarrollar el análisis comparativo e integrar las citas y los anexos en el informe LaTeX.

## Procedimiento y configuraciones

- [BITACORA.md](BITACORA.md): registro del trabajo realizado.
- [informe/referencias.bib](informe/referencias.bib): bibliografía inicial exportada del proyecto LaTeX, con tres artículos de revista.
- [experimento/comandos.md](experimento/comandos.md): procedimiento, comandos y forma de guardar las salidas.
- [experimento/compose.yaml](experimento/compose.yaml): configuración histórica de la primera ejecución con un servidor.
- [experimento/compose-cluster.yaml](experimento/compose-cluster.yaml): configuración de los tres nodos; se selecciona con `docker compose -f compose-cluster.yaml` desde experimento/.

## Resultados conservados

- [experimento/resultados.md](experimento/resultados.md): observaciones, interpretación, comparación de los estados y límites del experimento.

- [Inicio del primer servidor](experimento/resultado-inicio.txt).
- [Estado y conexiones del clúster](experimento/resultado-cluster.txt).
- [Configuración del flujo antes de publicar mensajes](experimento/resultado-flujo.txt).
- [Publicación y recuperación del mensaje](experimento/resultado-mensajeria.txt), incluida la incidencia de redirección en PowerShell y su resolución.

- [Estado antes del fallo](experimento/resultado-antes-fallo.txt).
- [Caída del líder y nueva elección](experimento/resultado-caida.txt).
- [Operaciones con el nodo detenido](experimento/resultado-durante-caida.txt).
- [Reincorporación y sincronización](experimento/resultado-recuperacion.txt).

## Evidencias

| Archivo | Qué documenta |
|---|---|
| [Bosquejo a mano — Anexo A](evidencias/anexo-a/bosquejo-inicial-nats.png) | Representación inicial de la arquitectura con nombre y fecha. |
| [Captura 01](evidencias/ejecucion/01-inicio-nats-jetstream.png) | Inicio de NATS con JetStream. |
| [Captura 02](evidencias/ejecucion/02-conexiones-cluster-nats.png) | Conexiones de cada nodo con los otros dos. |
| [Captura 03](evidencias/ejecucion/03-flujo-tres-replicas.png) | Flujo con tres réplicas, líder y seguidores. |
| [Captura 04](evidencias/ejecucion/04-recuperacion-mensaje.png) | Recuperación del mensaje de secuencia 1 y código de salida 0. |
| [Captura 05](evidencias/ejecucion/05-cambio-lider-tras-caida.png) | Nuevo líder y nodo detenido desactualizado. |
| [Captura 06](evidencias/ejecucion/06-mensajeria-durante-caida.png) | Recuperación del mensaje anterior y publicación y recuperación de uno nuevo durante la caída. |
| [Captura 07](evidencias/ejecucion/07-recuperacion-nodo-sincronizado.png) | Nodo reincorporado current, dos mensajes conservados y recuperación del mensaje 2. |
| [Lectura 01 — Anexo B](evidencias/anexo-b/01-nats-comunicacion-asincrona-p485.png) | NATS JetStream como intermediario asíncrono y almacenamiento persistente; Ma’soem y Rukhviyanti, p. 485 (p. 4 del PDF). |
| [Lectura 02 — Anexo B](evidencias/anexo-b/02-nats-eventos-entre-clusteres-p7.png) | Uso de NATS JetStream para distribuir eventos entre clústeres; Ju et al., p. 7. |
| [Lectura 03 — Anexo B](evidencias/anexo-b/03-pulsar-separacion-capas-p4.png) | Separación entre servicio y almacenamiento y soporte multiusuario de Pulsar; Chy et al., p. 4. |
| [Lectura 04 — Anexo B](evidencias/anexo-b/04-pulsar-condiciones-persistencia-p22.png) | Diferencias de persistencia entre las configuraciones evaluadas; Chy et al., p. 22. |

## Reproducción de la ejecución

Se requiere Docker Desktop con contenedores Linux y Docker Compose. El [procedimiento](experimento/comandos.md) reúne los comandos de las cinco etapas. Las observaciones y los límites de lo comprobado están en [resultados.md](experimento/resultados.md).

## Compilación del informe

Pendiente. Al incorporar el informe en LaTeX, se añadirán el compilador, el archivo principal, las dependencias y los comandos de compilación comprobados.

## Video de sustentación

Pendiente de grabación y publicación.



