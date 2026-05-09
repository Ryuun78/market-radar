#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROOF_FILE="${GITHUB_FALLBACK_PROOF:-$SCRIPT_DIR/../GITHUB_FALLBACK_VERIFIED.txt}"
URL="${1:-${GITHUB_FALLBACK_URL:-https://raw.githack.com/Ryuun78/market-radar/gh-pages/index.html}}"

TMP_LOG=$(mktemp)
cleanup() {
  rm -f "$TMP_LOG"
}
trap cleanup EXIT

"$SCRIPT_DIR/verify-github-fallback-url.sh" "$URL" >"$TMP_LOG"
cat "$TMP_LOG"

VERIFIED_AT=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
{
  printf 'github_fallback_url=%s\n' "$URL"
  printf 'verified_at=%s\n' "$VERIFIED_AT"
  printf 'github_fallback_url_ok=yes\n'
  printf 'health_ok=yes\n'
  printf 'app_copy_ok=yes\n'
  printf 'ai_candidate_copy_ok=yes\n'
  printf 'relative_comparison_copy_ok=yes\n'
} >"$PROOF_FILE"

printf 'GITHUB_FALLBACK_VERIFIED\n'
printf 'Proof: %s\n' "$PROOF_FILE"
