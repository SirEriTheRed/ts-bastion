<!--
SPDX-FileCopyrightText: 2026 ts-bastion contributors
SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>

SPDX-License-Identifier: MIT
-->

# Contributing to TS Bastion

How to set up a dev environment, what conventions the checks enforce, and how to get a
change merged. By contributing you agree that your contributions are licensed under the
[MIT License](./LICENSE). The [Code of Conduct](./CODE_OF_CONDUCT.md) applies to everyone
participating here; report problems privately to <azelann.borde@gmail.com> or through a
draft security advisory.

This guide covers two audiences: people contributing to the template itself, and people
bootstrapping their own project from it. The bootstrap notes are marked where they apply.

## Setup

- Node.js `>=22` (`.nvmrc` pins the LTS I use), npm `>=10`, Git `>=2.40`

```bash
git clone https://github.com/SirEriTheRed/ts-bastion.git
cd ts-bastion
npm install

npm run type-check
npm run lint
npm test
```

A few scripts need binaries that aren't npm packages (`osv-scanner`, `zizmor`, Graphviz).
The README's prerequisites table lists what each one is for. CI installs its own copies,
so you only need them locally when you run the matching script.

If you are bootstrapping a new project from this template instead of contributing to it:
update the `name` in `package.json`, the title and badge URLs in `README.md`, and the
`LICENSE` holder. Then reset history (`rm -rf .git && git init`, first commit, push to
your own remote). The README quick start walks through it.

## Workflow

- Branch from `main`: `feat/…`, `fix/…`, `docs/…`, `chore/…`. Pull latest `main` first.
- Keep PRs to one concern. Include tests and doc updates when they apply.
- Rebase on `main` now and then so conflicts don't pile up.

First time contributing anywhere on GitHub? [Fork a repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
and [How to Contribute to an Open Source Project on GitHub](https://opensource.guide/how-to-contribute/)
cover the mechanics.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint in the
`commit-msg` hook and again in CI. Format: `<type>(<scope>): <description>` with types like
`feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `chore`. A `!` or a `BREAKING CHANGE:`
footer means a major version bump.

```bash
feat: add pagination to list endpoint
fix(api): handle null cursor in search
docs: clarify release notes section
```

If you'd rather answer prompts than remember the format, `npm run commit` opens an
interactive helper.

## Code style

ESLint (strict, type-checked), Prettier, and tsconfig do most of the enforcing. The
configs are the source of truth: [eslint.config.js](./eslint.config.js),
[tsconfig.json](./tsconfig.json), and [docs/tooling.md](docs/tooling.md) for the summary.
The things that catch people first:

- Filenames are `kebab-case`.
- No default exports.
- Type-only imports use `import type`; relative imports need `.js` extensions
  (`verbatimModuleSyntax`).
- Import order: builtin, external, internal, parent, sibling, index; grouped and alphabetized.
- `exactOptionalPropertyTypes`: you can't assign `undefined` to an optional property.
- `noUncheckedIndexedAccess`: `array[i]` is `T | undefined`.
- `skipLibCheck` is `false`, so `node_modules` types are checked too.
- Functions get verb prefixes (`get`, `create`, `handle`, …) and names stay verbose;
  abbreviations beyond `i` and `j` fail lint.
- Tests are type-checked by [tsconfig.test.json](./tsconfig.test.json), not the main config
  (`npm run type-check:tests`).

## Hooks

Husky installs them on `npm install`. lint-staged runs on what's staged: ESLint + Prettier
on `*.{js,ts,md}`, Prettier on `*.json`, type-check on `.ts`, lockfile-lint on
`package-lock.json`, secretlint on everything. If `src/` or `.dependency-cruiser.cjs` is
staged and Graphviz is installed, `dependency-graph.svg` is regenerated and re-staged.
`commit-msg` runs commitlint; `pre-push` runs `npm run check`, build, and tests.

`--no-verify` exists, but the same checks run in CI anyway.

## Before you push

```bash
npm run check              # lint, package lint, type checks, format, filenames, knip, depcruise
npm run test:coverage      # 80% thresholds enforced
npm run lint:spell
npm run secretlint
```

That's close enough to what CI runs. The full list lives in
[docs/tooling.md](docs/tooling.md) and `.github/workflows/quality.yml`. Optional deeper
audits (`osv`, `zizmor`, `audit:signatures`) are documented there too.

## Tests and docs

- Tests live in `tests/**/*.test.ts` and use Vitest globals (`describe`/`it`/`expect`
  without imports). New features should come with tests; `npm run test:coverage` is the
  gate.
- Public API changes need TSDoc comments (`tsdoc/syntax` is an error when missing or
  wrong) and a regenerated API reference: `npm run docs`, then commit `docs/api/`.
  Releases regenerate it automatically, but don't leave it stale in a PR that changes the
  API.
- Hand-written guides live in `docs/` (see `docs/tooling.md`). Never edit `docs/api/` by
  hand; it gets wiped and rebuilt.
- Structural changes to `src/` refresh `dependency-graph.svg` through the pre-commit hook,
  or run `npm run depcruise:graph` yourself.

## Pull requests

1. Open the PR against `main`, link the issue it closes, and say what changed and why.
2. CI has to pass: the `check`, `commitlint`, and `audit` jobs.
3. Review feedback lands as new commits; maintainers squash on merge.

## Security

Dependency and supply-chain checks run in CI (`npm audit`, osv-scanner, lockfile-lint,
secretlint) and some have local scripts; [docs/tooling.md](docs/tooling.md) covers which
is which. If you find a vulnerability, do not open a public issue: see
[SECURITY.md](./SECURITY.md).

## Releases

Pushes to `main` with releasable commits trigger `release.yml`: version from commit
messages, changelog update, Sigstore attestations for `dist/**` and the SBOMs, and a
`release/vX.Y.Z` branch with a one-click PR link in the workflow summary. A human opens
that PR and merges it once checks are green; the release job then tags and publishes the
GitHub release. npm publishing is off by default (`private: true`, `npmPublish: false`);
the README explains what flipping it on takes. Preview any time with
`npm run release:dry`.

## Where to ask

- Bugs and feature requests: [issues](https://github.com/SirEriTheRed/ts-bastion/issues)
- Questions and ideas: [discussions](https://github.com/SirEriTheRed/ts-bastion/discussions)
- Security: [SECURITY.md](./SECURITY.md), privately

Search existing issues before opening a new one. For bugs, include reproduction steps,
expected vs actual behavior, and your Node/npm/OS versions.

## License

[MIT](./LICENSE). Contributing means your contributions are under the same terms.
