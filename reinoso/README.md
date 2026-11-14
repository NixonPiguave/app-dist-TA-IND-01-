# TA-IND-01 — Informe académico individual: análisis crítico de Redis

| Campo | Dato |
|---|---|
| Universidad | Universidad Técnica Estatal de Quevedo (UTEQ) |
| Facultad | Ciencias de la Computación |
| Carrera | Ingeniería de Software |
| Asignatura | Aplicaciones Distribuidas (ISR-701) |
| Actividad | TA-IND-01 — Informe académico individual: análisis crítico de un sistema distribuido real |
| Estudiante | Eduardo David Reinoso Vélez |
| Paralelo | A (7mo nivel) |
| Sistema analizado | Redis (modo Redis Cluster) |
| Sistema comparado | Memcached |
| Repositorio | https://github.com/NixonPiguave/app-dist-TA-IND-01- (carpeta `reinoso/`) |

## Video de sustentación

**Pendiente.** Todavía no está grabado porque no tengo electricidad en estas horas de la noche (13 de noviembre de 2026). El enlace se agrega en esta sección cuando esté subido.

Enlace: [PENDIENTE]

## Contenido de esta carpeta

```
reinoso/
├── README.md              este archivo
├── BITACORA.md            registro fechado de cada sesión de trabajo
├── informe.tex            archivo principal del informe
├── referencias.bib        referencias (IEEE, biblatex)
├── informe.pdf            PDF compilado
├── figuras/               arquitectura.drawio (fuente), arquitectura.pdf/.png y boceto-a-mano.jpeg (Anexo A)
├── capturas/              capturas de ejecución; capturas/lectura/ = Anexo B
└── experimento/           docker-compose.yml, comandos.md y resultados.md
```

## Compilación del informe

- **Compilador:** pdflatex (MiKTeX 25.12 en Windows, desde TeXstudio; también válido TeX Live)
- **Bibliografía:** biber (backend de biblatex)
- **Archivo principal:** `informe.tex`
- **Dependencias:** paquetes de LaTeX `babel` (español), `biblatex`, `csquotes`, `lmodern`, `geometry`, `graphicx`, `booktabs`, `array`, `tabularx`, `hyperref` y `caption`, y el programa `biber`. MiKTeX instala los que falten en la primera compilación.

Ejecutar desde la carpeta `reinoso/`, en este orden:

```bash
pdflatex informe.tex
biber informe
pdflatex informe.tex
pdflatex informe.tex
```

El primer `pdflatex` genera los archivos auxiliares, `biber` procesa `referencias.bib`, y los dos `pdflatex` finales resuelven citas y referencias cruzadas.

## Reproducción del experimento

Requisitos: Docker Desktop con Docker Compose.

Desde la carpeta `experimento/`:

```bash
docker compose up -d
docker exec redis1 redis-cli --cluster create 172.30.0.11:6379 172.30.0.12:6379 172.30.0.13:6379 172.30.0.14:6379 172.30.0.15:6379 172.30.0.16:6379 --cluster-replicas 1 --cluster-yes
docker exec redis1 redis-cli cluster nodes
```

El primer comando levanta 6 nodos Redis en modo cluster, el segundo los une en 3 maestros con una réplica cada uno y el tercero lista el estado del clúster. Los comandos completos que usé y las salidas obtenidas están en `experimento/comandos.md` y `experimento/resultados.md`.

## Declaración de uso de inteligencia artificial

La declaración (herramienta, versión, para qué se usó y cómo se verificó) está en la sección correspondiente de `informe.tex`.