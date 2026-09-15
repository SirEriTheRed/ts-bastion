# <!--

CONTRIBUTING TEMPLATE — RADMEv2
Designed for human maintainers and AI agents.

Instructions: - Replace every [bracketed placeholder] with your project's actual values. - Remove or comment out optional sections that don't apply to your project. - Keep the HTML comments — they are invisible on GitHub/GitLab but serve as
guidance for anyone (human or AI) editing this file.
================================================================================

-->

<!-- Placeholders: [PROJECT_NAME], [PACKAGE_NAME], [OWNER], [REPO], [LICENSE_NAME], [CODE_OF_CONDUCT_EMAIL] — replace all before publishing -->

# Contributing to [PROJECT_NAME]

<!--
  Intro — keep concise. Replace [PROJECT_NAME] and [LICENSE_NAME] / LICENSE link.
  If your license differs from ISC, update both here and in the License section below.
-->

Thank you for considering contributing! This document explains how to set up your environment, follow the project's conventions, and submit changes. By contributing you agree that your contributions will be licensed under the [LICENSE_NAME](./LICENSE).

<!--
  Template notice — keep if this repo is itself a template. Remove if not.
  Replace [OWNER]/[REPO] with your GitHub path.
-->

> This is a template repository. If you forked it, replace `[OWNER]/[REPO]` with your own `owner/repo` in badges, URLs, and examples below.

## Table of Contents

