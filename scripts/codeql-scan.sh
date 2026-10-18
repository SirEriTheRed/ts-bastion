#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2026 ts-bastion contributors
# SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>
#
# SPDX-License-Identifier: MIT

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="$ROOT/codeql-db"
SARIF="$ROOT/codeql-results.sarif"
LANG="javascript-typescript"
SUITE="codeql/javascript-queries:codeql-suites/javascript-security-extended.qls"
if ! command -v codeql >/dev/null 2>&1; then
  echo "[codeql-scan] codeql CLI not found; install it: https://github.com/github/codeql-cli-binaries/releases"
  exit 1
fi
rm -rf "$DB" "$SARIF"
codeql database create "$DB" --language="$LANG" --source-root="$ROOT" --overwrite
codeql database analyze "$DB" --format=sarif-latest --output="$SARIF" "$SUITE"
echo "[codeql-scan] SARIF: $SARIF"
