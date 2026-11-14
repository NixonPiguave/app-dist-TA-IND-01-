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

- Guardé el estado del flujo antes del fallo y confirmé qué nodo era el líder.
- Terminé abruptamente el nodo líder y comprobé que nats3 asumía esa función mientras nats1 permanecía detenido.
- Recuperé el mensaje anterior y publiqué y recuperé uno nuevo con el nodo 1 detenido.
- Volví a iniciar nats1 y comprobé que se reincorporaba sincronizado, con los dos mensajes conservados.
- Guardé las salidas y las capturas de la caída y la recuperación, y actualicé la documentación del experimento.

- Seleccioné, con ayuda de Codex, tres artículos de revista en inglés: dos sobre aplicaciones de NATS JetStream y uno que evalúa Apache Pulsar.
- Revisé los fragmentos seleccionados y los subrayé para conservar cuatro capturas de lectura con la página visible.
- Preparé las referencias en mi proyecto LaTeX, exporté referencias.bib y lo incorporé a la carpeta informe/.

### Problema encontrado

- Vi tarde el mensaje sobre la actividad y tuve que buscar, con ayuda de Codex, un sistema que no hubieran elegido mis compañeros de curso.
- Los registros de inicio quedaron duplicados en resultado-inicio.txt al añadir la misma salida más de una vez. Además, la columna del comando aparecía recortada y con un carácter mal representado.

- PowerShell mostró NativeCommandError al redirigir un mensaje informativo de la herramienta NATS. La salida también confirmaba que el mensaje se había almacenado correctamente.

- Durante la prueba provocada, el nodo que dirigía el flujo dejó de estar disponible y su copia quedó desactualizada mientras los otros nodos seguían funcionando.

- El primer artículo propuesto era demasiado general para el análisis que quería realizar sobre NATS y Pulsar.

### Cómo lo resolví

- Elegí NATS con JetStream como sistema principal y Apache Pulsar como sistema de comparación. Anuncié mi elección en el chat a las 19:49 del día anterior.
- Volví a guardar el archivo de resultados y comprobé que mostrara los datos completos, sin repetir los registros.
- Conservé la salida de la publicación y no repetí el envío. Para recuperar el mensaje, combiné las salidas dentro del contenedor con sh -c antes de guardarlas en PowerShell. La recuperación devolvió el texto publicado y código de salida 0.

- Comprobé que otro nodo asumiera el liderazgo y que pudiera recuperar y enviar mensajes. Después volví a iniciar el nodo detenido y verifiqué que se sincronizara y que los mensajes siguieran disponibles.

- Cambié la selección por tres artículos en inglés relacionados directamente con los sistemas analizados.

### Tiempo dedicado

6 Horas:
-30 minutos de organización inicial  
-1 hora de configuración y primera ejecución.
-1 hora y 30 minutos de elaboración del bosquejo, configuración del clúster y prueba de mensajería.
-1 hora de prueba de caída del nodo líder, comprobación de los mensajes y recuperación del nodo.
-2 horas de búsqueda y selección de artículos, lectura de fragmentos, toma de capturas y preparación de referencias.

### Uso de IA

- Usé Codex para planificar las actividades, buscar el sistema que analizaría, preparar la configuración de Docker Compose, redactar y revisar la documentación (comandos.md y README) y resolver la duplicación de los registros. Para la busqueda de fuentes de informacion relacionadas a los sistemas usados y analizados. Ejecuté personalmente los comandos y conservé sus salidas y capturas originales. La explicación del procedimiento se contrastó con esos registros.

## 2026-11-14

### Qué hice

- Revisé los requisitos del informe y aporté dos experiencias personales: mensajes y stickers pendientes en WhatsApp y una entrega que no aparecía actualizada en el SGA.
- Preparé con apoyo de Codex el diagrama digital y el borrador completo del informe en LaTeX, relacionando las fuentes con las salidas del experimento.
- Amplié la bibliografía con fuentes técnicas sobre replicación, fallos y Apache Pulsar. Se contrastaron los tres DOI con sus artículos.
- Integré las capturas, el bosquejo y las referencias en el PDF; se comprobó la compilación y actualicé las instrucciones del README.
- Preparé por separado el PDF de una página con mis datos y la URL del repositorio para el SGA.

### Problema encontrado

- Necesitaba relacionar mis experiencias con los conceptos de la unidad sin afirmar causas técnicas que no podía comprobar.
- Faltaba integrar las evidencias y el análisis en un informe que pudiera compilarse con sus referencias y figuras.

### Cómo lo resolví

- Expliqué lo que observé como usuario y lo relacioné con los reintentos y la confirmación del estado de las operaciones, sin dar por comprobada la causa del problema.
- Organicé el informe con los archivos y las salidas existentes, se contrastaron las fuentes, se compiló el PDF y se revisaron sus figuras, tablas y citas.

### Tiempo dedicado

1 Hora y 30 minutos:
-1 Hora y 30 minutos de preparación del informe y sus archivos.

### Uso de IA
-La utilicé para la estructura del informe, generar el borrador del diagrama y revisar la redacción. Los DOI y los PDF los verifique personalmente