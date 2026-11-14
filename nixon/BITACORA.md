# Bitácora de trabajo

**Estudiante:** Nixon Antonio Piguave Montaño  
**Sistema principal:** NATS con JetStream  
**Sistema de comparación:** Apache Pulsar

## 2026-11-13

### Qué hice

- Busqué un sistema para analizar en la actividad y elegí NATS con JetStream, comparado con Apache Pulsar.
- Creé el repositorio y agregué a mis compañeros como colaboradores.
- Planifiqué las actividades y creé mi carpeta con los archivos BITACORA.md y README.md.
- Redacté la entrada inicial de la bitácora y la presentación del trabajo.
- Comprobé que Docker y Docker Compose funcionaban y que el motor utilizaba contenedores Linux.
- Creé el archivo compose.yaml para iniciar un servidor NATS con JetStream y almacenamiento en un volumen.
- Validé la configuración e inicié el contenedor nats-nixon-1 con la imagen nats:2.15.3-alpine.
- Consulté el estado del contenedor y sus registros. Comprobé que JetStream había iniciado y que aparecía el mensaje Server is ready.
- Guardé una captura original del inicio del servidor en evidencias/ejecucion/.
- Continué trabajando desde Github/nixon/experimento y comprobé que el mismo contenedor seguía funcionando.
- Guardé el estado y los registros en resultado-inicio.txt y corregí la duplicación de la salida.
- Organicé el procedimiento y su explicación en comandos.md y actualicé los enlaces y el estado del trabajo en el README.

- Dibujé a mano el bosquejo inicial de la arquitectura, con nombre y fecha, y guardé su fotografía para el Anexo A.
- Preparé y ejecuté compose-cluster.yaml para iniciar tres nodos NATS con JetStream y almacenamiento separado.
- Consulté las rutas de cada nodo y comprobé que reconocía a los otros dos.
- Creé el flujo MENSAJES_NIXON con tres réplicas, asociado al asunto nixon.mensajes, e identifiqué su líder y sus seguidores.
- Guardé los resultados del clúster y del flujo, junto con las capturas correspondientes.
- Comparé la fecha local del equipo con la hora UTC del contenedor y comprobé la diferencia de cinco horas.
- Publiqué un mensaje propio y recibí la confirmación de almacenamiento con secuencia 1.
- Recuperé el mensaje de secuencia 1 conectando el cliente a nats3 y comprobé que el comando terminó con código 0.
- Guardé la salida de mensajería y su captura, y actualicé el procedimiento y el README con estas etapas.

### Problema encontrado

- Vi tarde el mensaje sobre la actividad y tuve que buscar, con ayuda de Codex, un sistema que no hubieran elegido mis compañeros de curso.
- Los registros de inicio quedaron duplicados en resultado-inicio.txt al añadir la misma salida más de una vez. Además, la columna del comando aparecía recortada y con un carácter mal representado.

- PowerShell mostró NativeCommandError al redirigir un mensaje informativo de la herramienta NATS. La salida también confirmaba que el mensaje se había almacenado correctamente.

### Cómo lo resolví

- Elegí NATS con JetStream como sistema principal y Apache Pulsar como sistema de comparación. Anuncié mi elección en el chat a las 19:49 del día anterior.
- Volví a guardar el archivo de resultados y comprobé que mostrara los datos completos, sin repetir los registros.
- Conservé la salida de la publicación y no repetí el envío. Para recuperar el mensaje, combiné las salidas dentro del contenedor con sh -c antes de guardarlas en PowerShell. La recuperación devolvió el texto publicado y código de salida 0.

### Tiempo dedicado

3 horas:
-30 minutos de organización inicial  
-1 hora de configuración y primera ejecución.
-1 hora y 30 minutos de elaboración del bosquejo, configuración del clúster y prueba de mensajería.

### Uso de IA

- Usé Codex para planificar las actividades, buscar el sistema que analizaría, preparar la configuración de Docker Compose, redactar y revisar la documentación (comando.md y README) y resolver la duplicación de los registros. Ejecuté personalmente los comandos y conservé sus salidas y capturas originales. La explicación del procedimiento se contrastó con esos registros.
