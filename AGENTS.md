# ts-bastion — agent guide

## CI/CD pipelines

- `.github/workflows/quality.yml` — lockfile-lint + lint + ls-lint + format:check + editorconfig-checker + package:sort --check + type-check + tests + knip + depcruise on push (main/develop) and PR (main); `audit` job (`npm audit --audit-level=high` + osv-scanner SARIF + sbom) + standalone informational `audit-signatures` job (`npm audit signatures` → `reports/audit-signatures.txt`, `continue-on-error: true`, not in required checks)
- `.github/workflows/actionlint.yml` — `rhysd/actionlint` v1.7.12 (download script) + shellcheck (`-pyflakes=""`), blocking on push (main/develop) + pull_request (main) + `workflow_dispatch`/`workflow_call`
- `.github/workflows/zizmor.yml` — `zizmorcore/zizmor-action@v0.6.4` → SARIF `zizmor` → Security > Code scanning on push (main/develop), PR (main), schedule `0 4 * * 1`, `workflow_dispatch`/`workflow_call`; `exit 0` always (SARIF) → block via Code Scanning branch protection ruleset (Require code scanning results — `zizmor`)
- `.github/workflows/codeql.yml` — CodeQL `javascript-typescript` (`security-extended`) on push/PR + schedule `0 4 * * 1`
- `.github/workflows/release.yml` — quality ✅ → `npm run build` + `npm run sbom:all` + attestations (Sigstore via `actions/attest-build-provenance@v4.2.2`) + `npm run release` (semantic-release) on push main

## Commands

| Command                         | Action                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run build`                 | `tsc` — compiles `src/` → `dist/`                                                                                                    |
| `npm run clean`                 | `rm -rf dist` — removes build output                                                                                                 |
| `npm run cleanup`               | `rm -rf dist reports .nyc_output tmp temp .cache *.tsbuildinfo`                                                                      |
| `npm run dev`                   | `tsc --watch`                                                                                                                        |
| `npm run type-check`            | `tsc --noEmit` (source only)                                                                                                         |
| `npm run type-check:tests`      | `tsc --noEmit -p tsconfig.test.json` (source + tests)                                                                                |
| `npm run lint`                  | `eslint .` (flat config, strict type-checked)                                                                                        |
| `npm run lint:fix`              | `eslint . --fix`                                                                                                                     |
| `npm run format`                | `prettier --write .`                                                                                                                 |
| `npm run format:check`          | `prettier --check .`                                                                                                                 |
| `npm test`                      | `vitest run` — fast without coverage (80% thresholds via `npm run test:coverage`)                                                    |
| `npm run test:coverage`         | `vitest run --coverage` → `reports/coverage/` (80% thresholds)                                                                       |
| `npm run test:coverage:watch`   | `vitest --coverage` — watch with coverage                                                                                            |
| `npm run test:watch`            | `vitest` — watch mode                                                                                                                |
| `npm run test:ui`               | `vitest --ui` — browser UI                                                                                                           |
| `npm run osv`                   | `osv-scanner scan source -r .` — blocking (exit 1 on vuln)                                                                           |
| `npm run osv:html`              | `osv-scanner --format html --output-file reports/osv-report.html` — blocking+HTML                                                    |
| `npm run osv:html:force`        | same as `osv:html` but non-blocking (`\|\| true`) for local use                                                                      |
| `npm run sbom`                  | `npm sbom --sbom-format spdx --package-lock-only` → `reports/sbom/sbom.spdx.json` (GitHub)                                           |
| `npm run sbom:cyclonedx`        | `npm sbom --sbom-format cyclonedx --package-lock-only` → `reports/sbom/sbom.cyclonedx.json`                                          |
| `npm run sbom:all`              | `npm run sbom && npm run sbom:cyclonedx`                                                                                             |
| `npm run sbom:validate`         | `npx @cyclonedx/cyclonedx-cli validate` → validates CycloneDX (non-blocking)                                                         |
| `npm run actionlint`            | `actionlint -color` — linter workflows GitHub Actions + shellcheck (blocking)                                                        |
| `npm run actionlint:docker`     | `docker run --rm -v $(pwd):/repo --workdir /repo rhysd/actionlint:1.7.12 -color` — sans Go via Docker                                |
| `npm run audit:signatures`      | `npm audit signatures` — strict Sigstore verify (exits non-zero on missing/invalid)                                                  |
| `npm run audit:signatures:warn` | `npm audit signatures \|\| true` — non-blocking wrapper for CI (always exit 0)                                                       |
| `npm run depcruise:html`        | `depcruise src --output-type err-html` → `reports/depcruiser/index.html`                                                             |
| `npm run docs`                  | `typedoc` → `docs/*.md` (markdown, committed)                                                                                        |
| `npm run docs:html`             | `typedoc --options typedoc.html.json` → `reports/docs/index.html` (HTML, gitignored)                                                 |
| `npm run docs:watch`            | `typedoc --watch`                                                                                                                    |
| `npm run knip`                  | `knip` — dead-code analysis                                                                                                          |
| `npm run analyze`               | alias `knip`                                                                                                                         |
| `npm run lint:spell`            | `cspell lint "**/*.{ts,md,json}"` — spell-check source and docs                                                                      |
| `npm run lockfile-lint`         | `lockfile-lint --type npm --path package-lock.json --allowed-hosts npm --validate-https --validate-integrity --empty-hostname false` |
| `npm run ls-lint`               | `ls-lint` — filename/dir linter (`kebab-case`, `.ls-lint.yml`)                                                                       |
| `npm run release`               | `semantic-release`                                                                                                                   |
| `npm run release:dry`           | `semantic-release --dry-run`                                                                                                         |

