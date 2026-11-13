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

Se completó la primera ejecución local de NATS 2.15.3 con JetStream mediante Docker Compose. Se conservaron la configuración, los comandos, una captura original y la salida del inicio del servidor.

Las siguientes etapas incluyen configurar tres nodos y un flujo con tres réplicas, probar la mensajería y observar la caída y recuperación de un nodo. La investigación bibliográfica y el informe están pendientes.

## Contenido actual

- [BITACORA.md](BITACORA.md): registro del trabajo realizado.
- [experimento/comandos.md](experimento/comandos.md): procedimiento, explicación de los comandos e interpretación de la primera ejecución.
- [experimento/compose.yaml](experimento/compose.yaml): configuración ejecutable de NATS con JetStream.
- [experimento/resultado-inicio.txt](experimento/resultado-inicio.txt): estado del contenedor y registros de inicio.
- [Primera captura de ejecución](evidencias/ejecucion/01-inicio-nats-jetstream.png): evidencia original del servidor en funcionamiento.

## Reproducción de la ejecución

Se requiere Docker Desktop con contenedores Linux y Docker Compose. Consultar el [procedimiento del experimento](experimento/comandos.md) para iniciar el servidor, comprobar su estado y guardar los resultados.

## Compilación del informe

Pendiente. Al incorporar el informe en LaTeX, se añadirán el compilador, el archivo principal, las dependencias y los comandos de compilación comprobados.

## Video de sustentación

Pendiente de grabación y publicación.

