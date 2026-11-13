# Primera ejecución de NATS con JetStream

## Alcance de esta etapa

El 13 de noviembre de 2026 se inició un servidor NATS con JetStream mediante Docker Compose. El objetivo de esta etapa fue comprobar que la configuración permitía iniciar el servidor, habilitar JetStream y conservar una evidencia de su funcionamiento.

El entorno utilizado fue Windows con PowerShell, Docker Desktop, Docker Engine 29.9.3 y Docker Compose 5.7.0. La imagen del servidor fue `nats:2.15.3-alpine`.

## Configuración utilizada

El archivo [compose.yaml](compose.yaml) define el proyecto `ta-ind-01-nixon` y el servicio `nats1`, cuyo contenedor se llama `nats-nixon-1`. Los argumentos del servidor son:

```text
-js -sd /data -m 8222 -n nats-nixon-1
```

- `-js`: habilita JetStream.
- `-sd /data`: establece el directorio de almacenamiento.
- `-m 8222`: habilita el monitoreo HTTP en el puerto 8222.
- `-n nats-nixon-1`: asigna un nombre al servidor.

El volumen declarado como `nats1-data` se monta en `/data`. Compose lo administra dentro del proyecto `ta-ind-01-nixon`. Los puertos publicados son `127.0.0.1:4222` para clientes y `127.0.0.1:8222` para monitoreo.

## Secuencia de ejecución

Los siguientes comandos se ejecutan desde la carpeta `nixon/experimento`, en PowerShell. La primera puesta en marcha se realizó desde `trabajo/experimento-nats`; después se continuó desde la carpeta de entrega con el mismo archivo y nombre de proyecto. Al consultar el estado se comprobó que seguía funcionando el mismo contenedor.

### Validación e inicio

```powershell
docker compose config --quiet
docker compose up -d
```

El primer comando valida la configuración de Compose. En la ejecución realizada terminó sin mostrar errores. El segundo descargó la imagen y creó la red, el volumen y el contenedor necesarios para iniciar el servicio.

### Consulta del servidor

```powershell
docker compose ps
docker compose logs --tail 35 nats1
```

La consulta del estado mostró el contenedor `nats-nixon-1` con estado `Up`. En los registros aparecieron la versión 2.15.3, el inicio de JetStream, el directorio `/data/jetstream`, la escucha de clientes en el puerto 4222 y el mensaje `Server is ready`.

Estos pasos se documentan en la [captura 01: inicio de NATS con JetStream](../evidencias/ejecucion/01-inicio-nats-jetstream.png). La captura muestra los comandos, el contenedor activo y los registros del inicio; la ruta del terminal identifica la carpeta de trabajo del estudiante.

### Conservación de las salidas

```powershell
docker compose ps --no-trunc | Out-File -FilePath .\resultado-inicio.txt -Encoding utf8
docker compose logs --no-color nats1 | Out-File -FilePath .\resultado-inicio.txt -Encoding utf8 -Append
```

El primer comando guarda el estado y reemplaza el contenido anterior del archivo. La opción `--no-trunc` muestra completo el comando del contenedor. El segundo añade los registros al mismo archivo sin códigos de color. Ambos guardan texto con codificación UTF-8.

Durante la sesión se había añadido la misma salida de registros más de una vez. Se regeneró el archivo ejecutando estos dos comandos una sola vez y en este orden. El resultado final contiene una tabla de estado y un único bloque de inicio del servidor.

La salida conservada está en [resultado-inicio.txt](resultado-inicio.txt). Los tiempos de actividad que muestra corresponden al momento de esa consulta y cambiarán al repetirla.

## Interpretación de la evidencia

El estado `Up`, junto con los mensajes `Starting JetStream` y `Server is ready`, respalda que el proceso NATS y JetStream iniciaron correctamente. El registro también identifica la versión ejecutada y el directorio utilizado para el almacenamiento.

Esta etapa deja un servidor preparado para las pruebas posteriores. La replicación se estudiará al configurar tres nodos y un flujo con tres réplicas. La tolerancia a fallos se evaluará mediante la caída y recuperación de un nodo, conservando los comandos, las salidas y las capturas correspondientes.