- [Prerequisites (Development Environment Setup)](#prerequisites-development-environment-setup)
- [Participation Guidelines](#participation-guidelines)
- [What We're Working On](#what-were-working-on)
- [Getting Started (Development Environment Setup / Local Development Workflow)](#getting-started-development-environment-setup--local-development-workflow)
- [Branching and Workflow (Branch Naming Conventions / Local Development Workflow)](#branching-and-workflow-branch-naming-conventions--local-development-workflow)
- [Commit Convention (Commit Message Conventions)](#commit-convention-commit-message-conventions)
- [Code Style (Coding Standards)](#code-style-coding-standards)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Quality Checks](#quality-checks)
- [Testing (Testing Requirements)](#testing-testing-requirements)
- [Documentation](#documentation)
- [Security](#security)
- [Pull Request Process (Code Review Process)](#pull-request-process-code-review-process)
- [Release](#release)
- [Communication Channels](#communication-channels)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Participation Guidelines

<!--
  Requires CODE_OF_CONDUCT.md (Community Code of Conduct, inspired by Contributor Covenant 3.0)
  in repo root. Replace [CODE_OF_CONDUCT_EMAIL] with your contact before publishing. Keep the
  blockquote if this is a template.
-->

This project follows our [Community Code of Conduct](./CODE_OF_CONDUCT.md) (inspired by Contributor Covenant 3.0). By participating you are expected to uphold it. Report unacceptable behavior to **[CODE_OF_CONDUCT_EMAIL]** — or privately via [Security](#security) advisory if preferred.

> This is a template repository. If you forked it, replace `[CODE_OF_CONDUCT_EMAIL]` with your own contact.

## Prerequisites (Development Environment Setup)

<!--
  Adjust versions to match your stack. Keep the table if you rely on external binaries.
-->

- **Node.js** `>=20` (`lts/jod` recommended, see [.nvmrc](./.nvmrc))
- **npm** `>=10`
- **Git** `>=2.40` — Husky hooks, `semantic-release`, docs auto-commit

### External Tools (Manual Installation Required)

<!--
  These tools are NOT in package.json. CI installs them where needed.
  Remove rows that don't apply to your project, or add your own.
-->

These tools are **not** in `package.json`. CI installs them automatically where needed, but locally you need them for certain commands.

| Tool                 | Role                                                                        | Install                                                                                                                   | When Required                                                                              |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Go** `>=1.21`      | Required to install `osv-scanner` via `go install`                          | <https://go.dev/dl/> or `brew install go` / `apt install golang`                                                          | `npm run osv*` locally; not needed in CI                                                   |
| **osv-scanner**      | Vulnerability scanning (`npm run osv`) — `github.com/google/osv-scanner/v2` | `go install github.com/google/osv-scanner/v2/cmd/osv-scanner@latest` then `export PATH=$PATH:$(go env GOPATH)/bin`        | any `npm run osv*` locally; in CI via `google/osv-scanner-action@v2` → `reports/osv.sarif` |
| **zizmor** `>=1.30`  | GitHub Actions security audit                                               | `cargo install zizmor` · `pipx install zizmor` · `brew install zizmor` · binary at `github.com/woodruffw/zizmor/releases` | local `zizmor .` / `zizmor --persona pedantic .` (not in CI by default)                    |
| **Graphviz** (`dot`) | Generates `dependency-graph.svg`                                            | `brew install graphviz` / `apt install graphviz` / <https://graphviz.org/download/>                                       | `npm run depcruise:graph` only                                                             |

Verify locally:

```bash
go version && osv-scanner --version && zizmor --version && dot -V
```

## What We're Working On

<!--
  Enable GitHub labels/milestones or replace with your issue tracker.
  Replace [OWNER]/[REPO] with your path. Remove if not using good-first-issues.
-->

Browse [good first issues](https://github.com/[OWNER]/[REPO]/labels/good%20first%20issue) and [open milestones](https://github.com/[OWNER]/[REPO]/milestones) to find where to help.

## Getting Started (Development Environment Setup / Local Development Workflow)

<!--
  Replace [OWNER]/[REPO] and [REPO] folder name. Adjust package manager if not npm.
-->

```bash
# 1. Clone
git clone https://github.com/[OWNER]/[REPO].git
cd [REPO]

# 2. Install
npm install

# 3. Verify
npm run type-check
npm run lint
npm test
```

If you are bootstrapping a new project from this template, also:

- Update `package.json` `name` (`@scope/name` → `[PACKAGE_NAME]`)
- Update `README.md` title and badges (`[OWNER]/[REPO]`)
- Update `LICENSE` holder if different
- Reset history: `rm -rf .git && git init && git add . && git commit -m "feat: initial commit"` then `git remote add origin <your-repo-url> && git push -u origin main`

## Branching and Workflow (Branch Naming Conventions / Local Development Workflow)

<!--
  Adjust protected branches and workflow file path to match your repo.
-->

- **Protected branches:** `main` (releases) and `develop` (integration). CI runs on `push` to `main`/`develop` and on `pull_request` targeting `main` (see [.github/workflows/quality.yml](./.github/workflows/quality.yml)).
- **Create a topic branch from `main`:** `git checkout -b feat/short-description` or `fix/short-description`. Pull latest `main` before branching: `git pull origin main`.
- **Keep PRs small and focused** — one concern per PR, with tests and docs if applicable.
- **Rebase or merge `main` regularly** to avoid conflicts.

> **First time contributing to open source?** See [Fork a repo](https://help.github.com/articles/fork-a-repo/), [Making changes](https://guides.github.com/activities/forking/#making-changes) and the free series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

## Commit Convention (Commit Message Conventions)

This project uses [Conventional Commits](https://www.conventionalcommits.org) enforced by [commitlint](https://commitlint.js.org) (`@commitlint/config-conventional` via [commitlint.config.cjs](./commitlint.config.cjs)).

- **Husky `commit-msg` hook** runs `commitlint --edit` on every commit — non-conventional messages are rejected.
- **CI `commitlint` job** validates the full history on push/PR (see `quality.yml`).
- **Commitizen helper:** use `npm run commit` (alias `npm run commit` → `cz` with `@commitlint/cz-commitlint`) for an interactive prompt instead of crafting the message by hand.

Format: `<type>(<scope>): <description>`

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Examples:

```bash
feat: add pagination to list endpoint
fix(api): handle null cursor in search
docs: regenerate docs [skip ci]
chore(deps): bump typescript to 5.9.3
```

Breaking change:

```bash
feat!: drop Node 18 support

BREAKING CHANGE: requires Node >=20
```

## Code Style (Coding Standards)

<!--
  Update references to eslint.config.js / AGENTS.md if you rename configs.
-->

Conventions are enforced by ESLint (flat config, strict type-checked) and Prettier. See [eslint.config.js](./eslint.config.js) and [AGENTS.md](./AGENTS.md) for the authoritative list.

- **Filenames:** `kebab-case` (`unicorn/filename-case`).
- **No default exports:** `import/no-default-export: error`.
- **Type imports:** `import type` for type-only imports (`@typescript-eslint/consistent-type-imports` with `prefer: "type-imports"`).
- **Import order:** `builtin → external → internal → parent → sibling → index`, grouped with newlines, alphabetized (`import-x/order`).
- **Modules:** `verbatimModuleSyntax: true` — use `.js` extensions in relative imports and `import type` for types.
- **Prettier:** `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: "es5"`, `printWidth: 100`.
- **No abbreviations:** `unicorn/prevent-abbreviations` with `allowList: ["i","j"]` — prefer verbose names.
- **Naming:**
  - `variable` / `parameter` / `method` → `camelCase` (`variable` `const` allows `UPPER_CASE`)
  - `function` → `camelCase`
  - `typeLike` → `PascalCase`, `enumMember` → `PascalCase`, `typeParameter` → `PascalCase` prefix `T`
  - `property` → `camelCase` (strict)
  - Boolean `variable`/`parameter` → `camelCase` prefix `is|has|should|can|was|did`
  - Function verb (warn on `**/*.ts`): must match `^(get|create|fetch|update|delete|find|build|parse|format|validate|handle|set|remove|add|is|has|should|can).+`
- **Other rules:** `sonarjs/cognitive-complexity` ≤ 20, `security/detect-*`, `promise/*`, `regexp`, `tsdoc/syntax: error`, `eslint-config-prettier` last.

### tsconfig Quirks

Defined in [tsconfig.json](./tsconfig.json):

- `verbatimModuleSyntax: true` — `import type` + `.js` extensions required.
- `skipLibCheck: false` — all `.d.ts` in `node_modules` are checked.
- `exactOptionalPropertyTypes: true` — cannot assign `undefined` to optional properties.
- `noUncheckedIndexedAccess: true` — indexed access returns `T | undefined`.
- Tests excluded from main config — use [tsconfig.test.json](./tsconfig.test.json) (`vitest/globals`, `noUnusedLocals: false`) via `npm run type-check:tests`.

## Pre-commit Hooks

Managed by Husky + lint-staged (see [.husky/pre-commit](./.husky/pre-commit) and [lint-staged.config.js](./lint-staged.config.js)):

| Trigger                                    | Action                                                                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `*.{js,ts}` staged                         | `eslint --fix` + `prettier --write`                                                                                        |
| `*.md` staged                              | `eslint --fix` + `prettier --write`                                                                                        |
| `*.json` staged                            | `prettier --write`                                                                                                         |
| `*.ts` staged                              | `npm run type-check` (`tsc --noEmit`)                                                                                      |
| `package-lock.json` staged                 | `npm run lockfile-lint`                                                                                                    |
| `*` (any file) staged                      | `secretlint`                                                                                                               |
| `src/` or `.dependency-cruiser.cjs` staged | regenerate `dependency-graph.svg` via `npm run depcruise:graph` if `dot` is available, then `git add dependency-graph.svg` |

Additional hooks:

- `commit-msg`: `commitlint --edit`
- `pre-push`: `npm run check && npm run build && npm test && rm -f *.tgz`

Hooks run automatically after `npm install` (`prepare` → `husky`). Bypass only with good reason (`--no-verify` is discouraged).

## Quality Checks

Run the same checks CI runs before pushing. Recommended order (see `AGENTS.md`):

```bash
npm run lint
npm run type-check
npm run type-check:tests
npm run format:check
npm run lint:spell
npm run secretlint
npm run test:coverage
npm run knip
npm run depcruise
```

Shorthand alias (lint + type-check + format:check + knip + depcruise):

```bash
npm run check
```

Full CI parity (mirrors `quality.yml` `check` + `audit` jobs):

```bash
npm run lockfile-lint
npm run lint
npm run lint:spell
npm run secretlint
npm run format:check
npm run type-check
npm run type-check:tests
npm run test:coverage
npx knip
npm run depcruise
npm audit --audit-level=high
npm run depcruise:html
```

Optional local audits:

```bash
npm run osv              # requires Go + osv-scanner binary
npm run osv:html         # → reports/osv-report.html (local-only, not in CI)
zizmor .                 # GitHub Actions audit
zizmor --persona pedantic .
```

## Testing (Testing Requirements)

- **Framework:** [Vitest](https://vitest.dev) with `globals: true` — `describe`/`it`/`expect` are available without imports (see [vitest.config.ts](./vitest.config.ts)).
- **Location:** `tests/**/*.test.ts` (smoke test: `tests/hello.test.ts` → `src/index.ts` `hello()`).
- **Coverage:** 80% thresholds for lines/functions/branches/statements (enforced via `npm run test:coverage` → `reports/coverage/`). `npm test` runs without coverage for speed.

```bash
npm test                  # fast, no coverage
npm run test:coverage     # with 80% thresholds → reports/coverage/
npm run test:watch        # watch mode
npm run test:coverage:watch
npm run test:ui           # Vitest UI
```

When adding features, include tests that preserve or improve coverage. Test files use `tsconfig.test.json` and relaxed lint rules for globals.

## Documentation

- **TSDoc:** document exported/public surface (functions, classes, types, interfaces). `tsdoc/syntax: error` is enforced. Do not repeat types already declared by TypeScript — describe intent and behavior.
- **TypeDoc:** generates `docs/*.md` (markdown, committed) and `reports/docs/index.html` (HTML, gitignored).

```bash
npm run docs        # → docs/*.md (commit these)
npm run docs:html   # → reports/docs/index.html (gitignored, browsable)
npm run docs:watch  # watch mode
```

On `push` to `main`, CI's `docs` job runs `npm run docs` and auto-commits `docs/**` with `docs: regenerate docs [skip ci]` if changed.

- **Dependency graph:** rules in [.dependency-cruiser.cjs](./.dependency-cruiser.cjs). The committed [dependency-graph.svg](./dependency-graph.svg) is auto-regenerated on pre-commit when `src/` changes (requires Graphviz).

## Security

- **npm audit:** `npm audit --audit-level=high` (blocking in CI `audit` job).
- **osv-scanner:** locally `npm run osv` (blocking) / `npm run osv:html` → `reports/osv-report.html`; in CI via `google/osv-scanner-action@v2` → `reports/osv.sarif` → GitHub Security > Code scanning.
- **secretlint:** `npm run secretlint` / `npm run secretlint:mask` using `@secretlint/secretlint-rule-preset-recommend` (see [.secretlintrc.json](./.secretlintrc.json)). Also runs on every commit via lint-staged — never commit secrets, tokens, or credentials.
- **lockfile-lint:** `npm run lockfile-lint` validates `package-lock.json` (`--allowed-hosts npm --validate-https --validate-integrity --empty-hostname false`).
- **zizmor:** optional `zizmor .` for GitHub Actions hardening.

If you discover a security vulnerability, please open a draft security advisory or contact the maintainers privately instead of filing a public issue.

## Pull Request Process (Code Review Process)

1. **Branch** from `main` with a descriptive name (`feat/…`, `fix/…`, `docs/…`) — see
   [Branch Naming Conventions](#branching-and-workflow-branch-naming-conventions--local-development-workflow).
2. **Develop** with conventional commits (see
   [Commit Message Conventions](#commit-convention-commit-message-conventions)); keep PRs focused.
3. **Quality gate** — before requesting review, ensure:
   - `npm run lint` / `npm run type-check` / `npm run type-check:tests` pass
   - `npm run format:check` passes (`npm run format` to fix)
   - `npm run test:coverage` meets 80% thresholds (see
     [Testing Requirements](#testing-testing-requirements))
   - `npm run docs` regenerated if public API changed (commit `docs/*.md`)
   - `dependency-graph.svg` updated if `src/` structure changed
   - No secrets (`npm run secretlint`), no lockfile issues (`npm run lockfile-lint`)
4. **Push** and open a PR targeting `main`. Link any related issue (`Fixes #123`). Fill in the PR description — what changed and why.
5. **CI must pass:** `check` (lint/spell/secretlint/format/type-check/coverage/knip/depcruise), `commitlint`, and `audit` (npm audit + osv-scanner SARIF + depcruiser HTML artifact).
6. **Review (Code Review Process):** address feedback with new commits (or fixup + rebase at maintainer discretion). Maintainers squash or rebase on merge. At least one maintainer review is required.
7. **After merge to `main`:** `release.yml` runs `quality` → `build` → `semantic-release` automatically.

## Release

Releases are fully automated by [semantic-release](https://semantic-release.org) on `push` to `main` (see [.releaserc.json](./.releaserc.json) and [.github/workflows/release.yml](./.github/workflows/release.yml)):

- Commit messages drive versioning via `@semantic-release/commit-analyzer` (feat → minor, fix → patch, `BREAKING CHANGE` / `!` → major).
- Changelog updated in [CHANGELOG.md](./CHANGELOG.md) (`@semantic-release/changelog`).
- No npm publish (`npmPublish: false`, `private: true`) — package is not published. `@semantic-release/git` commits `package.json` + `CHANGELOG.md` with `chore(release): ${version} [skip ci]`.
- The `docs: regenerate docs [skip ci]` commit from the `docs` job is skipped by CI (`[skip ci]`).

Preview locally:

```bash
npm run release:dry
```

## Communication Channels

<!--
  Replace [OWNER]/[REPO] with your paths. Enable Discussions in repo settings if needed.
  Remove lines that don't apply.
-->

- **Questions / Ideas:** [GitHub Discussions](https://github.com/[OWNER]/[REPO]/discussions)
- **Bugs / Features:** [Issue tracker](https://github.com/[OWNER]/[REPO]/issues/new/choose)
- **Security (private):** see [Security](#security)

## Reporting Issues

<!--
  Replace [OWNER]/[REPO] with your path.
-->

- **Bug reports / feature requests:** open an issue at `https://github.com/[OWNER]/[REPO]/issues/new/choose` with a clear title, reproduction steps, expected vs. actual behavior, and environment (Node/npm/OS).
- **Questions / ideas:** use GitHub Discussions at `https://github.com/[OWNER]/[REPO]/discussions` if enabled.
- Search existing issues first to avoid duplicates.

## License

<!--
  Replace [LICENSE_NAME] and holder. Keep ISC if unchanged.
-->

Distributed under the [LICENSE_NAME](./LICENSE). By contributing you agree your contributions are licensed under the same terms. See `LICENSE` for details.

---

Thanks for contributing!

<!--
  Replace [OWNER]/[REPO] with your path for the contributor image.
-->

![Contributors](https://contrib.rocks/image?repo=[OWNER]/[REPO])
