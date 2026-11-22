<!--
SPDX-FileCopyrightText: 2026 ts-bastion contributors
SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>

SPDX-License-Identifier: MIT
-->

# ts-bastion: agent guide

## CI/CD pipelines

- `.github/workflows/quality.yml` runs on `workflow_call` (from `release.yml`), push to
  `develop`, and pull_request to `main`. Jobs:
  - `check` (required): REUSE compliance (`fsfe/reuse-action@v6`, SHA-pinned, right after
    checkout) → `lockfile-lint` → `lint` → `lint:package` → `ls-lint` → `lint:spell` →
    `secretlint` → `format:check` → `npm run editorconfig` (devDependency binary, not the
    GitHub action) → `package:sort --check` → `type-check` → `type-check:tests` →
    `test:coverage` → `knip` → `depcruise`
  - `commitlint` (required): validates the commit range (`--from/--to` on PR, `--last` on
    push) with `commitlint.config.cjs`
  - `audit`: `npm audit --omit=dev --audit-level=high` (blocking, production dependencies)
    plus full-tree `npm audit --audit-level=critical` (reports all findings, blocks on
    Critical) → `google/osv-scanner-action` SARIF (`continue-on-error: true`, so it never
    gates a merge; known unfixable dev-only findings are suppressed by ID in
    `osv-scanner.toml`, with pending upstream fixes tracked in `TODO.md`) → Security >
    Code scanning + `sbom:all` artifacts + depcruiser HTML + OSV SARIF artifacts +
    `npm audit signatures` (informational, `continue-on-error: true`, artifact
    `reports/audit-signatures.txt`, not in required checks)
- `.github/workflows/actionlint.yml`: `rhysd/actionlint` v1.7.12 (download script) plus
  shellcheck (`-pyflakes=""`), blocking on push (main/develop), pull_request (main),
  `workflow_dispatch`, and `workflow_call`
- `.github/workflows/zizmor.yml`: `zizmorcore/zizmor-action@v0.6.4` → SARIF → Security >
  Code scanning on push (main/develop), PR (main), schedule `0 4 * * 1`,
  `workflow_dispatch`, and `workflow_call`; the action always exits 0 (SARIF), so blocking
  happens through the Code Scanning branch protection ruleset (Require code scanning
  results, `zizmor`)
- `.github/workflows/codeql.yml`: CodeQL `javascript-typescript` (`security-extended`) on
  push/PR (main, master), schedule `0 4 * * 1`, and `workflow_dispatch`
- `.github/workflows/scorecard.yml`: OpenSSF Scorecard (`ossf/scorecard-action` v2.4.4) →
  SARIF → Security > Code scanning; triggers on `branch_protection_rule`, push (main),
  schedule `26 7 * * 2`, and `workflow_dispatch`
- `.github/workflows/release.yml`: after quality passes, runs `npm run build` +
  `npm run docs` (docs regenerate at release time and are committed with the release via
  `@semantic-release/git`; the per-PR docs job was removed) + `npm run sbom:all` +
  attestations (Sigstore via `actions/attest-build-provenance@v4.2.2`) + `npm run release`
  (semantic-release) on push to main. The workflow does not open the `release/vX.Y.Z` PR
  itself: a PR created with `GITHUB_TOKEN` triggers no `pull_request` workflows, so its
  required checks would never report. Instead it pushes the branch, prints a one-click
  "Open PR" link and release notes in the run summary for a human to open (their event
  runs all checks), enables auto-merge if the PR already exists, and dispatches `codeql.yml`
  on the release branch so SARIF attaches to the PR head

## Commands

