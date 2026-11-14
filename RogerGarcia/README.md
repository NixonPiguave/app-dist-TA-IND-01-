# TA-IND-01 — Roger García

## Datos

- **Estudiante:** Roger Steven García Sangoquiza.
- **Universidad:** Universidad Técnica Estatal de Quevedo.
- **Facultad:** Facultad de Ciencias de la Computación.
- **Carrera:** Software.
- **Curso y paralelo:** 7mo Soft, paralelo B.
- **Asignatura:** Sistemas Distribuidos.
- **Actividad:** TA-IND-01 — Informe académico individual.
- **Repositorio:** https://github.com/NixonPiguave/app-dist-TA-IND-01-
- **Carpeta de esta entrega:** [RogerGarcia](https://github.com/NixonPiguave/app-dist-TA-IND-01-/tree/main/RogerGarcia).

El repositorio es compartido, pero esta carpeta reúne únicamente mi entrega individual.

## Tema y estado

**Sistema principal:** MongoDB Community. **Comparador:** Apache CouchDB.

Se completó la prueba de apagado y reincorporación del primario. Se incluyen el informe compilado, cuatro capturas del sistema, registros, bosquejo y evidencias de lectura.

## Estructura

```text
RogerGarcia/
├── README.md
├── BITACORA.md
├── experimento/
│   ├── compose.yaml
│   ├── GUIA.md
│   ├── RESULTADOS.md
│   ├── resultados/
│   └── capturas/
├── informe/
│   ├── datos.tex
│   ├── main.tex
│   ├── main.pdf
│   ├── contenido.tex
│   ├── figuras/
│   └── referencias.bib
└── scripts/
    └── compilar.sh
```

## Experimento

La [guía del laboratorio](experimento/GUIA.md) contiene los comandos y los [resultados](experimento/RESULTADOS.md) describen lo observado y sus límites. Se necesita acceso a Docker; en este equipo se utiliza `sudo` para sus comandos. Las salidas y capturas están dentro de `experimento/`.

## Compilación del informe

Compilador: **pdfLaTeX**. Bibliografía: **Biber + biblatex, estilo IEEE**. Archivo principal: `informe/main.tex`.

Dependencias: TeX Live con `babel-spanish`, `geometry`, `graphicx`, `booktabs`, `tabularx`, `longtable`, `float`, `listings`, `tikz` (PGF), `pdflscape`, `csquotes`, `biblatex`, `biblatex-ieee`, `biber` y `hyperref`; Bash para el script.

Desde la raíz del repositorio:

```bash
bash RogerGarcia/scripts/compilar.sh
```

El script ejecuta dentro de `RogerGarcia/informe/`, en este orden:

```bash
pdflatex -interaction=nonstopmode -halt-on-error main.tex
biber main
pdflatex -interaction=nonstopmode -halt-on-error main.tex
pdflatex -interaction=nonstopmode -halt-on-error main.tex
```

Salida: `RogerGarcia/informe/main.pdf`, con análisis, resultados, bibliografía IEEE y anexos. Las figuras y capturas deben conservar sus nombres y rutas para poder regenerarlo.

## Organización de la entrega

El repositorio contendrá el informe y sus archivos reproducibles, incluido el **PDF final del informe**.

Las actualizaciones se subirán manualmente desde GitHub, conservando rutas y nombres. Antes de cada subida se revisarán los archivos para evitar incluir auxiliares de compilación o datos privados.

## Video de sustentación

https://www.youtube.com/watch?v=tJPhstlVXvU

Duración: 4 minutos y 26 segundos. Publicación no listada.

## Uso de inteligencia artificial

Se utilizó OpenCode con GPT-6.1 Sol (`openai/gpt-6.1-sol`) para planificación, cotejo inicial de fuentes, comandos, borrador de redacción, diagrama y compilación. La ejecución y las capturas se documentan con sus registros. La declaración completa está en el informe.
