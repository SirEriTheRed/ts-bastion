<!--
SPDX-FileCopyrightText: 2026 ts-bastion contributors
SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>

SPDX-License-Identifier: MIT
-->

# TODO — suppressed dependency findings

The entries below are suppressed in `osv-scanner.toml` because they **cannot be
fixed in this repo today**. The CI osv step is non-blocking (`continue-on-error`)
so they never gate a merge; the prod-high and full-tree-critical `npm audit`
steps in the Audit job still do.

## When any entry gets fixed (self-cleaning signal)

1. osv-scanner prints **`osv-scanner.toml has unused ignores`** for the stale
   ID — that is the trigger: delete the entry from `osv-scanner.toml`, then
   delete its row here.
2. Check a bundled version any time:
   `node -p "require('./node_modules/npm/node_modules/undici/package.json').version"`
3. Nothing else to do — CI and SARIF update themselves on the next scan.

## undici 6.29.0 — bundled inside `node_modules/npm` (`inBundle: true`)

- GHSAs: `GHSA-xjj6-f33q-929c`, `GHSA-2m5v-pch6-74hx`, `GHSA-qrxm-fqhp-jwvm`,
  `GHSA-4qv8-2p9j-2685`, `GHSA-9fm3-97px-rjf6` (3 high, 2 moderate)
- Fixed in **6.29.1**. Root `overrides` / `npm audit fix` / `npm update undici`
  cannot reach a bundled subtree (verified).
- **No npm release ships the fix**: `npm@11.21.1` _and_ `npm@12.2.1` both bundle
  undici 6.29.0.
- **What unblocks the fix**: a new npm release bundling undici ≥ 6.29.1, plus a
  `@semantic-release/npm` release whose range admits it (today `npm: ^11.6.2`,
  so only npm 11.x). Then the next `npm update` / dependency PR swaps it and the
  five GHSAs above stop matching.

## Other bundled / major-bump-only findings

| Package      | Version                                                                     | GHSAs                 | Why not fixable here                                                      |
| ------------ | --------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------- |
| `ip-address` | 10.7.2 (bundled)                                                            | `GHSA-rxp7-6hxx-x8q5` | fixed 10.7.4, bundled subtree unreachable                                 |
| `glob`       | 13.0.6 (bundled)                                                            | `GHSA-3g3m-2fjr-6pw4` | fix is semver-major 14.0.2, bundled subtree unreachable                   |
| `minimatch`  | 10.2.5 (bundled), 10.2.6 (eslint stack), 3.1.5 (commitizen/license-checker) | `GHSA-g3hv-75wg-m249` | fix is semver-major 11.0.1 across dev tooling                             |
| `katex`      | 0.16.47                                                                     | `GHSA-238p-pmpm-9mq7` | `micromark-extension-math@3.1.0` pins `katex ^0.16.0`; fix only in 0.18.2 |

Same signal as above: once a row's packages are no longer flagged, drop the
`[[IgnoredVulns]]` entry and the row.
