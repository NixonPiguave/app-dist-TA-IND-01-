# Resultados del experimento: caída de un maestro en Redis Cluster

Fecha: jueves 12 de noviembre de 2026, entre las 19:00 y las 20:40. Usuario del equipo: `edk\lenovo.user` (salida de `whoami` en las capturas).

## Entorno

- Windows con PowerShell y Docker Desktop (servidor Docker 29.9.3, Compose v5.7.0 según `docker info`).
- Imagen `redis:7.2`, 6 contenedores en una red Docker propia con IP fijas 172.30.0.11 a 172.30.0.16 (redis1 a redis6).
- Configuración de cada nodo: `cluster-enabled yes`, `cluster-node-timeout 5000` ms y `appendonly yes`.
- Comandos exactos en `comandos.md`; salidas en los archivos `salida-0X-*` y capturas en `../capturas/`.
- Las pruebas se hicieron una tras otra sobre el mismo clúster, así que cada una parte de los roles que dejó la anterior.

## Resultados

### 1. Estado inicial (captura 1, `salida-01-cluster-nodes.txt`)

Los 6 nodos aparecen conectados. Redis repartió los 16384 slots entre tres maestros y asignó una réplica a cada uno:

| Maestro | Slots | Réplica |
|---|---|---|
| redis1 (172.30.0.11) | 0–5460 | redis5 (172.30.0.15) |
| redis2 (172.30.0.12) | 5461–10922 | redis6 (172.30.0.16) |
| redis3 (172.30.0.13) | 10923–16383 | redis4 (172.30.0.14) |

### 2. Datos antes del fallo (captura 2)

Escribí 30 claves (`clave1` a `clave30`) desde redis1 con el cliente en modo cluster. Resultado de `dbsize` en cada nodo:

| Nodo | Claves |
|---|---|
| redis1 (maestro) | 10 |
| redis2 (maestro) | 11 |
| redis3 (maestro) | 9 |
| redis5 (réplica de redis1) | 10 |

Las tres cifras de los maestros suman 30, y la réplica redis5 tenía las mismas 10 claves que redis1.

### 3. Caída de redis1 (captura 3, `salida-03-redis1-detenido.txt`)

Detuve redis1 con `docker stop`. A las 19:20:51 (hora de `Get-Date`) `docker compose ps` ya no lista redis1 y los otros cinco contenedores siguen `Up`. El `cluster nodes` consultado desde redis2 muestra:

- redis1 con las banderas `master,fail`: el clúster lo marcó como caído.
- redis5 como `master` con los slots 0–5460 y epoch 7.

Es decir, cuando listé los nodos la promoción ya había ocurrido. En esta primera prueba el `docker stop` y el listado no quedaron en el mismo bloque, así que no medí cuánto tardó la promoción; lo medí en el punto 6.

### 4. Estado tras la promoción (captura 4, `salida-04-promocion-de-replica.txt`)

A las 19:23:26 el estado es el mismo y estable. `cluster info` desde redis2 reporta:

- `cluster_state:ok`, `cluster_slots_assigned:16384`, `cluster_slots_ok:16384` y `cluster_slots_fail:0`.
- `cluster_known_nodes:6`, `cluster_size:3`, `cluster_current_epoch:7`.
- En redis2: `auth-req_received:1` y `auth-ack_sent:1`, además de `fail_sent:5` y `fail_received:2`.

Pedí las 30 claves a redis2 con `get` en modo cluster. Las 30 respondieron con su valor (`valor1` a `valor30`). La salida completa está en la captura `04b-lectura-de-claves.png`.

### 5. Reincorporación (captura 5, `salida-05-redis1-reincorporado.txt`)

Arranqué redis1 con `docker start` y esperé 15 segundos. En `cluster nodes`:

- redis1 aparece como `slave` de redis5, con estado `connected`.
- redis5 sigue como `master` de los slots 0–5460.
- Los demás nodos conservan sus roles.

### 6. Tiempo de promoción (captura 6)

Estado de partida: redis5 maestro de 0–5460 y redis1 su réplica. Detuve redis5 y consulté `cluster nodes` desde redis2 en bucle hasta que redis1 apareció como `master`:

| Evento | Hora |
|---|---|
| `docker stop redis5` emitido | 20:21:56.267 |
| `docker stop redis5` terminó | 20:21:57.013 |
| redis2 ve a redis1 como `master` | 20:22:05.033 |

