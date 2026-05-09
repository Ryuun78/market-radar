#!/bin/sh
set -eu

fail() {
  printf 'FAIL %s\n' "$1"
  exit 1
}

URL="${1:-${GITHUB_FALLBACK_URL:-https://raw.githack.com/Ryuun78/market-radar/gh-pages/index.html}}"

fetch() {
  attempt=1
  max_attempts=3

  if command -v curl >/dev/null 2>&1; then
    while [ "$attempt" -le "$max_attempts" ]; do
      if curl -fsSL "$1"; then
        return
      fi
      attempt=$((attempt + 1))
      sleep 2
    done
    return 1
  fi

  if command -v wget >/dev/null 2>&1; then
    while [ "$attempt" -le "$max_attempts" ]; do
      if wget -qO- "$1"; then
        return
      fi
      attempt=$((attempt + 1))
      sleep 2
    done
    return 1
  fi

  fail "curl or wget is required"
}

case "$URL" in
  */index.html)
    BASE_URL="${URL%/index.html}"
    INDEX_URL="$URL"
    ;;
  */)
    BASE_URL="${URL%/}"
    INDEX_URL="$BASE_URL/index.html"
    ;;
  *)
    BASE_URL="$URL"
    INDEX_URL="$BASE_URL/index.html"
    ;;
esac

HEALTH="$(fetch "$BASE_URL/health.html")" || fail "health check failed: $BASE_URL/health.html"
printf '%s' "$HEALTH" | grep -q 'Market Radar OK' || fail "health page did not return Market Radar OK"

INDEX="$(fetch "$INDEX_URL")" || fail "index page failed: $INDEX_URL"
printf '%s' "$INDEX" | grep -q 'Market Radar' || fail "index page did not contain Market Radar"
printf '%s' "$INDEX" | grep -q './src/app.mjs' || fail "index page does not load the GitHub app bundle"

APP_BUNDLE="$(fetch "$BASE_URL/src/app.mjs")" || fail "GitHub app bundle failed: $BASE_URL/src/app.mjs"
printf '%s' "$APP_BUNDLE" | grep -q 'AI 후보군' || fail "GitHub app bundle is missing AI candidate copy"
printf '%s' "$APP_BUNDLE" | grep -q '이포 차트 확인' || fail "GitHub app bundle is missing Ipo chart-check copy"
printf '%s' "$APP_BUNDLE" | grep -q '변동성' || fail "GitHub app bundle is missing volatility copy"
printf '%s' "$APP_BUNDLE" | grep -q '상대 비교' || fail "GitHub app bundle is missing relative comparison copy"

DATA_BUNDLE="$(fetch "$BASE_URL/src/data.mjs")" || fail "GitHub data bundle failed: $BASE_URL/src/data.mjs"
printf '%s' "$DATA_BUNDLE" | grep -q 'getAiCandidateQueue' || fail "GitHub data bundle is missing AI candidate queue"
printf '%s' "$DATA_BUNDLE" | grep -q 'relativeLabelFor' || fail "GitHub data bundle is missing relative comparison labels"

printf 'GITHUB_FALLBACK_URL_OK\n'
printf 'URL: %s\n' "$INDEX_URL"
