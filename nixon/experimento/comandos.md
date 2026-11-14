# Comandos del experimento NATS con JetStream

## Entorno y uso del procedimiento

Se utilizó Windows con PowerShell en la terminal de VS Code, Docker Desktop, Docker Engine 29.9.3, Docker Compose 5.7.0, la imagen nats:2.15.3-alpine y la imagen cliente natsio/nats-box:0.19.7.

Los bloques conservan los comandos de la ejecución realizada, agrupados por etapas. Se ejecutan desde nixon/experimento, salvo la ubicación inicial indicada en la etapa 1. Las observaciones, capturas, incidencias e interpretación están en [resultados.md](resultados.md).

Este es un procedimiento secuencial: las etapas posteriores utilizan el flujo y los mensajes creados antes. Repetir una publicación genera otra secuencia; al repetir la prueba deben ajustarse las consultas a las secuencias realmente obtenidas. Los archivos compose.yaml y compose-cluster.yaml representan etapas distintas del mismo proyecto.

## Etapa 1: primera ejecución local

Usar [compose.yaml](compose.yaml), que conserva la primera configuración de un único servidor. La primera ejecución se realizó desde trabajo/experimento-nats; luego se continuó desde la carpeta de entrega con el mismo archivo y nombre de proyecto. Los argumentos -js, -sd, -m y -n habilitan JetStream, indican el directorio de datos, el puerto de monitoreo y el nombre del servidor. Salida: [resultado-inicio.txt](resultado-inicio.txt).

### Argumentos del servidor definidos en compose.yaml

```text
-js -sd /data -m 8222 -n nats-nixon-1
```

### Validar e iniciar el primer servidor

```powershell
docker compose config --quiet
docker compose up -d
```

### Consultar el contenedor y sus registros

```powershell
docker compose ps
docker compose logs --tail 35 nats1
```

### Guardar el estado y los registros iniciales

```powershell
docker compose ps --no-trunc | Out-File -FilePath .\resultado-inicio.txt -Encoding utf8
docker compose logs --no-color nats1 | Out-File -FilePath .\resultado-inicio.txt -Encoding utf8 -Append
```

## Etapa 2: conexiones del clúster

Seleccionar [compose-cluster.yaml](compose-cluster.yaml) con -f. Esta configuración conserva el proyecto ta-ind-01-nixon y define tres servicios con volúmenes separados. Los puertos 8222, 8223 y 8224 permiten consultar el monitoreo de cada nodo. Salida: [resultado-cluster.txt](resultado-cluster.txt).

### Validar e iniciar los tres nodos

```powershell
docker compose -f compose-cluster.yaml config --quiet
docker compose -f compose-cluster.yaml up -d
docker compose -f compose-cluster.yaml ps
```

### Consultar los vecinos de cada nodo

```powershell
(Invoke-RestMethod 'http://127.0.0.1:8222/routez').routes |
    Select-Object remote_name -Unique

(Invoke-RestMethod 'http://127.0.0.1:8223/routez').routes |
    Select-Object remote_name -Unique

(Invoke-RestMethod 'http://127.0.0.1:8224/routez').routes |
    Select-Object remote_name -Unique
```

### Guardar el estado y las conexiones

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

## Etapa 3: flujo con tres réplicas

NATS Box se utiliza como cliente temporal en la red del proyecto. Crear el flujo una vez y utilizar stream info para consultas posteriores. --replicas 3 configura tres copias totales; --storage file selecciona disco. Salida: [resultado-flujo.txt](resultado-flujo.txt).

### Consultar la versión de la herramienta cliente

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --version
```

### Crear el flujo con tres réplicas

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats1:4222 stream add MENSAJES_NIXON --subjects "nixon.mensajes" --storage file --replicas 3 --defaults
```

### Consultar el flujo existente

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats1:4222 stream info MENSAJES_NIXON
```

### Guardar la información del flujo

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats1:4222 stream info MENSAJES_NIXON |
    Out-File -FilePath .\resultado-flujo.txt -Encoding utf8
```

## Etapa 4: publicación y recuperación de un mensaje

El bloque de publicación se conserva como se ejecutó. La redirección en PowerShell produjo un aviso que se explica en [resultados.md](resultados.md); la recuperación usa sh -c para combinar las salidas dentro del contenedor. No se repitió el envío para corregir ese aviso. Salida: [resultado-mensajeria.txt](resultado-mensajeria.txt).

### Registrar identificación y comparar las horas

