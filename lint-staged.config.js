export default {
  ".github/workflows/*.{yml,yaml}": [
    "bash -c 'command -v actionlint >/dev/null 2>&1 && actionlint -color || echo \"skip actionlint (not installed)\"'",
  ],
  "*.{js,ts}": ["eslint --fix", "prettier --write"],
  "*.md": ["eslint --fix", "prettier --write"],
  "*.json": ["prettier --write"],
  "*.ts": ["bash -c 'npm run type-check'"],
  "package.json": ["npm run lint:package", "npm run package:sort"],
  "package-lock.json": ["npm run lockfile-lint"],
  "*": ["secretlint"]
};
