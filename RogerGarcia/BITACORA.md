# Bitácora — Roger Steven García Sangoquiza

## 12 de noviembre de 2026 — Selección y estructura inicial

- **Trabajo:** elección de MongoDB Community como sistema principal y Apache CouchDB como comparador; definición de `RogerGarcia/` dentro del repositorio compartido; preparación asistida de carátula, secciones LaTeX y PDF.
- **Problema observado personalmente:** `docker version` muestra el cliente, pero devuelve `permission denied` al acceder a `/var/run/docker.sock`.
- **Tratamiento:** se registró el bloqueo; no se modificaron los permisos del sistema ni se ejecutó MongoDB. Se revisó el contenido remoto para conservar intacto el trabajo de los demás integrantes.
- **Apoyo y comprobaciones:** plantillas preparadas con OpenCode/GPT-6.1 Sol. Las comprobaciones de compilación realizadas por la herramienta no se presentan como evidencia experimental personal.

## 13 de noviembre de 2026 — Preparación del laboratorio

- **Actividad:** comprobación del servicio Docker, preparación de la configuración y puesta en marcha de tres nodos MongoDB.
- **Problema y solución:** el acceso normal estaba denegado; `sudo docker version` mostró el servidor disponible. Se utilizará autorización puntual, sin cambiar permisos del sistema.
- **Estado:** conjunto `rs0` configurado. La consulta del 13 de noviembre a las 21:09 mostró m1 como `PRIMARY` y m2/m3 como `SECONDARY`, todos con salud `1`. Salida conservada en `experimento/resultados/02-replicas.txt` y captura en `experimento/capturas/01-estado-inicial.png`.

Los commits y las actualizaciones en GitHub los realizará personalmente el estudiante desde la página del repositorio, conservando la ruta `RogerGarcia/` y los nombres de archivo para mantener la trazabilidad.

Las entradas posteriores documentarán únicamente actividades reales, problemas, soluciones y tiempo efectivo. Las fechas del historial no se alterarán para aparentar días adicionales.
