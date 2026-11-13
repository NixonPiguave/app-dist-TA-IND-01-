# Bitácora de trabajo — TA-IND-01

Estudiante: Eduardo David Reinoso Vélez

Sistema analizado: Redis (comparado con Memcached)

---

## 2026-11-12 (jueves)

**Qué hice**
- Cloné el repositorio compartido `NixonPiguave/app-dist-TA-IND-01-`.
- Creé mi carpeta `reinoso/` con `README.md` y `BITACORA.md`.
- Revisé el chat del curso con las elecciones de sistema de mis compañeros.
- Cambié mi tema a Redis (sistema principal) frente a Memcached, lo publiqué en el chat del curso (6:25 PM) y actualicé el `README.md`.
- Levanté un clúster de Redis de 6 nodos (3 maestros y 3 réplicas) con Docker Compose y comprobé su estado con `cluster nodes`.
- Escribí 30 claves: quedaron repartidas 10, 11 y 9 entre los maestros, y redis5 tenía las mismas 10 claves que redis1.
- Detuve redis1: redis5 pasó a maestro de los slots 0–5460 y las 30 claves siguieron respondiendo. Después reincorporé redis1 como réplica.
- Medí el tiempo de promoción al detener redis5: redis1 apareció como maestro unos 8 s después.
- Probé escrituras durante la caída de redis1: 38 de 39 confirmadas, ninguna se perdió al releerlas, y un intento quedó bloqueado unos 38 s.
- Dibujé a mano el boceto inicial de la arquitectura (Anexo A).
- Leí a Repin y Sidorov (2025) y capturé el pasaje sobre pérdida de datos con su página.
- Redacté `comandos.md` y `resultados.md` con los comandos y las salidas reales.

**Problemas encontrados**
- Mi primera elección, Apache Cassandra, ya la había anunciado otro compañero como sistema principal.
- El primer `docker compose up -d` falló porque Docker Desktop estaba cerrado.
- Mi primera prueba de escrituras durante la caída usaba dos ventanas separadas y no pude ubicar sus escrituras respecto al momento de la caída.
- Un intento de escritura dirigido al maestro detenido se quedó esperando unos 38 s, porque no configuré ningún límite de espera.

**Cómo los resolví**
- Elegí Redis como sistema principal y Memcached como comparación, porque ninguno aparecía en las elecciones del chat.
- Abrí Docker Desktop, comprobé con `docker info` y repetí el comando.
- Descarté esa primera prueba y la repetí con un solo script que escribe y detiene el nodo.
- Dejé el bloqueo documentado como hallazgo en `resultados.md`.

**Uso de IA**
- Usé Claude para planificar el trabajo, redactar `comandos.md` y `resultados.md`, y encontrar el artículo de Repin y Sidorov. Ejecuté yo todos los comandos, comparé cada salida con lo escrito y verifiqué en el PDF la página del pasaje.

**Tiempo dedicado:** 4 horas


   ---

   ## 2026-11-13 (viernes)

   [PENDIENTE]