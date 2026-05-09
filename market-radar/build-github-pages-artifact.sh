#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OUTPUT_DIR="${1:-"$SCRIPT_DIR/../market-radar-pages-site"}"

case "$OUTPUT_DIR" in
  ""|"/"|"$SCRIPT_DIR"|"$SCRIPT_DIR/"|"."|"..")
    printf 'FAIL refusing unsafe GitHub Pages artifact target: %s\n' "$OUTPUT_DIR"
    exit 1
    ;;
esac

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/src"

cp "$SCRIPT_DIR/index.html" "$SCRIPT_DIR/health.html" "$SCRIPT_DIR/.nojekyll" "$OUTPUT_DIR/"
cp "$SCRIPT_DIR/src/app.mjs" "$SCRIPT_DIR/src/data.mjs" "$SCRIPT_DIR/src/styles.css" "$OUTPUT_DIR/src/"

printf 'GITHUB_PAGES_ARTIFACT_READY\n'
printf 'Output: %s\n' "$OUTPUT_DIR"
