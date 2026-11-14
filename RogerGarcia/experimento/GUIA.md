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

Las siguientes fases serán insertar datos propios, apagar el primario, comprobar las operaciones con dos nodos vivos y reincorporarlo. Se completarán después de verificar este estado inicial.