Pasaron 8.02 s desde que terminó el stop (8.77 s desde que lo emití). El `cluster nodes` final muestra:

- redis1 como `master` de 0–5460 con epoch 8.
- redis5 como `master,fail` con epoch 7.
- redis2 (5461–10922) y redis3 (10923–16383) sin cambios.

Es una sola medición. La resolución es de unas décimas de segundo, porque cada consulta del bucle es un `docker exec`, y lo que mide es cuándo redis2 se enteró de la promoción, no el instante de la elección.

### 7. Escrituras durante la caída (captura 7, `salida-07-escrituras-durante-caida.csv`, `salida-09-keyslots.txt`)

Estado de partida: redis1 maestro de 0–5460 y redis5 su réplica. Un script escribió claves `caida1`, `caida2`… en redis2 (que no se detuvo), una tras otra, durante 40 s, y detuvo redis1 a los 10 s. El CSV guarda la hora en que terminó cada intento.

| Hora | Qué pasó |
|---|---|
| 20:33:31.3 a 20:33:40.9 | `caida1` a `caida35`: todas OK, unos 0.28 s por intento. |
| 20:33:40.974 a 20:33:41.410 | `docker stop redis1`. |
| 20:33:41.6 a 20:33:42.1 | `caida36`, `caida37` y `caida38`: OK. Sus slots (14763, 10634 y 6245) pertenecen a redis3 y redis2, que seguían vivos. |
| 20:33:42 a 20:34:20.321 | `caida39` (slot 2116, dentro del rango de redis1): el intento quedó bloqueado unos 38 s y terminó con `Could not connect to Redis at 172.30.0.11:6379: No route to host`. |

Resumen de la verificación: 39 intentos, 38 confirmadas con `OK`, 1 con error. Releí las 38 confirmadas con `get` en modo cluster y **no faltó ninguna**. De las 35 claves escritas antes del stop, 11 estaban en el rango de redis1 (`caida1, 4, 5, 8, 9, 13, 17, 22, 26, 31` y `35`); `caida35` se escribió 0.12 s antes de emitir el stop. Al consultar `cluster nodes` después, redis5 era `master` de 0–5460 con epoch 9 y redis1 aparecía como `master,fail`.

### 8. Reincorporación de redis1 (`salida-08-redis1-reincorporado.txt`)

Arranqué redis1 y esperé 15 segundos. Volvió como `slave` de redis5 (`connected`, epoch 9), y redis5 siguió como `master` de 0–5460. Las épocas que vi en las tres promociones fueron 7 (redis5), 8 (redis1) y 9 (redis5): cada una subió en 1.

## Interpretación

**Detección y promoción.** Al caer redis1, los demás nodos lo marcaron como `fail` y su réplica redis5 pasó a maestro del rango 0–5460. Mis salidas son coherentes con una elección: redis5 quedó con epoch 7 (la versión de configuración del clúster subió), y redis2 recibió una petición de voto (`auth-req_received:1`) y envió una confirmación (`auth-ack_sent:1`). Mi lectura es que redis5 pidió votos a los maestros y redis2 votó a favor, pero la salida no muestra a quién votó, así que es una inferencia. En las otras dos caídas (puntos 6 y 7) la época subió otra vez en 1, como en esta.

**Tiempo de recuperación.** Con redis5 detenido, redis2 vio a redis1 como maestro unos 8 s después. Es coherente con `cluster-node-timeout 5000`: los nodos esperan al menos 5 s sin respuesta antes de sospechar de la caída, y después hace falta que la réplica se postule y gane la elección. No medí cada fase por separado ni repetí la medición, así que no puedo dar un promedio ni una dispersión. Lo que mido es el tiempo hasta que un nodo se entera, no hasta que un cliente puede volver a escribir.

**Disponibilidad y datos.** Con redis1 caído, el clúster volvió a `cluster_state:ok` con los 16384 slots cubiertos, y las 30 claves respondieron. Como redis1 estaba apagado, las 10 claves que guardaba tuvieron que servirse desde redis5, que las tenía replicadas desde antes (captura 2). Redis2 guarda 11 de las 30 claves, así que las 19 restantes las obtuvo el cliente de otros nodos mediante las redirecciones del modo cluster, sin que yo indicara qué nodo tenía cada clave. En el punto 7, las 11 claves que estaban en el rango de redis1 al caer (la última, 0.12 s antes del stop) se leyeron después desde el nuevo maestro, redis5. Eso muestra que, en esta muestra pequeña, la réplica ya tenía esas escrituras. No descarta una pérdida de escrituras confirmadas y aún no replicadas, porque tengo una sola escritura tan cercana al fallo y fue una sola prueba.

