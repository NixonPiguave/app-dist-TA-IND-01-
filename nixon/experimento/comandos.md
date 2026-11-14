# Procedimiento y resultados de NATS con JetStream

## Etapa 1: primera ejecución local

### Alcance de esta etapa

El 13 de noviembre de 2026 se inició un servidor NATS con JetStream mediante Docker Compose. El objetivo de esta etapa fue comprobar que la configuración permitía iniciar el servidor, habilitar JetStream y conservar una evidencia de su funcionamiento.

El entorno utilizado fue Windows con PowerShell, Docker Desktop, Docker Engine 29.9.3 y Docker Compose 5.7.0. La imagen del servidor fue `nats:2.15.3-alpine`.

### Configuración utilizada

El archivo [compose.yaml](compose.yaml) define el proyecto `ta-ind-01-nixon` y el servicio `nats1`, cuyo contenedor se llama `nats-nixon-1`. Los argumentos del servidor son:

```text
-js -sd /data -m 8222 -n nats-nixon-1
```

- `-js`: habilita JetStream.
- `-sd /data`: establece el directorio de almacenamiento.
- `-m 8222`: habilita el monitoreo HTTP en el puerto 8222.
- `-n nats-nixon-1`: asigna un nombre al servidor.

El volumen declarado como `nats1-data` se monta en `/data`. Compose lo administra dentro del proyecto `ta-ind-01-nixon`. Los puertos publicados son `127.0.0.1:4222` para clientes y `127.0.0.1:8222` para monitoreo.

### Secuencia de ejecución

Los siguientes comandos se ejecutan desde la carpeta `nixon/experimento`, en PowerShell. La primera puesta en marcha se realizó desde `trabajo/experimento-nats`; después se continuó desde la carpeta de entrega con el mismo archivo y nombre de proyecto. Al consultar el estado se comprobó que seguía funcionando el mismo contenedor.

#### Validación e inicio

```powershell
docker compose config --quiet
docker compose up -d
```

El primer comando valida la configuración de Compose. En la ejecución realizada terminó sin mostrar errores. El segundo descargó la imagen y creó la red, el volumen y el contenedor necesarios para iniciar el servicio.

#### Consulta del servidor

```powershell
docker compose ps
docker compose logs --tail 35 nats1
```

La consulta del estado mostró el contenedor `nats-nixon-1` con estado `Up`. En los registros aparecieron la versión 2.15.3, el inicio de JetStream, el directorio `/data/jetstream`, la escucha de clientes en el puerto 4222 y el mensaje `Server is ready`.

Estos pasos se documentan en la [captura 01: inicio de NATS con JetStream](../evidencias/ejecucion/01-inicio-nats-jetstream.png). La captura muestra los comandos, el contenedor activo y los registros del inicio; la ruta del terminal identifica la carpeta de trabajo del estudiante.

#### Conservación de las salidas

```powershell
docker compose ps --no-trunc | Out-File -FilePath .\resultado-inicio.txt -Encoding utf8
docker compose logs --no-color nats1 | Out-File -FilePath .\resultado-inicio.txt -Encoding utf8 -Append
```

El primer comando guarda el estado y reemplaza el contenido anterior del archivo. La opción `--no-trunc` muestra completo el comando del contenedor. El segundo añade los registros al mismo archivo sin códigos de color. Ambos guardan texto con codificación UTF-8.

Durante la sesión se había añadido la misma salida de registros más de una vez. Se regeneró el archivo ejecutando estos dos comandos una sola vez y en este orden. El resultado final contiene una tabla de estado y un único bloque de inicio del servidor.

La salida conservada está en [resultado-inicio.txt](resultado-inicio.txt). Los tiempos de actividad que muestra corresponden al momento de esa consulta y cambiarán al repetirla.

### Interpretación de la evidencia

El estado `Up`, junto con los mensajes `Starting JetStream` y `Server is ready`, respalda que el proceso NATS y JetStream iniciaron correctamente. El registro también identifica la versión ejecutada y el directorio utilizado para el almacenamiento.

