<!--
SPDX-FileCopyrightText: 2026 ts-bastion contributors
SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>

SPDX-License-Identifier: MIT
-->

# Tooling reference

Every script in `package.json`, grouped by what you're trying to do. The exact command
lines live in `package.json`; this file is about when to run them and why they exist.
Scripts that need a binary outside npm are listed in the README's prerequisites table.

## Build and watch

| Script             | When                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `build`            | Compile `src/` to `dist/`. Run before packing or when you want a fresh build.               |
| `dev`              | Same as build, in watch mode. Use while developing.                                         |
| `clean`            | Delete `dist/`. When a build looks stale.                                                   |
| `cleanup`          | Delete `dist/`, `reports/`, caches, and tsbuildinfo. When everything generated needs to go. |
| `type-check`       | `tsc --noEmit` on source only. Faster than a full build.                                    |
| `type-check:tests` | Type-check source and tests together. CI runs both; run this before pushing test changes.   |

## Lint and format

| Script                           | When                                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `lint` / `lint:fix`              | ESLint over the repo. `:fix` applies what it can autofix.                                                                             |
| `format` / `format:check`        | Prettier write or verify. `:check` is what CI runs.                                                                                   |
| `lint:package`                   | Lint `package.json` itself (npm-package-json-lint).                                                                                   |
| `package:sort`                   | Normalize `package.json` key order. CI checks this with `--check`.                                                                    |
| `lint:spell`                     | cspell over source and docs. Run after writing prose or new identifiers.                                                              |
| `ls-lint`                        | Filename and directory naming (kebab-case).                                                                                           |
| `editorconfig`                   | Whitespace, EOL, charset rules from `.editorconfig`. Docker variant exists if you don't want the local binary.                        |
| `lockfile-lint`                  | Verify `package-lock.json` only references the npm registry over HTTPS with intact integrity hashes. Run after touching dependencies. |
| `secretlint` / `secretlint:mask` | Scan the tree for committed secrets. `:mask` hides matches in the output. Run before pushing anything that came from elsewhere.       |

`npm run check` chains the local stand-in for the CI gate: lint, package lint, both type
checks, format check, editorconfig, ls-lint, knip, and depcruise. Run it before you push
if you don't want to wait for CI to tell you.

## Test

| Script                | When                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `test`                | Run the suite once.                                                                                           |
| `test:watch`          | Watch mode while writing tests.                                                                               |
| `test:ui`             | Browser UI for browsing and running tests.                                                                    |
| `test:coverage`       | Suite with coverage. The 80% thresholds (lines, functions, branches, statements) are enforced here and in CI. |
| `test:coverage:watch` | Coverage in watch mode.                                                                                       |

There is no static coverage badge on purpose. The real number comes from
`test:coverage`, and CI fails if it drops below the thresholds.

## Dead code and dependencies

| Script                   | When                                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `knip` (alias `analyze`) | Find unused files, exports, and dependencies. Run before releases and when something "feels dead".                                  |
| `depcruise`              | Enforce dependency rules: no circular imports, no orphans, nothing imported that isn't in `package.json`.                           |
| `depcruise:html`         | Same rules, HTML report under `reports/depcruiser/` for browsing.                                                                   |
| `depcruise:graph`        | Regenerate the committed `dependency-graph.svg`. Needs Graphviz. The pre-commit hook does this automatically when `src/` is staged. |
| `licenses`               | List licenses across dependencies. When reviewing what you're taking on.                                                            |

## Security and supply chain

