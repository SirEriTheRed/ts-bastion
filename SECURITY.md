<!--
SPDX-FileCopyrightText: 2026 ts-bastion contributors
SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>

SPDX-License-Identifier: MIT
-->

# Security Policy

## Supported versions

Only the latest `main` is supported. Older tags exist for reference but don't get patches.

## Reporting a vulnerability

Don't open a public issue. Report privately so it can be fixed before disclosure:

- Preferred: a [draft security advisory](https://github.com/SirEriTheRed/ts-bastion/security/advisories/new)
- Alternative: email <azelann.borde@gmail.com>

Include the affected version or commit, how to reproduce it, the impact, and anything
you've already figured out about mitigation.

I'll acknowledge receipt within 2 business days and share a plan and timeline. I ask for
a 90-day coordinated disclosure window while a fix is prepared. Credit goes to you if you
want it.

While waiting, please don't touch data that isn't yours and don't run denial-of-service
tests against this project or its users.

## What runs automatically

CI covers the usual supply-chain ground: `npm audit` (blocking on high for production
deps, critical for the full tree), osv-scanner uploaded to code scanning, lockfile-lint,
and secretlint on every commit. Local scripts for the same checks are listed in
[docs/tooling.md](docs/tooling.md); vulnerability reports from humans still go through the
channels above.
