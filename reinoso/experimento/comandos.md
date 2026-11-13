# Comandos del experimento: caída de un maestro en Redis Cluster

Entorno: Windows, PowerShell, Docker Desktop, imagen `redis:7.2`. Clúster de 6 nodos definido en `docker-compose.yml` (3 maestros y 3 réplicas, IP fijas 172.30.0.11 a 172.30.0.16). Todos los comandos se ejecutaron desde la carpeta `reinoso\experimento`.

Objetivo: observar la tolerancia a fallos de Redis Cluster (detección de la caída de un maestro, promoción de su réplica y reincorporación del nodo), medir cuánto tarda la promoción y comprobar si los datos escritos antes y durante el fallo siguen disponibles.

Los apartados 1 a 5 se ejecutaron seguidos sobre el mismo clúster, y los apartados 6 a 8 después. Por eso el estado de partida de cada prueba es el que dejó la anterior (los roles se indican al inicio de cada apartado).

## 0. Verificación de Docker

```powershell
docker --version
docker info
```

`docker info` debe mostrar la sección `Server`; si falla, Docker Desktop no está abierto.

## 1. Levantar el clúster y estado inicial (captura 1)

```powershell
docker compose up -d
docker compose ps
docker exec redis1 redis-cli --cluster create 172.30.0.11:6379 172.30.0.12:6379 172.30.0.13:6379 172.30.0.14:6379 172.30.0.15:6379 172.30.0.16:6379 --cluster-replicas 1 --cluster-yes
whoami
Get-Date
docker exec redis1 redis-cli cluster nodes
docker exec redis1 redis-cli cluster nodes > salida-01-cluster-nodes.txt
```

## 2. Escribir datos antes del fallo (captura 2)

```powershell
1..30 | ForEach-Object { docker exec redis1 redis-cli -c set "clave$_" "valor$_" }
whoami
Get-Date
docker exec redis1 redis-cli dbsize
docker exec redis2 redis-cli dbsize
docker exec redis3 redis-cli dbsize
docker exec redis5 redis-cli dbsize
```

`-c` activa el modo cluster del cliente, que sigue las redirecciones del clúster. `dbsize` cuenta las claves que guarda cada nodo; redis5 es la réplica de redis1.

## 3. Detener el maestro redis1 (captura 3)

```powershell
docker stop redis1
Start-Sleep -Seconds 3
whoami
Get-Date
docker compose ps
docker exec redis2 redis-cli cluster nodes
docker exec redis2 redis-cli cluster nodes > salida-03-redis1-detenido.txt
```

Se consulta desde redis2 porque redis1 ya no responde.

## 4. Promoción de la réplica y lectura de datos (captura 4)

```powershell
Start-Sleep -Seconds 15
whoami
Get-Date
docker exec redis2 redis-cli cluster nodes
docker exec redis2 redis-cli cluster info
1..30 | ForEach-Object { docker exec redis2 redis-cli -c get "clave$_" }
docker exec redis2 redis-cli cluster nodes > salida-04-promocion-de-replica.txt
```

## 5. Reincorporar el nodo caído (captura 5)

```powershell
docker start redis1
Start-Sleep -Seconds 15
whoami
Get-Date
docker exec redis2 redis-cli cluster nodes
docker exec redis2 redis-cli cluster nodes > salida-05-redis1-reincorporado.txt
```

## 6. Medir el tiempo de promoción (captura 6)

Estado de partida: redis5 es maestro de los slots 0–5460 y redis1 es su réplica (resultado del apartado 5). Se detiene redis5.

```powershell
whoami
$inicio = Get-Date
"Inicio del stop: $($inicio.ToString('HH:mm:ss.fff'))"
docker stop redis5
$t0 = Get-Date
"Stop terminó: $($t0.ToString('HH:mm:ss.fff'))"
while (-not (docker exec redis2 redis-cli cluster nodes | Select-String "172.30.0.11:6379@16379 master")) { Start-Sleep -Milliseconds 200 }
$t1 = Get-Date
"redis1 promovido a maestro: $($t1.ToString('HH:mm:ss.fff'))"
"Desde que terminó el stop: $([math]::Round(($t1 - $t0).TotalSeconds,2)) s"
docker exec redis2 redis-cli cluster nodes
```

El bucle consulta `cluster nodes` en redis2 cada 200 ms (más lo que tarda cada `docker exec`) hasta que redis1 aparece como `master`. Mide cuándo redis2 ve a redis1 como maestro, no el instante exacto de la elección.

Después se reincorporó redis5, sin guardar la salida en archivo (solo se vio en pantalla):

```powershell
docker start redis5
Start-Sleep -Seconds 15
docker exec redis2 redis-cli cluster nodes
```

## 7. Escrituras durante la caída (captura 7)

Estado de partida: redis1 es maestro de 0–5460 y redis5 es su réplica. Un solo script escribe durante 40 s en redis2, detiene redis1 a los 10 s y al final comprueba las escrituras confirmadas.

```powershell
whoami
$salida = "salida-07-escrituras-durante-caida.csv"
"hora,clave,resultado" | Out-File $salida -Encoding utf8
$ini = Get-Date
$fin = $ini.AddSeconds(40)
$parado = $false
$i = 0
while ((Get-Date) -lt $fin) {
  if (-not $parado -and (Get-Date) -ge $ini.AddSeconds(10)) {
    "Stop de redis1 emitido: $((Get-Date).ToString('HH:mm:ss.fff'))"
    docker stop redis1 | Out-Null
    "Stop terminó: $((Get-Date).ToString('HH:mm:ss.fff'))"
    $parado = $true
  }
  $i++
  $r = (docker exec redis2 redis-cli -c set "caida$i" "v$i" 2>&1) -join " "
  $r = $r -replace ",", " "
  "$(Get-Date -Format 'HH:mm:ss.fff'),caida$i,$r" | Out-File $salida -Append -Encoding utf8
  Start-Sleep -Milliseconds 100
}
"Terminó: $i intentos"
$todo = Import-Csv $salida
$ok = @($todo | Where-Object { $_.resultado -eq "OK" })
$errores = @($todo | Where-Object { $_.resultado -ne "OK" })
"Intentos: $($todo.Count)  Confirmadas OK: $($ok.Count)  Con error: $($errores.Count)"
if ($errores.Count) { "Primer error: $($errores[0].hora)  Último error: $($errores[-1].hora)"; $errores | Format-Table hora,clave,resultado -Wrap }
$ausentes = 0
foreach ($f in $ok) { $v = docker exec redis2 redis-cli -c get $f.clave; if (-not $v) { $ausentes++ } }
"Escrituras confirmadas que no se pueden leer: $ausentes"
Get-Date
docker exec redis2 redis-cli cluster nodes
```

Cada línea del CSV lleva la hora en que terminó el intento, no la hora en que empezó. Se escribe en redis2, que no se detiene, y `-c` hace que el cliente siga las redirecciones hacia el nodo dueño del slot de cada clave.

## 8. Reincorporar redis1

```powershell
docker start redis1
Start-Sleep -Seconds 15
docker exec redis2 redis-cli cluster nodes > salida-08-redis1-reincorporado.txt
```

## 9. Slot de cada clave del apartado 7

`cluster keyslot` devuelve el slot (CRC16 de la clave módulo 16384) de una clave, y con él se sabe qué maestro la guarda.

```powershell
1..39 | ForEach-Object { "caida$_ " + (docker exec redis2 redis-cli cluster keyslot "caida$_") } | Out-File salida-09-keyslots.txt -Encoding utf8
Get-Content salida-09-keyslots.txt
```
