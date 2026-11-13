#!/usr/bin/env bash
set -euo pipefail
BASE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
for herramienta in pdflatex biber; do
  command -v "$herramienta" >/dev/null || { echo "Falta $herramienta" >&2; exit 1; }
done
cd "$BASE/informe"
pdflatex -interaction=nonstopmode -halt-on-error main.tex
biber main
pdflatex -interaction=nonstopmode -halt-on-error main.tex
pdflatex -interaction=nonstopmode -halt-on-error main.tex
echo "PDF: $BASE/informe/main.pdf"
