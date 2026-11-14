#!/usr/bin/env fish
# Apagado ordenado de un único nodo; ejecutar solo con datos de prueba.
cd (path dirname (status filename))
or exit 1

if test -f resultados/primario-apagado.txt
    echo "Ya se registró un apagado. No repetir: revisar el estado."
    exit 1
end

function dc
    sudo docker compose $argv
end

id -un
hostname
date --iso-8601=seconds
set -l URI 'mongodb://m1:27017,m2:27017,m3:27017/taind01?replicaSet=rs0&serverSelectionTimeoutMS=15000&retryWrites=false'
set -l PRIMARIO (dc exec -T m1 mongosh "$URI" --quiet --eval 'print(db.hello().primary.split(":")[0])')
if not contains -- "$PRIMARIO" m1 m2 m3
    echo "No se identificó un primario válido; no se apaga ningún nodo."
    exit 1
end

set -l CID (dc ps -q "$PRIMARIO")
if test (count $CID) -ne 1
    echo "No se encontró un único contenedor; no se continúa."
    exit 1
end

sudo docker stop --signal SIGTERM --timeout -1 "$CID"
or exit 1
printf '%s\n' "$PRIMARIO" > resultados/primario-apagado.txt
printf 'Primario apagado: %s\n' "$PRIMARIO"
sudo docker inspect --format 'Estado: {{.State.Status}}; salida: {{.State.ExitCode}}; OOM: {{.State.OOMKilled}}' "$CID"
or exit 1

set -l CLIENTE m1
if test "$PRIMARIO" = m1
    set CLIENTE m2
end
dc exec -T "$CLIENTE" mongosh "$URI" --quiet --eval (string collect < comprobar.js)