## Workflow

- **Pre-commit** (husky + lint-staged): `eslint --fix` + `prettier --write` on staged `*.{js,ts}`, `npm run lockfile-lint` on staged `package-lock.json`, then `npm run type-check` if any `.ts` files are staged.
- **Commit messages**: conventional commits enforced via commitlint (`@commitlint/config-conventional`).
- **Recommended local order**: `npm run lint` → `npm run type-check` → `npm run format:check` → `npm run ls-lint` → tests.

## Architecture

- **Single-package ESM repo** — minimal template agnostic to project type (API, CLI, library, worker).
- **Entrypoint**: `src/index.ts` — exports `logHello()` as placeholder; replace with your public API.
- **No runtime dependencies** — add only what your project needs.

## Orphaned / stale

- `dist/` is build output (regenerate with `npm run build`, remove with `npm run clean`). Stale after `src/` changes.
- `docs/*.md` is generated by TypeDoc markdown (`npm run docs`) — committed. `reports/docs/` is HTML variant (`npm run docs:html`) — gitignored.
- `reports/` is single gitignored folder for all HTML/sites not committed (coverage, sbom, osv-report.html, docs html, depcruiser) — cleaned by `npm run cleanup`. `dependency-graph.svg` stays at root (referenced in README). `reports/sbom/` contains `sbom.spdx.json` (GitHub) + `sbom.cyclonedx.json`.
- `coverage/` is obsolete (migrated to `reports/coverage/`) but kept in `.gitignore` for compatibility.

## Style conventions

- **Filenames**: kebab-case enforced by `ls-lint` (`.ls-lint.yml`) + `unicorn/filename-case`.
- **No default exports**: `import/no-default-export: error`.
- **Type imports**: `@typescript-eslint/consistent-type-imports` with `prefer: "type-imports"`.
- **Imports order**: builtin → external → internal → parent → sibling → index, grouped with newlines, alphabetized.
- **Prettier**: semi, singleQuote, tabWidth 2, trailingComma es5, printWidth 100.
- **No abbreviations**: `unicorn/prevent-abbreviations: ["error", { replacements: {}, allowList: ["i","j"] }]` — strict verbose.
- **Naming convention** (`@typescript-eslint/naming-convention: error`): `variable/parameter/method` → `camelCase` (`variable` `const` allows `UPPER_CASE`), `function` → `camelCase`, `typeLike` → `PascalCase`, `enumMember` → `PascalCase`, `typeParameter` → `PascalCase` prefix `T`, `property` → `camelCase` strict, `boolean` `variable/parameter` → `camelCase` prefix `is|has|should|can|was|did`.
- **Function verb** (`@typescript-eslint/naming-convention: warn` on `**/*.ts`): `function` must match `^(get|create|fetch|update|delete|find|build|parse|format|validate|handle|set|remove|add|is|has|should|can).+` — separate `warn` block to circumvent 1 severity/selector limit.

## tsconfig quirks

- `verbatimModuleSyntax: true` — must use `import type` for type-only imports, and `.js` extensions in relative imports.
- `skipLibCheck: false` — all `.d.ts` in node_modules are checked.
- `exactOptionalPropertyTypes: true` — cannot assign `undefined` to optional properties.
- `noUncheckedIndexedAccess: true` — indexed access returns `T | undefined`.
- Test files excluded from main `tsconfig.json` — use `tsconfig.test.json` for test type-checking (`npm run type-check:tests`).
- `tsconfig.test.json` adds `vitest/globals` types and disables unused-variable errors for test convenience.

## Testing

- **Vitest** with `globals: true` (describe/it/expect available without import).
- Coverage thresholds: 80% lines/functions/branches/statements.
- Smoke test: `tests/hello.test.ts` covers `src/index.ts` (`logHello()`).
- Run: `npm test` or `npx vitest run`.
