#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2026 ts-bastion contributors
# SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>
#
# SPDX-License-Identifier: MIT

set -euo pipefail

if ! command -v reuse >/dev/null 2>&1; then
  echo "[reuse-annotate] 'reuse' not found. Install: pip install reuse (or pipx install reuse)"
  exit 1
fi

git ls-files | while IFS= read -r file; do
  # Skip files whose licensing is declared elsewhere: REUSE.toml, a *.license sidecar,
  # the licence texts themselves, or generated docs.
  case "$file" in
    LICENSE|LICENSES/*|*.license|REUSE.toml|docs/*|.editorconfig|.gitattributes|.gitignore|.ls-lint.yml|.npmrc|.nvmrc|.prettierignore|package-lock.json) continue ;;
  esac
  if [ -f "$file.license" ]; then
    continue
  fi

  creator=$(git log --diff-filter=A --follow --format='%an' -- "$file" | tail -1)
  if [ -z "$creator" ]; then
    creator="ts-bastion contributors"
  fi

  reuse annotate \
    --copyright "ts-bastion contributors" \
    --license MIT \
    --contributor "$creator" \
    --fallback-dot-license \
    --skip-existing \
    "$file"
done

echo "[reuse-annotate] Done. Review 'git diff' before committing — reuse's own docs recommend manually verifying automated annotation."
