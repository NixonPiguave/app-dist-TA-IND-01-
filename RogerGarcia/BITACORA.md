# Bitácora — Roger Steven García Sangoquiza

Horarios locales de Ecuador (UTC-05:00), contrastados con mensajes de la sesión, registros del experimento y fechas de commits. Son hitos de actividad, no periodos de trabajo continuo.

**Cierre confirmado:** 13 de noviembre de 2026, a las 23:59. Los commits posteriores se consideran fuera de plazo y no válidos para acreditar la entrega puntual, aunque se conserven para completar el trabajo.

## 12 de noviembre de 2026 — Selección y estructura inicial

- **Trabajo:** elección de MongoDB Community como sistema principal y Apache CouchDB como comparador; definición de `RogerGarcia/` dentro del repositorio compartido; preparación asistida de carátula, secciones LaTeX y PDF.
- **Problema observado personalmente:** `docker version` muestra el cliente, pero devuelve `permission denied` al acceder a `/var/run/docker.sock`.
- **Tratamiento:** se registró el bloqueo; no se modificaron los permisos del sistema ni se ejecutó MongoDB. Se revisó el contenido remoto para conservar intacto el trabajo de los demás integrantes.
- **Apoyo y comprobaciones:** plantillas preparadas con OpenCode/GPT-6.1 Sol. Las comprobaciones de compilación realizadas por la herramienta no se presentan como evidencia experimental personal.
- **Hitos horarios:** selección iniciada a las 20:16; primer commit a las 22:44; confirmación de subida en la sesión a las 22:59.
- **Commit:** `073a802236` — carpeta y plantillas iniciales.

## 13 de noviembre de 2026 — Preparación del laboratorio

- **Actividad:** comprobación del servicio Docker, preparación de la configuración y puesta en marcha de tres nodos MongoDB.
- **Problema y solución:** el acceso normal estaba denegado; `sudo docker version` mostró el servidor disponible. Se utilizó autorización puntual, sin cambiar permisos del sistema.
- **Estado:** conjunto `rs0` configurado. La consulta del 13 de noviembre a las 21:09 mostró m1 como `PRIMARY` y m2/m3 como `SECONDARY`, todos con salud `1`. Salida conservada en `experimento/resultados/02-replicas.txt` y captura en `experimento/capturas/01-estado-inicial.png`.
- **Datos propios:** a las 22:33 se insertó y consultó `roger-taind01-base`, con confirmación de los tres miembros (`w:3`, `j:true`). Registro: `experimento/resultados/03-datos.txt`.
- **Prueba de apagado:** a las 22:41 se apagó ordenadamente m1; m2 fue observado como primario y confirmó una nueva inserción con `w:"majority"`. El documento inicial siguió consultable. Registro: `experimento/resultados/04-apagado.txt`.
- **Recuperación:** a las 22:47 m1 regresó como secundario y se consultaron directamente en él ambos documentos. Se conservaron cuatro capturas y se resumieron las observaciones y límites de la prueba.
- **Informe:** elaboración del borrador con las fuentes cotejadas, el diagrama digital, los resultados y los ejemplos personales de YouTube y Discord. Comprobación de compilación con pdfLaTeX y Biber; anexos de lectura y revisión personal pendientes.
- **Otros hitos horarios:** acceso Docker confirmado a las 00:54; inicio del laboratorio registrado a las 17:32; revisión de la primera captura en la sesión a las 21:14.
- **Commits:** `04b31835ad` (22:19) y `d10368cf11` (22:20), configuración; `f50d9a6485` (22:58), experimento; `f3ef682286` (23:28), fuentes; `bf7280fc64` (23:36), análisis y diagrama.

Las actualizaciones se realizan personalmente desde GitHub, conservando la ruta `RogerGarcia/` y los nombres de archivo.

## 14 de noviembre de 2026 — Finalización fuera de plazo

- **Actividad:** incorporación de la fotografía del bosquejo, tres capturas de lectura y enlace al video; confirmación personal de los DOI.
- **Comprobación:** correspondencia de cada captura con su fuente y recompilación del informe con anexos.
- **Hitos horarios:** evidencias y enlace comunicados en la sesión a las 00:16; commit de integración a las 00:30.
- **Commit fuera de plazo:** `c81a54b8ee`, del 14/11/2026 a las 00:30:34 — anexos y sustentación. **No válido para acreditar entrega dentro del horario establecido**, pero conservado como avance necesario para completar el informe y sus evidencias.

Estos avances no se presentan como entregados a tiempo ni implican una prórroga. Las actualizaciones posteriores al cierre tienen la misma condición.

**Tiempo efectivo total estimado por el estudiante:** entre 5 y 6 horas. No se cronometró por día; las marcas anteriores documentan la secuencia, pero no permiten descontar pausas ni calcular una distribución exacta de esas horas.

Las entradas posteriores documentarán únicamente actividades reales, problemas, soluciones y tiempo efectivo. Las fechas del historial no se alterarán para aparentar días adicionales.
