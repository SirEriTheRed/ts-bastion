**@erithered/ts-bastion**

---

# TS Bastion

_A TypeScript project template centered around code quality and CI/CD._

[![build](https://img.shields.io/github/actions/workflow/status/SirEriTheRed/ts-bastion/quality.yml?branch=main)](https://github.com/SirEriTheRed/ts-bastion/actions)
[![coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)](https://github.com/SirEriTheRed/ts-bastion)
[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![license](https://img.shields.io/github/license/SirEriTheRed/ts-bastion)](./LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/SirEriTheRed/ts-bastion/badge)](https://scorecard.dev/viewer/?uri=github.com/SirEriTheRed/ts-bastion)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<!-- Publishing modes:
    Default (private:true): GitHub attestations only (SLSA L2) — dist/** + SBOM via Sigstore, no npm publish.
    Full-security: set package.json private:false + .releaserc.json npmPublish:true + configure Trusted Publisher on npmjs.com → npm provenance (SLSA L3) via OIDC, no NPM_TOKEN needed. -->

## Publishing & Provenance

| Mode           | `package.json:private` | `.releaserc.json:npmPublish`              | npm Trusted Publisher                                                                            | Result                                                                                                            |
| -------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Default (safe) | `true`                 | `false`                                   | —                                                                                                | GitHub attestations only (SLSA L2): `dist/**` + SBOM attested via Sigstore on every release                       |
| Full-security  | `false`                | `true` (or remove option, default `true`) | Add on npmjs.com → package Settings → Trusted Publishers → `owner/repo` + workflow `release.yml` | npm provenance (SLSA L3) via OIDC — `@semantic-release/npm` auto-publishes with provenance; no `NPM_TOKEN` needed |

> `publishConfig.provenance` + `.npmrc:provenance=true` are redundant but explicit. `release.yml` already has `id-token:write` + `attestations:write`; `npm pack` is validated without publishing when `private:true`. Verify attestations with `gh attestation verify --owner <owner> dist/index.js`.

## Template Contents

Minimal yet strict template, ready to clone to start a TypeScript project (API, CLI, library or worker) without configuration debt.

## Prerequisites

- Node.js `>=20` (`lts/jod` recommended, see `.nvmrc`)
- npm `>=10`

## Getting Started

### Installation

```bash
# 1. Clone
git clone https://github.com/SirEriTheRed/ts-bastion.git my-project
cd my-project

# 2. Rename for your project
# - package.json: "name" field (@scope/name)
# - README.md: title + badges [owner]/[repo]
# - LICENSE: holder if different

# 3. Install dependencies
npm install

# 4. Reset git history
rm -rf .git && git init && git add . && git commit -m "feat: initial commit"

# 5. First push
git remote add origin <your-repo-url>
git push -u origin main
```

### Quick Start

```bash
npm run build
npm test
npm run dev    # watch mode
```

### Basic Usage

```ts
import { logHello } from './src/index.js';

console.log(logHello()); // "hello world!"
```

> Replace the `logHello()` example with your own public API as you build out the template.

## Usage

Use the cloned template as a starting point for any TypeScript project (API, CLI, library, or
worker). Update imports to use `.js` extensions (`verbatimModuleSyntax`) and run the scripts
listed below.

## External Tools (Manual Installation Required)

> These tools are **not** in `package.json` and must be installed separately. CI installs them automatically where needed, but locally you need them for certain commands.

| Tool                     | Role in Project                                                                                                                                       | Install                                                                                                                         | When Required?                                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Go** `>=1.21`          | Required to install `osv-scanner` via `go install` for local `npm run osv*`; CI uses `google/osv-scanner-action@v2` (no Go needed)                    | https://go.dev/dl/ or `brew install go` / `apt install golang`                                                                  | `npm run osv`, `npm run osv:html` (local only; CI: no Go, SARIF via action → Security > Code scanning)                                                      |
| **osv-scanner**          | Vulnerability scanning — Go binary `github.com/google/osv-scanner/v2` (`npm run osv` local, SARIF in CI)                                              | `go install github.com/google/osv-scanner/v2/cmd/osv-scanner@latest` then `export PATH=$PATH:$(go env GOPATH)/bin` (local only) | any `npm run osv*` locally; in CI via `google/osv-scanner-action@v2` → `reports/osv.sarif` → Security > Code scanning (`osv:html` local-only)               |
| **zizmor** `>=1.30`      | GitHub Actions security audit — CI via `.github/workflows/zizmor.yml` (`zizmorcore/zizmor-action@v0.6.4` → SARIF `zizmor` → Security > Code scanning) | `cargo install zizmor` · `pipx install zizmor` · `brew install zizmor` · binary at `github.com/woodruffw/zizmor/releases`       | `npm run zizmor` / `npm run zizmor:sarif` locally; in CI auto on push/PR/schedule → Security > Code scanning (branch protection ruleset blocks PR on alert) |
| **actionlint** `v1.7.12` | Linter workflows GitHub Actions — `actionlint -color` + shellcheck                                                                                    | `go install github.com/rhysd/actionlint/cmd/actionlint@latest` · `brew install actionlint` · script download                    | `npm run actionlint` local (recommended); CI via `.github/workflows/actionlint.yml` (blocking)                                                              |
| **Graphviz** (`dot`)     | Generates `dependency-graph.svg` (`npm run depcruise:graph`)                                                                                          | `brew install graphviz` / `apt install graphviz` / https://graphviz.org/download/                                               | `npm run depcruise:graph` only                                                                                                                              |
| **Git** `>=2.40`         | Husky hooks, `git-auto-commit-action` (`docs` job), `semantic-release`                                                                                | https://git-scm.com/downloads                                                                                                   | always                                                                                                                                                      |

> **Tip:** verify locally with `go version && osv-scanner --version && zizmor --version && dot -V`

## Tooling

| Category      | Tool / Config                                                                                                                                                                                              | Version / Detail     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Language      | TypeScript strict (`strict`, `verbatimModuleSyntax`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)                                                                                             | `^5.9`               |
| Lint          | ESLint flat config + `typescript-eslint` (strict + stylistic type-checked), `eslint-plugin-unicorn`, `eslint-plugin-sonarjs`, `eslint-plugin-security`, `eslint-plugin-import-x`, `eslint-config-prettier` | `^10`                |
| Format        | Prettier (`semi`, `singleQuote`, `tabWidth:2`, `printWidth:100`)                                                                                                                                           | `^3.8`               |
| Tests         | Vitest (`globals:true`) + `@vitest/coverage-v8`, 80% thresholds for lines/functions/branches/statements                                                                                                    | `^4.1`               |
| Dead code     | Knip                                                                                                                                                                                                       | `^6.16`              |
| Deps          | dependency-cruiser (`err-long`)                                                                                                                                                                            | `^18.2`              |
| Git hooks     | Husky + lint-staged (`eslint --fix` + `prettier --write` on `*.{js,ts}` + `type-check` if `.ts` staged) + commitlint (`@commitlint/config-conventional`)                                                   | `^9` / `^17` / `^21` |
| Release       | semantic-release (`@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/npm`)                                                                                                         | `^25`                |
| Documentation | TypeDoc + `typedoc-plugin-markdown`                                                                                                                                                                        | `^0.28`              |
| Spell check   | CSpell                                                                                                                                                                                                     | `^10`                |
| Lockfile      | lockfile-lint (`--allowed-hosts npm --validate-https --validate-integrity --empty-hostname false` on `package-lock.json` lockfileVersion 3)                                                                | `^5.0`               |
| Filename      | ls-lint (`.ls-lint.yml`, `kebab-case` + `SCREAMING_SNAKE_CASE` for `*.md`)                                                                                                                                 | `2.3.1`              |
| Workflow lint | actionlint (`actionlint -color` + shellcheck, `v1.7.12`)                                                                                                                                                   | `1.7.12`             |

## Scripts

| Command                       | Action                                                                                                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`               | `tsc` — compiles `src/` → `dist/`                                                                                                                                                            |
| `npm run clean`               | `rm -rf dist`                                                                                                                                                                                |
| `npm run cleanup`             | `rm -rf dist reports .nyc_output tmp temp .cache *.tsbuildinfo` — cleans build + reports                                                                                                     |
| `npm run dev`                 | `tsc --watch`                                                                                                                                                                                |
| `npm run type-check`          | `tsc --noEmit` (source only)                                                                                                                                                                 |
| `npm run type-check:tests`    | `tsc --noEmit -p tsconfig.test.json` (src + tests)                                                                                                                                           |
| `npm run lint`                | `eslint .`                                                                                                                                                                                   |
| `npm run lint:fix`            | `eslint . --fix`                                                                                                                                                                             |
| `npm run format`              | `prettier --write .`                                                                                                                                                                         |
| `npm run format:check`        | `prettier --check .`                                                                                                                                                                         |
| `npm run lint:spell`          | `cspell lint "**/*.{ts,md,json}"`                                                                                                                                                            |
| `npm run lockfile-lint`       | `lockfile-lint --type npm --path package-lock.json --allowed-hosts npm --validate-https --validate-integrity --empty-hostname false`                                                         |
| `npm run ls-lint`             | `ls-lint` — filename/dir linter (`kebab-case`, `.ls-lint.yml`)                                                                                                                               |
| `npm test`                    | `vitest run` — fast without coverage (80% thresholds via `npm run test:coverage`)                                                                                                            |
| `npm run test:coverage`       | `vitest run --coverage` — with 80% thresholds → `reports/coverage/`                                                                                                                          |
| `npm run test:coverage:watch` | `vitest --coverage` (watch with coverage)                                                                                                                                                    |
| `npm run test:watch`          | `vitest` (watch)                                                                                                                                                                             |
| `npm run test:ui`             | `vitest --ui`                                                                                                                                                                                |
| `npm run knip`                | `knip` — dead-code analysis                                                                                                                                                                  |
| `npm run analyze`             | alias `knip`                                                                                                                                                                                 |
| `npm run osv`                 | `osv-scanner scan source -r .` — blocking (exits 1 on vuln) — local (requires Go/binary); CI uses `google/osv-scanner-action@v2` → SARIF (blocking, Security > Code scanning)                |
| `npm run osv:html`            | `osv-scanner --format html --output-file reports/osv-report.html` — blocking + HTML — local-only (requires Go/binary, not generated in CI)                                                   |
| `npm run osv:html:force`      | same as `osv:html` but non-blocking (`\|\| true`) — local-only                                                                                                                               |
| `npm run sbom`                | `npm sbom --sbom-format spdx --package-lock-only` → `reports/sbom/sbom.spdx.json` (GitHub Dependency Graph)                                                                                  |
| `npm run sbom:cyclonedx`      | `npm sbom --sbom-format cyclonedx --package-lock-only` → `reports/sbom/sbom.cyclonedx.json`                                                                                                  |
| `npm run sbom:all`            | `npm run sbom && npm run sbom:cyclonedx` — generates both                                                                                                                                    |
| `npm run sbom:validate`       | `npx @cyclonedx/cyclonedx-cli validate` → validates `reports/sbom/sbom.cyclonedx.json` (non-blocking)                                                                                        |
| `npm run zizmor`              | `zizmor .` — GitHub Actions audit (requires `zizmor` binary); CI via `zizmorcore/zizmor-action@v0.6.4` → SARIF `zizmor` → Security > Code scanning                                           |
| `npm run zizmor:sarif`        | `zizmor --format sarif . > reports/zizmor.sarif` — local SARIF preview (same `--format=sarif` as CI, `exit 0` always; block via Code Scanning ruleset)                                       |
| `npm run depcruise`           | `depcruise src --output-type err-long`                                                                                                                                                       |
| `npm run actionlint`          | `actionlint -color` — linter workflows GitHub Actions + shellcheck (`-pyflakes=""`) — local recommended (requires `actionlint` binary); CI via `.github/workflows/actionlint.yml` (blocking) |
| `npm run actionlint:docker`   | `docker run --rm -v $(pwd):/repo --workdir /repo rhysd/actionlint:1.7.12 -color` — sans Go via Docker                                                                                        |
| `npm run depcruise:html`      | `depcruise src --output-type err-html` → `reports/depcruiser/index.html`                                                                                                                     |
| `npm run depcruise:graph`     | `depcruise src --output-type dot \| dot -T svg > dependency-graph.svg` (requires Graphviz)                                                                                                   |
| `npm run docs`                | `typedoc` — generates `docs/*.md` (committed markdown) from TSDoc                                                                                                                            |
| `npm run docs:html`           | `typedoc --options typedoc.html.json` → `reports/docs/index.html` (browsable HTML, gitignored)                                                                                               |
| `npm run docs:watch`          | `typedoc --watch`                                                                                                                                                                            |
| `npm run release`             | `semantic-release`                                                                                                                                                                           |
| `npm run release:dry`         | `semantic-release --dry-run`                                                                                                                                                                 |

## Conventions

- **Filenames**: `kebab-case` via `ls-lint` (`.ls-lint.yml`) + `unicorn/filename-case`
- **No default exports**: `import/no-default-export: error`
- **Type imports**: `import type` required for types (`consistent-type-imports`), order `builtin → external → internal → parent → sibling → index` (grouped, alphabetized)
- **Modules**: `verbatimModuleSyntax: true` — `.js` extensions in relative imports
- **tsconfig**: `skipLibCheck:false`, `exactOptionalPropertyTypes:true`, `noUncheckedIndexedAccess:true`; tests excluded from main `tsconfig.json`, checked via `tsconfig.test.json` (`vitest/globals`, `noUnusedLocals:false`)
- **Pre-commit**: `lint-staged` + `husky` + `commitlint` (conventional commits)
- **CI**: see `AGENTS.md` and `.github/workflows/`

## Dependency Graph

Rules defined in [`.dependency-cruiser.cjs`](_media/.dependency-cruiser.cjs) (`no-circular`, `no-orphans`, `no-non-package-json`, `not-to-dev-dep`, …) — verify with:

```bash
npm run depcruise
```

Graph generated with `dependency-cruiser` + Graphviz (`dot`):

```bash
npm run depcruise:graph
# or: npx depcruise src --include-only '^src' --output-type dot | dot -T svg > dependency-graph.svg
```

![Dependency graph](_media/dependency-graph.svg)

> The SVG is committed and automatically regenerated on pre-commit if `src/` or `.dependency-cruiser.cjs` is staged (requires Graphviz `dot`); `npm run depcruise:graph` remains available manually.

## API Documentation

TSDoc comments from `src/` are published via TypeDoc:

```bash
npm run docs        # committed markdown → docs/*.md
npm run docs:html   # browsable site → reports/docs/index.html (gitignored)
```

`dependency-graph.svg` stays at the root (referenced above). All HTML/coverage reports are centralized in `reports/` (gitignored, cleaned by `npm run cleanup`):

```text
reports/
├── coverage/index.html      ← vitest html
├── sbom/sbom.spdx.json      ← npm sbom --sbom-format spdx (GitHub Dependency Graph)
├── sbom/sbom.cyclonedx.json ← npm sbom --sbom-format cyclonedx
├── osv.sarif                ← osv-scanner --format sarif (CI → Security > Code scanning; local: npm run osv)
├── osv-report.html          ← osv-scanner --format html (local-only: npm run osv:html, not generated in CI)
├── zizmor.sarif             ← zizmor --format sarif (CI via zizmor-action category zizmor → Security > Code scanning; local: npm run zizmor:sarif)
├── docs/index.html          ← typedoc html
└── depcruiser/index.html    ← dependency-cruiser err-html
```

## Documentation

Full documentation lives in [`docs/`](./docs) — generated from TSDoc via TypeDoc. Browse
quickstart, API reference, and guides:

- API docs: [`docs/README.md`](./docs/README.md) (markdown, committed)
- HTML site: `reports/docs/index.html` (generated via `npm run docs:html`)
- Dependency graph: see [Dependency Graph](#dependency-graph) above

Run `npm run docs` to regenerate.

## Contributing

Contributions are welcome! Please see [`CONTRIBUTING.md`](_media/CONTRIBUTING.md) for setup,
conventions, and pull-request flow, and our
[Community Code of Conduct](_media/CODE_OF_CONDUCT.md) (inspired by Contributor Covenant 3.0).

## License

[MIT](_media/LICENSE) — see `LICENSE`.

## Technologies Used

See [Tooling](#tooling) and [Prerequisites](#prerequisites) for the full stack. Highlights:
TypeScript strict, ESLint + Prettier, Vitest (80% coverage), Knip, dependency-cruiser, Husky +
lint-staged, commitlint, semantic-release, TypeDoc, CSpell, lockfile-lint.

## Template Source

The full README template (with `[PROJECT_NAME]` placeholders) is kept in
[`README-template.md`](_media/README-template.md).