**Comportamiento del cliente durante la caída.** El único error del experimento no fue un rechazo del clúster. `caida39` pertenece al rango de redis1 y fue la primera clave tras el stop que necesitaba a ese maestro. El mensaje indica que `redis-cli` intentó conectarse a 172.30.0.11, que es la dirección del redis1 detenido. Con `-c`, eso ocurre cuando el cliente sigue una redirección de redis2 hacia el dueño del slot, que ~1 s después del stop seguía siendo redis1. Es una inferencia: no guardé la respuesta de redis2. No configuré ningún límite de espera, y el sistema tardó unos 38 s en responder `No route to host`. Para esa petición el fallo no fue transparente: no recibió un rechazo rápido sino un bloqueo largo. Un cliente real necesitaría tiempos de espera cortos y reintentos para no quedarse esperando a un nodo caído.

**Transparencias de distribución.** Este experimento ilustra tres. Transparencia de ubicación: pedí todo a redis2 sin saber dónde estaba cada clave. Transparencia de replicación: las lecturas no distinguen si el dato salió de un maestro o de una réplica promovida. Transparencia de fallos: tras la promoción, las lecturas no mostraron ningún error. Esta última es parcial: en el punto 7 una petición dirigida al maestro caído quedó bloqueada unos 38 s, y entre la caída y la promoción los slots 0–5460 no tienen maestro disponible.

**CAP y PACELC.** Redis Cluster replica de forma asíncrona: el maestro confirma la escritura sin esperar a la réplica, lo que favorece latencia y disponibilidad sobre consistencia fuerte. En el punto 7 escribí justo antes y durante la caída, y no observé pérdida entre las escrituras confirmadas, pero eso no demuestra que no pueda ocurrir: con un solo cliente secuencial y una sola caída no pongo a prueba la ventana de replicación. Repin y Sidorov (2025, sección 4, tablas 3 y 6) probaron Redis Cluster en contenedores Docker y reportan pérdida de datos cuando falla un líder o una réplica, y dos líderes con violación de consistencia cuando parten la red en dos. Para la caída de un nodo usaron la misma técnica que yo, detener el contenedor (tabla 3). En ese caso mi resultado difiere: al detener un maestro no perdí ninguna escritura confirmada. El artículo no indica cuántas claves escribieron, si escribían durante la caída ni cómo configuraron las réplicas, así que no puedo explicar la diferencia; mi prueba es pequeña (39 escrituras, un cliente, una caída). La partición de red que ellos también probaron no la hice, y no puedo confirmar ni contradecir ese resultado con el mío.

**Reincorporación.** Redis1 volvió como réplica de redis5 y no recuperó su rol de maestro, y lo mismo pasó con redis5 en la prueba 6. Los roles quedaron intercambiados respecto al estado inicial. Devolverle el rol requeriría una acción manual, que no probé.

## Limitaciones

- Medí el tiempo de promoción una sola vez, deteniendo un solo nodo, y con una resolución de unas décimas de segundo. No hay promedio ni dispersión.
- No medí la ventana de errores para las escrituras. El escritor es secuencial y su único intento dirigido al maestro caído se bloqueó ~38 s, así que no muestreó el intervalo entre la caída y la promoción.
- Probé escrituras con un solo cliente y no con varios en paralelo. No demostré ni descarté pérdida de escrituras confirmadas pero no replicadas.
- Fallé un solo maestro de tres, en un solo equipo con 6 contenedores. No probé una partición de red real ni la caída simultánea de un maestro y su réplica.
- La comparación con Memcached se apoya en documentación y fuentes, no en un experimento propio.

## Incidencias

- El primer `docker compose up -d` falló porque Docker Desktop no estaba abierto (el motor de Docker no respondía). Lo abrí, verifiqué con `docker info` y repetí el comando sin cambios.
- Una primera prueba de escrituras durante la caída (escritor y `docker stop` en dos ventanas separadas) la descarté: no pude ubicar con certeza sus escrituras respecto al momento de la caída. La repetí con un solo script (punto 7).