Al finalizar esta primera etapa se disponía de un servidor con JetStream preparado para ampliar la práctica. Las etapas siguientes documentan el clúster, la configuración del flujo y la mensajería; la prueba de caída y recuperación queda pendiente.

## Etapa 2: conexiones del clúster

Se utilizó [compose-cluster.yaml](compose-cluster.yaml) para configurar tres servidores con JetStream, nombres únicos, volúmenes separados y rutas entre los otros dos nodos. El nombre del proyecto y del clúster es `ta-ind-01-nixon`.

Los comandos siguientes se ejecutaron desde `nixon/experimento` en PowerShell:

```powershell
docker compose -f compose-cluster.yaml config --quiet
docker compose -f compose-cluster.yaml up -d
docker compose -f compose-cluster.yaml ps
```

El contenedor del primer nodo se adaptó a la configuración del clúster reutilizando su volumen. Los servicios nats2 y nats3 tienen sus propios volúmenes. Para esta etapa se utiliza explícitamente `-f compose-cluster.yaml`; el archivo compose.yaml conserva la configuración histórica de un único servidor.

### Comprobación de las conexiones

```powershell
(Invoke-RestMethod 'http://127.0.0.1:8222/routez').routes |
    Select-Object remote_name -Unique

(Invoke-RestMethod 'http://127.0.0.1:8223/routez').routes |
    Select-Object remote_name -Unique

(Invoke-RestMethod 'http://127.0.0.1:8224/routez').routes |
    Select-Object remote_name -Unique
```

Cada consulta mostró los nombres de los otros dos nodos. `Select-Object ... -Unique` evita repetir los nombres cuando existen varias conexiones de ruta entre los mismos servidores.

La [captura 02](../evidencias/ejecucion/02-conexiones-cluster-nats.png) conserva la comprobación en pantalla. Se guardó también una consulta posterior del estado y las conexiones en [resultado-cluster.txt](resultado-cluster.txt):

```powershell
docker compose -f compose-cluster.yaml ps --no-trunc |
    Out-File -FilePath .\resultado-cluster.txt -Encoding utf8

foreach ($puerto in 8222, 8223, 8224) {
    "Consulta de conexiones: puerto $puerto" |
        Out-File -FilePath .\resultado-cluster.txt -Encoding utf8 -Append

    (Invoke-RestMethod "http://127.0.0.1:$puerto/routez").routes |
        Select-Object remote_name -Unique |
        Format-Table -AutoSize |
        Out-File -FilePath .\resultado-cluster.txt -Encoding utf8 -Append
}
```

Estas consultas respaldan que los tres procesos estaban activos y conectados entre sí en el momento de la comprobación. Los tiempos de actividad del archivo corresponden a una consulta posterior a la captura.

## Etapa 3: flujo con tres réplicas

Se utilizó NATS Box como cliente temporal dentro de la red Docker del proyecto. No forma parte de los tres servidores que almacenan el flujo. Se empleó la imagen `natsio/nats-box:0.19.7`.

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --version
```

Se creó un flujo llamado MENSAJES_NIXON, asociado al asunto nixon.mensajes, con almacenamiento en disco y tres copias totales:

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats1:4222 stream add MENSAJES_NIXON --subjects "nixon.mensajes" --storage file --replicas 3 --defaults
```

La creación se ejecuta una vez. Para consultar el flujo existente se utilizó:

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats1:4222 stream info MENSAJES_NIXON
```

La información mostró `Replicas: 3`, almacenamiento `File`, al nodo nats-nixon-1 como líder y a nats-nixon-2 y nats-nixon-3 como seguidores en estado `current`. El líder es un resultado observado en esta consulta, no una asignación fija de la configuración.

La [captura 03](../evidencias/ejecucion/03-flujo-tres-replicas.png) documenta la configuración. Se conservó una consulta posterior completa en [resultado-flujo.txt](resultado-flujo.txt):

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats1:4222 stream info MENSAJES_NIXON |
    Out-File -FilePath .\resultado-flujo.txt -Encoding utf8
```

