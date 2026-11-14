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

Se conservan el bosquejo inicial a mano, cuatro capturas de ejecución, las configuraciones y las salidas de las comprobaciones. Las pruebas de caída y recuperación, la investigación bibliográfica y el informe están pendientes.

## Procedimiento y configuraciones

- [BITACORA.md](BITACORA.md): registro del trabajo realizado.
- [experimento/comandos.md](experimento/comandos.md): comandos, evidencias, resultados e interpretación por etapas.
- [experimento/compose.yaml](experimento/compose.yaml): configuración histórica de la primera ejecución con un servidor.
- [experimento/compose-cluster.yaml](experimento/compose-cluster.yaml): configuración de los tres nodos; se selecciona con `docker compose -f compose-cluster.yaml` desde experimento/.

## Resultados conservados

- [Inicio del primer servidor](experimento/resultado-inicio.txt).
- [Estado y conexiones del clúster](experimento/resultado-cluster.txt).
- [Configuración del flujo antes de publicar mensajes](experimento/resultado-flujo.txt).
- [Publicación y recuperación del mensaje](experimento/resultado-mensajeria.txt), incluida la incidencia de redirección en PowerShell y su resolución.

## Evidencias

| Archivo | Qué documenta |
|---|---|
| [Bosquejo a mano — Anexo A](evidencias/anexo-a/bosquejo-inicial-nats.png) | Representación inicial de la arquitectura con nombre y fecha. |
| [Captura 01](evidencias/ejecucion/01-inicio-nats-jetstream.png) | Inicio de NATS con JetStream. |
| [Captura 02](evidencias/ejecucion/02-conexiones-cluster-nats.png) | Conexiones de cada nodo con los otros dos. |
| [Captura 03](evidencias/ejecucion/03-flujo-tres-replicas.png) | Flujo con tres réplicas, líder y seguidores. |
| [Captura 04](evidencias/ejecucion/04-recuperacion-mensaje.png) | Recuperación del mensaje de secuencia 1 y código de salida 0. |

## Reproducción de la ejecución

Se requiere Docker Desktop con contenedores Linux y Docker Compose. El [procedimiento del experimento](experimento/comandos.md) distingue la primera ejecución, el clúster, el flujo replicado y la prueba de mensajería, con los comandos utilizados y las salidas conservadas.

## Compilación del informe

Pendiente. Al incorporar el informe en LaTeX, se añadirán el compilador, el archivo principal, las dependencias y los comandos de compilación comprobados.

## Video de sustentación

Pendiente de grabación y publicación.


