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

MongoDB está iniciado con un primario y dos secundarios. Se conservan el registro de configuración y la primera captura. La prueba de cambio de primario y el desarrollo del informe siguen pendientes.

## Estructura inicial

```text
RogerGarcia/
├── README.md
├── BITACORA.md
├── experimento/
│   ├── compose.yaml
│   ├── GUIA.md
│   ├── resultados/
│   └── capturas/
├── informe/
│   ├── datos.tex
│   ├── main.tex
│   └── referencias.bib
└── scripts/
    └── compilar.sh
```

Las demás evidencias y el PDF final del informe se añadirán durante el desarrollo.

## Experimento

La [guía del laboratorio](experimento/GUIA.md) contiene los comandos para ejecutar tres réplicas de MongoDB con Docker Compose. Se necesita acceso a Docker; en este equipo se utiliza `sudo` para sus comandos. Las salidas y capturas se guardarán dentro de `experimento/`.

## Compilación del informe

Compilador: **pdfLaTeX**. Bibliografía: **Biber + biblatex, estilo IEEE**. Archivo principal: `informe/main.tex`.

Dependencias: TeX Live con `babel-spanish`, `geometry`, `graphicx`, `booktabs`, `tabularx`, `csquotes`, `biblatex`, `biblatex-ieee`, `biber` y `hyperref`; Bash para el script.

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

Salida: `RogerGarcia/informe/main.pdf`. Esta versión es una plantilla y aún no satisface las cinco páginas de contenido. La bibliografía está vacía a propósito: no se han incorporado las fuentes que se revisarán para la entrega.

## Organización de la entrega

El repositorio contendrá el informe y sus archivos reproducibles, incluido el **PDF final del informe**.

Las actualizaciones se subirán manualmente desde GitHub, conservando rutas y nombres. Antes de cada subida se revisarán los archivos para evitar incluir auxiliares de compilación o datos privados.

## Video de sustentación

**Pendiente de grabación.** Aquí se incorporará el enlace accesible al video de 3–5 minutos, con rostro y voz.

## Uso de inteligencia artificial

Se utilizó OpenCode con GPT-6.1 Sol (`openai/gpt-6.1-sol`) para selección de sistemas, planificación y preparación de plantillas, configuración y comandos. La declaración del informe se actualizará con los usos efectivos y las verificaciones realizadas. La ejecución y las capturas se documentan con sus registros correspondientes.
