#!/bin/sh
set -eu

ARTIFACT_DIR="${1:-../market-radar-pages-site}"

fail() {
  printf 'FAIL %s\n' "$1"
  exit 1
}

require_file() {
  [ -f "$ARTIFACT_DIR/$1" ] || fail "missing GitHub Pages artifact file: $1"
}

require_text() {
  file="$1"
  text="$2"
  grep -F "$text" "$ARTIFACT_DIR/$file" >/dev/null 2>&1 || fail "$file missing expected text: $text"
}

require_file "index.html"
require_file "health.html"
require_file ".nojekyll"
require_file "src/app.mjs"
require_file "src/data.mjs"
require_file "src/styles.css"

require_text "index.html" "Market Radar"
require_text "index.html" "./src/app.mjs"
require_text "health.html" "Market Radar OK"
require_text "src/app.mjs" "AI 후보군"
require_text "src/app.mjs" "변동성 / 상대 비교"
require_text "src/data.mjs" "relativeProfile"

find "$ARTIFACT_DIR" -type f | while IFS= read -r file; do
  relative=${file#"$ARTIFACT_DIR"/}
  case "$relative" in
    index.html|health.html|.nojekyll|src/app.mjs|src/data.mjs|src/styles.css)
      ;;
    *)
      fail "extra file in GitHub Pages artifact: $relative"
      ;;
  esac
done

printf 'GITHUB_PAGES_ARTIFACT_OK\n'
printf 'Artifact: %s\n' "$ARTIFACT_DIR"
