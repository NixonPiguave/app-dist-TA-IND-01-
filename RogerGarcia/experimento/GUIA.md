# Prueba con tres réplicas de MongoDB

Objetivo: observar el cambio de primario al apagar un nodo y su posterior reincorporación. Tres contenedores en una sola computadora permiten probar fallos de proceso, no la pérdida del equipo completo ni una partición de red.

## 1. Preparación

Antes del diagrama digital, dibujar a mano un cliente, un primario y dos secundarios. Señalar las escrituras al primario, la replicación hacia los secundarios y los mensajes de control entre miembros. Incluir nombre y fecha reales; conservar una fotografía para el Anexo A.

Se usará MongoDB Community 8.0.16, con la imagen fijada por digest. Cada nodo tiene su volumen y un límite de 2 GiB de RAM. No se publican puertos y la red es interna. No hay autenticación: utilizar solo datos de prueba.

## 2. Iniciar los nodos

Comandos para Fish, desde la raíz de la carpeta de trabajo:

```fish
cd RogerGarcia/experimento
mkdir -p resultados
id -un | tee -a resultados/01-inicio.txt
hostname | tee -a resultados/01-inicio.txt
date --iso-8601=seconds | tee -a resultados/01-inicio.txt
sudo docker compose up -d --wait --wait-timeout 240 2>&1 | tee -a resultados/01-inicio.txt
```

La primera ejecución descarga la imagen. Esperar a que los tres nodos estén saludables; esto todavía no significa que exista un primario.

## 3. Configurar el conjunto de réplicas

Ejecutar **una sola vez**, después de iniciar los nodos:

```fish
sudo docker compose exec -T m1 mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"m1:27017"},{_id:1,host:"m2:27017"},{_id:2,host:"m3:27017"}]})' 2>&1 | tee -a resultados/02-replicas.txt
```

`rs.initiate()` configura tres miembros con datos y voto. Si informa que ya está inicializado, no forzar una reconfiguración: revisar el estado.

## 4. Consultar los roles y tomar la primera captura

```fish
id -un | tee -a resultados/02-replicas.txt
hostname | tee -a resultados/02-replicas.txt
date --iso-8601=seconds | tee -a resultados/02-replicas.txt
sudo docker compose exec -T m1 mongosh --quiet --eval 'print("MongoDB " + db.version()); rs.status().members.forEach(m => print(m.name + " | " + m.stateStr + " | salud=" + m.health))' 2>&1 | tee -a resultados/02-replicas.txt
```

Resultado esperado, aún no medido: un `PRIMARY`, dos `SECONDARY` y salud `1`. Si aparecen estados transitorios, esperar unos segundos y repetir esta consulta. No asumir que m1 siempre será el primario.

Tomar una captura original que muestre usuario, equipo, fecha, versión y los tres roles. Guardarla como `capturas/01-estado-inicial.png` dentro de esta carpeta, creando `capturas/` al guardar. `tee -a` conserva la salida de esta fase en `resultados/02-replicas.txt`; no escribir resultados manualmente.

## 5. Insertar datos propios y tomar la segunda captura

Desde `RogerGarcia/experimento/`, ejecutar una sola vez:

```fish
set URI 'mongodb://m1:27017,m2:27017,m3:27017/taind01?replicaSet=rs0&serverSelectionTimeoutMS=15000&retryWrites=false'
id -un | tee -a resultados/03-datos.txt
hostname | tee -a resultados/03-datos.txt
date --iso-8601=seconds | tee -a resultados/03-datos.txt
sudo docker compose exec -T m1 mongosh "$URI" --quiet --eval (string collect < insertar.js) 2>&1 | tee -a resultados/03-datos.txt
```

`insertar.js` solicita confirmación de los tres miembros y persistencia en journal (`w:3`, `j:true`). Verifica errores antes de imprimir el resumen y consulta el documento con `readConcern: "majority"`. Esto no equivale a demostrar linealizabilidad de cualquier lectura.

Tomar la captura `capturas/02-datos-propios.png`, con usuario, equipo, fecha, confirmación y documento legibles. Si aparece un error, conservarlo y revisarlo antes de continuar; no repetir la inserción ni borrar documentos para ocultarlo.

## 6. Apagar el primario y tomar la tercera captura

Desde esta misma carpeta, ejecutar una sola vez:

```fish
fish apagado.fish 2>&1 | tee -a resultados/04-apagado.txt
```

El script detecta el primario, envía `SIGTERM` y espera su cierre sin forzar `SIGKILL`. Conserva el nombre del nodo detenido y consulta desde un superviviente. `comprobar.js` muestra los roles, comprueba el documento inicial e inserta otro con confirmación por mayoría.

Resultado esperado: un nodo detenido, otro primario y escritura confirmada con los dos miembros disponibles. La salida exacta debe observarse; puede haber estados transitorios. Este es un apagado ordenado, no un crash ni una partición de red. No se mide el tiempo exacto de elección.

Guardar `capturas/03-apagado-primario.png`, incluyendo identidad, fecha, nodo detenido, nuevo primario y confirmación de escritura. Si aparece un error, no repetir el apagado: revisar primero el registro.

## 7. Reincorporar m1 y tomar la cuarta captura

En este ensayo el primario detenido fue m1, según `04-apagado.txt`. Iniciarlo sin borrar volúmenes:

```fish
sudo docker compose start m1 2>&1 | tee -a resultados/05-recuperacion.txt
```

Esperar unos segundos y consultar directamente m1:

```fish
set URI_LOCAL 'mongodb://127.0.0.1:27017/taind01?directConnection=true&readPreference=secondaryPreferred&serverSelectionTimeoutMS=15000'
id -un | tee -a resultados/05-recuperacion.txt
hostname | tee -a resultados/05-recuperacion.txt
date --iso-8601=seconds | tee -a resultados/05-recuperacion.txt
sudo docker compose exec -T m1 mongosh "$URI_LOCAL" --quiet --eval (string collect < recuperar.js) 2>&1 | tee -a resultados/05-recuperacion.txt
sudo docker compose logs --no-color --timestamps 2>&1 | gzip > resultados/06-servidores.txt.gz
```

`recuperar.js` no escribe datos. Comprueba tres miembros sanos y los documentos anterior y posterior al apagado mediante una conexión directa al nodo reincorporado. Puede repetirse si la recuperación todavía está en transición. No es necesario que m1 vuelva a ser primario.

Guardar `capturas/04-recuperacion.png`, con identidad, fecha, tres roles y ambos documentos visibles. No borrar volúmenes ni usar una reconfiguración forzada.

El registro completo de servidores se conserva comprimido, sin modificar su contenido. Para leerlo: `gzip -dc resultados/06-servidores.txt.gz`.
