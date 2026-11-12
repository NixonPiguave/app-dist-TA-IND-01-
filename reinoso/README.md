# TA-IND-01 — Informe académico individual: análisis crítico de Apache Cassandra

| Campo | Dato |
|---|---|
| Universidad | Universidad Técnica Estatal de Quevedo (UTEQ) |
| Facultad | Ciencias de la Computación |
| Carrera | Ingeniería de Software |
| Asignatura | Aplicaciones Distribuidas (ISR-701) |
| Actividad | TA-IND-01 — Informe académico individual: análisis crítico de un sistema distribuido real |
| Estudiante | Eduardo David Reinoso Vélez |
| Paralelo | A (7mo nivel) |
| Sistema analizado | Apache Cassandra |
| Sistema comparado | Amazon DynamoDB |
| Repositorio | https://github.com/NixonPiguave/app-dist-TA-IND-01- (carpeta `reinoso/`) |

## Video de sustentación

[PENDIENTE]

## Contenido de esta carpeta

```
reinoso/
├── README.md              este archivo
├── BITACORA.md            registro fechado de cada sesión de trabajo
├── informe.tex            archivo principal del informe
├── referencias.bib        referencias (IEEE, biblatex)
├── informe.pdf            PDF compilado
├── figuras/               diagrama de arquitectura y boceto a mano (Anexo A)
├── capturas/              capturas de ejecución; capturas/lectura/ = Anexo B
└── experimento/           docker-compose.yml, comandos.md y resultados.md
```

## Compilación del informe

- **Compilador:** pdflatex (MiKTeX 25.12 en Windows, desde TeXstudio; también válido TeX Live)
- **Bibliografía:** biber (backend de biblatex)
- **Archivo principal:** `informe.tex`
- **Dependencias:** [PENDIENTE]

Ejecutar desde la carpeta `reinoso/`, en este orden:

```bash
pdflatex informe.tex
biber informe
pdflatex informe.tex
pdflatex informe.tex
```

El primer `pdflatex` genera los archivos auxiliares, `biber` procesa `referencias.bib`, y los dos `pdflatex` finales resuelven citas y referencias cruzadas.

## Reproducción del experimento

Requisitos: Docker Desktop con Docker Compose y unos 4 GB de RAM libres.

```bash
cd experimento
docker compose up -d
docker exec cass1 nodetool status
```

Los comandos completos que usé y las salidas obtenidas están en `experimento/comandos.md` y `experimento/resultados.md`.

## Declaración de uso de inteligencia artificial

La declaración (herramienta, versión, para qué se usó y cómo se verificó) está en la sección correspondiente de `informe.tex`.