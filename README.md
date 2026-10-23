<!--
SPDX-FileCopyrightText: 2026 ts-bastion contributors
SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>

SPDX-License-Identifier: MIT
-->

<div align="center">

<img src=".github/assets/logo.svg" alt="TS Bastion Logo" width="100%" />

# TS Bastion

The strict TypeScript starter I use as the base for my own projects, and that anyone else
is welcome to clone. Zero runtime dependencies, and everything else is already wired:
strict `tsconfig`, ESLint + Prettier, Vitest with coverage thresholds, pre-commit hooks,
CI workflows, release automation, and supply-chain checks. It reads like a lot because it
is meant to be a lot: a fresh clone should be close to what a real project needs, so you
start by writing code instead of assembling config. The strictness is deliberate. If it
feels heavy, the knobs are in `tsconfig.json` and `eslint.config.js`.

[![build](https://img.shields.io/github/actions/workflow/status/SirEriTheRed/ts-bastion/quality.yml?branch=main)](https://github.com/SirEriTheRed/ts-bastion/actions)
[![node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)
[![license](https://img.shields.io/github/license/SirEriTheRed/ts-bastion)](./LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/SirEriTheRed/ts-bastion/badge)](https://scorecard.dev/viewer/?uri=github.com/SirEriTheRed/ts-bastion)
[![REUSE status](https://api.reuse.software/badge/github.com/SirEriTheRed/ts-bastion)](https://api.reuse.software/info/github.com/SirEriTheRed/ts-bastion)

</div>

## Quick start

```bash
git clone https://github.com/SirEriTheRed/ts-bastion.git my-project
cd my-project

# Rename for your project:
# - package.json "name"
# - README title + the [owner]/[repo] URLs in the badges
# - LICENSE holder if it isn't you yet

npm install
npm run build
npm test
```

When you're happy, reset the git history and push to your own remote:

```bash
rm -rf .git && git init && git add . && git commit -m "feat: initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

The only placeholder is `logHello()` in `src/index.ts`. Replace it with your public API.

## Commands you'll actually use

| Command                 | What it does                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run dev`           | `tsc --watch` while you work                                                                    |
| `npm run build`         | compile `src/` to `dist/`                                                                       |
| `npm test`              | run the tests once (Vitest)                                                                     |
| `npm run test:coverage` | run tests with coverage; 80% thresholds are enforced                                            |
| `npm run lint`          | ESLint; add `:fix` to autofix                                                                   |
| `npm run format`        | Prettier, write mode                                                                            |
| `npm run check`         | the local stand-in for the CI gate: lint, types, format, filenames, dead code, dependency rules |
| `npm run release:dry`   | preview what semantic-release would do, without publishing                                      |

Every script, when to reach for it, and what breaks if you remove the tool behind it is
in [docs/tooling.md](docs/tooling.md).

## Prerequisites

- Node.js `>=22` (`.nvmrc` pins the LTS I develop against), npm `>=10`
- Git

A few scripts shell out to binaries that aren't npm packages. CI installs its own copies;
locally you only need them when you run the matching script:

| Tool                             | Needed for                     |
| -------------------------------- | ------------------------------ |
| `osv-scanner` (Go to install it) | `npm run osv`, `osv:html`      |
| `zizmor`                         | `npm run zizmor`               |
| `actionlint`                     | `npm run actionlint`           |
| `reuse`                          | `npm run reuse`                |
| Graphviz (`dot`)                 | `npm run depcruise:graph`      |
| Docker                           | the `*:docker` script variants |

## What CI runs

`quality.yml` (PRs to `main`, pushes to `develop`): REUSE headers, lockfile lint, ESLint,
package.json lint, filename lint, spell check, secret scan, Prettier, editorconfig, package
sort, type checks for source and tests, `test:coverage`, knip, dependency-cruiser.
Commit messages are validated by commitlint. A separate audit job runs `npm audit`,
osv-scanner (SARIF uploaded to code scanning), and uploads SBOM artifacts.

Other workflows lint the workflow files themselves (actionlint, zizmor), run CodeQL with
`security-extended`, and publish an OpenSSF Scorecard.

These jobs fail their own runs. Whether any of them block a merge is branch protection
config on your GitHub repo, not something the template can set for you.

## Publishing and provenance

Out of the box this repo does not publish to npm: `package.json` has `private: true` and
`.releaserc.json` has `npmPublish: false`. Releases still happen on push to `main`.
semantic-release opens a `release/vX.Y.Z` branch and prints a one-click PR link in the
workflow summary. You open that PR (a bot-created one wouldn't trigger the required
checks), merge it once green, and the release job tags, updates the changelog, and
attests `dist/**` plus the SBOMs with Sigstore via `actions/attest-build-provenance`.
Check an attestation with:

```bash
gh attestation verify --owner <owner> dist/index.js
```

If you want to publish to npm with provenance, three manual steps:

1. `package.json`: set `private` to `false`.
2. `.releaserc.json`: set `npmPublish` to `true` (or delete the option; `true` is the default).
3. On npmjs.com, add a Trusted Publisher pointing at this repo and `release.yml`.
   Releases then publish through OIDC with npm provenance. No `NPM_TOKEN` needed.

Steps 1 and 2 are in the repo. Step 3 lives on npm's side and can only be done by hand.

## Documentation

- [docs/](./docs) — hand-written guides, starting with the [tooling reference](docs/tooling.md)
- `docs/api/` — API reference generated from TSDoc (`npm run docs`); regenerate and commit
  it when the public API changes. Releases regenerate it automatically.
- `reports/docs/` — the same docs as a browsable HTML site (`npm run docs:html`, gitignored)
- [`dependency-graph.svg`](./dependency-graph.svg) at the root (`npm run depcruise:graph`,
  also refreshed by the pre-commit hook when `src/` changes)

## Contributing

Setup, conventions, and the PR flow are in [CONTRIBUTING.md](./CONTRIBUTING.md); the rules
of the road are in the [Code of Conduct](./CODE_OF_CONDUCT.md). Commit messages follow
conventional commits, and `npm run commit` walks you through one.

### Contributors

![Contributors](https://contrib.rocks/image?repo=SirEriTheRed/ts-bastion)

## Contact

- Discord: `@sirerithered`
- GitHub: [SirEriTheRed](https://github.com/SirEriTheRed)
- Issues: [SirEriTheRed/ts-bastion/issues](https://github.com/SirEriTheRed/ts-bastion/issues)
- Discussions: [SirEriTheRed/ts-bastion/discussions](https://github.com/SirEriTheRed/ts-bastion/discussions)

## License

[MIT](./LICENSE)
