# Resultados del experimento

Equipo: `omarchy`, usuario `roger`. MongoDB Community 8.0.16, tres contenedores en el mismo equipo. Horas locales del 13/11/2026, UTC−05:00.

| Fase | Observación | Registro |
|---|---|---|
| Estado inicial, 21:09 | m1 primario; m2 y m3 secundarios; salud 1 | `resultados/02-replicas.txt` |
| Datos propios, 22:33 | Documento base insertado con `w:3`, `j:true`; consulta correcta | `resultados/03-datos.txt` |
| Apagado, 22:41 | m1 detenido con SIGTERM, salida 0; m2 observado como primario; documento base consultable y nueva escritura confirmada con mayoría | `resultados/04-apagado.txt` |
| Recuperación, 22:47 | m1 reincorporado como secundario; tres miembros sanos; ambos documentos consultados directamente en m1 | `resultados/05-recuperacion.txt` |

Las cuatro capturas correspondientes están en `capturas/`.

## Interpretación

La ausencia de m1 no impidió la escritura comprobada después del cambio de primario: quedaron dos miembros de los tres votantes, suficientes para una mayoría. Al reincorporarse, m1 recibió también el documento escrito durante su ausencia.

La vista inmediata de `rs.status()` todavía mostraba salud 1 para m1, aunque Docker ya lo indicaba detenido. No se interpreta esa vista como detección instantánea ni se modifica la salida original.

## Límites

Se realizó un apagado ordenado, no un cierre abrupto ni una partición de red. Los tres procesos comparten máquina; no se probó la pérdida del host. Tampoco se midieron el tiempo exacto de elección, errores durante toda la transición, latencia comparativa ni ausencia universal de pérdida de datos. Las horas de la tabla son marcas de ejecución, no mediciones de duración de la recuperación.