| Command                         | Action                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run build`                 | `tsc`, compiles `src/` → `dist/`                                                                                                     |
| `npm run clean`                 | `rm -rf dist`, removes build output                                                                                                  |
| `npm run cleanup`               | `rm -rf dist reports .nyc_output tmp temp .cache *.tsbuildinfo`                                                                      |
| `npm run check`                 | aggregate local gate: lint → lint:package → type-check(+tests) → format:check → editorconfig → ls-lint → knip → depcruise            |
| `npm run dev`                   | `tsc --watch`                                                                                                                        |
| `npm run type-check`            | `tsc --noEmit` (source only)                                                                                                         |
| `npm run type-check:tests`      | `tsc --noEmit -p tsconfig.test.json` (source + tests)                                                                                |
| `npm run lint`                  | `eslint .` (flat config, strict type-checked)                                                                                        |
| `npm run lint:fix`              | `eslint . --fix`                                                                                                                     |
| `npm run lint:package`          | `npmPkgJsonLint .`, `package.json` convention lint                                                                                   |
| `npm run format`                | `prettier --write .`                                                                                                                 |
| `npm run format:check`          | `prettier --check .`                                                                                                                 |
| `npm run editorconfig`          | `editorconfig-checker`, whitespace, EOL, charset rules                                                                               |
| `npm run editorconfig:docker`   | `docker run --rm --volume=$PWD:/check mstruebing/editorconfig-checker`                                                               |
| `npm run lint:spell`            | `cspell lint "**/*.{ts,md,json}"`, spell-check source and docs                                                                       |
| `npm run lockfile-lint`         | `lockfile-lint --type npm --path package-lock.json --allowed-hosts npm --validate-https --validate-integrity --empty-hostname false` |
| `npm run ls-lint`               | `ls-lint`, filename/dir linter (`kebab-case`, `.ls-lint.yml`)                                                                        |
| `npm run package:sort`          | `sort-package-json`, normalizes `package.json` (`--check` in CI)                                                                     |
| `npm run licenses`              | `license-checker`, lists licenses of npm dependencies                                                                                |
| `npm run secretlint`            | `secretlint "**/*"`, scans the repo for hardcoded secrets                                                                            |
| `npm run secretlint:mask`       | `secretlint --maskSecrets "**/*"`, same, secrets masked in output                                                                    |
| `npm test`                      | `vitest run`, fast without coverage (80% thresholds via `npm run test:coverage`)                                                     |
| `npm run test:coverage`         | `vitest run --coverage` → `reports/coverage/` (80% thresholds)                                                                       |
| `npm run test:coverage:watch`   | `vitest --coverage`, watch with coverage                                                                                             |
| `npm run test:watch`            | `vitest`, watch mode                                                                                                                 |
| `npm run test:ui`               | `vitest --ui`, browser UI                                                                                                            |
| `npm run osv`                   | `osv-scanner scan source -r .`, blocking (exit 1 on vuln)                                                                            |
| `npm run osv:html`              | `osv-scanner --format html --output-file reports/osv-report.html`, blocking + HTML                                                   |
| `npm run osv:html:force`        | same as `osv:html` but non-blocking (`\|\| true`) for local use                                                                      |
| `npm run sbom`                  | `npm sbom --sbom-format spdx --package-lock-only` → `reports/sbom/sbom.spdx.json` (GitHub)                                           |
| `npm run sbom:cyclonedx`        | `npm sbom --sbom-format cyclonedx --package-lock-only` → `reports/sbom/sbom.cyclonedx.json`                                          |
| `npm run sbom:all`              | `npm run sbom && npm run sbom:cyclonedx`                                                                                             |
| `npm run zizmor`                | `zizmor .`, GitHub Actions audit (requires `zizmor`); CI via `zizmorcore/zizmor-action@v0.6.4` → SARIF → Code scanning               |
| `npm run zizmor:sarif`          | `zizmor --format sarif . > reports/zizmor.sarif`, local SARIF preview (non-blocking)                                                 |
| `npm run actionlint`            | `actionlint -color`, lints workflow files + shellcheck (blocking)                                                                    |
| `npm run actionlint:docker`     | `docker run --rm -v $(pwd):/repo --workdir /repo rhysd/actionlint:1.7.12 -color`, same sans Go via Docker                            |
| `npm run codeql`                | `bash scripts/codeql-scan.sh`, runs CodeQL queries locally                                                                           |
| `npm run reuse`                 | `reuse lint`, REUSE/SPDX compliance (requires `reuse`); CI via `fsfe/reuse-action@v6` (blocking)                                     |
| `npm run reuse:annotate`        | `bash scripts/reuse-annotate.sh`, adds missing SPDX headers; review `git diff` before committing                                     |
| `npm run audit:signatures`      | `npm audit signatures`, strict Sigstore verify (exits non-zero on missing/invalid)                                                   |
| `npm run audit:signatures:warn` | `npm audit signatures \|\| true`, non-blocking wrapper for CI (always exit 0)                                                        |
| `npm run depcruise`             | `depcruise src --output-type err-long`, dependency rules (blocking)                                                                  |
| `npm run depcruise:html`        | `depcruise src --output-type err-html` → `reports/depcruiser/index.html`                                                             |
| `npm run depcruise:graph`       | `depcruise src --output-type dot \| dot -T svg > dependency-graph.svg` (requires Graphviz)                                           |
| `npm run docs`                  | `rm -rf docs/api && typedoc` → `docs/api/*.md` (markdown, committed; hand-written guides live next to it in `docs/`)                 |
| `npm run docs:html`             | `typedoc --options typedoc.html.json` → `reports/docs/index.html` (HTML, gitignored)                                                 |
| `npm run docs:watch`            | `typedoc --watch`                                                                                                                    |
| `npm run knip`                  | `knip`, dead-code analysis                                                                                                           |
| `npm run analyze`               | alias for `knip`                                                                                                                     |
| `npm run commit`                | `cz`, commitizen interactive conventional-commit prompt                                                                              |
| `npm run prepare`               | `husky`, installs git hooks (runs automatically on `npm install`)                                                                    |
| `npm run release`               | `semantic-release`                                                                                                                   |
| `npm run release:dry`           | `semantic-release --dry-run`                                                                                                         |

### External tools (not in `package.json`)

`reuse` (>=6.2), `zizmor`, `actionlint`, `osv-scanner`, `dot` (Graphviz), Go, and Docker
are not npm dependencies. Install them separately (README → _External Tools (Manual
Installation Required)_) or use the `*:docker` variants. CI installs its own copies
(`fsfe/reuse-action`, `zizmorcore/zizmor-action`, `rhysd/actionlint`,
`google/osv-scanner-action`). `knip.json` → `ignoreBinaries` declares the local-only
binaries: `actionlint`, `dot`, `osv-scanner`, `reuse`, `zizmor`.

## Workflow

- Pre-commit (`.husky/pre-commit`, executed by husky as `sh -e`), in order:
  - REUSE auto-annotate: for every newly staged file (`--diff-filter=A`, excluding
    `LICENSE`, `LICENSES/**`, `*.license`, `REUSE.toml`, `docs/**`, and the trivial
    dotfiles declared in `REUSE.toml`), runs
    `reuse annotate --copyright "ts-bastion contributors" --license MIT --fallback-dot-license --skip-existing`
    and re-stages it. Fail-soft: prints a notice and continues when `reuse` is not
    installed locally or when annotation fails. CI (`fsfe/reuse-action@v6`) is the real
    gate.
  - lint-staged: `eslint --fix` + `prettier --write` on staged `*.{js,ts}` and `*.md`,
    `prettier --write` on `*.json`, `npm run type-check` on `*.ts`,
    `npm run lint:package` + `npm run package:sort` on `package.json`,
    `npm run lockfile-lint` on `package-lock.json`, `secretlint` on every staged file, and
    `actionlint` on `.github/workflows/*.{yml,yaml}` when the binary is installed.
  - `npx --no ls-lint || true`, a non-blocking filename check.
  - Regenerates `dependency-graph.svg` when `src/**` or `.dependency-cruiser.cjs` is
    staged and Graphviz `dot` is available.
- Commit messages: conventional commits enforced via commitlint
  (`@commitlint/config-conventional`); `npm run commit` opens the commitizen prompt.
- Licensing (REUSE): every tracked file carries an SPDX header. `REUSE.toml` declares
  coverage for `docs/**` and for the trivial dotfiles (`.nvmrc`, `.gitignore`,
  `.gitattributes`, `.editorconfig`, `.npmrc`, `.prettierignore`, `.ls-lint.yml`,
  `package-lock.json`); JSON and other comment-less files use `*.license` sidecars, and
  `LICENSES/MIT.txt` holds the license text. Verify with `npm run reuse`; backfill missing
  headers with `npm run reuse:annotate`.
- Recommended local order: `npm run lint` → `npm run type-check` → `npm run format:check`
  → `npm run ls-lint` → `npm run reuse` → tests.

## Architecture

- Single-package ESM repo: a minimal template that fits any project type (API, CLI,
  library, worker).
- The entrypoint `src/index.ts` exports `logHello()` as a placeholder; replace it with
  your public API.
- No runtime dependencies; add only what your project needs.

## Orphaned / stale

- `dist/` is build output (regenerate with `npm run build`, remove with `npm run clean`).
  It goes stale after `src/` changes.
- `docs/api/` is generated by TypeDoc markdown (`npm run docs`); it is committed and must
  never be hand-edited. Hand-written guides live in `docs/` (see `docs/tooling.md`).
  `reports/docs/` is the HTML variant (`npm run docs:html`), gitignored.
- `reports/` is the single gitignored folder for all HTML/sites not committed (coverage,
  sbom, osv-report.html, docs html, depcruiser); `npm run cleanup` removes it.
  `dependency-graph.svg` stays at the root (referenced in README), and `reports/sbom/`
  contains `sbom.spdx.json` (GitHub) plus `sbom.cyclonedx.json`.
- `coverage/` is obsolete (it moved to `reports/coverage/`) but stays in `.gitignore` for
  compatibility.

## Style conventions

- Filenames are kebab-case, enforced by `ls-lint` (`.ls-lint.yml`) and
  `unicorn/filename-case`.
- No default exports (`import/no-default-export: error`).
- Type-only imports use `import type`
  (`@typescript-eslint/consistent-type-imports` with `prefer: "type-imports"`).
- Import order runs builtin → external → internal → parent → sibling → index, grouped
  with newlines and alphabetized.
- Prettier: semi, singleQuote, tabWidth 2, trailingComma es5, printWidth 100.
- No abbreviations: `unicorn/name-replacements: ["error", { allowList: { i: true, j: true } }]`
  enforces verbose names (it replaced the deprecated `prevent-abbreviations`).
- Naming convention (`@typescript-eslint/naming-convention: error`): `variable/parameter/method`
  → `camelCase` (a `const` variable may be `UPPER_CASE`), `function` → `camelCase`,
  `typeLike` → `PascalCase`, `enumMember` → `PascalCase`, `typeParameter` → `PascalCase`
  with prefix `T`, `property` → `camelCase` strict, and a `boolean`
  `variable/parameter` → `camelCase` with prefix `is|has|should|can|was|did`.
- Function verb (`@typescript-eslint/naming-convention: warn` on `**/*.ts`): a `function`
  must match `^(get|create|fetch|update|delete|find|build|parse|format|validate|handle|set|remove|add|is|has|should|can).+`.
  This lives in a separate `warn` block to work around the one-severity-per-selector limit.

## tsconfig quirks

- `verbatimModuleSyntax: true`: use `import type` for type-only imports and `.js`
  extensions in relative imports.
- `skipLibCheck: false`: all `.d.ts` in node_modules are checked.
- `exactOptionalPropertyTypes: true`: you cannot assign `undefined` to an optional
  property.
- `noUncheckedIndexedAccess: true`: indexed access returns `T | undefined`.
- Test files stay out of the main `tsconfig.json`; use `tsconfig.test.json` for test
  type-checking (`npm run type-check:tests`).
- `tsconfig.test.json` adds `vitest/globals` types and disables unused-variable errors
  for test convenience.

## Testing

- Tests use Vitest with `globals: true` (describe/it/expect are available without
  imports).
- Coverage thresholds are 80% for lines, functions, branches, and statements.
- The smoke test `tests/hello.test.ts` covers `src/index.ts` (`logHello()`).
- Run the suite with `npm test` or `npx vitest run`.
