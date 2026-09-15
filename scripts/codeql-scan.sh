#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="$ROOT/codeql-db"
SARIF="$ROOT/codeql-results.sarif"
LANG="javascript-typescript"
SUITE="codeql-suites/javascript-security-extended.qls"
if ! command -v codeql >/dev/null 2>&1; then
  echo "[codeql-scan] CLI absent, installation..."
  if command -v gh >/dev/null 2>&1; then gh extension install github/gh-codeql --force || true; CODEQL="$(gh codeql --help >/dev/null 2>&1 && echo "gh codeql" || echo "")"; fi
  if ! command -v codeql >/dev/null 2>&1; then echo "Installe CodeQL: https://github.com/github/codeql-cli-binaries/releases"; exit 1; fi
fi
rm -rf "$DB" "$SARIF"
codeql database create "$DB" --language="$LANG" --source-root="$ROOT" --overwrite
codeql database analyze "$DB" --format=sarif-latest --output="$SARIF" "codeql/javascript-queries:$SUITE" || codeql database analyze "$DB" --format=sarif-latest --output="$SARIF" --queries security-extended
echo "[codeql-scan] SARIF: $SARIF"