En ese archivo todavía se observan cero mensajes y cero consumidores: se guardó antes de la publicación que se describe a continuación. La existencia de tres réplicas configuradas se distingue de la prueba de almacenamiento de un mensaje concreto.

## Etapa 4: publicación y recuperación de un mensaje

### Identificación y zonas horarias

Se registraron los datos del equipo y se comparó la fecha local con la del contenedor:

```powershell
Write-Output "Usuario: $env:USERNAME | Equipo: $env:COMPUTERNAME" |
    Tee-Object -FilePath .\resultado-mensajeria.txt -Append

Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz" |
    Tee-Object -FilePath .\resultado-mensajeria.txt -Append

docker exec nats-nixon-1 date -u "+%Y-%m-%d %H:%M:%S UTC" |
    Tee-Object -FilePath .\resultado-mensajeria.txt -Append
```

El equipo mostró el 13 de noviembre de 2026 a las 19:59:31, con zona -05:00. El contenedor mostró el 14 de noviembre a las 00:59:32 UTC. La diferencia de cinco horas explica el cambio de fecha observado en las salidas de NATS. Se conservaron las marcas de tiempo originales.

### Publicación realizada

Se envió un mensaje identificado por el estudiante a través del nodo nats1:

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats1:4222 pub --jetstream nixon.mensajes "Mensaje de prueba de Nixon Piguave - TA-IND-01" 2>&1 | Tee-Object -FilePath .\resultado-mensajeria.txt -Append
```

La herramienta devolvió `Stored in Stream: MENSAJES_NIXON Sequence: 1`, que confirma la aceptación del mensaje por JetStream. La redirección en PowerShell produjo también un diagnóstico `NativeCommandError` al procesar la salida informativa de la herramienta. Este diagnóstico se conserva en el archivo original; no se volvió a publicar el mensaje para corregirlo.

### Recuperación realizada

Para recuperar el mensaje de secuencia 1 se conectó el cliente a nats3. Se combinaron las salidas dentro del contenedor mediante `sh -c`, antes de enviarlas al registro de PowerShell:

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 sh -c 'nats --server nats://nats3:4222 stream get MENSAJES_NIXON 1 2>&1' | Tee-Object -FilePath .\resultado-mensajeria.txt -Append

Write-Output "Código de salida: $LASTEXITCODE" |
    Tee-Object -FilePath .\resultado-mensajeria.txt -Append
```

La consulta devolvió `MENSAJES_NIXON#1`, el asunto nixon.mensajes y el contenido `Mensaje de prueba de Nixon Piguave - TA-IND-01`. El código de salida de esta recuperación fue 0.

La [captura 04](../evidencias/ejecucion/04-recuperacion-mensaje.png) muestra la recuperación y el código de salida. El registro [resultado-mensajeria.txt](resultado-mensajeria.txt) contiene la identificación, las horas local/UTC, la confirmación de publicación, el diagnóstico de PowerShell y la recuperación posterior.

### Interpretación y límites

La prueba muestra que JetStream confirmó el almacenamiento del mensaje y que este pudo recuperarse utilizando otro nodo como punto de conexión. La consulta utilizada recupera un mensaje por su secuencia; no crea un consumidor persistente ni comprueba un ciclo de confirmación de consumo.

Conectarse a nats3 no demuestra por sí solo qué réplica atendió internamente la solicitud. Tampoco demuestra aún el comportamiento ante una caída o partición de red. La prueba de caída y recuperación de un nodo corresponde al siguiente avance.

## Bosquejo inicial de arquitectura

La fotografía del [bosquejo a mano](../evidencias/anexo-a/bosquejo-inicial-nats.png), con nombre y fecha visibles, se conserva para el Anexo A. Representa un cliente, tres nodos con copias de un mismo flujo y conexiones entre los nodos. El nodo 1 se dibujó como líder ilustrativo; su papel real se contrastó posteriormente con la consulta del flujo. Los tres contenedores comparten el fallo de la computadora donde se ejecutan.

El diagrama final se elaborará al desarrollar la sección de arquitectura del informe, mostrando su evolución respecto a este bosquejo.