| Script                               | When                                                                                                                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `osv`                                | Vulnerability scan of dependencies against the OSV database. Exits non-zero on findings. Needs the local `osv-scanner` binary; in CI the scanner runs from its own action and uploads SARIF. |
| `osv:html`                           | Same scan, HTML report in `reports/`. `:force` variant keeps going after findings so you can still read the report.                                                                          |
| `audit:signatures`                   | Verify Sigstore signatures on installed packages. `:warn` variant never fails, which is how CI runs it.                                                                                      |
| `sbom`, `sbom:cyclonedx`, `sbom:all` | Generate SBOMs (SPDX and/or CycloneDX) into `reports/sbom/`. `sbom:all` does both. CI uploads them as artifacts; releases attest them.                                                       |
| `zizmor`, `zizmor:sarif`             | Audit the GitHub Actions workflows for unsafe patterns. Needs the local binary; CI runs its own copy and uploads SARIF to code scanning.                                                     |
| `actionlint`, `actionlint:docker`    | Lint the workflow files (plus shellcheck). The `:docker` variant avoids installing Go.                                                                                                       |
| `codeql`                             | Run CodeQL queries locally through `scripts/codeql-scan.sh`. CI runs the same analysis with `security-extended`.                                                                             |
| `reuse`, `reuse:annotate`            | Check that every file carries SPDX copyright and license headers. `:annotate` adds missing headers to tracked files; review the diff before committing it.                                   |

CI also runs `npm audit` (high on production deps, critical on the full tree). That one
has no local script; run `npm audit` yourself when you want it.

## Documentation

| Script       | When                                                                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs`       | Regenerate the markdown API reference into `docs/api/` from TSDoc comments. Commit the result when the public API changes. Releases do this automatically. Never hand-edit `docs/api/`; it gets wiped and rebuilt. Hand-written guides live next to it in `docs/`. |
| `docs:html`  | Browsable HTML site into `reports/docs/`. For reading locally.                                                                                                                                                                                                     |
| `docs:watch` | Regenerate on change while writing TSDoc.                                                                                                                                                                                                                          |

## Git and release

| Script        | When                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `commit`      | Interactive prompt that builds a conventional commit message. Easier than remembering the format. |
| `release`     | Run semantic-release locally. Almost never needed; CI does this on `main`.                        |
| `release:dry` | Preview the next version and notes without releasing.                                             |
| `prepare`     | Installs the husky hooks. Runs automatically on `npm install`.                                    |

Releases: on a push to `main` that has releasable commits, `release.yml` opens a
`release/vX.Y.Z` branch and prints a PR link in the run summary. A human opens the PR
(a bot-created one would not trigger the required checks), the release job tags,
updates the changelog, and attests `dist/**` plus the SBOMs. Publishing to npm is off
by default; see the README for the three manual steps to enable it.

## Conventions

- Filenames: kebab-case, enforced by ls-lint and `unicorn/filename-case`.
- No default exports (`import/no-default-export`).
- Type-only imports use `import type` (`consistent-type-imports`). Relative imports
  carry `.js` extensions (`verbatimModuleSyntax`).
- Import order: builtin, external, internal, parent, sibling, index; grouped and alphabetized.
- `tsconfig.json` turns on `strict`, `exactOptionalPropertyTypes`,
  `noUncheckedIndexedAccess`, and `skipLibCheck: false`. Tests are checked by
  `tsconfig.test.json` instead of the main config.
- Commit messages: conventional commits. CI validates the range with commitlint.
- Every file carries an SPDX header (REUSE). New files get annotated by the pre-commit
  hook when `reuse` is installed; CI fails without them either way.

## Generated output layout

```text
dist/                        ← build output (npm run build)
reports/                     ← gitignored; wiped by npm run cleanup
├── coverage/                ← vitest HTML coverage
├── sbom/                    ← SPDX + CycloneDX SBOMs
├── osv-report.html          ← local osv-scanner HTML report
├── zizmor.sarif             ← local zizmor SARIF preview
├── docs/                    ← TypeDoc HTML site
└── depcruiser/              ← dependency-cruiser HTML report
docs/api/                    ← generated markdown API reference (committed)
dependency-graph.svg         ← committed, regenerated on pre-commit
```

## CI workflows

The full pipeline description lives in `AGENTS.md` and the files under
`.github/workflows/`. In short: `quality.yml` runs the checks above on PRs to `main`
and pushes to `develop`; `release.yml` handles releases; `actionlint.yml`, `zizmor.yml`,
`codeql.yml`, and `scorecard.yml` audit the workflows and the code itself.