```powershell
Write-Output "Usuario: $env:USERNAME | Equipo: $env:COMPUTERNAME" |
    Tee-Object -FilePath .\resultado-mensajeria.txt -Append

Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz" |
    Tee-Object -FilePath .\resultado-mensajeria.txt -Append

docker exec nats-nixon-1 date -u "+%Y-%m-%d %H:%M:%S UTC" |
    Tee-Object -FilePath .\resultado-mensajeria.txt -Append
```

### Publicación ejecutada en la sesión

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats1:4222 pub --jetstream nixon.mensajes "Mensaje de prueba de Nixon Piguave - TA-IND-01" 2>&1 | Tee-Object -FilePath .\resultado-mensajeria.txt -Append
```

### Recuperar el mensaje 1 y registrar el código de salida

```powershell
docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 sh -c 'nats --server nats://nats3:4222 stream get MENSAJES_NIXON 1 2>&1' | Tee-Object -FilePath .\resultado-mensajeria.txt -Append

Write-Output "Código de salida: $LASTEXITCODE" |
    Tee-Object -FilePath .\resultado-mensajeria.txt -Append
```

## Etapa 5: caída y recuperación del líder

La prueba realizada detuvo nats1 porque era el líder en la consulta previa. Antes de repetirla, comprobar el líder y ajustar el servicio afectado y el punto de conexión superviviente. Los comandos de consulta y publicación durante el fallo se ejecutaron antes de reiniciar el nodo. Salidas: [antes del fallo](resultado-antes-fallo.txt), [caída](resultado-caida.txt), [operaciones durante la caída](resultado-durante-caida.txt) y [recuperación](resultado-recuperacion.txt).

### Guardar el estado anterior al fallo

```powershell
Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz" |
    Out-File -FilePath .\resultado-antes-fallo.txt -Encoding utf8

docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 nats --server nats://nats2:4222 stream info MENSAJES_NIXON |
    Out-File -FilePath .\resultado-antes-fallo.txt -Encoding utf8 -Append
```

### Terminar abruptamente el líder observado

```powershell
docker compose -f compose-cluster.yaml kill -s SIGKILL nats1
```

### Guardar y mostrar el estado posterior a la caída

```powershell
Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz" |
    Out-File -FilePath .\resultado-caida.txt -Encoding utf8

docker compose -f compose-cluster.yaml ps -a --no-trunc |
    Out-File -FilePath .\resultado-caida.txt -Encoding utf8 -Append

docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 sh -c 'nats --server nats://nats2:4222 stream info MENSAJES_NIXON 2>&1' |
    Out-File -FilePath .\resultado-caida.txt -Encoding utf8 -Append

Get-Content .\resultado-caida.txt
```

### Recuperar el mensaje anterior y publicar y recuperar uno nuevo

```powershell
Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz" |
    Out-File -FilePath .\resultado-durante-caida.txt -Encoding utf8

docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 sh -c 'nats --server nats://nats2:4222 stream get MENSAJES_NIXON 1 2>&1' |
    Out-File -FilePath .\resultado-durante-caida.txt -Encoding utf8 -Append

docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 sh -c 'nats --server nats://nats2:4222 pub --jetstream nixon.mensajes Mensaje_de_Nixon_con_nats1_detenido 2>&1' |
    Out-File -FilePath .\resultado-durante-caida.txt -Encoding utf8 -Append

docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 sh -c 'nats --server nats://nats2:4222 stream get MENSAJES_NIXON --last-for nixon.mensajes 2>&1' |
    Out-File -FilePath .\resultado-durante-caida.txt -Encoding utf8 -Append

Get-Content .\resultado-durante-caida.txt
```

### Iniciar de nuevo el nodo detenido

```powershell
docker compose -f compose-cluster.yaml start nats1
```

### Guardar el estado recuperado y recuperar el mensaje 2

```powershell
Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz" |
    Out-File -FilePath .\resultado-recuperacion.txt -Encoding utf8

docker compose -f compose-cluster.yaml ps -a --no-trunc |
    Out-File -FilePath .\resultado-recuperacion.txt -Encoding utf8 -Append

docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 sh -c 'nats --server nats://nats3:4222 stream info MENSAJES_NIXON 2>&1' |
    Out-File -FilePath .\resultado-recuperacion.txt -Encoding utf8 -Append

docker run --rm --network ta-ind-01-nixon_default natsio/nats-box:0.19.7 sh -c 'nats --server nats://nats1:4222 stream get MENSAJES_NIXON 2 2>&1' |
    Out-File -FilePath .\resultado-recuperacion.txt -Encoding utf8 -Append

Get-Content .\resultado-recuperacion.txt
```

## Consulta de resultados

La explicación de lo observado por etapa y los enlaces a las capturas están en [resultados.md](resultados.md). Los archivos .txt conservan las salidas originales; no se sustituyen por esta explicación.
