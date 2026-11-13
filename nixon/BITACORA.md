# Bitácora de trabajo

**Estudiante:** Nixon Antonio Piguave Montaño  
**Sistema principal:** NATS con JetStream  
**Sistema de comparación:** Apache Pulsar

## 2026-11-13 — Sesión 1: organización inicial

### Qué hice

- Busqué un sistema para analizar en la actividad.
- Creé el repositorio y agregué a mis compañeros como colaboradores.
- Planifiqué las actividades correspondientes a la tarea.
- Creé mi carpeta con los archivos BITACORA.md y README.md.
- Redacté la primera entrada de la bitácora y parte del README.

### Problema encontrado

Vi tarde el mensaje sobre la actividad y tuve que buscar (usando Codex) un sistema que no hubieran elegido mis compañeros de curso.

### Cómo lo resolví

Elegí NATS con JetStream como sistema principal y Apache Pulsar como sistema de comparación. Anuncié mi elección en el chat a las 19:49 del día anterior.

### Tiempo dedicado

30 minutos.

### Uso de IA

Usé Codex para planificar las actividades de la tarea y buscar el sistema que analizaría.

## 2026-11-13 — Sesión 2: primera ejecución de NATS con JetStream

### Qué hice

- Comprobé que Docker y Docker Compose funcionaban y que el motor utilizaba contenedores Linux.
- Creé el archivo compose.yaml para iniciar un servidor NATS con JetStream y almacenamiento en un volumen.
- Validé la configuración e inicié el contenedor nats-nixon-1 con la imagen nats:2.15.3-alpine.
- Consulté el estado del contenedor y sus registros. Comprobé que JetStream había iniciado y que aparecía el mensaje Server is ready.
- Guardé una captura original del inicio del servidor en evidencias/ejecucion/.
- Continué trabajando desde Github/nixon/experimento y comprobé que el mismo contenedor seguía funcionando.
- Guardé el estado y los registros en resultado-inicio.txt.
- Actualicé el README con el avance, los comandos y los archivos de esta primera ejecución.

### Problema encontrado

Los registros de inicio quedaron duplicados en resultado-inicio.txt al añadir la misma salida más de una vez. Además, la columna del comando aparecía recortada y con un carácter mal representado.

### Cómo lo resolví

Regeneré el archivo: primero guardé el estado con docker compose ps --no-trunc y después añadí los registros una sola vez. Utilicé Out-File con codificación UTF-8 para guardar ambas salidas. Comprobé que el archivo contenía una tabla del contenedor y un solo bloque de registros de inicio.

### Tiempo dedicado

1 hora

### Uso de IA

- Usé Codex como apoyo para preparar la configuración de Docker Compose, redactar y revisar la documentación del experimento (comandos.md, README ) y resolver la duplicación de los registros. Ejecuté personalmente los comandos y conservé sus salidas y capturas originales. La explicación del procedimiento se contrastó con esos registros.

